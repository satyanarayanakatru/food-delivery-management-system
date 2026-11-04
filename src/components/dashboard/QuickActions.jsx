import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Store, 
  MenuSquare, 
  PlusCircle, 
  BellRing, 
  Download, 
  RotateCw, 
  Sparkles, 
  ArrowRight
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function QuickActions({ onSimulateOrder, onRefreshData, isRefreshing }) {
  const navigate = useNavigate()

  const handleExportData = () => {
    toast.success('Financial Revenue Summary (CSV/PDF) generated successfully!', {
      icon: '📊'
    })
  }

  const handleNavigateModule = (moduleName) => {
    toast.info(`${moduleName} will be activated in the next step!`, {
      icon: '🚀'
    })
  }

  const actions = [
    {
      id: 1,
      title: 'Explore Restaurants',
      desc: 'Browse partner restaurants, cuisines & ratings',
      icon: Store,
      color: 'from-orange-500 to-amber-500',
      action: () => navigate('/restaurants')
    },
    {
      id: 2,
      title: 'Manage Food Catalog',
      desc: '284 Curated dishes, categories & dietary filters',
      icon: MenuSquare,
      color: 'from-emerald-500 to-teal-500',
      action: () => navigate('/menu')
    },
    {
      id: 3,
      title: 'Simulate Customer Order',
      desc: 'Simulate an incoming customer order alert',
      icon: BellRing,
      color: 'from-blue-500 to-cyan-500',
      action: onSimulateOrder
    },
    {
      id: 4,
      title: 'Export Financial Report',
      desc: 'Download CSV / PDF summary of revenue & orders',
      icon: Download,
      color: 'from-purple-500 to-pink-500',
      action: handleExportData
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            Quick Action Cards
          </h3>
          <p className="text-xs text-slate-400">
            Instant operations, platform triggers & quick shortcuts
          </p>
        </div>

        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <button
              key={act.id}
              onClick={act.action}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 text-left transition-all duration-200 group hover:-translate-y-0.5 shadow-lg shadow-black/20 backdrop-blur-md relative overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-orange-400 group-hover:text-orange-300">
                <span>Launch action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
