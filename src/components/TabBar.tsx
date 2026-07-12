export type Tab = 'dashboard' | 'catalog' | 'trips' | 'orders' | 'settings'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'catalog', label: 'Catalog', icon: '🛍️' },
  { id: 'trips', label: 'Trips', icon: '✈️' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-900/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              tab === t.id ? 'text-sky-400' : 'text-slate-500'
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
