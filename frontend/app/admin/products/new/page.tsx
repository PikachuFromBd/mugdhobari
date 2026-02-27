'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { ArrowLeft, X, Plus } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminButton from '@/components/admin/ui/AdminButton'
import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/ui/AdminFormFields'
import { useToast } from '@/components/Toast'

const CATEGORIES = [
    { value: 'hoodie', label: 'হুডি' }, { value: 'shirt', label: 'শার্ট' },
    { value: 'tshirt', label: 'টি-শার্ট' }, { value: 'saree', label: 'শাড়ি' },
    { value: 'three-piece', label: 'থ্রি-পিস' }, { value: 'cosmetics', label: 'কসমেটিক্স' },
    { value: 'combo', label: 'কম্বো' }, { value: 'shoes', label: 'জুতা' }, { value: 'other', label: 'অন্যান্য' },
]

const emptyForm = {
    name: '', nameBn: '', description: '', descriptionBn: '',
    category: 'hoodie', categoryBn: 'হুডি', price: '', discountPrice: '',
    stock: '', sizes: '', colors: '', trending: false, featured: false,
    isNew: false, isPublished: true, metaTitle: '', metaDescription: ''
}

export default function ProductFormPage() {
    const { id } = useParams()
    const router = useRouter()
    const { showToast } = useToast()
    const isNew = !id || id === 'new'
    const [form, setForm] = useState({ ...emptyForm })
    const [images, setImages] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(!isNew)

    useEffect(() => {
        if (!isNew) {
            const fetchProduct = async () => {
                try {
                    const token = localStorage.getItem('token')
                    const res = await axios.get(`${API_URL}/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                    const p = res.data
                    setForm({
                        name: p.name || '', nameBn: p.nameBn || '',
                        description: p.description || '', descriptionBn: p.descriptionBn || '',
                        category: p.category || 'hoodie',
                        categoryBn: p.categoryBn || 'হুডি',
                        price: p.price?.toString() || '', discountPrice: p.discountPrice?.toString() || '',
                        stock: p.stock?.toString() || '', sizes: p.sizes?.join(', ') || '',
                        colors: p.colors?.join(', ') || '', trending: p.trending || false,
                        featured: p.featured || false, isNew: p.isNew || false,
                        isPublished: p.isPublished !== false, metaTitle: p.metaTitle || '',
                        metaDescription: p.metaDescription || ''
                    })
                    setExistingImages(p.images || [])
                } catch { showToast('পণ্য খুঁজে পাওয়া যায়নি', 'error') }
                finally { setFetchLoading(false) }
            }
            fetchProduct()
        }
    }, [id, isNew])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const fd = new FormData()
            Object.entries(form).forEach(([key, val]) => {
                if (key === 'sizes' || key === 'colors') {
                    const arr = val.toString().split(',').map((s: string) => s.trim()).filter(Boolean)
                    fd.append(key, JSON.stringify(arr))
                } else {
                    fd.append(key, val.toString())
                }
            })
            // keep existing images if no new ones uploaded
            if (images.length > 0) {
                images.forEach(img => fd.append('images', img))
            } else if (!isNew && existingImages.length > 0) {
                existingImages.forEach(img => fd.append('existingImages', img))
            }
            if (isNew) {
                await axios.post(`${API_URL}/admin/products`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
                showToast('পণ্য যোগ হয়েছে ✓', 'success')
            } else {
                await axios.put(`${API_URL}/admin/products/${id}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
                showToast('পণ্য আপডেট হয়েছে ✓', 'success')
            }
            router.push('/admin/products')
        } catch (err: any) {
            showToast('ত্রুটি: ' + (err.response?.data?.error || 'সমস্যা হয়েছে'), 'error')
        } finally { setLoading(false) }
    }

    const upd = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))
    const toggle = (key: string) => setForm(f => ({ ...f, [key]: !f[key as keyof typeof f] }))

    if (fetchLoading) return (
        <div className="space-y-4 animate-pulse max-w-4xl">
            <div className="h-8 w-40 bg-gray-200 rounded" /><div className="h-64 bg-gray-200 rounded-xl" /><div className="h-64 bg-gray-200 rounded-xl" />
        </div>
    )

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">{isNew ? 'নতুন পণ্য যোগ করুন' : 'পণ্য সম্পাদনা করুন'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Main fields */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-gray-700">মূল তথ্য</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <AdminInput label="নাম (ইংরেজি)" value={form.name} onChange={e => upd('name', e.target.value)} required />
                                <AdminInput label="নাম (বাংলা)" value={form.nameBn} onChange={e => upd('nameBn', e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <AdminTextarea label="বিবরণ (ইংরেজি)" value={form.description} onChange={e => upd('description', e.target.value)} rows={3} required />
                                <AdminTextarea label="বিবরণ (বাংলা)" value={form.descriptionBn} onChange={e => upd('descriptionBn', e.target.value)} rows={3} required />
                            </div>
                            <AdminSelect
                                label="ক্যাটাগরি"
                                value={form.category}
                                onChange={e => {
                                    const cat = CATEGORIES.find(c => c.value === e.target.value)
                                    setForm(f => ({ ...f, category: e.target.value, categoryBn: cat?.label || '' }))
                                }}
                                options={CATEGORIES}
                            />
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-gray-700">মূল্য ও স্টক</h2>
                            <div className="grid grid-cols-3 gap-3">
                                <AdminInput label="মূল্য (৳)" type="number" value={form.price} onChange={e => upd('price', e.target.value)} required />
                                <AdminInput label="ডিসকাউন্ট মূল্য" type="number" value={form.discountPrice} onChange={e => upd('discountPrice', e.target.value)} />
                                <AdminInput label="স্টক" type="number" value={form.stock} onChange={e => upd('stock', e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <AdminInput label="সাইজ (কমা দিয়ে)" value={form.sizes} onChange={e => upd('sizes', e.target.value)} placeholder="S, M, L, XL" />
                                <AdminInput label="রঙ (কমা দিয়ে)" value={form.colors} onChange={e => upd('colors', e.target.value)} placeholder="লাল, নীল" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-gray-700">SEO (ঐচ্ছিক)</h2>
                            <AdminInput label="মেটা টাইটেল" value={form.metaTitle} onChange={e => upd('metaTitle', e.target.value)} />
                            <AdminTextarea label="মেটা বিবরণ" value={form.metaDescription} onChange={e => upd('metaDescription', e.target.value)} rows={2} />
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-4">
                        {/* Publish */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                            <h2 className="text-sm font-semibold text-gray-700">পাবলিশ</h2>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${form.isPublished ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                    onClick={() => toggle('isPublished')}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </div>
                                <span className="text-sm text-gray-700">{form.isPublished ? 'পাবলিশড' : 'ড্রাফট'}</span>
                            </label>
                            <div className="space-y-2 text-sm">
                                {[
                                    { key: 'trending', label: 'ট্রেন্ডিং' },
                                    { key: 'featured', label: 'ফিচার্ড' },
                                    { key: 'isNew', label: 'নতুন পণ্য' }
                                ].map(f => (
                                    <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={!!form[f.key as keyof typeof form]} onChange={() => toggle(f.key)}
                                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                        <span className="text-gray-700">{f.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                            <h2 className="text-sm font-semibold text-gray-700">ছবি</h2>
                            {existingImages.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                            <Image src={img} alt="" fill className="object-cover" />
                                            <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, j) => j !== i))}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <label className="border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors">
                                <Plus className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-400">ছবি যোগ করুন</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={e => setImages(Array.from(e.target.files || []))} />
                            </label>
                        </div>

                        {/* Actions */}
                        <AdminButton type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                            {isNew ? 'পণ্য যোগ করুন' : 'পরিবর্তন সংরক্ষণ করুন'}
                        </AdminButton>
                    </div>
                </div>
            </form>
        </div>
    )
}
