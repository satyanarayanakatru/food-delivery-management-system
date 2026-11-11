import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  MenuSquare, 
  Menu, 
  PlusCircle, 
  RotateCw, 
  Sparkles, 
  UtensilsCrossed, 
  ChevronLeft, 
  ChevronRight, 
  Store,
  Flame,
  CheckCircle2,
  Trash2,
  Leaf,
  Beef,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Sidebar from '../components/layout/Sidebar'
import FoodCard from '../components/menu/FoodCard'
import FoodFilters from '../components/menu/FoodFilters'
import FoodDetailsModal from '../components/menu/FoodDetailsModal'
import AddEditFoodModal from '../components/menu/AddEditFoodModal'
import ConfirmModal from '../components/common/ConfirmModal'
import EmptyState from '../components/common/EmptyState'
import { fetchMenuItems } from '../services/menuService'

export default function MenuPage() {
  const { currentUser, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [foodItems, setFoodItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [dietaryFilter, setDietaryFilter] = useState('all') // 'all' | 'veg' | 'non-veg'
  const [selectedRestaurant, setSelectedRestaurant] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modals
  const [selectedFood, setSelectedFood] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [foodToEdit, setFoodToEdit] = useState(null)
  const [foodToDelete, setFoodToDelete] = useState(null)

  // Initial Data Load
  const loadMenuData = async (showToast = false) => {
    setIsLoading(true)
    try {
      const items = await fetchMenuItems()
      setFoodItems(items)
      if (showToast) {
        toast.success(`Synchronized ${items.length} menu items!`, { icon: '🍽️' })
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load menu items.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMenuData(false)
  }, [])

  // Available partner restaurants extracted from loaded items
  const availableRestaurants = useMemo(() => {
    const list = new Set()
    foodItems.forEach((item) => {
      if (item.restaurantName) list.add(item.restaurantName)
    })
    return Array.from(list)
  }, [foodItems])

  // Filtered & Sorted items
  const filteredFoodItems = useMemo(() => {
    return foodItems
      .filter((item) => {
        // Search term
        const query = searchTerm.toLowerCase().trim()
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.restaurantName && item.restaurantName.toLowerCase().includes(query)) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory

        // Dietary (Veg / Non-Veg)
        const matchesDietary =
          dietaryFilter === 'all' ||
          (dietaryFilter === 'veg' && item.isVeg) ||
          (dietaryFilter === 'non-veg' && !item.isVeg)

        // Restaurant
        const matchesRestaurant =
          selectedRestaurant === 'All' || item.restaurantName === selectedRestaurant

        // In Stock
        const matchesStock = !inStockOnly || item.isAvailable

        return (
          matchesSearch &&
          matchesCategory &&
          matchesDietary &&
          matchesRestaurant &&
          matchesStock
        )
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        return (b.reviewsCount || 0) - (a.reviewsCount || 0) // default popular
      })
  }, [
    foodItems,
    searchTerm,
    selectedCategory,
    dietaryFilter,
    selectedRestaurant,
    inStockOnly,
    sortBy
  ])

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, dietaryFilter, selectedRestaurant, inStockOnly, sortBy])

  // Pagination slice
  const totalItems = filteredFoodItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentDishes = filteredFoodItems.slice(startIndex, startIndex + itemsPerPage)

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setDietaryFilter('all')
    setSelectedRestaurant('All')
    setSortBy('popular')
    setInStockOnly(false)
  }

  // Admin: Save or Update Food Item
  const handleSaveFood = (foodData, isEditing) => {
    let updatedList = []
    if (isEditing) {
      updatedList = foodItems.map((item) => (item.id === foodData.id ? foodData : item))
      toast.success(`"${foodData.name}" updated successfully!`, { icon: '✏️' })
    } else {
      updatedList = [foodData, ...foodItems]
      toast.success(`"${foodData.name}" added to menu catalog!`, { icon: '🍕' })
    }

    setFoodItems(updatedList)

    // Save custom modifications to localStorage
    try {
      localStorage.setItem('foodbite_menu_items', JSON.stringify(updatedList))
    } catch (e) {
      console.error(e)
    }
  }

  // Admin: Toggle Availability
  const handleToggleAvailability = (id, name, currentStatus) => {
    const nextStatus = !currentStatus
    const updatedList = foodItems.map((item) =>
      item.id === id ? { ...item, isAvailable: nextStatus } : item
    )
    setFoodItems(updatedList)

    try {
      localStorage.setItem('foodbite_menu_items', JSON.stringify(updatedList))
    } catch (e) {
      console.error(e)
    }

    toast.info(
      `"${name}" marked ${nextStatus ? 'IN STOCK' : 'OUT OF STOCK'}.`,
      { icon: nextStatus ? '🟢' : '🔴' }
    )
  }

  // Admin: Request Delete Food (Opens ConfirmModal)
  const handleRequestDeleteFood = (id, name) => {
    setFoodToDelete({ id, name })
  }

  // Admin: Confirm Delete Execution
  const handleConfirmDeleteFood = () => {
    if (!foodToDelete) return
    const { id, name } = foodToDelete

    const updatedList = foodItems.filter((item) => item.id !== id)
    setFoodItems(updatedList)

    try {
      localStorage.setItem('foodbite_menu_items', JSON.stringify(updatedList))
    } catch (e) {
      console.error(e)
    }

    toast.success(`"${name}" permanently removed from menu catalog.`, { icon: '🗑️' })
    setFoodToDelete(null)
  }

  // Open Details Modal
  const handleOpenDetails = (food) => {
    setSelectedFood(food)
    setIsDetailsModalOpen(true)
  }

  // Admin: Open Edit Modal
  const handleOpenEdit = (food) => {
    setFoodToEdit(food)
    setIsAddEditModalOpen(true)
  }

  // Admin: Open Add Modal
  const handleOpenAdd = () => {
    setFoodToEdit(null)
    setIsAddEditModalOpen(true)
  }

  // Customer: Quick Order Directly from Card
  const handleQuickOrder = (food, qty) => {
    setSelectedFood(food)
    setIsDetailsModalOpen(true)
  }

  // Key Stats for Banner
  const vegCount = foodItems.filter((i) => i.isVeg).length
  const nonVegCount = foodItems.length - vegCount
  const inStockCount = foodItems.filter((i) => i.isAvailable).length

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
                  <span>{isAdmin ? 'Menu Catalog Management' : 'Gourmet Food Catalog'}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      isAdmin
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isAdmin ? 'Admin View' : 'Customer View'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {isAdmin
                    ? 'Oversee dishes, modify prices, control availability, and add new recipes'
                    : 'Discover chef creations, filter by dietary preferences, and order fresh food'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Admin: Add Food Item Action */}
              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Food Item</span>
                </button>
              ) : (
                <Link
                  to="/orders"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>View Cart</span>
                  {cartCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-white text-orange-600 rounded-full text-[10px] font-black">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Refresh Sync */}
              <button
                type="button"
                onClick={() => loadMenuData(true)}
                disabled={isLoading}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                title="Refresh Menu Catalog"
              >
                <RotateCw className={`w-4 h-4 text-orange-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

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
            {/* Header Directory Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    {isAdmin ? 'Master Menu Directory' : 'Explore Cuisines & Signature Dishes'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    {isAdmin
                      ? 'Control catalog listings across all partner kitchens. Update ingredients, adjust pricing, and manage stock readiness.'
                      : 'Handcrafted pizzas, smash burgers, slow-simmered ramen, and royal curries prepared fresh to order.'}
                  </p>
                </div>

                {/* Metric Badges */}
                <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Items</span>
                    <span className="text-base font-black text-white">{foodItems.length}</span>
                  </div>

                  <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Pure Veg</span>
                    <span className="text-base font-black text-emerald-400">{vegCount}</span>
                  </div>

                  <div className="px-3.5 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block">Non-Veg</span>
                    <span className="text-base font-black text-rose-400">{nonVegCount}</span>
                  </div>

                  <div className="px-3.5 py-2 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">In Stock</span>
                    <span className="text-base font-black text-orange-400">{inStockCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <FoodFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              dietaryFilter={dietaryFilter}
              setDietaryFilter={setDietaryFilter}
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
              availableRestaurants={availableRestaurants}
              sortBy={sortBy}
              setSortBy={setSortBy}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onReset={handleResetFilters}
            />

            {/* Results Count & Current Active Filters Summary */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Showing <strong className="text-white">{filteredFoodItems.length > 0 ? startIndex + 1 : 0}</strong> -{' '}
                <strong className="text-white">{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of{' '}
                <strong className="text-white">{totalItems}</strong> dishes
              </span>

              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-orange-400 font-semibold">
                  Category: {selectedCategory}
                </span>
              )}
            </div>

            {/* Food Items Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : currentDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentDishes.map((dish) => (
                  <FoodCard
                    key={dish.id}
                    food={dish}
                    onViewDetails={handleOpenDetails}
                    onEditFood={handleOpenEdit}
                    onDeleteFood={handleRequestDeleteFood}
                    onToggleAvailability={handleToggleAvailability}
                    onQuickOrder={handleQuickOrder}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
                <EmptyState
                  title="No Menu Items Found"
                  description={`No dishes match "${searchTerm || selectedCategory}" with the selected filters.`}
                  actionLabel="Reset All Filters"
                  onAction={handleResetFilters}
                  icon={UtensilsCrossed}
                />
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{currentPage}</strong> of{' '}
                  <strong className="text-white">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-slate-300 font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1
                      const isCurrent = pageNum === currentPage
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-slate-300 font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Food Details Modal */}
      <FoodDetailsModal
        food={selectedFood}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEditFood={handleOpenEdit}
        onToggleAvailability={handleToggleAvailability}
        onDeleteFood={handleRequestDeleteFood}
        onOrderPlaced={() => {
          // optionally handle order placed
        }}
      />

      {/* Admin: Add / Edit Food Modal */}
      <AddEditFoodModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false)
          setFoodToEdit(null)
        }}
        onSave={handleSaveFood}
        foodToEdit={foodToEdit}
      />

      {/* Confirm Delete Food Item Modal */}
      <ConfirmModal
        isOpen={Boolean(foodToDelete)}
        onClose={() => setFoodToDelete(null)}
        onConfirm={handleConfirmDeleteFood}
        title="Confirm Delete Food Item"
        message={`Are you sure you want to permanently delete "${foodToDelete?.name}" from the menu catalog? This action cannot be undone.`}
        confirmText="Delete Food Item"
        cancelText="Cancel"
        icon={Trash2}
        isDanger={true}
      />
    </div>
  )
}
