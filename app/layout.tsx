import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: "O'Shopping by Shaw — Décoration Intérieure",
    template: "%s | O'Shopping by Shaw",
  },
  description: "Boutique de décoration intérieure premium à Abidjan. Meubles, vases, miroirs, textiles. Livraison en Côte d'Ivoire. Paiement à la livraison.",
  keywords: ['décoration', 'meubles', 'Abidjan', "Côte d'Ivoire", 'design', 'intérieur'],
  creator: 'AURA DIGITAL',
  openGraph: {
    type: 'website',
    locale: 'fr_CI',
    siteName: "O'Shopping by Shaw",
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#C85B80',
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
              style: {
                background: '#1A1A1A',
                color: '#fff',
                borderRadius: '100px',
                fontSize: '13px',
                padding: '10px 20px',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}