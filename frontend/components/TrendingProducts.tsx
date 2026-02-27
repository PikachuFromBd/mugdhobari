'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { ShoppingCart, Zap } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRouter } from 'next/navigation'

import { API_URL } from '@/lib/api'
import { TrendingSkeleton } from '@/components/Skeletons'

export default function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/trending/all`)
        setTrendingProducts(response.data || [])
      } catch (error) {
        console.error('Error fetching trending products:', error)
      }
      setLoading(false)
    }
    fetchTrending()
  }, [])

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

  if (loading) return <TrendingSkeleton />
  if (trendingProducts.length === 0) return null

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-1.5 rounded-full text-sm font-bold tracking-wide mb-3 shadow-lg shadow-orange-500/25">
            <Zap className="w-3.5 h-3.5" />
            TRENDING NOW
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            সবচেয়ে জনপ্রিয় পণ্য
          </h2>
          <p className="text-gray-400 text-sm mt-1">সবাই যা কিনছে এখন</p>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={trendingProducts.length > 4}
          className="pb-12 trending-swiper"
        >
          {trendingProducts.map((product: any) => {
            const hasDiscount = product.discountPrice && product.discountPrice < product.price
            return (
              <SwiperSlide key={product._id}>
                <Link href={`/product/${product._id}`}>
                  <div className="product-card group">
                    <div className="relative h-52 sm:h-60 overflow-hidden">
                      <Image
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.nameBn || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span className="fire-badge">
                          <Zap className="w-3 h-3" /> HOT
                        </span>
                      </div>
                      {hasDiscount && (
                        <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                      )}
                      {/* Desktop hover overlay */}
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
                    <div className="p-3">
                      <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-800 line-clamp-1">
                        {product.nameBn || product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-orange-500 font-bold text-base sm:text-lg">
                          ৳{(hasDiscount ? product.discountPrice : product.price)?.toLocaleString('bn-BD')}
                        </p>
                        {hasDiscount && (
                          <p className="text-gray-400 text-xs line-through">৳{product.price?.toLocaleString('bn-BD')}</p>
                        )}
                      </div>
                      {/* Mobile always-visible buttons */}
                      <div className="flex gap-1.5 sm:hidden">
                        <button onClick={(e) => addToCart(e, product)}
                          className="flex-1 bg-orange-500 text-white py-2 text-xs rounded-lg font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform">
                          <ShoppingCart className="w-3 h-3" /> কার্ট
                        </button>
                        <button onClick={(e) => buyNow(e, product)}
                          className="flex-1 bg-gray-900 text-white py-2 text-xs rounded-lg font-semibold active:scale-95 transition-transform">
                          কিনুন
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}
