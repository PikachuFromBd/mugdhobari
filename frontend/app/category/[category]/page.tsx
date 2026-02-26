'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart } from 'lucide-react'
import { useToast } from '@/components/Toast'

import { API_URL } from '@/lib/api'

const categoryNames: { [key: string]: string } = {
  'hoodie': 'হুডি',
  'shirt': 'শার্ট',
  'tshirt': 'টি-শার্ট',
  'saree': 'শাড়ি',
  'three-piece': 'থ্রি-পিস',
  'cosmetics': 'কসমেটিক্স',
  'combo': 'কম্বো',
  'shoes': 'জুতা',
  'other': 'অন্যান্য'
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    if (category) {
      fetchProducts()
    }
  }, [category])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/category/${category}`)
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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            {categoryNames[category] || category}
          </h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <p className="text-lg text-gray-500 mb-4">এই ক্যাটাগরিতে কোনো পণ্য নেই</p>
              <Link href="/" className="btn-primary inline-block px-6 py-2.5">
                হোমে ফিরে যান
              </Link>
            </div>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 ${
              products.length === 1 ? 'max-w-xs' : products.length === 2 ? 'max-w-lg' : ''
            }`}>
              {products.map((product: any) => (
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
                        <span className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-md">
                          ট্রেন্ডিং
                        </span>
                      )}
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

