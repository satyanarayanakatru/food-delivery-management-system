import React, { useState, useEffect, useMemo } from 'react'
import { 
  Store, 
  Menu, 
  Sparkles, 
  Radio, 
  RotateCw, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle,
  ShoppingBag,
  Shield,
  UtensilsCrossed,
  Trash2
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import Sidebar from '../components/layout/Sidebar'
import RestaurantCard from '../components/restaurants/RestaurantCard'
import RestaurantDetailsModal from '../components/restaurants/RestaurantDetailsModal'
import AddRestaurantModal from '../components/restaurants/AddRestaurantModal'
import RestaurantFilters from '../components/restaurants/RestaurantFilters'
import RestaurantSkeleton from '../components/restaurants/RestaurantSkeleton'
import EmptyState from '../components/common/EmptyState'
import ConfirmModal from '../components/common/ConfirmModal'
import { fetchRestaurants } from '../services/restaurantService'

export default function RestaurantsPage() {
  const { currentUser, isAdmin } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [apiSource, setApiSource] = useState('')
  const [isLiveApi, setIsLiveApi] = useState(false)

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('popularity')
  const [openOnly, setOpenOnly] = useState(false)
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modals
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [restaurantToDelete, setRestaurantToDelete] = useState(null)

  // Fetch initial data
  const loadData = async (showToast = false) => {
    setIsLoading(true)
    setIsError(false)
    try {
      const result = await fetchRestaurants()
      
      // Merge with custom admin added restaurants from localStorage
      let customList = []
      try {
        const saved = localStorage.getItem('foodbite_custom_restaurants')
        if (saved) customList = JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }

      const merged = [...customList, ...result.data]
      setRestaurants(merged)
      setApiSource(result.source)
      setIsLiveApi(result.isLive)

      if (showToast) {
        toast.success(`Synchronized ${merged.length} restaurants from ${result.source}!`, {
          icon: '🏪'
        })
      }
    } catch (err) {
      console.error(err)
      setIsError(true)
      toast.error('Failed to load restaurant data. Please retry.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(false)
  }, [])

  const { addRestaurant: appAddRestaurant, deleteRestaurant: appDeleteRestaurant, addOrder: appAddOrder } = useAppData()

  // Admin: Add New Restaurant
  const handleAddRestaurant = (newRestaurant) => {
    appAddRestaurant(newRestaurant)
    setRestaurants((prev) => [newRestaurant, ...prev])
  }

  // Admin: Request Delete Restaurant (opens ConfirmModal)
  const handleRequestDelete = (id, name) => {
    setRestaurantToDelete({ id, name })
  }

  // Admin: Confirm Delete Restaurant
  const handleConfirmDelete = () => {
    if (!restaurantToDelete) return
    const { id, name } = restaurantToDelete
    appDeleteRestaurant(id)
    setRestaurants((prev) => prev.filter((r) => r.id !== id))
    toast.success(`Restaurant "${name}" has been permanently deleted.`, { icon: '🗑️' })
    setRestaurantToDelete(null)
  }

  // Admin: Toggle Open/Closed
  const handleToggleStatus = (id) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.isOpen
          toast.info(`${r.name} is now marked ${nextState ? 'OPEN' : 'CLOSED'}.`)
          return { ...r, isOpen: nextState }
        }
        return r
      })
    )
  }

  // Customer: Handle Order Placed
  const handleOrderPlaced = (newOrder) => {
    appAddOrder(newOrder)
  }

  // Filtered & Sorted List
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        const matchesCuisine =
          selectedCuisine === 'All' ||
          r.cuisine.toLowerCase() === selectedCuisine.toLowerCase()

        const matchesRating = minRating === 0 || r.rating >= minRating
        const matchesOpen = !openOnly || r.isOpen
        const matchesFreeDelivery = !freeDeliveryOnly || r.deliveryCharges === 0

        const query = searchTerm.toLowerCase().trim()
        const matchesSearch =
          !query ||
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.address.toLowerCase().includes(query) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(query))) ||
          (r.featuredDishes &&
            r.featuredDishes.some((d) => d.name.toLowerCase().includes(query)))

        return matchesCuisine && matchesRating && matchesOpen && matchesFreeDelivery && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'popularity') return (b.popularity || 0) - (a.popularity || 0)
        if (sortBy === 'deliveryTime') {
          const timeA = parseInt(a.deliveryTime) || 20
          const timeB = parseInt(b.deliveryTime) || 20
          return timeA - timeB
        }
        if (sortBy === 'deliveryFee') {
          return a.deliveryCharges - b.deliveryCharges
        }
        return 0
      })
  }, [restaurants, selectedCuisine, minRating, openOnly, freeDeliveryOnly, searchTerm, sortBy])

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCuisine, minRating, sortBy, openOnly, freeDeliveryOnly])

  // Pagination calculation
  const totalItems = filteredRestaurants.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentRestaurants = filteredRestaurants.slice(startIndex, startIndex + itemsPerPage)

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCuisine('All')
    setMinRating(0)
    setSortBy('popularity')
    setOpenOnly(false)
    setFreeDeliveryOnly(false)
  }

  const handleOpenDetails = (restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsDetailsModalOpen(true)
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
                  <span>{isAdmin ? 'Restaurant Management' : 'Discover Restaurants'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isAdmin
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isAdmin ? 'Admin View' : 'Customer View'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {isAdmin
                    ? 'Manage partnered restaurants, delivery status, and onboard new kitchens'
                    : 'Browse gourmet kitchens, check ratings, and place delicious food orders'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Admin Add Restaurant Button */}
              {isAdmin && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Restaurant</span>
                </button>
              )}

              {/* Refresh Button */}
              <button
                onClick={() => loadData(true)}
                disabled={isLoading}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
                title="Refresh API Data"
              >
                <RotateCw className={`w-4 h-4 text-orange-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* User badge */}
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
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    {isAdmin ? 'Restaurant Partner Directory' : 'Hungry? Order From Top Restaurants'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    {isAdmin
                      ? 'Oversee restaurant operations, modify availability, and expand the delivery network.'
                      : 'Choose your favorite cuisine, explore dishes, and place fast delivery orders to your doorstep.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Kitchens</span>
                    <span className="text-lg font-black text-white">{restaurants.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message Box */}
            {isError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <p className="text-xs">
                    Failed to fetch live restaurant records. Click retry to reconnect.
                  </p>
                </div>
                <button
                  onClick={() => loadData(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Filters & Search Component */}
            <RestaurantFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCuisine={selectedCuisine}
              setSelectedCuisine={setSelectedCuisine}
              minRating={minRating}
              setMinRating={setMinRating}
              sortBy={sortBy}
              setSortBy={setSortBy}
              openOnly={openOnly}
              setOpenOnly={setOpenOnly}
              freeDeliveryOnly={freeDeliveryOnly}
              setFreeDeliveryOnly={setFreeDeliveryOnly}
              onResetFilters={handleResetFilters}
            />

            {/* Results Count Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div>
                <span>Showing </span>
                <span className="font-bold text-white">
                  {totalItems > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, totalItems)}
                </span>
                <span> of </span>
                <span className="font-bold text-white">{totalItems} restaurants</span>
                {selectedCuisine !== 'All' && (
                  <span className="text-orange-400 font-semibold"> &bull; {selectedCuisine}</span>
                )}
              </div>

              {openOnly && (
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Open Now Only
                </span>
              )}
            </div>

            {/* Restaurant Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <RestaurantSkeleton key={idx} />
                ))}
              </div>
            ) : currentRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onViewDetails={handleOpenDetails}
                    onDeleteRestaurant={handleRequestDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
                <EmptyState
                  title="No Restaurants Found"
                  description={`No restaurants match "${searchTerm || selectedCuisine}" with the current filters.`}
                  actionLabel="Clear All Filters"
                  onAction={handleResetFilters}
                  icon={Store}
                />
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  Page <span className="font-bold text-white">{currentPage}</span> of{' '}
                  <span className="font-bold text-white">{totalPages}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-slate-300 font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl font-bold transition-all ${
                            currentPage === pageNum
                              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-slate-300 font-bold transition-colors inline-flex items-center gap-1"
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

      {/* Restaurant Details & Order Placement Modal */}
      <RestaurantDetailsModal
        restaurant={selectedRestaurant}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Admin: Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRestaurant={handleAddRestaurant}
      />

      {/* Admin: Confirm Delete Restaurant Modal */}
      <ConfirmModal
        isOpen={Boolean(restaurantToDelete)}
        onClose={() => setRestaurantToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete Restaurant"
        message={`Are you sure you want to permanently delete "${restaurantToDelete?.name}"? All associated menu items and operational listings will be removed.`}
        confirmText="Delete Restaurant"
        cancelText="Cancel"
        icon={Trash2}
        isDanger={true}
      />
    </div>
  )
}
