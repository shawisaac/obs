// ─────────────────────────────────────────────
// CHEMIN : src/context/CartContext.tsx
// ─────────────────────────────────────────────
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { CartItem, Product } from '@/types'
import toast from 'react-hot-toast'

interface CartContextType {
  items:          CartItem[]
  count:          number
  total:          number
  addItem:        (product: Product, quantity?: number) => void
  removeItem:     (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart:      () => void
  isOpen:         boolean
  openCart:       () => void
  closeCart:      () => void
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = 'oshopping_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Charger depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  // Sauvegarder à chaque changement
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id)
      if (exists) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { product, quantity }]
    })
    toast.success(`${product.name} ajouté au panier`, {
      style: { background: '#1A1A1A', color: '#fff', borderRadius: '100px', fontSize: '13px' },
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId))
    } else {
      setItems(prev =>
        prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])
  const openCart  = useCallback(() => setIsOpen(true),  [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider value={{
      items, count, total,
      addItem, removeItem, updateQuantity, clearCart,
      isOpen, openCart, closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être dans CartProvider')
  return ctx
}