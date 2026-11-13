import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  ArrowUpDown, 
  ShoppingBag, 
  Clock, 
  Bike, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react'
import { TableRowSkeleton } from '../common/SkeletonLoader'
import EmptyState from '../common/EmptyState'

export default function RecentOrdersTable({ orders, isLoading, onViewOrder }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('newest') // newest, amount-high, amount-low

  const statusOptions = ['All', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

  // Normalize order to handle both schema formats (mock data & checkout-generated)
  const normalizeOrder = (o) => ({
    ...o,
    orderStatus: o.orderStatus || o.status || 'Preparing',
    totalAmount: o.totalAmount ?? o.total ?? 0,
    estimatedDelivery: o.estimatedDelivery || o.eta || 'N/A',
    customer: {
      name: o.customer?.name || 'Customer',
      email: o.customer?.email || '',
      phone: o.customer?.phone || '',
      avatar: o.customer?.avatar || '/satyanarayana.jpg',
    }
  })

  // Filter and sort logic
  const filteredOrders = useMemo(() => {
    return orders
      .map(normalizeOrder)
      .filter((o) => {
        const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter
        const query = searchTerm.toLowerCase().trim()
        const matchesSearch =
          !query ||
          o.id.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query) ||
          o.restaurant.toLowerCase().includes(query) ||
          o.items.some((it) => it.name.toLowerCase().includes(query))
        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        if (sortOrder === 'amount-high') return b.totalAmount - a.totalAmount
        if (sortOrder === 'amount-low') return a.totalAmount - b.totalAmount
        return 0 // default order in array
      })
  }, [orders, statusFilter, searchTerm, sortOrder])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return {
          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2
        }
      case 'Out for Delivery':
        return {
          color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: Bike
        }
      case 'Preparing':
        return {
          color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: Clock
        }
      case 'Cancelled':
        return {
          color: 'bg-red-500/15 text-red-400 border-red-500/30',
          icon: XCircle
        }
      default:
        return {
          color: 'bg-slate-700 text-slate-300 border-slate-600',
          icon: AlertCircle
        }
    }
  }

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-5">
      {/* Table Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            Recent Dispatch Orders
          </h3>
          <p className="text-xs text-slate-400">
            Realtime feed of customer orders across partnered restaurants
          </p>
        </div>

        {/* Search and Sort controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, customer..."
              className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-colors w-48 sm:w-56"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="py-1.5 px-3 rounded-xl text-xs bg-slate-950/80 border border-slate-800 text-slate-300 focus:outline-hidden focus:border-orange-500 transition-colors cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              statusFilter === status
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Restaurant & Items</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {isLoading ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.orderStatus)
                const Icon = badge.icon
                return (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {order.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{order.customer.name}</p>
                          <p className="text-[10px] text-slate-500">{order.customer.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-200 truncate">{order.restaurant}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {order.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-black text-white text-sm">
                      ${order.totalAmount.toFixed(2)}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}>
                        <Icon className="w-3 h-3" />
                        <span>{order.orderStatus}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-300 border border-slate-700 transition-colors inline-flex items-center gap-1.5 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-8">
                  <EmptyState
                    title="No orders found"
                    description={`No orders matching "${searchTerm || statusFilter}" were found.`}
                    actionLabel="Clear Filters"
                    onAction={() => {
                      setSearchTerm('')
                      setStatusFilter('All')
                    }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
