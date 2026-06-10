// ─────────────────────────────────────────────
// CHEMIN : src/app/(shop)/contact/ContactForm.tsx
// Formulaire de contact (partie client)
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { Send, Check } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm]     = useState({ nom: '', email: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.nom.trim() || !form.message.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-rose-50 rounded-2xl border border-rose-100 h-full">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
          <Check size={28} className="text-rose-600" />
        </div>
        <h3 className="font-serif text-xl text-rose-600 mb-2">Message envoyé !</h3>
        <p className="text-sm text-gray-500">Nous vous répondrons très bientôt.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-rose-100 shadow-card">
      <div className="space-y-4">
        <div>
          <label className="input-label">Votre nom</label>
          <input
            value={form.nom}
            onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
            placeholder="Aminata Koné"
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="votre@email.com"
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Message</label>
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="Votre message..."
            rows={5}
            className="input-field resize-none"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !form.nom || !form.message}
        className="btn-primary w-full mt-5 py-4"
      >
        {loading ? 'Envoi...' : <><Send size={15} /> Envoyer le message</>}
      </button>
    </div>
  )
}