import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext(null)

const INITIAL_DEMO_USER = {
  id: 'user-foodbite-01',
  name: 'Alex Johnson',
  email: 'demo@foodbite.com',
  password: 'Password123!',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Portal Member',
  createdAt: new Date().toISOString()
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('foodbite_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (e) {
      console.error('Error loading current user from localStorage:', e)
      return null
    }
  })

  const [users, setUsers] = useState(() => {
    try {
      const storedUsers = localStorage.getItem('foodbite_users')
      if (storedUsers) {
        return JSON.parse(storedUsers)
      }
      localStorage.setItem('foodbite_users', JSON.stringify([INITIAL_DEMO_USER]))
      return [INITIAL_DEMO_USER]
    } catch (e) {
      console.error('Error loading users from localStorage:', e)
      return [INITIAL_DEMO_USER]
    }
  })

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foodbite_users', JSON.stringify(users))
    } catch (e) {
      console.error('Failed to sync users to localStorage:', e)
    }
  }, [users])

  // Login handler
  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    )

    if (foundUser) {
      const { password: _, ...userSession } = foundUser
      setCurrentUser(userSession)
      localStorage.setItem('foodbite_user', JSON.stringify(userSession))
      toast.success(`Welcome back, ${userSession.name}!`, { icon: '✨' })
      return { success: true }
    } else {
      const emailExists = users.some((u) => u.email.toLowerCase() === trimmedEmail)
      if (emailExists) {
        toast.error('Incorrect password. Please verify and try again.')
        return { success: false, message: 'Incorrect password.' }
      } else {
        toast.error('No account found with this email. Please sign up.')
        return { success: false, message: 'Account not found.' }
      }
    }
  }

  // Register handler
  const register = (userData) => {
    const trimmedEmail = userData.email.trim().toLowerCase()
    const emailExists = users.some((u) => u.email.toLowerCase() === trimmedEmail)

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
      role: 'Portal Member',
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)

    // Auto login
    const { password: _, ...userSession } = newUser
    setCurrentUser(userSession)
    localStorage.setItem('foodbite_user', JSON.stringify(userSession))
    toast.success(`Account created! Welcome, ${newUser.name}!`, { icon: '🚀' })
    return { success: true }
  }

  // Reset password
  const resetPassword = (email, newPassword) => {
    const trimmedEmail = email.trim().toLowerCase()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail)

    if (userIndex === -1) {
      toast.error('No account found with this email.')
      return { success: false, message: 'Email not found.' }
    }

    const updatedUsers = [...users]
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword,
      updatedAt: new Date().toISOString()
    }

    setUsers(updatedUsers)
    toast.success('Password updated! You can now log in.', { icon: '🔒' })
    return { success: true }
  }

  // Logout
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('foodbite_user')
    toast.info('Signed out successfully.')
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
    login,
    register,
    resetPassword,
    logout,
    updateUserProfile,
    demoUser: INITIAL_DEMO_USER
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
