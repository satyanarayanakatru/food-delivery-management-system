import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  MenuSquare,
  ShoppingCart,
  Navigation,
  UserCheck,
  CreditCard,
  History,
  LogOut,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Restaurants", path: "/restaurants", icon: Store },
  { name: "Menu Catalog", path: "/menu", icon: MenuSquare },
  { name: "Cart & Orders", path: "/orders", icon: ShoppingCart },
  { name: "Order Tracking", path: "/tracking", icon: Navigation },
  { name: "My Profile", path: "/profile", icon: UserCheck },
  { name: "Coupons & Payment", path: "/payments", icon: CreditCard },
  { name: "Order History", path: "/history", icon: History },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { currentUser, isCustomer, requestLogout } = useAuth();
  const { cartCount } = useCart();

  const isActive = (path) => {
    if (path === "/orders")
      return (
        location.pathname === "/orders" || location.pathname === "/checkout"
      );
    if (path === "/tracking") return location.pathname.startsWith("/tracking");
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Branding */}
        <div>
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => onClose?.()}
            >
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

          {/* Nav links */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              All Modules
            </span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const showBadge =
                item.path === "/orders" && isCustomer && cartCount > 0;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {showBadge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? "bg-white text-orange-600" : "bg-orange-500 text-white"}`}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User + Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-xs text-white truncate">
                {currentUser?.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={requestLogout}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/10 border border-red-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Session
          </button>
        </div>
      </aside>
    </>
  );
}
