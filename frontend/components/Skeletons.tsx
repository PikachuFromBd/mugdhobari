'use client'

/* ──────────────────────────────────────────────
   Skeleton loaders for products / hero / sections
   ────────────────────────────────────────────── */

export function ProductCardSkeleton() {
  return (
    <div className="product-card animate-pulse">
      <div className="h-44 sm:h-52 md:h-56 bg-gray-200 rounded-t-2xl" />
      <div className="p-3 sm:p-3.5 space-y-2.5">
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded-lg w-20" />
          <div className="h-4 bg-gray-200 rounded-full w-16 hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="pt-[4.25rem]">
      <div className="container mx-auto px-4 pt-4">
        <div className="rounded-2xl overflow-hidden animate-pulse" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
          <div className="relative h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] bg-gray-200">
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 space-y-3">
              <div className="h-6 bg-gray-300/60 rounded-full w-24" />
              <div className="h-8 bg-gray-300/60 rounded-lg w-3/4 max-w-md" />
              <div className="h-4 bg-gray-300/40 rounded-lg w-1/2 max-w-sm" />
              <div className="flex gap-3 pt-1">
                <div className="h-8 bg-gray-300/60 rounded-lg w-20" />
                <div className="h-10 bg-orange-300/50 rounded-xl w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrendingSkeleton() {
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 space-y-2">
          <div className="h-7 bg-gray-200 rounded-lg w-48 mx-auto animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-lg w-64 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function CategorySkeleton() {
  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4 space-y-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gray-200 rounded-xl" />
                <div className="h-6 bg-gray-200 rounded-lg w-28" />
              </div>
              <div className="h-4 bg-gray-200 rounded-lg w-16" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {Array.from({ length: 4 }).map((_, j) => (
                <ProductCardSkeleton key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Cart page skeleton ── */
export function CartSkeleton() {
  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded-lg w-40 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-soft p-4 sm:p-5 flex flex-col sm:flex-row gap-4 animate-pulse">
                <div className="w-full sm:w-28 h-28 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-6 bg-gray-200 rounded-lg w-24" />
                  <div className="h-4 bg-gray-200 rounded-lg w-20" />
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-10 bg-gray-200 rounded-lg w-28" />
                    <div className="h-10 bg-gray-200 rounded-lg w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-5 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded-lg w-32" />
              <div className="space-y-3">
                <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-20" /><div className="h-4 bg-gray-200 rounded w-12" /></div>
                <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-24" /><div className="h-4 bg-gray-200 rounded w-12" /></div>
                <div className="border-t pt-4 flex justify-between"><div className="h-6 bg-gray-200 rounded w-24" /><div className="h-6 bg-orange-200 rounded w-20" /></div>
              </div>
              <div className="h-12 bg-orange-200 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Order success page skeleton ── */
export function OrderSuccessSkeleton() {
  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success banner */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-200 rounded-2xl p-6 sm:p-8 mb-6 animate-pulse">
          <div className="w-14 h-14 bg-gray-300 rounded-full mx-auto mb-3" />
          <div className="h-7 bg-gray-300 rounded-lg w-56 mx-auto mb-2" />
          <div className="h-4 bg-gray-300/60 rounded-lg w-72 mx-auto" />
        </div>
        {/* Order ID card */}
        <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-7 bg-gray-200 rounded w-44" />
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-36 mt-3" />
        </div>
        {/* Shipping info */}
        <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4 animate-pulse space-y-4">
          <div className="h-3 bg-gray-200 rounded w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-gray-100 rounded w-12" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
        {/* Tracking stepper */}
        <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4 animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-28 mb-6" />
          <div className="hidden sm:flex items-center justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: '20%' }}>
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
              </div>
            ))}
          </div>
          <div className="sm:hidden space-y-5 pl-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        </div>
        {/* Items */}
        <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4 animate-pulse space-y-3">
          <div className="h-3 bg-gray-200 rounded w-28" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-3">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-28" />
                <div className="h-4 bg-orange-100 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
        {/* Receipt */}
        <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4 animate-pulse space-y-3">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-12 bg-orange-50 rounded-xl" />
          <div className="space-y-2">
            <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-24" /><div className="h-4 bg-gray-200 rounded w-16" /></div>
            <div className="flex justify-between border-t pt-3"><div className="h-5 bg-gray-200 rounded w-20" /><div className="h-5 bg-orange-200 rounded w-20" /></div>
          </div>
        </div>
        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 mb-4 animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-20 mb-4" />
          <div className="flex gap-3">
            <div className="flex-1 h-10 bg-blue-50 rounded-xl" />
            <div className="flex-1 h-10 bg-green-50 rounded-xl" />
            <div className="flex-1 h-10 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="h-12 bg-orange-200 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

/* ── Admin layout/auth check skeleton ── */
export function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 animate-pulse">
      <div className="flex">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen p-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-36 mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg w-full" />
          ))}
          <div className="flex-1" />
          <div className="h-10 bg-gray-200 rounded-lg w-full" />
        </div>
        {/* Main content skeleton */}
        <div className="flex-1 p-6 space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Admin table skeleton (for product/order management) ── */
export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-7 bg-gray-200 rounded-lg w-36" />
        <div className="h-10 bg-orange-200 rounded-lg w-40" />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 pb-3 border-b">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-50">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 bg-gray-100 rounded w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
