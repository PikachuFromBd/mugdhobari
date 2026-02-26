'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">আমাদের সম্পর্কে</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">স্বাগতম MugdhoBari-তে</h2>
              <p className="text-gray-700 leading-relaxed">
                MugdhoBari হল বাংলাদেশের একটি বিশ্বস্ত অনলাইন কাপড়ের দোকান। আমরা আমাদের গ্রাহকদের 
                সেরা মানের পোশাক সরবরাহ করার জন্য প্রতিশ্রুতিবদ্ধ। আমাদের সংগ্রহে রয়েছে হুডি, শার্ট, 
                টি-শার্ট, শাড়ি, থ্রি-পিস, জুতা এবং আরও অনেক কিছু।
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">আমাদের মিশন</h2>
              <p className="text-gray-700 leading-relaxed">
                আমাদের মিশন হল বাংলাদেশের প্রতিটি মানুষকে সাশ্রয়ী মূল্যে সেরা মানের পোশাক 
                সরবরাহ করা। আমরা বিশ্বাস করি যে প্রত্যেকেরই স্টাইলিশ এবং আরামদায়ক পোশাক 
                পরার অধিকার আছে।
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">কেন MugdhoBari?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>সেরা মানের পণ্য</li>
                <li>সাশ্রয়ী মূল্য</li>
                <li>দ্রুত ডেলিভারি</li>
                <li>নিরাপদ পেমেন্ট</li>
                <li>২৪/৭ কাস্টমার সাপোর্ট</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

