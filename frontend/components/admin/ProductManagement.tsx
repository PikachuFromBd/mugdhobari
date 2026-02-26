'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Pencil, Trash2, Plus, X, Package } from 'lucide-react'
import { useToast } from '@/components/Toast'

import { API_URL } from '@/lib/api'

interface Product {
  _id: string
  name: string
  nameBn: string
  description: string
  descriptionBn: string
  category: string
  categoryBn: string
  price: number
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  trending: boolean
  featured: boolean
}

export default function ProductManagement() {
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    description: '',
    descriptionBn: '',
    category: 'hoodie',
    categoryBn: 'হুডি',
    price: '',
    sizes: '',
    colors: '',
    stock: '',
    trending: false,
    featured: false
  })
  const [images, setImages] = useState<File[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const formDataToSend = new FormData()

    Object.keys(formData).forEach(key => {
      if (key === 'sizes' || key === 'colors') {
        formDataToSend.append(key, JSON.stringify(formData[key as keyof typeof formData].toString().split(',').map(s => s.trim())))
      } else {
        formDataToSend.append(key, formData[key as keyof typeof formData].toString())
      }
    })

    images.forEach((img) => {
      formDataToSend.append('images', img)
    })

    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/admin/products/${editingProduct._id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        await axios.post(`${API_URL}/admin/products`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      fetchProducts()
      resetForm()
      showToast('পণ্য সফলভাবে সংরক্ষণ করা হয়েছে', 'success')
    } catch (error: any) {
      showToast('ত্রুটি: ' + (error.response?.data?.error || 'পণ্য সংরক্ষণ করতে সমস্যা হয়েছে'), 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই পণ্য মুছে ফেলতে চান?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProducts()
      showToast('পণ্য মুছে ফেলা হয়েছে', 'success')
    } catch (error: any) {
      showToast('ত্রুটি: ' + (error.response?.data?.error || 'পণ্য মুছতে সমস্যা হয়েছে'), 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nameBn: '',
      description: '',
      descriptionBn: '',
      category: 'hoodie',
      categoryBn: 'হুডি',
      price: '',
      sizes: '',
      colors: '',
      stock: '',
      trending: false,
      featured: false
    })
    setImages([])
    setEditingProduct(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      nameBn: product.nameBn,
      description: product.description,
      descriptionBn: product.descriptionBn,
      category: product.category,
      categoryBn: product.categoryBn,
      price: product.price.toString(),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      stock: product.stock.toString(),
      trending: product.trending,
      featured: product.featured
    })
    setShowForm(true)
  }

  const categories = [
    { value: 'three-piece', label: 'থ্রি-পিস' },
    { value: 'cosmetics', label: 'কসমেটিক্স' },
    { value: 'combo', label: 'কম্বো' },
    { value: 'saree', label: 'শাড়ি' },
    { value: 'tshirt', label: 'টি-শার্ট' },
    { value: 'hoodie', label: 'হুডি' },
    { value: 'shirt', label: 'শার্ট' },
    { value: 'shoes', label: 'জুতা' },
    { value: 'other', label: 'অন্যান্য' },
  ]

  if (loading) {
    return <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">পণ্য তালিকা</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{showForm ? 'বন্ধ করুন' : 'নতুন পণ্য যোগ করুন'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingProduct ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">নাম (ইংরেজি)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">নাম (বাংলা)</label>
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">বিবরণ (বাংলা)</label>
              <textarea
                value={formData.descriptionBn}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">ক্যাটাগরি</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = categories.find(c => c.value === e.target.value)
                    setFormData({ ...formData, category: e.target.value, categoryBn: cat?.label || '' })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">মূল্য (৳)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">সাইজ (কমা দিয়ে আলাদা করুন)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">রঙ (কমা দিয়ে আলাদা করুন)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="লাল, নীল, সবুজ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">স্টক</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">ছবি</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span>ট্রেন্ডিং</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span>ফিচার্ড</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingProduct ? 'আপডেট করুন' : 'যোগ করুন'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                বাতিল করুন
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ছবি</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">নাম</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ক্যাটাগরি</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">মূল্য</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">স্টক</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">কর্ম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.nameBn}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{product.nameBn}</td>
                  <td className="px-4 py-3 text-gray-600">{product.categoryBn}</td>
                  <td className="px-4 py-3">৳{product.price.toLocaleString('bn-BD')}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>কোনো পণ্য নেই</p>
          </div>
        )}
      </div>
    </div>
  )
}
