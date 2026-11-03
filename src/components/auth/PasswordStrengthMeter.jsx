import React from 'react'
import { Check, X } from 'lucide-react'

export default function PasswordStrengthMeter({ password = '' }) {
  const criteria = [
    { label: '6+ characters', valid: password.length >= 6 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
    { label: 'Special symbol', valid: /[^A-Za-z0-9]/.test(password) }
  ]

  const passedCount = criteria.filter((c) => c.valid).length

  const getStrengthMeta = () => {
    if (password.length === 0) return { label: 'Empty', color: 'bg-slate-200', text: 'text-slate-400', width: '0%' }
    if (passedCount <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: '25%' }
    if (passedCount === 2) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500', width: '50%' }
    if (passedCount === 3) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500', width: '75%' }
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', width: '100%' }
  }

  const meta = getStrengthMeta()

  if (!password) return null

  return (
    <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-medium">Security Strength:</span>
        <span className={`font-bold uppercase tracking-wider text-[10px] ${meta.text}`}>
          {meta.label}
        </span>
      </div>

      {/* Progress track */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${meta.color} transition-all duration-300 rounded-full`}
          style={{ width: meta.width }}
        ></div>
      </div>

      {/* Realtime Check Pills */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {criteria.map((c, i) => (
          <div
            key={i}
            className={`flex items-center gap-1 text-[10px] transition-colors ${
              c.valid ? 'text-emerald-600 font-semibold' : 'text-slate-400'
            }`}
          >
            {c.valid ? (
              <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />
            )}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
