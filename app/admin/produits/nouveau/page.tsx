// ─────────────────────────────────────────────
// CHEMIN : app/admin/produits/nouveau/page.tsx
// ─────────────────────────────────────────────
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, Save, Upload, X, Plus, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

interface Category { id: string; name: string }

export default function NouveauProduitPage() {
  const router = useRouter()

  const [categories,    setCategories]    = useState<Category[]>([])
  const [images,        setImages]        = useState<File[]>([])
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [newCatMode,    setNewCatMode]    = useState(false)
  const [newCatName,    setNewCatName]    = useState('')
  const [addingCat,     setAddingCat]     = useState(false)

  const [form, setForm] = useState({
    name: '', slug: '', description: '',
    price: '', compare_price: '', category_id: '',
    stock: '0', is_active: true, is_featured: false, is_new: false, tags: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name')
    if (data) setCategories(data)
  }

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: slugify(name) }))
  }

  // Créer une nouvelle catégorie directement
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return
    setAddingCat(true)
    const slug = slugify(newCatName)
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newCatName.trim(), slug, position: categories.length + 1, is_active: true })
      .select().single()

    if (data) {
      setCategories(prev => [...prev, { id: data.id, name: data.name }])
      setForm(f => ({ ...f, category_id: data.id }))
      setNewCatMode(false)
      setNewCatName('')
    }
    setAddingCat(false)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) { setError('Nom et prix obligatoires.'); return }
    setLoading(true); setError('')

    const { data: product, error: e } = await supabase.from('products').insert({
      name: form.name, slug: form.slug || slugify(form.name),
      description: form.description || null,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      category_id: form.category_id || null,
      stock: Number(form.stock),
      is_active: form.is_active, is_featured: form.is_featured, is_new: form.is_new,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }).select().single()

    if (e || !product) { setError(e?.message || 'Erreur'); setLoading(false); return }

    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const ext  = file.name.split('.').pop()
      const path = `${product.id}/${Date.now()}_${i}.${ext}`
      const { data: up } = await supabase.storage.from('products').upload(path, file)
      if (up) {
        const { data: url } = supabase.storage.from('products').getPublicUrl(path)
        await supabase.from('product_images').insert({ product_id: product.id, url: url.publicUrl, position: i })
      }
    }

    router.push('/admin/produits')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #F0C0D4', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }
  const cardStyle:  React.CSSProperties = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid #eee', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,.04)' }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button type="button" onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#aaa', fontSize: 13, padding: 0, fontFamily: 'inherit' }}>
          <ChevronLeft size={15} /> Retour
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>Nouveau produit</h1>
      </div>

      {/* Infos */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: '#333' }}>Informations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Nom du produit *</label>
            <input value={form.name} onChange={e => handleNameChange(e.target.value)} style={inputStyle} placeholder="Ex: Valise à roulettes rose" />
          </div>
          <div>
            <label style={labelStyle}>Slug (URL automatique)</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, color: '#888' }} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }} rows={3} placeholder="Décrivez le produit..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Prix (FCFA) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} placeholder="25000" />
            </div>
            <div>
              <label style={labelStyle}>Prix barré (FCFA)</label>
              <input type="number" value={form.compare_price} onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))} style={inputStyle} placeholder="Optionnel" />
            </div>
            <div>
              <label style={labelStyle}>Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tags (virgules)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={inputStyle} placeholder="rose, design" />
            </div>
          </div>

          {/* ── CATÉGORIE avec création inline ── */}
          <div>
            <label style={labelStyle}>Catégorie</label>
            {newCatMode ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Nom de la nouvelle catégorie"
                  autoFocus
                />
                <button type="button" onClick={handleAddCategory} disabled={addingCat || !newCatName.trim()}
                  style={{ padding: '10px 16px', background: '#C85B80', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, opacity: addingCat ? .7 : 1 }}>
                  <Check size={14} /> {addingCat ? '...' : 'Créer'}
                </button>
                <button type="button" onClick={() => { setNewCatMode(false); setNewCatName('') }}
                  style={{ padding: '10px 12px', background: 'transparent', color: '#aaa', border: '1.5px solid #eee', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  style={{ ...inputStyle, flex: 1, background: 'white', cursor: 'pointer' }}>
                  <option value="">— Choisir une catégorie —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="button" onClick={() => setNewCatMode(true)}
                  style={{ padding: '10px 14px', background: '#FCE8F0', color: '#C85B80', border: '1.5px solid #F0C0D4', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                  <Plus size={14} /> Nouvelle
                </button>
              </div>
            )}
            <p style={{ fontSize: 11.5, color: '#bbb', marginTop: 6 }}>
              Cliquez sur "+ Nouvelle" pour créer une catégorie directement ici
            </p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: '#333' }}>Options</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {([
            ['is_active',   'Produit actif (visible en boutique)'],
            ['is_featured', "Produit vedette (affiché en page d'accueil)"],
            ['is_new',      'Nouveau produit (badge Nouveau)'],
          ] as const).map(([key, label]) => (
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

      {/* Images */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: '#333' }}>Images du produit</h2>
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #F0C0D4', borderRadius: 12, padding: '28px 16px', cursor: 'pointer', transition: 'background .2s' }}>
          <Upload size={28} color="#C85B80" style={{ marginBottom: 10 }} />
          <span style={{ fontSize: 14, color: '#777', fontWeight: 500 }}>Cliquez pour ajouter des images</span>
          <span style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>JPG, PNG, WEBP — 5 Mo max par image</span>
          <input type="file" multiple accept="image/*" style={{ display: 'none' }}
            onChange={e => setImages(Array.from(e.target.files || []))} />
        </label>
        {images.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10, marginTop: 14 }}>
            {images.map((f, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', background: '#f5f5f5' }}>
                <img src={URL.createObjectURL(f)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,.55)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p style={{ color: '#ef4444', background: '#fef2f2', borderRadius: 10, padding: '10px 16px', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <button type="button" onClick={handleSubmit} disabled={loading}
        style={{ width: '100%', padding: '15px 0', background: loading ? '#e0a0b8' : '#C85B80', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginBottom: 32, transition: 'background .2s' }}>
        <Save size={16} /> {loading ? 'Création en cours...' : 'Créer le produit'}
      </button>
    </div>
  )
}