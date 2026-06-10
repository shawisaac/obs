// ─────────────────────────────────────────────
// CHEMIN : src/app/(shop)/boutique/BoutiqueClient.tsx
// Partie client de la page boutique (filtres)
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import type { Product, Category } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  initialProducts: Product[]
  categories: Category[]
  searchParams: { categorie?: string; sort?: string; search?: string }
}

const SORT_OPTIONS = [
  { value: '',           label: 'Plus récents'     },
  { value: 'price_asc',  label: 'Prix croissant'   },
  { value: 'price_desc', label: 'Prix décroissant'  },
]

export default function BoutiqueClient({ initialProducts, categories, searchParams }: Props) {
  const router   = useRouter()
  const [filterOpen, setFilterOpen] = useState(false)

  const activeCategory = searchParams.categorie || ''
  const activeSort     = searchParams.sort || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (key !== 'categorie' && activeCategory) params.set('categorie', activeCategory)
    if (key !== 'sort'      && activeSort)     params.set('sort', activeSort)
    if (value) params.set(key, value)
    router.push(`/boutique${params.toString() ? '?' + params.toString() : ''}`)
  }

  const clearFilters = () => router.push('/boutique')
  const hasFilters   = !!(activeCategory || activeSort)

  return (
    <div className="container-shop py-8 md:py-12">
      {/* En-tête */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif font-light text-3xl md:text-4xl text-gray-900 mb-1">La Boutique</h1>
        <p className="text-sm text-gray-400">{initialProducts.length} produit{initialProducts.length > 1 ? 's' : ''}</p>
      </div>

      {/* Filtres desktop */}
      <div className="hidden md:flex items-center gap-3 mb-8 flex-wrap">
        {/* Catégories */}
        <button
          onClick={() => updateFilter('categorie', '')}
          className={cn('filter-pill text-sm px-4 py-2 rounded-full border transition-all',
            !activeCategory
              ? 'bg-rose-600 border-rose-600 text-white font-medium'
              : 'border-rose-200 text-gray-600 hover:border-rose-600 hover:text-rose-600'
          )}
        >
          Tous
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => updateFilter('categorie', cat.slug)}
            className={cn('filter-pill text-sm px-4 py-2 rounded-full border transition-all',
              activeCategory === cat.slug
                ? 'bg-rose-600 border-rose-600 text-white font-medium'
                : 'border-rose-200 text-gray-600 hover:border-rose-600 hover:text-rose-600'
            )}
          >
            {cat.name}
          </button>
        ))}

        {/* Séparateur + tri */}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={activeSort}
            onChange={e => updateFilter('sort', e.target.value)}
            className="text-sm border border-rose-200 rounded-xl px-4 py-2 focus:outline-none focus:border-rose-600 bg-white text-gray-700 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-rose-600 transition-colors px-3 py-2">
              <X size={14} /> Effacer
            </button>
          )}
        </div>
      </div>

      {/* Filtres mobile */}
      <div className="flex items-center gap-2 md:hidden mb-5">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 border border-rose-200 rounded-xl py-2.5 text-sm text-gray-700 hover:border-rose-600"
        >
          <SlidersHorizontal size={15} /> Filtres {hasFilters && <span className="bg-rose-600 text-white text-[10px] rounded-full px-1.5 py-0.5">!</span>}
        </button>
        <select
          value={activeSort}
          onChange={e => updateFilter('sort', e.target.value)}
          className="flex-1 text-sm border border-rose-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-600 bg-white text-gray-700"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Modal filtres mobile */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 pb-10 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-base">Filtrer par catégorie</h3>
              <button onClick={() => setFilterOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { updateFilter('categorie', ''); setFilterOpen(false) }}
                className={cn('px-4 py-2 rounded-full text-sm border transition-all', !activeCategory ? 'bg-rose-600 border-rose-600 text-white' : 'border-rose-200 text-gray-600')}>
                Tous
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { updateFilter('categorie', cat.slug); setFilterOpen(false) }}
                  className={cn('px-4 py-2 rounded-full text-sm border transition-all', activeCategory === cat.slug ? 'bg-rose-600 border-rose-600 text-white' : 'border-rose-200 text-gray-600')}>
                  {cat.name}
                </button>
              ))}
            </div>
            {hasFilters && (
              <button onClick={() => { clearFilters(); setFilterOpen(false) }} className="mt-5 w-full text-sm text-gray-400 flex items-center justify-center gap-2">
                <X size={14} /> Effacer tous les filtres
              </button>
            )}
          </div>
        </>
      )}

      {/* GRILLE PRODUITS */}
      {initialProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-base mb-4">Aucun produit trouvé</p>
          <button onClick={clearFilters} className="btn-outline text-sm">Voir tous les produits</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {initialProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}