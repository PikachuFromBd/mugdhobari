'use client'

type BadgeVariant = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' |
    'in-stock' | 'low-stock' | 'out-of-stock' | 'cod' | 'online' | 'draft' | 'published' | 'default'

const badgeMap: Record<BadgeVariant, { label: string; className: string }> = {
    // Order statuses
    pending: { label: 'পেন্ডিং', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'কনফার্মড', className: 'bg-blue-100 text-blue-800' },
    packed: { label: 'প্যাকড', className: 'bg-indigo-100 text-indigo-800' },
    shipped: { label: 'শিপড', className: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'ডেলিভার্ড', className: 'bg-emerald-100 text-emerald-800' },
    cancelled: { label: 'বাতিল', className: 'bg-red-100 text-red-800' },
    returned: { label: 'রিটার্ন', className: 'bg-orange-100 text-orange-800' },
    // Stock
    'in-stock': { label: 'স্টক আছে', className: 'bg-emerald-100 text-emerald-700' },
    'low-stock': { label: 'কম স্টক', className: 'bg-yellow-100 text-yellow-700' },
    'out-of-stock': { label: 'স্টক শেষ', className: 'bg-red-100 text-red-700' },
    // Payment
    cod: { label: 'COD', className: 'bg-gray-100 text-gray-700' },
    online: { label: 'অনলাইন', className: 'bg-sky-100 text-sky-700' },
    // Publish
    draft: { label: 'ড্রাফট', className: 'bg-gray-100 text-gray-600' },
    published: { label: 'পাবলিশড', className: 'bg-emerald-100 text-emerald-700' },
    // Default
    default: { label: '', className: 'bg-gray-100 text-gray-700' },
}

interface AdminBadgeProps {
    variant?: BadgeVariant
    label?: string
    className?: string
}

export default function AdminBadge({ variant = 'default', label, className = '' }: AdminBadgeProps) {
    const config = badgeMap[variant] || badgeMap.default
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
            {label || config.label}
        </span>
    )
}

export function getStockVariant(stock: number): BadgeVariant {
    if (stock === 0) return 'out-of-stock'
    if (stock < 5) return 'low-stock'
    return 'in-stock'
}
