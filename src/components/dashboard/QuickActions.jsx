import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Store, 
  MenuSquare, 
  CheckCircle2, 
  BellRing, 
  Download, 
  RotateCw, 
  Sparkles, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function QuickActions({ 
  onSimulateOrder, 
  onAdvanceOrder, 
  onRefreshData, 
  isRefreshing,
  stats
}) {
  const navigate = useNavigate()

  const handleExportData = () => {
    toast.success('Live Revenue & Order Summary report exported successfully!', {
      icon: '📊'
    })
  }

  const actions = [
    {
      id: 1,
      title: 'Explore Restaurants',
      desc: `${stats?.totalRestaurants || 20} partner kitchens available now`,
      icon: Store,
      color: 'from-orange-500 to-amber-500',
      action: () => navigate('/restaurants')
    },
    {
      id: 2,
      title: 'Order Food Catalog',
      desc: `${stats?.totalFoodItems || 30} dishes with veg/non-veg filter`,
      icon: MenuSquare,
      color: 'from-emerald-500 to-teal-500',
      action: () => navigate('/menu')
    },
    {
      id: 3,
      title: 'Simulate New Order',
      desc: 'Inject real-time order & increment revenue',
      icon: BellRing,
      color: 'from-blue-500 to-cyan-500',
      action: onSimulateOrder
    },
    {
      id: 4,
      title: 'Mark Order Delivered',
      desc: `${stats?.activeOrders || 0} active orders ready to complete`,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-green-500',
      action: onAdvanceOrder
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
            Instant operations, real-time triggers & navigation shortcuts
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
                <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {act.desc}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 group-hover:text-orange-400 transition-colors pt-2 border-t border-slate-800/60">
                <span>Trigger</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
