'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useToast } from '@/components/Toast'
import { ShieldCheck, Truck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { API_URL } from '@/lib/api'

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

export default function Checkout() {
  const router = useRouter()
  const { showToast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    area: '',
    paymentMethod: 'cod'
  })

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (savedCart.length === 0) { router.push('/cart'); return }
    setCart(savedCart)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const deliveryCharge = formData.city.toLowerCase().includes('ঢাকা') || formData.city.toLowerCase().includes('dhaka') ? 60 : 120
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const grandTotal = totalAmount + deliveryCharge

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.address) {
      showToast('নাম, ফোন এবং ঠিকানা আবশ্যক', 'error'); return
    }
    setLoading(true)
    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email || 'guest@mugdhobari.com',
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          area: formData.area
        },
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        paymentMethod: formData.paymentMethod,
        deliveryCharge
      }
      const response = await axios.post(`${API_URL}/orders`, orderData)
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cart-updated'))
      router.push(`/order-success?orderId=${response.data.orderId}`)
    } catch (error: any) {
      showToast('অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/cart" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">অর্ডার করুন</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Order Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-soft p-5 sm:p-6">
              <h2 className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" /> গ্রাহক তথ্য
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5 text-sm">নাম <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="input-field" placeholder="আপনার নাম" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5 text-sm">মোবাইল নম্বর <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                      className="input-field" placeholder="01XXXXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5 text-sm">ইমেইল (ঐচ্ছিক)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="input-field" placeholder="example@mail.com" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5 text-sm">শহর/জেলা</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className="input-field" placeholder="ঢাকা" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5 text-sm">এলাকা</label>
                    <input type="text" name="area" value={formData.area} onChange={handleChange}
                      className="input-field" placeholder="মিরপুর, উত্তরা..." />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5 text-sm">সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span></label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required rows={3}
                    className="input-field" placeholder="বাড়ি নং, রাস্তা, এলাকা..." />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5 text-sm">পেমেন্ট পদ্ধতি</label>
                  <div className="flex gap-3">
                    <label className={`flex-1 flex items-center gap-2.5 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange}
                        className="text-orange-500 focus:ring-orange-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-800">ক্যাশ অন ডেলিভারি</p>
                        <p className="text-xs text-gray-400">পণ্য পেয়ে মূল্য পরিশোধ</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'প্রসেসিং...' : 'অর্ডার নিশ্চিত করুন'}
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4 text-gray-800">অর্ডার সারাংশ</h2>
                <div className="space-y-3 mb-5">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × ৳{item.price.toLocaleString('bn-BD')}
                          {item.size && ` • ${item.size}`}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm ml-3">
                        ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>সাবটোটাল</span>
                    <span>৳{totalAmount.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 items-center">
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> ডেলিভারি</span>
                    <span>৳{deliveryCharge}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>সর্বমোট</span>
                      <span className="text-orange-500">৳{grandTotal.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
