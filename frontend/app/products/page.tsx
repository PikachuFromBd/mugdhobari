'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, Zap, SlidersHorizontal } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRouter } from 'next/navigation'
import { ProductGridSkeleton } from '@/components/Skeletons'

import { API_URL } from '@/lib/api'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      setProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    const cartItem = {
      productId: product._id,
      name: product.nameBn || product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    showToast('কার্টে যোগ করা হয়েছে!', 'success')
  }

  const buyNow = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    const cartItem = {
      productId: product._id,
      name: product.nameBn || product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    }
    localStorage.setItem('cart', JSON.stringify([cartItem]))
    window.dispatchEvent(new Event('cart-updated'))
    router.push('/checkout')
  }

  const cats = [
    { key: 'all', label: 'সব' },
    { key: 'three-piece', label: 'থ্রি-পিস' },
    { key: 'cosmetics', label: 'কসমেটিক্স' },
    { key: 'combo', label: 'কম্বো' },
    { key: 'saree', label: 'শাড়ি' },
    { key: 'tshirt', label: 'টি-শার্ট' },
  ]

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-24 md:pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded-2xl p-5 md:p-8 mb-6 border border-orange-100/50">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide mb-3 shadow-lg shadow-orange-500/25">
              <Zap className="w-3 h-3" /> ALL PRODUCTS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">সব পণ্য</h1>
            <p className="text-gray-500 max-w-2xl text-sm">
              আমাদের পুরো ক্যাটালগ থেকে আপনার পছন্দের পণ্য বেছে নিন
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {cats.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.key
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
                  }`}>
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <p className="text-lg text-gray-500 mb-4">কোনো পণ্য নেই</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">{filtered.length} টি পণ্য পাওয়া গেছে</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filtered.map((product: any) => {
                  const hasDiscount = product.discountPrice && product.discountPrice < product.price
                  return (
                    <Link key={product._id} href={`/product/${product._id}`}>
                      <div className="product-card group">
                        <div className="relative h-44 sm:h-52 md:h-56 overflow-hidden">
                          <Image
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.nameBn || product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                            loading="lazy"
                          />
                          {product.trending && (
                            <span className="fire-badge absolute top-2 right-2">
                              <Zap className="w-3 h-3" /> HOT
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              NEW
                            </span>
                          )}
                          {/* Desktop hover */}
                          <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
                            <div className="flex gap-1.5">
                              <button onClick={(e) => addToCart(e, product)}
                                className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1">
                                <ShoppingCart className="w-3 h-3" /> কার্ট
                              </button>
                              <button onClick={(e) => buyNow(e, product)}
                                className="flex-1 bg-gray-900 text-white py-2 text-xs rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                                এখনই কিনুন
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 sm:p-3.5">
                          <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-800 line-clamp-1">
                            {product.nameBn || product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-orange-500 font-bold text-base sm:text-lg">
                              ৳{(hasDiscount ? product.discountPrice : product.price)?.toLocaleString('bn-BD')}
                            </p>
                            {hasDiscount && (
                              <p className="text-gray-400 text-[11px] line-through">৳{product.price?.toLocaleString('bn-BD')}</p>
                            )}
                          </div>
                          {/* Mobile always-visible buttons */}
                          <div className="flex gap-1.5 sm:hidden">
                            <button onClick={(e) => addToCart(e, product)}
                              className="flex-1 bg-orange-500 text-white py-1.5 text-[11px] rounded-lg font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform">
                              <ShoppingCart className="w-3 h-3" /> কার্ট
                            </button>
                            <button onClick={(e) => buyNow(e, product)}
                              className="flex-1 bg-gray-900 text-white py-1.5 text-[11px] rounded-lg font-semibold active:scale-95 transition-transform">
                              কিনুন
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
