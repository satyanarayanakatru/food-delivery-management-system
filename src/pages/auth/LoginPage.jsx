import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, Shield, ShoppingBag, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState('admin') // 'admin' or 'customer'
  const { login, loginAsAdmin, loginAsCustomer, demoAdmin, demoCustomer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: demoAdmin.email,
      password: demoAdmin.password,
      rememberMe: true
    }
  })

  // Pre-fill on role change
  useEffect(() => {
    if (selectedRole === 'admin') {
      setValue('email', demoAdmin.email, { shouldValidate: true, shouldDirty: true })
      setValue('password', demoAdmin.password, { shouldValidate: true, shouldDirty: true })
    } else {
      setValue('email', demoCustomer.email, { shouldValidate: true, shouldDirty: true })
      setValue('password', demoCustomer.password, { shouldValidate: true, shouldDirty: true })
    }
  }, [selectedRole, setValue, demoAdmin, demoCustomer])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const targetEmail = data.email || (selectedRole === 'admin' ? demoAdmin.email : demoCustomer.email)
      const targetPassword = data.password || (selectedRole === 'admin' ? demoAdmin.password : demoCustomer.password)

      const res = login(targetEmail, targetPassword)
      if (res?.success) {
        navigate('/dashboard', { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectRole = (role) => {
    setSelectedRole(role)
    if (role === 'admin') {
      setValue('email', demoAdmin.email, { shouldValidate: true })
      setValue('password', demoAdmin.password, { shouldValidate: true })
    } else {
      setValue('email', demoCustomer.email, { shouldValidate: true })
      setValue('password', demoCustomer.password, { shouldValidate: true })
    }
  }

  const handleDirectAdminLogin = () => {
    const res = loginAsAdmin()
    if (res?.success) {
      navigate('/dashboard', { replace: true })
    }
  }

  const handleDirectCustomerLogin = () => {
    const res = loginAsCustomer()
    if (res?.success) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <AuthLayout
      title="Portal Sign In"
      subtitle="Select Admin or Customer portal to sign in"
    >
      {/* Dual Portal Switcher Tabs */}
      <div className="mb-5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 flex gap-1">
        <button
          type="button"
          onClick={() => handleSelectRole('admin')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedRole === 'admin'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectRole('customer')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedRole === 'customer'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Customer Portal</span>
        </button>
      </div>

      {/* Role Credentials Info Pill */}
      <div className="mb-5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Sign In As
          </span>
          <p className="font-bold text-white text-xs mt-0.5">
            {selectedRole === 'admin' ? demoAdmin.name : demoCustomer.name}
          </p>
          <p className="text-[11px] text-orange-400 font-mono">
            {selectedRole === 'admin' ? demoAdmin.email : demoCustomer.email}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
            selectedRole === 'admin'
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {selectedRole}
        </span>
      </div>

      {/* 1-Click Quick Demo Sign In Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          type="button"
          onClick={handleDirectAdminLogin}
          className="py-2.5 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span>Fast Admin Sign In</span>
        </button>
        <button
          type="button"
          onClick={handleDirectCustomerLogin}
          className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fast Customer Sign In</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              autoComplete="email"
              placeholder={selectedRole === 'admin' ? 'admin@foodbite.com' : 'customer@foodbite.com'}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address'
                }
              })}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
                errors.email
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
                errors.password
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-hidden"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-700 bg-slate-800"
            />
            <span className="text-xs text-slate-400 select-none">Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-2 py-3 px-4 rounded-xl text-white text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] cursor-pointer ${
            selectedRole === 'admin'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25'
          }`}
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Enter {selectedRole === 'admin' ? 'Admin' : 'Customer'} Portal</span>
            </>
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-6 pt-5 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Need a new account?{' '}
          <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
