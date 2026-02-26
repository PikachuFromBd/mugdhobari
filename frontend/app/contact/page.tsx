'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaFacebook, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { useToast } from '@/components/Toast'

export default function ContactPage() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you can add form submission logic
    showToast('আপনার বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।', 'success')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">যোগাযোগ করুন</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-5 text-gray-800">আমাদের কাছে বার্তা পাঠান</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">আপনার নাম</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">ইমেইল</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">বার্তা</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                >
                  পাঠান
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-5 text-gray-800">যোগাযোগের তথ্য</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">ঠিকানা</h3>
                    <p className="text-gray-600">
                      ঢাকা, বাংলাদেশ
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaPhone className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">ফোন</h3>
                    <p className="text-gray-600">
                      +880 1234-567890
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaEnvelope className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">ইমেইল</h3>
                    <p className="text-gray-600">
                      info@mugdhobari.com
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-4">সামাজিক যোগাযোগ</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://facebook.com/mugdhobari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaFacebook className="w-8 h-8" />
                    </a>
                    <a
                      href="https://wa.me/8801234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      <FaWhatsapp className="w-8 h-8" />
                    </a>
                  </div>
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

