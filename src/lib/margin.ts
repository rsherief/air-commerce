import type { Currency, FxState, Product, Settings } from '../types'

/** EGP per unit of `currency`, honoring manual overrides and the FX safety buffer. */
export function effectiveRate(currency: Currency, fx: FxState, settings: Settings): number {
  const base = settings.manualRates[currency] ?? fx.rates[currency]
  return base * (1 + settings.fxBufferPct / 100)
}

export function landedEGP(
  product: Product,
  fx: FxState,
  settings: Settings,
  priceOverride?: number,
): number {
  const price = priceOverride ?? product.buyPrice
  return price * effectiveRate(product.buyCurrency, fx, settings)
}

export interface ProductMetrics {
  landed: number
  profit: number
  marginPct: number
  profitPerKg: number
}

export function productMetrics(product: Product, fx: FxState, settings: Settings): ProductMetrics {
  const landed = landedEGP(product, fx, settings)
  const profit = product.sellPriceEGP - landed
  const marginPct = landed > 0 ? (profit / landed) * 100 : 0
  const profitPerKg = product.weightGrams > 0 ? profit / (product.weightGrams / 1000) : 0
  return { landed, profit, marginPct, profitPerKg }
}

export function suggestedSellEGP(
  buyPrice: number,
  currency: Currency,
  fx: FxState,
  settings: Settings,
): number {
  const landed = buyPrice * effectiveRate(currency, fx, settings)
  return Math.round((landed * (1 + settings.defaultMarkupPct / 100)) / 50) * 50
}
