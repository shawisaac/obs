// ─────────────────────────────────────────────
// CHEMIN : src/components/ProductCard.tsx
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface Props {
  product: Product
  delay?: number
}

export default function ProductCard({ product, delay = 0 }: Props) {
  const { addItem } = useCart()
  const [liked,   setLiked]   = useState(false)
  const [hovered, setHovered] = useState(false)

  const mainImage = product.images?.[0]?.url
  const discount  = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #F0E2EC',
        transition: 'transform .3s ease, box-shadow .3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 56px rgba(200,91,128,.13)' : '0 2px 16px rgba(0,0,0,.05)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* IMAGE */}
      <Link href={`/produit/${product.slug}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', background: '#FFF0F5' }}>
        <div style={{ aspectRatio: '1', position: 'relative', overflow: 'hidden', minHeight: 180 }}>
          {mainImage ? (
            <Image
              src={mainImage} alt={product.name} fill
              style={{ objectFit: 'cover', transition: 'transform .5s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', minHeight: 180, background: 'linear-gradient(135deg, #FCE8F0, #F9D0E3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Georgia, serif', color: '#C85B80', opacity: .4, fontSize: 13, fontStyle: 'italic' }}>O&apos;Shopping</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          {product.is_new && (
            <span style={{ background: '#C85B80', color: 'white', fontSize: 9.5, fontWeight: 600, padding: '3px 9px', borderRadius: 100, textTransform: 'uppercase' }}>Nouveau</span>
          )}
          {discount && (
            <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 9.5, fontWeight: 600, padding: '3px 9px', borderRadius: 100 }}>-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setLiked(l => !l) }}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: liked ? '#FCE8F0' : 'rgba(255,255,255,.9)', border: liked ? '1px solid #C85B80' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: hovered || liked ? 1 : 0, transition: 'opacity .2s', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}
        >
          <Heart size={14} fill={liked ? '#C85B80' : 'none'} stroke={liked ? '#C85B80' : '#666'} />
        </button>

        {/* Overlay */}
        {hovered && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent)', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={e => { e.preventDefault(); addItem(product) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', color: '#1A1A1A', fontSize: 12, fontWeight: 500, padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Ajouter au panier
            </button>
          </div>
        )}
      </Link>

      {/* INFOS */}
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {product.category && (
          <p style={{ fontSize: 10, fontWeight: 600, color: '#C85B80', textTransform: 'uppercase', letterSpacing: 1.2, margin: 0 }}>{product.category.name}</p>
        )}
        <Link href={`/produit/${product.slug}`} style={{ textDecoration: 'none', color: '#1A1A1A' }}>
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.35, margin: '2px 0 8px' }}>{product.name}</p>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#C85B80' }}>{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through', marginLeft: 6 }}>{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            style={{ width: 32, height: 32, borderRadius: 10, background: '#C85B80', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}