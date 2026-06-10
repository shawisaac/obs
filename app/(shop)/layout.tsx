// ─────────────────────────────────────────────
// CHEMIN : app/(shop)/layout.tsx
// ─────────────────────────────────────────────
import Header      from '@/components/Header'
import Footer      from '@/components/Footer'
import MobileNav   from '@/components/MobileNav'
import CartSidebar from '@/components/CartSidebar'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, paddingBottom: 68 }}>
        {children}
      </main>
      <Footer />
      <MobileNav />
      <CartSidebar />
    </div>
  )
}