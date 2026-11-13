import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  ArrowLeft,
  Menu,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  UtensilsCrossed,
  MapPin,
  Phone,
  Star,
  Package,
  Navigation,
  RefreshCw,
  Copy,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import Sidebar from '../components/layout/Sidebar'
import { INITIAL_RECENT_ORDERS } from '../data/mockDashboardData'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeOrder(o) {
  return {
    ...o,
    orderStatus: o.orderStatus || o.status || 'Preparing',
    totalAmount: o.totalAmount ?? o.total ?? 0,
    estimatedDelivery: o.estimatedDelivery || o.eta || '30 mins',
    placedAt: o.placedAt || 'Just now',
    rider: o.rider || 'Rider Assigned',
    customer: {
      name: o.customer?.name || 'Customer',
      email: o.customer?.email || '',
      phone: o.customer?.phone || '+1 (555) 000-0000',
      avatar: o.customer?.avatar || '/satyanarayana.jpg'
    }
  }
}

// Status pipeline — ordered steps
const PIPELINE = [
  {
    key: 'Order Placed',
    icon: Package,
    label: 'Order Placed',
    sub: 'Your order has been received by the restaurant.'
  },
  {
    key: 'Preparing',
    icon: Flame,
    label: 'Preparing',
    sub: 'The kitchen is cooking your delicious food!'
  },
  {
    key: 'Out for Delivery',
    icon: Bike,
    label: 'Out for Delivery',
    sub: 'Your rider has picked up and is heading to you.'
  },
  {
    key: 'Delivered',
    icon: CheckCircle2,
    label: 'Delivered',
    sub: 'Order delivered successfully. Enjoy your meal! 🎉'
  }
]

// Which PIPELINE index the current status maps to
function getStepIndex(status) {
  if (status === 'Cancelled') return -1
  if (status === 'Delivered') return 3
  if (status === 'Out for Delivery') return 2
  if (status === 'Preparing') return 1
  return 0 // Order Placed
}

// ETA progress % for the progress bar
function getEtaProgress(status) {
  if (status === 'Cancelled') return 0
  if (status === 'Delivered') return 100
  if (status === 'Out for Delivery') return 70
  if (status === 'Preparing') return 35
  return 10
}

// Rider avatar seed from name
function riderAvatar(name) {
  const seeds = ['marcus', 'riya', 'jake', 'priya', 'leon', 'carlos', 'sarah', 'dave', 'leo']
  const urls = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  ]
  const idx = name ? name.charCodeAt(0) % urls.length : 0
  return urls[idx]
}

// ─── Live ETA Countdown ───────────────────────────────────────────────────────
function EtaCountdown({ estimatedDelivery, status }) {
  const [seconds, setSeconds] = useState(() => {
    const match = String(estimatedDelivery).match(/(\d+)/)
    return match ? parseInt(match[1]) * 60 : 0
  })

  useEffect(() => {
    if (status === 'Delivered' || status === 'Cancelled' || seconds <= 0) return
    const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [status, seconds])

  if (status === 'Delivered') return <span className="text-emerald-400 font-black">Delivered ✓</span>
  if (status === 'Cancelled') return <span className="text-red-400 font-black">Cancelled</span>
  if (seconds <= 0) return <span className="text-orange-400 font-black">Arriving soon…</span>

  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <span className="font-black text-white tabular-nums">
      {m}:{String(s).padStart(2, '0')} <span className="text-slate-400 font-normal text-xs">remaining</span>
    </span>
  )
}

// ─── Tracking Timeline ────────────────────────────────────────────────────────
function TrackingTimeline({ status }) {
  const stepIndex = getStepIndex(status)
  const isCancelled = status === 'Cancelled'

  if (isCancelled) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
          <XCircle className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="font-black text-red-400 text-lg">Order Cancelled</p>
          <p className="text-xs text-slate-400 mt-1">This order was cancelled. Any payment will be refunded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-800 rounded-full" />

      <div className="space-y-0">
        {PIPELINE.map((step, idx) => {
          const Icon = step.icon
          const isDone = idx <= stepIndex
          const isActive = idx === stepIndex
          const isFuture = idx > stepIndex

          return (
            <div key={step.key} className="relative flex items-start gap-4 pb-7 last:pb-0">
              {/* Step dot */}
              <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${
                isActive
                  ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/40'
                  : isDone
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}>
                {isDone && !isActive
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  : <Icon className={`w-5 h-5 ${isActive ? 'text-white' : isFuture ? 'text-slate-600' : 'text-white'}`} />
                }
                {/* Pulse ring on active */}
                {isActive && (
                  <span className="absolute inset-0 rounded-xl border-2 border-orange-400 animate-ping opacity-50" />
                )}
              </div>

              {/* Step text */}
              <div className="pt-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-black ${isActive ? 'text-white' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-1.5 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                  {isDone && !isActive && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                      Done
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-slate-300' : isDone ? 'text-slate-500' : 'text-slate-700'}`}>
                  {step.sub}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Map Placeholder ──────────────────────────────────────────────────────────
function MapCard({ order }) {
  const isDelivered = order.orderStatus === 'Delivered'
  const isCancelled = order.orderStatus === 'Cancelled'

  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
      {/* Fake map grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251,146,60,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,146,60,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Road lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-slate-700 opacity-60" />
        <div className="absolute w-0.5 h-full bg-slate-700 opacity-60" />
      </div>

      {/* Animated rider dot */}
      {!isDelivered && !isCancelled && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center shadow-lg shadow-orange-500/50 animate-bounce">
              <Bike className="w-4 h-4 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping" />
          </div>
        </div>
      )}

      {/* Destination pin */}
      <div className="absolute bottom-6 right-8">
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white font-bold whitespace-nowrap shadow">
            Your Location
          </div>
        </div>
      </div>

      {/* Restaurant pin */}
      <div className="absolute top-6 left-8">
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-md">
            <UtensilsCrossed className="w-3 h-3 text-white" />
          </div>
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white font-bold whitespace-nowrap shadow">
            Restaurant
          </div>
        </div>
      </div>

      {/* Overlay if delivered or cancelled */}
      {(isDelivered || isCancelled) && (
        <div className={`absolute inset-0 flex items-center justify-center ${isDelivered ? 'bg-emerald-950/60' : 'bg-red-950/60'}`}>
          <div className={`text-center px-4 py-3 rounded-2xl border ${isDelivered ? 'bg-emerald-900/80 border-emerald-700' : 'bg-red-900/80 border-red-700'}`}>
            {isDelivered
              ? <><CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" /><p className="text-emerald-300 font-bold text-sm">Order Delivered!</p></>
              : <><XCircle className="w-8 h-8 text-red-400 mx-auto mb-1" /><p className="text-red-300 font-bold text-sm">Order Cancelled</p></>
            }
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrderTrackingPage() {
  const { currentUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchId, setSearchId] = useState(searchParams.get('id') || '')
  const [inputId, setInputId] = useState(searchParams.get('id') || '')
  const [showItems, setShowItems] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [liveStatus, setLiveStatus] = useState(null) // simulated live updates

  const { orders: allOrders, updateOrderStatus } = useAppData()

  const order = useMemo(() => {
    if (!searchId.trim()) return null
    return allOrders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase()) || null
  }, [searchId, allOrders])

  // Apply live status override
  const displayOrder = useMemo(() => {
    if (!order) return null
    return liveStatus ? { ...order, orderStatus: liveStatus } : order
  }, [order, liveStatus])

  // Auto-search if URL has ?id=
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) { setSearchId(id); setInputId(id) }
  }, [searchParams])

  // Simulate status auto-advance for active orders
  useEffect(() => {
    if (!displayOrder) return
    const status = displayOrder.orderStatus
    if (status === 'Delivered' || status === 'Cancelled') return

    // Auto-advance Preparing → Out for Delivery after 15s (demo feel)
    if (status === 'Preparing') {
      const t = setTimeout(() => {
        updateOrderStatus(displayOrder.id, 'Out for Delivery')
        setLiveStatus('Out for Delivery')
        toast.info('🛵 Your rider has picked up the order!', { autoClose: 4000 })
      }, 15000)
      return () => clearTimeout(t)
    }
  }, [displayOrder?.id, displayOrder?.orderStatus])

  const handleSearch = (e) => {
    e?.preventDefault()
    if (!inputId.trim()) { toast.warning('Enter an Order ID to track.'); return }
    setSearchId(inputId.trim())
    setLiveStatus(null)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setLiveStatus(null)
    setTimeout(() => {
      setRefreshing(false)
      toast.success('Status refreshed!', { icon: '🔄', autoClose: 2000 })
    }, 1200)
  }

  const handleCopyId = () => {
    if (!displayOrder) return
    navigator.clipboard.writeText(displayOrder.id)
      .then(() => toast.info('Order ID copied!', { autoClose: 1500 }))
  }

  const stepIndex = displayOrder ? getStepIndex(displayOrder.orderStatus) : -1
  const etaProgress = displayOrder ? getEtaProgress(displayOrder.orderStatus) : 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col w-full">
          {/* Top Bar */}
          <header className="bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-orange-400" />
                  Order Tracking
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">Live status updates for your orders</p>
              </div>
            </div>
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </header>

          {/* Page Body */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Track Your Order</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputId}
                    onChange={e => setInputId(e.target.value)}
                    placeholder="Enter Order ID (e.g. FD-7892)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Track
                </button>
              </div>

              {/* Quick pick — recent orders */}
              {allOrders.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase self-center">Quick pick:</span>
                  {allOrders.slice(0, 5).map(o => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => { setInputId(o.id); setSearchId(o.id); setLiveStatus(null) }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 border border-slate-700 transition-all font-mono"
                    >
                      {o.id}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* No order found */}
            {searchId && !displayOrder && (
              <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-white">Order Not Found</h3>
                <p className="text-sm text-slate-400">No order with ID <code className="text-orange-400">{searchId}</code> was found.</p>
                <p className="text-xs text-slate-500">Try one of the quick-pick IDs above.</p>
              </div>
            )}

            {/* Empty state */}
            {!searchId && (
              <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
                  <Navigation className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">Track Your Delivery</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">Enter your Order ID above or click one of the quick-pick buttons to see live status.</p>
              </div>
            )}

            {/* ORDER FOUND — Full tracking UI */}
            {displayOrder && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                {/* ── LEFT COLUMN: Timeline + Map (3 cols) ── */}
                <div className="lg:col-span-3 space-y-5">

                  {/* Status Header Card */}
                  <div className={`p-5 rounded-3xl border backdrop-blur-xl relative overflow-hidden ${
                    displayOrder.orderStatus === 'Delivered'
                      ? 'bg-emerald-950/40 border-emerald-700/50'
                      : displayOrder.orderStatus === 'Cancelled'
                        ? 'bg-red-950/40 border-red-700/50'
                        : 'bg-orange-950/30 border-orange-700/40'
                  }`}>
                    {/* Glow */}
                    <div className={`absolute inset-0 opacity-10 ${
                      displayOrder.orderStatus === 'Delivered' ? 'bg-emerald-500' :
                      displayOrder.orderStatus === 'Cancelled' ? 'bg-red-500' : 'bg-orange-500'
                    }`} />

                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-black text-white font-mono">{displayOrder.id}</code>
                          <button onClick={handleCopyId} className="p-1 rounded-md text-slate-400 hover:text-white transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">{displayOrder.restaurant} · Placed {displayOrder.placedAt}</p>
                        <div className="mt-2.5 text-sm">
                          <span className="text-slate-400 text-xs">ETA: </span>
                          <EtaCountdown estimatedDelivery={displayOrder.estimatedDelivery} status={displayOrder.orderStatus} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={handleRefresh}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all ${refreshing ? 'animate-spin' : ''}`}
                          disabled={refreshing}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          {!refreshing && 'Refresh'}
                        </button>
                      </div>
                    </div>

                    {/* ETA Progress Bar */}
                    {displayOrder.orderStatus !== 'Cancelled' && (
                      <div className="relative mt-4 w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${etaProgress}%`,
                            background: displayOrder.orderStatus === 'Delivered'
                              ? 'linear-gradient(90deg,#10b981,#34d399)'
                              : 'linear-gradient(90deg,#f97316,#fbbf24)'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Tracking Timeline Card */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                    <h3 className="text-sm font-black text-white mb-5 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-orange-400" />
                      Delivery Timeline
                    </h3>
                    <TrackingTimeline status={displayOrder.orderStatus} />
                  </div>

                  {/* Map Card */}
                  <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      Live Map
                      <span className="ml-auto text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Simulated</span>
                    </h3>
                    <MapCard order={displayOrder} />
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Restaurant</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />Your Rider</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Your Location</span>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: Order Details (2 cols) ── */}
                <div className="lg:col-span-2 space-y-5">

                  {/* Rider Card */}
                  {displayOrder.orderStatus !== 'Cancelled' && (
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Your Delivery Rider</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-lg shrink-0">
                          <img
                            src={riderAvatar(displayOrder.rider)}
                            alt={displayOrder.rider}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.style.display='none' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-white text-sm truncate">{displayOrder.rider}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                            ))}
                            <span className="text-[10px] text-slate-400 ml-1">4.8 · 320 trips</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">Electric Bike · In-service</p>
                        </div>
                        <button className="w-9 h-9 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 flex items-center justify-center transition-all shrink-0">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>

                      {displayOrder.orderStatus === 'Out for Delivery' && (
                        <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2 text-xs text-blue-300">
                          <Bike className="w-4 h-4 shrink-0 animate-bounce" />
                          <span>Rider is on the way! Estimated <strong className="text-white">{displayOrder.estimatedDelivery}</strong></span>
                        </div>
                      )}
                      {displayOrder.orderStatus === 'Delivered' && (
                        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Delivered! Leave a tip for <strong className="text-white">{displayOrder.rider.split(' ')[0]}</strong></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                    <button
                      onClick={() => setShowItems(s => !s)}
                      className="w-full flex items-center justify-between mb-1"
                    >
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Order Summary</h3>
                      {showItems ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-black text-white">{displayOrder.restaurant}</p>
                      <span className="text-xs text-slate-400">{displayOrder.items?.length || 0} item(s)</span>
                    </div>

                    {/* Expandable item list */}
                    {showItems && (
                      <div className="space-y-2 mb-4 pb-4 border-b border-slate-800">
                        {displayOrder.items?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-orange-500/15 text-orange-400 text-[10px] font-black flex items-center justify-center shrink-0">
                                {item.qty}
                              </span>
                              <span className="text-slate-300 truncate max-w-[140px]">{item.name}</span>
                            </div>
                            <span className="font-semibold text-white shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span className="text-slate-200">${(displayOrder.totalAmount * 0.88).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Tax & Fees</span>
                        <span className="text-slate-200">${(displayOrder.totalAmount * 0.12).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Payment</span>
                        <span className="text-slate-200">{displayOrder.paymentMethod}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between">
                        <span className="font-black text-white">Total Paid</span>
                        <span className="font-black text-orange-400">${displayOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl grid grid-cols-2 gap-4 text-xs">
                    {[
                      { label: 'Customer', value: displayOrder.customer.name },
                      { label: 'Placed At', value: displayOrder.placedAt },
                      { label: 'Payment', value: displayOrder.paymentStatus || 'Paid' },
                      { label: 'ETA', value: displayOrder.estimatedDelivery }
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
                        <p className="text-white font-semibold mt-0.5 truncate">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/history"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      View All Orders
                    </Link>
                    <Link
                      to="/restaurants"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-500/20"
                    >
                      Order Again
                    </Link>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
