'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
    icon?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white border border-orange-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white border border-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 border border-transparent',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500',
}

const sizeClasses: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-5 py-2.5 text-sm min-h-[44px]',
}

export default function AdminButton({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    className = '',
    ...props
}: AdminButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-1.5 font-medium rounded-lg
        transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
            {...props}
        >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
            {children}
        </button>
    )
}
