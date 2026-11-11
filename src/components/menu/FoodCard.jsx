import React, { useState } from 'react'
import { 
  Star, 
  Clock, 
  Flame, 
  Edit3, 
  Trash2, 
  Power, 
  ShoppingBag,
  ShoppingCart,
  Plus, 
  Minus, 
  Check, 
  Store,
  Eye,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'

export default function FoodCard({
  food,
  onViewDetails,
  onEditFood,
  onDeleteFood,
  onToggleAvailability,
  onQuickOrder
}) {
  const { isAdmin } = useAuth()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

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

  const handleIncrement = (e) => {
    e.stopPropagation()
    setQuantity((prev) => Math.min(20, prev + 1))
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleAddToCartClick = (e) => {
    e.stopPropagation()
    if (!isAvailable) {
      toast.warning('This item is currently sold out and unavailable.', { icon: '⚠️' })
      return
    }
    addToCart(food, quantity)
    setQuantity(1)
  }

  return (
    <div 
      onClick={() => onViewDetails(food)}
      className="group rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300 shadow-xl shadow-black/20 overflow-hidden flex flex-col justify-between cursor-pointer backdrop-blur-xl hover:-translate-y-1"
    >
      <div>
        {/* Top Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              !isAvailable ? 'grayscale opacity-60' : ''
            }`}
            loading="lazy"
          />

          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          {/* Veg / Non-Veg Indicator Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider bg-slate-950/85 backdrop-blur-md flex items-center gap-1.5 border shadow-md ${
                isVeg
                  ? 'text-emerald-400 border-emerald-500/40'
                  : 'text-rose-400 border-rose-500/40'
              }`}
              title={isVeg ? 'Vegetarian Dish' : 'Non-Vegetarian Dish'}
            >
              <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
              <span>{isVeg ? 'Veg' : 'Non-Veg'}</span>
            </span>

            {/* Availability Status Badge */}
            {isAvailable ? (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                In Stock
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 backdrop-blur-md">
                Sold Out
              </span>
            )}
          </div>

          {/* Category Chip */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-orange-400 border border-orange-500/30 backdrop-blur-md shadow-md">
              {category}
            </span>
          </div>

          {/* Floating Info Pill (Prep Time & Calories) */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/60 text-slate-200 backdrop-blur-md font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{prepTime || '15-20 mins'}</span>
            </div>

            {calories && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-slate-200 font-semibold">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{calories}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Restaurant & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300 truncate max-w-[180px]">
              <Store className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">{restaurantName}</span>
            </span>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[11px] shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              {reviewsCount > 0 && <span className="text-slate-500 font-normal">({reviewsCount})</span>}
            </div>
          </div>

          {/* Dish Name */}
          <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-medium text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer / Action Controls */}
      <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        {/* Price Display */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Price</span>
          <span className="text-lg font-black text-white tracking-tight">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Role Based Action Buttons */}
        {isAdmin ? (
          /* Admin Controls: Toggle Status, Edit, Delete */
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Toggle Availability */}
            <button
              type="button"
              onClick={() => onToggleAvailability(id, name, isAvailable)}
              className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                isAvailable
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isAvailable ? 'Click to mark Sold Out' : 'Click to mark In Stock'}
            >
              <Power className="w-3.5 h-3.5" />
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => onEditFood(food)}
              className="p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Edit Food Item"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button (triggers ConfirmModal) */}
            <button
              type="button"
              onClick={() => onDeleteFood(id, name)}
              className="p-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              title="Delete Food Item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Customer Controls: Quantity Increment/Decrement and Quick Order */
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Quantity Controls */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={!isAvailable || quantity <= 1}
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={!isAvailable || quantity >= 20}
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Cart Action Button */}
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={!isAvailable}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                isAvailable
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isAvailable ? 'Add to Cart' : 'Unavailable'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
