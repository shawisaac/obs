// ─────────────────────────────────────────────
// CHEMIN : app/(shop)/a-propos/page.tsx
// ─────────────────────────────────────────────
// Pour la photo de la fondatrice :
// → Placez votre photo dans : public/fondatrice.jpg
//   (formats acceptés : JPG, PNG, WEBP)
// ─────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Package, Truck, Heart, ArrowRight, Check } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import FounderPhoto from '@/components/FounderPhoto'

export const metadata: Metadata = { title: 'À propos' }

const VALEURS = [
  { icon: Sparkles, titre: 'Élégance',      desc: "Chaque pièce est choisie pour sa beauté, son raffinement et sa capacité à transformer un espace ordinaire en quelque chose d'exceptionnel." },
  { icon: Package,  titre: 'Qualité',       desc: 'Nous sélectionnons rigoureusement chaque produit pour sa durabilité, ses finitions soignées et ses matériaux de qualité supérieure.' },
  { icon: Truck,    titre: 'Accessibilité', desc: "Livraison disponible partout en Côte d'Ivoire avec paiement à la livraison pour votre tranquillité d'esprit totale." },
  { icon: Heart,    titre: 'Passion',       desc: "L'amour du beau intérieur est au cœur de chaque décision que nous prenons, de la sélection des produits au service client." },
]

const CHIFFRES = [
  { val: '500+', label: 'Clients satisfaits'       },
  { val: '50+',  label: 'Références disponibles'   },
  { val: '7j/7', label: 'Support disponible'       },
  { val: '100%', label: 'Paiement à la livraison'  },
]

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(145deg, #C85B80, #A84468)', padding: '80px 24px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600, opacity: .75, marginBottom: 16 }}>Notre Histoire</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,6vw,62px)', fontWeight: 300, lineHeight: 1.15, marginBottom: 18, animation: 'fadeUp .8s ease both' }}>
            Bienvenue chez<br /><em>{"O'Shopping by Shaw"}</em>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, opacity: .85, animation: 'fadeUp .8s .15s ease both' }}>
            Une boutique née d'une passion et d'un désir de rendre des produits de qualité accessibles à tous en Côte d'Ivoire.
          </p>
        </div>
      </section>

      {/* CHIFFRES */}
      <AnimatedSection>
        <div style={{ background: 'white', borderBottom: '1px solid #F5E0EA' }}>
          <div className="container-shop" style={{ padding: '40px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
              {CHIFFRES.map(({ val, label }) => (
                <div key={label} style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 300, color: '#C85B80', marginBottom: 6 }}>{val}</p>
                  <p style={{ fontSize: 12.5, color: '#888', fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* HISTOIRE + PHOTO */}
      <AnimatedSection delay={100}>
        <section style={{ background: 'white', padding: '80px 24px' }}>
          <div className="container-shop">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
              {/* Texte */}
              <div>
                <p style={{ fontSize: 11, color: '#C85B80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12 }}>La fondatrice</p>
                <div style={{ width: 40, height: 2, background: '#C85B80', marginBottom: 16 }} />
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 300, color: '#1A1A1A', marginBottom: 20, lineHeight: 1.25 }}>
                  Une vision,<br /><em style={{ color: '#C85B80' }}>une passion</em>
                </h2>
                <p style={{ color: '#666', lineHeight: 1.9, fontSize: 15, marginBottom: 16 }}>
                  {"Passionnée depuis toujours, la fondatrice d'O'Shopping by Shaw a créé cette boutique avec une mission claire : rendre accessible à tous les Ivoiriens des produits de qualité à des prix justes."}
                </p>
                <p style={{ color: '#666', lineHeight: 1.9, fontSize: 15, marginBottom: 28 }}>
                  Chaque produit de notre collection est sélectionné avec soin. Notre ambition : vous offrir le meilleur, livré directement chez vous partout en Côte d'Ivoire.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                  {[
                    "Sélection rigoureuse de chaque produit",
                    "Livraison dans toute la Côte d'Ivoire",
                    "Paiement à la livraison sans frais",
                    "Service client disponible 7j/7",
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#555' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color="#C85B80" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C85B80', color: 'white', padding: '13px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Découvrir la boutique <ArrowRight size={15} />
                </Link>
              </div>

              {/* Photo fondatrice — composant client avec fallback */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <FounderPhoto />
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* VALEURS */}
      <AnimatedSection delay={100}>
        <section style={{ background: '#FAFAF8', padding: '64px 24px' }}>
          <div className="container-shop">
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <p style={{ fontSize: 11, color: '#C85B80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 }}>Ce qui nous guide</p>
              <div style={{ width: 40, height: 2, background: '#C85B80', margin: '0 auto 14px' }} />
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 300, color: '#1A1A1A' }}>Nos Valeurs</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {VALEURS.map(({ icon: Icon, titre, desc }) => (
                <div key={titre} style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #F5E0EA', boxShadow: '0 2px 16px rgba(200,91,128,.05)', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <Icon size={24} color="#C85B80" />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>{titre}</h3>
                  <p style={{ fontSize: 13.5, color: '#888', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </>
  )
}