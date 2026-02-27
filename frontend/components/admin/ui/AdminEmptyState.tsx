'use client'

import { Package } from 'lucide-react'
import AdminButton from './AdminButton'

interface AdminEmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
}

export default function AdminEmptyState({ icon, title, description, action }: AdminEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                {icon || <Package className="w-7 h-7" />}
            </div>
            <p className="text-gray-700 font-medium text-sm mb-1">{title}</p>
            {description && <p className="text-gray-400 text-xs max-w-xs mb-4">{description}</p>}
            {action && (
                <AdminButton variant="primary" size="sm" onClick={action.onClick}>
                    {action.label}
                </AdminButton>
            )}
        </div>
    )
}
