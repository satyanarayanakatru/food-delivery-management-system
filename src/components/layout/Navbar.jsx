import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  UtensilsCrossed, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown,
  LayoutDashboard,
  Shield,
  ShoppingBag
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { currentUser, isAuthenticated, isAdmin, requestLogout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleSignoutClick = () => {
    setUserDropdownOpen(false)
    setMobileMenuOpen(false)
    requestLogout()
  }

  return (
    <nav className="bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg leading-tight block">
                FoodBite <span className="text-orange-500">Express</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Management Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-2 border border-slate-800"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-400" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/restaurants"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-2 border border-slate-800"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Restaurants</span>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:bg-slate-900 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white leading-tight">
                        {currentUser?.name}
                      </p>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase border ${
                        isAdmin
                          ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {currentUser?.role || 'Portal User'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                          isAdmin
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isAdmin ? '🛡️ Administrator Access' : '👤 Customer Account'}
                        </span>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={handleSignoutClick}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl mb-2 border border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400">{currentUser?.email}</p>
                  <span className="text-[10px] text-orange-400 font-bold uppercase">{currentUser?.role}</span>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-orange-400" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/restaurants"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Restaurants</span>
              </Link>

              <button
                onClick={handleSignoutClick}
                className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
