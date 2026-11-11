import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Trash2, ShoppingBag } from 'lucide-react'
import ConfirmModal from '../components/common/ConfirmModal'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'foodbite_cart'

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e)
      return []
    }
  })

  // Confirm modal states for destructive cart actions
  const [itemToRemove, setItemToRemove] = useState(null)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)

  // Persist cart changes to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e)
    }
  }, [cartItems])

  // Add item to cart
  const addToCart = (foodItem, quantity = 1) => {
    if (!foodItem) return

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === foodItem.id || item.name === foodItem.name
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        const currentQty = updated[existingIndex].quantity
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(20, currentQty + quantity)
        }
        return updated
      }

      return [
        ...prev,
        {
          id: foodItem.id || `cart-${Date.now()}`,
          name: foodItem.name,
          price: Number(foodItem.price) || 0,
          image: foodItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
          category: foodItem.category || 'Specialty',
          restaurantName: foodItem.restaurantName || 'FoodBite Partner Kitchen',
          isVeg: Boolean(foodItem.isVeg),
          quantity: Math.max(1, Math.min(20, quantity))
        }
      ]
    })

    toast.success(`Added ${quantity}x "${foodItem.name}" to cart!`, {
      icon: '🛒'
    })
  }

  // Update item quantity
  const updateQuantity = (id, delta) => {
    const target = cartItems.find((item) => item.id === id)
    if (!target) return

    const nextQty = target.quantity + delta
    if (nextQty <= 0) {
      // Prompt confirmation before removing item
      setItemToRemove(target)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(20, nextQty) }
          : item
      )
    )
  }

  // Set exact quantity
  const setExactQuantity = (id, qty) => {
    const target = cartItems.find((item) => item.id === id)
    if (!target) return
    if (qty <= 0) {
      setItemToRemove(target)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(20, Math.max(1, qty)) } : item
      )
    )
  }

  // Request removal with ConfirmModal
  const requestRemoveItem = (item) => {
    setItemToRemove(item)
  }

  // Execute removal on confirmation
  const confirmRemoveItem = () => {
    if (!itemToRemove) return
    const removedName = itemToRemove.name
    setCartItems((prev) => prev.filter((item) => item.id !== itemToRemove.id))
    toast.info(`Removed "${removedName}" from cart.`, { icon: '🗑️' })
    setItemToRemove(null)
  }

  // Request clear entire cart with ConfirmModal
  const requestClearCart = () => {
    if (cartItems.length === 0) return
    setIsClearModalOpen(true)
  }

  // Execute clear cart on confirmation
  const confirmClearCart = () => {
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
    toast.info('Your shopping cart has been cleared.', { icon: '🧹' })
    setIsClearModalOpen(false)
  }

  // Silent clear after checkout
  const clearCartDirect = () => {
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  // Price Calculations
  const { cartCount, subtotal, deliveryFee, tax, totalPrice } = useMemo(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const delivery = sub === 0 ? 0 : sub >= 35 ? 0 : 2.99
    const estimatedTax = sub * 0.08
    const total = sub + delivery + estimatedTax

    return {
      cartCount: count,
      subtotal: sub,
      deliveryFee: delivery,
      tax: estimatedTax,
      totalPrice: total
    }
  }, [cartItems])

  const value = {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    tax,
    totalPrice,
    addToCart,
    updateQuantity,
    setExactQuantity,
    requestRemoveItem,
    requestClearCart,
    clearCartDirect
  }

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Confirm Remove Single Item Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToRemove)}
        onClose={() => setItemToRemove(null)}
        onConfirm={confirmRemoveItem}
        title="Remove Item from Cart"
        message={`Are you sure you want to remove "${itemToRemove?.name}" from your shopping cart?`}
        confirmText="Remove Item"
        cancelText="Keep Item"
        icon={Trash2}
        isDanger={true}
      />

      {/* Confirm Clear Entire Cart Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmClearCart}
        title="Clear Entire Shopping Cart"
        message={`Are you sure you want to remove all ${cartCount} item(s) from your cart? This action cannot be undone.`}
        confirmText="Clear Cart"
        cancelText="Cancel"
        icon={Trash2}
        isDanger={true}
      />
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
