// ─────────────────────────────────────────────
// CHEMIN : src/components/admin/AdminSidebar.tsx
// Sidebar du dashboard admin
// ─────────────────────────────────────────────
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart,
  FolderOpen, LogOut, X, Heart
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard'   },
  { href: '/admin/commandes',  icon: ShoppingCart,    label: 'Commandes'   },
  { href: '/admin/produits',   icon: Package,         label: 'Produits'    },
  { href: '/admin/categories', icon: FolderOpen,      label: 'Catégories'  },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[190] lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={cn('admin-sidebar bg-[#161616] flex flex-col h-screen sticky top-0', isOpen && 'open')}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="font-serif text-xl text-rose-600 font-semibold leading-tight">O'Shopping</div>
            <div className="text-[9px] tracking-[2px] text-gray-500 uppercase mt-0.5">by Shaw — Admin</div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-rose-600 text-white shadow-rose-sm'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="px-4 pb-6 border-t border-gray-800 pt-4 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <Heart size={17} />
            Voir le site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>

        <div className="px-6 pb-5 text-[10px] text-gray-700 text-center">
          Développé par <span className="text-rose-600">AURA DIGITAL</span>
        </div>
      </aside>
    </>
  )
}