import type { MoneyCurrency } from '../types'

export interface Country {
  name: string
  flag: string
}

/** Common crew routes / sourcing countries. Emoji flags — no assets, no storage cost. */
export const COUNTRIES: Country[] = [
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'UK', flag: '🇬🇧' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Dubai', flag: '🇦🇪' },
  { name: 'UAE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Qatar', flag: '🇶🇦' },
  { name: 'Kuwait', flag: '🇰🇼' },
  { name: 'Jordan', flag: '🇯🇴' },
  { name: 'Lebanon', flag: '🇱🇧' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Korea', flag: '🇰🇷' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Canada', flag: '🇨🇦' },
]

/** City / spelling aliases → flag, for legacy free-text regions. */
const ALIASES: Record<string, string> = {
  cairo: '🇪🇬',
  paris: '🇫🇷',
  london: '🇬🇧',
  england: '🇬🇧',
  britain: '🇬🇧',
  'united kingdom': '🇬🇧',
  'united states': '🇺🇸',
  us: '🇺🇸',
  'new york': '🇺🇸',
  berlin: '🇩🇪',
  frankfurt: '🇩🇪',
  munich: '🇩🇪',
  rome: '🇮🇹',
  milan: '🇮🇹',
  madrid: '🇪🇸',
  amsterdam: '🇳🇱',
  istanbul: '🇹🇷',
  'abu dhabi': '🇦🇪',
  'united arab emirates': '🇦🇪',
  riyadh: '🇸🇦',
  jeddah: '🇸🇦',
  doha: '🇶🇦',
  tokyo: '🇯🇵',
  'south korea': '🇰🇷',
  seoul: '🇰🇷',
  bangkok: '🇹🇭',
}

export function flagFor(region: string): string {
  const q = region.trim().toLowerCase()
  const match = COUNTRIES.find((c) => c.name.toLowerCase() === q)
  return match?.flag ?? ALIASES[q] ?? '🌍'
}

/** Market flag for goods sold abroad, derived from the sell currency. */
export const CURRENCY_FLAG: Record<MoneyCurrency, string> = {
  EGP: '🇪🇬',
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  AED: '🇦🇪',
}
