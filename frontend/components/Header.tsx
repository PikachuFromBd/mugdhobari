'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMenu, FiX, FiUser, FiShoppingCart, FiSearch } from 'react-icons/fi'
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Load cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.length)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categories = [
    { name: 'থ্রি-পিস', nameEn: 'three-piece', icon: '🧕' },
    { name: 'কসমেটিক্স', nameEn: 'cosmetics', icon: '💄' },
    { name: 'কম্বো', nameEn: 'combo', icon: '🎁' },
    { name: 'শাড়ি', nameEn: 'saree', icon: '👗' },
    { name: 'টি-শার্ট', nameEn: 'tshirt', icon: '👕' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="MugdhoBari Logo"
              width={120}
              height={60}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              হোম
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center">
                ক্যাটাগরি
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {categories.map((cat) => (
                  <Link
                    key={cat.nameEn}
                    href={`/category/${cat.nameEn}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/products" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              সব পণ্য
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              আমাদের সম্পর্কে
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              যোগাযোগ
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/search" className="text-gray-700 hover:text-orange-500 transition-colors">
              <FiSearch className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-orange-500 transition-colors">
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/login" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
              <FiUser className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">লগইন</span>
            </Link>
            <Link href="/signup" className="hidden sm:block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
              সাইন আপ
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-orange-500 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                হোম
              </Link>
              <div className="space-y-2">
                <div className="text-gray-700 font-medium mb-2">ক্যাটাগরি:</div>
                {categories.map((cat) => (
                  <Link
                    key={cat.nameEn}
                    href={`/category/${cat.nameEn}`}
                    className="block pl-4 text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
              <Link href="/products" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                সব পণ্য
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                আমাদের সম্পর্কে
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                যোগাযোগ
              </Link>
              <Link href="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-center">
                সাইন আপ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

