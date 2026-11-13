import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Store, MenuSquare, ShoppingBag, Activity, CheckCircle2, Users,
  DollarSign, Menu, RotateCw, Sparkles, ArrowRight, PlusCircle,
  Navigation, XCircle, TrendingUp, RefreshCw
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import Sidebar from '../components/layout/Sidebar'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import OrderStatusPieChart from '../components/dashboard/OrderStatusPieChart'
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable'
import OrderDetailsModal from '../components/dashboard/OrderDetailsModal'
import QuickActions from '../components/dashboard/QuickActions'
import AddRestaurantModal from '../components/restaurants/AddRestaurantModal'

export default function DashboardPage() {
  const { currentUser, isAdmin, isCustomer } = useAuth()
  const { orders, stats, addOrder, updateOrderStatus, addRestaurant, refresh } = useAppData()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen]           = useState(false)
  const [selectedOrder, setSelectedOrder]       = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isAddRestOpen, setIsAddRestOpen]       = useState(false)
  const [isRefreshing, setIsRefreshing]         = useState(false)

  // ── Handlers ──
  const handleRefresh = () => {
    setIsRefreshing(true)
    refresh()
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success('Dashboard dynamic metrics refreshed from live data!', { icon: '🔄' })
    }, 600)
  }

  // Simulate a live customer order
  const handleSimulateOrder = () => {
    const orderId = `FD-${Math.floor(8000 + Math.random() * 1000)}`
    const newOrder = {
      id: orderId,
      customer: {
        name: currentUser?.name || 'Katru Satyanarayana',
        email: currentUser?.email || 'satyanarayanayadav50@gmail.com',
        avatar: currentUser?.avatar || '/satyanarayana.jpg',
        phone: currentUser?.phone || '+91 8179795623'
      },
      restaurant: "Luigi's Artisan Trattoria",
      items: [
        { name: 'Neapolitan Truffle Margherita', qty: 2, price: 18.5 },
        { name: 'Parmesan Truffle Fries', qty: 1, price: 7.5 }
      ],
      totalAmount: 44.5,
      paymentMethod: 'Credit Card (Visa)',
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',
      placedAt: 'Just now',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '20 mins',
      rider: 'Leo Morales (E-Bike)'
    }
    addOrder(newOrder)
    toast.success(`New order ${orderId} placed ($44.50) — active orders updated!`, { icon: '🍔' })
  }

  // Advance an active order's status to demonstrate live state changes
  const handleAdvanceOrder = () => {
    const activeOrder = orders.find(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Out for Delivery')
    if (!activeOrder) {
      toast.info('No active orders to advance. Place an order or simulate one!', { icon: 'ℹ️' })
      return
    }

    const nextStatus = activeOrder.orderStatus === 'Preparing' ? 'Out for Delivery' : 'Delivered'
    updateOrderStatus(activeOrder.id, nextStatus)

    if (nextStatus === 'Delivered') {
      toast.success(`Order ${activeOrder.id} marked as Delivered! Delivered count incremented.`, { icon: '✅' })
    } else {
      toast.info(`Order ${activeOrder.id} is now Out for Delivery!`, { icon: '🚴' })
    }
  }

  const handleAddRestaurant = (restaurant) => {
    addRestaurant(restaurant)
  }

  // Active orders for quick tracker
  const activeOrdersList = orders.filter(o => ['Preparing', 'Out for Delivery'].includes(o.orderStatus))

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
                  {isAdmin ? 'Admin Operations Dashboard' : 'Food Delivery Hub'}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isAdmin ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Live dynamic metrics · Real-time order fulfillment · Synchronized data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <button
                  onClick={() => setIsAddRestOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Restaurant</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/restaurants')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Order Now
                </button>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar
                    ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    : currentUser?.name?.charAt(0).toUpperCase() || 'U'
                  }
                </div>
                <span className="font-semibold text-slate-200 hidden md:inline">{currentUser?.name}</span>
              </div>
            </div>
          </header>

          {/* Body */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-7 flex-1 max-w-7xl w-full mx-auto">

            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-orange-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Welcome back, {currentUser?.name?.split(' ')[0] || 'Foodie'}! 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Live Status: <strong className="text-orange-400 font-bold">{stats.totalRestaurants}</strong> partner restaurants ·{' '}
                    <strong className="text-white font-bold">{stats.totalOrders}</strong> total orders ({stats.activeOrders} active, {stats.deliveredOrders} delivered) ·{' '}
                    <strong className="text-emerald-400 font-bold">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> total spent
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Link 
                    to="/restaurants" 
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all flex items-center gap-2 shadow-md shadow-orange-500/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Explore Dining
                  </Link>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Sync Data
                  </button>
                </div>
              </div>
            </div>

            {/* ── Dynamic KPI Stat Cards (Module 2) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Restaurants"
                value={stats.restaurantsLoading ? '...' : stats.totalRestaurants}
                change={`${stats.openRestaurants} open for delivery`}
                icon={Store}
                colorScheme="orange"
              />
              <StatCard
                title="Total Food Items"
                value={stats.menuLoading ? '...' : stats.totalFoodItems}
                change={`${stats.vegFoodItems} veg · ${stats.nonVegFoodItems} non-veg`}
                icon={MenuSquare}
                colorScheme="amber"
              />
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                change={`${stats.activeOrders} currently active`}
                icon={ShoppingBag}
                colorScheme="purple"
              />
              <StatCard
                title="Active Orders"
                value={stats.activeOrders}
                change={`${stats.preparingOrders} preparing · ${stats.outForDeliveryOrders} on the way`}
                icon={Activity}
                colorScheme="blue"
                pulse={stats.activeOrders > 0}
              />
              <StatCard
                title="Delivered Orders"
                value={stats.deliveredOrders}
                change={stats.totalOrders > 0 ? `${Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}% fulfillment rate` : 'All completed'}
                icon={CheckCircle2}
                colorScheme="emerald"
              />
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers}
                change="Active registered users & diners"
                icon={Users}
                colorScheme="cyan"
              />
              <StatCard
                title="Cancelled Orders"
                value={stats.cancelledOrders}
                change={stats.totalOrders > 0 ? `${Math.round((stats.cancelledOrders / stats.totalOrders) * 100)}% cancellation rate` : 'Zero cancellations'}
                icon={XCircle}
                colorScheme="red"
              />
              <StatCard
                title="Total Spent / Revenue"
                value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={`Avg $${stats.avgOrderValue.toFixed(2)} per order`}
                icon={DollarSign}
                colorScheme="emerald"
              />
            </div>

            {/* ── Quick Actions ── */}
            <QuickActions
              onSimulateOrder={handleSimulateOrder}
              onAdvanceOrder={handleAdvanceOrder}
              onRefreshData={handleRefresh}
              isRefreshing={isRefreshing}
              stats={stats}
            />

            {/* ── Dynamic Charts Row (Revenue Chart & Order Status Pie Chart) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <OrderStatusPieChart />
              </div>
            </div>

            {/* ── Active Orders Quick Tracking Banner ── */}
            {activeOrdersList.length > 0 && (
              <div className="p-5 rounded-3xl bg-orange-500/5 border border-orange-500/20 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-orange-400" />
                    Active Orders ({activeOrdersList.length}) — Track Live Status
                  </h3>
                  <Link to="/orders" className="text-xs font-bold text-orange-400 hover:text-orange-300">
                    View All in History →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeOrdersList.slice(0, 3).map(o => (
                    <div key={o.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-black text-orange-400">{o.id}</code>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.orderStatus === 'Out for Delivery' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium truncate mt-1">{o.restaurant}</p>
                        <p className="text-[11px] text-slate-500">${(Number(o.totalAmount) || 0).toFixed(2)} · ETA {o.estimatedDelivery}</p>
                      </div>
                      <Link
                        to={`/tracking?id=${o.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500 hover:text-white border border-orange-500/30 transition-all shrink-0"
                      >
                        Track <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Recent Orders Table (Dynamic, connected to AppDataContext) ── */}
            <RecentOrdersTable
              orders={orders}
              isLoading={isRefreshing}
              onViewOrder={(order) => { setSelectedOrder(order); setIsOrderModalOpen(true) }}
            />
          </main>
        </div>
      </div>

      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
      />
      <AddRestaurantModal
        isOpen={isAddRestOpen}
        onClose={() => setIsAddRestOpen(false)}
        onAddRestaurant={handleAddRestaurant}
      />
    </div>
  )
}
