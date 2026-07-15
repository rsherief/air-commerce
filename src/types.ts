export type Currency = 'USD' | 'EUR' | 'GBP' | 'AED'
export type MoneyCurrency = Currency | 'EGP'

export const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'AED']
export const MONEY_CURRENCIES: MoneyCurrency[] = ['EGP', 'USD', 'EUR', 'GBP', 'AED']

/** Which way the goods travel: bring to Egypt to sell, or carry out of Egypt to sell abroad. */
export type Direction = 'to-egypt' | 'from-egypt'

export const DIRECTION_LABEL: Record<Direction, string> = {
  'to-egypt': 'Bring to Egypt',
  'from-egypt': 'Sell abroad',
}

export type Category =
  | 'perfume'
  | 'skincare'
  | 'cosmetics'
  | 'supplements'
  | 'baby'
  | 'tech'
  | 'fashion'
  | 'collectibles'
  | 'food'
  | 'home'

export const CATEGORIES: Category[] = [
  'perfume',
  'skincare',
  'cosmetics',
  'supplements',
  'baby',
  'tech',
  'fashion',
  'collectibles',
  'food',
  'home',
]

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  direction: Direction
  sourceRegion: string
  sourceStore: string
  buyPrice: number
  buyCurrency: MoneyCurrency
  sellPrice: number
  sellCurrency: MoneyCurrency
  weightGrams: number
  notes?: string
}

export type TripStatus = 'planning' | 'shopping' | 'done'

/** Which legs of the trip carry inventory. */
export type TripDirection = 'round-trip' | 'outbound' | 'return'

export const TRIP_DIRECTION_LABEL: Record<TripDirection, string> = {
  'round-trip': 'Round trip — sell both ways',
  outbound: 'Outbound only — sell abroad',
  return: 'Return only — bring back to Egypt',
}

export interface Trip {
  id: string
  origin: string
  destination: string
  direction: TripDirection
  startDate: string
  endDate: string
  budget: number
  budgetCurrency: MoneyCurrency
  luggageAllowanceKg: number
  status: TripStatus
}

export interface TripItem {
  id: string
  tripId: string
  productId: string
  qty: number
  actualBuyPrice?: number
  purchased: boolean
}

export interface Customer {
  id: string
  name: string
  phone: string
  notes?: string
}

export type OrderStatus = 'requested' | 'deposit-paid' | 'purchased' | 'delivered' | 'settled'

export const ORDER_STATUSES: OrderStatus[] = [
  'requested',
  'deposit-paid',
  'purchased',
  'delivered',
  'settled',
]

export type PaymentMethod = 'Instapay' | 'Vodafone Cash' | 'Cash'

export const PAYMENT_METHODS: PaymentMethod[] = ['Instapay', 'Vodafone Cash', 'Cash']

export interface Order {
  id: string
  customerId: string
  productId: string
  qty: number
  agreedPrice: number
  deposit: number
  currency: MoneyCurrency
  paymentMethod: PaymentMethod
  status: OrderStatus
  tripId?: string
  createdAt: string
}

export interface FxState {
  /** EGP per 1 unit of each foreign currency */
  rates: Record<Currency, number>
  fetchedAt: string | null
}

export interface Settings {
  fxBufferPct: number
  /** Default markup for goods sold abroad (higher purchasing power markets). */
  defaultMarkupPct: number
  /** Default markup for goods sold in Egypt — kept lower to reflect local purchasing power. */
  defaultMarkupPctEgypt: number
  manualRates: Partial<Record<Currency, number>>
}
