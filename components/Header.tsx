// ─────────────────────────────────────────────
// CHEMIN : src/components/Header.tsx
// ─────────────────────────────────────────────
// Pour ajouter votre logo :
// → Placez votre fichier logo dans : public/logo.png
//   (formats acceptés : PNG, JPG, SVG, WEBP)
// ─────────────────────────────────────────────
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import SearchModal from './SearchModal'

const NAV = [
  { href: '/',         label: 'Accueil'  },
  { href: '/boutique', label: 'Boutique' },
  { href: '/a-propos', label: "À propos" },
  { href: '/contact',  label: 'Contact'  },
]

export default function Header() {
  const pathname = usePathname()
  const { count, openCart } = useCart()

  const [isMobile,    setIsMobile]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [logoError,   setLogoError]   = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Bande annonce */}
      <div style={{ background: '#C85B80', color: 'white', textAlign: 'center', padding: '8px 16px', fontSize: isMobile ? 11 : 12.5, lineHeight: 1.4 }}>
        {isMobile ? 'Paiement à la livraison' : "Livraison disponible à Abidjan & partout en Côte d'Ivoire  ·  Paiement à la livraison"}
      </div>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '1px solid #F0E2EA', boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,.06)' : 'none', transition: 'box-shadow .2s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: isMobile ? 56 : 64, gap: 8 }}>

          {/* ── LOGO ── */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
            {!logoError ? (
              // Affiche le logo image si public/logo.png existe
              <img
                src="/logo.png"
                alt="O'Shopping by Shaw"
                onError={() => setLogoError(true)}
                style={{ height: isMobile ? 36 : 44, width: 'auto', objectFit: 'contain', maxWidth: 160 }}
              />
            ) : (
              // Fallback texte si pas de logo
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 17 : 20, fontWeight: 700, color: '#C85B80', lineHeight: 1.1 }}>
                  {"O'Shopping"}
                </div>
                <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#bbb', textTransform: 'uppercase', marginTop: 1 }}>
                  by Shaw
                </div>
              </div>
            )}
          </Link>

          {/* Nav desktop */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap',
                  color: pathname === href ? '#C85B80' : '#444',
                  fontWeight: pathname === href ? 600 : 400,
                  borderBottom: pathname === href ? '2px solid #C85B80' : '2px solid transparent',
                  paddingBottom: 2, transition: 'color .2s',
                }}>
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button type="button" onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10, color: '#555', display: 'flex' }}>
              <Search size={isMobile ? 18 : 20} />
            </button>
            <button type="button" onClick={openCart}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 10, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShoppingBag size={isMobile ? 20 : 22} />
              {count > 0 && (
                <span style={{ background: '#C85B80', color: 'white', borderRadius: 100, padding: '1px 7px', fontSize: 11, fontWeight: 700, lineHeight: 1.6, minWidth: 20, textAlign: 'center' }}>
                  {count}
                </span>
              )}
            </button>
            {isMobile && (
              <button type="button" onClick={() => setMenuOpen(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10, color: '#333', display: 'flex' }}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {isMobile && menuOpen && (
          <div style={{ position: 'fixed', top: 88, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 40, display: 'flex', flexDirection: 'column', padding: '8px 0', overflowY: 'auto' }}>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontSize: 18, fontWeight: pathname === href ? 700 : 400,
                color: pathname === href ? '#C85B80' : '#1A1A1A',
                textDecoration: 'none', padding: '18px 24px', borderBottom: '1px solid #FFF0F5',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                {label}
                {pathname === href && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C85B80', display: 'inline-block' }} />}
              </Link>
            ))}
            <div style={{ padding: 24, marginTop: 'auto' }}>
              <div style={{ background: '#FFF4F8', borderRadius: 14, padding: '16px 18px' }}>
                <p style={{ fontSize: 13, color: '#C85B80', fontWeight: 600, marginBottom: 4 }}>{"O'Shopping by Shaw"}</p>
                <p style={{ fontSize: 12.5, color: '#888', lineHeight: 1.6 }}>Paiement à la livraison · Livraison partout en CI</p>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}