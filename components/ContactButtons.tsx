// ─────────────────────────────────────────────
// CHEMIN : src/components/ContactButtons.tsx
// Boutons WhatsApp + Maps — partie interactive
// ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { MessageCircle, Navigation, MapPin } from 'lucide-react'

interface Props {
  waNumber: string
  mapsUrl:  string
}

export default function ContactButtons({ waNumber, mapsUrl }: Props) {
  const [hovWa,  setHovWa]  = useState(false)
  const [hovMap, setHovMap] = useState(false)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${waNumber}?text=Bonjour%20O'Shopping%20by%20Shaw%20!`}
        target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHovWa(true)}
        onMouseLeave={() => setHovWa(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 20,
          background: 'white', borderRadius: 20, padding: '24px 28px',
          textDecoration: 'none', border: '1px solid #E8F8F0',
          boxShadow: hovWa ? '0 8px 28px rgba(37,211,102,.15)' : '0 2px 16px rgba(37,211,102,.08)',
          transform: hovWa ? 'translateY(-3px)' : 'none',
          transition: 'transform .2s, box-shadow .2s',
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MessageCircle size={26} color="white" fill="white" />
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>Commandez sur WhatsApp</p>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
            Contactez-nous directement pour passer commande ou poser vos questions
          </p>
        </div>
      </a>

      {/* Maps */}
      <a
        href={mapsUrl}
        target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHovMap(true)}
        onMouseLeave={() => setHovMap(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 20,
          background: 'white', borderRadius: 20, padding: '24px 28px',
          textDecoration: 'none', border: '1px solid #EEE8F8',
          boxShadow: hovMap ? '0 8px 28px rgba(200,91,128,.13)' : '0 2px 16px rgba(200,91,128,.06)',
          transform: hovMap ? 'translateY(-3px)' : 'none',
          transition: 'transform .2s, box-shadow .2s',
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #C85B80, #A84468)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Navigation size={26} color="white" />
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
            {"Voir l'itinéraire"}
          </p>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
            <span style={{ color: '#C85B80', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <MapPin size={12} /> Abidjan, Côte d'Ivoire
            </span>
            Ouvre Google Maps avec l'itinéraire
          </p>
        </div>
      </a>
    </div>
  )
}