import type { Metadata } from 'next'
import './globals.css'
import MobileBottomNav from '@/components/MobileBottomNav'

export const metadata: Metadata = {
  title: 'MugdhoBari - আপনার পোশাকের বিশ্বস্ত সঙ্গী',
  description: 'MugdhoBari - বাংলাদেশের সেরা কাপড়ের দোকান। হুডি, শার্ট, টি-শার্ট, শাড়ি, থ্রি-পিস, জুতা এবং আরও অনেক কিছু।',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <body className="bangla-font pb-20 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  )
}

