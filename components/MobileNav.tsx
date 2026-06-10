'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid2X2, Info, Phone, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/',         label: 'Accueil',  Icon: Home      },
  { href: '/boutique', label: 'Boutique', Icon: Grid2X2   },
  { href: '/a-propos', label: 'À propos', Icon: Info      },
  { href: '/contact',  label: 'Contact',  Icon: Phone     },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { count, openCart } = useCart()

  // Masquer sur les pages admin
  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex items-center justify-around px-2 h-[60px]">
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
            >
              <Icon
                size={20}
                className={cn(
                  'transition-colors',
                  active ? 'text-rose-600' : 'text-gray-400 group-hover:text-rose-500'
                )}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={cn(
                'text-[10px] transition-colors',
                active ? 'text-rose-600 font-medium' : 'text-gray-400'
              )}>
                {label}
              </span>
            </Link>
          )
        })}

        {/* Panier */}
        <button
          onClick={openCart}
          className="flex flex-col items-center gap-0.5 flex-1 py-1 group relative"
        >
          <div className="relative">
            <ShoppingBag
              size={20}
              className="text-gray-400 group-hover:text-rose-500 transition-colors"
              strokeWidth={1.5}
            />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400">Panier</span>
        </button>
      </div>
    </nav>
  )
}