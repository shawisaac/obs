// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/categories/page.tsx
// ─────────────────────────────────────────────
'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X, GripVertical, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [editing,    setEditing]    = useState<Category | null>(null)
  const [form,       setForm]       = useState({ name: '', slug: '', description: '' })
  const [saving,     setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId,  setConfirmId]  = useState<string | null>(null)

  useEffect(() => { loadCategories() }, [])

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('position')
    setCategories(data || [])
    setLoading(false)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', slug: '', description: '' })
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' })
    setShowForm(true)
  }

  const cancel = () => { setShowForm(false); setEditing(null) }

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: editing ? f.slug : slugify(name) }))
  }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = { name: form.name, slug: form.slug || slugify(form.name), description: form.description || null }
    if (editing) {
      await supabase.from('categories').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('categories').insert({ ...payload, position: categories.length + 1, is_active: true })
    }
    await loadCategories()
    setSaving(false)
    cancel()
  }

  const deleteCategory = async (id: string) => {
    setDeletingId(id)
    await supabase.from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
    setDeletingId(null)
    setConfirmId(null)
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #F0C0D4', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>Catégories</h1>
          <p style={{ fontSize: 13, color: '#aaa' }}>{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <button type="button" onClick={openNew}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#C85B80', color: 'white', border: 'none', borderRadius: 12, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #F0C0D4', padding: 24, marginBottom: 20, boxShadow: '0 4px 20px rgba(200,91,128,.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{editing ? 'Modifier' : 'Nouvelle'} catégorie</h2>
            <button type="button" onClick={cancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Nom *</label>
              <input value={form.name} onChange={e => handleNameChange(e.target.value)} style={inputStyle} placeholder="Ex: Valises" autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Slug</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, color: '#888' }} />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={inputStyle} placeholder="Description courte..." />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={save} disabled={saving || !form.name}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#C85B80', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? .7 : 1 }}>
              <Save size={15} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" onClick={cancel}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#888', border: '1.5px solid #eee', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.04)' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#aaa' }}>Chargement...</div>
        ) : categories.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: '#aaa', marginBottom: 16 }}>Aucune catégorie pour l'instant</p>
            <button type="button" onClick={openNew}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#C85B80', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={15} /> Créer la première
            </button>
          </div>
        ) : (
          <div>
            {categories.map((cat, index) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: index < categories.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <GripVertical size={16} color="#ddd" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>{cat.name}</p>
                  <p style={{ fontSize: 12, color: '#aaa', fontFamily: 'monospace' }}>{cat.slug}</p>
                </div>
                {cat.description && (
                  <p style={{ fontSize: 12.5, color: '#888', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'none' }} className="md:block">
                    {cat.description}
                  </p>
                )}
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: cat.is_active ? '#dcfce7' : '#f3f4f6', color: cat.is_active ? '#16a34a' : '#888' }}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </span>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button type="button" onClick={() => openEdit(cat)}
                    style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid #eee', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all .2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C85B80'; (e.currentTarget as HTMLElement).style.color = '#C85B80' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#eee'; (e.currentTarget as HTMLElement).style.color = '#888' }}>
                    <Pencil size={14} />
                  </button>

                  {/* Bouton supprimer avec confirmation */}
                  {confirmId === cat.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '4px 10px' }}>
                      <AlertTriangle size={13} color="#ef4444" />
                      <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>Supprimer ?</span>
                      <button type="button" onClick={() => deleteCategory(cat.id)} disabled={deletingId === cat.id}
                        style={{ fontSize: 12, color: 'white', background: '#ef4444', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Oui
                      </button>
                      <button type="button" onClick={() => setConfirmId(null)}
                        style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Non
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setConfirmId(cat.id)}
                      style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid #eee', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all .2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#eee'; (e.currentTarget as HTMLElement).style.color = '#888' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}