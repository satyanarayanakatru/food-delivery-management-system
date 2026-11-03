import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Store, 
  MenuSquare, 
  ShoppingCart, 
  UserCheck, 
  CreditCard, 
  History, 
  LogOut, 
  UtensilsCrossed,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { currentUser, requestLogout } = useAuth()

  // Clean navigation links without any "mod3", "mod4" text badges
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, active: true },
    { name: 'Restaurants', path: '/dashboard', icon: Store, active: false },
    { name: 'Menu Catalog', path: '/dashboard', icon: MenuSquare, active: false },
    { name: 'Cart & Orders', path: '/dashboard', icon: ShoppingCart, active: false },
    { name: 'Customer Profile', path: '/dashboard', icon: UserCheck, active: false },
    { name: 'Coupons & Payment', path: '/dashboard', icon: CreditCard, active: false },
    { name: 'Order History', path: '/dashboard', icon: History, active: false },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base leading-tight block">
                  FoodBite <span className="text-orange-500">Express</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Management Portal
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <div className="space-y-1.5">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Navigation Menu
            </span>
            {navItems.map((item, idx) => {
              const Icon = item.icon
              const isSelected = item.active
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom User Profile & Sign Out Button with Confirmation */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-xs text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
            </div>
          </div>

          <button
            onClick={requestLogout}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/10 border border-red-500/20 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  )
}
