# Air Commerce — Project Summary

_Last updated: 2026-07-15_

## What it is

A personal-shopper / arbitrage tool for the user (an Egyptian airline crew member): buy goods
abroad on layovers, resell in Egypt (and, more recently, sell Egyptian goods abroad too — a
two-way trade flow). Built as a **single-user PWA** — no backend, no accounts — deliberately kept
simple for phase 1, with e-commerce/multi-user features planned for later.

Research/market notes live in `documents/compass_artifact_*.md` — treat any numbers in there as
unverified estimates (flagged `[VERIFY]` inline).

## Stack

- React + Vite + TypeScript + Tailwind CSS v4
- Zustand for state, persisted to `localStorage` (with versioned migrations)
- `vite-plugin-pwa` for installability
- No backend — JSON export/import (Settings screen) is the intended migration path to a future
  server-backed version

## App structure

- `src/screens/` — `Dashboard`, `Catalog`, `Trips`, `Orders`, `Settings` (tab-based nav via
  `components/TabBar.tsx`)
- `src/lib/margin.ts` — landed cost, profit, margin %, profit/kg, and suggested sell price math
- `src/lib/fx.ts` — EGP FX rate handling with manual overrides + safety buffer
- `src/lib/trip.ts` — trip helpers
- `src/lib/countries.ts` — 55 EgyptAir-network countries with emoji flags + served IATA codes
  (dropdown format: `🇸🇦 Saudi Arabia | RUH, JED, MED`)
- `src/store.ts` — Zustand store, versioned persistence/migrations
- `src/types.ts` — shared types (`Product`, `Settings`, `FxState`, trip/order types, etc.)

## Timeline (git history)

1. **`b496e21`** — Air Commerce v0.1: crew trip planner & pre-order PWA (initial build)
2. **`e7c97f6`** — Deploy v0.1 from local source
3. **`2128680`** — GitHub Pages deployment wired up (`DEPLOY_BASE` + `npm run deploy`)
4. **`fbe6d62`** — Two-way trade: sell Egyptian goods abroad, bring foreign goods back
5. **`0c6e690`** — deploy
6. **`64ce160`** — Trip origin/destination country selects + per-country flag badges
7. **`5679204`** — EgyptAir airport codes added to country selects (Option B format)
8. **`33a1a97`** — Merge remote main branch
9. **`b14d4b1`** — deploy
10. **`61bc615`** — Repo restructured: `main` = source, `gh-pages` = compiled/deployed site

**Live site:** https://rsherief.github.io/air-commerce/ (public repo `rsherief/air-commerce`).
`npm run deploy` rebuilds with `DEPLOY_BASE=/air-commerce/` and pushes `main:gh-pages` from the
*nested* git repo inside `dist/` — never push from inside `dist/` directly, and never merge the
two histories (an unrelated-histories merge once shipped a dev `index.html` → white page on prod).

## Current work in progress (uncommitted)

A traveler reviewer flagged two issues:

1. **Egypt sell prices were too high** — root cause: `suggestedSell()` in `src/lib/margin.ts`
   applied one flat markup regardless of destination market's purchasing power.
   **Fix:** `Settings` now has two separate markup fields —
   - `defaultMarkupPct` (abroad markets, 45%)
   - `defaultMarkupPctEgypt` (Egypt, 25% — an assumption, not measured; documented in the Settings
     UI, to be tuned from real buyer feedback)

   `suggestedSell()` now takes a `direction: Direction` argument and picks the markup based on
   whether the product is being sold `'to-egypt'` or abroad. Store persistence bumped to
   `version: 3` with a migration backfilling `defaultMarkupPctEgypt` via `defaultSettings` spread.

2. **Catalog should sort by margin** — Catalog screen now has a sort selector (Margin % /
   Profit per kg / Total profit), defaulting to Margin % descending. Note: `Trips.tsx`'s product
   picker intentionally still sorts by profit/kg only — it's a luggage-weight-constrained context,
   different from the storefront view.

3. **Seed catalog re-baselined** — the 25% Egypt markup only changes the *suggested* price for
   products added/edited going forward; it doesn't retroactively touch existing data (by design —
   we don't want to silently overwrite a real user's edited prices). So the 58 `to-egypt` seed
   products in `src/data/seedProducts.ts` were recomputed at +25% over landed cost (fallback FX
   rates, 5% buffer, rounded to nearest 50 EGP) to actually demonstrate the fix out of the box.
   Previously some (e.g. baby formula, CeraVe skincare) implied ~100–113% margins — now all sit at
   ~25%. `from-egypt` (sell-abroad) seed items were left untouched; the "too high for Egypt"
   feedback doesn't apply to goods priced for foreign markets.

**Files touched (not yet committed):** `src/lib/margin.ts`, `src/screens/Catalog.tsx`,
`src/screens/Settings.tsx`, `src/store.ts`, `src/types.ts`, `src/data/seedProducts.ts`.

**Note:** this file's earlier edits (everything above except point 3) were made by a separate
concurrent Claude Code session working the same repo at the same time — confirmed via `git diff`
and process inspection before touching anything, to avoid clobbering in-flight work.

## Known environment quirk

Node is only available via nvm at `~/.nvm/versions/node/v20.20.2/bin` — not on the non-interactive
PATH. `.claude/launch.json` wraps the dev server in `bash -c` with an explicit `PATH` export to
work around this.

## Planned later phases

- E-commerce features
- Multi-user / accounts (backend)
- Arabic / RTL support
- Payments
