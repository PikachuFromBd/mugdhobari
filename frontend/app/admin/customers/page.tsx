'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, RefreshCw, Users } from 'lucide-react'
import Link from 'next/link'
import { API_URL } from '@/lib/api'
import { AdminSkeletonTable } from '@/components/admin/ui/AdminSkeleton'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { useToast } from '@/components/Toast'

export default function CustomersPage() {
    const { showToast } = useToast()
    const [customers, setCustomers] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${API_URL}/admin/customers`, { headers: { Authorization: `Bearer ${token}` } })
            setCustomers(res.data)
            setFiltered(res.data)
        } catch { showToast('লোড করতে সমস্যা হয়েছে', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchCustomers() }, [])

    useEffect(() => {
        const q = search.toLowerCase()
        setFiltered(customers.filter(c =>
            c.name?.toLowerCase().includes(q) ||
            c.phone?.includes(q) ||
            c.email?.toLowerCase().includes(q)
        ))
    }, [search, customers])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">কাস্টমার</h1>
                    <p className="text-sm text-gray-500">{filtered.length}জন কাস্টমার</p>
                </div>
                <button onClick={fetchCustomers} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম, ফোন বা ইমেইল..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
            </div>

            {loading ? <AdminSkeletonTable rows={6} cols={5} /> : filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200">
                    <AdminEmptyState icon={<Users className="w-7 h-7" />} title="কোনো কাস্টমার পাওয়া যায়নি" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">কাস্টমার</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">ফোন</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">অর্ডার</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">মোট খরচ</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden lg:table-cell">শেষ অর্ডার</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((c: any) => (
                                    <tr key={c._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs flex-shrink-0">
                                                    {c.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{c.name}</p>
                                                    <p className="text-xs text-gray-400">{c.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.phone}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {c.orderCount}টি
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">৳{c.totalSpent?.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                                            {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('bn-BD') : '-'}
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
