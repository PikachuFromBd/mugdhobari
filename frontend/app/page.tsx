'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import TrendingProducts from '@/components/TrendingProducts'
import CategorySection from '@/components/CategorySection'
import Footer from '@/components/Footer'
import HeroSlider from '@/components/HeroSlider'
import axios from 'axios'

import { API_URL } from '@/lib/api'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      setProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      <HeroSlider />
      <TrendingProducts />
      <CategorySection products={products} loading={loading} />
      <Footer />
    </main>
  )
}

