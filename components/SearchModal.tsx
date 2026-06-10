'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const [query,    setQuery]   = useState('')
  const [results,  setResults] = useState<Product[]>([])
  const [loading,  setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*, images:product_images(url, position)')
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
        .limit(6)
      setResults(data || [])
      setLoading(false)
    }, 280)
    return () => clearTimeout(timer)
  }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-16 md:pt-24"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-rose-100">
          <Search size={18} className="text-rose-600 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-1">
            <X size={18} />
          </button>
        </div>

        {/* Résultats */}
        {loading && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">Recherche...</div>
        )}

        {!loading && results.length > 0 && (
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {results.map(product => {
              const img = product.images?.sort((a: any, b: any) => a.position - b.position)[0]?.url
              return (
                <Link
                  key={product.id}
                  href={`/produit/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex-shrink-0 overflow-hidden">
                    {img
                      ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-200" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-xs text-rose-600 font-medium mt-0.5">{formatPrice(product.price)}</div>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            Aucun résultat pour "<span className="text-gray-700">{query}</span>"
          </div>
        )}

        {!query && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            Tapez pour rechercher un produit...
          </div>
        )}
      </div>
    </div>
  )
}