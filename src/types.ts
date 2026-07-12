export type Currency = 'USD' | 'EUR' | 'GBP' | 'AED'

export const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'AED']

export type Category =
  | 'perfume'
  | 'skincare'
  | 'cosmetics'
  | 'supplements'
  | 'baby'
  | 'tech'
  | 'fashion'
  | 'collectibles'

export const CATEGORIES: Category[] = [
  'perfume',
  'skincare',
  'cosmetics',
  'supplements',
  'baby',
  'tech',
  'fashion',
  'collectibles',
]

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  sourceRegion: string
  sourceStore: string
  buyPrice: number
  buyCurrency: Currency
  sellPriceEGP: number
  weightGrams: number
  notes?: string
}

export type TripStatus = 'planning' | 'shopping' | 'done'

export interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  budgetCurrency: Currency
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
  agreedPriceEGP: number
  depositEGP: number
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
  defaultMarkupPct: number
  manualRates: Partial<Record<Currency, number>>
}
