'use client'

import Link from 'next/link'
import Image from 'next/image'

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
  { name: 'থ্রি-পিস', nameEn: 'three-piece', icon: '🧕', color: 'bg-purple-100' },
  { name: 'কসমেটিক্স', nameEn: 'cosmetics', icon: '💄', color: 'bg-pink-100' },
  { name: 'কম্বো', nameEn: 'combo', icon: '🎁', color: 'bg-orange-100' },
  { name: 'শাড়ি', nameEn: 'saree', icon: '👗', color: 'bg-red-100' },
  { name: 'টি-শার্ট', nameEn: 'tshirt', icon: '👕', color: 'bg-green-100' },
]

export default function CategorySection({ products, loading }: CategorySectionProps) {
  const getProductsByCategory = (category: string) => {
    return products.filter((p: Product) => p.category === category).slice(0, 4)
  }

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.nameEn)
          if (categoryProducts.length === 0) return null

          return (
            <div key={category.nameEn} className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center space-x-2">
                  <span className="text-3xl">{category.icon}</span>
                  <span>{category.name}</span>
                </h2>
                <Link
                  href={`/category/${category.nameEn}`}
                  className="text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-1"
                >
                  <span>সব দেখুন</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product: Product) => (
                  <Link key={product._id} href={`/product/${product._id}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                      <div className="relative h-60 sm:h-64 overflow-hidden">
                        <Image
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.nameBn || product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
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
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

