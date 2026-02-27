'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { AlertTriangle, RefreshCw, Plus, Minus } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminBadge, { getStockVariant } from '@/components/admin/ui/AdminBadge'
import AdminButton from '@/components/admin/ui/AdminButton'
import AdminModal from '@/components/admin/ui/AdminModal'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { AdminSkeletonTable } from '@/components/admin/ui/AdminSkeleton'
import { useToast } from '@/components/Toast'

export default function InventoryPage() {
    const { showToast } = useToast()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [adjustModal, setAdjustModal] = useState<any>(null)
    const [adjustment, setAdjustment] = useState('0')
    const [reason, setReason] = useState('')
    const [saving, setSaving] = useState(false)

    const fetchInventory = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${API_URL}/admin/inventory`, { headers: { Authorization: `Bearer ${token}` } })
            setProducts(res.data)
        } catch { showToast('লোড করতে সমস্যা হয়েছে', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchInventory() }, [])

    const handleAdjust = async () => {
        if (!adjustModal) return
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            await axios.patch(`${API_URL}/admin/products/${adjustModal._id}/stock`,
                { adjustment: parseInt(adjustment), reason },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            showToast('স্টক আপডেট হয়েছে', 'success')
            setAdjustModal(null)
            setAdjustment('0')
            setReason('')
            fetchInventory()
        } catch { showToast('আপডেট করতে সমস্যা হয়েছে', 'error') }
        finally { setSaving(false) }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">ইনভেন্টরি</h1>
                    <p className="text-sm text-gray-500">কম স্টকের পণ্য ({products.length}টি)</p>
                </div>
                <AdminButton variant="ghost" size="sm" onClick={fetchInventory} icon={<RefreshCw className="w-3.5 h-3.5" />}>রিফ্রেশ</AdminButton>
            </div>

            {loading ? <AdminSkeletonTable rows={6} cols={5} /> : products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200">
                    <AdminEmptyState title="সব পণ্যের পর্যাপ্ত স্টক রয়েছে" description="৫ এর কম স্টক হলে এখানে দেখাবে" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">পণ্য</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">ক্যাটাগরি</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">মূল্য</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">স্টক</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">কর্ম</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map(p => (
                                    <tr key={p._id} className={`hover:bg-gray-50 ${p.stock === 0 ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.images?.[0] && <img src={p.images[0]} alt="" className="w-8 h-8 object-cover rounded-lg" />}
                                                <div>
                                                    <p className="font-medium text-gray-800">{p.nameBn}</p>
                                                    <p className="text-xs text-gray-400">{p.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.categoryBn}</td>
                                        <td className="px-4 py-3 font-medium">৳{p.price?.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {p.stock === 0 && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                                                <AdminBadge variant={getStockVariant(p.stock)} label={`${p.stock} পিস`} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <AdminButton variant="secondary" size="sm" onClick={() => { setAdjustModal(p); setAdjustment('0') }}>
                                                স্টক ঠিক করুন
                                            </AdminButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AdminModal isOpen={!!adjustModal} onClose={() => setAdjustModal(null)} title="স্টক সমন্বয়" size="sm">
                {adjustModal && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-gray-800">{adjustModal.nameBn}</p>
                            <p className="text-sm text-gray-500">বর্তমান স্টক: <span className="font-bold text-gray-800">{adjustModal.stock}</span></p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">পরিবর্তন (+ বাড়ান / - কমান)</label>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => setAdjustment(a => String(parseInt(a) - 1))}
                                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <input type="number" value={adjustment} onChange={e => setAdjustment(e.target.value)}
                                    className="flex-1 text-center px-3 py-2 border border-gray-300 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                <button type="button" onClick={() => setAdjustment(a => String(parseInt(a) + 1))}
                                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">নতুন স্টক: {Math.max(0, adjustModal.stock + parseInt(adjustment || '0'))}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">কারণ (ঐচ্ছিক)</label>
                            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="যেমন: নতুন মাল এলো"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div className="flex gap-2">
                            <AdminButton variant="secondary" size="md" className="flex-1" onClick={() => setAdjustModal(null)}>বাতিল</AdminButton>
                            <AdminButton variant="primary" size="md" className="flex-1" loading={saving} onClick={handleAdjust}>সংরক্ষণ</AdminButton>
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    )
}
