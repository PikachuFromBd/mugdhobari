'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

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
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
    setLoading(false)
  }

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-12 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">আমার কার্ট</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <p className="text-lg text-gray-500 mb-4">আপনার কার্ট খালি</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary px-6 py-2.5"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-soft p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 text-gray-800">{item.name}</h3>
                      <p className="text-orange-500 font-bold text-lg mb-2">
                        ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                      </p>
                      {item.size && (
                        <p className="text-gray-600 text-sm mb-1">সাইজ: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-gray-600 text-sm mb-1">রঙ: {item.color}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center space-x-2 border rounded-lg">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-soft p-5 sticky top-20">
                  <h2 className="text-xl font-bold mb-5 text-gray-800">অর্ডার সারাংশ</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>মোট পণ্য:</span>
                      <span>{cart.length} টি</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>মোট পরিমাণ:</span>
                      <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} টি</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span>মোট মূল্য:</span>
                        <span className="text-orange-500">৳{totalAmount.toLocaleString('bn-BD')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full btn-primary py-3"
                  >
                    অর্ডার করুন
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

