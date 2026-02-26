'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, X, User, ShoppingCart, Search, Package, ShoppingBag, Shirt, Sparkles, Scissors, ChevronDown } from 'lucide-react'
import axios from 'axios'

import { API_URL } from '@/lib/api'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const updateCartCount = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0))
  }, [])

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      setIsLoggedIn(true)
      try {
        setUserName(JSON.parse(user).name || '')
      } catch { setUserName('') }
    } else {
      setIsLoggedIn(false)
      setUserName('')
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    updateCartCount()
    checkAuth()

    // Listen for cart changes across components
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cart') updateCartCount()
      if (e.key === 'token' || e.key === 'user') checkAuth()
    }
    window.addEventListener('storage', onStorage)

    // Custom event for same-tab cart updates
    const onCartUpdate = () => updateCartCount()
    window.addEventListener('cart-updated', onCartUpdate)

    // Poll cart every 500ms for instant updates
    const interval = setInterval(updateCartCount, 500)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cart-updated', onCartUpdate)
      clearInterval(interval)
    }
  }, [updateCartCount, checkAuth])

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
        setSearchResults([])
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const res = await axios.get(`${API_URL}/products/search/query?q=${encodeURIComponent(query)}`)
      setSearchResults(res.data.slice(0, 6))
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUserName('')
    router.push('/')
  }

  const categories = [
    { name: 'থ্রি-পিস', nameEn: 'three-piece', icon: <Scissors className="w-4 h-4" /> },
    { name: 'কসমেটিক্স', nameEn: 'cosmetics', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'কম্বো', nameEn: 'combo', icon: <Package className="w-4 h-4" /> },
    { name: 'শাড়ি', nameEn: 'saree', icon: <Shirt className="w-4 h-4" /> },
    { name: 'টি-শার্ট', nameEn: 'tshirt', icon: <ShoppingBag className="w-4 h-4" /> },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)]' 
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-[4.25rem]">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/logo.png"
                alt="MugdhoBari Logo"
                width={110}
                height={55}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium text-[15px] rounded-lg hover:bg-orange-50/50">
                হোম
              </Link>
              <div className="relative group">
                <Link href="/products" className="px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium text-[15px] rounded-lg hover:bg-orange-50/50 flex items-center gap-1">
                  ক্যাটাগরি
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 py-2 transform translate-y-1 group-hover:translate-y-0">
                  {categories.map((cat) => (
                    <Link
                      key={cat.nameEn}
                      href={`/category/${cat.nameEn}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors text-sm"
                    >
                      <span className="text-gray-400 group-hover:text-orange-400">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/products" className="px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium text-[15px] rounded-lg hover:bg-orange-50/50">
                সব পণ্য
              </Link>
              <Link href="/about" className="px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium text-[15px] rounded-lg hover:bg-orange-50/50">
                আমাদের সম্পর্কে
              </Link>
              <Link href="/contact" className="px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium text-[15px] rounded-lg hover:bg-orange-50/50">
                যোগাযোগ
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all"
                aria-label="সার্চ"
              >
                <Search className="w-[1.15rem] h-[1.15rem]" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all"
              >
                <ShoppingCart className="w-[1.15rem] h-[1.15rem]" />
                <span className={`absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none transition-all ${
                  cartCount > 0 ? 'bg-orange-500 scale-100' : 'bg-gray-300 scale-90'
                }`}>
                  {cartCount}
                </span>
              </Link>

              {/* Auth */}
              {isLoggedIn ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium">
                    <User className="w-4 h-4" />
                    <span className="max-w-[80px] truncate">{userName || 'প্রোফাইল'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1.5"
                  >
                    লগআউট
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium">
                    <User className="w-4 h-4" />
                    <span>লগইন</span>
                  </Link>
                  <Link href="/signup" className="btn-primary px-4 py-1.5 text-sm">
                    সাইন আপ
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <nav className="py-4 border-t border-gray-100 space-y-1">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                হোম
              </Link>
              <div className="px-3 py-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">ক্যাটাগরি</div>
              {categories.map((cat) => (
                <Link
                  key={cat.nameEn}
                  href={`/category/${cat.nameEn}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 pl-5 pr-3 py-2.5 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  {cat.icon}
                  <span className="font-medium text-sm">{cat.name}</span>
                </Link>
              ))}
              <Link href="/products" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                সব পণ্য
              </Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                আমাদের সম্পর্কে
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                যোগাযোগ
              </Link>
              <div className="pt-3 px-3 space-y-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                    className="w-full text-center bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    লগআউট
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block text-center bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                      লগইন
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="block text-center btn-primary px-4 py-2.5">
                      সাইন আপ
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] animate-fade-in" onClick={() => { setShowSearch(false); setSearchResults([]); setSearchQuery('') }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div ref={searchRef} className="relative max-w-2xl mx-auto mt-20 px-4 animate-slide-down" onClick={e => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="পণ্য খুঁজুন..."
                  className="w-full py-4 text-lg outline-none bg-transparent placeholder-gray-400"
                />
                <button onClick={() => { setShowSearch(false); setSearchResults([]); setSearchQuery('') }} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {searching && (
                <div className="px-5 py-4 text-center text-gray-500 text-sm">খুঁজছে...</div>
              )}
              {searchResults.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((product: any) => (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      onClick={() => { setShowSearch(false); setSearchResults([]); setSearchQuery('') }}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-orange-50 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.nameBn}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{product.nameBn || product.name}</p>
                        <p className="text-orange-500 font-semibold text-sm">৳{product.price?.toLocaleString('bn-BD')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                <div className="px-5 py-6 text-center text-gray-500 text-sm">কোনো পণ্য পাওয়া যায়নি</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
