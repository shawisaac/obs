// ─────────────────────────────────────────────
// CHEMIN : src/components/OrderModal.tsx
// Modal de commande directe (sans panier)
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Check } from 'lucide-react'
import { createOrder } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
}

export default function OrderModal({ isOpen, onClose, product }: Props) {
  const { items, total, clearCart } = useCart()
  const [form, setForm]     = useState({ customer_name: '', customer_phone: '', customer_address: '', customer_city: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const cartItems = product
    ? [{ product, quantity: 1 }]
    : items

  const orderTotal = product ? product.price : total

  const handleSubmit = async () => {
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      setError('Veuillez remplir votre nom et téléphone.')
      return
    }
    setLoading(true); setError('')
    const res = await createOrder(form, cartItems)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    setSuccess(true)
    if (!product) clearCart()
    setTimeout(() => { setSuccess(false); onClose(); setForm({ customer_name: '', customer_phone: '', customer_address: '', customer_city: '', notes: '' }) }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative z-10 bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-up max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-rose-600" />
              </div>
              <h3 className="font-serif text-2xl text-rose-600 mb-2">Commande envoyée !</h3>
              <p className="text-sm text-gray-500">Nous vous contacterons très bientôt pour confirmer votre livraison.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl">Commander maintenant</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={20} /></button>
              </div>

              {/* Résumé */}
              <div className="bg-rose-50 rounded-xl p-4 mb-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 flex-shrink-0 overflow-hidden">
                  {product?.images?.[0] && <Image src={product.images[0].url} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product ? product.name : `${cartItems.length} article(s)`}</p>
                  <p className="text-sm font-bold text-rose-600">{formatPrice(orderTotal)}</p>
                </div>
              </div>

              {/* Formulaire */}
              <div className="space-y-3">
                {[
                  ['customer_name',    'Votre nom complet *',     'text'],
                  ['customer_phone',   'Numéro de téléphone *',   'tel'],
                  ['customer_address', 'Adresse de livraison',    'text'],
                  ['customer_city',    'Ville',                   'text'],
                  ['notes',            'Notes (optionnel)',        'text'],
                ].map(([key, placeholder, type]) => (
                  <input
                    key={key}
                    type={type}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input-field"
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full mt-5 py-4"
              >
                {loading ? 'Envoi en cours...' : <><Check size={15} /> Confirmer ma commande</>}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">Paiement à la livraison · Aucun compte requis</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}