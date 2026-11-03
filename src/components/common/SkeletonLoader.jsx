import React from 'react'

export function SkeletonBox({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-800/60 rounded-xl ${className}`}
    ></div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-4 w-28" />
        <SkeletonBox className="h-8 w-8 rounded-xl" />
      </div>
      <SkeletonBox className="h-8 w-20" />
      <SkeletonBox className="h-3 w-36" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-800/60 animate-pulse">
      <td className="py-4 px-4"><SkeletonBox className="h-4 w-16" /></td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <SkeletonBox className="h-3.5 w-24" />
            <SkeletonBox className="h-2.5 w-32" />
          </div>
        </div>
      </td>
      <td className="py-4 px-4"><SkeletonBox className="h-3.5 w-28" /></td>
      <td className="py-4 px-4"><SkeletonBox className="h-4 w-14" /></td>
      <td className="py-4 px-4"><SkeletonBox className="h-5 w-20 rounded-full" /></td>
      <td className="py-4 px-4 text-right"><SkeletonBox className="h-7 w-20 rounded-lg ml-auto" /></td>
    </tr>
  )
}
