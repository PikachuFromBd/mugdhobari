'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { demoProducts } from '@/lib/demoProducts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const categoryNames: { [key: string]: string } = {
  'hoodie': 'হুডি',
  'shirt': 'শার্ট',
  'tshirt': 'টি-শার্ট',
  'saree': 'শাড়ি',
  'three-piece': 'থ্রি-পিস',
  'shoes': 'জুতা',
  'other': 'অন্যান্য'
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (category) {
      fetchProducts()
    }
  }, [category])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/category/${category}`)
      if (response.data?.length) {
        setProducts(response.data)
        return
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setProducts(demoProducts.filter((p) => p.category === category))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            {categoryNames[category] || category}
          </h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">এই ক্যাটাগরিতে কোনো পণ্য নেই</p>
              <Link
                href="/"
                className="text-orange-500 hover:underline font-medium"
              >
                হোমে ফিরে যান
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <Link key={product._id} href={`/product/${product._id}`}>
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
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

