import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Currency, Trip, TripItem, TripStatus } from '../types'
import { CURRENCIES } from '../types'
import { landedEGP, productMetrics } from '../lib/margin'
import { tripTotals } from '../lib/trip'
import { fmtDate, fmtEGP, fmtKg, fmtMoney, fmtNum, uid } from '../lib/format'
import { Button, Card, Chip, Empty, Fab, Field, Modal, ProgressBar, Stat, inputCls } from '../components/ui'

const statusTone: Record<TripStatus, 'sky' | 'amber' | 'slate'> = {
  planning: 'sky',
  shopping: 'amber',
  done: 'slate',
}

const nextStatus: Record<TripStatus, TripStatus> = {
  planning: 'shopping',
  shopping: 'done',
  done: 'planning',
}

export default function Trips() {
  const trips = useStore((s) => s.trips)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const selected = trips.find((t) => t.id === selectedId)
  if (selected) return <TripDetail trip={selected} onBack={() => setSelectedId(null)} />

  return (
    <div>
      <h1 className="mb-3 text-xl font-bold">Trips</h1>
      {trips.length === 0 && (
        <Empty text="No trips yet. Create one for your next flight and build its shopping list." />
      )}
      <div className="space-y-2">
        {[...trips].reverse().map((t) => (
          <TripCard key={t.id} trip={t} onOpen={() => setSelectedId(t.id)} />
        ))}
      </div>
      <Fab onClick={() => setCreating(true)} />
      <TripForm open={creating} trip={null} onClose={() => setCreating(false)} />
    </div>
  )
}

function TripCard({ trip, onOpen }: { trip: Trip; onOpen: () => void }) {
  const { tripItems, products, fx, settings } = useStore()
  const items = tripItems.filter((i) => i.tripId === trip.id)
  const totals = tripTotals(trip, items, products, fx, settings)
  return (
    <Card onClick={onOpen}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">✈️ {trip.destination}</div>
        <Chip tone={statusTone[trip.status]}>{trip.status}</Chip>
      </div>
      <div className="mt-1 text-xs text-slate-400">
        {fmtDate(trip.startDate)} – {fmtDate(trip.endDate)} · {totals.itemCount} items
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="text-slate-300">Cost {fmtEGP(totals.costEGP)}</span>
        <span className="text-emerald-400">Profit {fmtEGP(totals.profitEGP)}</span>
      </div>
    </Card>
  )
}

function TripDetail({ trip, onBack }: { trip: Trip; onBack: () => void }) {
  const { tripItems, products, orders, customers, fx, settings } = useStore()
  const upsertTrip = useStore((s) => s.upsertTrip)
  const deleteTrip = useStore((s) => s.deleteTrip)
  const upsertTripItem = useStore((s) => s.upsertTripItem)
  const deleteTripItem = useStore((s) => s.deleteTripItem)
  const [picking, setPicking] = useState(false)
  const [editingTrip, setEditingTrip] = useState(false)

  const items = tripItems.filter((i) => i.tripId === trip.id)
  const totals = tripTotals(trip, items, products, fx, settings)
  const linkedOrders = orders.filter((o) => o.tripId === trip.id)
  const budgetPct = totals.budgetEGP > 0 ? (totals.costEGP / totals.budgetEGP) * 100 : 0
  const weightPct =
    trip.luggageAllowanceKg > 0 ? (totals.weightKg / trip.luggageAllowanceKg) * 100 : 0

  return (
    <div>
      <button onClick={onBack} className="mb-2 text-sm text-sky-400">
        ← All trips
      </button>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-xl font-bold">✈️ {trip.destination}</h1>
        <button onClick={() => upsertTrip({ ...trip, status: nextStatus[trip.status] })}>
          <Chip tone={statusTone[trip.status]}>{trip.status} ▸</Chip>
        </button>
      </div>
      <div className="mb-3 text-xs text-slate-400">
        {fmtDate(trip.startDate)} – {fmtDate(trip.endDate)} ·{' '}
        <button className="text-sky-400" onClick={() => setEditingTrip(true)}>
          edit trip
        </button>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        <Stat
          label={`Budget (${fmtMoney(trip.budget, trip.budgetCurrency)})`}
          value={fmtEGP(totals.costEGP)}
          sub={`of ${fmtEGP(totals.budgetEGP)}`}
          tone={budgetPct > 100 ? 'red' : 'slate'}
        />
        <Stat
          label="Weight"
          value={fmtKg(totals.weightKg)}
          sub={`of ${trip.luggageAllowanceKg} kg`}
          tone={weightPct > 100 ? 'red' : 'slate'}
        />
        <Stat label="Projected profit" value={fmtEGP(totals.profitEGP)} tone="green" />
      </div>
      <div className="mb-1">
        <ProgressBar pct={budgetPct} />
      </div>
      <div className="mb-4">
        <ProgressBar pct={weightPct} danger={weightPct > 100} />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">Shopping list</h2>
        <Button variant="secondary" onClick={() => setPicking(true)} className="!py-1 text-xs">
          + Add products
        </Button>
      </div>
      {items.length === 0 && <Empty text="No items yet — add products from the catalog." />}
      <div className="space-y-2">
        {items.map((it) => {
          const p = products.find((x) => x.id === it.productId)
          if (!p) return null
          const landed = landedEGP(p, fx, settings, it.actualBuyPrice)
          return (
            <Card key={it.id}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={it.purchased}
                  onChange={(e) => upsertTripItem({ ...it, purchased: e.target.checked })}
                  className="h-5 w-5 accent-sky-500"
                />
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-sm ${it.purchased ? 'line-through text-slate-500' : ''}`}>
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {fmtMoney(it.actualBuyPrice ?? p.buyPrice, p.buyCurrency)} → {fmtEGP(landed)} ·{' '}
                    <span className="text-emerald-400">+{fmtNum((p.sellPriceEGP - landed) * it.qty)} EGP</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="h-7 w-7 rounded bg-slate-700 text-slate-200"
                    onClick={() =>
                      it.qty > 1 ? upsertTripItem({ ...it, qty: it.qty - 1 }) : deleteTripItem(it.id)
                    }
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{it.qty}</span>
                  <button
                    className="h-7 w-7 rounded bg-slate-700 text-slate-200"
                    onClick={() => upsertTripItem({ ...it, qty: it.qty + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-slate-500">Actual price:</span>
                <input
                  className="w-24 rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs"
                  type="number"
                  inputMode="decimal"
                  placeholder={String(p.buyPrice)}
                  value={it.actualBuyPrice ?? ''}
                  onChange={(e) =>
                    upsertTripItem({
                      ...it,
                      actualBuyPrice: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                />
                <span className="text-slate-500">{p.buyCurrency}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {linkedOrders.length > 0 && (
        <>
          <h2 className="mb-2 mt-5 text-sm font-semibold text-slate-300">Linked pre-orders</h2>
          <div className="space-y-2">
            {linkedOrders.map((o) => {
              const p = products.find((x) => x.id === o.productId)
              const c = customers.find((x) => x.id === o.customerId)
              return (
                <Card key={o.id}>
                  <div className="flex justify-between text-sm">
                    <span>
                      {c?.name ?? '?'} · {p?.name ?? '?'} ×{o.qty}
                    </span>
                    <Chip tone="violet">{o.status}</Chip>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      <div className="mt-6">
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Delete this trip and its shopping list?')) {
              deleteTrip(trip.id)
              onBack()
            }
          }}
        >
          Delete trip
        </Button>
      </div>

      <ProductPicker
        open={picking}
        onClose={() => setPicking(false)}
        tripId={trip.id}
        items={items}
      />
      <TripForm open={editingTrip} trip={trip} onClose={() => setEditingTrip(false)} />
    </div>
  )
}

function ProductPicker({
  open,
  onClose,
  tripId,
  items,
}: {
  open: boolean
  onClose: () => void
  tripId: string
  items: TripItem[]
}) {
  const { products, fx, settings } = useStore()
  const upsertTripItem = useStore((s) => s.upsertTripItem)
  const [search, setSearch] = useState('')

  const ranked = useMemo(() => {
    const q = search.toLowerCase()
    return products
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .map((p) => ({ p, m: productMetrics(p, fx, settings) }))
      .sort((a, b) => b.m.profitPerKg - a.m.profitPerKg)
  }, [products, search, fx, settings])

  const add = (productId: string) => {
    const existing = items.find((i) => i.productId === productId)
    if (existing) upsertTripItem({ ...existing, qty: existing.qty + 1 })
    else upsertTripItem({ id: uid(), tripId, productId, qty: 1, purchased: false })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add products (best profit/kg first)">
      <input
        className={`${inputCls} mb-3`}
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-2">
        {ranked.map(({ p, m }) => {
          const inList = items.find((i) => i.productId === p.id)
          return (
            <div key={p.id} className="flex items-center gap-2 rounded-lg bg-slate-800 p-2">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{p.name}</div>
                <div className="text-xs text-slate-400">
                  {fmtMoney(p.buyPrice, p.buyCurrency)} ·{' '}
                  <span className="text-emerald-400">{fmtNum(m.profitPerKg)} EGP/kg</span>
                </div>
              </div>
              <Button variant="secondary" className="!py-1 text-xs" onClick={() => add(p.id)}>
                {inList ? `+1 (${inList.qty})` : '+ Add'}
              </Button>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

function TripForm({ open, trip, onClose }: { open: boolean; trip: Trip | null; onClose: () => void }) {
  const upsertTrip = useStore((s) => s.upsertTrip)
  const today = new Date().toISOString().slice(0, 10)
  const blank: Trip = {
    id: '',
    destination: '',
    startDate: today,
    endDate: today,
    budget: 1000,
    budgetCurrency: 'USD',
    luggageAllowanceKg: 23,
    status: 'planning',
  }
  const [form, setForm] = useState<Trip>(blank)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  const key = trip?.id ?? (open ? 'new' : null)
  if (open && key !== loadedFor) {
    setForm(trip ?? blank)
    setLoadedFor(key)
  }
  if (!open && loadedFor !== null) setLoadedFor(null)

  const set = <K extends keyof Trip>(k: K, v: Trip[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.destination.trim()) return
    upsertTrip({ ...form, id: form.id || uid() })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={trip ? 'Edit trip' : 'New trip'}>
      <div className="space-y-3">
        <Field label="Destination">
          <input
            className={inputCls}
            placeholder="Dubai, Paris, London…"
            value={form.destination}
            onChange={(e) => set('destination', e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date">
            <input
              className={inputCls}
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
            />
          </Field>
          <Field label="End date">
            <input
              className={inputCls}
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Shopping budget">
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              min={0}
              value={form.budget || ''}
              onChange={(e) => set('budget', Number(e.target.value))}
            />
          </Field>
          <Field label="Currency">
            <select
              className={inputCls}
              value={form.budgetCurrency}
              onChange={(e) => set('budgetCurrency', e.target.value as Currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Spare luggage allowance (kg)">
          <input
            className={inputCls}
            type="number"
            inputMode="decimal"
            min={0}
            value={form.luggageAllowanceKg || ''}
            onChange={(e) => set('luggageAllowanceKg', Number(e.target.value))}
          />
        </Field>
        <Button onClick={save} className="w-full">
          Save trip
        </Button>
      </div>
    </Modal>
  )
}
