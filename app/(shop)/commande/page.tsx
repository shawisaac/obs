// ─────────────────────────────────────────────
// CHEMIN : src/app/(shop)/commande/page.tsx
// Page de finalisation de commande
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'

export default function CommandePage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_address: '', customer_city: '', customer_email: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNum, setOrderNum] = useState('')
  const [error,   setError]   = useState('')

  const handleSubmit = async () => {
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      setError('Veuillez remplir votre nom et numéro de téléphone.')
      return
    }
    setLoading(true); setError('')
    const res = await createOrder(form, items)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    setOrderNum(res.data?.order_number || '')
    setSuccess(true)
    clearCart()
  }

  if (success) {
    return (
      <div className="container-shop py-20 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-rose-600" />
        </div>
        <h1 className="font-serif text-3xl text-rose-600 mb-3">Commande confirmée !</h1>
        <p className="text-gray-500 mb-2">N° {orderNum}</p>
        <p className="text-gray-500 mb-8 leading-relaxed">Merci pour votre commande. Nous vous contacterons très bientôt pour confirmer la livraison.</p>
        <Link href="/" className="btn-primary mx-auto">Retour à l'accueil</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-shop py-20 text-center max-w-lg mx-auto">
        <p className="text-gray-400 text-lg mb-6">Votre panier est vide</p>
        <Link href="/boutique" className="btn-primary mx-auto">Voir la boutique</Link>
      </div>
    )
  }

  return (
    <div className="container-shop py-8 md:py-14 max-w-5xl mx-auto">
      <Link href="/boutique" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-rose-600 transition-colors mb-8">
        <ChevronLeft size={15} /> Continuer mes achats
      </Link>
      <h1 className="font-serif font-light text-3xl md:text-4xl mb-8">Finaliser ma commande</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Formulaire */}
        <div className="md:col-span-3 space-y-4">
          <h2 className="font-semibold text-base mb-4">Informations de livraison</h2>
          {[
            ['customer_name',    'Nom complet *',           'text'],
            ['customer_phone',   'Numéro de téléphone *',   'tel'],
            ['customer_address', 'Adresse de livraison',    'text'],
            ['customer_city',    'Ville',                   'text'],
            ['customer_email',   'Email (optionnel)',        'email'],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className="input-label">{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="input-field"
              />
            </div>
          ))}
          <div>
            <label className="input-label">Notes (optionnel)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="input-field resize-none" rows={3}
              placeholder="Instructions particulières..."
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Récap panier */}
        <div className="md:col-span-2">
          <h2 className="font-semibold text-base mb-4">Récapitulatif</h2>
          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 space-y-4 mb-5">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-rose-100 flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image src={product.images[0].url} alt={product.name} width={56} height={56} className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-200" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-rose-600 font-semibold">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-6 h-6 rounded-lg border border-rose-200 flex items-center justify-center text-gray-500"><Minus size={10} /></button>
                    <span className="text-xs font-medium w-4 text-center">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-6 h-6 rounded-lg border border-rose-200 flex items-center justify-center text-gray-500"><Plus size={10} /></button>
                    <button onClick={() => removeItem(product.id)} className="ml-auto text-gray-300 hover:text-rose-400"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mb-5 font-semibold">
            <span className="text-gray-600">Total</span>
            <span className="text-rose-600 text-xl">{formatPrice(total)}</span>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Traitement...' : <><Check size={16} /> Confirmer la commande</>}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Paiement à la livraison · Aucun compte requis</p>
        </div>
      </div>
    </div>
  )
}