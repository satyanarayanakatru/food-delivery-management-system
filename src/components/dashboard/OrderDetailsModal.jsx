import React from 'react'
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CreditCard, 
  Bike, 
  Store, 
  Receipt, 
  CheckCircle2, 
  Printer, 
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null

  const handlePrintInvoice = () => {
    toast.success(`Invoice for Order ${order.id} generated! Print preview ready.`, {
      icon: '📄'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      case 'Out for Delivery':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      case 'Preparing':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      case 'Cancelled':
        return 'bg-red-500/15 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Order Details: {order.id}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Placed {order.placedAt} &bull; {order.restaurant}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Order Tracking Progress Mini-Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Dispatch Progress Timeline
            </span>
            <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Placed
              </span>
              <span className={`flex items-center gap-1 ${order.orderStatus !== 'Cancelled' ? 'text-emerald-400' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Kitchen
              </span>
              <span className={`flex items-center gap-1 ${['Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                <Bike className="w-3.5 h-3.5" /> In Transit
              </span>
              <span className={`flex items-center gap-1 ${order.orderStatus === 'Delivered' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{
                  width: order.orderStatus === 'Delivered' ? '100%' : order.orderStatus === 'Out for Delivery' ? '75%' : order.orderStatus === 'Preparing' ? '40%' : '15%'
                }}
              ></div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Customer Details
              </span>
              <div className="space-y-1.5 text-slate-300">
                <p className="font-bold text-white text-sm">{order.customer.name}</p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {order.customer.email}
                </p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {order.customer.phone}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Destination & Rider
              </span>
              <div className="space-y-1.5 text-slate-300">
                <p className="flex items-start gap-1.5 text-white font-medium">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span>{order.customer.address}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <Bike className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rider: {order.rider || 'Standard Courier'}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est: {order.estimatedDelivery}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Ordered Food Items Table */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Food Items Summary
            </span>
            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-medium text-white">{item.name}</td>
                      <td className="py-2.5 px-3 text-center">{item.qty}x</td>
                      <td className="py-2.5 px-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-orange-400">
                        ${(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation breakdown */}
              <div className="bg-slate-950/60 p-3 border-t border-slate-800 space-y-1 text-right">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${(order.totalAmount - 4.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery & Service Fee</span>
                  <span>$4.50</span>
                </div>
                <div className="flex justify-between text-white font-black text-sm pt-1 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-orange-400">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Paid via {order.paymentMethod}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintInvoice}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors inline-flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download Invoice UI</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors active:scale-95 shadow-md shadow-orange-500/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
