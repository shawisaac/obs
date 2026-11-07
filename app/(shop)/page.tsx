// ─────────────────────────────────────────────
// CHEMIN : app/(shop)/page.tsx
// ─────────────────────────────────────────────
import Link from 'next/link'
import { ArrowRight, Truck, CreditCard, Package, MessageCircle, Sparkles } from 'lucide-react'
import ContactButtons from '@/components/ContactButtons'
import { getFeaturedProducts, getNewProducts } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import AnimatedSection from '@/components/AnimatedSection'

// Toujours afficher les produits à jour (pas de cache de la page)
export const dynamic = 'force-dynamic'
export const revalidate = 0

const FEATURES = [
  { Icon: Truck,         title: 'Livraison rapide',   sub: 'Abidjan & toute la CI'   },
  { Icon: CreditCard,    title: 'Paiement livraison', sub: 'Zéro frais cachés'        },
  { Icon: Package,       title: 'Emballage soigné',   sub: 'Chaque commande protégée' },
  { Icon: MessageCircle, title: 'Support WhatsApp',   sub: 'Réponse rapide 7j/7'      },
]

export default async function HomePage() {
  const [featured, newProducts] = await Promise.all([
    getFeaturedProducts(), getNewProducts(),
  ])
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') || '2250000000000'
  // Mettez votre lien Google Maps exact dans .env.local (NEXT_PUBLIC_MAPS_URL)
  const mapsUrl = process.env.NEXT_PUBLIC_MAPS_URL || 'https://maps.google.com/?q=Abidjan,Cote+d+Ivoire'

  return (
    <>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg, #FFF4F8 0%, #FAFAF8 60%, #FFF0F5 100%)', padding: '72px 24px 56px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(200,91,128,.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(200,91,128,.04)', pointerEvents: 'none' }} />
        <div className="container-shop" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FCE8F0', color: '#C85B80', borderRadius: 100, padding: '6px 16px', fontSize: 11.5, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20, animation: 'fadeUp .7s ease both' }}>
            <Sparkles size={12} /> Boutique Multi-Produits Premium
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(38px,7vw,72px)', fontWeight: 300, lineHeight: 1.12, marginBottom: 20, color: '#1A1A1A', animation: 'fadeUp .7s .1s ease both' }}>
            Tout ce dont vous<br /><em style={{ color: '#C85B80' }}>avez besoin</em>
          </h1>
          <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 36px', animation: 'fadeUp .7s .2s ease both' }}>
            {"Décoration, meubles, valises, verres, balançoires et bien plus encore. Livraison partout en Côte d'Ivoire avec paiement à la livraison."}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp .7s .3s ease both' }}>
            <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C85B80', color: 'white', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Voir la boutique <ArrowRight size={16} />
            </Link>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: 'white', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1fr', gap: 14, maxWidth: 900, margin: '52px auto 0', height: 220 }}>
            <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #F4D0E4, #ECC0D4)', opacity: .75 }} />
            <div style={{ borderRadius: 20, background: 'linear-gradient(145deg, #FCE4F0, #F8D0E8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Georgia, serif', color: '#C85B80', fontSize: 20, fontStyle: 'italic', opacity: .5 }}>{"O'Shopping by Shaw"}</span>
            </div>
            <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #EDE0C4, #E0D0A8)', opacity: .75 }} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div style={{ background: 'white', borderTop: '1px solid #F5E8F0', borderBottom: '1px solid #F5E8F0' }}>
        <div className="container-shop" style={{ padding: '20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
            {FEATURES.map(({ Icon, title, sub }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} color="#C85B80" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>{title}</p>
                  <p style={{ fontSize: 11.5, color: '#aaa' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUITS VEDETTES */}
      {featured.length > 0 && (
        <AnimatedSection delay={100}>
          <section style={{ background: '#FAFAF8', padding: '64px 0' }}>
            <div className="container-shop">
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <p style={{ fontSize: 11, color: '#C85B80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 }}>Sélection</p>
                <div style={{ width: 40, height: 2, background: '#C85B80', margin: '0 auto 14px' }} />
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>Coups de Cœur</h2>
                <p style={{ color: '#aaa', fontSize: 14 }}>Nos pièces les plus appréciées</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#C85B80', border: '1.5px solid #C85B80', background: 'transparent', padding: '12px 32px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Voir toute la boutique <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* BANNIÈRE */}
      <AnimatedSection delay={150}>
        <section style={{ background: '#C85B80', padding: '72px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,54px)', fontWeight: 300, color: 'white', marginBottom: 14, lineHeight: 1.2 }}>Nouvelle Collection</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.85)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
              Découvrez nos nouveautés — décoration, mobilier, bagagerie et bien plus.
            </p>
            <Link href="/boutique?sort=newest" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#C85B80', padding: '13px 32px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Voir les nouveautés <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* NOUVELLES ARRIVÉES */}
      {newProducts.length > 0 && (
        <AnimatedSection delay={100}>
          <section style={{ background: 'white', padding: '64px 0' }}>
            <div className="container-shop">
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <p style={{ fontSize: 11, color: '#C85B80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 }}>Tendances</p>
                <div style={{ width: 40, height: 2, background: '#C85B80', margin: '0 auto 14px' }} />
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 300, color: '#1A1A1A' }}>Nouvelles Arrivées</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                {newProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* WHATSAPP + MAPS */}
      <AnimatedSection>
        <section style={{ background: '#FAFAF8', padding: '56px 24px' }}>
          <div className="container-shop">
            <ContactButtons waNumber={waNumber} mapsUrl={mapsUrl} />
          </div>
        </section>
      </AnimatedSection>
    </>
  )
}