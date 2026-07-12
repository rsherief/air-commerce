import { useRef, useState } from 'react'
import { useStore, type ExportData } from '../store'
import { CURRENCIES } from '../types'
import { fetchRates, rateAge } from '../lib/fx'
import { Button, Card, Field, inputCls } from '../components/ui'

export default function Settings() {
  const { settings, fx } = useStore()
  const updateSettings = useStore((s) => s.updateSettings)
  const setFx = useStore((s) => s.setFx)
  const importAll = useStore((s) => s.importAll)
  const resetAll = useStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 2500)
  }

  const refresh = async () => {
    setRefreshing(true)
    const result = await fetchRates()
    if (result) {
      setFx(result)
      flash('Rates updated ✓')
    } else {
      flash('Fetch failed — using cached rates')
    }
    setRefreshing(false)
  }

  const exportData = () => {
    const s = useStore.getState()
    const data: ExportData = {
      products: s.products,
      trips: s.trips,
      tripItems: s.tripItems,
      customers: s.customers,
      orders: s.orders,
      settings: s.settings,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `air-commerce-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    flash('Backup downloaded ✓')
  }

  const importData = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as ExportData
      if (!Array.isArray(data.products)) throw new Error('bad file')
      importAll(data)
      flash('Data imported ✓')
    } catch {
      flash('Import failed — not a valid backup file')
    }
  }

  return (
    <div>
      <h1 className="mb-3 text-xl font-bold">Settings</h1>
      {msg && (
        <div className="mb-3 rounded-lg bg-sky-900/50 px-3 py-2 text-xs text-sky-300">{msg}</div>
      )}

      <Card className="mb-3">
        <h2 className="mb-2 text-sm font-semibold">FX & pricing</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="FX safety buffer (%)">
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              min={0}
              value={settings.fxBufferPct}
              onChange={(e) => updateSettings({ fxBufferPct: Number(e.target.value) })}
            />
          </Field>
          <Field label="Default markup (%)">
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              min={0}
              value={settings.defaultMarkupPct}
              onChange={(e) => updateSettings({ defaultMarkupPct: Number(e.target.value) })}
            />
          </Field>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          The buffer inflates landed cost in all margin math to protect against EGP swings between
          purchase and delivery.
        </p>
      </Card>

      <Card className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Exchange rates (EGP per unit)</h2>
          <button onClick={refresh} className="text-xs text-sky-400" disabled={refreshing}>
            {refreshing ? 'Refreshing…' : '↻ Refresh live'}
          </button>
        </div>
        <div className="space-y-2">
          {CURRENCIES.map((c) => (
            <div key={c} className="flex items-center gap-3">
              <span className="w-10 text-sm font-medium">{c}</span>
              <span className="w-16 text-xs text-slate-500">live {fx.rates[c].toFixed(2)}</span>
              <input
                className={`${inputCls} flex-1`}
                type="number"
                inputMode="decimal"
                placeholder="manual override"
                value={settings.manualRates[c] ?? ''}
                onChange={(e) =>
                  updateSettings({
                    manualRates: {
                      ...settings.manualRates,
                      [c]: e.target.value === '' ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {rateAge(fx.fetchedAt)}. Leave override blank to use live rates.
        </p>
      </Card>

      <Card className="mb-3">
        <h2 className="mb-2 text-sm font-semibold">Data</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportData} className="flex-1">
            ⬇ Export backup
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} className="flex-1">
            ⬆ Import backup
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) importData(f)
            e.target.value = ''
          }}
        />
        <p className="mt-2 text-[11px] text-slate-500">
          All data lives only on this device. Export a backup regularly.
        </p>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-rose-400">Danger zone</h2>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Erase ALL data (trips, orders, customers) and restore the seed catalog?'))
              resetAll()
          }}
        >
          Reset all data
        </Button>
      </Card>

      <p className="mt-4 text-center text-[11px] text-slate-600">Air Commerce v0.1 · personal use</p>
    </div>
  )
}
