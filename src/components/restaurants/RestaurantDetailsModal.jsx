import React, { useState } from 'react'
import { 
  X, 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  UtensilsCrossed,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Check
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function RestaurantDetailsModal({ restaurant, isOpen, onClose, onOrderPlaced }) {
  const { currentUser, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const [selectedQuantities, setSelectedQuantities] = useState({})

  if (!isOpen || !restaurant) return null

  const dishes = restaurant.featuredDishes || [
    { name: `${restaurant.name} Special Dish`, price: 15.0, image: restaurant.image }
  ]

  const handleQuantityChange = (dishName, delta) => {
    setSelectedQuantities((prev) => {
      const current = prev[dishName] || 0
      const next = Math.max(0, current + delta)
      return { ...prev, [dishName]: next }
    })
  }

  // Calculate order total
  const itemsInOrder = dishes
    .map((dish) => ({
      ...dish,
      qty: selectedQuantities[dish.name] || 0
    }))
    .filter((d) => d.qty > 0)

  const itemsTotal = itemsInOrder.reduce((acc, it) => acc + it.price * it.qty, 0)
  const deliveryFee = restaurant.deliveryCharges || 0
  const finalTotal = itemsTotal > 0 ? itemsTotal + deliveryFee : 0

  const handleAddSelectedToCart = () => {
    if (itemsInOrder.length === 0) {
      toast.info('Please select at least one dish quantity using the + buttons!', {
        icon: '🍕'
      })
      return
    }
    itemsInOrder.forEach((dish) => {
      addToCart(
        {
          id: `rest-${restaurant.id}-${dish.name.replace(/\s+/g, '-').toLowerCase()}`,
          name: dish.name,
          price: dish.price,
          image: dish.image || restaurant.image,
          category: restaurant.cuisine,
          restaurantName: restaurant.name,
          isVeg: false
        },
        dish.qty
      )
    })
    onClose()
  }

  const handlePlaceCustomerOrder = () => {
    if (itemsInOrder.length === 0) {
      toast.info('Please select at least one dish quantity using the + buttons!', {
        icon: '🍕'
      })
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
      restaurant: restaurant.name,
      items: itemsInOrder,
      totalAmount: finalTotal,
      paymentMethod: 'Credit Card / Wallet',
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',
      placedAt: 'Just now',
      estimatedDelivery: restaurant.deliveryTime || '25 mins',
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
      `Order ${orderId} placed successfully at ${restaurant.name}! Total: $${finalTotal.toFixed(2)}`,
      { icon: '🍔' }
    )

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Banner with Cover Image */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-950 shrink-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-950/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-900 backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badges */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-950/80 text-orange-400 border border-orange-500/40 backdrop-blur-md">
              {restaurant.cuisine}
            </span>
            {restaurant.isOpen ? (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open Now</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-950/80 text-rose-400 border border-rose-500/40 backdrop-blur-md">
                Closed
              </span>
            )}
          </div>

          {/* Restaurant Title & Rating on Banner */}
          <div className="absolute bottom-4 left-6 right-6 z-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {restaurant.name}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{restaurant.address}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-sm backdrop-blur-md shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{restaurant.rating.toFixed(1)}</span>
                <span className="text-xs text-amber-200/80 font-normal">
                  ({restaurant.reviewsCount || 120}+ reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Delivery Time
              </span>
              <p className="text-sm font-black text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{restaurant.deliveryTime}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Delivery Fee
              </span>
              <p className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-cyan-400" />
                <span>{restaurant.deliveryCharges === 0 ? 'Free Delivery' : `$${restaurant.deliveryCharges.toFixed(2)}`}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Phone Contact
              </span>
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5 truncate">
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{restaurant.phone || '+1 (555) 000-0000'}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Operating Hours
              </span>
              <p className="text-xs font-bold text-slate-200">
                {restaurant.openingHours || '11:00 AM - 11:00 PM'}
              </p>
            </div>
          </div>

          {/* Description */}
          {restaurant.description && (
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                About this Restaurant
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {restaurant.description}
              </p>
            </div>
          )}

          {/* Signature Menu Ordering Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                <span>Signature Menu & Dish Selection</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                {isAdmin ? 'Menu Showcase' : 'Add items to build your order'}
              </span>
            </div>

            <div className="space-y-2.5">
              {dishes.map((dish, idx) => {
                const qty = selectedQuantities[dish.name] || 0
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {dish.image && (
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-bold text-white text-xs">{dish.name}</p>
                        <p className="text-sm font-extrabold text-orange-400 mt-0.5">
                          ${dish.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity selectors */}
                    {!isAdmin && restaurant.isOpen && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(dish.name, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-white text-xs">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(dish.name, 1)}
                          className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Customer Order Summary Box */}
          {!isAdmin && restaurant.isOpen && itemsInOrder.length > 0 && (
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="flex justify-between text-slate-300">
                <span>Selected Items ({itemsInOrder.reduce((acc, it) => acc + it.qty, 0)})</span>
                <span className="font-semibold text-white">${itemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Charge</span>
                <span className="font-semibold text-white">
                  {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-orange-400 font-extrabold text-sm pt-1.5 border-t border-orange-500/20">
                <span>Total Amount</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Restaurant Partner</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Close
            </button>

            {!isAdmin && restaurant.isOpen && (
              <>
                <button
                  type="button"
                  onClick={handleAddSelectedToCart}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-orange-400 border border-orange-500/40 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handlePlaceCustomerOrder}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Place Order {finalTotal > 0 ? `($${finalTotal.toFixed(2)})` : ''}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
