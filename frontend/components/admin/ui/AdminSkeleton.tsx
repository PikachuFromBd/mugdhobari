'use client'

import React from 'react'

interface AdminSkeletonRowProps {
    cols?: number
}

export function AdminSkeletonRow({ cols = 5 }: AdminSkeletonRowProps) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + (i * 10) % 40}%` }} />
                </td>
            ))}
        </tr>
    )
}

export function AdminSkeletonTable({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex gap-3">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                    {Array.from({ length: rows }).map((_, i) => (
                        <AdminSkeletonRow key={i} cols={cols} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function AdminSkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="flex justify-between items-start mb-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
    )
}

export function AdminSkeletonDetail() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}
                </div>
            </div>
        </div>
    )
}
