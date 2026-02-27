'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, Package, RefreshCw, Printer, MessageCircle, Truck } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminBadge from '@/components/admin/ui/AdminBadge'
import AdminButton from '@/components/admin/ui/AdminButton'
import { AdminSkeletonDetail } from '@/components/admin/ui/AdminSkeleton'
import { useToast } from '@/components/Toast'

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned']
const STATUS_LABELS: Record<string, string> = {
    pending: 'পেন্ডিং', confirmed: 'কনফার্মড', packed: 'প্যাকড',
    shipped: 'শিপড', delivered: 'ডেলিভার্ড', cancelled: 'বাতিল', returned: 'রিটার্ন'
}

export default function OrderDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { showToast } = useToast()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [statusLoading, setStatusLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [courierName, setCourierName] = useState('')
    const [trackingId, setTrackingId] = useState('')
    const [notes, setNotes] = useState('')

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${API_URL}/admin/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            setOrder(res.data)
            setCourierName(res.data.courierName || '')
            setTrackingId(res.data.trackingId || '')
            setNotes(res.data.notes || '')
        } catch {
            showToast('অর্ডার খুঁজে পাওয়া যায়নি', 'error')
        } finally { setLoading(false) }
    }

    useEffect(() => { if (id) fetchOrder() }, [id])

    const updateStatus = async (status: string) => {
        setStatusLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.patch(`${API_URL}/admin/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
            setOrder(res.data)
            showToast('স্ট্যাটাস আপডেট হয়েছে', 'success')
        } catch { showToast('আপডেট করতে সমস্যা হয়েছে', 'error') }
        finally { setStatusLoading(false) }
    }

    const saveOrderDetails = async () => {
        setSaveLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.patch(`${API_URL}/admin/orders/${id}`, { courierName, trackingId, notes }, { headers: { Authorization: `Bearer ${token}` } })
            setOrder(res.data)
            showToast('তথ্য সংরক্ষণ হয়েছে', 'success')
        } catch { showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error') }
        finally { setSaveLoading(false) }
    }

    const whatsappConfirmed = () => {
        if (!order) return
        const msg = encodeURIComponent(`আস্সালামু আলাইকুম ${order.customer.name} ভাই/আপু,\n\n✅ আপনার অর্ডার #${order.orderId} কনফার্ম হয়েছে!\n\nMugdhoBari এর পক্ষ থেকে ধন্যবাদ।`)
        window.open(`https://wa.me/${order.customer.phone}?text=${msg}`, '_blank')
    }
    const whatsappShipped = () => {
        if (!order) return
        const msg = encodeURIComponent(`আস্সালামু আলাইকুম ${order.customer.name} ভাই/আপু,\n\n🚚 আপনার অর্ডার #${order.orderId} পাঠানো হয়েছে!\n\nকুরিয়ার: ${courierName}\nট্র্যাকিং: ${trackingId}\n\nMugdhoBari`)
        window.open(`https://wa.me/${order.customer.phone}?text=${msg}`, '_blank')
    }

    if (loading) return <div className="space-y-4"><div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4" /><AdminSkeletonDetail /></div>
    if (!order) return <div className="text-center py-20 text-gray-400">অর্ডার পাওয়া যায়নি</div>

    const subtotal = order.items?.reduce((s: number, i: any) => s + (i.price * i.quantity), 0) || 0
    const total = subtotal + (order.deliveryCharge || 0) - (order.discount || 0)

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/orders" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 font-mono">{order.orderId}</h1>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('bn-BD')}</p>
                </div>
                <div className="ml-auto">
                    <AdminBadge variant={order.status as any} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* LEFT — customer + items + summary */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Customer */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-orange-500" /> কাস্টমার তথ্য</h2>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><p className="text-xs text-gray-400">নাম</p><p className="font-medium text-gray-800">{order.customer.name}</p></div>
                            <div><p className="text-xs text-gray-400">ফোন</p><p className="font-medium text-gray-800">{order.customer.phone}</p></div>
                            <div><p className="text-xs text-gray-400">ইমেইল</p><p className="font-medium text-gray-800">{order.customer.email}</p></div>
                            <div><p className="text-xs text-gray-400">পেমেন্ট</p><AdminBadge variant={(order.paymentMethod || 'cod') as any} /></div>
                            <div className="col-span-2"><p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> ঠিকানা</p><p className="font-medium text-gray-800">{order.customer.address}</p></div>
                            {order.customer.city && <div><p className="text-xs text-gray-400">শহর/জেলা</p><p className="font-medium text-gray-800">{order.customer.city}{order.customer.area && `, ${order.customer.area}`}</p></div>}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Package className="w-4 h-4 text-orange-500" />
                            <h2 className="text-sm font-semibold text-gray-700">পণ্য তালিকা</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    {item.product?.images?.[0] && (
                                        <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.product?.nameBn || 'পণ্য'}</p>
                                        <p className="text-xs text-gray-400">
                                            {item.size && `সাইজ: ${item.size}`}{item.color && ` • রঙ: ${item.color}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">৳{item.price} × {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">মূল্য সারসংক্ষেপ</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600"><span>সাবটোটাল</span><span>৳{subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-gray-600"><span>ডেলিভারি চার্জ</span><span>৳{(order.deliveryCharge || 0).toLocaleString()}</span></div>
                            {(order.discount || 0) > 0 && <div className="flex justify-between text-emerald-600"><span>ডিসকাউন্ট</span><span>-৳{order.discount.toLocaleString()}</span></div>}
                            <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2"><span>মোট</span><span>৳{total.toLocaleString()}</span></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — actions + courier + notes */}
                <div className="space-y-4">
                    {/* Status update */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">স্ট্যাটাস পরিবর্তন</h2>
                        <div className="space-y-2">
                            {STATUSES.map(s => (
                                <button key={s} disabled={statusLoading || order.status === s}
                                    onClick={() => updateStatus(s)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border
                    ${order.status === s
                                            ? 'bg-orange-50 border-orange-300 text-orange-700'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }
                  `}>
                                    {order.status === s && '✓ '}{STATUS_LABELS[s]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Courier */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Truck className="w-4 h-4" /> কুরিয়ার তথ্য</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">কুরিয়ার নাম</label>
                                <input value={courierName} onChange={e => setCourierName(e.target.value)}
                                    placeholder="যেমন: Pathao, Steadfast"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">ট্র্যাকিং ID</label>
                                <input value={trackingId} onChange={e => setTrackingId(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">নোট (অভ্যন্তরীণ)</label>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                            </div>
                            <AdminButton variant="primary" size="sm" className="w-full" loading={saveLoading} onClick={saveOrderDetails}>
                                সংরক্ষণ করুন
                            </AdminButton>
                        </div>
                    </div>

                    {/* WhatsApp Templates */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp টেমপ্লেট</h2>
                        <div className="space-y-2">
                            <AdminButton variant="success" size="sm" className="w-full" onClick={whatsappConfirmed}>অর্ডার কনফার্ম মেসেজ</AdminButton>
                            <AdminButton variant="secondary" size="sm" className="w-full" onClick={whatsappShipped}>শিপিং মেসেজ</AdminButton>
                        </div>
                    </div>

                    {/* Print */}
                    <AdminButton variant="ghost" size="sm" className="w-full border border-gray-300"
                        icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
                        প্রিন্ট ইনভয়েস
                    </AdminButton>
                </div>
            </div>

            {/* Status Timeline */}
            {order.statusHistory?.length > 0 && (
                <div className="mt-5 bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">স্ট্যাটাস ইতিহাস</h2>
                    <div className="space-y-2">
                        {[...order.statusHistory].reverse().map((h: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                <AdminBadge variant={h.status as any} />
                                <span className="text-gray-400 text-xs">{new Date(h.changedAt).toLocaleString('bn-BD')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
