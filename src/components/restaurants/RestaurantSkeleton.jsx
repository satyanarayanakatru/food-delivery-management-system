import React from 'react'
import { SkeletonBox } from '../common/SkeletonLoader'

export default function RestaurantSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden p-0 animate-pulse">
      {/* Top Banner Skeleton */}
      <SkeletonBox className="h-48 w-full rounded-none" />

      {/* Body Skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-5 w-3/5" />
          <SkeletonBox className="h-5 w-12 rounded-lg" />
        </div>
        <SkeletonBox className="h-3.5 w-4/5" />
        <div className="flex gap-2">
          <SkeletonBox className="h-4 w-16 rounded-md" />
          <SkeletonBox className="h-4 w-20 rounded-md" />
        </div>
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-8 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
