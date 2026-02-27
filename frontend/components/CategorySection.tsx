'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package, ShoppingBag, Shirt, Sparkles, Scissors, ChevronRight, ShoppingCart } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRouter } from 'next/navigation'
import { CategorySkeleton } from '@/components/Skeletons'

interface Product {
  _id: string
  name: string
  nameBn: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
  stock: number
}

interface CategorySectionProps {
  products: Product[]
  loading: boolean
}

const categories = [
  { name: 'থ্রি-পিস', nameEn: 'three-piece', icon: <Scissors className="w-5 h-5" />, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50' },
  { name: 'কসমেটিক্স', nameEn: 'cosmetics', icon: <Sparkles className="w-5 h-5" />, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50' },
  { name: 'কম্বো', nameEn: 'combo', icon: <Package className="w-5 h-5" />, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50' },
  { name: 'শাড়ি', nameEn: 'saree', icon: <Shirt className="w-5 h-5" />, color: 'from-red-500 to-pink-500', bg: 'bg-red-50' },
  { name: 'টি-শার্ট', nameEn: 'tshirt', icon: <ShoppingBag className="w-5 h-5" />, color: 'from-emerald-500 to-green-500', bg: 'bg-green-50' },
]

export default function CategorySection({ products, loading }: CategorySectionProps) {
  const { showToast } = useToast()
  const router = useRouter()

  const getProductsByCategory = (category: string) => {
    return products.filter((p: Product) => p.category === category).slice(0, 4)
  }

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    const cartItem = {
      productId: product._id,
      name: product.nameBn || product.name,
      price: (product as any).discountPrice || product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    showToast('কার্টে যোগ করা হয়েছে!', 'success')
  }

  const buyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    const cartItem = {
      productId: product._id,
      name: product.nameBn || product.name,
      price: (product as any).discountPrice || product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    }
    localStorage.setItem('cart', JSON.stringify([cartItem]))
    window.dispatchEvent(new Event('cart-updated'))
    router.push('/checkout')
  }

  if (loading) return <CategorySkeleton />

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.nameEn)
          if (categoryProducts.length === 0) return null

          return (
            <div key={category.nameEn} className="mb-10 md:mb-14">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className={`p-2.5 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                    {category.icon}
                  </span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{category.name}</h2>
                    <p className="text-xs text-gray-400 hidden sm:block">{category.nameEn.toUpperCase()}</p>
                  </div>
                </div>
                <Link
                  href={`/category/${category.nameEn}`}
                  className="text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-0.5 text-sm group bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <span>সব দেখুন</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 ${categoryProducts.length === 1 ? 'max-w-xs' : categoryProducts.length === 2 ? 'max-w-lg' : ''
                }`}>
                {categoryProducts.map((product: Product) => {
                  const p = product as any
                  const hasDiscount = p.discountPrice && p.discountPrice < p.price
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
                          {hasDiscount && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF
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
                              ৳{(hasDiscount ? p.discountPrice : product.price)?.toLocaleString('bn-BD')}
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
            </div>
          )
        })}
      </div>
    </section>
  )
}
