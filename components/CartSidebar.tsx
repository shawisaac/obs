// ─────────────────────────────────────────────
// CHEMIN : src/components/CartSidebar.tsx
// ─────────────────────────────────────────────
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartSidebar() {
  const { items, count, total, removeItem, updateQuantity, isOpen, closeCart } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div onClick={closeCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 9998, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transition: 'opacity .3s ease' }} />

      {/* Sidebar */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(400px, 100vw)', background: 'white', zIndex: 9999, display: 'flex', flexDirection: 'column', boxShadow: '-16px 0 56px rgba(0,0,0,.15)', transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .35s cubic-bezier(.4,0,.2,1)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #F5E0EA', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={18} color="#C85B80" />
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A' }}>Mon Panier</span>
            {count > 0 && <span style={{ background: '#FCE8F0', color: '#C85B80', fontSize: 12, fontWeight: 600, borderRadius: 100, padding: '2px 10px' }}>{count}</span>}
          </div>
          <button type="button" onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#888', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Articles */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 14, textAlign: 'center' }}>
              <ShoppingBag size={52} color="#F0C0D4" strokeWidth={1} />
              <div>
                <p style={{ fontWeight: 500, color: '#555', marginBottom: 4 }}>Panier vide</p>
                <p style={{ fontSize: 13, color: '#aaa' }}>Ajoutez des produits pour commencer</p>
              </div>
              <button type="button" onClick={closeCart}
                style={{ marginTop: 8, padding: '10px 24px', borderRadius: 10, border: '1.5px solid #C85B80', background: 'transparent', color: '#C85B80', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Voir la boutique
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Link href={`/produit/${product.slug}`} onClick={closeCart} style={{ flexShrink: 0 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#FCE8F0' }}>
                      {product.images?.[0] ? (
                        <Image src={product.images[0].url} alt={product.name} width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FCE8F0, #F9D0E3)' }} />
                      )}
                    </div>
                  </Link>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: '#1A1A1A', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#C85B80', marginBottom: 10 }}>
                      {formatPrice(product.price)}
                    </p>

                    {/* Boutons quantité */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          updateQuantity(product.id, quantity - 1)
                        }}
                        style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #F0C0D4', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        <Minus size={13} />
                      </button>

                      <span style={{ fontSize: 15, fontWeight: 700, minWidth: 24, textAlign: 'center', color: '#1A1A1A' }}>
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          updateQuantity(product.id, quantity + 1)
                        }}
                        style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #F0C0D4', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeItem(product.id)
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', padding: 4, marginTop: 2, display: 'flex', flexShrink: 0 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '16px 20px 28px', borderTop: '1px solid #F5E0EA', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 14, color: '#666' }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#C85B80' }}>{formatPrice(total)}</span>
            </div>
            <Link href="/commande" onClick={closeCart}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#C85B80', color: 'white', textDecoration: 'none', padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 600, width: '100%' }}>
              Passer la commande <ArrowRight size={15} />
            </Link>
            <p style={{ textAlign: 'center', fontSize: 11.5, color: '#aaa', marginTop: 10 }}>
              Paiement à la livraison · Aucun compte requis
            </p>
          </div>
        )}
      </div>
    </>
  )
}