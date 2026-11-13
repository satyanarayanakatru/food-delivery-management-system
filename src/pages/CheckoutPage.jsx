import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  Tag,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  Bike,
  Sparkles,
  X,
  Menu,
  AlertCircle,
  Star,
  Shield,
  Gift,
  Zap,
  Home,
  Briefcase,
  UtensilsCrossed,
  ReceiptText,
  PartyPopper,
  Copy,
  Navigation,
  RotateCcw
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useAppData } from '../context/AppDataContext'
import Sidebar from '../components/layout/Sidebar'
import { COUPONS } from '../data/mockPaymentData'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STEPS = ['Delivery', 'Payment', 'Review', 'Confirm']

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    sub: 'Visa, Mastercard, Amex',
    Icon: CreditCard,
    badge: 'Secure',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    id: 'upi',
    name: 'UPI / Net Banking',
    sub: 'Instant transfer',
    Icon: Smartphone,
    badge: 'Instant',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    sub: 'Pay on arrival',
    Icon: Banknote,
    badge: 'No Fee',
    badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  },
  {
    id: 'wallet',
    name: 'FoodBite Wallet',
    sub: 'Balance: $42.50',
    Icon: Wallet,
    badge: '5% Back',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
]

const ADDRESS_TYPES = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'work', label: 'Work', Icon: Briefcase },
  { id: 'other', label: 'Other', Icon: MapPin }
]

function generateOrderId() {
  const prefix = 'FD'
  const num = Math.floor(10000 + Math.random() * 90000)
  return `${prefix}-${num}`
}

function getDeliveryTime() {
  const min = Math.floor(25 + Math.random() * 15)
  const max = min + 10
  return `${min}–${max} mins`
}

// ─── Coupon Calculator ────────────────────────────────────────────────────────
function applyCoupon(coupon, subtotal, deliveryFee) {
  if (!coupon) return { discount: 0, deliveryDiscount: 0 }
  if (coupon.type === 'percent') {
    const raw = (subtotal * coupon.value) / 100
    return { discount: Math.min(raw, coupon.maxDiscount), deliveryDiscount: 0 }
  }
  if (coupon.type === 'flat') {
    return { discount: Math.min(coupon.value, coupon.maxDiscount), deliveryDiscount: 0 }
  }
  if (coupon.type === 'free_delivery') {
    return { discount: 0, deliveryDiscount: deliveryFee }
  }
  return { discount: 0, deliveryDiscount: 0 }
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 w-full max-w-sm mx-auto">
      {STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border transition-all duration-300
                  ${done ? 'bg-orange-500 border-orange-500 text-white' : active ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-bold uppercase tracking-wide ${active ? 'text-orange-400' : done ? 'text-slate-400' : 'text-slate-600'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 transition-all duration-500 ${done ? 'bg-orange-500' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Coupon Card ──────────────────────────────────────────────────────────────
function CouponCard({ coupon, onApply, applied }) {
  const isApplied = applied?.code === coupon.code
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isApplied ? 'border-orange-500/50 bg-orange-500/5' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{coupon.emoji}</span>
        <div>
          <div className="flex items-center gap-2">
            <code className="text-xs font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
              {coupon.code}
            </code>
            {isApplied && (
              <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Applied</span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{coupon.description}</p>
          <p className="text-[10px] text-slate-500">Min order: ${coupon.minOrder}</p>
        </div>
      </div>
      <button
        onClick={() => onApply(coupon)}
        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${isApplied ? 'text-red-400 border-red-500/30 hover:bg-red-500/10' : 'text-orange-400 border-orange-500/30 hover:bg-orange-500/10'}`}
      >
        {isApplied ? 'Remove' : 'Apply'}
      </button>
    </div>
  )
}

// ─── Order Confirmation Screen ────────────────────────────────────────────────
function OrderConfirmScreen({ order, onBack, onNewOrder }) {
  const [copied, setCopied] = useState(false)
  const confettiRef = useRef(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(order.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Celebration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-orange-500/40 mx-auto animate-bounce-slow">
          <PartyPopper className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Order Confirmed! 🎉</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        Your food is being prepared by {order.restaurant}. Sit tight — it's on its way!
      </p>

      {/* Order ID Card */}
      <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-5 text-left space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Order ID</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-black text-orange-400">{order.id}</code>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500 mb-0.5">Restaurant</p>
            <p className="text-white font-semibold truncate">{order.restaurant}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-0.5">Items</p>
            <p className="text-white font-semibold">{order.itemCount} item(s)</p>
          </div>
          <div>
            <p className="text-slate-500 mb-0.5">Total Paid</p>
            <p className="text-orange-400 font-black">${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-0.5">Payment</p>
            <p className="text-white font-semibold capitalize">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Estimated Delivery</p>
                <p className="text-sm font-black text-white">{order.eta}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Bike className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Rider</p>
                <p className="text-xs font-bold text-white">{order.rider}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live status bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
            <span>Order Placed</span>
            <span>Preparing</span>
            <span>On the Way</span>
            <span>Delivered</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-2/4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md shadow-orange-500/50 border-2 border-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address Reminder */}
      <div className="w-full max-w-sm bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-6 flex items-center gap-3 text-left">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Delivering to</p>
          <p className="text-xs text-white font-semibold">{order.address}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={onNewOrder}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Order Again
        </button>
        <Link
          to={`/tracking?id=${order.id}`}
          className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Navigation className="w-3.5 h-3.5" />
          Track Order
        </Link>
        <Link
          to="/dashboard"
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { currentUser, isAdmin } = useAuth()
  const {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    tax,
    totalPrice,
    clearCartDirect
  } = useCart()
  const { addOrder } = useAppData()

  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [step, setStep] = useState(0) // 0=Delivery, 1=Payment, 2=Review, 3=Confirm
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const orderPlacedRef = React.useRef(false) // prevents guard from redirecting after order placed

  // ── Delivery Form ──
  const [addrType, setAddrType] = useState('home')
  const [address, setAddress] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    line1: currentUser?.address || '',
    line2: '',
    city: 'Springfield',
    pincode: '62701',
    instructions: ''
  })
  const [addrErrors, setAddrErrors] = useState({})

  // ── Coupon ──
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [showAllCoupons, setShowAllCoupons] = useState(false)

  // ── Payment ──
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState(currentUser?.name || '')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [upiId, setUpiId] = useState('')

  // ── Placing Order ──
  const [placing, setPlacing] = useState(false)

  // Guard: redirect if admin or empty cart (never redirects after order is placed)
  useEffect(() => {
    if (isAdmin) {
      toast.info('Checkout is for customers only.')
      navigate('/orders')
      return
    }
    if (cartItems.length === 0 && !confirmedOrder && !orderPlacedRef.current) {
      toast.warning('Your cart is empty! Add items before checkout.', { icon: '🛒' })
      navigate('/orders')
    }
  }, [isAdmin, cartItems, confirmedOrder])

  // ── Price Calculations ──
  const { discount, deliveryDiscount } = applyCoupon(appliedCoupon, subtotal, deliveryFee)
  const finalDelivery = Math.max(0, deliveryFee - deliveryDiscount)
  const finalTotal = Math.max(0, subtotal - discount + finalDelivery + tax)
  const totalSavings = discount + deliveryDiscount

  // ── Coupon Logic ──
  const handleApplyCoupon = (couponObj) => {
    if (appliedCoupon?.code === couponObj.code) {
      setAppliedCoupon(null)
      setCouponInput('')
      setCouponError('')
      toast.info(`Coupon "${couponObj.code}" removed.`)
      return
    }
    if (subtotal < couponObj.minOrder) {
      setCouponError(`Minimum order of $${couponObj.minOrder} required for this coupon.`)
      toast.error(`Add $${(couponObj.minOrder - subtotal).toFixed(2)} more to use ${couponObj.code}`)
      return
    }
    setAppliedCoupon(couponObj)
    setCouponInput(couponObj.code)
    setCouponError('')
    toast.success(`Coupon "${couponObj.code}" applied! You save $${Math.min(couponObj.maxDiscount, (subtotal * couponObj.value) / 100 || couponObj.value).toFixed(2)} 🎉`)
  }

  const handleManualCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) { setCouponError('Enter a coupon code.'); return }
    const found = COUPONS.find(c => c.code === code && c.isActive)
    if (!found) { setCouponError('Invalid or expired coupon code.'); return }
    handleApplyCoupon(found)
  }

  // ── Address Validation ──
  const validateAddress = () => {
    const errs = {}
    if (!address.name.trim()) errs.name = 'Full name is required'
    if (!address.phone.trim()) errs.phone = 'Phone number is required'
    if (!address.line1.trim()) errs.line1 = 'Address is required'
    if (!address.city.trim()) errs.city = 'City is required'
    if (!address.pincode.trim()) errs.pincode = 'Pincode is required'
    setAddrErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Payment Validation ──
  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16) {
        toast.error('Enter a valid 16-digit card number.')
        return false
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        toast.error('Enter valid card expiry (MM/YY).')
        return false
      }
      if (cardCvv.length < 3) {
        toast.error('Enter a valid CVV.')
        return false
      }
    }
    if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) {
        toast.error('Enter a valid UPI ID (e.g. name@upi).')
        return false
      }
    }
    return true
  }

  // ── Step Navigation ──
  const handleNext = () => {
    if (step === 0 && !validateAddress()) return
    if (step === 1 && !validatePayment()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Place Order ──
  const handlePlaceOrder = async () => {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1800)) // simulate API

    const orderId = generateOrderId()
    const eta = getDeliveryTime()
    const restaurantNames = Array.from(new Set(cartItems.map(i => i.restaurantName)))
    const restaurantLabel = restaurantNames.length === 1
      ? restaurantNames[0]
      : `${restaurantNames[0]} (+${restaurantNames.length - 1} more)`

    const riders = ['Marcus Vance', 'Riya Patel', 'Jake Torres', 'Priya Singh', 'Leon Gray']
    const rider = riders[Math.floor(Math.random() * riders.length)]

    const newOrder = {
      id: orderId,
      restaurant: restaurantLabel,
      itemCount: cartCount,
      items: cartItems.map(item => ({ name: item.name, qty: item.quantity, price: item.price })),
      // ✅ Use field names matching RecentOrdersTable / mockDashboardData schema
      totalAmount: finalTotal,
      total: finalTotal,           // kept for OrderConfirmScreen
      discount: totalSavings,
      coupon: appliedCoupon?.code || null,
      paymentMethod: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || paymentMethod,
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',    // ✅ matches RecentOrdersTable getStatusBadge key
      status: 'Preparing',
      address: `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city} - ${address.pincode}`,
      estimatedDelivery: eta,      // ✅ matches RecentOrdersTable + OrderDetailsModal schema
      eta,
      rider,
      placedAt: 'Just now',
      customer: {
        name: currentUser?.name || address.name || 'Katru Satyanarayana',
        email: currentUser?.email || 'satyanarayanayadav50@gmail.com',
        phone: address.phone || currentUser?.phone || '+91 8179795623',
        // ✅ fallback avatar so img tag never breaks
        avatar: currentUser?.avatar || '/satyanarayana.jpg'
      }
    }

    // ✅ Use AppDataContext to register order (updates dashboard dynamically)
    addOrder(newOrder)

    // ⚠️ Set orderPlacedRef + confirmedOrder BEFORE clearCartDirect()
    // so the useEffect guard never fires when cart becomes empty
    orderPlacedRef.current = true
    setConfirmedOrder(newOrder)
    setPlacing(false)
    setStep(3) // Confirm screen
    clearCartDirect() // clear AFTER state is set

    toast.success(`🎉 Order ${orderId} placed successfully!`, { autoClose: 5000 })
  }

  // ── Render Helpers ──
  const inputCls = (err) =>
    `w-full bg-slate-950 border ${err ? 'border-red-500/60' : 'border-slate-800'} rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors`

  const labelCls = 'block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5'

  // ── Restaurant summary for Order Review ──
  const restaurants = Array.from(new Set(cartItems.map(i => i.restaurantName)))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col w-full">
          {/* ── Top Bar ── */}
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
                  <span>Checkout</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-orange-500/10 text-orange-400 border-orange-500/30">
                    Module 6
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Order Placement · Delivery · Payment Gateway
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {step < 3 && (
                <Link
                  to="/orders"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back to Cart</span>
                </Link>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar
                    ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    : currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-semibold text-slate-200 hidden md:inline">{currentUser?.name}</span>
              </div>
            </div>
          </header>

          {/* ── Main ── */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-6xl w-full mx-auto">

            {/* Step Bar */}
            {step < 3 && (
              <div className="mb-8">
                <StepBar current={step} />
              </div>
            )}

            {/* ════════ STEP 0: DELIVERY ADDRESS ════════ */}
            {step === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      Delivery Address
                    </h2>

                    {/* Address Type */}
                    <div className="flex gap-2 mb-5">
                      {ADDRESS_TYPES.map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          onClick={() => setAddrType(id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${addrType === id ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Full Name *</label>
                        <input
                          className={inputCls(addrErrors.name)}
                          placeholder="e.g. Katru Satyanarayana"
                          value={address.name}
                          onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
                        />
                        {addrErrors.name && <p className="text-[10px] text-red-400 mt-1">{addrErrors.name}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Phone Number *</label>
                        <input
                          className={inputCls(addrErrors.phone)}
                          placeholder="+91 8179795623"
                          value={address.phone}
                          onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                        />
                        {addrErrors.phone && <p className="text-[10px] text-red-400 mt-1">{addrErrors.phone}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Address Line 1 *</label>
                        <input
                          className={inputCls(addrErrors.line1)}
                          placeholder="House / Flat No., Street Name"
                          value={address.line1}
                          onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))}
                        />
                        {addrErrors.line1 && <p className="text-[10px] text-red-400 mt-1">{addrErrors.line1}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Address Line 2 (Optional)</label>
                        <input
                          className={inputCls(false)}
                          placeholder="Landmark, Apartment, Building"
                          value={address.line2}
                          onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>City *</label>
                        <input
                          className={inputCls(addrErrors.city)}
                          placeholder="Springfield"
                          value={address.city}
                          onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                        />
                        {addrErrors.city && <p className="text-[10px] text-red-400 mt-1">{addrErrors.city}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Pincode / ZIP *</label>
                        <input
                          className={inputCls(addrErrors.pincode)}
                          placeholder="62701"
                          value={address.pincode}
                          onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))}
                        />
                        {addrErrors.pincode && <p className="text-[10px] text-red-400 mt-1">{addrErrors.pincode}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Delivery Instructions (Optional)</label>
                        <textarea
                          className={`${inputCls(false)} resize-none h-16`}
                          placeholder="Leave at door, ring bell, call on arrival..."
                          value={address.instructions}
                          onChange={e => setAddress(a => ({ ...a, instructions: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coupons on Step 0 */}
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-400" />
                      Coupons & Offers
                    </h2>

                    {/* Manual input */}
                    <div className="flex gap-2 mb-4">
                      <input
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors uppercase font-mono"
                        placeholder="Enter coupon code..."
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                        onKeyDown={e => e.key === 'Enter' && handleManualCoupon()}
                      />
                      <button
                        onClick={handleManualCoupon}
                        className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2 mb-3">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {couponError}
                      </div>
                    )}

                    {/* Coupon list */}
                    <div className="space-y-2">
                      {(showAllCoupons ? COUPONS : COUPONS.slice(0, 3)).map(c => (
                        <CouponCard key={c.code} coupon={c} onApply={handleApplyCoupon} applied={appliedCoupon} />
                      ))}
                    </div>
                    <button
                      onClick={() => setShowAllCoupons(s => !s)}
                      className="mt-3 text-[10px] font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      {showAllCoupons ? 'Show Less' : `View ${COUPONS.length - 3} More Offers`}
                    </button>
                  </div>
                </div>

                {/* Right: Mini Order Summary */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 sticky top-24">
                    <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-orange-400" />
                      Order Summary
                    </h3>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-500">×{item.quantity}</p>
                          </div>
                          <span className="text-xs font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal ({cartCount} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Delivery Fee</span>
                        <span className={finalDelivery === 0 ? 'text-emerald-400 font-bold' : ''}>
                          {finalDelivery === 0 ? 'FREE' : `$${finalDelivery.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Tax (8%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      {totalSavings > 0 && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>🎉 Coupon Savings</span>
                          <span>-${totalSavings.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-slate-800">
                        <span>Total</span>
                        <span className="text-orange-400">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ════════ STEP 1: PAYMENT ════════ */}
            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-orange-400" />
                      Select Payment Method
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {PAYMENT_METHODS.map(({ id, name, sub, Icon, badge, badgeBg }) => (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${paymentMethod === id ? 'border-orange-500/60 bg-orange-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === id ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-white">{name}</p>
                            <p className="text-[10px] text-slate-500">{sub}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${badgeBg}`}>{badge}</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === id ? 'border-orange-500' : 'border-slate-700'}`}>
                              {paymentMethod === id && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Card Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          <span>256-bit SSL Encrypted · PCI DSS Compliant</span>
                        </div>
                        <div>
                          <label className={labelCls}>Card Number *</label>
                          <input
                            className={inputCls(false)}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            value={cardNum}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                              setCardNum(v.replace(/(.{4})/g, '$1 ').trim())
                            }}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Cardholder Name *</label>
                          <input
                            className={inputCls(false)}
                            placeholder="As on card"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Expiry (MM/YY) *</label>
                            <input
                              className={inputCls(false)}
                              placeholder="12/26"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={e => {
                                let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                                if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
                                setCardExpiry(v)
                              }}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>CVV *</label>
                            <input
                              className={inputCls(false)}
                              placeholder="•••"
                              maxLength={4}
                              type="password"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Form */}
                    {paymentMethod === 'upi' && (
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                        <label className={labelCls}>UPI ID *</label>
                        <input
                          className={inputCls(false)}
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                        />
                        <p className="text-[10px] text-slate-500 mt-2">e.g. yourname@okicici, phone@ybl, etc.</p>
                      </div>
                    )}

                    {/* COD Notice */}
                    {paymentMethod === 'cod' && (
                      <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex items-start gap-3">
                        <Banknote className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-orange-300 mb-1">Cash on Delivery Selected</p>
                          <p className="text-xs text-slate-400">Please keep exact change ready. Our rider will collect payment upon delivery. No digital transaction required.</p>
                        </div>
                      </div>
                    )}

                    {/* Wallet Notice */}
                    {paymentMethod === 'wallet' && (
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-3">
                        <Wallet className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-purple-300 mb-1">FoodBite Wallet Selected</p>
                          <p className="text-xs text-slate-400">Available Balance: <span className="text-white font-bold">$42.50</span> · This order total: <span className="text-orange-400 font-bold">${finalTotal.toFixed(2)}</span></p>
                          {finalTotal > 42.50 && (
                            <p className="text-xs text-red-400 mt-1">⚠️ Insufficient balance. Please top up or choose another method.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Price Summary */}
                <div>
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 sticky top-24 space-y-4">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <ReceiptText className="w-4 h-4 text-orange-400" />
                      Bill Details
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Item Total</span><span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Delivery Fee</span>
                        <span className={finalDelivery === 0 ? 'text-emerald-400 font-bold' : ''}>
                          {finalDelivery === 0 ? 'FREE' : `$${finalDelivery.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Taxes & Fees (8%)</span><span>${tax.toFixed(2)}</span>
                      </div>
                      {totalSavings > 0 && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Discount Applied</span><span>-${totalSavings.toFixed(2)}</span>
                        </div>
                      )}
                      {appliedCoupon && (
                        <div className="flex items-center gap-1.5 text-orange-400 text-[10px] bg-orange-500/5 border border-orange-500/20 rounded-lg px-2 py-1.5">
                          <Tag className="w-3 h-3" />
                          <span>{appliedCoupon.code}</span>
                          <button onClick={() => setAppliedCoupon(null)} className="ml-auto hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-white font-black pt-2 border-t border-slate-800 text-sm">
                      <span>Total Payable</span>
                      <span className="text-orange-400">${finalTotal.toFixed(2)}</span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="text-center text-[10px] font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-xl py-2">
                        🎉 You're saving ${totalSavings.toFixed(2)} on this order!
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleBack}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5"
                      >
                        Review Order
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════ STEP 2: REVIEW ════════ */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  {/* Delivery Summary */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" /> Delivering To
                      </h3>
                      <button onClick={() => setStep(0)} className="text-[10px] text-orange-400 font-bold hover:text-orange-300">Edit</button>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                        {ADDRESS_TYPES.find(a => a.id === addrType)?.Icon && (
                          React.createElement(ADDRESS_TYPES.find(a => a.id === addrType).Icon, { className: 'w-4 h-4 text-orange-400' })
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white capitalize">{addrType} Address</p>
                        <p className="text-xs text-slate-400">{address.name} · {address.phone}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city} - {address.pincode}
                        </p>
                        {address.instructions && (
                          <p className="text-[10px] text-slate-500 mt-1 italic">📝 {address.instructions}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-orange-400" /> Payment Method
                      </h3>
                      <button onClick={() => setStep(1)} className="text-[10px] text-orange-400 font-bold hover:text-orange-300">Edit</button>
                    </div>
                    {(() => {
                      const pm = PAYMENT_METHODS.find(m => m.id === paymentMethod)
                      if (!pm) return null
                      return (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <pm.Icon className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{pm.name}</p>
                            {paymentMethod === 'card' && cardNum && (
                              <p className="text-[10px] text-slate-400">•••• {cardNum.slice(-4)}</p>
                            )}
                            {paymentMethod === 'upi' && upiId && (
                              <p className="text-[10px] text-slate-400">{upiId}</p>
                            )}
                            {paymentMethod === 'cod' && (
                              <p className="text-[10px] text-slate-400">Pay on delivery</p>
                            )}
                            {paymentMethod === 'wallet' && (
                              <p className="text-[10px] text-slate-400">Balance: $42.50</p>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Items Review */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                      Your Items ({cartCount})
                    </h3>

                    {restaurants.map(r => (
                      <div key={r} className="mb-4 last:mb-0">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                          {r}
                        </p>
                        <div className="space-y-2">
                          {cartItems.filter(i => i.restaurantName === r).map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80' }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-500">${item.price.toFixed(2)} × {item.quantity}</p>
                              </div>
                              <span className="text-xs font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Final Bill + Place Order */}
                <div>
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 sticky top-24 space-y-4">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <ReceiptText className="w-4 h-4 text-orange-400" /> Final Bill
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400"><span>Item Total</span><span>${subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-slate-400">
                        <span>Delivery Fee</span>
                        <span className={finalDelivery === 0 ? 'text-emerald-400 font-bold' : ''}>
                          {finalDelivery === 0 ? 'FREE' : `$${finalDelivery.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400"><span>Taxes (8%)</span><span>${tax.toFixed(2)}</span></div>
                      {totalSavings > 0 && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Coupon ({appliedCoupon?.code})</span><span>-${totalSavings.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-white font-black pt-2 border-t border-slate-800">
                      <span>Total</span>
                      <span className="text-orange-400 text-lg">${finalTotal.toFixed(2)}</span>
                    </div>

                    {/* ETA estimate */}
                    <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                      <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500">Est. Delivery Time</p>
                        <p className="text-xs font-black text-white">30–45 mins</p>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      By placing your order you agree to our Terms of Service and Privacy Policy. Payment is processed securely.
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={handleBack}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-black transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                      >
                        {placing ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            Place Order · ${finalTotal.toFixed(2)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════ STEP 3: CONFIRMATION ════════ */}
            {step === 3 && confirmedOrder && (
              <OrderConfirmScreen
                order={confirmedOrder}
                onBack={() => navigate('/orders')}
                onNewOrder={() => { setStep(0); navigate('/restaurants') }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
