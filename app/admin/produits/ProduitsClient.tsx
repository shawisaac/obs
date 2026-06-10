// ─────────────────────────────────────────────
// CHEMIN : src/app/admin/produits/ProduitsClient.tsx
// Partie client — liste et gestion des produits
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { useRouter } from 'next/navigation'

export default function ProduitsClient({ initialProducts }: { initialProducts: Product[] }) {
  const router   = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = async (product: Product) => {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return
    setDeleting(id)
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} produit{products.length > 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn-primary">
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      {/* Recherche */}
      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." className="input-field pl-10" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Aucun produit trouvé</td></tr>
              ) : filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Produit */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
                        {product.images?.[0] ? (
                          <Image src={product.images[0].url} alt={product.name} width={44} height={44} className="w-full h-full object-cover" />
                        ) : <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-200" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[180px]">{product.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{product.category?.name || '—'}</td>
                  <td className="px-5 py-4 font-semibold text-rose-600 whitespace-nowrap">{formatPrice(product.price)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 5 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock} en stock
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(product)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      title={product.is_active ? 'Désactiver' : 'Activer'}>
                      {product.is_active
                        ? <><ToggleRight size={20} className="text-green-500" /> <span className="text-green-600">Actif</span></>
                        : <><ToggleLeft  size={20} className="text-gray-400" />  <span className="text-gray-400">Inactif</span></>
                      }
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/admin/produits/${product.id}/modifier`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => deleteProduct(product.id)} disabled={deleting === product.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}