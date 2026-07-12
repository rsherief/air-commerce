import type { Currency, FxState } from '../types'

/** Approximate fallback rates (EGP per unit) used until the first live fetch succeeds. */
export const FALLBACK_RATES: Record<Currency, number> = {
  USD: 50,
  EUR: 54,
  GBP: 63,
  AED: 13.6,
}

const API_URL = 'https://open.er-api.com/v6/latest/USD'

export async function fetchRates(): Promise<FxState | null> {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) return null
    const data = await res.json()
    const r = data?.rates
    if (typeof r?.EGP !== 'number' || !r.EUR || !r.GBP || !r.AED) return null
    const egp: number = r.EGP
    return {
      rates: {
        USD: egp,
        EUR: egp / r.EUR,
        GBP: egp / r.GBP,
        AED: egp / r.AED,
      },
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function rateAge(fetchedAt: string | null): string {
  if (!fetchedAt) return 'offline — using fallback rates'
  const mins = Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 60000)
  if (mins < 1) return 'updated just now'
  if (mins < 60) return `updated ${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 48) return `updated ${hours}h ago`
  return `updated ${Math.floor(hours / 24)}d ago — refresh soon`
}
