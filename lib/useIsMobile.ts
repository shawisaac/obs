// ─────────────────────────────────────────────
// CHEMIN : lib/useIsMobile.ts
// Détecte un écran de téléphone (< 768px). Renvoie null avant la mesure.
// ─────────────────────────────────────────────
'use client'

import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 768): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}