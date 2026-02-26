'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, Share2, Minus, Plus } from 'lucide-react'
import { FaFacebook, FaWhatsapp, FaTwitter } from 'react-icons/fa'
import { useToast } from '@/components/Toast'

import { API_URL } from '@/lib/api'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
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
    window.dispatchEvent(new Event('cart-updated'))

    showToast('কার্টে যোগ করা হয়েছে!', 'success')
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
        showToast('লিংক কপি করা হয়েছে!', 'info')
        return
    }

    window.open(shareUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="pt-28 pb-12 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="pt-28 pb-12 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">পণ্য পাওয়া যায়নি</h1>
          <Link href="/" className="btn-primary inline-block px-6 py-2.5">
            হোমে ফিরে যান
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 bg-white rounded-2xl shadow-soft p-4 md:p-8">
            {/* Images */}
            <div>
              <div className="relative h-72 sm:h-80 md:h-96 mb-3 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={product.images?.[selectedImage] || product.images?.[0] || '/placeholder.jpg'}
                  alt={product.nameBn || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-orange-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
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
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
                {product.nameBn || product.name}
              </h1>

              <div className="mb-5">
                <p className="text-2xl md:text-3xl font-bold text-orange-500 mb-1.5">
                  ৳{product.price?.toLocaleString('bn-BD')}
                </p>
                {product.stock > 0 ? (
                  <p className="text-green-600 font-medium text-sm">✓ স্টকে আছে ({product.stock} টি)</p>
                ) : (
                  <p className="text-red-600 font-medium text-sm">✗ স্টক শেষ</p>
                )}
              </div>

              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1.5">বিবরণ</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.descriptionBn || product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">সাইজ</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedSize === size
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">রঙ</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedColor === color
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">পরিমাণ</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-14 text-center text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-gray-500 text-sm font-medium">শেয়ার করুন:</span>
                  <button
                    onClick={() => shareProduct('facebook')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareProduct('whatsapp')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareProduct('twitter')}
                    className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareProduct('copy')}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="লিংক কপি"
                  >
                    <Share2 className="w-4 h-4" />
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
