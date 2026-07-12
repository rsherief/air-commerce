import type { FxState, Product, Settings, Trip, TripItem } from '../types'
import { effectiveRate, landedEGP, revenueEGP } from './margin'

export interface TripTotals {
  costEGP: number
  profitEGP: number
  budgetEGP: number
  itemCount: number
  /** kg carried out of Egypt (products sold abroad) */
  weightOutKg: number
  /** kg brought back to Egypt */
  weightBackKg: number
}

export function tripTotals(
  trip: Trip,
  items: TripItem[],
  products: Product[],
  fx: FxState,
  settings: Settings,
): TripTotals {
  let costEGP = 0
  let profitEGP = 0
  let itemCount = 0
  let weightOutKg = 0
  let weightBackKg = 0
  for (const it of items) {
    const p = products.find((x) => x.id === it.productId)
    if (!p) continue
    const landed = landedEGP(p, fx, settings, it.actualBuyPrice)
    costEGP += landed * it.qty
    profitEGP += (revenueEGP(p, fx, settings) - landed) * it.qty
    itemCount += it.qty
    const kg = (p.weightGrams * it.qty) / 1000
    if (p.direction === 'from-egypt') weightOutKg += kg
    else weightBackKg += kg
  }
  const budgetEGP = trip.budget * effectiveRate(trip.budgetCurrency, fx, settings, 'cost')
  return { costEGP, profitEGP, budgetEGP, itemCount, weightOutKg, weightBackKg }
}
