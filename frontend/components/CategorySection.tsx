'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package, ShoppingBag, Shirt, Sparkles, Scissors, ChevronRight, ShoppingCart } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface Product {
  _id: string
  name: string
  nameBn: string
  price: number
  images: string[]
  category: string
  stock: number
}

interface CategorySectionProps {
  products: Product[]
  loading: boolean
}

const categories = [
  { name: 'থ্রি-পিস', nameEn: 'three-piece', icon: <Scissors className="w-5 h-5" />, color: 'bg-purple-50 text-purple-500' },
  { name: 'কসমেটিক্স', nameEn: 'cosmetics', icon: <Sparkles className="w-5 h-5" />, color: 'bg-pink-50 text-pink-500' },
  { name: 'কম্বো', nameEn: 'combo', icon: <Package className="w-5 h-5" />, color: 'bg-orange-50 text-orange-500' },
  { name: 'শাড়ি', nameEn: 'saree', icon: <Shirt className="w-5 h-5" />, color: 'bg-red-50 text-red-500' },
  { name: 'টি-শার্ট', nameEn: 'tshirt', icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-green-50 text-green-500' },
]

export default function CategorySection({ products, loading }: CategorySectionProps) {
  const { showToast } = useToast()

  const getProductsByCategory = (category: string) => {
    return products.filter((p: Product) => p.category === category).slice(0, 4)
  }

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    const cartItem = {
      productId: product._id,
      name: product.nameBn || product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    showToast('কার্টে যোগ করা হয়েছে!', 'success')
  }

  if (loading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.nameEn)
          if (categoryProducts.length === 0) return null

          return (
            <div key={category.nameEn} className="mb-10 md:mb-14">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl ${category.color}`}>{category.icon}</span>
                  <span>{category.name}</span>
                </h2>
                <Link
                  href={`/category/${category.nameEn}`}
                  className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-0.5 text-sm group"
                >
                  <span>সব দেখুন</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 ${
                categoryProducts.length === 1 ? 'max-w-xs' : categoryProducts.length === 2 ? 'max-w-lg' : ''
              }`}>
                {categoryProducts.map((product: Product) => (
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
                        {/* Quick add to cart */}
                        <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <button
                            onClick={(e) => addToCart(e, product)}
                            className="w-full btn-primary py-2 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            কার্টে যোগ করুন
                          </button>
                        </div>
                      </div>
                      <div className="p-3 sm:p-3.5">
                        <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-800 line-clamp-1">
                          {product.nameBn || product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-orange-500 font-bold text-base sm:text-lg">
                            ৳{product.price?.toLocaleString('bn-BD')}
                          </p>
                          {product.stock > 0 ? (
                            <span className="text-green-600 text-[11px] font-medium bg-green-50 px-1.5 py-0.5 rounded-full hidden sm:inline">স্টকে আছে</span>
                          ) : (
                            <span className="text-red-600 text-[11px] font-medium bg-red-50 px-1.5 py-0.5 rounded-full hidden sm:inline">স্টক শেষ</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
