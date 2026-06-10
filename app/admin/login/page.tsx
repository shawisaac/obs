// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/login/page.tsx
// Page de connexion admin
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Remplissez tous les champs.'); return }
    setLoading(true); setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-serif text-3xl text-rose-600 font-semibold">O'Shopping</div>
          <div className="text-[10px] tracking-[2.5px] text-gray-400 uppercase mt-0.5">by Shaw — Admin</div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-rose-100">
          <h1 className="font-semibold text-lg text-gray-800 mb-1">Connexion</h1>
          <p className="text-sm text-gray-400 mb-7">Espace réservé à l'administration</p>

          <div className="space-y-4">
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@oshoppingbyshaw.ci"
                className="input-field"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <label className="input-label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-11"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 mt-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full mt-6 py-3.5"
          >
            {loading ? 'Connexion...' : <><LogIn size={15} /> Se connecter</>}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Développé par <span className="text-rose-600 font-medium">AURA DIGITAL</span>
        </p>
      </div>
    </div>
  )
}