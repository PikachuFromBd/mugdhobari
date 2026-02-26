'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, MessageCircle, ShoppingCart } from 'lucide-react'

const navItems = [
  { href: '/', label: 'হোম', icon: Home },
  { href: '/products', label: 'ক্যাটাগরি', icon: Grid3X3 },
  { href: 'https://wa.me/8801234567890', label: 'চ্যাট', icon: MessageCircle, external: true },
  { href: '/cart', label: 'কার্ট', icon: ShoppingCart, showBadge: true },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartCount(cart.length)
      } catch { setCartCount(0) }
    }
    updateCount()
    window.addEventListener('cart-updated', updateCount)
    window.addEventListener('storage', updateCount)
    return () => {
      window.removeEventListener('cart-updated', updateCount)
      window.removeEventListener('storage', updateCount)
    }
  }, [])

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = !item.external && pathname === item.href
          const commonClasses =
            'flex flex-col items-center justify-center py-2.5 text-[11px] font-medium transition-colors relative'
          const activeClasses = isActive ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${commonClasses} ${activeClasses}`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                {item.label}
              </a>
            )
          }

          return (
            <Link key={item.href} href={item.href} className={`${commonClasses} ${activeClasses}`}>
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.showBadge && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-orange-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </div>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
