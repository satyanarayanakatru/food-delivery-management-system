import React, { useState } from 'react'
import { DollarSign, TrendingUp, Calendar, BarChart3, ArrowUpRight } from 'lucide-react'
import { REVENUE_DATA_WEEKLY, REVENUE_DATA_MONTHLY } from '../../data/mockDashboardData'

export default function RevenueChart() {
  const [period, setPeriod] = useState('weekly')
  const [hoveredBar, setHoveredBar] = useState(null)

  const activeData = period === 'weekly' ? REVENUE_DATA_WEEKLY : REVENUE_DATA_MONTHLY
  const maxRevenue = Math.max(...activeData.map((d) => d.revenue)) * 1.15

  const totalPeriodRevenue = activeData.reduce((acc, curr) => acc + curr.revenue, 0)
  const totalPeriodOrders = activeData.reduce((acc, curr) => acc + curr.orders, 0)
  const avgOrderValue = (totalPeriodRevenue / (totalPeriodOrders || 1)).toFixed(2)

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">Revenue Summary & Analytics</h3>
          </div>
          <p className="text-xs text-slate-400">
            Realtime revenue streams & order distribution (Dummy Data)
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => {
              setPeriod('weekly')
              setHoveredBar(null)
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'weekly'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => {
              setPeriod('monthly')
              setHoveredBar(null)
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'monthly'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* KPI Mini-Row */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/70">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
            Period Revenue
          </span>
          <p className="text-lg font-black text-white">
            ${totalPeriodRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5 font-semibold">
            <TrendingUp className="w-2.5 h-2.5" /> +18.6% growth
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
            Total Orders
          </span>
          <p className="text-lg font-black text-orange-400">
            {totalPeriodOrders.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Dispatched via portal
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
            Avg Ticket
          </span>
          <p className="text-lg font-black text-emerald-400">
            ${avgOrderValue}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Per fulfilled order
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart Visual */}
      <div className="space-y-2">
        <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800/80 relative">
          {/* Subtle Gridlines */}
          <div className="absolute inset-x-0 top-6 border-b border-slate-800/30"></div>
          <div className="absolute inset-x-0 top-1/2 border-b border-slate-800/30"></div>

          {activeData.map((item, idx) => {
            const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 100))
            const isHovered = hoveredBar?.label === item.label

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-xl bg-slate-800 text-white text-[11px] font-bold shadow-xl border border-slate-700 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-orange-400 font-black">${item.revenue.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-300 font-normal">{item.orders} orders</p>
                  </div>
                )}

                {/* Animated Bar */}
                <div
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                    isHovered
                      ? 'bg-gradient-to-t from-orange-600 via-orange-500 to-amber-400 shadow-lg shadow-orange-500/30'
                      : 'bg-gradient-to-t from-slate-800 via-orange-900/40 to-orange-500/80 hover:bg-orange-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
            )
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between gap-2 px-2 pt-2 text-[11px] font-semibold text-slate-400">
          {activeData.map((item, idx) => (
            <div
              key={idx}
              className={`flex-1 text-center truncate ${
                hoveredBar?.label === item.label ? 'text-orange-400 font-bold' : ''
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
