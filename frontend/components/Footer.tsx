'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, MessageCircle, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* About Section */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="MugdhoBari Logo"
                width={100}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              মুগ্ধবাড়ি - বাংলাদেশের সেরা কাপড়ের দোকান। আপনার স্টাইলের জন্য সেরা পণ্য।
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com/mugdhobari" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://wa.me/8801234567890" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/mugdhobari" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-pink-500 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-5">দ্রুত লিংক</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'হোম' },
                { href: '/products', label: 'সব পণ্য' },
                { href: '/about', label: 'আমাদের সম্পর্কে' },
                { href: '/contact', label: 'যোগাযোগ' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-5">যোগাযোগ</h3>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                info@mugdhobari.com
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                +880 1234-567890
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                ঢাকা, বাংলাদেশ
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {currentYear} MugdhoBari. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-5 text-xs text-gray-500">
            <Link href="/about" className="hover:text-gray-300 transition-colors">গোপনীয়তা নীতি</Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">শর্তাবলী</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
