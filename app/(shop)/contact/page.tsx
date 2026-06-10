// ─────────────────────────────────────────────
// CHEMIN : app/(shop)/contact/page.tsx
// ─────────────────────────────────────────────
import type { Metadata } from 'next'
import { MessageCircle, Mail, MapPin, Clock, Phone } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import ContactForm from './ContactForm'

export const metadata: Metadata = { title: 'Contact' }

const INFOS = [
  { icon: MessageCircle, titre: 'WhatsApp', valeur: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+225 XX XX XX XX', sub: 'Disponible 7j/7 — Réponse rapide' },
  { icon: Mail,          titre: 'Email',    valeur: 'contact@oshoppingbyshaw.ci',                                  sub: 'Réponse sous 24h' },
  { icon: MapPin,        titre: 'Adresse',  valeur: "Abidjan, Côte d'Ivoire",                                      sub: 'Livraison nationale disponible' },
  { icon: Clock,         titre: 'Horaires', valeur: 'Lun–Sam, 8h–20h',                                            sub: 'Dimanche sur WhatsApp' },
]

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(145deg, #FFF4F8, #FAFAF8)', padding: '64px 24px 48px', textAlign: 'center' }}>
        <div className="container-shop">
          <p style={{ fontSize: 11, color: '#C85B80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12, animation: 'fadeUp .7s ease both' }}>Nous joindre</p>
          <div style={{ width: 40, height: 2, background: '#C85B80', margin: '0 auto 14px', animation: 'fadeUp .7s .05s ease both' }} />
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,50px)', fontWeight: 300, color: '#1A1A1A', marginBottom: 14, animation: 'fadeUp .7s .1s ease both' }}>
            Contactez-nous
          </h1>
          <p style={{ fontSize: 15, color: '#888', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, animation: 'fadeUp .7s .2s ease both' }}>
            Notre équipe est là pour vous aider à trouver les pièces parfaites pour votre intérieur. N'hésitez pas à nous écrire !
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <AnimatedSection delay={100}>
        <div className="container-shop" style={{ padding: '56px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }}>
            {/* Infos de contact */}
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 300, color: '#1A1A1A', marginBottom: 28 }}>Nos coordonnées</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {INFOS.map(({ icon: Icon, titre, valeur, sub }) => (
                  <div key={titre} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#FFF4F8', borderRadius: 16, padding: '18px 20px', border: '1px solid #F5E0EA' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: '#FCE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={19} color="#C85B80" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#C85B80', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{titre}</p>
                      <p style={{ fontSize: 14.5, fontWeight: 500, color: '#1A1A1A', marginBottom: 3 }}>{valeur}</p>
                      <p style={{ fontSize: 12.5, color: '#aaa' }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div style={{ marginTop: 28, borderRadius: 20, overflow: 'hidden', height: 200, background: 'linear-gradient(135deg, #FFF4F8, #F9E0EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F5E0EA' }}>
                <div style={{ textAlign: 'center' }}>
                  <MapPin size={32} color="#C85B80" style={{ margin: '0 auto 10px', display: 'block' }} strokeWidth={1.5} />
                  <p style={{ fontSize: 13, color: '#C85B80', fontWeight: 500 }}>Abidjan, Côte d'Ivoire</p>
                  <p style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>Livraison nationale disponible</p>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 300, color: '#1A1A1A', marginBottom: 28 }}>Envoyez-nous un message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection delay={100}>
        <section style={{ background: '#FAFAF8', padding: '56px 24px' }}>
          <div className="container-shop">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 300, color: '#1A1A1A' }}>Questions fréquentes</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
              {[
                { q: "Comment se passe la livraison ?", r: "Nous livrons partout en Côte d'Ivoire. Vous payez à la réception de votre commande, aucun paiement en avance n'est requis." },
                { q: "Puis-je retourner un produit ?", r: "Oui, si le produit reçu ne correspond pas à la description, contactez-nous sur WhatsApp dans les 48h après réception." },
                { q: "Comment passer une commande ?", r: "Ajoutez les produits au panier, renseignez vos informations de livraison et confirmez. C'est tout, aucun compte requis !" },
                { q: "Combien de temps dure la livraison ?", r: "Généralement 24 à 72h pour Abidjan. Pour l'intérieur du pays, comptez 3 à 5 jours ouvrables." },
              ].map(({ q, r }) => (
                <div key={q} style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #F5E0EA' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>{q}</h3>
                  <p style={{ fontSize: 13.5, color: '#777', lineHeight: 1.7 }}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </>
  )
}