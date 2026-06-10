// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/commandes/page.tsx
// Gestion des commandes
// ─────────────────────────────────────────────
import { adminGetAllOrders } from '@/lib/queries'
import CommandesClient from './CommandesClient'

export default async function CommandesPage() {
  const orders = await adminGetAllOrders()
  return <CommandesClient initialOrders={orders} />
}