import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Menu,
  Plus,
  Trash2,
  Home,
  Briefcase,
  CheckCircle2,
  Shield,
  Bell
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'

const SAMPLE_ADDRESSES = [
  { id: 1, type: 'home', label: 'Home', line: '742 Evergreen Terrace, Springfield, IL 62701', isDefault: true },
  { id: 2, type: 'work', label: 'Work', line: '350 Fifth Ave, Suite 1400, New York, NY 10118', isDefault: false }
]

export default function ProfilePage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [addresses, setAddresses] = useState(SAMPLE_ADDRESSES)
  const [addingAddress, setAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', line: '', type: 'home' })

  const [form, setForm] = useState({
    name: currentUser?.name || 'Sarah Connor',
    email: currentUser?.email || 'customer@foodbite.com',
    phone: currentUser?.phone || '+1 (555) 234-5678',
    bio: 'Food lover & delivery enthusiast. I enjoy trying new cuisines from local restaurants.',
    avatar: currentUser?.avatar || DEFAULT_AVATAR
  })
  const [saved, setSaved] = useState({ ...form })

  const handleSave = () => {
    setSaved({ ...form })
    setEditing(false)
    toast.success('Profile updated successfully!', { icon: '✅' })
  }

  const handleCancel = () => {
    setForm({ ...saved })
    setEditing(false)
  }

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
    toast.info('Address removed.')
  }

  const handleAddAddress = () => {
    if (!newAddress.label.trim() || !newAddress.line.trim()) {
      toast.error('Please fill in both label and address.')
      return
    }
    setAddresses(prev => [...prev, { id: Date.now(), ...newAddress, isDefault: false }])
    setNewAddress({ label: '', line: '', type: 'home' })
    setAddingAddress(false)
    toast.success('Address added!')
  }

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
    toast.success('Default address updated.')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col w-full">
          {/* Top Bar */}
          <header className="bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">My Profile</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Manage your account & preferences</p>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </header>

          {/* Page Body */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">

            {/* Profile Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-slate-800">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-lg">
                    <img
                      src={form.avatar || DEFAULT_AVATAR}
                      alt={form.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = DEFAULT_AVATAR }}
                    />
                  </div>
                  {editing && (
                    <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Name + Email */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white truncate">{saved.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{saved.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                      <Shield className="w-3 h-3" />
                      Verified Customer
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[11px] font-bold">
                      <Bell className="w-3 h-3" />
                      Notifications On
                    </span>
                  </div>
                </div>

                {/* Edit / Save Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {editing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-orange-400 hover:text-white bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
                  { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com' },
                  { key: 'phone', label: 'Mobile Number', icon: Phone, type: 'tel', placeholder: '+1 (555) 000-0000' }
                ].map(({ key, label, icon: Icon, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>
                    <div className="relative">
                      <Icon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={type}
                        disabled={!editing}
                        value={form[key]}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 border transition-colors focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 ${
                          editing
                            ? 'bg-slate-950 border-slate-700 cursor-text'
                            : 'bg-slate-950/40 border-slate-800 cursor-not-allowed opacity-70'
                        }`}
                      />
                    </div>
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Bio</label>
                  <textarea
                    disabled={!editing}
                    value={form.bio}
                    onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 border transition-colors focus:outline-none focus:border-orange-500/60 resize-none ${
                      editing
                        ? 'bg-slate-950 border-slate-700'
                        : 'bg-slate-950/40 border-slate-800 opacity-70 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    Saved Addresses
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
                </div>
                <button
                  onClick={() => setAddingAddress(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500 hover:text-white border border-orange-500/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              </div>

              {/* Address List */}
              <div className="space-y-3">
                {addresses.map(addr => (
                  <div key={addr.id} className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-all ${addr.isDefault ? 'bg-orange-500/5 border-orange-500/30' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                        {addr.type === 'home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{addr.label}</p>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-1.5 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{addr.line}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="Set as default"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Form */}
              {addingAddress && (
                <div className="p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-3">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-wide">New Address</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Label</label>
                      <input
                        value={newAddress.label}
                        onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))}
                        placeholder="e.g. Home, Office"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Type</label>
                      <select
                        value={newAddress.type}
                        onChange={e => setNewAddress(p => ({ ...p, type: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/60"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Full Address</label>
                    <input
                      value={newAddress.line}
                      onChange={e => setNewAddress(p => ({ ...p, line: e.target.value }))}
                      placeholder="Street, City, State, ZIP"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                    >
                      Add Address
                    </button>
                    <button
                      onClick={() => setAddingAddress(false)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  )
}
