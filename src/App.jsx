import React from 'react'
import { toast } from 'react-toastify'
import { 
  UtensilsCrossed, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  LayoutDashboard, 
  Store, 
  MenuSquare, 
  ShoppingCart, 
  CreditCard, 
  MapPin, 
  UserCheck, 
  History,
  Rocket
} from 'lucide-react'

const modules = [
  { id: 1, name: 'Module 1: Authentication', icon: ShieldCheck, status: 'Upcoming Next', desc: 'Login, Register, Forgot Password, Form Validation, Protected Routes, Local Storage' },
  { id: 2, name: 'Module 2: Dashboard', icon: LayoutDashboard, status: 'Planned', desc: 'Metrics, Restaurant counts, Revenue summary, Recent orders, Quick action cards' },
  { id: 3, name: 'Module 3: Restaurant Listing', icon: Store, status: 'Planned', desc: 'API Integration, Filters by cuisine/rating, Search, Sort, Pagination' },
  { id: 4, name: 'Module 4: Menu Management', icon: MenuSquare, status: 'Planned', desc: 'Food catalog, Category & veg/non-veg filters, Add/Edit/Delete food items' },
  { id: 5, name: 'Module 5: Cart Management', icon: ShoppingCart, status: 'Planned', desc: 'Add/Remove items, Quantity controls, Summary, Local storage persistence' },
  { id: 6, name: 'Module 6: Order Placement', icon: MapPin, status: 'Planned', desc: 'Checkout page, Delivery address, Order ID generation, Confirmation' },
  { id: 7, name: 'Module 7: Order Tracking', icon: Clock, status: 'Planned', desc: 'Interactive timeline: Preparing, Out for Delivery, Delivered, Cancelled' },
  { id: 8, name: 'Module 8: Customer Profile', icon: UserCheck, status: 'Planned', desc: 'Profile details, Saved addresses, Contact info, Avatar management' },
  { id: 9, name: 'Module 9: Coupons & Payment', icon: CreditCard, status: 'Planned', desc: 'Discount coupons, Card / UPI / Wallet mock gateways, Status screens' },
  { id: 10, name: 'Module 10: Order History', icon: History, status: 'Planned', desc: 'Previous orders, Reorder action, Status filters, Invoice UI download' }
]

const techStack = [
  { name: 'React.js (Vite)', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Tailwind CSS', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'Context API', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'React Router', color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Axios API', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'React Hook Form', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { name: 'React Toastify', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Local Storage', color: 'bg-slate-100 text-slate-700 border-slate-300' }
]

export default function App() {
  const triggerToast = () => {
    toast.success('Food Delivery Management System initialized successfully! Ready for Module 1.', {
      icon: '🍕'
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg sm:text-xl leading-tight">FoodBite Studio</h1>
              <p className="text-xs text-slate-500">Food Delivery Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerToast}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Toast Notification</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Setup Complete</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium mb-4">
              <Rocket className="w-3.5 h-3.5" />
              <span>Vite + React Project Ready</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Food Delivery Management System
            </h2>
            <p className="text-orange-100 text-sm sm:text-base leading-relaxed mb-6">
              Core architecture initialized with React, Tailwind CSS, React Router, React Hook Form, React Toastify, Axios, and Context API structure. Ready to build features module by module.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="text-white/80">Active Stack:</span>
              {techStack.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-white border border-white/20"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
            <UtensilsCrossed className="w-96 h-96" />
          </div>
        </div>

        {/* Modules Roadmap */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-500" />
              Development Modules Roadmap
            </h3>
            <p className="text-sm text-slate-500">Each module will be developed iteratively per user requirements.</p>
          </div>
          <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            10 Modules Configured
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon
            const isNext = m.id === 1
            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isNext
                    ? 'bg-white border-orange-300 shadow-md ring-2 ring-orange-500/20'
                    : 'bg-white/80 border-slate-200/80 shadow-2xs opacity-90'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${isNext ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      isNext
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{m.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Food Delivery Management System &bull; React Vite Boilerplate Ready
      </footer>
    </div>
  )
}
