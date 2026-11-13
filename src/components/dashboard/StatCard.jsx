import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  colorScheme = 'orange',
  pulse = false
}) {
  const colorStyles = {
    orange: {
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    red: {
      bg: 'bg-red-500/10 text-red-400 border-red-500/20',
      badge: 'text-red-400 bg-red-500/10 border-red-500/20'
    }
  }

  const styles = colorStyles[colorScheme] || colorStyles.orange

  return (
    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 shadow-lg shadow-black/20 backdrop-blur-md group relative overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            {title}
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{value}</span>
            {pulse && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
            )}
          </h3>
        </div>

        <div className={`p-2.5 rounded-xl border ${styles.bg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${styles.badge}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </span>
          <span className="text-slate-500 text-[10px]">&bull; Realtime metric</span>
        </div>
      )}
    </div>
  )
}
