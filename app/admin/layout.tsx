// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/layout.tsx
// ─────────────────────────────────────────────
'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ShoppingCart, Package, FolderOpen, LogOut, Heart, Menu, X } from 'lucide-react'
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
  const [open,     setOpen]     = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Détecter mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fermer le menu au changement de page
  useEffect(() => { setOpen(false) }, [pathname])

  // Page de connexion : pas de menu
  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const sidebarStyle: React.CSSProperties = {
    width:         256,
    flexShrink:    0,
    background:    '#161616',
    display:       'flex',
    flexDirection: 'column',
    height:        '100dvh',
    zIndex:        200,
    transition:    'transform .3s ease',
    ...(isMobile ? {
      position:  'fixed',
      top:       0,
      left:      0,
      bottom:    0,
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      boxShadow: open ? '8px 0 32px rgba(0,0,0,.3)' : 'none',
    } : {
      position: 'sticky',
      top:      0,
    }),
  }

  const currentLabel = NAV.find(n => n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href))?.label || 'Admin'

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#f9fafb', overflow: 'hidden' }}>

      {/* Fond sombre mobile */}
      {isMobile && open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 190 }} />
      )}

      {/* ── MENU GAUCHE ── */}
      <aside style={sidebarStyle}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#C85B80', fontWeight: 700 }}>{"O'Shopping"}</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#555', textTransform: 'uppercase', marginTop: 1 }}>by Shaw — Admin</div>
          </div>
          {isMobile && (
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', padding: 4 }}>
              <X size={18} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 12, marginBottom: 4,
                  fontSize: 14, fontWeight: 500, textDecoration: 'none',
                  background: active ? '#C85B80' : 'transparent',
                  color:      active ? 'white'   : '#999',
                  transition: 'background .2s, color .2s',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#222'; (e.currentTarget as HTMLElement).style.color = 'white' } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#999' } }}
              >
                <Icon size={17} /> {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid #222', flexShrink: 0 }}>
          <Link href="/" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, fontSize: 14, color: '#888', textDecoration: 'none', marginBottom: 4 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#222'; (e.currentTarget as HTMLElement).style.color = 'white' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#888' }}>
            <Heart size={16} /> Voir le site
          </Link>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, fontSize: 14, color: '#888', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,.15)'; (e.currentTarget as HTMLElement).style.color = '#f87171' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#888' }}>
            <LogOut size={16} /> Déconnexion
          </button>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#444', marginTop: 10 }}>
            Développé par <span style={{ color: '#C85B80' }}>AURA DIGITAL</span>
          </p>
        </div>
      </aside>

      {/* ── CONTENU ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 12px', height: 56, display: 'flex', alignItems: 'center', flexShrink: 0, gap: 8 }}>
          {isMobile && (
            <button onClick={() => setOpen(true)} aria-label="Menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10, color: '#555', display: 'flex' }}>
              <Menu size={22} />
            </button>
          )}
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{currentLabel}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            {!isMobile && <div style={{ fontSize: 12, color: '#aaa' }}>Admin</div>}
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#C85B80' }}>S</div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: isMobile ? '16px 12px 32px' : '24px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}