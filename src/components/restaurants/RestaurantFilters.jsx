import React from 'react'
import { 
  Search, 
  Filter, 
  Star, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  Check,
  RotateCcw
} from 'lucide-react'

export const CUISINE_OPTIONS = [
  'All',
  'Italian',
  'Japanese',
  'American',
  'Indian',
  'Mexican',
  'Thai',
  'Mediterranean',
  'Chinese',
  'Healthy/Salad',
  'Desserts'
]

export default function RestaurantFilters({
  searchTerm,
  setSearchTerm,
  selectedCuisine,
  setSelectedCuisine,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  openOnly,
  setOpenOnly,
  freeDeliveryOnly,
  setFreeDeliveryOnly,
  onResetFilters
}) {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCuisine !== 'All' ||
    minRating > 0 ||
    sortBy !== 'popularity' ||
    openOnly ||
    freeDeliveryOnly

  return (
    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
      {/* Top Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search restaurants, cuisines, address, or signature dishes..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-colors shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort by dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rating filter dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-transparent text-xs text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value={0} className="bg-slate-900">All Ratings</option>
              <option value={4.8} className="bg-slate-900">4.8+ Stars</option>
              <option value={4.5} className="bg-slate-900">4.5+ Stars</option>
              <option value={4.0} className="bg-slate-900">4.0+ Stars</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-orange-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="popularity" className="bg-slate-900">Sort: Popularity</option>
              <option value="rating" className="bg-slate-900">Highest Rated</option>
              <option value="deliveryTime" className="bg-slate-900">Fastest Delivery</option>
              <option value="deliveryFee" className="bg-slate-900">Lowest Delivery Fee</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 rounded-2xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-orange-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Toggles Row (Open Now / Free Delivery) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
        {/* Cuisine Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar flex-1">
          {CUISINE_OPTIONS.map((cuisine) => {
            const isSelected = selectedCuisine === cuisine
            return (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border text-[11px] ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cuisine}
              </button>
            )
          })}
        </div>

        {/* Checkbox Toggles */}
        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-300 font-medium">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-500 border-slate-700 bg-slate-950"
            />
            <span>Open Now</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={freeDeliveryOnly}
              onChange={(e) => setFreeDeliveryOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-500 border-slate-700 bg-slate-950"
            />
            <span>Free Delivery</span>
          </label>
        </div>
      </div>
    </div>
  )
}
