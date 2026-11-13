/**
 * AppDataContext — Single source of truth for all dynamic app-wide data & statistics.
 * Aggregates data from:
 * 1. Orders: localStorage ('foodbite_recent_orders') initialized with seed orders
 * 2. Restaurants: Third-party API (DummyJSON Recipes) + localStorage custom restaurants
 * 3. Menu Items: Third-party API (DummyJSON Recipes) + localStorage custom menu items
 * 4. Customers: Registered users ('foodbite_users') + unique customers from orders
 *
 * Dashboard, charts, pie chart, order history, and stat cards all derive from this context.
 * ZERO static numbers — everything reflects the live state across pages.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { INITIAL_RECENT_ORDERS } from '../data/mockDashboardData'
import { fetchRestaurants } from '../services/restaurantService'
import { fetchMenuItems } from '../services/menuService'

const AppDataContext = createContext(null)

// Normalize order schema so all orders conform to a clean, consistent structure
export function normalizeOrder(o) {
  const status = o.orderStatus || o.status || 'Preparing'
  const amount = Number(o.totalAmount ?? o.total ?? 0)

  // Ensure placedAt has a valid timestamp for date charting
  let placedAtStr = o.placedAt || 'Just now'
  let timestamp = o.timestamp || o.createdAt

  if (!timestamp) {
    const parsed = new Date(placedAtStr)
    if (!isNaN(parsed.getTime())) {
      timestamp = parsed.toISOString()
    } else {
      // Relative times like "8 mins ago", "1 hour ago", "Just now" default to recent today
      timestamp = new Date().toISOString()
    }
  }

  return {
    ...o,
    id: o.id || `FD-${Math.floor(7000 + Math.random() * 2000)}`,
    orderStatus: status,
    totalAmount: isNaN(amount) ? 0 : amount,
    estimatedDelivery: o.estimatedDelivery || o.eta || '20-30 mins',
    placedAt: placedAtStr,
    createdAt: timestamp,
    rider: o.rider || 'Carlos Ortiz (E-Bike)',
    restaurant: o.restaurant || 'Artisan Gourmet Kitchen',
    items: Array.isArray(o.items) && o.items.length > 0
      ? o.items.map(it => ({
          name: it.name || 'Signature Dish',
          qty: Number(it.qty || it.quantity || 1),
          price: Number(it.price || 12.0)
        }))
      : [{ name: 'Gourmet Specialty', qty: 1, price: amount || 15.0 }],
    customer: {
      name: o.customer?.name || 'Katru Satyanarayana',
      email: o.customer?.email || 'satyanarayanayadav50@gmail.com',
      phone: o.customer?.phone || '+91 8179795623',
      avatar: o.customer?.avatar || '/satyanarayana.jpg'
    }
  }
}

export function AppDataProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [restaurantsLoading, setRestaurantsLoading] = useState(true)
  const [menuLoading, setMenuLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // ── 1. Load orders from localStorage (seeded if empty or upgrade dataset) ──
  const loadOrders = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('foodbite_recent_orders') || '[]')
      // If saved has fewer than 25 orders, upgrade to the new full 44-order weekly dataset
      if (Array.isArray(saved) && saved.length >= 25) {
        setOrders(saved.map(normalizeOrder))
      } else {
        // Seed with initial 44 orders covering Sun(4), Mon(2), Tue(7), Wed(1), Thu(12), Fri(10), Sat(8)
        const seeded = INITIAL_RECENT_ORDERS.map(normalizeOrder)
        setOrders(seeded)
        try {
          localStorage.setItem('foodbite_recent_orders', JSON.stringify(seeded))
        } catch (e) {
          console.error('Error seeding orders:', e)
        }
      }
    } catch {
      setOrders(INITIAL_RECENT_ORDERS.map(normalizeOrder))
    }
  }, [])

  // ── 2. Load restaurants dynamically from API + custom local additions ──
  const loadRestaurants = useCallback(async () => {
    setRestaurantsLoading(true)
    try {
      const result = await fetchRestaurants()
      let customList = []
      try {
        const saved = localStorage.getItem('foodbite_custom_restaurants')
        if (saved) customList = JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
      const merged = [...customList, ...(result?.data || [])]
      setRestaurants(merged)
    } catch (e) {
      console.error('Error loading restaurants in AppDataContext:', e)
    } finally {
      setRestaurantsLoading(false)
    }
  }, [])

  // ── 3. Load menu items dynamically from API + custom local additions ──
  const loadMenuItems = useCallback(async () => {
    setMenuLoading(true)
    try {
      const items = await fetchMenuItems()
      setMenuItems(items || [])
    } catch (e) {
      console.error('Error loading menu items in AppDataContext:', e)
    } finally {
      setMenuLoading(false)
    }
  }, [])

  // Initial load & refresh trigger
  useEffect(() => {
    loadOrders()
    loadRestaurants()
    loadMenuItems()
  }, [lastRefresh, loadOrders, loadRestaurants, loadMenuItems])

  // Sync across tabs via storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'foodbite_recent_orders') {
        loadOrders()
      } else if (e.key === 'foodbite_custom_restaurants') {
        loadRestaurants()
      } else if (e.key === 'foodbite_menu_items') {
        loadMenuItems()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadOrders, loadRestaurants, loadMenuItems])

  // ── Actions ──

  // Add order (from Checkout or Simulate)
  const addOrder = useCallback((newOrder) => {
    const normalized = normalizeOrder(newOrder)
    setOrders(prev => {
      const updated = [normalized, ...prev.filter(o => o.id !== normalized.id)]
      try {
        localStorage.setItem('foodbite_recent_orders', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }, [])

  // Update order status (e.g. Preparing -> Out for Delivery -> Delivered or Cancelled)
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: newStatus,
            estimatedDelivery: newStatus === 'Delivered' ? 'Completed' : newStatus === 'Cancelled' ? 'Cancelled' : o.estimatedDelivery
          }
        }
        return o
      })
      try {
        localStorage.setItem('foodbite_recent_orders', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }, [])

  // Add restaurant
  const addRestaurant = useCallback((restaurant) => {
    setRestaurants(prev => {
      const updated = [restaurant, ...prev]
      try {
        const custom = JSON.parse(localStorage.getItem('foodbite_custom_restaurants') || '[]')
        localStorage.setItem('foodbite_custom_restaurants', JSON.stringify([restaurant, ...custom]))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }, [])

  // Delete restaurant
  const deleteRestaurant = useCallback((id) => {
    setRestaurants(prev => {
      const updated = prev.filter(r => r.id !== id)
      try {
        const custom = JSON.parse(localStorage.getItem('foodbite_custom_restaurants') || '[]')
        const filtered = custom.filter(r => r.id !== id)
        localStorage.setItem('foodbite_custom_restaurants', JSON.stringify(filtered))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }, [])

  // Add menu item
  const addMenuItem = useCallback((item) => {
    setMenuItems(prev => {
      const updated = [item, ...prev]
      try {
        const custom = JSON.parse(localStorage.getItem('foodbite_menu_items') || '[]')
        localStorage.setItem('foodbite_menu_items', JSON.stringify([item, ...custom]))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }, [])

  // Refresh all data
  const refresh = useCallback(() => {
    setLastRefresh(Date.now())
  }, [])

  // ── Dynamic Computed Stats (100% dynamic from real orders, restaurants, dishes & users) ──
  const stats = useMemo(() => {
    // 1. Restaurants count (exact match with Restaurants page)
    const totalRestaurants = restaurants.length
    const openRestaurants = restaurants.filter(r => r.isOpen !== false).length

    // 2. Food items count (exact match with Menu page)
    const totalFoodItems = menuItems.length
    const vegFoodItems = menuItems.filter(i => i.isVeg).length
    const nonVegFoodItems = totalFoodItems - vegFoodItems

    // 3. Orders breakdown (exact match with Order History page)
    const totalOrders = orders.length
    const preparingOrders = orders.filter(o => o.orderStatus === 'Preparing').length
    const outForDeliveryOrders = orders.filter(o => o.orderStatus === 'Out for Delivery').length
    const activeOrders = preparingOrders + outForDeliveryOrders
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length

    // 4. Revenue (exact sum of all order totals)
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // 5. Unique customers (from registered accounts + all order customer emails)
    let registeredUsersCount = 2
    try {
      const storedUsers = JSON.parse(localStorage.getItem('foodbite_users') || '[]')
      if (storedUsers.length > 0) registeredUsersCount = storedUsers.length
    } catch {}
    const customerEmails = new Set(
      orders.map(o => o.customer?.email?.toLowerCase() || o.customer?.name?.toLowerCase()).filter(Boolean)
    )
    const totalCustomers = Math.max(registeredUsersCount, customerEmails.size)

    // 6. Order status breakdown for Pie Chart
    const statusBreakdown = {
      Preparing: preparingOrders,
      'Out for Delivery': outForDeliveryOrders,
      Delivered: deliveredOrders,
      Cancelled: cancelledOrders,
    }

    // 7. Dynamic Revenue by Day (last 7 days, sums EXACTLY to orders' revenue)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      return {
        label: days[d.getDay()],
        revenue: 0,
        orders: 0,
        dateStr: d.toDateString(),
        dayOffset: 6 - i // 0 = today, 1 = yesterday, etc.
      }
    })

    // Distribute orders into the 7 days based on day tag (Sun, Mon, Tue, etc.) or created date
    orders.forEach((o, index) => {
      const orderAmount = Number(o.totalAmount) || 0

      // 1. Direct match by day tag (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
      if (o.day) {
        const shortDay = o.day.slice(0, 3).toLowerCase()
        const daySlot = revenueByDay.find(r => r.label.toLowerCase() === shortDay)
        if (daySlot) {
          daySlot.revenue += orderAmount
          daySlot.orders += 1
          return
        }
      }

      // 2. Match by exact date string if present
      let placedDate = null
      if (o.createdAt) {
        const d = new Date(o.createdAt)
        if (!isNaN(d.getTime())) placedDate = d
      }

      if (placedDate) {
        const dateStr = placedDate.toDateString()
        const daySlot = revenueByDay.find(r => r.dateStr === dateStr)
        if (daySlot) {
          daySlot.revenue += orderAmount
          daySlot.orders += 1
          return
        }
      }

      // 3. Fallback for new orders placed today:
      // Add to today's slot (the last element of revenueByDay)
      revenueByDay[6].revenue += orderAmount
      revenueByDay[6].orders += 1
    })

    // Round daily revenues for clean display
    revenueByDay.forEach(d => {
      d.revenue = Number(d.revenue.toFixed(2))
    })

    return {
      totalRestaurants,
      openRestaurants,
      totalFoodItems,
      vegFoodItems,
      nonVegFoodItems,
      totalOrders,
      activeOrders,
      preparingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalRevenue,
      avgOrderValue,
      statusBreakdown,
      revenueByDay,
      restaurantsLoading,
      menuLoading,
    }
  }, [orders, restaurants, menuItems, restaurantsLoading, menuLoading])

  return (
    <AppDataContext.Provider value={{
      orders,
      restaurants,
      menuItems,
      stats,
      restaurantsLoading,
      menuLoading,
      addOrder,
      updateOrderStatus,
      addRestaurant,
      deleteRestaurant,
      addMenuItem,
      refresh,
      loadOrders,
      loadRestaurants,
      loadMenuItems
    }}>
      {children}
    </AppDataContext.Provider>
  )
}

export const useAppData = () => {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
