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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

type TrendingProductsProps = {
  fallback?: any[]
}

export default function TrendingProducts({ fallback = [] }: TrendingProductsProps) {
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/trending/all`)
      if (response.data?.length) {
        setTrendingProducts(response.data)
        return
      }
    } catch (error) {
      console.error('Error fetching trending products:', error)
    } finally {
      setLoading(false)
    }
    setTrendingProducts(fallback)
  }

  if (loading) {
    return (
      <div className="pt-20 pb-12 bg-gradient-to-r from-orange-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">ট্রেন্ডিং পণ্য</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (trendingProducts.length === 0) return null

  return (
    <section className="pt-24 pb-12 bg-gradient-to-r from-orange-50 to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          ট্রেন্ডিং পণ্য
        </h2>
        
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation
          pagination={{ clickable: true }}
          loop={trendingProducts.length > 4}
          className="pb-12"
        >
          {trendingProducts.map((product: any) => (
            <SwiperSlide key={product._id}>
              <Link href={`/product/${product._id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.nameBn || product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.trending && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                        ট্রেন্ডিং
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                      {product.nameBn || product.name}
                    </h3>
                    <p className="text-orange-500 font-bold text-xl">
                      ৳{product.price.toLocaleString('bn-BD')}
                    </p>
                    {product.stock > 0 ? (
                      <p className="text-green-600 text-sm mt-1">স্টকে আছে</p>
                    ) : (
                      <p className="text-red-600 text-sm mt-1">স্টক শেষ</p>
                    )}
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

