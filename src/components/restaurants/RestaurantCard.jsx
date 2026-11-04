import React from 'react'
import { 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  ArrowRight, 
  ShoppingBag,
  Trash2,
  Store,
  CheckCircle2,
  Power
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function RestaurantCard({ 
  restaurant, 
  onViewDetails, 
  onDeleteRestaurant, 
  onToggleStatus 
}) {
  const { isAdmin } = useAuth()
  const {
    id,
    name,
    image,
    cuisine,
    rating,
    reviewsCount,
    deliveryTime,
    deliveryCharges,
    address,
    isOpen,
    priceRange,
    tags
  } = restaurant

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300 shadow-xl shadow-black/30 overflow-hidden flex flex-col group backdrop-blur-xl hover:-translate-y-1">
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Status Badge (Open / Closed) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          {isOpen ? (
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Open Now</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 text-rose-400 border border-rose-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Closed</span>
            </span>
          )}
        </div>

        {/* Cuisine Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-orange-400 border border-orange-500/30 backdrop-blur-md shadow-md">
            {cuisine}
          </span>
        </div>

        {/* Bottom Floating Delivery Info Pill */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/60 text-slate-200 backdrop-blur-md font-semibold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-[11px] font-bold">
            <Bike className="w-3.5 h-3.5 text-cyan-400" />
            <span className={deliveryCharges === 0 ? 'text-emerald-400' : 'text-slate-200'}>
              {deliveryCharges === 0 ? 'Free Delivery' : `$${deliveryCharges.toFixed(2)} Fee`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-white text-base group-hover:text-orange-400 transition-colors line-clamp-1">
              {name}
            </h3>
            
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              {reviewsCount && (
                <span className="text-[10px] text-slate-500 font-normal">({reviewsCount})</span>
              )}
            </div>
          </div>

          {/* Address with MapPin */}
          <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>{address}</span>
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-semibold text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Controls based on Role */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {isAdmin ? (
            /* Admin Actions */
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggleStatus && onToggleStatus(id)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                    isOpen
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isOpen ? 'Click to close restaurant' : 'Click to open restaurant'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteRestaurant && onDeleteRestaurant(id, name)}
                  className="p-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  title="Delete Restaurant (Admin)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onViewDetails(restaurant)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Customer Actions */
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-slate-400 font-mono">
                {priceRange || '$$'} &bull; Dine & Deliver
              </span>

              <button
                onClick={() => onViewDetails(restaurant)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order Food</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
