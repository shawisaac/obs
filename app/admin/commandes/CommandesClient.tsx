// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/commandes/CommandesClient.tsx
// Liste des commandes — tableau (PC) / cartes (téléphone)
// Cliquer sur une commande = voir ce qui a été commandé, avec les images
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { Search, X, Phone, MessageCircle, ChevronRight, MapPin } from 'lucide-react'
import { adminUpdateOrderStatus } from '@/lib/queries'
import { useIsMobile } from '@/lib/useIsMobile'
import { formatPrice, formatDate } from '@/lib/utils'
import { ORDER_STATUS, type Order, type OrderStatus } from '@/types'

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const BADGE: Record<string, { bg: string; fg: string }> = {
  amber:  { bg: '#fef3c7', fg: '#92400e' },
  blue:   { bg: '#dbeafe', fg: '#1e40af' },
  purple: { bg: '#ede9fe', fg: '#6d28d9' },
  indigo: { bg: '#e0e7ff', fg: '#3730a3' },
  green:  { bg: '#dcfce7', fg: '#15803d' },
  red:    { bg: '#fee2e2', fg: '#991b1b' },
}

function waLink(phone: string) {
  let n = phone.replace(/[^0-9]/g, '')
  if (n.length === 10) n = '225' + n   // numéro ivoirien à 10 chiffres
  return `https://wa.me/${n}`
}

export default function CommandesClient({ initialOrders }: { initialOrders: Order[] }) {
  const isMobile = useIsMobile()
  const [orders,   setOrders]   = useState(initialOrders)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<string>('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !search
      || o.customer_name.toLowerCase().includes(q)
      || o.order_number.toLowerCase().includes(q)
      || o.customer_phone.includes(search)
      || (o.items || []).some(i => i.product_name.toLowerCase().includes(q))
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId)
    await adminUpdateOrderStatus(orderId, status)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    setSelected(prev => prev && prev.id === orderId ? { ...prev, status } : prev)
    setUpdating(null)
  }

  const StatusSelect = ({ order }: { order: Order }) => {
    const b = BADGE[ORDER_STATUS[order.status].color] || { bg: '#f3f4f6', fg: '#555' }
    return (
      <select
        value={order.status}
        onClick={e => e.stopPropagation()}
        onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
        disabled={updating === order.id}
        style={{ background: b.bg, color: b.fg, border: 'none', borderRadius: 100, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', maxWidth: '100%' }}
      >
        {STATUS_OPTIONS.map(st => <option key={st} value={st}>{ORDER_STATUS[st].label}</option>)}
      </select>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #F0C0D4', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: 'white' }

  return (
    <div>
      {/* En-tête */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>Commandes</h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>
          {orders.length} commande{orders.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, marginBottom: 18 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? 'none' : 380 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Client, produit, n°..."
            style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ ...inputStyle, width: isMobile ? '100%' : 210, cursor: 'pointer' }}>
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{ORDER_STATUS[s].label}</option>)}
        </select>
      </div>

      {isMobile === null ? null : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eee', padding: '48px 16px', textAlign: 'center', color: '#bbb', fontSize: 14 }}>
          Aucune commande trouvée
        </div>
      ) : isMobile ? (
        /* ───── CARTES (téléphone) ───── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(order => {
            const items = order.items || []
            return (
              <div key={order.id} onClick={() => setSelected(order)}
                style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,.04)', padding: 14, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: '#1A1A1A', fontSize: 15 }}>{order.customer_name}</p>
                    <p style={{ fontSize: 11.5, color: '#aaa', fontFamily: 'monospace', marginTop: 2 }}>{order.order_number}</p>
                  </div>
                  <p style={{ fontWeight: 700, color: '#C85B80', fontSize: 15, whiteSpace: 'nowrap' }}>{formatPrice(order.total)}</p>
                </div>

                {/* Aperçu des articles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ display: 'flex' }}>
                    {items.slice(0, 4).map((it, i) => (
                      <div key={it.id} style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', background: '#FCE8F0', border: '2px solid white', marginLeft: i === 0 ? 0 : -10 }}>
                        {it.product_image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.product_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12.5, color: '#666', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {items.length === 0
                      ? 'Aucun article'
                      : items.map(i => `${i.quantity}× ${i.product_name}`).join(', ')}
                  </p>
                  <ChevronRight size={16} color="#ccc" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <StatusSelect order={order} />
                  <span style={{ fontSize: 11.5, color: '#aaa' }}>{formatDate(order.created_at)}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ───── TABLEAU (ordinateur) ───── */
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,.04)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f3f3', background: '#fafafa' }}>
                  {['N° commande', 'Client', 'Articles commandés', 'Total', 'Statut', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 18px', fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: .8, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const items = order.items || []
                  return (
                    <tr key={order.id} onClick={() => setSelected(order)}
                      style={{ borderBottom: '1px solid #f7f7f7', cursor: 'pointer', verticalAlign: 'top' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fffafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontSize: 12, color: '#777', whiteSpace: 'nowrap' }}>{order.order_number}</td>
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <p style={{ fontWeight: 500, color: '#1A1A1A' }}>{order.customer_name}</p>
                        <p style={{ fontSize: 12, color: '#aaa' }}>{order.customer_phone}</p>
                      </td>
                      <td style={{ padding: '14px 18px', minWidth: 240 }}>
                        {items.length === 0 ? <span style={{ color: '#ccc' }}>—</span> : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {items.map(it => (
                              <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 7, overflow: 'hidden', background: '#FCE8F0', flexShrink: 0 }}>
                                  {it.product_image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={it.product_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  )}
                                </div>
                                <span style={{ fontSize: 12.5, color: '#444' }}>
                                  <b style={{ color: '#C85B80' }}>{it.quantity} ×</b> {it.product_name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: '#C85B80', whiteSpace: 'nowrap' }}>{formatPrice(order.total)}</td>
                      <td style={{ padding: '14px 18px' }}><StatusSelect order={order} /></td>
                      <td style={{ padding: '14px 18px', color: '#aaa', fontSize: 12.5, whiteSpace: 'nowrap' }}>{formatDate(order.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───── DÉTAIL D'UNE COMMANDE ───── */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 500, display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', padding: isMobile ? 0 : 16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: 'white', width: '100%', maxWidth: 520, maxHeight: '92dvh', overflowY: 'auto', borderRadius: isMobile ? '24px 24px 0 0' : 24, padding: '22px 18px 28px', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontWeight: 700, color: '#1A1A1A', fontSize: 16 }}>{selected.order_number}</h3>
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Fermer"
                style={{ background: '#f5f5f5', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', display: 'flex', color: '#777' }}>
                <X size={18} />
              </button>
            </div>

            {/* Articles commandés */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Articles commandés</p>
            {!selected.items || selected.items.length === 0 ? (
              <p style={{ fontSize: 14, color: '#aaa', marginBottom: 16 }}>Aucun article enregistré pour cette commande.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {selected.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FFF9FB', border: '1px solid #F9E3EC', borderRadius: 14, padding: 10 }}>
                    <div style={{ width: 68, height: 68, borderRadius: 12, overflow: 'hidden', background: '#FCE8F0', flexShrink: 0 }}>
                      {item.product_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3 }}>{item.product_name}</p>
                      <p style={{ fontSize: 12.5, color: '#888', marginTop: 3 }}>{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#C85B80', whiteSpace: 'nowrap' }}>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
              <span style={{ fontWeight: 600, color: '#555' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#C85B80' }}>{formatPrice(selected.total)}</span>
            </div>

            {/* Client */}
            <div style={{ background: '#f9fafb', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Client</p>
              <p style={{ fontWeight: 600, color: '#1A1A1A' }}>{selected.customer_name}</p>
              <p style={{ fontSize: 14, color: '#555', marginTop: 2 }}>{selected.customer_phone}</p>
              {selected.customer_email && <p style={{ fontSize: 13, color: '#777' }}>{selected.customer_email}</p>}
              {(selected.customer_address || selected.customer_city) && (
                <p style={{ fontSize: 13, color: '#777', marginTop: 6, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                  {[selected.customer_address, selected.customer_city].filter(Boolean).join(', ')}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <a href={`tel:${selected.customer_phone}`}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#C85B80', color: 'white', borderRadius: 10, padding: '10px 0', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
                  <Phone size={14} /> Appeler
                </a>
                <a href={waLink(selected.customer_phone)} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', color: 'white', borderRadius: 10, padding: '10px 0', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </div>

            {selected.notes && (
              <div style={{ background: '#f9fafb', borderRadius: 14, padding: 14, marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Notes</p>
                <p style={{ fontSize: 14, color: '#555' }}>{selected.notes}</p>
              </div>
            )}

            {/* Statut */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Statut de la commande</p>
            <StatusSelect order={selected} />
          </div>
        </div>
      )}
    </div>
  )
}