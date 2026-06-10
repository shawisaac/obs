// ─────────────────────────────────────────────
// CHEMIN : app/admin/produits/[id]/modifier/page.tsx
// ─────────────────────────────────────────────
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, Save, Upload, X, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

interface Category    { id: string; name: string }
interface ProductImage { id: string; url: string; position: number }

interface FormState {
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | ''
  category_id: string
  stock: number
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  tags: string
}

export default function ModifierProduitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router  = useRouter()

  const [categories,     setCategories]     = useState<Category[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [newImages,      setNewImages]      = useState<File[]>([])
  const [loading,        setLoading]        = useState(true)
  const [saving,         setSaving]         = useState(false)
  const [deletingImg,    setDeletingImg]    = useState<string | null>(null)
  const [error,          setError]          = useState('')

  const [form, setForm] = useState<FormState>({
    name: '', slug: '', description: '',
    price: 0, compare_price: '',
    category_id: '', stock: 0,
    is_active: true, is_featured: false, is_new: false, tags: '',
  })

  useEffect(() => {
    const load = async () => {
      const [catRes, prodRes, imgRes] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('position'),
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('product_images').select('*').eq('product_id', id).order('position'),
      ])
      if (catRes.data)  setCategories(catRes.data)
      if (imgRes.data)  setExistingImages(imgRes.data)
      if (prodRes.data) {
        const p = prodRes.data
        setForm({
          name: p.name || '', slug: p.slug || '', description: p.description || '',
          price: p.price || 0, compare_price: p.compare_price || '',
          category_id: p.category_id || '', stock: p.stock || 0,
          is_active: p.is_active ?? true, is_featured: p.is_featured ?? false,
          is_new: p.is_new ?? false, tags: (p.tags || []).join(', '),
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  const deleteExistingImage = async (imgId: string, imgUrl: string) => {
    setDeletingImg(imgId)
    await supabase.from('product_images').delete().eq('id', imgId)
    try {
      const path = imgUrl.split('/products/')[1]
      if (path) await supabase.storage.from('products').remove([path])
    } catch {}
    setExistingImages(prev => prev.filter(img => img.id !== imgId))
    setDeletingImg(null)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) { setError('Nom et prix obligatoires.'); return }
    setSaving(true); setError('')

    const { error: e } = await supabase.from('products').update({
      name: form.name, slug: form.slug || slugify(form.name),
      description: form.description || null,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      category_id: form.category_id || null,
      stock: Number(form.stock),
      is_active: form.is_active, is_featured: form.is_featured, is_new: form.is_new,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }).eq('id', id)

    if (e) { setError(e.message); setSaving(false); return }

    const basePosition = existingImages.length
    for (let i = 0; i < newImages.length; i++) {
      const file = newImages[i]
      const ext  = file.name.split('.').pop()
      const path = `${id}/${Date.now()}_${i}.${ext}`
      const { data: up } = await supabase.storage.from('products').upload(path, file)
      if (up) {
        const { data: url } = supabase.storage.from('products').getPublicUrl(path)
        await supabase.from('product_images').insert({ product_id: id, url: url.publicUrl, position: basePosition + i })
      }
    }

    router.push('/admin/produits')
    router.refresh()
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#aaa' }}>Chargement...</div>

  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #F0C0D4', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }
  const cardStyle:  React.CSSProperties = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid #eee', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,.04)' }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#aaa', fontSize: 13, padding: 0, fontFamily: 'inherit' }}>
          <ChevronLeft size={15} /> Retour
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>Modifier le produit</h1>
      </div>

      {/* Infos */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: '#333' }}>Informations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12 }} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Prix FCFA *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Prix barré</label>
              <input
                type="number"
                value={form.compare_price}
                onChange={e => setForm(f => ({ ...f, compare_price: e.target.value === '' ? '' : Number(e.target.value) }))}
                style={inputStyle}
                placeholder="Optionnel"
              />
            </div>
            <div>
              <label style={labelStyle}>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={{ ...inputStyle, background: 'white', cursor: 'pointer' }}>
                <option value="">— Aucune —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tags (virgules)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={inputStyle} placeholder="déco, rose, artisanal" />
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: '#333' }}>Options</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {([
            ['is_active',   'Produit actif']   as const,
            ['is_featured', 'Produit vedette'] as const,
            ['is_new',      'Nouveau produit'] as const,
          ]).map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                style={{ width: 40, height: 22, borderRadius: 100, background: form[key] ? '#C85B80' : '#d1d5db', position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 2, left: form[key] ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,.2)', transition: 'left .2s' }} />
              </div>
              <span style={{ fontSize: 14, color: '#555' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images existantes */}
      {existingImages.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: '#333' }}>Images actuelles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
            {existingImages.map(img => (
              <div key={img.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1', background: '#f5f5f5' }}>
                <Image src={img.url} alt="Image produit" fill style={{ objectFit: 'cover' }} sizes="100px" />
                <button
                  type="button"
                  onClick={() => deleteExistingImage(img.id, img.url)}
                  disabled={deletingImg === img.id}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239,68,68,.85)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {deletingImg === img.id ? '...' : <Trash2 size={12} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ajouter images */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: '#333' }}>Ajouter des images</h2>
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #F0C0D4', borderRadius: 12, padding: '28px 16px', cursor: 'pointer' }}>
          <Upload size={24} color="#C85B80" style={{ marginBottom: 8 }} />
          <span style={{ fontSize: 14, color: '#888' }}>Cliquer pour ajouter des images</span>
          <span style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>JPG, PNG, WEBP — max 5 Mo</span>
          <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => setNewImages(Array.from(e.target.files || []))} />
        </label>
        {newImages.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {newImages.map((f, i) => (
              <div key={i} style={{ position: 'relative', width: 72, height: 72, borderRadius: 10, overflow: 'hidden' }}>
                <img src={URL.createObjectURL(f)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => setNewImages(prev => prev.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: 3, display: 'flex' }}>
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p style={{ color: '#ef4444', background: '#fef2f2', borderRadius: 10, padding: '10px 16px', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <button type="button" onClick={handleSubmit} disabled={saving}
        style={{ width: '100%', padding: '14px 0', background: '#C85B80', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', opacity: saving ? .7 : 1, marginBottom: 32 }}>
        <Save size={16} /> {saving ? 'Enregistrement...' : 'Mettre à jour le produit'}
      </button>
    </div>
  )
}