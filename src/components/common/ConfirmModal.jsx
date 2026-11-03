import React from 'react'
import { LogOut, AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon: Icon = LogOut,
  isDanger = true
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close icon button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors active:scale-95"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 active:scale-95 text-white transition-all shadow-lg shadow-red-600/25 flex items-center gap-1.5"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
