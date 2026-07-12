import { useEffect, useState } from 'react'
import { useStore } from './store'
import { fetchRates } from './lib/fx'
import TabBar, { type Tab } from './components/TabBar'
import Dashboard from './screens/Dashboard'
import Catalog from './screens/Catalog'
import Trips from './screens/Trips'
import Orders from './screens/Orders'
import Settings from './screens/Settings'

const SIX_HOURS = 6 * 60 * 60 * 1000

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const setFx = useStore((s) => s.setFx)
  const fetchedAt = useStore((s) => s.fx.fetchedAt)

  useEffect(() => {
    const stale = !fetchedAt || Date.now() - new Date(fetchedAt).getTime() > SIX_HOURS
    if (stale) fetchRates().then((fx) => fx && setFx(fx))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-lg px-4 pt-4 pb-28">
        {tab === 'dashboard' && <Dashboard goTo={setTab} />}
        {tab === 'catalog' && <Catalog />}
        {tab === 'trips' && <Trips />}
        {tab === 'orders' && <Orders />}
        {tab === 'settings' && <Settings />}
      </div>
      <TabBar tab={tab} setTab={setTab} />
    </div>
  )
}
