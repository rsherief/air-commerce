import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Category, Currency, Product } from '../types'
import { CATEGORIES, CURRENCIES } from '../types'
import { productMetrics, suggestedSellEGP } from '../lib/margin'
import { fmtEGP, fmtMoney, fmtNum, fmtPct, uid } from '../lib/format'
import { Button, Card, Chip, Empty, Fab, Field, Modal, inputCls } from '../components/ui'

export function marginTone(pct: number): 'green' | 'amber' | 'red' {
  if (pct >= 40) return 'green'
  if (pct >= 15) return 'amber'
  return 'red'
}

export default function Catalog() {
  const products = useStore((s) => s.products)
  const fx = useStore((s) => s.fx)
  const settings = useStore((s) => s.settings)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products
      .filter((p) => category === 'all' || p.category === category)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sourceRegion.toLowerCase().includes(q) ||
          p.sourceStore.toLowerCase().includes(q),
      )
      .map((p) => ({ p, m: productMetrics(p, fx, settings) }))
      .sort((a, b) => b.m.profitPerKg - a.m.profitPerKg)
  }, [products, category, search, fx, settings])

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">Catalog</h1>
      <p className="mb-3 text-xs text-slate-500">
        Sorted by profit per kg. Seeded prices are estimates — tap a product to set real prices.
      </p>
      <input
        className={`${inputCls} mb-2`}
        placeholder="Search product, brand, store…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
              category === c ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <Empty text="No products match." />}

      <div className="space-y-2">
        {filtered.map(({ p, m }) => (
          <Card key={p.id} onClick={() => setEditing(p)}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-slate-400">
                  {p.brand} · {p.sourceStore} ({p.sourceRegion})
                </div>
              </div>
              <Chip tone={marginTone(m.marginPct)}>{fmtPct(m.marginPct)}</Chip>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <span>
                Buy <b>{fmtMoney(p.buyPrice, p.buyCurrency)}</b>
              </span>
              <span>
                Sell <b>{fmtEGP(p.sellPriceEGP)}</b>
              </span>
              <span className="text-emerald-400">
                +{fmtNum(m.profit)} EGP · {fmtNum(m.profitPerKg)}/kg
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Fab onClick={() => setCreating(true)} />

      <ProductForm
        open={creating || editing !== null}
        product={editing}
        onClose={() => {
          setCreating(false)
          setEditing(null)
        }}
      />
    </div>
  )
}

function ProductForm({
  open,
  product,
  onClose,
}: {
  open: boolean
  product: Product | null
  onClose: () => void
}) {
  const upsertProduct = useStore((s) => s.upsertProduct)
  const deleteProduct = useStore((s) => s.deleteProduct)
  const fx = useStore((s) => s.fx)
  const settings = useStore((s) => s.settings)

  const blank: Product = {
    id: '',
    name: '',
    brand: '',
    category: 'skincare',
    sourceRegion: '',
    sourceStore: '',
    buyPrice: 0,
    buyCurrency: 'EUR',
    sellPriceEGP: 0,
    weightGrams: 0,
    notes: '',
  }
  const [form, setForm] = useState<Product>(blank)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  // Sync form when the modal opens for a different product (or for create)
  const key = product?.id ?? (open ? 'new' : null)
  if (open && key !== loadedFor) {
    setForm(product ?? blank)
    setLoadedFor(key)
  }
  if (!open && loadedFor !== null) setLoadedFor(null)

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.name.trim() || form.buyPrice <= 0 || form.sellPriceEGP <= 0) return
    upsertProduct({ ...form, id: form.id || uid() })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit product' : 'New product'}>
      <div className="space-y-3">
        <Field label="Product name">
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand">
            <input className={inputCls} value={form.brand} onChange={(e) => set('brand', e.target.value)} />
          </Field>
          <Field label="Category">
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => set('category', e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Source region">
            <input
              className={inputCls}
              placeholder="France, Dubai…"
              value={form.sourceRegion}
              onChange={(e) => set('sourceRegion', e.target.value)}
            />
          </Field>
          <Field label="Store">
            <input
              className={inputCls}
              placeholder="City Pharma…"
              value={form.sourceStore}
              onChange={(e) => set('sourceStore', e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Buy price">
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              min={0}
              value={form.buyPrice || ''}
              onChange={(e) => set('buyPrice', Number(e.target.value))}
            />
          </Field>
          <Field label="Currency">
            <select
              className={inputCls}
              value={form.buyCurrency}
              onChange={(e) => set('buyCurrency', e.target.value as Currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sell price (EGP)">
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              min={0}
              value={form.sellPriceEGP || ''}
              onChange={(e) => set('sellPriceEGP', Number(e.target.value))}
            />
          </Field>
          <Field label="Weight (grams)">
            <input
              className={inputCls}
              type="number"
              inputMode="numeric"
              min={0}
              value={form.weightGrams || ''}
              onChange={(e) => set('weightGrams', Number(e.target.value))}
            />
          </Field>
        </div>
        {form.buyPrice > 0 && (
          <button
            className="text-xs text-sky-400"
            onClick={() =>
              set('sellPriceEGP', suggestedSellEGP(form.buyPrice, form.buyCurrency, fx, settings))
            }
          >
            Suggest sell price at +{settings.defaultMarkupPct}% markup →{' '}
            {fmtEGP(suggestedSellEGP(form.buyPrice, form.buyCurrency, fx, settings))}
          </button>
        )}
        <Field label="Notes">
          <input
            className={inputCls}
            value={form.notes ?? ''}
            onChange={(e) => set('notes', e.target.value)}
          />
        </Field>
        <div className="flex gap-2 pt-1">
          <Button onClick={save} className="flex-1">
            Save
          </Button>
          {product && (
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('Delete this product? Linked trip items and orders are removed too.')) {
                  deleteProduct(product.id)
                  onClose()
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
