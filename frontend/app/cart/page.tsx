'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { CartSkeleton } from '@/components/Skeletons'

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

export default function Cart() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
    setLoading(false)
  }, [])

  const updateQuantity = (index: number, change: number) => {
    const newCart = [...cart]
    newCart[index].quantity = Math.max(1, newCart[index].quantity + change)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setCart(newCart)
    window.dispatchEvent(new Event('cart-updated'))
  }

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setCart(newCart)
    window.dispatchEvent(new Event('cart-updated'))
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <CartSkeleton />
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-24 md:pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">আমার কার্ট</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-lg text-gray-600 font-medium mb-1">আপনার কার্ট খালি</p>
              <p className="text-sm text-gray-400 mb-5">পণ্য ব্রাউজ করে কার্টে যোগ করুন</p>
              <button onClick={() => router.push('/products')} className="btn-primary px-6 py-2.5 inline-flex items-center gap-2">
                কেনাকাটা শুরু করুন
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-soft p-4 sm:p-5 flex gap-4">
                    <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-0.5 truncate">{item.name}</h3>
                      <p className="text-orange-500 font-bold text-lg mb-1">
                        ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                      </p>
                      <div className="flex flex-wrap gap-1.5 text-xs text-gray-500 mb-3">
                        {item.size && <span className="bg-gray-100 px-2 py-0.5 rounded-md">সাইজ: {item.size}</span>}
                        {item.color && <span className="bg-gray-100 px-2 py-0.5 rounded-md">রঙ: {item.color}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button onClick={() => updateQuantity(index, -1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(index, 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Plus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-soft p-5 sticky top-20">
                  <h2 className="text-lg font-bold mb-4 text-gray-800">অর্ডার সারাংশ</h2>
                  <div className="space-y-3 mb-5 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>মোট পণ্য</span>
                      <span>{cart.length} টি</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>মোট পরিমাণ</span>
                      <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} টি</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>সর্বমোট</span>
                        <span className="text-orange-500">৳{totalAmount.toLocaleString('bn-BD')}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => router.push('/checkout')}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                    অর্ডার করুন
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
