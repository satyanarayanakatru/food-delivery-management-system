import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  CheckCircle2, 
  Sparkles, 
  Database, 
  Radio, 
  ArrowRight, 
  Bell, 
  Activity, 
  Clock, 
  Zap,
  ShoppingBag
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import RealtimeTicker from '../components/common/RealtimeTicker'

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const [liveOrdersCount, setLiveOrdersCount] = useState(24)
  const [lastHeartbeat, setLastHeartbeat] = useState(new Date().toLocaleTimeString())

  // Realtime simulation heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setLastHeartbeat(new Date().toLocaleTimeString())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const triggerSimulatedOrder = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000)
    const items = ['Truffle Wagyu Burger', 'Neapolitan Quattro Pizza', 'Spicy Salmon Poke', 'Matcha Cloud Boba']
    const randomItem = items[Math.floor(Math.random() * items.length)]

    setLiveOrdersCount((prev) => prev + 1)
    toast.success(
      `🔔 Realtime Alert: Order #FD-${randomId} (${randomItem}) just placed! Kitchen assigned.`,
      {
        icon: '🍕',
        autoClose: 4000
      }
    )
  }

  const module1Checklist = [
    { title: 'Static Authentication Module', desc: 'Context API state + localStorage user registry & session persistence', done: true },
    { title: 'Login with React Hook Form', desc: 'Email validation, password min length, remember me, error alerts', done: true },
    { title: 'Single Portal Demo Account', desc: 'Instant 1-click test login for Alex Johnson (demo@foodbite.com)', done: true },
    { title: 'Register Account UI', desc: 'Streamlined registration with real-time field validation', done: true },
    { title: 'Real-Time Password Strength', desc: 'Dynamic password security meter (length, uppercase, number, symbols)', done: true },
    { title: 'Interactive Show / Hide Toggle', desc: 'Eye toggle on all password & confirm password input fields', done: true },
    { title: 'Forgot Password Reset UI', desc: 'Direct password reset flow updating credentials in Local Storage', done: true },
    { title: 'Guarded Protected Routes', desc: 'Unauthorized access automatically forwarded to /login with return intent', done: true },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Realtime Live Dispatch Ticker */}
      <RealtimeTicker />

      {/* Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Realtime Live Status Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/30 overflow-hidden shrink-0">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    Welcome, {currentUser?.name || 'Portal User'}!
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{currentUser?.role || 'Portal Member'}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Protected Route</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Session Key:</span>
                  <code className="text-slate-300 font-mono bg-slate-800/60 px-1.5 py-0.5 rounded">
                    localStorage['foodbite_user']
                  </code>
                  <span>&bull;</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" /> Live Pulse ({lastHeartbeat})
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Action Simulation Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={triggerSimulatedOrder}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
              >
                <Bell className="w-4 h-4 animate-bounce" />
                <span>Simulate Realtime Order</span>
              </button>
              <button
                onClick={logout}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active Orders Stream</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{liveOrdersCount}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">● Realtime synchronized</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Security State</span>
              <ShieldCheck className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-black text-orange-400">Guarded</p>
            <p className="text-[10px] text-slate-400 mt-0.5">JWT / Local Storage Session</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Avg Delivery Speed</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white">18.2 min</p>
            <p className="text-[10px] text-cyan-400 mt-0.5">↑ 4% faster this week</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>System Health</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">99.98%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero downtime gateway</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Session Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
                <Database className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-white text-sm">Authenticated User Session</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Full Name</span>
                  <p className="font-semibold text-slate-200 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser?.name}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Email Address</span>
                  <p className="font-semibold text-slate-200 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser?.email}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Mobile Contact</span>
                  <p className="font-semibold text-slate-200 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser?.phone || 'Not provided'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Delivery Location</span>
                  <p className="font-semibold text-slate-200 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser?.address || 'Springfield Central'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Portal Access</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    {currentUser?.role || 'Portal Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 1 Completed Checklist & Next Module Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    Module 1: Authentication Core Standards
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  8 / 8 Implemented
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {module1Checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/50 flex items-start gap-3"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Module: Module 2 Dashboard Preview Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Up Next</span>
                </span>
                <h4 className="text-lg font-extrabold">Module 2: Dashboard</h4>
                <p className="text-orange-100 text-xs mt-1 max-w-xl">
                  Total Restaurants, Total Food Items, Orders Analytics, Revenue Summary with dynamic charts, Recent Orders, and Quick Actions.
                </p>
              </div>

              <div className="shrink-0">
                <span className="px-4 py-2.5 rounded-xl bg-white text-orange-600 text-xs font-extrabold shadow-sm inline-flex items-center gap-1.5">
                  <span>Tell me when to start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
