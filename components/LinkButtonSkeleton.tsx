'use client'

export function LinkButtonSkeleton() {
  return (
    <div className="glass-card flex items-center gap-4 p-4 md:p-5 rounded-xl animate-pulse">
      {/* Icon skeleton */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10" />
      
      {/* Content skeleton */}
      <div className="flex-grow min-w-0 space-y-2">
        <div className="h-5 w-24 bg-white/10 rounded" />
        <div className="h-3 w-16 bg-white/5 rounded" />
      </div>
      
      {/* Arrow skeleton */}
      <div className="w-4 h-4 bg-white/5 rounded" />
    </div>
  )
}

export function LinkButtonSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3 px-2 mt-2">
      {[...Array(count)].map((_, i) => (
        <LinkButtonSkeleton key={i} />
      ))}
    </div>
  )
}
