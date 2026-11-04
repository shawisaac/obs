// ─────────────────────────────────────────────
// CHEMIN : lib/queries-admin.ts
// Lectures admin côté SERVEUR (utilisent la session de l'admin connecté)
// ─────────────────────────────────────────────
import { createServerSupabaseClient } from './supabase-server'
import type { Product, Order } from '@/types'

export async function adminGetAllProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .order('created_at', { ascending: false })
  return (data || []).map((raw: any) => ({
    ...raw,
    images: (raw.images || []).sort((a: any, b: any) => a.position - b.position),
  }))
}

export async function adminGetAllOrders(): Promise<Order[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('orders').select('*, items:order_items(*)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function adminGetStats() {
  const supabase = await createServerSupabaseClient()
  const [statsRes, recentRes, countRes] = await Promise.all([
    supabase.from('order_stats').select('*').single(),
    supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id', { count: 'exact', head: true }),
  ])
  return { stats: statsRes.data, recentOrders: recentRes.data || [], totalProducts: countRes.count || 0 }
}