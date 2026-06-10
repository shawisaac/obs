// ── CATÉGORIE ──
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── PRODUIT ──
export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  category_id: string | null
  category?: Category | null
  images: ProductImage[]
  stock: number
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt: string | null
  position: number
  created_at: string
}

// ── PANIER (client uniquement) ──
export interface CartItem {
  product: Product
  quantity: number
}

// ── COMMANDE ──
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_email: string | null
  items?: OrderItem[]
  subtotal: number
  total: number
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  price: number
  quantity: number
  created_at: string
}

// ── FORMULAIRE COMMANDE ──
export interface OrderFormData {
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_email?: string
  notes?: string
}

// ── FILTRES BOUTIQUE ──
export interface ShopFilters {
  category?: string
  min_price?: number
  max_price?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
  search?: string
}

// ── ADMIN ──
export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'super_admin'
  created_at: string
}

// ── API ──
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// ── STATUT COMMANDE : labels ──
export const ORDER_STATUS: Record<OrderStatus, { label: string; color: string }> = {
  pending:    { label: 'En attente',      color: 'amber'  },
  confirmed:  { label: 'Confirmée',       color: 'blue'   },
  processing: { label: 'En préparation',  color: 'purple' },
  shipped:    { label: 'Expédiée',        color: 'indigo' },
  delivered:  { label: 'Livrée',          color: 'green'  },
  cancelled:  { label: 'Annulée',         color: 'red'    },
}