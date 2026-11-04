import React from 'react'
import { useForm } from 'react-hook-form'
import { X, Store, Image, MapPin, Clock, Bike, Phone, Sparkles, AlertCircle, PlusCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { CUISINE_OPTIONS } from './RestaurantFilters'

const PRESET_IMAGES = [
  { label: 'Pizzeria', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
  { label: 'Ramen Bar', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80' },
  { label: 'Smash Burgers', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { label: 'Tacos Grill', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80' },
  { label: 'Bakery Cafe', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' }
]

export default function AddRestaurantModal({ isOpen, onClose, onAddRestaurant }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      cuisine: 'Italian',
      image: PRESET_IMAGES[0].url,
      deliveryTime: '20-30 mins',
      deliveryCharges: 2.99,
      address: '',
      phone: '+1 (555) 012-3456',
      isOpen: true,
      description: ''
    }
  })

  const currentImageUrl = watch('image')

  if (!isOpen) return null

  const onSubmit = (data) => {
    const newRestaurant = {
      id: Date.now(),
      name: data.name.trim(),
      cuisine: data.cuisine,
      image: data.image.trim(),
      rating: 4.8,
      reviewsCount: 1,
      deliveryTime: data.deliveryTime,
      deliveryCharges: parseFloat(data.deliveryCharges) || 0,
      address: data.address.trim(),
      isOpen: Boolean(data.isOpen),
      popularity: 85,
      priceRange: '$$',
      phone: data.phone.trim(),
      openingHours: '11:00 AM - 11:00 PM',
      description: data.description.trim() || 'Newly onboarded gourmet restaurant offering fresh dishes and fast delivery.',
      tags: [data.cuisine, 'Newly Added', data.deliveryCharges == 0 ? 'Free Delivery' : 'Fast Delivery'],
      featuredDishes: [
        {
          name: `${data.name} Chef Special`,
          price: 16.5,
          image: data.image
        }
      ]
    }

    onAddRestaurant(newRestaurant)
    toast.success(`Restaurant "${newRestaurant.name}" added successfully!`, {
      icon: '🏪'
    })
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Add New Restaurant
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Admin Management: Onboard new dining partner to platform
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs" noValidate>
          {/* Restaurant Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Bella Roma Kitchen"
              {...register('name', {
                required: 'Restaurant name is required',
                minLength: { value: 3, message: 'Name must be at least 3 characters' }
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Cuisine & Delivery Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cuisine Type *
              </label>
              <select
                {...register('cuisine', { required: 'Please select a cuisine' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-white focus:outline-hidden focus:border-orange-500 cursor-pointer"
              >
                {CUISINE_OPTIONS.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Delivery Time *
              </label>
              <select
                {...register('deliveryTime')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-white focus:outline-hidden focus:border-orange-500 cursor-pointer"
              >
                <option value="15-25 mins" className="bg-slate-900">15-25 mins (Fast)</option>
                <option value="20-30 mins" className="bg-slate-900">20-30 mins (Standard)</option>
                <option value="30-45 mins" className="bg-slate-900">30-45 mins (Gourmet)</option>
              </select>
            </div>
          </div>

          {/* Delivery Fee & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Delivery Fee ($) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="2.99 (0 for free delivery)"
                {...register('deliveryCharges', {
                  required: 'Delivery fee is required',
                  min: { value: 0, message: 'Fee cannot be negative' }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register('phone')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Restaurant Address *
            </label>
            <input
              type="text"
              placeholder="e.g. 520 Grand Avenue, Downtown Metro"
              {...register('address', { required: 'Restaurant address is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Preset Image Chooser */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Cover Image
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setValue('image', preset.url)}
                  className={`p-1 rounded-xl border text-center transition-all ${
                    currentImageUrl === preset.url
                      ? 'border-orange-500 ring-2 ring-orange-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover rounded-lg mb-1" />
                  <span className="text-[10px] text-slate-400 truncate block">{preset.label}</span>
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste custom image URL"
              {...register('image', { required: 'Image URL is required' })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950/70 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-orange-500"
            />
          </div>

          {/* Open Status Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('isOpen')}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-700 bg-slate-950"
              />
              <span className="text-xs font-semibold text-slate-300">Set as Open for Deliveries Immediately</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Bio
            </label>
            <textarea
              rows={2}
              placeholder="Highlight signature cooking styles, chef specialties, or ingredients..."
              {...register('description')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500"
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Restaurant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
