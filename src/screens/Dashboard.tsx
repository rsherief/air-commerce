import { useState } from 'react'
import { useStore } from '../store'
import { CURRENCIES } from '../types'
import { fetchRates, rateAge } from '../lib/fx'
import { effectiveRate } from '../lib/margin'
import { tripTotals } from '../lib/trip'
import { fmtEGP, fmtKg, fmtNum } from '../lib/format'
import { flagFor } from '../lib/countries'
import { orderBalance } from './Orders'
import type { Tab } from '../components/TabBar'
import { Card, Chip, Stat } from '../components/ui'

export default function Dashboard({ goTo }: { goTo: (t: Tab) => void }) {
  const { trips, tripItems, products, orders, fx, settings } = useStore()
  const setFx = useStore((s) => s.setFx)
  const [refreshing, setRefreshing] = useState(false)

  const activeTrip = [...trips].reverse().find((t) => t.status !== 'done')
  const activeTotals = activeTrip
    ? tripTotals(
        activeTrip,
        tripItems.filter((i) => i.tripId === activeTrip.id),
        products,
        fx,
        settings,
      )
    : null

  const toEGP = (amount: number, currency: Parameters<typeof effectiveRate>[0]) =>
    amount * effectiveRate(currency, fx, settings, 'revenue')

  const openOrders = orders.filter((o) => o.status !== 'settled')
  const outstanding = openOrders.reduce((sum, o) => sum + toEGP(orderBalance(o), o.currency), 0)
  const depositsHeld = openOrders.reduce((sum, o) => sum + toEGP(o.deposit, o.currency), 0)

  const refresh = async () => {
    setRefreshing(true)
    const result = await fetchRates()
    if (result) setFx(result)
    setRefreshing(false)
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">Air Commerce</h1>
      <p className="mb-4 text-xs text-slate-500">Trade smart in both directions ✈️</p>

      {/* FX card */}
      <Card className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">FX rates → EGP</span>
          <button onClick={refresh} className="text-xs text-sky-400" disabled={refreshing}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {CURRENCIES.map((c) => {
            const manual = settings.manualRates[c]
            return (
              <div key={c} className="rounded-lg bg-slate-900/60 p-2">
                <div className="text-[11px] text-slate-400">{c}</div>
                <div className="text-sm font-semibold">
                  {(manual ?? fx.rates[c]).toFixed(2)}
                </div>
                {manual !== undefined && <div className="text-[9px] text-amber-400">manual</div>}
              </div>
            )
          })}
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          {rateAge(fx.fetchedAt)} · ±{settings.fxBufferPct}% safety buffer applied to margins
        </div>
      </Card>

      {/* Active trip */}
      {activeTrip && activeTotals ? (
        <Card className="mb-3" onClick={() => goTo('trips')}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">
              ✈️ {flagFor(activeTrip.origin)} {activeTrip.origin} ⇄ {flagFor(activeTrip.destination)}{' '}
              {activeTrip.destination}
            </span>
            <Chip tone={activeTrip.status === 'shopping' ? 'amber' : 'sky'}>{activeTrip.status}</Chip>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="text-slate-400">Cost</div>
              <div className="font-semibold">{fmtNum(activeTotals.costEGP)}</div>
            </div>
            <div>
              <div className="text-slate-400">Out</div>
              <div className="font-semibold">{fmtKg(activeTotals.weightOutKg)}</div>
            </div>
            <div>
              <div className="text-slate-400">Back</div>
              <div className="font-semibold">{fmtKg(activeTotals.weightBackKg)}</div>
            </div>
            <div>
              <div className="text-slate-400">Profit</div>
              <div className="font-semibold text-emerald-400">+{fmtNum(activeTotals.profitEGP)}</div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-3" onClick={() => goTo('trips')}>
          <div className="text-sm text-slate-400">
            No active trip — <span className="text-sky-400">plan your next run →</span>
          </div>
        </Card>
      )}

      {/* Orders summary */}
      <div className="grid grid-cols-3 gap-2" onClick={() => goTo('orders')}>
        <Stat label="Open orders" value={String(openOrders.length)} />
        <Stat label="Deposits held" value={fmtEGP(depositsHeld)} tone="slate" />
        <Stat label="Balance due" value={fmtEGP(outstanding)} tone={outstanding > 0 ? 'amber' : 'green'} />
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-slate-600">
        Reminder from your research: pre-sell with ~50% deposits, keep phones out of inventory
        (IMEI tax), verify customs rules quarterly — including food/agricultural import rules at
        your destination for goods carried out of Egypt. Seeded catalog prices are estimates.
      </p>
    </div>
  )
}
