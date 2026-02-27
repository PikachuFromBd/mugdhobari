'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Save, RefreshCw } from 'lucide-react'
import { API_URL } from '@/lib/api'
import AdminButton from '@/components/admin/ui/AdminButton'
import { AdminInput, AdminTextarea } from '@/components/admin/ui/AdminFormFields'
import { useToast } from '@/components/Toast'

export default function SettingsPage() {
    const { showToast } = useToast()
    const [settings, setSettings] = useState({
        deliveryDhaka: '60',
        deliveryOutside: '120',
        contactPhone: '',
        contactEmail: '',
        facebookUrl: '',
        returnPolicy: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${API_URL}/admin/settings`, { headers: { Authorization: `Bearer ${token}` } })
            setSettings({
                deliveryDhaka: res.data.deliveryDhaka?.toString() || '60',
                deliveryOutside: res.data.deliveryOutside?.toString() || '120',
                contactPhone: res.data.contactPhone || '',
                contactEmail: res.data.contactEmail || '',
                facebookUrl: res.data.facebookUrl || '',
                returnPolicy: res.data.returnPolicy || ''
            })
        } catch { showToast('সেটিং লোড করতে সমস্যা হয়েছে', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchSettings() }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            await axios.put(`${API_URL}/admin/settings`, {
                deliveryDhaka: parseFloat(settings.deliveryDhaka),
                deliveryOutside: parseFloat(settings.deliveryOutside),
                contactPhone: settings.contactPhone,
                contactEmail: settings.contactEmail,
                facebookUrl: settings.facebookUrl,
                returnPolicy: settings.returnPolicy
            }, { headers: { Authorization: `Bearer ${token}` } })
            showToast('সেটিং সংরক্ষণ হয়েছে ✓', 'success')
        } catch { showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error') }
        finally { setSaving(false) }
    }

    const upd = (key: string, val: string) => setSettings(s => ({ ...s, [key]: val }))

    if (loading) return (
        <div className="max-w-2xl animate-pulse space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-200 rounded-xl" /><div className="h-48 bg-gray-200 rounded-xl" />
        </div>
    )

    return (
        <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">সেটিং</h1>
                    <p className="text-sm text-gray-500">স্টোরের কনফিগারেশন</p>
                </div>
                <button onClick={fetchSettings} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-5">
                {/* Delivery */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-gray-700">ডেলিভারি চার্জ</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <AdminInput
                            label="ঢাকার ভেতরে (৳)"
                            type="number"
                            value={settings.deliveryDhaka}
                            onChange={e => upd('deliveryDhaka', e.target.value)}
                        />
                        <AdminInput
                            label="ঢাকার বাইরে (৳)"
                            type="number"
                            value={settings.deliveryOutside}
                            onChange={e => upd('deliveryOutside', e.target.value)}
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-gray-700">যোগাযোগ তথ্য</h2>
                    <AdminInput label="ফোন নম্বর" value={settings.contactPhone} onChange={e => upd('contactPhone', e.target.value)} placeholder="01XXXXXXXXX" />
                    <AdminInput label="ইমেইল" type="email" value={settings.contactEmail} onChange={e => upd('contactEmail', e.target.value)} />
                    <AdminInput label="ফেসবুক পেজ URL" value={settings.facebookUrl} onChange={e => upd('facebookUrl', e.target.value)} placeholder="https://facebook.com/..." />
                </div>

                {/* Return Policy */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-gray-700">রিটার্ন পলিসি</h2>
                    <AdminTextarea
                        label="রিটার্ন পলিসি টেক্সট"
                        value={settings.returnPolicy}
                        onChange={e => upd('returnPolicy', e.target.value)}
                        rows={5}
                        placeholder="রিটার্ন পলিসির বিবরণ লিখুন..."
                    />
                </div>

                <AdminButton variant="primary" size="lg" icon={<Save className="w-4 h-4" />} loading={saving} onClick={handleSave} className="w-full">
                    সমস্ত সেটিং সংরক্ষণ করুন
                </AdminButton>
            </div>
        </div>
    )
}
