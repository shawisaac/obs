// ─────────────────────────────────────────────
// CHEMIN : src/hooks/useReveal.ts
// Hook pour animer les éléments au scroll
// ─────────────────────────────────────────────
'use client'

import { useEffect, useRef, useState } from 'react'

type Direction = 'up' | 'left' | 'right'

export function useReveal(direction: Direction = 'up') {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cls = direction === 'left'
    ? 'reveal-left'
    : direction === 'right'
    ? 'reveal-right'
    : 'reveal'

  return { ref, className: `${cls}${visible ? ' visible' : ''}` }
}