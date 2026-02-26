'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductManagement from '@/components/admin/ProductManagement'
import OrderManagement from '@/components/admin/OrderManagement'
import { Package, ShoppingCart } from 'lucide-react'

export default function AdminPanel() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>(
    tabParam === 'orders' ? 'orders' : 'products'
  )

  return (
    <div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'products'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <Package className="w-4 h-4" />
            পণ্য ব্যবস্থাপনা
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'orders'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <ShoppingCart className="w-4 h-4" />
            অর্ডার ব্যবস্থাপনা
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'products' && <ProductManagement />}
      {activeTab === 'orders' && <OrderManagement />}
    </div>
  )
}
