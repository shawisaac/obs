// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/commandes/CommandesClient.tsx
// Partie client — liste et gestion des commandes
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { ChevronDown, Search, Eye, X } from 'lucide-react'
import { adminUpdateOrderStatus } from '@/lib/queries'
import { formatPrice, formatDate } from '@/lib/utils'
import { ORDER_STATUS, type Order, type OrderStatus } from '@/types'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS: OrderStatus[] = ['pending','confirmed','processing','shipped','delivered','cancelled']

const COLOR: Record<string, string> = {
  amber:  'bg-amber-100 text-amber-700 border-amber-200',
  blue:   'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  green:  'bg-green-100 text-green-700 border-green-200',
  red:    'bg-red-100 text-red-700 border-red-200',
}

export default function CommandesClient({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter()
  const [orders,   setOrders]   = useState(initialOrders)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<string>('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.order_number.includes(search) || o.customer_phone.includes(search)
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId)
    await adminUpdateOrderStatus(orderId, status)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null)
    setUpdating(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="input-field pl-10" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="input-field max-w-[200px] cursor-pointer">
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{ORDER_STATUS[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['N° commande', 'Client', 'Téléphone', 'Ville', 'Total', 'Statut', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">Aucune commande trouvée</td></tr>
              ) : filtered.map(order => {
                const s = ORDER_STATUS[order.status]
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-600 whitespace-nowrap">{order.order_number}</td>
                    <td className="px-5 py-4 font-medium text-gray-800 whitespace-nowrap">{order.customer_name}</td>
                    <td className="px-5 py-4 text-gray-500">{order.customer_phone}</td>
                    <td className="px-5 py-4 text-gray-500">{order.customer_city || '—'}</td>
                    <td className="px-5 py-4 font-semibold text-rose-600 whitespace-nowrap">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={updating === order.id}
                        className={`text-[11px] font-semibold border rounded-full px-3 py-1.5 cursor-pointer focus:outline-none ${COLOR[s.color] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {STATUS_OPTIONS.map(st => (
                          <option key={st} value={st}>{ORDER_STATUS[st].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(order)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détail commande */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900">{selected.order_number}</h3>
                  <p className="text-xs text-gray-400">{formatDate(selected.created_at)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Client</p>
                  <p className="font-semibold text-gray-800">{selected.customer_name}</p>
                  <p className="text-sm text-gray-600">{selected.customer_phone}</p>
                  {selected.customer_email && <p className="text-sm text-gray-600">{selected.customer_email}</p>}
                  {selected.customer_address && <p className="text-sm text-gray-500 mt-1">{selected.customer_address}, {selected.customer_city}</p>}
                </div>

                {selected.items && selected.items.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Articles</p>
                    <div className="space-y-2">
                      {selected.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                            <p className="text-xs text-gray-400">Qté : {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-rose-600">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-xl font-bold text-rose-600">{formatPrice(selected.total)}</span>
                </div>

                {selected.notes && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm text-gray-600">{selected.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}