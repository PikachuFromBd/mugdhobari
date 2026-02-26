'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaCheckCircle, FaFacebook, FaWhatsapp, FaTwitter, FaCopy } from 'react-icons/fa'
import { FiShare2 } from 'react-icons/fi'
import { useToast } from '@/components/Toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showToast } = useToast()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`)
      setOrder(response.data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const shareOrder = (platform: string) => {
    const url = window.location.href
    const text = `আমি MugdhoBari থেকে অর্ডার করেছি! অর্ডার আইডি: ${orderId}`

    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      default:
        navigator.clipboard.writeText(url)
        showToast('লিংক কপি করা হয়েছে!', 'info')
        return
    }

    window.open(shareUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 pb-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 pb-12 text-center">
          <h1 className="text-2xl font-bold mb-4">অর্ডার পাওয়া যায়নি</h1>
          <button
            onClick={() => router.push('/')}
            className="text-orange-500 hover:underline"
          >
            হোমে ফিরে যান
          </button>
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
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft p-6 sm:p-8 text-center">
            <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              অর্ডার সফল হয়েছে!
            </h1>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-600 mb-2">আপনার অর্ডার আইডি:</p>
              <p className="text-2xl font-bold text-orange-500 mb-4">{order.orderId}</p>

              <div className="text-left space-y-2 mt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">নাম:</span> {order.customer.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">ইমেইল:</span> {order.customer.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">মোবাইল:</span> {order.customer.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">ঠিকানা:</span> {order.customer.address}
                </p>
                <p className="text-gray-700 mt-4">
                  <span className="font-semibold">মোট মূল্য:</span>{' '}
                  <span className="text-orange-500 font-bold text-xl">
                    ৳{order.totalAmount.toLocaleString('bn-BD')}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">অর্ডার স্ট্যাটাস:</span>{' '}
                  <span className="text-green-600 font-medium">
                    {order.status === 'pending' ? 'পেন্ডিং' :
                      order.status === 'confirmed' ? 'নিশ্চিত' :
                        order.status === 'processing' ? 'প্রক্রিয়াধীন' :
                          order.status === 'shipped' ? 'শিপ করা হয়েছে' :
                            order.status === 'delivered' ? 'ডেলিভার করা হয়েছে' : order.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">অর্ডার শেয়ার করুন:</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => shareOrder('facebook')}
                  className="text-blue-600 hover:text-blue-700 p-3 rounded-full hover:bg-blue-50 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareOrder('whatsapp')}
                  className="text-green-600 hover:text-green-700 p-3 rounded-full hover:bg-green-50 transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareOrder('twitter')}
                  className="text-blue-400 hover:text-blue-500 p-3 rounded-full hover:bg-blue-50 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareOrder('copy')}
                  className="text-gray-600 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copy Link"
                >
                  <FaCopy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                💬 আমাদের সাথে যোগাযোগ করুন:
                <a href="https://facebook.com/mugdhobari" target="_blank" rel="noopener noreferrer" className="ml-2 font-semibold hover:underline">
                  Facebook
                </a>
                {' '}বা{' '}
                <a href="https://wa.me/8801234567890" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                  WhatsApp
                </a>
              </p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="btn-primary px-8 py-3"
            >
              হোমে ফিরে যান
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="pt-24 pb-12 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}