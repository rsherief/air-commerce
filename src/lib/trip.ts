import type { FxState, Product, Settings, Trip, TripItem } from '../types'
import { effectiveRate, landedEGP } from './margin'

export interface TripTotals {
  costEGP: number
  weightKg: number
  profitEGP: number
  budgetEGP: number
  itemCount: number
}

export function tripTotals(
  trip: Trip,
  items: TripItem[],
  products: Product[],
  fx: FxState,
  settings: Settings,
): TripTotals {
  let costEGP = 0
  let weightKg = 0
  let profitEGP = 0
  let itemCount = 0
  for (const it of items) {
    const p = products.find((x) => x.id === it.productId)
    if (!p) continue
    const landed = landedEGP(p, fx, settings, it.actualBuyPrice)
    costEGP += landed * it.qty
    weightKg += (p.weightGrams * it.qty) / 1000
    profitEGP += (p.sellPriceEGP - landed) * it.qty
    itemCount += it.qty
  }
  const budgetEGP = trip.budget * effectiveRate(trip.budgetCurrency, fx, settings)
  return { costEGP, weightKg, profitEGP, budgetEGP, itemCount }
}
