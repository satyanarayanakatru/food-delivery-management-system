import React from 'react'
import { PackageOpen, RotateCcw } from 'lucide-react'

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search query or status filters.',
  actionLabel = 'Reset Filters',
  onAction,
  icon: Icon = PackageOpen
}) {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-8 h-8 stroke-[1.5] text-orange-400" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors inline-flex items-center gap-2 active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
