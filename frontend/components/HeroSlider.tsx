'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { API_URL } from '@/lib/api'

export default function HeroSlider() {
  const [slides, setSlides] = useState<any[]>([])

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_URL}/products?trending=true`)
        if (res.data?.length) {
          setSlides(res.data)
          return
        }
      } catch (error) {
        console.error("Failed to fetch slides", error)
      }
    }
    
    fetchSlides()
    // ❌ REMOVED `fallback` from this array. 
    // This stops the infinite loop of duplicate API calls!
  }, []) 

  if (!slides.length) return null

  return (
    <section className="pt-[4.25rem]">
      <div className="container mx-auto px-4 pt-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          slidesPerView={1}
          spaceBetween={0}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          // Note: Swiper loop works best when there are at least 3 slides to avoid glitchy cloning
          loop={slides.length > 2} 
          speed={800}
          className="hero-swiper rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}
        >
          {slides.map((item: any, index: number) => (
            // Added index to the key to guarantee 100% uniqueness, even when Swiper clones
            <SwiperSlide key={`${item._id}-${index}`}>
              <Link href={`/product/${item._id}`} className="block">
                <div className="relative h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] w-full">
                  {/* Background Image */}
                  <Image
                    src={item.images?.[0] || '/placeholder.jpg'}
                    alt={item.nameBn || item.name || 'Product Image'}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0} // Only prioritize the first image for better performance
                  />
                  {/* Multi-layer gradient overlay for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 text-white">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white text-xs sm:text-sm font-bold rounded-full mb-3 shadow-lg">
                      <span>🔥</span>
                      <span>ট্রেন্ডিং</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      {item.nameBn || item.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-200 mb-3 md:mb-5 max-w-xl line-clamp-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                      {item.descriptionBn || item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <span className="text-2xl sm:text-3xl font-bold text-orange-400" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        ৳{item.price}
                      </span>
                      <span className="btn-primary px-5 py-2.5 text-sm sm:text-base inline-flex items-center gap-2">
                        এখনই কিনুন
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </span>
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