// ─────────────────────────────────────────────
// CHEMIN : next.config.ts (racine du projet)
// ─────────────────────────────────────────────
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Désactive l'optimisation serveur — charge les images
    // directement depuis Supabase CDN (fix IP privée)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
    ],
  },
}

export default nextConfig