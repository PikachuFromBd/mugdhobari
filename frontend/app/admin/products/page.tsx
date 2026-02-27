'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, Pencil, Trash2, Copy, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminBadge, { getStockVariant } from '@/components/admin/ui/AdminBadge'
import AdminButton from '@/components/admin/ui/AdminButton'
import { AdminSkeletonTable } from '@/components/admin/ui/AdminSkeleton'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { useToast } from '@/components/Toast'

const CATEGORY_OPTIONS = [
    { value: '', label: 'সব ক্যাটাগরি' },
    { value: 'hoodie', label: 'হুডি' }, { value: 'shirt', label: 'শার্ট' },
    { value: 'tshirt', label: 'টি-শার্ট' }, { value: 'saree', label: 'শাড়ি' },
    { value: 'three-piece', label: 'থ্রি-পিস' }, { value: 'cosmetics', label: 'কসমেটিক্স' },
    { value: 'combo', label: 'কম্বো' }, { value: 'shoes', label: 'জুতা' }, { value: 'other', label: 'অন্যান্য' },
]

export default function ProductsPage() {
    const { showToast } = useToast()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [catFilter, setCatFilter] = useState('')
    const [stockFilter, setStockFilter] = useState('')

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const params: any = {}
            if (search) params.search = search
            if (catFilter) params.category = catFilter
            if (stockFilter) params.stock = stockFilter
            const res = await axios.get(`${API_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` }, params })
            setProducts(res.data)
        } catch { showToast('পণ্য লোড করতে সমস্যা হয়েছে', 'error') }
        finally { setLoading(false) }
    }, [search, catFilter, stockFilter])

    useEffect(() => {
        const t = setTimeout(fetchProducts, 300)
        return () => clearTimeout(t)
    }, [fetchProducts])

    const handleDelete = async (id: string) => {
        if (!confirm('এই পণ্য মুছে ফেলতে চান?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${API_URL}/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            showToast('পণ্য মুছে ফেলা হয়েছে', 'success')
            fetchProducts()
        } catch { showToast('মুছতে সমস্যা হয়েছে', 'error') }
    }

    const handleDuplicate = async (id: string) => {
        try {
            const token = localStorage.getItem('token')
            await axios.post(`${API_URL}/admin/products/${id}/duplicate`, {}, { headers: { Authorization: `Bearer ${token}` } })
            showToast('পণ্য কপি হয়েছে', 'success')
            fetchProducts()
        } catch { showToast('কপি করতে সমস্যা হয়েছে', 'error') }
    }

    const handleTogglePublish = async (product: any) => {
        try {
            const token = localStorage.getItem('token')
            const fd = new FormData()
            fd.append('isPublished', String(!product.isPublished))
            await axios.put(`${API_URL}/admin/products/${product._id}`, fd, { headers: { Authorization: `Bearer ${token}` } })
            showToast(product.isPublished ? 'পণ্য ড্রাফটে রাখা হয়েছে' : 'পণ্য পাবলিশ হয়েছে', 'success')
            fetchProducts()
        } catch { showToast('আপডেট করতে সমস্যা হয়েছে', 'error') }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">পণ্য</h1>
                    <p className="text-sm text-gray-500">{products.length}টি পণ্য</p>
                </div>
                <Link href="/admin/products/new">
                    <AdminButton variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>নতুন পণ্য</AdminButton>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="পণ্যের নাম..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                    {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="">সব স্টক</option>
                    <option value="in">স্টক আছে</option>
                    <option value="low">কম স্টক</option>
                    <option value="out">স্টক শেষ</option>
                </select>
            </div>

            {/* Table */}
            {loading ? <AdminSkeletonTable rows={8} cols={7} /> : products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200">
                    <AdminEmptyState title="কোনো পণ্য পাওয়া যায়নি" action={{ label: 'নতুন পণ্য যোগ করুন', onClick: () => { } }} />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ছবি</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">পণ্য</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">ক্যাটাগরি</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">মূল্য</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">স্টক</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden sm:table-cell">স্ট্যাটাস</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">কর্ম</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p: any) => (
                                    <tr key={p._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                {p.images?.[0] ? (
                                                    <Image src={p.images[0]} alt={p.nameBn} fill className="object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">?</div>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800 text-sm">{p.nameBn}</p>
                                            <p className="text-xs text-gray-400">{p.name}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.categoryBn}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-semibold">৳{p.price?.toLocaleString()}</span>
                                            {p.discountPrice && <span className="text-xs text-gray-400 line-through ml-1">৳{p.discountPrice}</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <AdminBadge variant={getStockVariant(p.stock)} label={String(p.stock)} />
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <AdminBadge variant={p.isPublished !== false ? 'published' : 'draft'} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Link href={`/admin/products/${p._id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Link>
                                                <button onClick={() => handleDuplicate(p._id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleTogglePublish(p)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                    {p.isPublished !== false ? <ToggleRight className="w-3.5 h-3.5 text-emerald-500" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                                </button>
                                                <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
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
