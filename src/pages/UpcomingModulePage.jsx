import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  MenuSquare, 
  ShoppingCart, 
  UserCheck, 
  CreditCard, 
  History, 
  Menu, 
  ArrowRight,
  Layers
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'

const MODULE_DATA = {
  '/menu': {
    title: 'Food Menu & Catalog Management',
    desc: 'Browse dish collections, category filtering, dietary preferences, and manage food items.',
    icon: MenuSquare
  },
  '/orders': {
    title: 'Cart Management & Live Order Placement',
    desc: 'Review selected dishes, manage quantities, and track active deliveries in real-time.',
    icon: ShoppingCart
  },
  '/profile': {
    title: 'Customer Profile & Address Book',
    desc: 'Manage account credentials, phone contacts, delivery destinations, and user preferences.',
    icon: UserCheck
  },
  '/payments': {
    title: 'Coupons, Discounts & Checkout Gateways',
    desc: 'Apply promo coupon codes, discount calculators, and seamless multi-channel payment processing.',
    icon: CreditCard
  },
  '/history': {
    title: 'Previous Orders & Invoice Downloads',
    desc: 'Review completed orders, status filters, one-click reordering, and digital invoice generation.',
    icon: History
  }
}

export default function UpcomingModulePage() {
  const location = useLocation()
  const { currentUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentModule = MODULE_DATA[location.pathname] || {
    title: 'Management Section',
    desc: 'This feature is ready for development as you command.',
    icon: Layers
  }

  const Icon = currentModule.icon

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
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {currentModule.title}
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Food Delivery Management System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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

          {/* Main Body */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-5xl w-full mx-auto flex flex-col justify-center items-center text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl max-w-2xl w-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
                <Icon className="w-8 h-8" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                {currentModule.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
                {currentModule.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Return to Dashboard
                </Link>
                <Link
                  to="/restaurants"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Restaurants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
