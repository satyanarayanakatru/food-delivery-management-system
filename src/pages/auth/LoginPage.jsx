import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, demoUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const res = login(data.email, data.password)
      if (res.success) {
        const destination = location.state?.from?.pathname || '/dashboard'
        navigate(destination, { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAutofillDemo = () => {
    setValue('email', demoUser.email, { shouldValidate: true })
    setValue('password', demoUser.password, { shouldValidate: true })
  }

  return (
    <AuthLayout
      title="Portal Sign In"
      subtitle="Enter your account credentials to access FoodBite Express"
    >
      {/* Single Demo Account Autofill Card */}
      <div className="mb-6 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
        <div className="text-xs">
          <div className="flex items-center gap-1.5 text-orange-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Portal Account</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            demo@foodbite.com &bull; Password123!
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutofillDemo}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 shrink-0"
        >
          Auto Fill
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
              placeholder="e.g. demo@foodbite.com"
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
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white text-sm font-bold transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
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
