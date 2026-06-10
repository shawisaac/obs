// ─────────────────────────────────────────────
// CHEMIN : src/components/FooterLogo.tsx
// Logo footer avec fallback — partie client
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'

export default function FooterLogo() {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#C85B80', fontWeight: 600, lineHeight: 1.1 }}>
          {"O'Shopping"}
        </div>
        <div style={{ fontSize: 9, letterSpacing: 2.5, color: '#555', textTransform: 'uppercase', marginTop: 2 }}>
          by Shaw
        </div>
      </div>
    )
  }

  return (
    <img
      src="/logo.png"
      alt="O'Shopping by Shaw"
      onError={() => setError(true)}
      style={{ height: 40, width: 'auto', objectFit: 'contain', maxWidth: 160 }}
    />
  )
}