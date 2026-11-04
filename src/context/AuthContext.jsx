import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/common/ConfirmModal'

const AuthContext = createContext(null)

export const INITIAL_DEMO_USERS = [
  {
    id: 'user-admin-01',
    name: 'Alex Johnson',
    email: 'admin@foodbite.com',
    password: 'Password123!',
    phone: '+1 (555) 019-2834',
    address: 'FoodBite HQ, Metro Tower Suite 400',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-customer-01',
    name: 'Sarah Connor',
    email: 'customer@foodbite.com',
    password: 'Password123!',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'customer',
    createdAt: new Date().toISOString()
  }
]

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  // Current session - default to null if not logged in
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('foodbite_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (e) {
      console.error('Error loading current user from localStorage:', e)
      return null
    }
  })

  // Stored registered users list
  const [users, setUsers] = useState(() => {
    try {
      const storedUsers = localStorage.getItem('foodbite_users')
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers)
        // Ensure initial demo users are present
        const hasAdmin = parsed.some((u) => u.email.toLowerCase() === 'admin@foodbite.com')
        const hasCustomer = parsed.some((u) => u.email.toLowerCase() === 'customer@foodbite.com')
        if (hasAdmin && hasCustomer) {
          return parsed
        }
      }
      localStorage.setItem('foodbite_users', JSON.stringify(INITIAL_DEMO_USERS))
      return INITIAL_DEMO_USERS
    } catch (e) {
      console.error('Error loading users from localStorage:', e)
      return INITIAL_DEMO_USERS
    }
  })

  // Always keep INITIAL_DEMO_USERS synced to localStorage
  useEffect(() => {
    try {
      const merged = [
        ...INITIAL_DEMO_USERS,
        ...users.filter(
          (u) => !INITIAL_DEMO_USERS.some((d) => d.email.toLowerCase() === u.email.toLowerCase())
        )
      ]
      localStorage.setItem('foodbite_users', JSON.stringify(merged))
    } catch (e) {
      console.error('Failed to sync users to localStorage:', e)
    }
  }, [users])

  // Direct Login as Admin
  const loginAsAdmin = () => {
    const adminUser = INITIAL_DEMO_USERS[0]
    const { password: _, ...userSession } = adminUser
    setCurrentUser(userSession)
    localStorage.setItem('foodbite_user', JSON.stringify(userSession))
    toast.success(`Welcome to Admin Portal, ${userSession.name}!`, { icon: '🛡️' })
    return { success: true, user: userSession }
  }

  // Direct Login as Customer
  const loginAsCustomer = () => {
    const customerUser = INITIAL_DEMO_USERS[1]
    const { password: _, ...userSession } = customerUser
    setCurrentUser(userSession)
    localStorage.setItem('foodbite_user', JSON.stringify(userSession))
    toast.success(`Welcome to Customer Food Hub, ${userSession.name}!`, { icon: '🍔' })
    return { success: true, user: userSession }
  }

  // Login handler
  const login = (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase()
    const trimmedPassword = (password || '').trim()

    // 1. Instant match for demo Admin
    if (
      trimmedEmail === 'admin@foodbite.com' ||
      trimmedEmail === 'demo@foodbite.com' ||
      trimmedEmail === 'admin'
    ) {
      if (
        !trimmedPassword ||
        trimmedPassword.toLowerCase() === 'password123!' ||
        trimmedPassword.toLowerCase() === 'password' ||
        trimmedPassword.toLowerCase() === 'admin123' ||
        trimmedPassword.toLowerCase() === 'admin'
      ) {
        return loginAsAdmin()
      }
    }

    // 2. Instant match for demo Customer
    if (trimmedEmail === 'customer@foodbite.com' || trimmedEmail === 'customer') {
      if (
        !trimmedPassword ||
        trimmedPassword.toLowerCase() === 'password123!' ||
        trimmedPassword.toLowerCase() === 'password' ||
        trimmedPassword.toLowerCase() === 'customer123' ||
        trimmedPassword.toLowerCase() === 'customer'
      ) {
        return loginAsCustomer()
      }
    }

    // 3. Search in all available users
    const allAvailableUsers = [
      ...INITIAL_DEMO_USERS,
      ...users.filter(
        (u) => !INITIAL_DEMO_USERS.some((d) => d.email.toLowerCase() === u.email.toLowerCase())
      )
    ]

    const foundUser = allAvailableUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmedEmail &&
        (u.password === trimmedPassword || u.password.toLowerCase() === trimmedPassword.toLowerCase())
    )

    if (foundUser) {
      const { password: _, ...userSession } = foundUser
      setCurrentUser(userSession)
      localStorage.setItem('foodbite_user', JSON.stringify(userSession))
      toast.success(
        `Welcome to ${userSession.role === 'admin' ? 'Admin' : 'Customer'} Portal, ${userSession.name}!`,
        { icon: '✨' }
      )
      return { success: true, user: userSession }
    } else {
      const emailExists = allAvailableUsers.some(
        (u) => u.email.toLowerCase() === trimmedEmail
      )
      if (emailExists) {
        toast.error('Incorrect password. Please verify and try again.')
        return { success: false, message: 'Incorrect password.' }
      } else {
        toast.error('No account found with this email. Please check credentials or sign up.')
        return { success: false, message: 'Account not found.' }
      }
    }
  }

  // Register handler
  const register = (userData) => {
    const trimmedEmail = userData.email.trim().toLowerCase()
    const allAvailableUsers = [
      ...INITIAL_DEMO_USERS,
      ...users.filter(
        (u) => !INITIAL_DEMO_USERS.some((d) => d.email.toLowerCase() === u.email.toLowerCase())
      )
    ]

    const emailExists = allAvailableUsers.some((u) => u.email.toLowerCase() === trimmedEmail)

    if (emailExists) {
      toast.error('An account with this email already exists.')
      return { success: false, message: 'Email already registered.' }
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      password: userData.password,
      phone: userData.phone.trim(),
      address: userData.address?.trim() || '742 Evergreen Terrace, Springfield',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userData.name)}`,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)

    // Auto login
    const { password: _, ...userSession } = newUser
    setCurrentUser(userSession)
    localStorage.setItem('foodbite_user', JSON.stringify(userSession))
    toast.success(`Account created! Welcome, ${newUser.name}!`, { icon: '🚀' })
    return { success: true, user: userSession }
  }

  // Reset password
  const resetPassword = (email, newPassword) => {
    const trimmedEmail = email.trim().toLowerCase()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail)

    if (userIndex === -1 && !INITIAL_DEMO_USERS.some((d) => d.email.toLowerCase() === trimmedEmail)) {
      toast.error('No account found with this email.')
      return { success: false, message: 'Email not found.' }
    }

    const updatedUsers = [...users]
    if (userIndex !== -1) {
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        password: newPassword,
        updatedAt: new Date().toISOString()
      }
      setUsers(updatedUsers)
    }

    toast.success('Password updated! You can now log in.', { icon: '🔒' })
    return { success: true }
  }

  // Open Sign Out Confirmation Box
  const requestLogout = () => {
    setIsLogoutModalOpen(true)
  }

  // Actual Logout handler executed on confirmation
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('foodbite_user')
    setIsLogoutModalOpen(false)
    toast.info('Signed out successfully.')
    navigate('/login')
  }

  // Update profile
  const updateUserProfile = (updatedData) => {
    if (!currentUser) return false
    const updatedSession = { ...currentUser, ...updatedData }
    setCurrentUser(updatedSession)
    localStorage.setItem('foodbite_user', JSON.stringify(updatedSession))

    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === currentUser.id ? { ...u, ...updatedData } : u))
    )
    toast.success('Profile updated successfully!')
    return true
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isCustomer: currentUser?.role === 'customer',
    login,
    loginAsAdmin,
    loginAsCustomer,
    register,
    resetPassword,
    logout,
    requestLogout,
    updateUserProfile,
    demoAdmin: INITIAL_DEMO_USERS[0],
    demoCustomer: INITIAL_DEMO_USERS[1]
  }

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Global Sign Out Confirmation Box */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out of FoodBite Express? Your active session will be securely ended."
        confirmText="Sign Out"
        cancelText="Stay Logged In"
        isDanger={true}
      />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
