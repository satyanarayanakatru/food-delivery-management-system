import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  X, 
  Utensils, 
  DollarSign, 
  Store, 
  Clock, 
  Flame, 
  AlertCircle, 
  Image as ImageIcon,
  Check,
  PlusCircle,
  Edit3
} from 'lucide-react'
import { MENU_CATEGORIES, PRESET_FOOD_IMAGES } from '../../data/mockMenuData'

const CATEGORY_CHOICES = MENU_CATEGORIES.filter((c) => c !== 'All')

const RESTAURANT_OPTIONS = [
  "Luigi's Artisan Trattoria",
  'Tokyo Craft Ramen & Izakaya',
  'Smokey Bandit Craft BBQ',
  'Taj Royal Palace',
  'La Taqueria del Sol'
]

export default function AddEditFoodModal({
  isOpen,
  onClose,
  onSave,
  foodToEdit = null // if present, editing mode; else adding mode
}) {
  const isEditing = Boolean(foodToEdit)

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
      category: 'Pizzas',
      restaurantName: RESTAURANT_OPTIONS[0],
      price: '',
      isVeg: true,
      description: '',
      image: PRESET_FOOD_IMAGES[0].url,
      prepTime: '15-20 mins',
      calories: '450 kcal',
      spicyLevel: 'Medium',
      isAvailable: true,
      tags: ''
    }
  })

  const currentImageUrl = watch('image')
  const currentIsVeg = watch('isVeg')

  useEffect(() => {
    if (foodToEdit) {
      setValue('name', foodToEdit.name)
      setValue('category', foodToEdit.category)
      setValue('restaurantName', foodToEdit.restaurantName)
      setValue('price', foodToEdit.price)
      setValue('isVeg', Boolean(foodToEdit.isVeg))
      setValue('description', foodToEdit.description)
      setValue('image', foodToEdit.image)
      setValue('prepTime', foodToEdit.prepTime || '15-20 mins')
      setValue('calories', foodToEdit.calories || '450 kcal')
      setValue('spicyLevel', foodToEdit.spicyLevel || 'Medium')
      setValue('isAvailable', foodToEdit.isAvailable !== false)
      setValue('tags', foodToEdit.tags?.join(', ') || '')
    } else {
      reset({
        name: '',
        category: 'Pizzas',
        restaurantName: RESTAURANT_OPTIONS[0],
        price: '',
        isVeg: true,
        description: '',
        image: PRESET_FOOD_IMAGES[0].url,
        prepTime: '15-20 mins',
        calories: '450 kcal',
        spicyLevel: 'Medium',
        isAvailable: true,
        tags: 'Chef Special, Best Seller'
      })
    }
  }, [foodToEdit, setValue, reset, isOpen])

  if (!isOpen) return null

  const onSubmit = (data) => {
    const formattedItem = {
      id: foodToEdit ? foodToEdit.id : `food-custom-${Date.now()}`,
      name: data.name.trim(),
      category: data.category,
      restaurantName: data.restaurantName,
      restaurantId: RESTAURANT_OPTIONS.indexOf(data.restaurantName) + 1 || 1,
      price: parseFloat(data.price),
      isVeg: String(data.isVeg) === 'true' || data.isVeg === true,
      rating: foodToEdit?.rating || 4.8,
      reviewsCount: foodToEdit?.reviewsCount || 1,
      description: data.description.trim(),
      image: data.image.trim() || PRESET_FOOD_IMAGES[0].url,
      prepTime: data.prepTime.trim() || '15-20 mins',
      calories: data.calories.trim() || '450 kcal',
      spicyLevel: data.spicyLevel,
      isAvailable: Boolean(data.isAvailable),
      tags: data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [data.category, 'Fresh']
    }

    onSave(formattedItem, isEditing)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {isEditing ? 'Edit Menu Item' : 'Add New Food Item'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update dish specifications, pricing & availability'
                  : 'Onboard a new gourmet specialty dish to the food catalog'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Dish Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Food Item Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Truffle Burrata Margherita Pizza"
              {...register('name', {
                required: 'Dish name is required',
                minLength: { value: 3, message: 'Minimum 3 characters required' }
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-500/80 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Row 2: Category & Restaurant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Category <span className="text-orange-500">*</span>
              </label>
              <select
                {...register('category', { required: 'Please select category' })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border border-slate-800 text-white focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer"
              >
                {CATEGORY_CHOICES.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Partner Restaurant <span className="text-orange-500">*</span>
              </label>
              <select
                {...register('restaurantName', { required: 'Please select restaurant' })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border border-slate-800 text-white focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer"
              >
                {RESTAURANT_OPTIONS.map((rest, idx) => (
                  <option key={idx} value={rest}>
                    {rest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Price, Prep Time, Calories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Price ($ USD) <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  placeholder="14.99"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0.5, message: 'Price must be at least $0.50' }
                  })}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                    errors.price
                      ? 'border-red-500/80 focus:ring-red-500/20'
                      : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Prep Time
              </label>
              <input
                type="text"
                placeholder="e.g. 15-20 mins"
                {...register('prepTime')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Calories (approx)
              </label>
              <input
                type="text"
                placeholder="e.g. 520 kcal"
                {...register('calories')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Row 4: Veg/Non-Veg & Spice Level & In Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            {/* Dietary Type */}
            <div>
              <span className="block text-xs font-bold text-slate-300 mb-2">
                Dietary Preference
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    {...register('isVeg')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>🟢 Veg</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-rose-400 font-bold cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    {...register('isVeg')}
                    className="text-rose-500 focus:ring-rose-500"
                  />
                  <span>🔴 Non-Veg</span>
                </label>
              </div>
            </div>

            {/* Spice Level */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Spice Level
              </label>
              <select
                {...register('spicyLevel')}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer"
              >
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Hot">Hot</option>
                <option value="Extra Hot">Extra Hot</option>
              </select>
            </div>

            {/* In Stock Toggle */}
            <div className="flex flex-col justify-center">
              <span className="block text-xs font-bold text-slate-300 mb-1.5">
                Availability Status
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('isAvailable')}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-700 bg-slate-800"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Item is In-Stock
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Description & Key Ingredients <span className="text-orange-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Detail the recipe, fresh ingredients, marinades and flavor profile..."
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 10, message: 'Minimum 10 characters required' }
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                errors.description
                  ? 'border-red-500/80 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Best Seller, Spicy, Wood-Fired, Gluten-Free"
              {...register('tags')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-all"
            />
          </div>

          {/* Image URL & Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Image URL & Quick Preset Picker
            </label>
            <div className="relative mb-3">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                {...register('image', { required: 'Food image URL is required' })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-all"
              />
            </div>

            {/* Presets Grid */}
            <p className="text-[11px] text-slate-400 mb-2">Or choose from photo presets:</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_FOOD_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setValue('image', preset.url, { shouldValidate: true })}
                  className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    currentImageUrl === preset.url
                      ? 'border-orange-500 ring-2 ring-orange-500/30 scale-95'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {currentImageUrl === preset.url && (
                    <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition-all shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {isEditing ? <Edit3 className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Save Changes' : 'Add Food Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
