'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import { useToast } from '@/components/Toast'

import { API_URL } from '@/lib/api'
import { AdminTableSkeleton } from '@/components/Skeletons'

interface Order {
  _id: string
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: Array<{
    product: {
      nameBn: string
      name: string
    }
    quantity: number
    size?: string
    color?: string
    price: number
  }>
  totalAmount: number
  status: string
  createdAt: string
}

export default function OrderManagement() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(`${API_URL}/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOrders()
      showToast('অর্ডার স্ট্যাটাস আপডেট করা হয়েছে', 'success')
    } catch (error: any) {
      showToast('ত্রুটি: ' + (error.response?.data?.error || 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে'), 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pending': 'পেন্ডিং',
      'confirmed': 'নিশ্চিত',
      'processing': 'প্রক্রিয়াধীন',
      'shipped': 'শিপ করা হয়েছে',
      'delivered': 'ডেলিভার করা হয়েছে',
      'cancelled': 'বাতিল'
    }
    return labels[status] || status
  }

  if (loading) {
    return <AdminTableSkeleton rows={6} />
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">অর্ডার তালিকা</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">অর্ডার আইডি</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">গ্রাহক</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">পণ্য</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">মোট</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">তারিখ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">কর্ম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-orange-600">{order.orderId}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm">
                          {item.product?.nameBn || item.product?.name || 'N/A'} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ৳{order.totalAmount.toLocaleString('bn-BD')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.orderId, e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="pending">পেন্ডিং</option>
                      <option value="confirmed">নিশ্চিত</option>
                      <option value="processing">প্রক্রিয়াধীন</option>
                      <option value="shipped">শিপ করা হয়েছে</option>
                      <option value="delivered">ডেলিভার করা হয়েছে</option>
                      <option value="cancelled">বাতিল</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>কোনো অর্ডার নেই</p>
          </div>
        )}
      </div>
    </div>
  )
}
