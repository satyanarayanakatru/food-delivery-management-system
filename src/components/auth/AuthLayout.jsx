import React from 'react'
import { Link } from 'react-router-dom'
import { 
  UtensilsCrossed, 
  ShieldCheck, 
  Bike, 
  Star, 
  MapPin, 
  Clock, 
  Sparkles,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Decorative Showcase Panel (visible on lg screens) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-orange-950/30 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header branding */}
            <div className="relative z-10 mb-8">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
                    FoodBite <span className="text-orange-500">Express</span>
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">Real-Time Food Delivery Management</p>
                </div>
              </Link>
            </div>

            {/* Simulated Live Order Mockup Card */}
            <div className="relative z-10 space-y-4 my-4">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Order #FD-8942</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold">
                    In Transit &bull; 12m
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&auto=format&fit=crop&q=80"
                    alt="Pizza"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">Artisan Truffle & Mozzarella Pizza</h4>
                    <p className="text-xs text-slate-400">Luigi's Woodfire Kitchen &bull; 2 items</p>
                  </div>
                </div>

                {/* Animated delivery route tracker */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Order Confirmed
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kitchen Prepared
                    </span>
                    <span className="flex items-center gap-1 text-orange-400 font-bold animate-pulse">
                      <Bike className="w-3.5 h-3.5" /> On the Way
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-500 w-[78%] rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Realtime stats metrics mini-grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Active Hubs</span>
                  <p className="text-lg font-black text-white">142+</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Avg Speed</span>
                  <p className="text-lg font-black text-orange-400">18.4m</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Satisfaction</span>
                  <p className="text-lg font-black text-emerald-400">99.2%</p>
                </div>
              </div>
            </div>

            {/* Bottom trust badges */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                End-to-End Encrypted Session
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                4.9 / 5 Rating
              </span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            {/* Mobile Header (only on small screens) */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/30">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl text-white">FoodBite Express</span>
              </Link>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
              </div>

              {children}
            </div>

            {/* Footer Notice */}
            <p className="text-center text-[11px] text-slate-400 mt-6">
              FoodBite Express Platform &bull; React Vite Real-Time Architecture
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
