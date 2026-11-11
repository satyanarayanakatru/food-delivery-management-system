import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Store, 
  Sparkles, 
  Menu,
  CheckCircle2,
  ShieldCheck,
  UtensilsCrossed,
  Truck,
  Receipt
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Sidebar from '../components/layout/Sidebar'
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable'
import OrderDetailsModal from '../components/dashboard/OrderDetailsModal'
import { INITIAL_RECENT_ORDERS } from '../data/mockDashboardData'

export default function CartPage() {
  const { currentUser, isAdmin } = useAuth()
  const {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    tax,
    totalPrice,
    updateQuantity,
    requestRemoveItem,
    requestClearCart,
    clearCartDirect
  } = useCart()

  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null)

  // Admin: Platform orders monitoring state
  const [adminOrders, setAdminOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('foodbite_recent_orders')
      return saved ? JSON.parse(saved) : INITIAL_RECENT_ORDERS
    } catch (e) {
      return INITIAL_RECENT_ORDERS
    }
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  // Free delivery threshold
  const FREE_DELIVERY_THRESHOLD = 35
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)

  // Customer: Navigate to Checkout (Module 6)
  const handleCheckoutFromCart = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty! Add items before checkout.', { icon: '⚠️' })
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <div className="flex-1 flex">
        {/* Sidebar */}
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
                  <span>{isAdmin ? 'Live Platform Orders' : 'Shopping Cart & Summary'}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      isAdmin
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isAdmin ? 'Admin View' : 'Customer Bag'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {isAdmin
                    ? 'Monitor customer orders, active deliveries, and kitchen dispatch performance'
                    : 'Review selected items, adjust portions, and calculate delivery totals'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isAdmin && cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={requestClearCart}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear Cart</span>
                </button>
              )}

              {/* User Badge */}
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

          {/* Main Body */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
            {isAdmin ? (
              /* Admin View: Platform Order Feed (No customer cart placement) */
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800/80 shadow-2xl">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                    Customer Order Dispatch Queue
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                    Inspect all live incoming orders placed by customers across partnered kitchens. Click any order row to inspect full details.
                  </p>
                </div>

                <RecentOrdersTable
                  orders={adminOrders}
                  isLoading={false}
                  onViewOrder={(order) => {
                    setSelectedOrder(order)
                    setIsOrderModalOpen(true)
                  }}
                />

                <OrderDetailsModal
                  order={selectedOrder}
                  isOpen={isOrderModalOpen}
                  onClose={() => setIsOrderModalOpen(false)}
                />
              </div>
            ) : (
              /* Customer View: Full Cart Management */
              <>
                {/* Banner if an order was just confirmed */}
                {lastPlacedOrder && (
                  <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">
                          Order Confirmed! ID: <span className="text-emerald-400 font-mono">{lastPlacedOrder.id}</span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Total Paid: <strong>${lastPlacedOrder.totalAmount.toFixed(2)}</strong> &bull; Estimated arrival in{' '}
                          <strong>{lastPlacedOrder.estimatedDelivery}</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/dashboard"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
                      >
                        Track on Dashboard
                      </Link>
                      <button
                        onClick={() => setLastPlacedOrder(null)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {cartItems.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column (2 spans): Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-orange-400" />
                          <span>Selected Dishes ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                        </h2>

                        <Link
                          to="/menu"
                          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                        >
                          <span>+ Add More Dishes</span>
                        </Link>
                      </div>

                      {/* Cart Item Cards */}
                      <div className="space-y-3">
                        {cartItems.map((item) => {
                          const itemSubtotal = item.price * item.quantity
                          return (
                            <div
                              key={item.id}
                              className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl"
                            >
                              {/* Left: Image & Details */}
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="space-y-1">
                                  {/* Veg / Non-Veg + Category */}
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border flex items-center gap-1 ${
                                        item.isVeg
                                          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                                          : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                                      }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                                      <span>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                                    </span>

                                    <span className="text-[11px] font-semibold text-orange-400">
                                      {item.category}
                                    </span>
                                  </div>

                                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                                    {item.name}
                                  </h3>

                                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <Store className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{item.restaurantName}</span>
                                  </p>

                                  <p className="text-xs font-bold text-slate-300 pt-0.5">
                                    ${item.price.toFixed(2)} <span className="text-slate-500 font-normal">each</span>
                                  </p>
                                </div>
                              </div>

                              {/* Right: Quantity Controls, Line Total & Remove */}
                              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                                {/* Line Item Total */}
                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Subtotal</span>
                                  <span className="text-base sm:text-lg font-black text-white">
                                    ${itemSubtotal.toFixed(2)}
                                  </span>
                                </div>

                                {/* Quantity Stepper + Remove */}
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                      title="Decrease quantity"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-8 text-center text-xs font-black text-white">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.id, 1)}
                                      disabled={item.quantity >= 20}
                                      className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center disabled:opacity-30 transition-colors cursor-pointer"
                                      title="Increase quantity"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => requestRemoveItem(item)}
                                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                                    title="Remove item from cart"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Right Column: Order & Price Summary Card */}
                    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5 sticky top-24 backdrop-blur-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-orange-400" />
                          <span>Cart Summary</span>
                        </h3>
                        <span className="text-xs font-bold text-slate-400">
                          {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                        </span>
                      </div>

                      {/* Free Delivery Progress Bar */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Truck className={`w-4 h-4 shrink-0 ${amountNeededForFreeDelivery === 0 ? 'text-emerald-400' : 'text-orange-400'}`} />
                          {amountNeededForFreeDelivery === 0 ? (
                            <span className="font-bold text-emerald-400">
                              You&apos;ve unlocked FREE Express Delivery!
                            </span>
                          ) : (
                            <span className="text-slate-300">
                              Add <strong className="text-orange-400">${amountNeededForFreeDelivery.toFixed(2)}</strong> more for{' '}
                              <strong className="text-white">FREE Delivery</strong>
                            </span>
                          )}
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              amountNeededForFreeDelivery === 0
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500'
                            }`}
                            style={{ width: `${freeDeliveryProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Price Calculation Breakdown */}
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Items Subtotal</span>
                          <span className="text-slate-200 font-bold">${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-slate-400">
                          <span>Delivery Fee</span>
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-400 font-extrabold uppercase">Free</span>
                          ) : (
                            <span className="text-slate-200 font-bold">${deliveryFee.toFixed(2)}</span>
                          )}
                        </div>

                        <div className="flex justify-between text-slate-400">
                          <span>Estimated Taxes & Fees (8%)</span>
                          <span className="text-slate-200 font-bold">${tax.toFixed(2)}</span>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-extrabold text-white block">Total Payable</span>
                            <span className="text-[10px] text-slate-500">Inclusive of all taxes</span>
                          </div>
                          <span className="text-2xl font-black text-orange-400 font-mono">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Place Order / Checkout Button */}
                      <button
                        type="button"
                        onClick={handleCheckoutFromCart}
                        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-black transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Safe Checkout Note */}
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Saved automatically in your browser session</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty Cart State */
                  <div className="p-10 sm:p-16 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto my-8 space-y-5 backdrop-blur-xl">
                    <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto shadow-inner">
                      <ShoppingCart className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        Your Shopping Cart is Empty
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                        Looks like you haven&apos;t added any delicious dishes yet. Explore our gourmet food catalog or top partner restaurants to start building your order!
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <Link
                        to="/menu"
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                      >
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Explore Menu Catalog</span>
                      </Link>
                      <Link
                        to="/restaurants"
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Store className="w-4 h-4 text-orange-400" />
                        <span>Browse Restaurants</span>
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
