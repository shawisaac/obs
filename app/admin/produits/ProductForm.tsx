// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/produits/ProductForm.tsx
// Formulaire ajout/modification produit (client)
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Upload, X, ChevronLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import type { Category, Product } from '@/types'

interface Props {
  categories: Category[]
  product?: Product
}

export default function ProductForm({ categories, product }: Props) {
  const router  = useRouter()
  const editing = !!product

  const [form, setForm] = useState({
    name:          product?.name          || '',
    slug:          product?.slug          || '',
    description:   product?.description   || '',
    price:         product?.price         || 0,
    compare_price: product?.compare_price || '',
    category_id:   product?.category_id   || '',
    stock:         product?.stock         || 0,
    is_active:     product?.is_active     ?? true,
    is_featured:   product?.is_featured   ?? false,
    is_new:        product?.is_new        ?? false,
    tags:          product?.tags?.join(', ') || '',
  })

  const [images,  setImages]  = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: editing ? f.slug : slugify(name) }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) { setError('Nom et prix sont obligatoires.'); return }
    setLoading(true); setError('')

    const payload = {
      name:          form.name,
      slug:          form.slug || slugify(form.name),
      description:   form.description || null,
      price:         Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      category_id:   form.category_id || null,
      stock:         Number(form.stock),
      is_active:     form.is_active,
      is_featured:   form.is_featured,
      is_new:        form.is_new,
      tags:          form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    let productId = product?.id

    if (editing) {
      const { error: e } = await supabase.from('products').update(payload).eq('id', product!.id)
      if (e) { setError(e.message); setLoading(false); return }
    } else {
      const { data, error: e } = await supabase.from('products').insert(payload).select().single()
      if (e || !data) { setError(e?.message || 'Erreur'); setLoading(false); return }
      productId = data.id
    }

    // Upload images
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const ext  = file.name.split('.').pop()
      const path = `${productId}/${Date.now()}_${i}.${ext}`
      const { data: uploaded } = await supabase.storage.from('products').upload(path, file)
      if (uploaded) {
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(path)
        await supabase.from('product_images').insert({ product_id: productId, url: urlData.publicUrl, position: i })
      }
    }

    router.push('/admin/produits')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-rose-600 transition-colors">
        <ChevronLeft size={15} /> Retour
      </button>

      {/* Infos principales */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card space-y-4">
        <h2 className="font-semibold text-gray-700 mb-2">Informations</h2>
        <div>
          <label className="input-label">Nom du produit *</label>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)} className="input-field" placeholder="Ex: Vase Céramique Perle" />
        </div>
        <div>
          <label className="input-label">Slug (URL)</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="input-field font-mono text-xs" />
        </div>
        <div>
          <label className="input-label">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none" rows={4} placeholder="Décrivez le produit..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Prix (FCFA) *</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="input-field" />
          </div>
          <div>
            <label className="input-label">Prix barré (FCFA)</label>
            <input type="number" value={form.compare_price} onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))} className="input-field" placeholder="Optionnel" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Catégorie</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="input-field cursor-pointer">
              <option value="">— Aucune —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Stock</label>
            <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="input-field" />
          </div>
        </div>
        <div>
          <label className="input-label">Tags (séparés par des virgules)</label>
          <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="input-field" placeholder="déco, rose, artisanal" />
        </div>
      </div>

      {/* Options */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
        <h2 className="font-semibold text-gray-700 mb-4">Options</h2>
        <div className="space-y-3">
          {[
            ['is_active',   'Produit actif (visible en boutique)'],
            ['is_featured', 'Produit vedette (affiché en page d\'accueil)'],
            ['is_new',      'Nouveau produit (badge "Nouveau")'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5.5 rounded-full transition-colors relative ${(form as any)[key] ? 'bg-rose-600' : 'bg-gray-200'}`}
                style={{ width: 40, height: 22 }}
                onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}>
                <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${(form as any)[key] ? 'translate-x-5' : 'translate-x-0.5'}`}
                  style={{ width: 18, height: 18, top: 2, left: (form as any)[key] ? 20 : 2 }} />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
        <h2 className="font-semibold text-gray-700 mb-4">Images</h2>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-rose-200 rounded-xl py-8 cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-colors">
          <Upload size={24} className="text-rose-400 mb-2" />
          <span className="text-sm text-gray-500">Cliquez pour ajouter des images</span>
          <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5 Mo chacune</span>
          <input type="file" multiple accept="image/*" className="hidden"
            onChange={e => setImages(Array.from(e.target.files || []))} />
        </label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {images.map((f, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-4">
        {loading ? 'Enregistrement...' : <><Save size={16} /> {editing ? 'Mettre à jour' : 'Créer le produit'}</>}
      </button>
    </div>
  )
}