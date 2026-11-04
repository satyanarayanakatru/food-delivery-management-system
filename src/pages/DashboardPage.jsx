import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  RotateCw, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Heart, 
  Gift, 
  Clock, 
  PlusCircle, 
  RefreshCw 
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable'
import OrderDetailsModal from '../components/dashboard/OrderDetailsModal'
import QuickActions from '../components/dashboard/QuickActions'
import AddRestaurantModal from '../components/restaurants/AddRestaurantModal'
import { INITIAL_DASHBOARD_STATS, INITIAL_RECENT_ORDERS } from '../data/mockDashboardData'

export default function DashboardPage() {
  const { currentUser, isAdmin, isCustomer } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('foodbite_recent_orders')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) return parsed
      }
      return INITIAL_RECENT_ORDERS
    } catch (e) {
      return INITIAL_RECENT_ORDERS
    }
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Update total restaurants count if custom restaurants exist
  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('foodbite_custom_restaurants') || '[]')
      if (custom.length > 0) {
        setStats((prev) => ({
          ...prev,
          totalRestaurants: INITIAL_DASHBOARD_STATS.totalRestaurants + custom.length
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Sync / Refresh data
  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Dashboard metrics synchronized!', { icon: '🔄' })
    }, 600)
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
        name: currentUser?.name || 'Sarah Connor',
        email: currentUser?.email || 'customer@foodbite.com',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
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

    setOrders((prev) => {
      const updated = [newOrder, ...prev]
      try {
        localStorage.setItem('foodbite_recent_orders', JSON.stringify(updated))
      } catch (e) {}
      return updated
    })

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
      `Order ${newOrderId} ($40.50) received from ${newOrder.customer.name}!`,
      { icon: '🍔' }
    )
  }

  const handleAddRestaurant = (newRestaurant) => {
    try {
      const custom = JSON.parse(localStorage.getItem('foodbite_custom_restaurants') || '[]')
      localStorage.setItem('foodbite_custom_restaurants', JSON.stringify([newRestaurant, ...custom]))
      setStats((prev) => ({
        ...prev,
        totalRestaurants: prev.totalRestaurants + 1
      }))
    } catch (e) {
      console.error(e)
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsOrderModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
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
                  <span>{isAdmin ? 'Admin Operations Dashboard' : 'Customer Food Hub'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isAdmin
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {isAdmin
                    ? 'Platform analytics, restaurant management & live order fulfillment'
                    : 'Track active deliveries, reorder your favorite meals, and discover dining'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin ? (
                <button
                  onClick={() => setIsAddRestaurantModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Restaurant</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/restaurants')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order Now</span>
                </button>
              )}

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
                  {currentUser?.name}
                </span>
              </div>
            </div>
          </header>

          {/* Main Dashboard Body */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-orange-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Welcome back, {currentUser?.name}!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    {isAdmin
                      ? 'You are managing the platform in Admin Mode. Add new restaurants, monitor sales, and oversee live order dispatching.'
                      : 'You are signed in as Customer. Browse top-rated partnered restaurants, select items, and place fast delivery orders.'}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 sm:self-center">
                  {!isAdmin && (
                    <Link
                      to="/restaurants"
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-orange-500/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Explore Restaurants</span>
                    </Link>
                  )}
                  <button
                    onClick={handleRefreshData}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-orange-400 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync Live Data</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Section based on Role */}
            {isAdmin ? (
              /* Admin: 7 Core Platform Metrics */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Restaurants"
                  value={stats.totalRestaurants}
                  change={stats.restaurantsChange}
                  icon={Store}
                  colorScheme="orange"
                />

                <StatCard
                  title="Total Food Items"
                  value={stats.totalFoodItems}
                  change={stats.foodItemsChange}
                  icon={MenuSquare}
                  colorScheme="amber"
                />

                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders.toLocaleString()}
                  change={stats.ordersChange}
                  icon={ShoppingBag}
                  colorScheme="purple"
                />

                <StatCard
                  title="Active Orders"
                  value={stats.activeOrders}
                  change={stats.activeChange}
                  icon={Activity}
                  colorScheme="blue"
                  pulse={true}
                />

                <StatCard
                  title="Delivered Orders"
                  value={stats.deliveredOrders.toLocaleString()}
                  change={stats.deliveredRate}
                  icon={CheckCircle2}
                  colorScheme="emerald"
                />

                <StatCard
                  title="Total Customers"
                  value={stats.totalCustomers.toLocaleString()}
                  change={stats.customersChange}
                  icon={Users}
                  colorScheme="cyan"
                />

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
            ) : (
              /* Customer: Tailored Food Hub Metrics */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="My Active Orders"
                  value="1"
                  change="In kitchen preparation"
                  icon={Activity}
                  colorScheme="orange"
                  pulse={true}
                />

                <StatCard
                  title="My Past Orders"
                  value="8"
                  change="All completed on time"
                  icon={CheckCircle2}
                  colorScheme="emerald"
                />

                <StatCard
                  title="FoodBite Rewards"
                  value="350 pts"
                  change="Free dessert unlock soon"
                  icon={Gift}
                  colorScheme="amber"
                />

                <StatCard
                  title="Favorite Kitchens"
                  value="5"
                  change="Open for delivery now"
                  icon={Heart}
                  colorScheme="purple"
                />
              </div>
            )}

            {/* Quick Action Cards */}
            <QuickActions 
              onSimulateOrder={handleSimulateOrder}
              onRefreshData={handleRefreshData}
              isRefreshing={isLoading}
            />

            {/* Admin: Revenue Analytics Chart */}
            {isAdmin && <RevenueChart />}

            {/* Recent Orders Table */}
            <RecentOrdersTable 
              orders={orders}
              isLoading={isLoading}
              onViewOrder={handleViewOrder}
            />
          </main>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      {/* Admin: Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isAddRestaurantModalOpen}
        onClose={() => setIsAddRestaurantModalOpen(false)}
        onAddRestaurant={handleAddRestaurant}
      />
    </div>
  )
}
