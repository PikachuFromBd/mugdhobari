'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard, Package, ShoppingCart, Warehouse, Users, Image, Settings,
    LogOut, Menu, X, ChevronRight, Store
} from 'lucide-react'

const navGroups = [
    {
        label: 'মূল',
        items: [
            { href: '/admin', label: 'ড্যাশবোর্ড', icon: LayoutDashboard, exact: true },
            { href: '/admin/orders', label: 'অর্ডার', icon: ShoppingCart },
            { href: '/admin/products', label: 'পণ্য', icon: Package },
            { href: '/admin/inventory', label: 'ইনভেন্টরি', icon: Warehouse },
            { href: '/admin/customers', label: 'কাস্টমার', icon: Users },
        ]
    },
    {
        label: 'কনটেন্ট ও সেটিং',
        items: [
            { href: '/admin/content', label: 'কনটেন্ট', icon: Image },
            { href: '/admin/settings', label: 'সেটিং', icon: Settings },
        ]
    }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        if (!token || !userData) { router.push('/login'); return }
        const parsedUser = JSON.parse(userData)
        if (parsedUser.role !== 'admin') { router.push('/'); return }
        setUser(parsedUser)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href
        return pathname === href || pathname.startsWith(href + '/')
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <div className="w-64 bg-gray-900 animate-pulse" />
                <div className="flex-1 p-8 space-y-4">
                    <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
                    <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-white flex flex-col
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 flex-shrink-0">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-sm">MugdhoBari Admin</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">{group.label}</p>
                            <div className="space-y-0.5">
                                {group.items.map(item => {
                                    const Icon = item.icon
                                    const active = isActive(item.href, item.exact)
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${active
                                                    ? 'bg-orange-500/20 text-orange-400'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="flex-1">{item.label}</span>
                                            {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User footer */}
                <div className="border-t border-white/10 p-4 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        লগ আউট
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 sticky top-0 z-30 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800">MugdhoBari</p>
                            <p className="text-xs text-gray-400">Admin Panel</p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Store className="w-3.5 h-3.5" />
                        সাইট দেখুন
                    </Link>
                </header>

                {/* Page */}
                <main className="flex-1 p-5 md:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
