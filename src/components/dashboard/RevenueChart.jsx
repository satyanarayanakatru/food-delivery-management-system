/**
 * RevenueChart — fully dynamic, reads from AppDataContext.
 * Shows real revenue from placed orders, distributed across last 7 days.
 */
import React, { useState } from 'react'
import { DollarSign, TrendingUp } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'

export default function RevenueChart() {
  const { stats } = useAppData()
  const [hoveredBar, setHoveredBar] = useState(null)

  const data = stats.revenueByDay
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1) * 1.15

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = data.reduce((s, d) => s + d.orders, 0)
  const avg = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">Revenue Analytics</h3>
          </div>
          <p className="text-xs text-slate-400">Live revenue from all placed orders — last 7 days</p>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 self-start">
          <TrendingUp className="w-3 h-3" /> Dynamic Data
        </span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/70">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">7-Day Revenue</span>
          <p className="text-lg font-black text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5 font-semibold">
            <TrendingUp className="w-2.5 h-2.5" /> From real orders
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Orders</span>
          <p className="text-lg font-black text-orange-400">{totalOrders.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Fulfilled this week</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Avg Ticket</span>
          <p className="text-lg font-black text-emerald-400">${avg}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Per order value</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-2">
        <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800/80 relative">
          <div className="absolute inset-x-0 top-6 border-b border-slate-800/30" />
          <div className="absolute inset-x-0 top-1/2 border-b border-slate-800/30" />

          {data.map((item, idx) => {
            const hasOrders = item.orders > 0 || item.revenue > 0
            // Days with 0 orders stay flat at baseline (0%), while days with >= 1 order are clearly visible (at least 18% up to 100%)
            const heightPercent = hasOrders
              ? Math.max(18, Math.min(100, Math.round((item.revenue / maxRevenue) * 100)))
              : 0
            const isHovered = hoveredBar?.label === item.label

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer relative group"
              >
                {isHovered && (
                  <div className="absolute -top-14 z-20 px-3 py-2 rounded-xl bg-slate-800 text-white text-[11px] font-bold shadow-xl border border-slate-700 whitespace-nowrap pointer-events-none">
                    <p className="text-orange-400 font-black">${item.revenue.toFixed(2)}</p>
                    <p className="text-[9px] text-slate-300 font-normal">
                      {item.orders} {item.orders === 1 ? 'order' : 'orders'}
                    </p>
                  </div>
                )}
                {hasOrders ? (
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: `${heightPercent}%` }}>
                    {/* Always-visible amount on top of bar */}
                    <span className="text-[10px] font-black text-amber-300 mb-1 select-none drop-shadow">
                      ${Math.round(item.revenue)}
                    </span>
                    <div
                      className={`w-full max-w-[42px] h-full rounded-t-xl transition-all duration-300 ${
                        isHovered
                          ? 'bg-gradient-to-t from-orange-600 via-orange-500 to-amber-300 shadow-xl shadow-orange-500/50 brightness-110 scale-[1.03]'
                          : 'bg-gradient-to-t from-orange-600 via-orange-500 to-amber-400 shadow-md shadow-orange-500/25 border-t border-orange-300/40'
                      }`}
                    />
                  </div>
                ) : (
                  <div
                    className={`w-full max-w-[42px] h-[3px] rounded-full transition-colors ${
                      isHovered ? 'bg-slate-600' : 'bg-slate-800/80'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex items-center justify-between gap-2 px-2 pt-2 text-[11px] font-semibold text-slate-400">
          {data.map((item, idx) => {
            const hasOrders = item.orders > 0 || item.revenue > 0
            const isHovered = hoveredBar?.label === item.label
            return (
              <div
                key={idx}
                className={`flex-1 text-center truncate transition-colors ${
                  isHovered
                    ? 'text-orange-400 font-bold'
                    : hasOrders
                    ? 'text-slate-200 font-bold'
                    : 'text-slate-500'
                }`}
              >
                {item.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
