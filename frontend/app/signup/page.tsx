'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { API_URL } from '@/lib/api'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      router.push('/')
    } catch (error: any) {
      setError(error.response?.data?.error || 'সাইন আপ করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-soft p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-5 text-center text-gray-800">সাইন আপ</h1>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  নাম
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  ইমেইল
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="আপনার ইমেইল লিখুন"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="পাসওয়ার্ড লিখুন"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'সাইন আপ করা হচ্ছে...' : 'সাইন আপ করুন'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <Link href="/login" className="text-orange-500 hover:underline font-medium">
                লগইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

