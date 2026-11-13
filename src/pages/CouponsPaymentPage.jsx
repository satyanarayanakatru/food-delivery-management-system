import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Tag, CreditCard, Smartphone, Wallet, Banknote, CheckCircle2, XCircle,
  ArrowLeft, Menu, Percent, Gift, Zap, Shield, AlertCircle, Copy, ChevronDown, ChevronUp
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Sidebar from '../components/layout/Sidebar'
import { COUPONS } from '../data/mockPaymentData'

// ── Payment method config ──────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: CreditCard,
    color: 'blue',
    networks: ['Visa', 'Mastercard', 'Amex', 'RuPay'],
    desc: 'All major cards accepted. Payments secured by 256-bit SSL.'
  },
  {
    id: 'upi',
    label: 'UPI / GPay / PhonePe',
    icon: Smartphone,
    color: 'purple',
    networks: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'],
    desc: 'Instant transfer via UPI. Supports all major UPI apps.'
  },
  {
    id: 'wallet',
    label: 'FoodBite Wallet',
    icon: Wallet,
    color: 'orange',
    networks: [],
    desc: 'Use your prepaid wallet balance for instant checkout.'
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    icon: Banknote,
    color: 'emerald',
    networks: [],
    desc: 'Pay in cash when your order arrives. No extra charges.'
  }
]

// Demo wallet balance
const WALLET_BALANCE = 125.0

// ── Coupon Card ───────────────────────────────────────────────────────────────
function CouponCard({ coupon, appliedCode, onApply }) {
  const isApplied = appliedCode === coupon.code
  return (
    <div className={`p-4 rounded-2xl border transition-all ${isApplied ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isApplied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <code className="text-sm font-black text-white">{coupon.code}</code>
              {isApplied && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">Applied ✓</span>}
              {!coupon.isActive && <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded-full">Expired</span>}
            </div>
            <p className="text-xs text-slate-300 font-semibold">{coupon.description}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Min order: ${coupon.minOrder} · Max discount: ${coupon.maxDiscount}</p>
          </div>
        </div>
        <button
          onClick={() => onApply(coupon)}
          disabled={!coupon.isActive}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
            isApplied
              ? 'text-red-400 border-red-500/30 hover:bg-red-500/10'
              : 'text-orange-400 border-orange-500/30 hover:bg-orange-500/10'
          }`}
        >
          {isApplied ? 'Remove' : 'Apply'}
        </button>
      </div>
    </div>
  )
}

// ── Card Form ─────────────────────────────────────────────────────────────────
function CardForm({ card, setCard }) {
  const handleCardNum = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    setCard(p => ({ ...p, number: digits.replace(/(.{4})/g, '$1 ').trim() }))
  }
  const handleExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
    setCard(p => ({ ...p, expiry: formatted }))
  }

  const inputCls = 'w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors'

  return (
    <div className="space-y-3 mt-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Card Number</label>
        <input value={card.number} onChange={e => handleCardNum(e.target.value)} placeholder="1234 5678 9012 3456" className={inputCls} maxLength={19} />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Cardholder Name</label>
        <input value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} placeholder="Name on card" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Expiry (MM/YY)</label>
          <input value={card.expiry} onChange={e => handleExpiry(e.target.value)} placeholder="MM/YY" className={inputCls} maxLength={5} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">CVV</label>
          <input value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))} placeholder="•••" className={inputCls} maxLength={3} type="password" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
        <Shield className="w-3 h-3 text-emerald-500" />
        Your card details are protected by 256-bit encryption
      </div>
    </div>
  )
}

// ── UPI Form ──────────────────────────────────────────────────────────────────
function UPIForm({ upiId, setUpiId }) {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">UPI ID</label>
        <input
          value={upiId}
          onChange={e => setUpiId(e.target.value)}
          placeholder="yourname@upi"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
          <button key={app} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-purple-500/20 hover:text-purple-300 text-slate-400 border border-slate-700 hover:border-purple-500/30 transition-all">
            {app}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Payment Result Screen ─────────────────────────────────────────────────────
function ResultScreen({ type, amount, method, onReset }) {
  const isSuccess = type === 'success'
  return (
    <div className={`p-8 rounded-3xl border text-center space-y-5 backdrop-blur-xl ${isSuccess ? 'bg-emerald-950/40 border-emerald-700/40' : 'bg-red-950/40 border-red-700/40'}`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-2xl ${isSuccess ? 'bg-emerald-500/20 shadow-emerald-500/30' : 'bg-red-500/20 shadow-red-500/30'}`}>
        {isSuccess ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
      </div>
      <div>
        <h2 className={`text-2xl font-black ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
          {isSuccess ? 'Payment Successful! 🎉' : 'Payment Failed'}
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          {isSuccess
            ? `$${amount} paid via ${method}. Your order is being prepared!`
            : 'Something went wrong. Please try a different payment method.'}
        </p>
        {isSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 inline-block">
            <p className="text-xs text-slate-400">Transaction ID</p>
            <code className="text-sm font-black text-emerald-400">TXN-{Math.random().toString(36).slice(2, 10).toUpperCase()}</code>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onReset} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${isSuccess ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
          {isSuccess ? 'Make Another Payment' : 'Try Again'}
        </button>
        <Link to="/orders" className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors">
          Go to Cart
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CouponsPaymentPage() {
  const { currentUser } = useAuth()
  const { subtotal, totalPrice } = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab]     = useState('coupons') // 'coupons' | 'payment'
  const [appliedCode, setAppliedCode] = useState(null)
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [showAll, setShowAll]         = useState(false)

  const [payMethod, setPayMethod]     = useState('card')
  const [card, setCard]               = useState({ number: '', name: currentUser?.name || '', expiry: '', cvv: '' })
  const [upiId, setUpiId]             = useState('')
  const [processing, setProcessing]   = useState(false)
  const [result, setResult]           = useState(null) // null | 'success' | 'failure'

  const [showCouponDetails, setShowCouponDetails] = useState(false)

  // Discount calculation
  const applied = COUPONS.find(c => c.code === appliedCode)
  const discount = applied
    ? Math.min(applied.maxDiscount, applied.type === 'percent' ? (subtotal * applied.value) / 100 : applied.value)
    : 0
  const finalTotal = Math.max(0, totalPrice - discount)

  const handleApplyCoupon = (coupon) => {
    if (appliedCode === coupon.code) {
      setAppliedCode(null)
      setCouponInput('')
      toast.info(`Coupon "${coupon.code}" removed.`)
      return
    }
    if (!coupon.isActive) { toast.error('This coupon has expired.'); return }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Min order $${coupon.minOrder} required for ${coupon.code}`)
      toast.error(`Add $${(coupon.minOrder - subtotal).toFixed(2)} more to use this coupon`)
      return
    }
    setAppliedCode(coupon.code)
    setCouponInput(coupon.code)
    setCouponError('')
    toast.success(`Coupon "${coupon.code}" applied! Save $${discount.toFixed(2)} 🎉`)
  }

  const handleManualApply = () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) { setCouponError('Enter a coupon code.'); return }
    const found = COUPONS.find(c => c.code === code)
    if (!found) { setCouponError('Invalid coupon code.'); return }
    handleApplyCoupon(found)
  }

  const handlePay = () => {
    if (payMethod === 'card') {
      if (card.number.replace(/\s/g, '').length < 16) { toast.error('Enter a valid 16-digit card number.'); return }
      if (!card.expiry || card.expiry.length < 5) { toast.error('Enter a valid expiry (MM/YY).'); return }
      if (card.cvv.length < 3) { toast.error('Enter a valid CVV.'); return }
    }
    if (payMethod === 'upi' && !upiId.includes('@')) {
      toast.error('Enter a valid UPI ID (e.g. name@upi).'); return
    }

    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      // 85% success rate simulation
      setResult(Math.random() > 0.15 ? 'success' : 'failure')
    }, 2000)
  }

  const displayCoupons = showAll ? COUPONS : COUPONS.slice(0, 4)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col w-full">
          {/* Header */}
          <header className="bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">Coupons & Payment</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Apply discounts and manage payment methods</p>
              </div>
            </div>
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </header>

          {/* Body */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">

            {/* Result Screen */}
            {result && (
              <ResultScreen
                type={result}
                amount={finalTotal.toFixed(2)}
                method={PAYMENT_METHODS.find(m => m.id === payMethod)?.label}
                onReset={() => setResult(null)}
              />
            )}

            {!result && (
              <>
                {/* Tab Switcher */}
                <div className="flex bg-slate-900/80 border border-slate-800 rounded-2xl p-1 gap-1">
                  {[
                    { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
                    { id: 'payment', label: 'Payment Methods', icon: CreditCard }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === id
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* ── COUPONS TAB ── */}
                  {activeTab === 'coupons' && (
                    <div className="lg:col-span-2 space-y-4">
                      {/* Manual input */}
                      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                        <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-orange-400" />
                          Enter Coupon Code
                        </h3>
                        <div className="flex gap-2">
                          <input
                            value={couponInput}
                            onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                            placeholder="e.g. SAVE20"
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono font-bold uppercase focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors"
                          />
                          <button
                            onClick={handleManualApply}
                            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />{couponError}
                          </p>
                        )}
                        {appliedCode && (
                          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Coupon <strong>{appliedCode}</strong> applied — you save ${discount.toFixed(2)}!
                          </p>
                        )}
                      </div>

                      {/* Available coupons */}
                      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-black text-white flex items-center gap-2">
                            <Gift className="w-4 h-4 text-orange-400" />
                            Available Offers ({COUPONS.filter(c => c.isActive).length} active)
                          </h3>
                          <button onClick={() => setShowAll(s => !s)} className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                            {showAll ? 'Show Less' : 'Show All'}
                            {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                        {displayCoupons.map(coupon => (
                          <CouponCard key={coupon.code} coupon={coupon} appliedCode={appliedCode} onApply={handleApplyCoupon} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── PAYMENT TAB ── */}
                  {activeTab === 'payment' && (
                    <div className="lg:col-span-2 space-y-4">
                      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-3">
                        <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-orange-400" />
                          Choose Payment Method
                        </h3>
                        {PAYMENT_METHODS.map(method => {
                          const Icon = method.icon
                          const isSelected = payMethod === method.id
                          return (
                            <div key={method.id}>
                              <button
                                onClick={() => setPayMethod(method.id)}
                                className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
                                  isSelected ? 'bg-orange-500/5 border-orange-500/40' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>{method.label}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
                                  {method.networks.length > 0 && (
                                    <div className="flex gap-1.5 mt-2">
                                      {method.networks.map(n => (
                                        <span key={n} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700">{n}</span>
                                      ))}
                                    </div>
                                  )}
                                  {method.id === 'wallet' && (
                                    <p className="text-xs text-emerald-400 font-bold mt-1">Balance: ${WALLET_BALANCE.toFixed(2)}</p>
                                  )}
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 transition-colors ${
                                  isSelected ? 'border-orange-500 bg-orange-500' : 'border-slate-600'
                                }`} />
                              </button>

                              {/* Sub-forms */}
                              {isSelected && method.id === 'card'   && <CardForm card={card} setCard={setCard} />}
                              {isSelected && method.id === 'upi'    && <UPIForm upiId={upiId} setUpiId={setUpiId} />}
                              {isSelected && method.id === 'cod'    && (
                                <div className="mt-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                                  Pay in cash when your rider arrives. No advance payment needed.
                                </div>
                              )}
                              {isSelected && method.id === 'wallet' && (
                                <div className="mt-3 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-xs space-y-1">
                                  <div className="flex justify-between text-slate-300">
                                    <span>Available Balance</span>
                                    <span className="font-black text-emerald-400">${WALLET_BALANCE.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-slate-300">
                                    <span>Order Amount</span>
                                    <span className="font-black text-white">${finalTotal.toFixed(2)}</span>
                                  </div>
                                  {WALLET_BALANCE >= finalTotal
                                    ? <p className="text-emerald-400 font-bold pt-1">✓ Sufficient balance for this order</p>
                                    : <p className="text-red-400 font-bold pt-1">✗ Insufficient balance — please top up</p>
                                  }
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── RIGHT: Payment Summary ── (always visible) */}
                  <div className="space-y-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl sticky top-24">
                      <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-orange-400" />
                        Payment Summary
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Cart Subtotal</span>
                          <span className="text-slate-200 font-bold">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Delivery Fee</span>
                          <span className="text-slate-200 font-bold">${subtotal >= 35 ? '0.00' : '2.99'}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Tax & Fees (8%)</span>
                          <span className="text-slate-200 font-bold">${(subtotal * 0.08).toFixed(2)}</span>
                        </div>
                        {appliedCode && discount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{appliedCode}</span>
                            <span className="font-black">-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                          <span className="font-black text-white">Total Payable</span>
                          <span className="text-2xl font-black text-orange-400">${finalTotal.toFixed(2)}</span>
                        </div>
                        {appliedCode && (
                          <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> You saved ${discount.toFixed(2)} with {appliedCode}!
                          </p>
                        )}
                      </div>

                      {/* Pay Button */}
                      {activeTab === 'payment' && (
                        <button
                          onClick={handlePay}
                          disabled={processing}
                          className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-black transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                        >
                          {processing ? (
                            <>
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Pay ${finalTotal.toFixed(2)}
                            </>
                          )}
                        </button>
                      )}

                      {activeTab === 'coupons' && (
                        <button
                          onClick={() => setActiveTab('payment')}
                          className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-black transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Proceed to Payment
                        </button>
                      )}

                      <Link
                        to="/orders"
                        className="w-full mt-2 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700"
                      >
                        Back to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
