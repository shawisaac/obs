// ─────────────────────────────────────────────
// CHEMIN : src/components/FounderPhoto.tsx
// ─────────────────────────────────────────────
// Pour ajouter la photo de la fondatrice :
// → Placez votre photo dans : public/fondatrice.jpg
//   (ou .png, .webp)
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'

export default function FounderPhoto() {
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {!error ? (
        // Affiche la photo si public/fondatrice.jpg existe
        <div style={{ width: 300, height: 380, borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(200,91,128,.2)' }}>
          <img
            src="/fondatrice.jpg"
            alt="La fondatrice"
            onError={() => setError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>
      ) : (
        // Placeholder si pas de photo
        <div style={{ width: 300, height: 380, borderRadius: 28, background: 'linear-gradient(145deg, #FFF4F8, #F9E0EE)', border: '2px dashed #F0C0D4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={30} color="#C85B80" strokeWidth={1.5} />
          </div>
          <div style={{ textAlign: 'center', padding: '0 28px' }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#888', marginBottom: 6 }}>Photo de la fondatrice</p>
            <p style={{ fontSize: 12, color: '#bbb', lineHeight: 1.5 }}>
              Placez votre photo dans<br />
              <code style={{ background: '#FFF4F8', padding: '2px 6px', borderRadius: 4, fontSize: 11, color: '#C85B80' }}>public/fondatrice.jpg</code>
            </p>
          </div>
        </div>
      )}
      {/* Décorations */}
      <div style={{ position: 'absolute', bottom: -16, right: -16, width: 120, height: 120, borderRadius: 16, background: '#FCE8F0', zIndex: -1 }} />
      <div style={{ position: 'absolute', top: -12, left: -12, width: 80, height: 80, borderRadius: '50%', background: '#FEF3C7', zIndex: -1 }} />
    </div>
  )
}