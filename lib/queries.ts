// ─────────────────────────────────────────────
// CHEMIN : src/lib/queries.ts
// Toutes les requêtes Supabase
// ─────────────────────────────────────────────
import { supabase } from './supabase'
import type { Product, Category, Order, OrderItem, OrderFormData, CartItem, ShopFilters, ApiResponse } from '@/types'
import { generateOrderNumber } from './utils'

// ── CATÉGORIES ──
export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories').select('*')
    .eq('is_active', true).order('position')
  return data || []
}

// ── PRODUITS ──
export async function getProducts(filters?: ShopFilters): Promise<Product[]> {
  let q = supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .eq('is_active', true)

  if (filters?.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', filters.category).single()
    if (cat) q = q.eq('category_id', cat.id)
  }
  if (filters?.search)    q = q.ilike('name', `%${filters.search}%`)
  if (filters?.min_price) q = q.gte('price', filters.min_price)
  if (filters?.max_price) q = q.lte('price', filters.max_price)

  switch (filters?.sort) {
    case 'price_asc':  q = q.order('price', { ascending: true });  break
    case 'price_desc': q = q.order('price', { ascending: false }); break
    default:           q = q.order('created_at', { ascending: false })
  }

  const { data } = await q
  return (data || []).map(normalizeProduct)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .eq('is_active', true).eq('is_featured', true)
    .order('created_at', { ascending: false }).limit(8)
  return (data || []).map(normalizeProduct)
}

export async function getNewProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .eq('is_active', true).eq('is_new', true)
    .order('created_at', { ascending: false }).limit(8)
  return (data || []).map(normalizeProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .eq('slug', slug).eq('is_active', true).single()
  return data ? normalizeProduct(data) : null
}

export async function getRelatedProducts(productId: string, categoryId: string | null): Promise<Product[]> {
  let q = supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .eq('is_active', true).neq('id', productId).limit(4)
  if (categoryId) q = q.eq('category_id', categoryId)
  const { data } = await q
  return (data || []).map(normalizeProduct)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(8)
  return (data || []).map(normalizeProduct)
}

function normalizeProduct(raw: any): Product {
  return { ...raw, images: (raw.images || []).sort((a: any, b: any) => a.position - b.position) }
}

// ── COMMANDES ──
export async function createOrder(formData: OrderFormData, cartItems: CartItem[]): Promise<ApiResponse<Order>> {
  try {
    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const { data: order, error } = await supabase
      .from('orders')
      .insert({ ...formData, order_number: generateOrderNumber(), subtotal, total: subtotal, status: 'pending' })
      .select().single()
    if (error || !order) return { data: null, error: error?.message || 'Erreur' }

    await supabase.from('order_items').insert(
      cartItems.map(i => ({
        order_id: order.id, product_id: i.product.id,
        product_name: i.product.name, product_image: i.product.images?.[0]?.url || null,
        price: i.product.price, quantity: i.quantity,
      }))
    )
    return { data: order, error: null }
  } catch (e: any) { return { data: null, error: e.message } }
}

// ── ADMIN ──
export async function adminGetAllProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
    .order('created_at', { ascending: false })
  return (data || []).map(normalizeProduct)
}

export async function adminGetAllOrders(): Promise<Order[]> {
  const { data } = await supabase
    .from('orders').select('*, items:order_items(*)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  return supabase.from('orders').update({ status }).eq('id', id)
}

export async function adminGetStats() {
  const [statsRes, recentRes, countRes] = await Promise.all([
    supabase.from('order_stats').select('*').single(),
    supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id', { count: 'exact', head: true }),
  ])
  return { stats: statsRes.data, recentOrders: recentRes.data || [], totalProducts: countRes.count || 0 }
}