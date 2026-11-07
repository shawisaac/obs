// ─────────────────────────────────────────────
// CHEMIN : src/components/Footer.tsx
// ─────────────────────────────────────────────
import Link from 'next/link'
import { MapPin, Mail, MessageCircle, Phone} from 'lucide-react'
import FooterLogo from './FooterLogo'

const FacebookIcon  = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g,'') || '225'

const SOCIALS = [
  { Icon: FacebookIcon,  label: 'Facebook',  href: 'https://www.facebook.com/Oshoppingbyshaw/?http_ref=eyJ0cyI6MTc5NDA1NzM4MTAwMCwiciI6IiJ9',  bg: '#1877F2'                                                   },
  { Icon: TikTokIcon,    label: 'TikTok',    href: 'https://www.tiktok.com/@shawshopping?_r=1&_t=ZS-9BCtewIxnRh',    bg: '#010101'                                                   },
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/oshopping_by_shaw?dlrf=MWJtM24xNWszdnI4eg==', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
  { Icon: MessageCircle, label: 'WhatsApp',  href: `https://wa.me/${waNumber}`, bg: '#25D366'                                               },
]

const LIENS = [
  { href: '/',         label: 'Accueil'  },
  { href: '/boutique', label: 'Boutique' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact',  label: 'Contact'  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#161616', color: '#666' }}>
      <div className="container-shop" style={{ padding: '52px 0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px 32px', marginBottom: 48 }}>

          {/* MARQUE */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <FooterLogo />
            </div>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.75, maxWidth: 220, marginBottom: 24 }}>
              Votre boutique en ligne pour des produits de qualité, livrés partout en Côte d'Ivoire.
            </p>
            {/* Réseaux sociaux */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SOCIALS.map(({ Icon, label, href, bg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  style={{ width: 38, height: 38, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', flexShrink: 0 }}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* LIENS RAPIDES */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: '#aaa', fontWeight: 600, marginBottom: 20 }}>Liens rapides</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LIENS.map(({ href, label }) => (
                <Link key={href} href={href}
                  style={{ fontSize: 13.5, color: '#666', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: '#aaa', fontWeight: 600, marginBottom: 20 }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                [MessageCircle, 'WhatsApp disponible'       ] as const,
                [Mail,          'contact@oshoppingbyshaw.ci'] as const,
                [MapPin,        "Abidjan, Côte d'Ivoire"    ] as const,
                [Phone,         'Service client 7j/7'       ] as const,
              ].map(([Icon, text], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#666' }}>
                  <Icon size={14} color="#C85B80" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bas du footer */}
        <div style={{ borderTop: '1px solid #222', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#444' }}>
            © {new Date().getFullYear()} {"O'Shopping by Shaw"}. Tous droits réservés.
          </span>
          <span style={{ fontSize: 12, color: '#444', display: 'flex', alignItems: 'center', gap: 5 }}>
            Développé par{' '}
            <span style={{ color: '#C85B80', fontWeight: 600 }}>AURA DIGITAL</span>
          </span>
        </div>
      </div>
    </footer>
  )
}