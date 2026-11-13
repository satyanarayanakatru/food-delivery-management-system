/**
 * OrderStatusPieChart — dynamic SVG pie chart of order status breakdown.
 * Data comes from AppDataContext (real orders), never hardcoded.
 */
import React, { useState } from 'react'
import { PieChart, CheckCircle2, Clock, Bike, XCircle } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'

const STATUS_CONFIG = [
  { key: 'Preparing',        color: '#f59e0b', bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/30',  icon: Clock },
  { key: 'Out for Delivery', color: '#3b82f6', bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30',   icon: Bike },
  { key: 'Delivered',        color: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  { key: 'Cancelled',        color: '#ef4444', bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/30',    icon: XCircle },
]

function buildPieSegments(data, total) {
  if (total === 0) return []
  let cumAngle = -90 // start from top
  return data.map(({ key, value, color }) => {
    const pct = value / total
    const angle = pct * 360
    const startAngle = (cumAngle * Math.PI) / 180
    const endAngle = ((cumAngle + angle) * Math.PI) / 180
    const cx = 80, cy = 80, r = 60
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = angle > 180 ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    cumAngle += angle
    return { key, value, color, path, pct }
  })
}

export default function OrderStatusPieChart() {
  const { stats } = useAppData()
  const [hovered, setHovered] = useState(null)

  const breakdown = stats.statusBreakdown
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0)

  const pieData = STATUS_CONFIG.map(c => ({
    key: c.key,
    value: breakdown[c.key] || 0,
    color: c.color
  })).filter(d => d.value > 0)

  const segments = buildPieSegments(pieData, total)

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl h-full">
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <PieChart className="w-4 h-4" />
        </span>
        <h3 className="text-base font-bold text-white">Order Status Breakdown</h3>
      </div>
      <p className="text-xs text-slate-400 mb-5">Live distribution across all {total} orders</p>

      {total === 0 ? (
        <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
          No orders yet. Place one to see data!
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* SVG Pie */}
          <div className="relative shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160">
              {/* Background donut hole */}
              <circle cx="80" cy="80" r="38" fill="#020617" />
              {segments.map((seg) => (
                <path
                  key={seg.key}
                  d={seg.path}
                  fill={seg.color}
                  opacity={hovered === null || hovered === seg.key ? 1 : 0.3}
                  className="cursor-pointer transition-opacity duration-150"
                  onMouseEnter={() => setHovered(seg.key)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
              {/* Center text */}
              <text x="80" y="76" textAnchor="middle" fill="white" fontSize="18" fontWeight="900">{total}</text>
              <text x="80" y="90" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600">ORDERS</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5 w-full">
            {STATUS_CONFIG.map(({ key, bg, text, border, icon: Icon }) => {
              const value = breakdown[key] || 0
              const pct = total > 0 ? Math.round((value / total) * 100) : 0
              const isHov = hovered === key
              return (
                <div
                  key={key}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-default ${bg} ${border} ${isHov ? 'scale-[1.02] shadow-md' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${text}`} />
                    <span className={`text-xs font-bold ${text}`}>{key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{value}</span>
                    <span className={`text-[10px] font-bold ${text}`}>{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
