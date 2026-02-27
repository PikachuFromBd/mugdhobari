'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { ShoppingCart, Package, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminBadge from '@/components/admin/ui/AdminBadge'
import { AdminSkeletonCard } from '@/components/admin/ui/AdminSkeleton'

interface DashboardData {
  todayOrders: number
  pendingOrders: number
  todaySales: number
  monthSales: number
  lowStockCount: number
  recentOrders: any[]
  topProducts: any[]
}

function StatCard({ title, value, sub, icon, color }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between hover:border-gray-300 transition-colors">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      setData(res.data)
    } catch (e: any) {
      setError(e.response?.data?.error || 'ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])

  if (loading) return (
    <div>
      <div className="mb-6">
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => <AdminSkeletonCard key={i} />)}
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchDashboard} className="flex items-center gap-2 text-sm text-orange-500 border border-orange-300 px-4 py-2 rounded-lg hover:bg-orange-50">
        <RefreshCw className="w-4 h-4" /> পুনরায় চেষ্টা করুন
      </button>
    </div>
  )

  if (!data) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
        <p className="text-sm text-gray-500">আজকের সারসংক্ষেপ দেখুন</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="আজকের অর্ডার"
          value={data.todayOrders}
          sub="নতুন অর্ডার"
          icon={<ShoppingCart className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="পেন্ডিং অর্ডার"
          value={data.pendingOrders}
          sub="অপেক্ষায় আছে"
          icon={<RefreshCw className="w-5 h-5 text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatCard
          title="আজকের বিক্রয়"
          value={`৳${data.todaySales.toLocaleString()}`}
          sub={`এই মাসে ৳${data.monthSales.toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard
          title="কম স্টক"
          value={data.lowStockCount}
          sub="পণ্যের স্টক কম"
          icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">সাম্প্রতিক অর্ডার</h2>
            <Link href="/admin/orders" className="text-xs text-orange-500 hover:text-orange-600 font-medium">সব দেখুন →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">অর্ডার ID</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">কাস্টমার</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">মোট</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.orderId}`} className="text-orange-500 hover:underline font-mono text-xs">
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{order.customer?.name}</td>
                    <td className="px-4 py-3 font-medium">৳{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <AdminBadge variant={order.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentOrders.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">কোনো অর্ডার নেই</div>
            )}
          </div>
        </div>

        {/* Top Products + Low Stock */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 text-sm">টপ পণ্য</h2>
            </div>
            <div className="p-4 space-y-3">
              {data.topProducts.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{p.product?.nameBn}</p>
                    <p className="text-xs text-gray-400">৳{p.totalRev?.toLocaleString()}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.totalQty} পিস</span>
                </div>
              ))}
              {data.topProducts.length === 0 && <p className="text-sm text-gray-400 text-center py-4">তথ্য নেই</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 text-sm">কম স্টক পণ্য</h2>
              <Link href="/admin/inventory" className="text-xs text-orange-500 hover:text-orange-600">সব দেখুন →</Link>
            </div>
            <div className="p-4 space-y-2">
              {data.lowStockCount === 0 && <p className="text-sm text-gray-400 text-center py-4">সব পণ্যের পর্যাপ্ত স্টক আছে</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
