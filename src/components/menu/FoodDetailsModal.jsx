import React, { useState } from 'react'
import { 
  X, 
  Star, 
  Clock, 
  Flame, 
  Store, 
  ShoppingBag, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  ShieldCheck,
  Utensils,
  Edit3,
  Power,
  Trash2,
  Sliders
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

export default function FoodDetailsModal({
  food,
  isOpen,
  onClose,
  onOrderPlaced,
  onEditFood,
  onToggleAvailability,
  onDeleteFood
}) {
  const { currentUser, isAdmin } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')

  if (!isOpen || !food) return null

  const {
    id,
    name,
    category,
    restaurantName,
    price,
    isVeg,
    rating,
    reviewsCount,
    description,
    image,
    isAvailable,
    prepTime,
    calories,
    spicyLevel,
    tags
  } = food

  const subtotal = price * quantity
  const deliveryCharge = 2.99
  const orderTotal = subtotal + deliveryCharge

  const handlePlaceOrder = () => {
    if (!isAvailable) {
      toast.warning('This item is currently sold out and unavailable.', { icon: '⚠️' })
      return
    }

    const orderId = `FD-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder = {
      id: orderId,
      customer: {
        name: currentUser?.name || 'Sarah Connor',
        email: currentUser?.email || 'customer@foodbite.com',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        phone: currentUser?.phone || '+1 (555) 234-5678',
        address: currentUser?.address || '742 Evergreen Terrace, Springfield'
      },
      restaurant: restaurantName,
      items: [
        {
          name,
          qty: quantity,
          price
        }
      ],
      totalAmount: orderTotal,
      paymentMethod: 'Credit Card / Wallet',
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',
      placedAt: 'Just now',
      estimatedDelivery: prepTime || '25 mins',
      specialInstructions: specialInstructions.trim() || undefined,
      rider: 'Marcus Vance'
    }

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('foodbite_recent_orders') || '[]')
      localStorage.setItem('foodbite_recent_orders', JSON.stringify([newOrder, ...existing]))
    } catch (e) {
      console.error(e)
    }

    if (onOrderPlaced) {
      onOrderPlaced(newOrder)
    }

    toast.success(
      `Order ${orderId} placed successfully for ${quantity}x ${name}! Total: $${orderTotal.toFixed(2)}`,
      { icon: '🍔' }
    )

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Modal Header Banner */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-950 shrink-0">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-60' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white transition-colors backdrop-blur-md z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-950/90 backdrop-blur-md flex items-center gap-1.5 border shadow-lg ${
                isVeg
                  ? 'text-emerald-400 border-emerald-500/40'
                  : 'text-rose-400 border-rose-500/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
              <span>{isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
            </span>

            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950/90 text-orange-400 border border-orange-500/30 backdrop-blur-md">
              {category}
            </span>

            {isAvailable ? (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                In Stock
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md">
                Sold Out
              </span>
            )}
          </div>

          {/* Bottom Banner Info */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-400 flex items-center gap-1.5 mb-1">
                <Store className="w-4 h-4" />
                <span>{restaurantName}</span>
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {name}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Item Price</span>
              <span className="text-2xl font-black text-white">${price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Prep Time</span>
              <span className="text-xs font-bold text-white">{prepTime || '15-20 mins'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Calories</span>
              <span className="text-xs font-bold text-white">{calories || '450 kcal'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <Utensils className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Spice Level</span>
              <span className="text-xs font-bold text-white">{spicyLevel || 'Medium'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating</span>
              <span className="text-xs font-bold text-white">{rating.toFixed(1)} ({reviewsCount})</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Dish Description & Ingredients
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              {description}
            </p>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Flavor Notes & Dietary Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-orange-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Role Differentiated Section: Admin Catalog Controls vs Customer Ordering */}
          {isAdmin ? (
            /* Admin Management Overview Panel */
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <h4 className="text-xs font-bold uppercase text-white tracking-wider">
                    Admin Catalog Controls
                  </h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  isAvailable
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {isAvailable ? '🟢 Available for Delivery' : '🔴 Marked Sold Out'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Dish ID</span>
                  <span className="font-mono text-white text-[11px] font-bold">{id}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Cuisine Category</span>
                  <span className="text-white font-bold">{category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Catalog Price</span>
                  <span className="text-white font-bold">${price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Customer Order Customization Section (Portions, Notes, Total) */
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Order Customization
              </h4>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Quantity</span>
                  <span className="text-[11px] text-slate-400">Select portion count</span>
                </div>

                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 rounded-2xl p-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={!isAvailable || quantity <= 1}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(20, prev + 1))}
                    disabled={!isAvailable || quantity >= 20}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Special Instructions Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Special Requests or Dietary Notes (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra sauce, mild spice, no onions..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({quantity}x ${price.toFixed(2)})</span>
                  <span className="text-slate-200 font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Delivery Fee</span>
                  <span className="text-slate-200 font-semibold">${deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800/80">
                  <span>Total Amount</span>
                  <span className="text-orange-400 font-mono">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80 shrink-0">
          {isAdmin ? (
            /* Admin Actions: Delete, Toggle Stock, Edit, Close */
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onDeleteFood) onDeleteFood(id, name)
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Delete Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Dish</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onToggleAvailability) onToggleAvailability(id, name, isAvailable)
                  }}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isAvailable
                      ? 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                  title="Toggle In Stock"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isAvailable ? 'Mark Sold Out' : 'Mark In Stock'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onEditFood) onEditFood(food)
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Item</span>
                </button>
              </div>
            </>
          ) : (
            /* Customer Actions: Close & Place Order */
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!isAvailable}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer ${
                  isAvailable
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAvailable ? `Place Order ($${orderTotal.toFixed(2)})` : 'Currently Unavailable'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
