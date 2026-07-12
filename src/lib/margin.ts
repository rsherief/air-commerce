import type { FxState, MoneyCurrency, Product, Settings } from '../types'

/**
 * EGP per unit of `currency`, honoring manual overrides and the FX safety buffer.
 * The buffer is conservative in both directions: it inflates foreign costs and
 * deflates foreign revenue, so margins never rely on a favorable rate.
 */
export function effectiveRate(
  currency: MoneyCurrency,
  fx: FxState,
  settings: Settings,
  side: 'cost' | 'revenue' = 'cost',
): number {
  if (currency === 'EGP') return 1
  const base = settings.manualRates[currency] ?? fx.rates[currency]
  const buffer = settings.fxBufferPct / 100
  return side === 'cost' ? base * (1 + buffer) : base * (1 - buffer)
}

export function landedEGP(
  product: Product,
  fx: FxState,
  settings: Settings,
  priceOverride?: number,
): number {
  const price = priceOverride ?? product.buyPrice
  return price * effectiveRate(product.buyCurrency, fx, settings, 'cost')
}

export function revenueEGP(product: Product, fx: FxState, settings: Settings): number {
  return product.sellPrice * effectiveRate(product.sellCurrency, fx, settings, 'revenue')
}

export interface ProductMetrics {
  landed: number
  revenue: number
  profit: number
  marginPct: number
  profitPerKg: number
}

export function productMetrics(product: Product, fx: FxState, settings: Settings): ProductMetrics {
  const landed = landedEGP(product, fx, settings)
  const revenue = revenueEGP(product, fx, settings)
  const profit = revenue - landed
  const marginPct = landed > 0 ? (profit / landed) * 100 : 0
  const profitPerKg = product.weightGrams > 0 ? profit / (product.weightGrams / 1000) : 0
  return { landed, revenue, profit, marginPct, profitPerKg }
}

/** Suggested sell price in `sellCurrency` that yields the default markup over landed cost. */
export function suggestedSell(
  buyPrice: number,
  buyCurrency: MoneyCurrency,
  sellCurrency: MoneyCurrency,
  fx: FxState,
  settings: Settings,
): number {
  const landed = buyPrice * effectiveRate(buyCurrency, fx, settings, 'cost')
  const target = landed * (1 + settings.defaultMarkupPct / 100)
  const inSellCurrency = target / effectiveRate(sellCurrency, fx, settings, 'revenue')
  return sellCurrency === 'EGP'
    ? Math.round(inSellCurrency / 50) * 50
    : Math.round(inSellCurrency)
}
