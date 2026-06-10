// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/layout.tsx
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, ShoppingCart, Package,
  FolderOpen, LogOut, Heart, Menu, X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/admin/commandes',  icon: ShoppingCart,    label: 'Commandes'  },
  { href: '/admin/produits',   icon: Package,         label: 'Produits'   },
  { href: '/admin/categories', icon: FolderOpen,      label: 'Catégories' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  // Pas de sidebar sur la page login
  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb', overflow: 'hidden' }}>

      {/* Overlay mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 190, display: 'block' }}
          className="lg:hidden"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 256,
        flexShrink: 0,
        background: '#161616',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
        zIndex: 200,
      }}
      className={`
        hidden lg:flex flex-col
        fixed lg:relative inset-y-0 left-0
        ${open ? '!flex' : ''}
      `}
      >
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#C85B80', fontWeight: 600 }}>{"O'Shopping"}</div>
            <div style={{ fontSize: 9, letterSpacing: 2.5, color: '#555', textTransform: 'uppercase', marginTop: 2 }}>by Shaw — Admin</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 4 }} className="lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 14px',
                  borderRadius: 12,
                  marginBottom: 4,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all .2s',
                  background: active ? '#C85B80' : 'transparent',
                  color: active ? 'white' : '#999',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#222' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div style={{ padding: '12px', borderTop: '1px solid #222' }}>
          <Link
            href="/"
            target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, fontSize: 14, color: '#888', textDecoration: 'none', marginBottom: 4 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#222' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <Heart size={16} /> Voir le site
          </Link>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, fontSize: 14, color: '#888', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#888'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#444', marginTop: 12 }}>
            Développé par <span style={{ color: '#C85B80' }}>AURA DIGITAL</span>
          </p>
        </div>
      </aside>

      {/* ── CONTENU ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10, color: '#666' }}
          >
            <Menu size={20} />
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#888' }}>Admin</div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, color: '#C85B80' }}>
              S
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}