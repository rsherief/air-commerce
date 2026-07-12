import type { MoneyCurrency } from '../types'

const nf0 = new Intl.NumberFormat('en', { maximumFractionDigits: 0 })
const nf2 = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })

export function fmtEGP(n: number): string {
  return `${nf0.format(n)} EGP`
}

export function fmtMoney(n: number, currency: MoneyCurrency): string {
  return `${(currency === 'EGP' ? nf0 : nf2).format(n)} ${currency}`
}

export function fmtNum(n: number): string {
  return nf0.format(n)
}

export function fmtKg(n: number): string {
  return `${nf2.format(n)} kg`
}

export function fmtPct(n: number): string {
  return `${n >= 0 ? '' : '−'}${Math.abs(n).toFixed(0)}%`
}

export function fmtDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}
