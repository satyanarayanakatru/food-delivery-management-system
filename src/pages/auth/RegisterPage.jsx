import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: true
    }
  })

  const passwordValue = watch('password')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const res = registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      })

      if (res.success) {
        navigate('/dashboard', { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register your account to access the Food Delivery Management portal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Sarah Connor"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
              className={`w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
                errors.name
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="sarah@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address'
                }
              })}
              className={`w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
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

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,12}$/,
                  message: 'Enter a valid phone number'
                }
              })}
              className={`w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
                errors.phone
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={`w-full pl-10 pr-10 py-2 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
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

          {/* Real-time Dynamic Password Strength Meter */}
          <PasswordStrengthMeter password={passwordValue || ''} />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === passwordValue || 'Passwords do not match'
              })}
              className={`w-full pl-10 pr-10 py-2 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
                errors.confirmPassword
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-hidden"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('terms', {
                required: 'You must agree to continue'
              })}
              className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-700 bg-slate-800"
            />
            <span className="text-[11px] text-slate-400 select-none">
              I agree to FoodBite's <span className="text-orange-400 font-semibold">Terms of Service</span> & <span className="text-orange-400 font-semibold">Privacy Policy</span>.
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.terms.message}
            </p>
          )}
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
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <div className="mt-5 pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
