// ─────────────────────────────────────────────
// CHEMIN : app/(shop)/produit/[slug]/page.tsx
// ─────────────────────────────────────────────
'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ShoppingCart, Heart, Check, Truck, CreditCard, Minus, Plus, ChevronLeft, ArrowRight, X, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import { formatPrice, generateOrderNumber } from '@/lib/utils'
import type { Product } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const slug   = params.slug as string
  const { addItem } = useCart()

  const [product,   setProduct]   = useState<Product | null>(null)
  const [related,   setRelated]   = useState<Product[]>([])
  const [loading,   setLoading]   = useState(true)
  const [qty,       setQty]       = useState(1)
  const [imgIdx,    setImgIdx]    = useState(0)
  const [liked,     setLiked]     = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [form,      setForm]      = useState({ customer_name: '', customer_phone: '', customer_address: '', customer_city: '' })
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
        .eq('slug', slug).eq('is_active', true).single()

      if (!data) { setLoading(false); return }
      const prod = { ...data, images: (data.images || []).sort((a: any, b: any) => a.position - b.position) }
      setProduct(prod)

      let q = supabase
        .from('products')
        .select('*, category:categories(id,name,slug), images:product_images(id,url,alt,position)')
        .eq('is_active', true).neq('id', data.id).limit(4)
      if (data.category_id) q = q.eq('category_id', data.category_id)
      const { data: rel } = await q
      setRelated((rel || []).map((p: any) => ({ ...p, images: (p.images || []).sort((a: any, b: any) => a.position - b.position) })))
      setLoading(false)
    }
    load()
  }, [slug])

  const handleOrder = async () => {
    if (!product || !form.customer_name || !form.customer_phone) return
    setSending(true)
    const { data: order } = await supabase.from('orders').insert({
      order_number: generateOrderNumber(),
      customer_name: form.customer_name, customer_phone: form.customer_phone,
      customer_address: form.customer_address, customer_city: form.customer_city,
      subtotal: product.price * qty, total: product.price * qty, status: 'pending',
    }).select().single()
    if (order) {
      await supabase.from('order_items').insert({
        order_id: order.id, product_id: product.id,
        product_name: product.name, product_image: product.images?.[0]?.url || null,
        price: product.price, quantity: qty,
      })
    }
    setSending(false); setSent(true)
    setTimeout(() => { setSent(false); setOrderOpen(false); setForm({ customer_name: '', customer_phone: '', customer_address: '', customer_city: '' }) }, 3000)
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 15 }}>
      Chargement...
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#666', fontSize: 16 }}>Produit introuvable</p>
      <Link href="/boutique" style={{ color: '#C85B80', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronLeft size={15} /> Retour à la boutique
      </Link>
    </div>
  )

  const mainImage = product.images?.[imgIdx]?.url
  const discount  = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : null

  return (
    <>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 16px 64px' }}>
        {/* Fil d'Ariane */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#bbb', marginBottom: 24, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#bbb', textDecoration: 'none' }}>Accueil</Link>
          <span>/</span>
          <Link href="/boutique" style={{ color: '#bbb', textDecoration: 'none' }}>Boutique</Link>
          {product.category && (<><span>/</span><Link href={`/boutique?categorie=${product.category.slug}`} style={{ color: '#bbb', textDecoration: 'none' }}>{product.category.name}</Link></>)}
          <span>/</span>
          <span style={{ color: '#555' }}>{product.name}</span>
        </nav>

        {/* Produit */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, marginBottom: 80 }}>
          {/* Galerie */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: '#FFF0F5', marginBottom: 12, aspectRatio: '1', position: 'relative' }}>
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" priority />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FCE8F0, #F9D0E3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Georgia, serif', color: '#C85B80', opacity: .3, fontSize: 18, fontStyle: 'italic' }}>{"O'Shopping"}</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {product.images.map((img, i) => (
                  <button key={img.id} type="button" onClick={() => setImgIdx(i)}
                    style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', border: `2px solid ${imgIdx === i ? '#C85B80' : 'transparent'}`, padding: 0, cursor: 'pointer', background: 'none', opacity: imgIdx === i ? 1 : .6, transition: 'all .2s' }}>
                    <Image src={img.url} alt="" width={80} height={80} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {product.is_new && <span style={{ background: '#C85B80', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase' }}>Nouveau</span>}
              {discount && <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>-{discount}%</span>}
            </div>
            {product.category && (
              <Link href={`/boutique?categorie=${product.category.slug}`} style={{ fontSize: 11, color: '#C85B80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, textDecoration: 'none' }}>
                {product.category.name}
              </Link>
            )}
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 300, color: '#1A1A1A', margin: '8px 0 14px', lineHeight: 1.2 }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#C85B80' }}>{formatPrice(product.price)}</span>
              {product.compare_price && <span style={{ fontSize: 16, color: '#bbb', textDecoration: 'line-through' }}>{formatPrice(product.compare_price)}</span>}
            </div>
            {product.description && (
              <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15, marginBottom: 24 }}>{product.description}</p>
            )}
            <div style={{ background: '#FFF4F8', border: '1px solid #F9D0E3', borderRadius: 14, padding: '14px 18px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {([
  [Check,      'En stock'                ] as const,
  [Truck,      'Livraison disponible'    ] as const,
  [CreditCard, 'Paiement à la livraison' ] as const,
] as const).map(([Icon, text], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#C85B80', fontWeight: 500 }}>
                  <Icon size={14} />{text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #F0C0D4', borderRadius: 12, overflow: 'hidden' }}>
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', color: '#555' }}><Minus size={14} /></button>
                <span style={{ padding: '0 18px', fontSize: 16, fontWeight: 600 }}>{qty}</span>
                <button type="button" onClick={() => setQty(q => q + 1)}
                  style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', color: '#555' }}><Plus size={14} /></button>
              </div>
              <button type="button" onClick={() => setLiked(l => !l)}
                style={{ width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${liked ? '#C85B80' : '#F0C0D4'}`, background: liked ? '#FCE8F0' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={18} fill={liked ? '#C85B80' : 'none'} stroke={liked ? '#C85B80' : '#aaa'} />
              </button>
            </div>
            <button type="button" onClick={() => { for(let i=0;i<qty;i++) addItem(product) }}
              style={{ width: '100%', padding: 14, background: '#C85B80', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginBottom: 10 }}>
              <ShoppingCart size={16} /> Ajouter au panier
            </button>
            <button type="button" onClick={() => setOrderOpen(true)}
              style={{ width: '100%', padding: 14, background: 'transparent', color: '#C85B80', border: '1.5px solid #C85B80', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
              <ArrowRight size={16} /> Commander directement
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 10 }}>Aucun compte requis</p>
          </div>
        </div>

        {/* ── PRODUITS SIMILAIRES — AMÉLIORÉS ── */}
        {related.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, color: '#C85B80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 6 }}>Dans la même catégorie</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 300, color: '#1A1A1A' }}>
                  Vous aimerez aussi
                </h2>
              </div>
              <Link href="/boutique" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C85B80', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>

            {/* Grille produits similaires */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {related.map(p => {
                const img = p.images?.[0]?.url
                const disc = p.compare_price ? Math.round((1 - p.price / p.compare_price) * 100) : null
                return (
                  <Link key={p.id} href={`/produit/${p.slug}`}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 18, overflow: 'hidden', border: '1px solid #F0E2EC', transition: 'transform .3s, box-shadow .3s', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = '0 16px 40px rgba(200,91,128,.14)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 2px 12px rgba(0,0,0,.05)' }}
                  >
                    {/* Image */}
                    <div style={{ aspectRatio: '1', background: '#FFF0F5', position: 'relative', overflow: 'hidden' }}>
                      {img ? (
                        <Image src={img} alt={p.name} fill style={{ objectFit: 'cover', transition: 'transform .5s' }} sizes="(max-width: 640px) 50vw, 25vw" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FCE8F0, #F9D0E3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'Georgia, serif', color: '#C85B80', opacity: .3, fontSize: 12, fontStyle: 'italic' }}>{"O'Shopping"}</span>
                        </div>
                      )}
                      {/* Badges */}
                      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
                        {p.is_new && <span style={{ background: '#C85B80', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100, textTransform: 'uppercase' }}>Nouveau</span>}
                        {disc && <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>-{disc}%</span>}
                      </div>
                    </div>

                    {/* Infos */}
                    <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {p.category && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#C85B80', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {p.category.name}
                        </span>
                      )}
                      <p style={{ fontSize: 14.5, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.35, flex: 1 }}>
                        {p.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <div>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#C85B80' }}>{formatPrice(p.price)}</span>
                          {p.compare_price && (
                            <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through', marginLeft: 6 }}>{formatPrice(p.compare_price)}</span>
                          )}
                        </div>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ArrowRight size={14} color="#C85B80" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal commande directe */}
      {orderOpen && (
        <>
          <div onClick={() => setOrderOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 9000 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '24px 24px 0 0', zIndex: 9001, padding: '28px 20px 32px', maxHeight: '92vh', overflowY: 'auto' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={28} color="#C85B80" />
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#C85B80', marginBottom: 8 }}>Commande envoyée !</h3>
                <p style={{ color: '#888', fontSize: 14 }}>Nous vous contacterons très bientôt.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>Commander maintenant</h3>
                  <button type="button" onClick={() => setOrderOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}><X size={20} /></button>
                </div>
                <div style={{ background: '#FFF4F8', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#FCE8F0', flexShrink: 0 }}>
                    {mainImage && <Image src={mainImage} alt={product.name} width={48} height={48} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{product.name}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#C85B80' }}>{formatPrice(product.price * qty)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[['customer_name','Nom complet *'],['customer_phone','Téléphone *'],['customer_address','Adresse de livraison'],['customer_city','Ville']].map(([key, ph]) => (
                    <input key={key} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                      style={{ border: '1.5px solid #F0C0D4', borderRadius: 10, padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', width: '100%' }} />
                  ))}
                </div>
                <button type="button" onClick={handleOrder} disabled={sending}
                  style={{ width: '100%', padding: 14, background: '#C85B80', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginTop: 16, opacity: sending ? .7 : 1 }}>
                  <Check size={15} /> {sending ? 'Envoi...' : 'Confirmer la commande'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 10 }}>Paiement à la livraison · Aucun compte requis</p>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}