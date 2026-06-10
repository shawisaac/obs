// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/page.tsx
// Dashboard — statistiques et aperçu général
// ─────────────────────────────────────────────
import { ShoppingCart, Package, TrendingUp, Clock } from 'lucide-react'
import { adminGetStats } from '@/lib/queries'
import { formatPrice, formatDate } from '@/lib/utils'
import { ORDER_STATUS } from '@/types'
import Link from 'next/link'

export default async function AdminDashboard() {
  const { stats, recentOrders, totalProducts } = await adminGetStats()

  const STAT_CARDS = [
    {
      label: "Commandes aujourd'hui",
      value: stats?.orders_today ?? 0,
      icon:  ShoppingCart,
      color: 'bg-rose-50 text-rose-600',
      sub:   `${stats?.total_orders ?? 0} au total`,
    },
    {
      label: 'CA ce mois',
      value: formatPrice(stats?.revenue_this_month ?? 0),
      icon:  TrendingUp,
      color: 'bg-green-50 text-green-600',
      sub:   `Total : ${formatPrice(stats?.total_revenue ?? 0)}`,
    },
    {
      label: 'En attente',
      value: stats?.pending_orders ?? 0,
      icon:  Clock,
      color: 'bg-amber-50 text-amber-600',
      sub:   'commandes à traiter',
    },
    {
      label: 'Produits',
      value: totalProducts,
      icon:  Package,
      color: 'bg-purple-50 text-purple-600',
      sub:   'dans la boutique',
    },
  ]

  const colorMap: Record<string, string> = {
    amber:  'bg-amber-100 text-amber-700',
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    green:  'bg-green-100 text-green-700',
    red:    'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bienvenue sur votre espace administration
        </p>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 border border-gray-100"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
            <p className="text-xs font-medium text-gray-600">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── COMMANDES RÉCENTES ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Commandes récentes</h2>
          <Link
            href="/admin/commandes"
            className="text-xs text-rose-600 hover:underline font-medium"
          >
            Voir tout
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['N° commande', 'Client', 'Ville', 'Total', 'Statut', 'Date'].map(h => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Aucune commande pour instant
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => {
                  const s = ORDER_STATUS[order.status]
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.customer_city || '—'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-rose-600">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${colorMap[s.color] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}