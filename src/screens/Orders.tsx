import { useState } from 'react'
import { useStore } from '../store'
import type { MoneyCurrency, Order, OrderStatus, PaymentMethod } from '../types'
import { MONEY_CURRENCIES, ORDER_STATUSES, PAYMENT_METHODS } from '../types'
import { fmtMoney, uid } from '../lib/format'
import { Button, Card, Chip, Empty, Fab, Field, Modal, inputCls } from '../components/ui'

const statusTone: Record<OrderStatus, 'slate' | 'amber' | 'sky' | 'violet' | 'green'> = {
  requested: 'slate',
  'deposit-paid': 'amber',
  purchased: 'sky',
  delivered: 'violet',
  settled: 'green',
}

export const orderTotal = (o: Order) => o.agreedPrice * o.qty
export const orderBalance = (o: Order) => (o.status === 'settled' ? 0 : orderTotal(o) - o.deposit)

export default function Orders() {
  const { orders, products, customers } = useStore()
  const upsertOrder = useStore((s) => s.upsertOrder)
  const [editing, setEditing] = useState<Order | null>(null)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const active = orders.filter((o) => o.status !== 'settled')
  const settled = orders.filter((o) => o.status === 'settled')

  const advance = (o: Order) => {
    const idx = ORDER_STATUSES.indexOf(o.status)
    if (idx < ORDER_STATUSES.length - 1) upsertOrder({ ...o, status: ORDER_STATUSES[idx + 1] })
  }

  const share = async (o: Order) => {
    const p = products.find((x) => x.id === o.productId)
    const c = customers.find((x) => x.id === o.customerId)
    const text = [
      `Order — ${c?.name ?? 'customer'}`,
      `${p?.name ?? 'item'} ×${o.qty}`,
      `Total: ${fmtMoney(orderTotal(o), o.currency)}`,
      `Deposit: ${fmtMoney(o.deposit, o.currency)} (${o.paymentMethod})`,
      `Balance: ${fmtMoney(orderBalance(o), o.currency)}`,
      `Status: ${o.status.replace('-', ' ')}`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(o.id)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      alert(text)
    }
  }

  const renderOrder = (o: Order) => {
    const p = products.find((x) => x.id === o.productId)
    const c = customers.find((x) => x.id === o.customerId)
    const isLast = o.status === 'settled'
    return (
      <Card key={o.id}>
        <div className="flex items-start justify-between gap-2" onClick={() => setEditing(o)}>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {c?.name ?? 'Unknown'} · {p?.name ?? 'Deleted product'} ×{o.qty}
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              Total {fmtMoney(orderTotal(o), o.currency)} · Deposit {fmtMoney(o.deposit, o.currency)} ·{' '}
              <span className={orderBalance(o) > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                Balance {fmtMoney(orderBalance(o), o.currency)}
              </span>
            </div>
          </div>
          <Chip tone={statusTone[o.status]}>{o.status.replace('-', ' ')}</Chip>
        </div>
        <div className="mt-2 flex gap-2">
          {!isLast && (
            <Button variant="secondary" className="!py-1 text-xs" onClick={() => advance(o)}>
              ▸ {ORDER_STATUSES[ORDER_STATUSES.indexOf(o.status) + 1].replace('-', ' ')}
            </Button>
          )}
          <Button variant="ghost" className="!py-1 text-xs" onClick={() => share(o)}>
            {copied === o.id ? '✓ Copied' : '📋 Copy summary'}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <h1 className="mb-3 text-xl font-bold">Pre-orders</h1>
      {orders.length === 0 && (
        <Empty text="No orders yet. Add customer pre-orders with deposits before you fly." />
      )}
      <div className="space-y-2">{[...active].reverse().map(renderOrder)}</div>
      {settled.length > 0 && (
        <>
          <h2 className="mb-2 mt-5 text-sm font-semibold text-slate-500">Settled</h2>
          <div className="space-y-2 opacity-60">{[...settled].reverse().map(renderOrder)}</div>
        </>
      )}
      <Fab onClick={() => setCreating(true)} />
      <OrderForm
        open={creating || editing !== null}
        order={editing}
        onClose={() => {
          setCreating(false)
          setEditing(null)
        }}
      />
    </div>
  )
}

function OrderForm({
  open,
  order,
  onClose,
}: {
  open: boolean
  order: Order | null
  onClose: () => void
}) {
  const { products, customers, trips } = useStore()
  const upsertOrder = useStore((s) => s.upsertOrder)
  const deleteOrder = useStore((s) => s.deleteOrder)
  const upsertCustomer = useStore((s) => s.upsertCustomer)

  const blank: Order = {
    id: '',
    customerId: '',
    productId: '',
    qty: 1,
    agreedPrice: 0,
    deposit: 0,
    currency: 'EGP',
    paymentMethod: 'Instapay',
    status: 'requested',
    tripId: undefined,
    createdAt: new Date().toISOString(),
  }
  const [form, setForm] = useState<Order>(blank)
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' })
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  const key = order?.id ?? (open ? 'new' : null)
  if (open && key !== loadedFor) {
    setForm(order ?? blank)
    setNewCustomer({ name: '', phone: '' })
    setLoadedFor(key)
  }
  if (!open && loadedFor !== null) setLoadedFor(null)

  const set = <K extends keyof Order>(k: K, v: Order[K]) => setForm((f) => ({ ...f, [k]: v }))

  const isNewCustomer = form.customerId === '__new__'

  const save = () => {
    if (!form.productId || form.agreedPrice <= 0) return
    let customerId = form.customerId
    if (isNewCustomer) {
      if (!newCustomer.name.trim()) return
      customerId = uid()
      upsertCustomer({ id: customerId, name: newCustomer.name.trim(), phone: newCustomer.phone.trim() })
    }
    if (!customerId) return
    upsertOrder({ ...form, customerId, id: form.id || uid() })
    onClose()
  }

  const selectedProduct = products.find((p) => p.id === form.productId)
  const halfDeposit =
    form.currency === 'EGP'
      ? Math.round((form.agreedPrice * form.qty) / 2)
      : Math.round((form.agreedPrice * form.qty) / 2 + Number.EPSILON)

  return (
    <Modal open={open} onClose={onClose} title={order ? 'Edit order' : 'New pre-order'}>
      <div className="space-y-3">
        <Field label="Customer">
          <select
            className={inputCls}
            value={form.customerId}
            onChange={(e) => set('customerId', e.target.value)}
          >
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.phone && `(${c.phone})`}
              </option>
            ))}
            <option value="__new__">+ New customer…</option>
          </select>
        </Field>
        {isNewCustomer && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <input
                className={inputCls}
                value={newCustomer.name}
                onChange={(e) => setNewCustomer((c) => ({ ...c, name: e.target.value }))}
              />
            </Field>
            <Field label="Phone / WhatsApp">
              <input
                className={inputCls}
                inputMode="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer((c) => ({ ...c, phone: e.target.value }))}
              />
            </Field>
          </div>
        )}
        <Field label="Product">
          <select
            className={inputCls}
            value={form.productId}
            onChange={(e) => {
              const p = products.find((x) => x.id === e.target.value)
              setForm((f) => ({
                ...f,
                productId: e.target.value,
                agreedPrice: f.agreedPrice || p?.sellPrice || 0,
                currency: p?.sellCurrency ?? f.currency,
              }))
            }}
          >
            <option value="">Select product…</option>
            {[...products]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} — {p.name}
                </option>
              ))}
          </select>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Quantity">
            <input
              className={inputCls}
              type="number"
              inputMode="numeric"
              min={1}
              value={form.qty || ''}
              onChange={(e) => set('qty', Math.max(1, Number(e.target.value)))}
            />
          </Field>
          <Field label="Price / unit">
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              min={0}
              value={form.agreedPrice || ''}
              onChange={(e) => set('agreedPrice', Number(e.target.value))}
            />
          </Field>
          <Field label="Currency">
            <select
              className={inputCls}
              value={form.currency}
              onChange={(e) => set('currency', e.target.value as MoneyCurrency)}
            >
              {MONEY_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {selectedProduct && (
          <div className="text-xs text-slate-500">
            Catalog sell price: {fmtMoney(selectedProduct.sellPrice, selectedProduct.sellCurrency)}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Deposit received (${form.currency})`}>
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              min={0}
              value={form.deposit || ''}
              onChange={(e) => set('deposit', Number(e.target.value))}
            />
          </Field>
          <Field label="Payment method">
            <select
              className={inputCls}
              value={form.paymentMethod}
              onChange={(e) => set('paymentMethod', e.target.value as PaymentMethod)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {form.agreedPrice > 0 && (
          <button className="text-xs text-sky-400" onClick={() => set('deposit', halfDeposit)}>
            Set 50% deposit → {fmtMoney(halfDeposit, form.currency)}
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => set('status', e.target.value as OrderStatus)}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('-', ' ')}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Link to trip">
            <select
              className={inputCls}
              value={form.tripId ?? ''}
              onChange={(e) => set('tripId', e.target.value || undefined)}
            >
              <option value="">None</option>
              {trips
                .filter((t) => t.status !== 'done')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.destination}
                  </option>
                ))}
            </select>
          </Field>
        </div>
        <div className="flex gap-2 pt-1">
          <Button onClick={save} className="flex-1">
            Save order
          </Button>
          {order && (
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('Delete this order?')) {
                  deleteOrder(order.id)
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
