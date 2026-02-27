'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, RefreshCw, Image as ImageIcon, Link as LinkIcon, TrendingUp } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminButton from '@/components/admin/ui/AdminButton'
import AdminModal from '@/components/admin/ui/AdminModal'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { AdminSkeletonCard } from '@/components/admin/ui/AdminSkeleton'
import { useToast } from '@/components/Toast'
import axios2 from 'axios'

export default function ContentPage() {
    const { showToast } = useToast()
    const [banners, setBanners] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [addModal, setAddModal] = useState(false)
    const [addFile, setAddFile] = useState<File | null>(null)
    const [addLink, setAddLink] = useState('')
    const [addTitle, setAddTitle] = useState('')
    const [saving, setSaving] = useState(false)

    const fetchBanners = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${API_URL}/admin/banners`, { headers: { Authorization: `Bearer ${token}` } })
            setBanners(res.data)
        } catch { showToast('লোড করতে সমস্যা হয়েছে', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchBanners() }, [])

    const handleAddBanner = async () => {
        if (!addFile) { showToast('ছবি সিলেক্ট করুন', 'error'); return }
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const fd = new FormData()
            fd.append('image', addFile)
            fd.append('link', addLink)
            fd.append('title', addTitle)
            await axios.post(`${API_URL}/admin/banners`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
            showToast('ব্যানার যোগ হয়েছে', 'success')
            setAddModal(false); setAddFile(null); setAddLink(''); setAddTitle('')
            fetchBanners()
        } catch { showToast('যোগ করতে সমস্যা হয়েছে', 'error') }
        finally { setSaving(false) }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('এই ব্যানার মুছবেন?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${API_URL}/admin/banners/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            showToast('ব্যানার মুছে ফেলা হয়েছে', 'success')
            fetchBanners()
        } catch { showToast('মুছতে সমস্যা হয়েছে', 'error') }
    }

    const handleToggle = async (banner: any) => {
        try {
            const token = localStorage.getItem('token')
            const fd = new FormData()
            fd.append('active', String(!banner.active))
            await axios.put(`${API_URL}/admin/banners/${banner._id}`, fd, { headers: { Authorization: `Bearer ${token}` } })
            fetchBanners()
        } catch { showToast('আপডেট করতে সমস্যা হয়েছে', 'error') }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">কনটেন্ট ম্যানেজমেন্ট</h1>
                    <p className="text-sm text-gray-500">হোম স্লাইডার ও ব্যানার ব্যবস্থাপনা</p>
                </div>
                <AdminButton variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setAddModal(true)}>
                    নতুন ব্যানার
                </AdminButton>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" />
                    <h2 className="font-semibold text-gray-800 text-sm">হোম স্লাইডার ব্যানার</h2>
                </div>

                {loading ? (
                    <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => <AdminSkeletonCard key={i} />)}
                    </div>
                ) : banners.length === 0 ? (
                    <AdminEmptyState
                        icon={<ImageIcon className="w-7 h-7" />}
                        title="কোনো ব্যানার নেই"
                        action={{ label: 'ব্যানার যোগ করুন', onClick: () => setAddModal(true) }}
                    />
                ) : (
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {banners.map(banner => (
                            <div key={banner._id} className={`rounded-xl border overflow-hidden ${banner.active ? 'border-emerald-200' : 'border-gray-200 opacity-60'}`}>
                                <div className="relative aspect-video bg-gray-100">
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${banner.active ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {banner.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    {banner.title && <p className="text-sm font-medium text-gray-800 mb-1">{banner.title}</p>}
                                    {banner.link && (
                                        <p className="text-xs text-gray-400 truncate flex items-center gap-1 mb-2">
                                            <LinkIcon className="w-3 h-3" />{banner.link}
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        <button onClick={() => handleToggle(banner)}
                                            className="flex-1 text-xs py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                                            {banner.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                                        </button>
                                        <button onClick={() => handleDelete(banner._id)}
                                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AdminModal isOpen={addModal} onClose={() => setAddModal(false)} title="নতুন ব্যানার যোগ করুন" size="sm">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">ছবি *</label>
                        <label className="border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors">
                            {addFile ? (
                                <img src={URL.createObjectURL(addFile)} alt="" className="w-full h-32 object-cover rounded-lg" />
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 text-gray-300" />
                                    <span className="text-sm text-gray-400">ছবি বেছে নিন</span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={e => setAddFile(e.target.files?.[0] || null)} />
                        </label>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">শিরোনাম</label>
                        <input value={addTitle} onChange={e => setAddTitle(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">লিংক (ঐচ্ছিক)</label>
                        <input value={addLink} onChange={e => setAddLink(e.target.value)} placeholder="/products"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <AdminButton variant="secondary" size="md" className="flex-1" onClick={() => setAddModal(false)}>বাতিল</AdminButton>
                        <AdminButton variant="primary" size="md" className="flex-1" loading={saving} onClick={handleAddBanner}>যোগ করুন</AdminButton>
                    </div>
                </div>
            </AdminModal>
        </div>
    )
}
