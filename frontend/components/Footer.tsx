'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaWhatsapp, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center md:flex-row md:justify-center md:items-start gap-8">
          {/* About Section */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center justify-center mb-4">
              <Image
                src="/logo.png"
                alt="MugdhoBari Logo"
                width={100}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm">
              মুগ্ধবাড়ি - বাংলাদেশের সেরা কাপড়ের দোকান। আপনার স্টাইলের জন্য সেরা পণ্য।
            </p>
          </div>

          {/* Quick Links */}
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-orange-500 transition-colors">
                  সব পণ্য
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-orange-500 transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>



          {/* Contact & Social */}
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                📧 info@mugdhobari.com
              </p>
              <p className="text-gray-400 text-sm">
                📱 +880 1234-567890
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <a
                  href="https://facebook.com/mugdhobari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a
                  href="https://wa.me/8801234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com/mugdhobari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} MugdhoBari. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  )
}

