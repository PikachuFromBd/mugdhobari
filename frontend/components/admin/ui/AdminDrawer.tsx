'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface AdminDrawerProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    side?: 'left' | 'right'
}

export default function AdminDrawer({ isOpen, onClose, title, children, side = 'right' }: AdminDrawerProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            {/* Panel */}
            <div
                className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} z-50 h-full w-full max-w-sm bg-white shadow-xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'}
        `}
            >
                {title && (
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </div>
        </>
    )
}
