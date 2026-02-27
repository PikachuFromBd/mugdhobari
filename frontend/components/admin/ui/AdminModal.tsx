'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface AdminModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
}

export default function AdminModal({ isOpen, onClose, title, children, size = 'md' }: AdminModalProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeMap[size]} max-h-[90vh] flex flex-col`}>
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
                        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="overflow-y-auto flex-1 p-6">{children}</div>
            </div>
        </div>
    )
}
