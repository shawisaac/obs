// ─────────────────────────────────────────────
// CHEMIN : app/admin/page.tsx
// ─────────────────────────────────────────────
import { ShoppingCart, Package, TrendingUp, Clock } from 'lucide-react'
import { adminGetStats } from '@/lib/queries-admin'
import { formatPrice, formatDate } from '@/lib/utils'
import { ORDER_STATUS, type OrderStatus } from '@/types'
import Link from 'next/link'

export default async function AdminDashboard() {
  const { stats, recentOrders, totalProducts } = await adminGetStats()

  const STAT_CARDS = [
    {
      label: "Commandes aujourd'hui",
      value: stats?.orders_today ?? 0,
      icon:  ShoppingCart,
      color: 'bg-rose-50 text-rose-600',
      bg:    '#FFF4F8',
      ico:   '#C85B80',
      sub:   `${stats?.total_orders ?? 0} au total`,
    },
    {
      label: 'CA ce mois',
      value: formatPrice(stats?.revenue_this_month ?? 0),
      icon:  TrendingUp,
      color: 'bg-green-50 text-green-600',
      bg:    '#f0fdf4',
      ico:   '#16a34a',
      sub:   `Total : ${formatPrice(stats?.total_revenue ?? 0)}`,
    },
    {
      label: 'En attente',
      value: stats?.pending_orders ?? 0,
      icon:  Clock,
      color: 'bg-amber-50 text-amber-600',
      bg:    '#fffbeb',
      ico:   '#d97706',
      sub:   'commandes à traiter',
    },
    {
      label: 'Produits',
      value: totalProducts,
      icon:  Package,
      color: 'bg-purple-50 text-purple-600',
      bg:    '#faf5ff',
      ico:   '#9333ea',
      sub:   'dans la boutique',
    },
  ]

  const colorMap: Record<string, string> = {
    amber:  'background:#fef3c7;color:#92400e',
    blue:   'background:#dbeafe;color:#1e40af',
    purple: 'background:#ede9fe;color:#6d28d9',
    indigo: 'background:#e0e7ff;color:#3730a3',
    green:  'background:#dcfce7;color:#15803d',
    red:    'background:#fee2e2;color:#991b1b',
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#aaa' }}>Bienvenue sur votre espace administration</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {STAT_CARDS.map(({ label, value, icon: Icon, bg, ico, sub }) => (
          <div key={label} style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon size={19} color={ico} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>{value}</p>
            <p style={{ fontSize: 12.5, fontWeight: 500, color: '#555', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 11.5, color: '#bbb' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Commandes récentes */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,.04)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>Commandes récentes</h2>
          <Link href="/admin/commandes" style={{ fontSize: 13, color: '#C85B80', textDecoration: 'none', fontWeight: 500 }}>
            Voir tout →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f5f5f5', background: '#fafafa' }}>
                {['N° commande', 'Client', 'Ville', 'Total', 'Statut', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 20px', fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: .8, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#bbb', fontSize: 14 }}>
                    Aucune commande pour l'instant
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => {
                  const s = ORDER_STATUS[order.status as OrderStatus]
                  const styles = colorMap[s?.color] || 'background:#f3f4f6;color:#555'
                  const [bg, col] = styles.split(';').map(s => s.split(':')[1])
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                        {order.order_number}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 500, color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                        {order.customer_name}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#888' }}>
                        {order.customer_city || '—'}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: '#C85B80', whiteSpace: 'nowrap' }}>
                        {formatPrice(order.total)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: bg, color: col }}>
                          {s?.label || order.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#aaa', fontSize: 12.5, whiteSpace: 'nowrap' }}>
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