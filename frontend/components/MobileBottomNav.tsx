'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiGrid, FiMessageSquare, FiUser } from 'react-icons/fi'

const navItems = [
  { href: '/', label: 'হোম', icon: FiHome },
  { href: '/products', label: 'ক্যাটাগরি', icon: FiGrid },
  { href: 'https://wa.me/8801234567890', label: 'চ্যাট', icon: FiMessageSquare, external: true },
  { href: '/login', label: 'অ্যাকাউন্ট', icon: FiUser },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = !item.external && pathname === item.href
          const commonClasses =
            'flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors'
          const activeClasses = isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${commonClasses} ${activeClasses}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                {item.label}
              </a>
            )
          }

          return (
            <Link key={item.href} href={item.href} className={`${commonClasses} ${activeClasses}`}>
              <Icon className="w-5 h-5 mb-1" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
