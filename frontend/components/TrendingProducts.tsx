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
import { ShoppingCart } from 'lucide-react'
import { useToast } from '@/components/Toast'

import { API_URL } from '@/lib/api'

type TrendingProductsProps = {
  fallback?: any[]
}

export default function TrendingProducts({ fallback = [] }: TrendingProductsProps) {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/trending/all`)
      if (response.data?.length) {
        setTrendingProducts(response.data)
        setLoading(false)
        return
      }
    } catch (error) {
      console.error('Error fetching trending products:', error)
    }
    setTrendingProducts(fallback)
    setLoading(false)
  }

  const addToCart = (e: React.MouseEvent, product: any) => {
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
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">🔥 ট্রেন্ডিং পণ্য</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  if (trendingProducts.length === 0) return null

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            🔥 ট্রেন্ডিং পণ্য
          </h2>
          <p className="text-gray-500 text-sm md:text-base">সবচেয়ে জনপ্রিয় পণ্যগুলো দেখুন</p>
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
          pagination={{ clickable: true }}
          loop={trendingProducts.length > 4}
          className="pb-12"
        >
          {trendingProducts.map((product: any) => (
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
                    <span className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-md">
                      ট্রেন্ডিং
                    </span>
                    {/* Add to cart overlay button */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={(e) => addToCart(e, product)}
                        className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        কার্টে যোগ করুন
                      </button>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-semibold text-sm sm:text-base mb-1.5 text-gray-800 line-clamp-1">
                      {product.nameBn || product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-orange-500 font-bold text-base sm:text-lg">
                        ৳{product.price?.toLocaleString('bn-BD')}
                      </p>
                      {product.stock > 0 ? (
                        <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">স্টকে আছে</span>
                      ) : (
                        <span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">স্টক শেষ</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

