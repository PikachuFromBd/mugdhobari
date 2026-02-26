'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiShoppingCart, FiShare2, FiHeart } from 'react-icons/fi'
import { FaFacebook, FaWhatsapp, FaTwitter } from 'react-icons/fa'
import { demoProducts } from '@/lib/demoProducts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${params.id}`)
      setProduct(response.data)
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0])
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0])
      }
    } catch (error) {
      const fallback = demoProducts.find((p) => p._id === params.id)
      if (fallback) {
        setProduct(fallback as any)
        if (fallback.sizes?.length) setSelectedSize(fallback.sizes[0])
        if (fallback.colors?.length) setSelectedColor(fallback.colors[0])
      }
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return

    const cartItem = {
      productId: product._id,
      name: product.nameBn || product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    existingCart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(existingCart))
    
    alert('কার্টে যোগ করা হয়েছে!')
    router.push('/cart')
  }

  const shareProduct = (platform: string) => {
    const url = window.location.href
    const text = `${product?.nameBn || product?.name} - ৳${product?.price}`
    
    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      default:
        navigator.clipboard.writeText(url)
        alert('লিংক কপি করা হয়েছে!')
        return
    }
    
    window.open(shareUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 pb-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 pb-12 text-center">
          <h1 className="text-2xl font-bold mb-4">পণ্য পাওয়া যায়নি</h1>
          <Link href="/" className="text-orange-500 hover:underline">
            হোমে ফিরে যান
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6">
            {/* Images */}
            <div>
              <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={product.images?.[selectedImage] || product.images?.[0] || '/placeholder.jpg'}
                  alt={product.nameBn || product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded overflow-hidden border-2 ${
                        selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.nameBn} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4 text-gray-800">
                {product.nameBn || product.name}
              </h1>
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-orange-500 mb-2">
                  ৳{product.price.toLocaleString('bn-BD')}
                </p>
                {product.stock > 0 ? (
                  <p className="text-green-600 font-medium">স্টকে আছে ({product.stock} টি)</p>
                ) : (
                  <p className="text-red-600 font-medium">স্টক শেষ</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">বিবরণ:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.descriptionBn || product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">সাইজ:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded border-2 transition-colors ${
                          selectedSize === size
                            ? 'border-orange-500 bg-orange-50 text-orange-500'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">রঙ:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded border-2 transition-colors ${
                          selectedColor === color
                            ? 'border-orange-500 bg-orange-50 text-orange-500'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">পরিমাণ:</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">শেয়ার করুন:</span>
                  <button
                    onClick={() => shareProduct('facebook')}
                    className="text-blue-600 hover:text-blue-700"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => shareProduct('whatsapp')}
                    className="text-green-600 hover:text-green-700"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => shareProduct('twitter')}
                    className="text-blue-400 hover:text-blue-500"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => shareProduct('copy')}
                    className="text-gray-600 hover:text-gray-700"
                    aria-label="Copy Link"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

