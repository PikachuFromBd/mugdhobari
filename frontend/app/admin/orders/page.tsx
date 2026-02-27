'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Search, Filter, RefreshCw, Eye, ChevronDown } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminBadge from '@/components/admin/ui/AdminBadge'
import AdminButton from '@/components/admin/ui/AdminButton'
import { AdminSkeletonTable } from '@/components/admin/ui/AdminSkeleton'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { useToast } from '@/components/Toast'

const STATUS_OPTIONS = [
    { value: '', label: 'সব স্ট্যাটাস' },
    { value: 'pending', label: 'পেন্ডিং' },
    { value: 'confirmed', label: 'কনফার্মড' },
    { value: 'packed', label: 'প্যাকড' },
    { value: 'shipped', label: 'শিপড' },
    { value: 'delivered', label: 'ডেলিভার্ড' },
    { value: 'cancelled', label: 'বাতিল' },
]

const BULK_STATUSES = ['confirmed', 'packed', 'shipped', 'delivered', 'cancelled']

export default function OrdersPage() {
    const { showToast } = useToast()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterPayment, setFilterPayment] = useState('')
    const [selected, setSelected] = useState<string[]>([])
    const [bulkLoading, setBulkLoading] = useState(false)

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true); setError('')
            const token = localStorage.getItem('token')
            const params: any = {}
            if (filterStatus) params.status = filterStatus
            if (filterPayment) params.payment = filterPayment
            if (search) params.search = search
            const res = await axios.get(`${API_URL}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }, params
            })
            setOrders(res.data)
        } catch (e: any) {
            setError(e.response?.data?.error || 'অর্ডার লোড করতে সমস্যা হয়েছে')
        } finally { setLoading(false) }
    }, [filterStatus, filterPayment, search])

    useEffect(() => {
        const timer = setTimeout(fetchOrders, 300)
        return () => clearTimeout(timer)
    }, [fetchOrders])

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }
    const toggleAll = () => {
        setSelected(prev => prev.length === orders.length ? [] : orders.map(o => o.orderId))
    }

    const handleBulkStatus = async (status: string) => {
        if (!selected.length) return
        setBulkLoading(true)
        try {
            const token = localStorage.getItem('token')
            await axios.post(`${API_URL}/admin/orders/bulk-status`, { orderIds: selected, status }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            showToast(`${selected.length}টি অর্ডার আপডেট হয়েছে`, 'success')
            setSelected([])
            fetchOrders()
        } catch {
            showToast('আপডেট করতে সমস্যা হয়েছে', 'error')
        } finally { setBulkLoading(false) }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">অর্ডার</h1>
                    <p className="text-sm text-gray-500">{orders.length}টি অর্ডার পাওয়া গেছে</p>
                </div>
                <AdminButton variant="ghost" size="sm" onClick={fetchOrders} icon={<RefreshCw className="w-3.5 h-3.5" />}>
                    রিফ্রেশ
                </AdminButton>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="অর্ডার ID, নাম বা ফোন নম্বর..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select
                        value={filterPayment}
                        onChange={e => setFilterPayment(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                        <option value="">সব পেমেন্ট</option>
                        <option value="cod">COD</option>
                        <option value="online">অনলাইন</option>
                    </select>
                </div>

                {/* Bulk actions */}
                {selected.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">{selected.length}টি সিলেক্ট করা হয়েছে:</span>
                        {BULK_STATUSES.map(s => (
                            <AdminButton key={s} variant="secondary" size="sm" loading={bulkLoading}
                                onClick={() => handleBulkStatus(s)}>
                                {STATUS_OPTIONS.find(o => o.value === s)?.label || s}
                            </AdminButton>
                        ))}
                    </div>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <AdminSkeletonTable rows={8} cols={7} />
            ) : error ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-red-500 mb-3">{error}</p>
                    <AdminButton variant="secondary" size="sm" onClick={fetchOrders} icon={<RefreshCw className="w-3.5 h-3.5" />}>পুনরায় চেষ্টা</AdminButton>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200">
                    <AdminEmptyState title="কোনো অর্ডার পাওয়া যায়নি" description="ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-10 px-4 py-3">
                                        <input type="checkbox" checked={selected.length === orders.length} onChange={toggleAll}
                                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">অর্ডার ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">কাস্টমার</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">ফোন</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden lg:table-cell">পেমেন্ট</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">মোট</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">স্ট্যাটাস</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">তারিখ</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" checked={selected.includes(order.orderId)} onChange={() => toggleSelect(order.orderId)}
                                                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link href={`/admin/orders/${order.orderId}`} className="font-mono text-xs text-orange-500 hover:underline">
                                                {order.orderId}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-800 font-medium">{order.customer?.name}</td>
                                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{order.customer?.phone}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <AdminBadge variant={(order.paymentMethod || 'cod') as any} />
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">৳{order.totalAmount?.toLocaleString()}</td>
                                        <td className="px-4 py-3"><AdminBadge variant={order.status as any} /></td>
                                        <td className="px-4 py-3 text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link href={`/admin/orders/${order.orderId}`}
                                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg inline-flex transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
