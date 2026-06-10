// ─────────────────────────────────────────────
// CHEMIN : app/(shop)/boutique/page.tsx
// ─────────────────────────────────────────────
import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/queries'
import BoutiqueClient from './BoutiqueClient'

export const metadata: Metadata = { title: 'Boutique' }

interface Props {
  searchParams: Promise<{ categorie?: string; sort?: string; search?: string }>
}

export default async function BoutiquePage({ searchParams }: Props) {
  // Next.js 15 : searchParams est une Promise
  const params = await searchParams

  const [products, categories] = await Promise.all([
    getProducts({
      category: params.categorie,
      sort:     params.sort as any,
      search:   params.search,
    }),
    getCategories(),
  ])

  return (
    <BoutiqueClient
      initialProducts={products}
      categories={categories}
      searchParams={params}
    />
  )
}