import React from 'react'
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  Check, 
  Store,
  Sparkles,
  RotateCcw
} from 'lucide-react'
import { MENU_CATEGORIES } from '../../data/mockMenuData'

export default function FoodFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  dietaryFilter, // 'all' | 'veg' | 'non-veg'
  setDietaryFilter,
  selectedRestaurant,
  setSelectedRestaurant,
  availableRestaurants = [],
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  onReset
}) {
  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'All' ||
    dietaryFilter !== 'all' ||
    selectedRestaurant !== 'All' ||
    inStockOnly ||
    sortBy !== 'popular'

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-5">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food by name, description, ingredients..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl text-xs sm:text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dietary (Veg / Non-Veg) Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setDietaryFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dietaryFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            All Dishes
          </button>

          <button
            type="button"
            onClick={() => setDietaryFilter('veg')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
            <span>Pure Veg</span>
          </button>

          <button
            type="button"
            onClick={() => setDietaryFilter('non-veg')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              dietaryFilter === 'non-veg'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-300"></span>
            <span>Non-Veg</span>
          </button>
        </div>

        {/* Controls: Restaurant, Sort, In-Stock */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Restaurant Selector */}
          <div className="relative">
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2.5 rounded-xl text-xs font-semibold bg-slate-950/80 border border-slate-800 text-slate-200 hover:border-slate-700 focus:outline-hidden focus:border-orange-500 transition-colors cursor-pointer"
            >
              <option value="All">All Partner Kitchens</option>
              {availableRestaurants.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Store className="w-3.5 h-3.5 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2.5 rounded-xl text-xs font-semibold bg-slate-950/80 border border-slate-800 text-slate-200 hover:border-slate-700 focus:outline-hidden focus:border-orange-500 transition-colors cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* In Stock Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 cursor-pointer select-none hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-500 border-slate-700 bg-slate-900"
            />
            <span>In Stock Only</span>
          </label>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pb-1">
          {MENU_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
