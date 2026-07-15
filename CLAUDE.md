# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Air Commerce — a single-user PWA (no backend, no accounts) for an airline crew member who buys
goods on layovers to resell in Egypt, and also sells Egyptian goods abroad (two-way trade). Phase 1
is deliberately simple; multi-user/backend/Arabic-RTL/payments are out of scope until later phases.

## Commands

```bash
npm run dev      # start Vite dev server (port 5173)
npm run build    # tsc typecheck + vite build (this is the only "test" — there is no test suite)
npm run preview  # preview the production build locally
npm run deploy   # rebuild with DEPLOY_BASE=/air-commerce/ and push dist/ to gh-pages
```

There is no lint or test runner configured — `npm run build`'s `tsc` step (strict mode,
`noUnusedLocals`/`noUnusedParameters`) is the only automated check. Node is only available via nvm
at `~/.nvm/versions/node/v20.20.2/bin`, not the default non-interactive PATH — `.claude/launch.json`
wraps `npm run dev` in `bash -c` with an explicit `PATH` export for this reason; do the same if
invoking npm from a non-interactive shell.

### Deployment — read before touching `dist/` or running `npm run deploy`

The repo is structured so `main` holds source and `gh-pages` holds the compiled site, but `dist/`
itself is a **separate nested git repo** (its own `.git`, checked out to `gh-pages`, gitignored from
the outer repo). `npm run deploy` builds then commits/pushes *inside* `dist/`.
- Never run a plain `git push` from inside `dist/` outside of `npm run deploy`.
- Never merge the two histories (`main` and `gh-pages`) — an unrelated-histories merge once shipped
  the dev `index.html` to production, causing a white page.
- Live site: https://rsherief.github.io/air-commerce/

## Architecture

**State:** one Zustand store (`src/store.ts`) persisted to `localStorage` under key
`air-commerce-v1`, holding all domain data — `products`, `trips`, `tripItems`, `customers`,
`orders`, `settings`, plus in-memory `fx` (not persisted the same way — refetched on load if stale).
The store has a numbered `version` with a `migrate` function that upgrades old persisted shapes
in place (e.g. v1→v2 backfilled `trip.origin`, v2→v3 split markup settings) — bump `version` and add
a migration branch whenever a field is added/renamed on a persisted type, never just widen the type.
`ExportData` (the shape of `products`/`trips`/`tripItems`/`customers`/`orders`/`settings`) is also
the JSON export/import format in Settings — this is the intended migration path to a future backend,
so keep it in sync with persisted shape changes.

**Domain model — direction is the organizing concept.** Both `Product.direction` and
`Trip.direction` encode which way goods flow between Egypt and abroad (`'to-egypt'` /
`'from-egypt'` for products, `'round-trip' | 'outbound' | 'return'` for trips, see `src/types.ts`).
Money math, markup defaults, and UI badges all branch on this — when adding a feature that touches
pricing or trip logic, check whether it needs to be direction-aware.

**Money math (`src/lib/margin.ts` + `src/lib/fx.ts`) is the core business logic**, independent of
UI:
- `fx.ts` fetches EGP cross-rates from a public API (`open.er-api.com`) with hardcoded
  `FALLBACK_RATES` used until the first successful fetch (or if offline).
- `effectiveRate()` in `margin.ts` applies `settings.fxBufferPct` asymmetrically —
  inflating costs, deflating revenue — so displayed margins are always conservative, never
  dependent on a favorable rate swing.
- `suggestedSell()` picks between two configurable markup percentages
  (`settings.defaultMarkupPct` for abroad, `settings.defaultMarkupPctEgypt` for Egypt) keyed on
  `Direction`, because the same flat markup that works in higher-purchasing-power markets prices
  goods out of reach in Egypt. `defaultMarkupPctEgypt` is an unverified assumption (25%) meant to be
  tuned from real buyer feedback, not a measured figure.
- `productMetrics()` is the single source of truth for landed cost, revenue, profit, margin %, and
  profit/kg shown across screens — don't recompute these inline in a screen component.

**Screens (`src/screens/`)** are tab-routed from `App.tsx` (no router library — a `Tab` union +
`useState`, see `components/TabBar.tsx`). Each screen reads/writes directly from the Zustand store.
Note: `Catalog.tsx`'s sort (Margin % / Profit per kg / Total profit, defaulting to Margin %) is
intentionally separate from `Trips.tsx`'s product picker (always profit/kg) — the trip picker is
luggage-weight-constrained, a different optimization target from the storefront view.

**`src/lib/countries.ts`** holds the 55 EgyptAir-network countries used in origin/destination
selects, each with an emoji flag and served IATA codes, rendered as
`🇸🇦 Saudi Arabia | RUH, JED, MED`. Product/trip badges derive the "market" flag from currency/
direction rather than storing a separate market field — check this file before adding a new
country or airport code rather than hardcoding one in a screen.

## Reference material

`documents/compass_artifact_*.md` contains market research for the arbitrage opportunity — numbers
in it are unverified estimates (flagged `[VERIFY]` inline) rather than measured data.
