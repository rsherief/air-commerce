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
    {
      name: 'air-commerce-v1',
      version: 1,
      migrate: (persisted, version) => {
        const s = persisted as Record<string, unknown>
        if (version < 1) {
          // v0 → v1: products/orders were Egypt-import only; trips had no direction.
          type OldProduct = Product & { sellPriceEGP?: number }
          type OldOrder = Order & { agreedPriceEGP?: number; depositEGP?: number }
          s.products = ((s.products as OldProduct[]) ?? []).map((p) => ({
            ...p,
            direction: p.direction ?? 'to-egypt',
            sellPrice: p.sellPrice ?? p.sellPriceEGP ?? 0,
            sellCurrency: p.sellCurrency ?? 'EGP',
          }))
          s.trips = ((s.trips as Trip[]) ?? []).map((t) => ({
            ...t,
            direction: t.direction ?? 'round-trip',
          }))
          s.orders = ((s.orders as OldOrder[]) ?? []).map((o) => ({
            ...o,
            agreedPrice: o.agreedPrice ?? o.agreedPriceEGP ?? 0,
            deposit: o.deposit ?? o.depositEGP ?? 0,
            currency: o.currency ?? 'EGP',
          }))
          // Surface newly added seed products (e.g. Egyptian exports) to existing users.
          const existing = new Set((s.products as Product[]).map((p) => p.id))
          s.products = [
            ...(s.products as Product[]),
            ...seedProducts.filter((p) => !existing.has(p.id)),
          ]
        }
        return s as unknown as Store
      },
    },
  ),
)
