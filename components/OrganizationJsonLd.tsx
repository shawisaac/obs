// ─────────────────────────────────────────────
// CHEMIN : src/components/ProductJsonLd.tsx
// Données structurées JSON-LD pour Google
// ─────────────────────────────────────────────
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductJsonLd({ product }: Props) {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://oshoppingbyshaw.ci'

  const jsonLd = {
    '@context':     'https://schema.org',
    '@type':        'Product',
    name:           product.name,
    description:    product.description || product.name,
    image:          product.images?.map(img => img.url) || [],
    url:            `${BASE}/produit/${product.slug}`,
    sku:            product.id,
    brand: {
      '@type': 'Brand',
      name:    "O'Shopping by Shaw",
    },
    offers: {
      '@type':          'Offer',
      price:            product.price,
      priceCurrency:    'XOF',
      availability:     product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url:              `${BASE}/produit/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name:    "O'Shopping by Shaw",
      },
    },
    ...(product.compare_price ? {
      offers: {
        '@type':         'AggregateOffer',
        lowPrice:        product.price,
        highPrice:       product.compare_price,
        priceCurrency:   'XOF',
      },
    } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}