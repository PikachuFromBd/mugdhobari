'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaFacebook, FaWhatsapp, FaCopy } from 'react-icons/fa'
import { useToast } from '@/components/Toast'
import {
  CheckCircle2, Package, Truck, MapPin, CreditCard,
  Phone, User, ClipboardList, Clock, ChevronDown, ChevronUp,
  Home, Share2, Copy, ShoppingBag
} from 'lucide-react'

import { API_URL } from '@/lib/api'
import { OrderSuccessSkeleton } from '@/components/Skeletons'

/* ── Status pipeline ── */
const STATUSES = [
  { key: 'pending',    label: 'অর্ডার গৃহীত',     icon: ClipboardList },
  { key: 'confirmed',  label: 'নিশ্চিত করা হয়েছে', icon: CheckCircle2  },
  { key: 'packed',     label: 'প্যাক করা হয়েছে',   icon: Package       },
  { key: 'shipped',    label: 'শিপ করা হয়েছে',     icon: Truck         },
  { key: 'delivered',  label: 'ডেলিভার সম্পন্ন',    icon: MapPin        },
]

function getStepIndex(status: string) {
  const idx = STATUSES.findIndex(s => s.key === status)
  return idx === -1 ? 0 : idx
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showToast } = useToast()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAllUpdates, setShowAllUpdates] = useState(false)

  useEffect(() => {
    if (orderId) fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/${orderId}`)
      setOrder(res.data)
    } catch (err) {
      console.error('Error fetching order:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyId = () => {
    navigator.clipboard.writeText(order?.orderId || '')
    showToast('অর্ডার আইডি কপি করা হয়েছে!', 'info')
  }

  const shareOrder = (platform: string) => {
    const url = window.location.href
    const text = `আমি MugdhoBari থেকে অর্ডার করেছি! অর্ডার আইডি: ${orderId}`
    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break
      default:
        navigator.clipboard.writeText(url)
        showToast('লিংক কপি করা হয়েছে!', 'info')
        return
    }
    window.open(shareUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <OrderSuccessSkeleton />
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="pt-32 pb-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gray-800">অর্ডার পাওয়া যায়নি</h1>
          <p className="text-gray-500 mb-6">এই অর্ডার আইডি দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি।</p>
          <button onClick={() => router.push('/')} className="btn-primary px-6 py-2.5">
            হোমে ফিরে যান
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const currentStep = getStepIndex(order.status)
  const isCancelled = order.status === 'cancelled'
  const isReturned  = order.status === 'returned'
  const historyItems = order.statusHistory || []

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* ════════ Success Banner ════════ */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white text-center mb-6 shadow-lg">
            <CheckCircle2 className="w-14 h-14 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">অর্ডার সফল হয়েছে!</h1>
            <p className="text-green-100 text-sm sm:text-base">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে</p>
          </div>

          {/* ════════ Order ID Card ════════ */}
          <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">অর্ডার আইডি</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wide">{order.orderId}</p>
              </div>
              <button
                onClick={copyId}
                className="p-2.5 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
                title="কপি করুন"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* ════════ Shipping Info ════════ */}
          <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">শিপিং তথ্য</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-4.5 h-4.5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">নাম</p>
                  <p className="font-medium text-gray-800">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4.5 h-4.5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">মোবাইল</p>
                  <p className="font-medium text-gray-800">{order.customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">ঠিকানা</p>
                  <p className="font-medium text-gray-800">
                    {order.customer.address}
                    {order.customer.area ? `, ${order.customer.area}` : ''}
                    {order.customer.city ? `, ${order.customer.city}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ════════ Tracking Timeline ════════ */}
          <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">ট্র্যাকিং বিবরণ</h2>

            {isCancelled ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-red-600 font-semibold text-lg">অর্ডারটি বাতিল করা হয়েছে</p>
              </div>
            ) : isReturned ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-yellow-600 font-semibold text-lg">অর্ডারটি রিটার্ন করা হয়েছে</p>
              </div>
            ) : (
              <>
                {/* ── Horizontal stepper (desktop) ── */}
                <div className="hidden sm:block">
                  <div className="flex items-center justify-between relative">
                    {/* Progress line */}
                    <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-200 rounded-full z-0">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-700"
                        style={{ width: `${(currentStep / (STATUSES.length - 1)) * 100}%` }}
                      />
                    </div>
                    {STATUSES.map((step, i) => {
                      const Icon = step.icon
                      const done = i <= currentStep
                      const active = i === currentStep
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10" style={{ width: '20%' }}>
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                            ${done
                              ? active
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110'
                                : 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-400'
                            }
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className={`text-xs mt-2 text-center font-medium leading-tight ${done ? 'text-orange-600' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ── Vertical stepper (mobile) ── */}
                <div className="sm:hidden">
                  <div className="relative pl-8">
                    {/* Vertical line */}
                    <div className="absolute left-[14px] top-0 bottom-0 w-0.5 bg-gray-200">
                      <div
                        className="w-full bg-orange-400 transition-all duration-700"
                        style={{ height: `${(currentStep / (STATUSES.length - 1)) * 100}%` }}
                      />
                    </div>
                    {STATUSES.map((step, i) => {
                      const Icon = step.icon
                      const done = i <= currentStep
                      const active = i === currentStep
                      return (
                        <div key={step.key} className="flex items-center gap-4 mb-6 last:mb-0 relative">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 absolute -left-8 transition-all
                            ${done
                              ? active
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-200 scale-110'
                                : 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-400'
                            }
                          `}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ── Status history timeline ── */}
            {historyItems.length > 0 && (
              <div className="mt-6 pt-5 border-t">
                <button
                  onClick={() => setShowAllUpdates(!showAllUpdates)}
                  className="flex items-center gap-1.5 text-sm text-orange-500 font-medium hover:text-orange-600 transition-colors mb-4"
                >
                  {showAllUpdates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAllUpdates ? 'আপডেট লুকান' : `সব আপডেট দেখুন (${historyItems.length})`}
                </button>
                {showAllUpdates && (
                  <div className="space-y-3 pl-4 border-l-2 border-orange-100">
                    {[...historyItems].reverse().map((h: any, i: number) => (
                      <div key={i} className="relative pl-4">
                        <div className="absolute -left-[9px] top-1.5 w-3 h-3 rounded-full bg-orange-400 border-2 border-white" />
                        <p className="text-sm font-medium text-gray-700 capitalize">
                          {h.status === 'pending' ? 'অর্ডার গৃহীত' :
                           h.status === 'confirmed' ? 'নিশ্চিত করা হয়েছে' :
                           h.status === 'packed' ? 'প্যাক করা হয়েছে' :
                           h.status === 'shipped' ? 'শিপ করা হয়েছে' :
                           h.status === 'delivered' ? 'ডেলিভার সম্পন্ন' :
                           h.status === 'cancelled' ? 'বাতিল' :
                           h.status === 'returned' ? 'রিটার্ন' : h.status}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(h.changedAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ════════ Order Items ════════ */}
          <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">অর্ডারকৃত পণ্য</h2>
            <div className="divide-y">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0].startsWith('http') ? item.product.images[0] : `${API_URL.replace('/api', '')}${item.product.images[0]}`}
                        alt={item.product?.name || 'পণ্য'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{item.product?.name || 'পণ্য'}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>পরিমাণ: {item.quantity}</span>
                      {item.size && <span>| সাইজ: {item.size}</span>}
                      {item.color && <span>| রঙ: {item.color}</span>}
                    </div>
                    <p className="text-orange-500 font-bold text-sm mt-1">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════════ Receipt ════════ */}
          <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">রসিদ</h2>

            {/* Payment method badge */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন পেমেন্ট'}
                </p>
                <p className="text-xs text-gray-500">পেমেন্ট মেথড</p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>পণ্যের মূল্য</span>
                <span>৳{(order.totalAmount - (order.deliveryCharge || 0) + (order.discount || 0)).toLocaleString('bn-BD')}</span>
              </div>
              {order.deliveryCharge > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{order.deliveryCharge.toLocaleString('bn-BD')}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ডিসকাউন্ট</span>
                  <span>-৳{order.discount.toLocaleString('bn-BD')}</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-base">
                <span className="text-gray-800">মোট মূল্য</span>
                <span className="text-orange-500 text-lg">৳{order.totalAmount.toLocaleString('bn-BD')}</span>
              </div>
            </div>
          </div>

          {/* ════════ Share + Actions ════════ */}
          <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">শেয়ার করুন</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => shareOrder('facebook')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <FaFacebook className="w-4 h-4" /> Facebook
              </button>
              <button
                onClick={() => shareOrder('whatsapp')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <FaWhatsapp className="w-4 h-4" /> WhatsApp
              </button>
              <button
                onClick={() => shareOrder('copy')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <FaCopy className="w-3.5 h-3.5" /> কপি
              </button>
            </div>
          </div>

          {/* ════════ Back to Home ════════ */}
          <button
            onClick={() => router.push('/')}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base"
          >
            <Home className="w-5 h-5" />
            কেনাকাটা চালিয়ে যান
          </button>

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
        <OrderSuccessSkeleton />
        <Footer />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}