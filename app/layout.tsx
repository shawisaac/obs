// ─────────────────────────────────────────────
// CHEMIN : src/app/layout.tsx
// ─────────────────────────────────────────────
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://oshoppingbyshaw.ci'
const SITE_NAME = "O'Shopping by Shaw"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  `${SITE_NAME} — Boutique en ligne Côte d'Ivoire`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "O'Shopping by Shaw : boutique en ligne à Abidjan proposant décoration, meubles, valises, verres, balançoires et bien plus. Livraison partout en Côte d'Ivoire. Paiement à la livraison.",

  keywords: [
    "boutique en ligne Abidjan",
    "shopping Côte d'Ivoire",
    "décoration intérieure Abidjan",
    "meubles Abidjan",
    "livraison Côte d'Ivoire",
    "paiement à la livraison",
    "O'Shopping by Shaw",
  ],

  authors:  [{ name: SITE_NAME, url: SITE_URL }],
  creator:  'AURA DIGITAL',
  publisher: SITE_NAME,

  // Open Graph
  openGraph: {
    type:      'website',
    locale:    'fr_CI',
    url:       SITE_URL,
    siteName:  SITE_NAME,
    title:     `${SITE_NAME} — Boutique en ligne Côte d'Ivoire`,
    description: "Boutique en ligne à Abidjan : décoration, meubles, valises et plus. Livraison partout en Côte d'Ivoire.",
    images: [{
      url:    '/og-image.jpg',
      width:  1200,
      height: 630,
      alt:    `${SITE_NAME} — Boutique en ligne`,
    }],
  },

  // Twitter / X
  twitter: {
    card:        'summary_large_image',
    title:       `${SITE_NAME} — Boutique en ligne`,
    description: "Boutique en ligne Abidjan — Livraison partout en Côte d'Ivoire.",
    images:      ['/og-image.jpg'],
  },

  // Robots
  robots: {
    index:                     true,
    follow:                    true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  // Verification Google Search Console
  // verification: { google: 'VOTRE_CODE_GOOGLE_SEARCH_CONSOLE' },

  // Alternate lang
  alternates: {
    canonical: SITE_URL,
    languages: { 'fr-CI': SITE_URL },
  },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor:   '#C85B80',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-cream-50 text-gray-900 antialiased">
        <CartProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 2500,
              style: { background: '#1A1A1A', color: '#fff', borderRadius: '100px', fontSize: '13px', padding: '10px 20px' },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}