// ─────────────────────────────────────────────
// CHEMIN : src/lib/queries.ts
// Requêtes Supabase côté boutique (navigateur)
// ─────────────────────────────────────────────
import { supabase } from './supabase'
import type { Product, Category, Order, OrderFormData, CartItem, ShopFilters, ApiResponse } from '@/types'
import { generateOrderNumber } from './utils'

const PRODUCT_SELECT = '*, category:categories(id,name,slug), images:product_images(id,url,alt,position)'

function normalizeProduct(raw: any): Product {
  return { ...raw, images: (raw.images || []).sort((a: any, b: any) => a.position - b.position) }
}

// ── CATÉGORIES ──
export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories').select('*')
    .eq('is_active', true).order('position')
  return data || []
}

// ── PRODUITS ──
export async function getProducts(filters?: ShopFilters): Promise<Product[]> {
  let q = supabase.from('products').select(PRODUCT_SELECT).eq('is_active', true)

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
    .from('products').select(PRODUCT_SELECT)
    .eq('is_active', true).eq('is_featured', true)
    .order('created_at', { ascending: false }).limit(8)
  return (data || []).map(normalizeProduct)
}

export async function getNewProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products').select(PRODUCT_SELECT)
    .eq('is_active', true).eq('is_new', true)
    .order('created_at', { ascending: false }).limit(8)
  return (data || []).map(normalizeProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products').select(PRODUCT_SELECT)
    .eq('slug', slug).eq('is_active', true).single()
  return data ? normalizeProduct(data) : null
}

export async function getRelatedProducts(productId: string, categoryId: string | null): Promise<Product[]> {
  let q = supabase
    .from('products').select(PRODUCT_SELECT)
    .eq('is_active', true).neq('id', productId).limit(4)
  if (categoryId) q = q.eq('category_id', categoryId)
  const { data } = await q
  return (data || []).map(normalizeProduct)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products').select(PRODUCT_SELECT)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(8)
  return (data || []).map(normalizeProduct)
}

// ── COMMANDES ──
// L'identifiant est généré ici : un visiteur n'a pas le droit de LIRE
// les commandes, donc on ne demande pas à la base de renvoyer la ligne créée.
export async function createOrder(formData: OrderFormData, cartItems: CartItem[]): Promise<ApiResponse<Order>> {
  try {
    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const orderId = crypto.randomUUID()
    const orderNumber = generateOrderNumber()

    const { error } = await supabase
      .from('orders')
      .insert({ id: orderId, ...formData, order_number: orderNumber, subtotal, total: subtotal, status: 'pending' })
    if (error) return { data: null, error: error.message }

    const { error: itemsError } = await supabase.from('order_items').insert(
      cartItems.map(i => ({
        order_id: orderId, product_id: i.product.id,
        product_name: i.product.name, product_image: i.product.images?.[0]?.url || null,
        price: i.product.price, quantity: i.quantity,
      }))
    )
    if (itemsError) return { data: null, error: itemsError.message }

    return { data: { id: orderId, order_number: orderNumber } as Order, error: null }
  } catch (e: any) { return { data: null, error: e.message } }
}

// ── ADMIN (appelé depuis le navigateur, avec la session de l'admin) ──
export async function adminUpdateOrderStatus(id: string, status: string) {
  return supabase.from('orders').update({ status }).eq('id', id)
}