// ─────────────────────────────────────────────
// CHEMIN : src/components/AnimatedSection.tsx
// Composant d'animation au scroll
// ─────────────────────────────────────────────
'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
}

export default function AnimatedSection({ children, delay = 0 }: Props) {
  const ref  = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity .7s ${delay}ms ease, transform .7s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  )
}