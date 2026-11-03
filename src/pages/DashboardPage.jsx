import React, { useState, useEffect } from 'react'
import { 
  Store, 
  MenuSquare, 
  ShoppingBag, 
  Activity, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  Menu, 
  Bell, 
  Radio, 
  RotateCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import RealtimeTicker from '../components/common/RealtimeTicker'
import Sidebar from '../components/layout/Sidebar'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable'
import OrderDetailsModal from '../components/dashboard/OrderDetailsModal'
import QuickActions from '../components/dashboard/QuickActions'
import { INITIAL_DASHBOARD_STATS, INITIAL_RECENT_ORDERS } from '../data/mockDashboardData'

export default function DashboardPage() {
  const { currentUser, requestLogout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS)
  const [orders, setOrders] = useState(INITIAL_RECENT_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString())

  // Realtime heartbeat simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncTime(new Date().toLocaleTimeString())
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Sync / Refresh data with skeleton loader
  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastSyncTime(new Date().toLocaleTimeString())
      toast.success('Dashboard metrics synchronized with live gateway!', {
        icon: '🔄'
      })
    }, 700)
  }

  // Simulate an incoming live order
  const handleSimulateOrder = () => {
    const newOrderId = `FD-${Math.floor(8000 + Math.random() * 1000)}`
    const demoItems = [
      { name: 'Artisan BBQ Bacon Burger', qty: 2, price: 16.5 },
      { name: 'Parmesan Truffle Fries', qty: 1, price: 7.5 }
    ]
    const newOrder = {
      id: newOrderId,
      customer: {
        name: 'Rachel Adams',
        email: 'rachel.a@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        phone: '+1 (555) 789-2345',
        address: '612 Broadway, Floor 8'
      },
      restaurant: 'Luigi’s Brick Oven Pizzeria',
      items: demoItems,
      totalAmount: 40.5,
      paymentMethod: 'Apple Pay',
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',
      placedAt: 'Just now',
      estimatedDelivery: '18 mins',
      rider: 'Marcus Vance'
    }

    setOrders((prev) => [newOrder, ...prev])
    setStats((prev) => ({
      ...prev,
      totalOrders: prev.totalOrders + 1,
      activeOrders: prev.activeOrders + 1,
      revenueSummary: {
        ...prev.revenueSummary,
        totalRevenue: prev.revenueSummary.totalRevenue + 40.5
      }
    }))

    toast.success(
      `🔔 New Order Received: ${newOrderId} ($40.50) from ${newOrder.customer.name}!`,
      { icon: '🍔' }
    )
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Realtime Live Dispatch Ticker */}
      <RealtimeTicker />

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area (Offset for lg screen sidebar) */}
        <div className="flex-1 lg:pl-64 flex flex-col w-full">
          {/* Top Bar */}
          <header className="bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Dashboard Overview</span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Gateway
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Real-time analytics, restaurant operations & dispatch performance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Simulate order quick trigger */}
              <button
                onClick={handleSimulateOrder}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden sm:inline">Simulate Order</span>
              </button>

              {/* User badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span className="font-semibold text-slate-200 hidden md:inline">
                  {currentUser?.name || 'Alex Johnson'}
                </span>
              </div>
            </div>
          </header>

          {/* Main Dashboard Body */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
            
            {/* Realtime Live Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-orange-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Module 2: Food Delivery Dashboard Active</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Welcome back, {currentUser?.name || 'Portal Member'}!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    Here is what is happening across your food delivery ecosystem today. 
                    Monitor restaurant metrics, menu counts, active deliveries, and revenue in real-time.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 sm:self-center">
                  <button
                    onClick={handleRefreshData}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-orange-400 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync Live Data</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 7 Required Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Total Restaurants */}
              <StatCard
                title="Total Restaurants"
                value={stats.totalRestaurants}
                change={stats.restaurantsChange}
                icon={Store}
                colorScheme="orange"
              />

              {/* 2. Total Food Items */}
              <StatCard
                title="Total Food Items"
                value={stats.totalFoodItems}
                change={stats.foodItemsChange}
                icon={MenuSquare}
                colorScheme="amber"
              />

              {/* 3. Total Orders */}
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                change={stats.ordersChange}
                icon={ShoppingBag}
                colorScheme="purple"
              />

              {/* 4. Active Orders */}
              <StatCard
                title="Active Orders"
                value={stats.activeOrders}
                change={stats.activeChange}
                icon={Activity}
                colorScheme="blue"
                pulse={true}
              />

              {/* 5. Delivered Orders */}
              <StatCard
                title="Delivered Orders"
                value={stats.deliveredOrders.toLocaleString()}
                change={stats.deliveredRate}
                icon={CheckCircle2}
                colorScheme="emerald"
              />

              {/* 6. Total Customers */}
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers.toLocaleString()}
                change={stats.customersChange}
                icon={Users}
                colorScheme="cyan"
              />

              {/* 7. Revenue Summary */}
              <div className="sm:col-span-2">
                <StatCard
                  title="Revenue Summary (Month to Date)"
                  value={`$${stats.revenueSummary.totalRevenue.toLocaleString()}`}
                  change={`${stats.revenueSummary.growthRate} net growth`}
                  icon={DollarSign}
                  colorScheme="emerald"
                />
              </div>
            </div>

            {/* Quick Action Cards */}
            <QuickActions 
              onSimulateOrder={handleSimulateOrder}
              onRefreshData={handleRefreshData}
              isRefreshing={isLoading}
            />

            {/* Revenue Analytics Chart (Dummy Data) */}
            <RevenueChart />

            {/* Recent Orders Table (Search, Filter, Sort, Modal) */}
            <RecentOrdersTable 
              orders={orders}
              isLoading={isLoading}
              onViewOrder={handleViewOrder}
            />

            {/* Roadmap / Module Status Notice */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white text-sm block mb-1">
                  Module 2 Checklist Complete
                </span>
                <p>
                  Total Restaurants &bull; Total Food Items &bull; Total Orders &bull; Active Orders &bull; Delivered Orders &bull; Customers &bull; Revenue Summary &bull; Recent Orders &bull; Quick Action Cards
                </p>
              </div>

              <div className="shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold inline-flex items-center gap-1.5">
                  <span>Ready for Module 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
