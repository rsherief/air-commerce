import type { MoneyCurrency } from '../types'

export interface Country {
  name: string
  flag: string
  airports: string[]
}

export const COUNTRIES: Country[] = [
  // Home market (11 airports)
  { name: 'Egypt', flag: '🇪🇬', airports: ['CAI', 'HBE', 'SSH', 'HRG', 'LXR', 'ASW', 'RMF', 'ABS', 'ATZ', 'HMB', 'UVL'] },

  // Middle East / Gulf (12 countries, 23 airports)
  { name: 'Saudi Arabia', flag: '🇸🇦', airports: ['RUH', 'JED', 'MED', 'DMM', 'AHB', 'ELQ'] },
  { name: 'United Arab Emirates', flag: '🇦🇪', airports: ['DXB', 'AUH', 'SHJ'] },
  { name: 'Kuwait', flag: '🇰🇼', airports: ['KWI'] },
  { name: 'Qatar', flag: '🇶🇦', airports: ['DOH'] },
  { name: 'Bahrain', flag: '🇧🇭', airports: ['BAH'] },
  { name: 'Oman', flag: '🇴🇲', airports: ['MCT'] },
  { name: 'Jordan', flag: '🇯🇴', airports: ['AMM'] },
  { name: 'Lebanon', flag: '🇱🇧', airports: ['BEY'] },
  { name: 'Iraq', flag: '🇮🇶', airports: ['BGW', 'EBL'] },
  { name: 'Turkey', flag: '🇹🇷', airports: ['IST'] },
  { name: 'Cyprus', flag: '🇨🇾', airports: ['LCA'] },

  // Europe (18 countries, 38 airports)
  { name: 'United Kingdom', flag: '🇬🇧', airports: ['LHR', 'MAN', 'BHX'] },
  { name: 'Germany', flag: '🇩🇪', airports: ['FRA', 'MUC', 'BER', 'DUS'] },
  { name: 'France', flag: '🇫🇷', airports: ['CDG'] },
  { name: 'Italy', flag: '🇮🇹', airports: ['FCO', 'MXP', 'VCE'] },
  { name: 'Spain', flag: '🇪🇸', airports: ['MAD', 'BCN'] },
  { name: 'Netherlands', flag: '🇳🇱', airports: ['AMS'] },
  { name: 'Belgium', flag: '🇧🇪', airports: ['BRU'] },
  { name: 'Switzerland', flag: '🇨🇭', airports: ['GVA', 'ZRH'] },
  { name: 'Austria', flag: '🇦🇹', airports: ['VIE'] },
  { name: 'Greece', flag: '🇬🇷', airports: ['ATH'] },
  { name: 'Portugal', flag: '🇵🇹', airports: ['LIS'] },
  { name: 'Ireland', flag: '🇮🇪', airports: ['DUB'] },
  { name: 'Denmark', flag: '🇩🇰', airports: ['CPH'] },
  { name: 'Sweden', flag: '🇸🇪', airports: ['ARN'] },
  { name: 'Czech Republic', flag: '🇨🇿', airports: ['PRG'] },
  { name: 'Hungary', flag: '🇭🇺', airports: ['BUD'] },
  { name: 'Russia', flag: '🇷🇺', airports: ['DME'] },

  // Africa (20 countries, 28 airports)
  { name: 'Libya', flag: '🇱🇾', airports: ['MJI', 'BEN', 'MRA'] },
  { name: 'Tunisia', flag: '🇹🇳', airports: ['TUN'] },
  { name: 'Algeria', flag: '🇩🇿', airports: ['ALG'] },
  { name: 'Morocco', flag: '🇲🇦', airports: ['CMN'] },
  { name: 'Sudan', flag: '🇸🇩', airports: ['KRT', 'PZU'] },
  { name: 'South Sudan', flag: '🇸🇸', airports: ['JUB'] },
  { name: 'Ethiopia', flag: '🇪🇹', airports: ['ADD'] },
  { name: 'Eritrea', flag: '🇪🇷', airports: ['ASM'] },
  { name: 'Djibouti', flag: '🇩🇯', airports: ['JIB'] },
  { name: 'Somalia', flag: '🇸🇴', airports: ['MGQ'] },
  { name: 'Kenya', flag: '🇰🇪', airports: ['NBO'] },
  { name: 'Uganda', flag: '🇺🇬', airports: ['EBB'] },
  { name: 'Rwanda', flag: '🇷🇼', airports: ['KGL'] },
  { name: 'Tanzania', flag: '🇹🇿', airports: ['DAR', 'ZNZ'] },
  { name: 'South Africa', flag: '🇿🇦', airports: ['JNB'] },
  { name: 'DR Congo', flag: '🇨🇩', airports: ['FIH'] },
  { name: 'Nigeria', flag: '🇳🇬', airports: ['LOS', 'ABV', 'KAN'] },
  { name: 'Ghana', flag: '🇬🇭', airports: ['ACC'] },
  { name: 'Côte d\'Ivoire', flag: '🇨🇮', airports: ['ABJ'] },
  { name: 'Cameroon', flag: '🇨🇲', airports: ['DLA'] },
  { name: 'Chad', flag: '🇹🇩', airports: ['NDJ'] },

  // Asia (5 countries, 8 airports)
  { name: 'China', flag: '🇨🇳', airports: ['PEK', 'PVG', 'CAN', 'HGH'] },
  { name: 'India', flag: '🇮🇳', airports: ['DEL', 'BOM'] },
  { name: 'Bangladesh', flag: '🇧🇩', airports: ['DAC'] },
  { name: 'Indonesia', flag: '🇮🇩', airports: ['CGK'] },
  { name: 'Japan', flag: '🇯🇵', airports: ['NRT'] },

  // North America (2 countries, 5 airports)
  { name: 'United States', flag: '🇺🇸', airports: ['JFK', 'EWR', 'IAD', 'ORD', 'LAX'] },
  { name: 'Canada', flag: '🇨🇦', airports: ['YYZ'] },
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
  dubai: '🇦🇪',
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
