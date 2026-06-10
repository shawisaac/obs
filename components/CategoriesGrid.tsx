// ─────────────────────────────────────────────
// CHEMIN : src/components/CategoriesGrid.tsx
// Grille catégories — partie interactive
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { Category } from '@/types'

export default function CategoriesGrid({ categories }: { categories: Category[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
      {categories.map(cat => (
        <Link
          key={cat.id}
          href={`/boutique?categorie=${cat.slug}`}
          onMouseEnter={() => setHovered(cat.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            padding: '24px 14px', borderRadius: 16, background: '#FFF4F8',
            textDecoration: 'none', transition: 'transform .25s, box-shadow .25s',
            transform: hovered === cat.id ? 'translateY(-4px)' : 'none',
            boxShadow: hovered === cat.id ? '0 10px 28px rgba(200,91,128,.12)' : 'none',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(200,91,128,.1)' }}>
            <Sparkles size={20} color="#C85B80" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#333', textAlign: 'center', lineHeight: 1.3 }}>
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  )
}