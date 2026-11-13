import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AppDataProvider } from './context/AppDataContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'

// Auth
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Protected pages
import DashboardPage from './pages/DashboardPage'
import RestaurantsPage from './pages/RestaurantsPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import ProfilePage from './pages/ProfilePage'
import CouponsPaymentPage from './pages/CouponsPaymentPage'
import OrderHistoryPage from './pages/OrderHistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppDataProvider>
          <Routes>
            {/* ── Public / Auth routes ── */}
            <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register"        element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

            {/* ── Protected routes (all 10 modules) ── */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
            <Route path="/menu"       element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
            <Route path="/orders"     element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout"   element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/tracking"   element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
            <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/payments"   element={<ProtectedRoute><CouponsPaymentPage /></ProtectedRoute>} />
            <Route path="/history"    element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

            {/* ── Fallback ── */}
            <Route path="/"  element={<Navigate to="/dashboard" replace />} />
            <Route path="*"  element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppDataProvider>
      </CartProvider>
    </AuthProvider>
  )
}
