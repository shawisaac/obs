// ─────────────────────────────────────────────
// CHEMIN : src/app/sitemap.ts
// Sitemap automatique — généré à chaque build
// ─────────────────────────────────────────────
import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://oshoppingbyshaw.ci'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              BASE_URL,
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         1.0,
    },
    {
      url:              `${BASE_URL}/boutique`,
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/a-propos`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/contact`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.6,
    },
  ]

  // Pages produits dynamiques
  let productPages: MetadataRoute.Sitemap = []
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)

    if (products) {
      productPages = products.map(p => ({
        url:             `${BASE_URL}/produit/${p.slug}`,
        lastModified:    new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }))
    }
  } catch {}

  // Pages catégories dynamiques
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true)

    if (categories) {
      categoryPages = categories.map(c => ({
        url:             `${BASE_URL}/boutique?categorie=${c.slug}`,
        lastModified:    new Date(c.updated_at),
        changeFrequency: 'weekly' as const,
        priority:        0.7,
      }))
    }
  } catch {}

  return [...staticPages, ...productPages, ...categoryPages]
}