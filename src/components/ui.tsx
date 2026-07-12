import { useState } from 'react'
import type { ReactNode } from 'react'
import { COUNTRIES } from '../lib/countries'

export const inputCls =
  'w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500'

export function Card({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-slate-800/70 border border-slate-700/60 p-3 ${
        onClick ? 'active:bg-slate-700/70 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function Chip({
  children,
  tone = 'slate',
}: {
  children: ReactNode
  tone?: 'slate' | 'green' | 'amber' | 'red' | 'sky' | 'violet'
}) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-700 text-slate-200',
    green: 'bg-emerald-900/70 text-emerald-300',
    amber: 'bg-amber-900/70 text-amber-300',
    red: 'bg-rose-900/70 text-rose-300',
    sky: 'bg-sky-900/70 text-sky-300',
    violet: 'bg-violet-900/70 text-violet-300',
  }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const variants: Record<string, string> = {
    primary: 'bg-sky-600 text-white active:bg-sky-500',
    secondary: 'bg-slate-700 text-slate-100 active:bg-slate-600',
    danger: 'bg-rose-700 text-white active:bg-rose-600',
    ghost: 'bg-transparent text-slate-300 active:bg-slate-800',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Fab({ onClick, label = '+' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add"
      className="fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full bg-sky-500 text-white text-3xl font-light shadow-lg shadow-sky-500/30 active:bg-sky-400"
    >
      {label}
    </button>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-700 p-4 pb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 text-xl px-2" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
      {children}
    </label>
  )
}

const OTHER = '__other__'

export function CountrySelect({
  value,
  onChange,
  placeholder = 'Select country…',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [other, setOther] = useState(false)
  const inList = COUNTRIES.some((c) => c.name === value)
  const showInput = other || (value !== '' && !inList)
  return (
    <div className="space-y-1.5">
      <select
        className={inputCls}
        value={showInput ? OTHER : value}
        onChange={(e) => {
          if (e.target.value === OTHER) {
            setOther(true)
            onChange('')
          } else {
            setOther(false)
            onChange(e.target.value)
          }
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {COUNTRIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.flag} {c.name}
          </option>
        ))}
        <option value={OTHER}>🌍 Other…</option>
      </select>
      {showInput && (
        <input
          className={inputCls}
          placeholder="Type country or region…"
          value={inList ? '' : value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="py-12 text-center text-sm text-slate-500">{text}</div>
  )
}

export function Stat({
  label,
  value,
  sub,
  tone = 'slate',
}: {
  label: string
  value: string
  sub?: string
  tone?: 'slate' | 'green' | 'red' | 'amber'
}) {
  const toneCls: Record<string, string> = {
    slate: 'text-slate-100',
    green: 'text-emerald-400',
    red: 'text-rose-400',
    amber: 'text-amber-400',
  }
  return (
    <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={`text-base font-semibold ${toneCls[tone]}`}>{value}</div>
      {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
    </div>
  )
}

export function ProgressBar({ pct, danger }: { pct: number; danger?: boolean }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-700">
      <div
        className={`h-1.5 rounded-full ${danger || pct > 100 ? 'bg-rose-500' : 'bg-sky-500'}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
