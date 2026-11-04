// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/produits/page.tsx
// Gestion des produits
// ─────────────────────────────────────────────
import { adminGetAllProducts } from '@/lib/queries-admin'
import ProduitsClient from './ProduitsClient'

export default async function ProduitsPage() {
  const products = await adminGetAllProducts()
  return <ProduitsClient initialProducts={products} />
}