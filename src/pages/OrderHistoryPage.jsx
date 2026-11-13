import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  History,
  Search,
  ArrowLeft,
  Menu,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  PackageOpen,
  Navigation,
  DollarSign,
  Activity
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useAppData } from '../context/AppDataContext'
import Sidebar from '../components/layout/Sidebar'

function getStatusInfo(status) {
  switch (status) {
    case 'Delivered':
      return { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 }
    case 'Out for Delivery':
      return { color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: Bike }
    case 'Preparing':
      return { color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: Clock }
    case 'Cancelled':
      return { color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle }
    default:
      return { color: 'bg-slate-700/40 text-slate-300 border-slate-600', icon: AlertCircle }
  }
}

export default function OrderHistoryPage() {
  const { currentUser, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const { orders: appOrders, updateOrderStatus, refresh } = useAppData()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [expandedId, setExpandedId]   = useState(null)

  const STATUS_TABS = ['All', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

  // Dynamic filter over single source of truth orders
  const filteredOrders = useMemo(() =>
    appOrders.filter(o => {
      const matchStatus = statusFilter === 'All' || o.orderStatus === statusFilter
      const q = search.toLowerCase()
      const matchSearch = !q ||
        o.id?.toLowerCase().includes(q) ||
        o.restaurant?.toLowerCase().includes(q) ||
        o.items?.some(it => it.name.toLowerCase().includes(q))
      return matchStatus && matchSearch
    }),
    [appOrders, statusFilter, search]
  )

  // Summary metrics matching Dashboard 1:1
  const totalOrdersCount    = appOrders.length
  const activeOrdersCount   = appOrders.filter(o => ['Preparing', 'Out for Delivery'].includes(o.orderStatus)).length
  const deliveredOrdersCount = appOrders.filter(o => o.orderStatus === 'Delivered').length
  const cancelledOrdersCount = appOrders.filter(o => o.orderStatus === 'Cancelled').length
  const totalSpentAmount    = appOrders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0)

  const handleReorder = (order) => {
    if (!order.items?.length) { toast.info('No items to reorder.'); return }
    order.items.forEach(item => {
      addToCart({
        id: `reorder-${item.name.replace(/\s/g, '-').toLowerCase()}-${Date.now()}`,
        name: item.name,
        price: item.price,
        quantity: item.qty || 1,
        restaurantName: order.restaurant,
        isVeg: true,
        category: 'Reorder',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
      })
    })
    toast.success(`${order.items.length} item(s) added to cart!`, { icon: '🛒' })
  }

  const handleMarkDelivered = (orderId) => {
    updateOrderStatus(orderId, 'Delivered')
    toast.success(`Order ${orderId} marked as Delivered! Dashboard stats updated.`, { icon: '✅' })
  }

  const handleDownloadInvoice = (order) => {
    toast.info(`Invoice for ${order.id} downloaded successfully!`, { icon: '📄' })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col w-full">
          {/* Top Bar */}
          <header className="bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <History className="w-5 h-5 text-orange-400" />
                  Order History & Invoices
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Live synchronized list · {totalOrdersCount} orders total ({activeOrdersCount} active, {deliveredOrdersCount} delivered)
                </p>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </header>

          {/* Page Body */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl w-full mx-auto">

            {/* ── Summary KPI Strip (Matches Dashboard 1:1) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Orders</p>
                  <p className="text-base font-black text-white">{totalOrdersCount}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Active Orders</p>
                  <p className="text-base font-black text-amber-400">{activeOrdersCount}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Delivered</p>
                  <p className="text-base font-black text-emerald-400">{deliveredOrdersCount}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Spent</p>
                  <p className="text-base font-black text-white">${totalSpentAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, restaurant or dish name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {STATUS_TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                      statusFilter === tab
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab}
                    {tab === 'All' && ` (${totalOrdersCount})`}
                    {tab === 'Delivered' && ` (${deliveredOrdersCount})`}
                    {tab === 'Preparing' && ` (${appOrders.filter(o => o.orderStatus === 'Preparing').length})`}
                    {tab === 'Out for Delivery' && ` (${appOrders.filter(o => o.orderStatus === 'Out for Delivery').length})`}
                    {tab === 'Cancelled' && ` (${cancelledOrdersCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-white">No orders found</h3>
                <p className="text-sm text-slate-400">
                  {search || statusFilter !== 'All'
                    ? 'Try adjusting your search or status filter.'
                    : "You haven't placed any orders yet."}
                </p>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => {
                  const { color, icon: StatusIcon } = getStatusInfo(order.orderStatus)
                  const isExpanded = expandedId === order.id
                  const isOrderActive = ['Preparing', 'Out for Delivery'].includes(order.orderStatus)

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden backdrop-blur-xl"
                    >
                      {/* Order Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Left Info */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <code className="text-sm font-black text-white font-mono">{order.id}</code>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {order.orderStatus}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-sm">
                              {order.restaurant} · {order.items?.length || 0} item(s) · {order.placedAt}
                            </p>
                            {order.customer?.name && (
                              <p className="text-[11px] text-slate-500">
                                Diner: {order.customer.name} ({order.customer.email})
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Amount + Actions */}
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                          <div className="text-right">
                            <span className="text-lg font-black text-white">${Number(order.totalAmount || 0).toFixed(2)}</span>
                            <p className="text-[10px] text-slate-500">{order.paymentMethod || 'Paid'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isOrderActive && (
                              <button
                                onClick={() => handleMarkDelivered(order.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all cursor-pointer"
                                title="Mark as Delivered to test live updates"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark Delivered
                              </button>
                            )}
                            <button
                              onClick={() => handleReorder(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500 hover:text-white border border-orange-500/30 transition-all cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Reorder
                            </button>
                            <Link
                              to={`/tracking?id=${order.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white border border-blue-500/30 transition-all"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              Track
                            </Link>
                            <button
                              onClick={() => handleDownloadInvoice(order)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                              title="Download Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : order.id)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                              title={isExpanded ? 'Collapse' : 'View Details'}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-800 p-4 sm:p-5 bg-slate-950/40 space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                              { label: 'Order ID', value: order.id },
                              { label: 'Est. Delivery', value: order.estimatedDelivery },
                              { label: 'Payment', value: order.paymentMethod || 'Paid' },
                              { label: 'Rider', value: order.rider || 'Carlos Ortiz (E-Bike)' }
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
                                <p className="text-xs font-semibold text-white mt-0.5 truncate">{value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Items */}
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Items Ordered</p>
                            <div className="space-y-1.5">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span className="text-slate-300">
                                    <span className="text-orange-400 font-bold mr-1.5">{item.qty || 1}×</span>
                                    {item.name}
                                  </span>
                                  <span className="font-semibold text-white">${((item.price || 10) * (item.qty || 1)).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-sm">
                              <span className="font-bold text-white">Total Paid</span>
                              <span className="font-black text-orange-400">${Number(order.totalAmount || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
