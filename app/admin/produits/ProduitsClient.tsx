// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/produits/ProduitsClient.tsx
// Liste des produits — tableau (PC) / cartes (téléphone)
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useIsMobile } from '@/lib/useIsMobile'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

function stockStyle(stock: number): React.CSSProperties {
  if (stock > 5) return { background: '#dcfce7', color: '#15803d' }
  if (stock > 0) return { background: '#fef3c7', color: '#92400e' }
  return { background: '#fee2e2', color: '#991b1b' }
}

export default function ProduitsClient({ initialProducts }: { initialProducts: Product[] }) {
  const isMobile = useIsMobile()
  const [products, setProducts] = useState(initialProducts)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = async (product: Product) => {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return
    setDeleting(id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { alert('Erreur : ' + error.message); setDeleting(null); return }
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const Thumb = ({ p, size }: { p: Product; size: number }) => (
    <div style={{ width: size, height: size, borderRadius: 12, overflow: 'hidden', background: '#FCE8F0', flexShrink: 0 }}>
      {p.images?.[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  )

  const ActiveToggle = ({ p }: { p: Product }) => (
    <button onClick={() => toggleActive(p)} title={p.is_active ? 'Désactiver' : 'Activer'}
      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit', padding: 0, color: p.is_active ? '#16a34a' : '#9ca3af' }}>
      {p.is_active ? <ToggleRight size={22} color="#22c55e" /> : <ToggleLeft size={22} color="#9ca3af" />}
      {p.is_active ? 'Actif' : 'Inactif'}
    </button>
  )

  const iconBtn: React.CSSProperties = { padding: 8, borderRadius: 10, background: '#f5f5f5', border: 'none', cursor: 'pointer', display: 'flex', color: '#777' }

  return (
    <div>
      {/* En-tête */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>Produits</h1>
          <p style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>{products.length} produit{products.length > 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/produits/nouveau"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#C85B80', color: 'white', padding: '11px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      {/* Recherche */}
      <div style={{ position: 'relative', marginBottom: 18, maxWidth: isMobile ? 'none' : 380 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..."
          style={{ width: '100%', border: '1.5px solid #F0C0D4', borderRadius: 10, padding: '10px 12px 10px 36px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
      </div>

      {isMobile === null ? null : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eee', padding: '48px 16px', textAlign: 'center', color: '#bbb', fontSize: 14 }}>
          Aucun produit trouvé
        </div>
      ) : isMobile ? (
        /* ───── CARTES (téléphone) ───── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,.04)', padding: 12, opacity: p.is_active ? 1 : .65 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <Thumb p={p} size={72} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: '#1A1A1A', fontSize: 15, lineHeight: 1.3 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{p.category?.name || 'Sans catégorie'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#C85B80', fontSize: 14 }}>{formatPrice(p.price)}</span>
                    <span style={{ ...stockStyle(p.stock), fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 100 }}>{p.stock} en stock</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5', paddingTop: 10 }}>
                <ActiveToggle p={p} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/admin/produits/${p.id}/modifier`} style={{ ...iconBtn, textDecoration: 'none' }} aria-label="Modifier"><Pencil size={16} /></Link>
                  <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id} style={{ ...iconBtn, color: '#ef4444', background: '#fef2f2' }} aria-label="Supprimer"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ───── TABLEAU (ordinateur) ───── */
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,.04)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f3f3', background: '#fafafa' }}>
                  {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 18px', fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: .8, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f7f7f7' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Thumb p={p} size={44} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 500, color: '#1A1A1A', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                          <p style={{ fontSize: 12, color: '#bbb', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#777', fontSize: 12.5 }}>{p.category?.name || '—'}</td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: '#C85B80', whiteSpace: 'nowrap' }}>{formatPrice(p.price)}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ ...stockStyle(p.stock), fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{p.stock} en stock</span>
                    </td>
                    <td style={{ padding: '12px 18px' }}><ActiveToggle p={p} /></td>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/admin/produits/${p.id}/modifier`} style={{ ...iconBtn, textDecoration: 'none' }} aria-label="Modifier"><Pencil size={15} /></Link>
                        <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id} style={{ ...iconBtn, color: '#ef4444', background: '#fef2f2' }} aria-label="Supprimer"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}