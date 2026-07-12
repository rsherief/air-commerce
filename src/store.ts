import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Customer, FxState, Order, Product, Settings, Trip, TripItem } from './types'
import { seedProducts } from './data/seedProducts'
import { FALLBACK_RATES } from './lib/fx'

export interface ExportData {
  products: Product[]
  trips: Trip[]
  tripItems: TripItem[]
  customers: Customer[]
  orders: Order[]
  settings: Settings
  exportedAt?: string
}

interface Store extends ExportData {
  fx: FxState

  upsertProduct: (p: Product) => void
  deleteProduct: (id: string) => void

  upsertTrip: (t: Trip) => void
  deleteTrip: (id: string) => void

  upsertTripItem: (i: TripItem) => void
  deleteTripItem: (id: string) => void

  upsertCustomer: (c: Customer) => void

  upsertOrder: (o: Order) => void
  deleteOrder: (id: string) => void

  updateSettings: (s: Partial<Settings>) => void
  setFx: (fx: FxState) => void
  importAll: (data: ExportData) => void
  resetAll: () => void
}

const defaultSettings: Settings = {
  fxBufferPct: 5,
  defaultMarkupPct: 45,
  manualRates: {},
}

const upsert = <T extends { id: string }>(list: T[], item: T): T[] =>
  list.some((x) => x.id === item.id)
    ? list.map((x) => (x.id === item.id ? item : x))
    : [...list, item]

export const useStore = create<Store>()(
  persist(
    (set) => ({
      products: seedProducts,
      trips: [],
      tripItems: [],
      customers: [],
      orders: [],
      settings: defaultSettings,
      fx: { rates: FALLBACK_RATES, fetchedAt: null },

      upsertProduct: (p) => set((s) => ({ products: upsert(s.products, p) })),
      deleteProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          tripItems: s.tripItems.filter((i) => i.productId !== id),
          orders: s.orders.filter((o) => o.productId !== id),
        })),

      upsertTrip: (t) => set((s) => ({ trips: upsert(s.trips, t) })),
      deleteTrip: (id) =>
        set((s) => ({
          trips: s.trips.filter((t) => t.id !== id),
          tripItems: s.tripItems.filter((i) => i.tripId !== id),
          orders: s.orders.map((o) => (o.tripId === id ? { ...o, tripId: undefined } : o)),
        })),

      upsertTripItem: (i) => set((s) => ({ tripItems: upsert(s.tripItems, i) })),
      deleteTripItem: (id) =>
        set((s) => ({ tripItems: s.tripItems.filter((i) => i.id !== id) })),

      upsertCustomer: (c) => set((s) => ({ customers: upsert(s.customers, c) })),

      upsertOrder: (o) => set((s) => ({ orders: upsert(s.orders, o) })),
      deleteOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setFx: (fx) => set({ fx }),

      importAll: (data) =>
        set({
          products: data.products ?? [],
          trips: data.trips ?? [],
          tripItems: data.tripItems ?? [],
          customers: data.customers ?? [],
          orders: data.orders ?? [],
          settings: { ...defaultSettings, ...data.settings },
        }),

      resetAll: () =>
        set({
          products: seedProducts,
          trips: [],
          tripItems: [],
          customers: [],
          orders: [],
          settings: defaultSettings,
        }),
    }),
    { name: 'air-commerce-v1' },
  ),
)
