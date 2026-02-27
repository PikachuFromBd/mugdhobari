'use client'

import React from 'react'

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

export function AdminInput({ label, error, hint, className = '', ...props }: AdminInputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                className={`
          w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-400
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export function AdminTextarea({ label, error, className = '', ...props }: AdminTextareaProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <textarea
                className={`
          w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          disabled:bg-gray-50 resize-y
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: { value: string; label: string }[]
}

export function AdminSelect({ label, error, options, className = '', ...props }: AdminSelectProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                className={`
          w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-800
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          disabled:bg-gray-50
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}
