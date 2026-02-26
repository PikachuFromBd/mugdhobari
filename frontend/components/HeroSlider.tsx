'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { DemoProduct } from '@/lib/demoProducts'

type HeroSliderProps = {
  fallback?: DemoProduct[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function HeroSlider({ fallback = [] }: HeroSliderProps) {
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
        // ignore, use fallback
      }
      setSlides(fallback)
    }
    fetchSlides()
  }, [fallback])

  if (!slides.length) return null

  return (
    <section className="pt-20 md:pt-24 bg-gradient-to-r from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <p className="text-orange-500 font-semibold">মুগ্ধবাড়ি এক্সক্লুসিভ</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              ট্রেন্ডিং পণ্যে পান সেরা ডিল
            </h1>
            <p className="text-gray-600">
              হুডি, শাড়ি, থ্রি-পিস, টি-শার্ট এবং আরও অনেক কিছু এখন এক ক্লিকে। ট্রেন্ডিং সংগ্রহ দেখুন।
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/products"
                className="bg-orange-500 text-white px-5 py-3 rounded-lg font-semibold shadow hover:bg-orange-600 transition-colors"
              >
                সব পণ্য দেখুন
              </Link>
              <Link
                href="/cart"
                className="bg-white text-orange-500 px-5 py-3 rounded-lg font-semibold shadow border border-orange-100 hover:border-orange-300 transition-colors"
              >
                কার্টে যান
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={16}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={slides.length > 1}
              className="rounded-2xl shadow-xl bg-white"
            >
              {slides.map((item: any) => (
                <SwiperSlide key={item._id}>
                  <Link href={`/product/${item._id}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 items-center">
                      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={item.images?.[0] || '/placeholder.jpg'}
                          alt={item.nameBn || item.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          priority
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm text-orange-500 font-semibold">ট্রেন্ডিং</p>
                        <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
                          {item.nameBn || item.name}
                        </h3>
                        <p className="text-gray-700 line-clamp-3">
                          {item.descriptionBn || item.description}
                        </p>
                        <p className="text-2xl font-bold text-orange-500">৳{item.price}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                            এখনই কিনুন
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                            ফ্রি পরামর্শ
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}
