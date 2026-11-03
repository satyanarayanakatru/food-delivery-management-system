import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'

export default function ForgotPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword, demoUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const newPasswordValue = watch('newPassword')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const res = resetPassword(data.email, data.newPassword)
      if (res.success) {
        setIsSuccess(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoEmail = () => {
    if (demoUser?.email) {
      setValue('email', demoUser.email, { shouldValidate: true })
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Reset Complete"
        subtitle="Your credentials have been securely updated in Local Storage"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Password Updated!</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Your new password is now active in the system. You can log into your dashboard immediately.
          </p>
          <Link
            to="/login"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
          >
            <span>Proceed to Sign In</span>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your registered email and choose a strong new password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Account Email
            </label>
            <button
              type="button"
              onClick={fillDemoEmail}
              className="text-xs text-orange-400 hover:text-orange-300 hover:underline font-medium"
            >
              Use demo email
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Enter your registered email"
              {...register('email', {
                required: 'Registered email is required',
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

        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
                errors.newPassword
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
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: (value) =>
                  value === newPasswordValue || 'Passwords do not match'
              })}
              className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-slate-950/60 transition-all outline-hidden text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 ${
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white text-sm font-bold transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 pt-5 border-t border-slate-800 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
