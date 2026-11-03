import React, { useState, useEffect } from 'react'
import { Radio, Zap, ShoppingBag, Bike, Sparkles, CheckCircle2 } from 'lucide-react'

const LIVE_EVENTS = [
  { id: 1, type: 'order', text: 'Order #FD-9481 (Truffle Wagyu Burger) placed by Sarah in Downtown', time: 'Just now', icon: ShoppingBag, color: 'text-amber-400' },
  { id: 2, type: 'dispatch', text: 'Rider Marcus assigned • 14 min estimated delivery to 4th Ave', time: '1 min ago', icon: Bike, color: 'text-cyan-400' },
  { id: 3, type: 'kitchen', text: 'Artisan Crust Pizza marked 4x Neapolitan Pizzas ready for pickup', time: '2 mins ago', icon: Sparkles, color: 'text-orange-400' },
  { id: 4, type: 'delivery', text: 'Order #FD-9477 delivered successfully • 5★ rating received', time: '3 mins ago', icon: CheckCircle2, color: 'text-emerald-400' },
  { id: 5, type: 'promo', text: 'Flash Coupon "FOODIE25" applied for 25% discount in Midtown', time: '4 mins ago', icon: Zap, color: 'text-purple-400' },
]

export default function RealtimeTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const currentEvent = LIVE_EVENTS[currentIndex]
  const Icon = currentEvent.icon

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800/80 text-xs text-slate-300 py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Live status pill */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-[11px] tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3" />
            Live Dispatch Stream
          </span>
        </div>

        {/* Center: Animated Live Event */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-2xl text-left">
          <Icon className={`w-3.5 h-3.5 ${currentEvent.color} shrink-0 animate-pulse`} />
          <span className="truncate text-[11px] font-medium text-slate-200">
            {currentEvent.text}
          </span>
          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
            ({currentEvent.time})
          </span>
        </div>

        {/* Right: Live stats counters */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-300 font-semibold">1,248</span> active riders
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-300 font-semibold">99.8%</span> on-time rate
          </div>
        </div>
      </div>
    </div>
  )
}
