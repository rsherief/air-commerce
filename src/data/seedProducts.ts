import type { MoneyCurrency, Product } from '../types'

// Seeded from the arbitrage research playbook (documents/compass_artifact_*.md).
// All prices are ESTIMATES — edit each product with real prices from your trips.
const p = (
  id: string,
  name: string,
  brand: string,
  category: Product['category'],
  direction: Product['direction'],
  sourceRegion: string,
  sourceStore: string,
  buyPrice: number,
  buyCurrency: MoneyCurrency,
  sellPrice: number,
  sellCurrency: MoneyCurrency,
  weightGrams: number,
  notes = 'Seeded estimate — verify prices',
): Product => ({
  id,
  name,
  brand,
  category,
  direction,
  sourceRegion,
  sourceStore,
  buyPrice,
  buyCurrency,
  sellPrice,
  sellCurrency,
  weightGrams,
  notes,
})

// Imports: bought abroad, sold in Egypt
const imp = (
  id: string,
  name: string,
  brand: string,
  category: Product['category'],
  sourceRegion: string,
  sourceStore: string,
  buyPrice: number,
  buyCurrency: MoneyCurrency,
  sellPriceEGP: number,
  weightGrams: number,
  notes?: string,
) => p(id, name, brand, category, 'to-egypt', sourceRegion, sourceStore, buyPrice, buyCurrency, sellPriceEGP, 'EGP', weightGrams, notes)

export const seedProducts: Product[] = [
  // ── Sell abroad: Egyptian goods carried out of Egypt ─────
  // Researched 2026-07-15 (see notes per item). Several eBay/Etsy pages returned 403s to
  // automated fetch, so some buy/sell figures remain unverified — flagged individually.
  p('seed-eg-01', 'Corona Chocolate Box (24 bars)', 'Corona', 'food', 'from-egypt', 'Egypt', 'Local supermarket', 350, 'EGP', 18, 'GBP', 700, 'Unverified: no confirmed 24-bar box SKU found at Egyptian retailers (only individual 35g bars, 23.50–37.99 EGP each); an eBay UK listing exists but its price could not be retrieved. Keeping estimate.'),
  p('seed-eg-02', 'Premium Siwa Dates 1kg', 'Siwa', 'food', 'from-egypt', 'Egypt', 'Local market', 250, 'EGP', 15, 'GBP', 1100, 'Unverified: Egypt price only extrapolated from smaller-pack listings (~93–121 EGP/kg, lower than this estimate but not a direct 1kg quote); no matching UK 1kg listing found. Keeping estimate.'),
  p('seed-eg-03', 'Karkade (Hibiscus) 500g', 'Aswan', 'food', 'from-egypt', 'Egypt', 'Spice market', 120, 'EGP', 9, 'GBP', 550, 'Unverified: both Egyptian (Organic Shop, Nefertiti) and UK (Oasis Market) product pages confirmed to exist but prices were blocked (403) or not returned. Keeping estimate.'),
  p('seed-eg-04', 'Halawa Tahini 700g', 'El Rashidi El Mizan', 'food', 'from-egypt', 'Egypt', 'Local supermarket', 140, 'EGP', 12, 'GBP', 750, 'Buy price confirmed: Hyperone.com.eg lists Halawa Plain 700g at 139.95 EGP (2026-07-15), lower than prior estimate. No UK resale listing found for this brand — sell price still formula-based.'),
  p('seed-eg-05', 'Dukkah Spice Mix 250g', 'Local blend', 'food', 'from-egypt', 'Egypt', 'Spice market', 90, 'EGP', 8, 'GBP', 300, "Unverified: dukkah is typically an unbranded spice-market blend with no standard SKU either side — only small 25–50g artisan listings found on Etsy/eBay, nothing at 250g to scale from. Keeping estimate."),
  p('seed-eg-06', 'Dried Molokhia 200g', 'Local', 'food', 'from-egypt', 'Egypt', 'Local market', 60, 'EGP', 4.5, 'GBP', 250, 'Sell price corrected: real UK branded listings (Sofra / Al Durra Dried Molokhia 200g via myjam.co.uk, 2026-07-15) price at £4.37–4.51, well below the prior 6 GBP estimate — updated to 4.50 GBP. Egypt buy price still unverified.'),
  p('seed-eg-07', 'Egyptian Cotton Towel Set (3pc)', 'Egyptian cotton', 'home', 'from-egypt', 'Egypt', 'Cotton outlet', 900, 'EGP', 10, 'GBP', 1200, 'Sell price corrected — and flagged: nearly 1,000 sold eBay UK "Egyptian cotton" towel-set listings cluster at £8–12, far below the prior 35 GBP estimate. At the real market price this item is UNPROFITABLE at the current 900 EGP buy cost (landed ~900 EGP vs. ~600 EGP revenue) — recommend either sourcing cheaper, repositioning as premium/handmade to justify a higher price, or dropping this SKU. Buy price unverified.'),
  p('seed-eg-08', 'Egyptian Cotton Bed Sheets (queen)', 'Egyptian cotton', 'home', 'from-egypt', 'Egypt', 'Cotton outlet', 1400, 'EGP', 55, 'GBP', 1500, 'Unverified, wide spread: generic eBay UK/US listings run far below this estimate while certified premium UK brands (Hampton & Astley) start at £218.99+ — no clean comparable found for a mid-tier personal-import set. Keeping estimate as a plausible mid-point, flagged uncertain.'),
  p('seed-eg-09', 'Papyrus Artwork (medium)', 'Handmade', 'collectibles', 'from-egypt', 'Egypt', 'Khan el-Khalili', 150, 'EGP', 18, 'USD', 100, 'Sell price nudged: real Etsy US papyrus-painting comparables run $15–25 typical (up to $40 for larger/quality pieces) — prior 15 USD sat at the low end, adjusted to 18 USD as a safer mid-range. Egypt buy price unverified (bazaar pricing isn\'t published online).'),
  p('seed-eg-10', 'Mango Juice Tetra Pack 235ml (12-pack)', 'Juhayna', 'food', 'from-egypt', 'Egypt', 'Local supermarket', 85, 'EGP', 14, 'GBP', 3000, "Renamed + corrected: Juhayna doesn't sell mango juice in cans — only 235ml tetra-paks and 1L cartons. Original \"12-pack of cans\" didn't match any real SKU or its own weight (4200g fit neither format cleanly). Re-based on the 235ml tetra-pack line (~7 EGP/pack via do2roma, ~85 EGP/12-pack; weight ~3000g incl. packaging) since a 12×1L case (~12-13kg) isn't practical to carry. No UK resale listing found — sell price still formula-based."),

  // ── Bring to Egypt: Perfume ──────────────────────────────
  // Researched 2026-07-15: niche/designer fragrances have thin P2P resale presence on
  // Egyptian classifieds (searches surfaced official retail shops, not individual resellers) —
  // buy prices and Egypt resale for pf-01/02/03/05/06/07/09 remain formula-based estimates.
  imp('seed-pf-01', 'Baccarat Rouge 540 EDP 70ml', 'Maison Francis Kurkdjian', 'perfume', 'France', 'CDG Duty Free', 240, 'EUR', 17000, 550, 'Buy price unverified for CDG specifically (MFK official EU price is the closest anchor, ~€240). No individual Egypt resale listing found — 25% markup formula applied.'),
  imp('seed-pf-02', 'Layton EDP 125ml', 'Parfums de Marly', 'perfume', 'France', 'Paris Duty Free', 200, 'EUR', 14200, 700, "Buy price unverified for Paris duty-free specifically — PDM's own site lists 125ml nearer €325, so 200 EUR may be understated. No individual Egypt resale listing found — 25% markup formula applied."),
  imp('seed-pf-03', 'Delina EDP 75ml', 'Parfums de Marly', 'perfume', 'France', 'Paris Duty Free', 190, 'EUR', 13450, 600, 'Buy price and Egypt resale unverified — no listing found. 25% markup formula applied.'),
  imp('seed-pf-04', 'Aventus EDP 100ml', 'Creed', 'perfume', 'UK', 'Heathrow Duty Free', 248, 'GBP', 6000, 700, 'Buy price confirmed live at boutique.heathrow.com (2026-07-15). Egypt resale ~6,000 EGP is an indirect anchor (mentioned inside a dubizzle.com.eg clone-perfume listing referencing "real Aventus" pricing) — medium confidence, not a direct listing.'),
  imp('seed-pf-05', 'Ombré Leather EDP 100ml', 'Tom Ford', 'perfume', 'UK', 'TK Maxx', 95, 'GBP', 7850, 600, 'TK Maxx publishes no price list (off-price, in-store, rotating stock); 95 GBP is plausible vs UK full retail (£100–120) at TK Maxx\'s typical discount, but unconfirmed. No individual Egypt resale listing found — 25% markup formula applied.'),
  imp('seed-pf-06', 'Santal 33 EDP 50ml', 'Le Labo', 'perfume', 'France', 'Le Labo Paris', 190, 'EUR', 13450, 450, 'Buy price unverified this pass (Le Labo has no duty-free discount, uniform boutique pricing). No individual Egypt resale listing found — 25% markup formula applied.'),
  imp('seed-pf-07', 'Good Girl EDP 80ml', 'Carolina Herrera', 'perfume', 'UK', 'TK Maxx', 68, 'GBP', 5600, 600, 'TK Maxx publishes no price list; 68 GBP is plausible vs UK full retail (£78–125) but unconfirmed. Egypt official retail runs ~1,215–1,690 EGP (Amazon.eg) but no individual reseller listing found — 25% markup formula applied.'),
  imp('seed-pf-08', 'Khamrah EDP 100ml', 'Lattafa', 'perfume', 'Dubai', 'Dubai Mall', 91, 'AED', 1750, 700, 'Buy price confirmed in UAE retail range (Carrefour/Noon UAE, AED 76–102, 2026-07-15). Egypt resale confirmed via a live individual dubizzle.com.eg listing (ID 201288894) — high confidence, real reseller price, undercuts official Egypt retail (~1,420–1,550 EGP).'),
  imp('seed-pf-09', 'Bleu de Chanel Parfum 100ml', 'Chanel', 'perfume', 'Dubai', 'Dubai Duty Free', 430, 'AED', 7700, 650, 'Buy price flagged: 430 AED looks low vs general UAE retail for Parfum concentration (AED 515–794) — possible EDT/Parfum mix-up in original estimate, unresolved. No individual Egypt resale listing found — 25% markup formula applied.'),

  // ── Bring to Egypt: Skincare ─────────────────────────────
  // Researched 2026-07-15/16: buy prices freshly sourced (City Pharma/Olive Young direct
  // fetch mostly). Real finding — zero Egypt P2P resale listings found for ANY of these 15
  // across ~15 query variations (Arabic + English, OLX/dubizzle/FB Marketplace); every query
  // surfaced only official retail (Jumia/Noon/Chefaa/Cosmo Store). Sell prices stay formula-based.
  imp('seed-sk-01', 'Foaming Facial Cleanser 473ml', 'CeraVe', 'skincare', 'Germany', 'DM / Rossmann', 11.75, 'EUR', 850, 550, 'Buy price sourced dm.de/aggregators (€10.84–12.59 range), 2026-07-16. No Egypt resale listing found.'),
  imp('seed-sk-02', 'Moisturising Cream 454g', 'CeraVe', 'skincare', 'Germany', 'DM / Rossmann', 15.99, 'EUR', 1150, 520, 'Buy price sourced rossmann.de, 2026-07-16 (notably higher than prior estimate). No Egypt resale listing found.'),
  imp('seed-sk-03', 'Niacinamide 10% + Zinc 1% 30ml', 'The Ordinary', 'skincare', 'UK', 'Boots', 5, 'GBP', 400, 90, 'Buy price sourced via UK retailer aggregate (£4.94–6.00 range), not confirmed Boots-direct — medium-low confidence. No Egypt resale listing found.'),
  imp('seed-sk-04', 'Glycolic Acid 7% Toner 240ml', 'The Ordinary', 'skincare', 'UK', 'Boots', 11.9, 'GBP', 1000, 320, 'Buy price sourced Boots.com aggregate, 2026-07-16. No Egypt resale listing found.'),
  imp('seed-sk-05', 'Sensibio H2O Micellar 500ml', 'Bioderma', 'skincare', 'France', 'City Pharma', 9.49, 'EUR', 650, 560, "Buy price confirmed via direct City Pharma fetch (listed as \"Créaline H2O\" — Bioderma's EU/French name for the same export product \"Sensibio H2O\", not a substitution). No Egypt resale listing found."),
  imp('seed-sk-06', 'Anthelios UVMune SPF50+ 50ml', 'La Roche-Posay', 'skincare', 'France', 'City Pharma', 10.48, 'EUR', 750, 90, 'Buy price confirmed via direct City Pharma fetch (current line renamed "UVMune 400", same product family). No Egypt resale listing found.'),
  imp('seed-sk-07', 'Effaclar Duo+ M 40ml', 'La Roche-Posay', 'skincare', 'France', 'City Pharma', 13.39, 'EUR', 950, 80, 'Buy price confirmed via direct City Pharma fetch, 2026-07-16. No Egypt resale listing found.'),
  imp('seed-sk-08', 'Cicalfate+ Repair Cream 100ml', 'Avène', 'skincare', 'France', 'City Pharma', 12.98, 'EUR', 900, 140, 'Buy price confirmed via direct City Pharma fetch, 2026-07-16. No Egypt resale listing found.'),
  imp('seed-sk-09', 'Huile Prodigieuse 100ml', 'Nuxe', 'skincare', 'France', 'City Pharma', 21.49, 'EUR', 1500, 250, "Buy price sourced via secondary aggregator (City Pharma's own page had a pricing-widget glitch) — medium confidence. No Egypt resale listing found."),
  imp('seed-sk-10', 'Lait-Crème Concentré 75ml', 'Embryolisse', 'skincare', 'France', 'City Pharma', 16.89, 'EUR', 1200, 120, 'Buy price confirmed via direct City Pharma fetch, 2026-07-16. No Egypt resale listing found.'),
  imp('seed-sk-11', 'Relief Sun SPF50+ 50ml', 'Beauty of Joseon', 'skincare', 'Korea', 'Olive Young', 16.2, 'USD', 1050, 80, "Buy price sourced via Stylevana as a proxy retailer — Olive Young Korea's own USD checkout price didn't surface directly, medium confidence. No Egypt resale listing found."),
  imp('seed-sk-12', 'Advanced Snail 96 Essence 100ml', 'COSRX', 'skincare', 'Korea', 'Olive Young', 20.9, 'USD', 1350, 200, 'Buy price confirmed via direct us.oliveyoung.com fetch, 2026-07-16. No Egypt resale listing found.'),
  imp('seed-sk-13', 'Heartleaf 77% Soothing Toner 250ml', 'Anua', 'skincare', 'Korea', 'Olive Young', 21, 'USD', 1400, 350, 'Buy price confirmed via direct us.oliveyoung.com fetch (list $22, current sale $21), 2026-07-16. No Egypt resale listing found.'),
  imp('seed-sk-14', 'Skin Perfecting 2% BHA 118ml', "Paula's Choice", 'skincare', 'USA', 'Sephora / Ulta', 32, 'USD', 2100, 180, 'Buy price NOT reverified this pass (tool outage mid-research) — kept as prior estimate, which is plausible vs. typical $30–35 retail for this size.'),
  imp('seed-sk-15', 'C E Ferulic Serum 30ml', 'SkinCeuticals', 'skincare', 'USA', 'Dermstore', 165, 'USD', 10850, 150, 'Buy price NOT reverified this pass (tool outage mid-research) — kept as prior estimate, which is plausible vs. typical $166–182 retail.'),

  // ── Bring to Egypt: Cosmetics ────────────────────────────
  // Buy prices researched 2026-07-16 via official brand-site fetches. Egypt resale research
  // for this category was interrupted by a tool outage before it started — see product notes.
  imp('seed-cm-01', 'Bum Bum Cream 240ml', 'Sol de Janeiro', 'cosmetics', 'USA', 'Sephora', 48, 'USD', 3150, 350, 'Buy price confirmed via soldejaneiro.com official page, matches prior estimate exactly. No individual Egypt reseller listing found — OLX/dubizzle/Facebook aren\'t search-indexable at the listing level for branded cosmetics; formal Egypt importer retail (~599-999 EGP incl. customs) exists but excluded per instructions. Sell price stays formula-based.'),
  imp('seed-cm-02', 'Perfume Mist 62 240ml', 'Sol de Janeiro', 'cosmetics', 'USA', 'Sephora', 39, 'USD', 2550, 320, 'Buy price confirmed via soldejaneiro.com official page, 2026-07-16. No individual Egypt reseller listing found — sell price stays formula-based.'),
  imp('seed-cm-03', 'Lip Sleeping Mask 20g', 'Laneige', 'cosmetics', 'USA', 'Sephora', 25, 'USD', 1650, 60, 'Buy price confirmed via us.laneige.com official page, 2026-07-16. No individual Egypt reseller listing found (a 169 EGP figure exists on Noon but is for a 3g mini, not this 20g size — discarded as a size mismatch). Sell price stays formula-based.'),
  imp('seed-cm-04', 'Soft Pinch Liquid Blush', 'Rare Beauty', 'cosmetics', 'USA', 'Sephora', 25, 'USD', 1650, 80, 'Buy price confirmed via rarebeauty.com official page, 2026-07-16. No individual Egypt reseller listing found — sell price stays formula-based.'),
  imp('seed-cm-05', 'Hollywood Flawless Filter 30ml', 'Charlotte Tilbury', 'cosmetics', 'UK', 'Boots / CT.com', 40, 'GBP', 3300, 120, 'Buy price and size corrected: confirmed via charlottetilbury.com official page — the real SKU is 30ml, not 34ml as originally seeded. No individual Egypt reseller listing found — sell price recomputed on formula.'),
  imp('seed-cm-06', 'Gloss Bomb Lip Luminizer', 'Fenty Beauty', 'cosmetics', 'USA', 'Sephora', 23, 'USD', 1500, 70, 'Buy price confirmed via fentybeauty.com official page (9ml full size), 2026-07-16 — higher than prior estimate. No individual Egypt reseller listing found — sell price stays formula-based.'),
  imp('seed-cm-07', 'D-Bronzi Bronzing Drops 30ml', 'Drunk Elephant', 'cosmetics', 'USA', 'Sephora', 39, 'USD', 2550, 100, 'Buy price confirmed via drunkelephant.com official page, 2026-07-16. No individual Egypt reseller listing found — sell price stays formula-based.'),

  // ── Bring to Egypt: Supplements ──────────────────────────
  imp('seed-sp-01', 'Gold Standard Whey 5lb', 'Optimum Nutrition', 'supplements', 'USA', 'Costco / Vitamin Shoppe', 61, 'USD', 4000, 2400, "Buy price size-normalized: Costco's smallest ON Gold Standard tub is actually 5.64lb ($63.99-74.99), no exact 5lb Costco SKU exists — scaled proportionally to a 5lb equivalent (~$61). No individual Egypt reseller listing found; formal importers (MF Supps, Cairo Gyms) sell at customs-inflated retail, excluded per instructions."),
  imp('seed-sp-02', 'Micronised Creatine 500g', 'Optimum Nutrition', 'supplements', 'USA', 'Vitamin Shoppe', 22, 'USD', 1450, 600, "Buy price size-normalized: ON's standard creatine size is actually 600g/1.32lb ($25.99 via iHerb), no 500g SKU found — scaled proportionally to 500g (~$22). No Egypt resale listing found."),
  imp('seed-sp-03', 'Impact Whey 2.5kg', 'Myprotein', 'supplements', 'UK', 'Myprotein / Sports Direct', 55, 'GBP', 4550, 2600, 'Buy price confirmed at RRP (£54.99, matches estimate) — but Myprotein is heavily promo-driven and frequently discounted to £30-36 via codes, worth watching for real purchases. No individual Egypt reseller listing found (generic "whey protein" dubizzle listings exist at 1,600-2,000 EGP but brand/size unconfirmed).'),
  imp('seed-sp-04', 'Omega-3 240 softgels', 'California Gold Nutrition', 'supplements', 'USA', 'iHerb', 14, 'USD', 900, 350, 'Buy price corrected: confirmed via iherb.com official listing at $14 (was $20). No Egypt resale listing found — sell price recomputed on formula.'),
  imp('seed-sp-05', 'Centrum Adults 200ct', 'Centrum', 'supplements', 'USA', 'Amazon', 14, 'USD', 900, 300, 'Source corrected: Costco does not carry a 200ct SKU (only 425ct at $24.99) — re-sourced to Amazon, which does stock 200ct at $13.99. No Egypt resale listing found — sell price recomputed on formula.'),
  imp('seed-sp-06', 'Magnesium Glycinate 240ct', "Doctor's Best", 'supplements', 'USA', 'iHerb', 22, 'USD', 1450, 320, 'Buy price could not be reverified — both iHerb and Walmart blocked price retrieval via search. Kept prior estimate. No Egypt resale listing found.'),
  imp('seed-sp-07', 'Collagen Peptides 567g', 'Vital Proteins', 'supplements', 'USA', 'Costco', 45, 'USD', 2950, 650, 'Buy price confirmed near the nearest standard size (19.3oz vs. seeded 20oz/567g, likely same SKU) via vitalproteins.com, 2026-07-16. No Egypt resale listing found.'),

  // ── Bring to Egypt: Baby ─────────────────────────────────
  // Formula resale is a known active Egypt market (a named Facebook group was identified —
  // "لبن اطفال بيع وشراء واستبدال في مصر" — but its posts are login-gated and not reachable
  // by search tools, so no P2P price could be pulled despite this being the highest-priority
  // category to check).
  imp('seed-bb-01', 'Combiotik Stage 1 800g', 'HiPP', 'baby', 'Germany', 'DM / Rossmann', 19.35, 'EUR', 1350, 900, "Buy price corrected: dm.de's standard HiPP Combiotik 1 is actually 600g (€16.25) — used the correctly-sized 800g comparable from Newpharma (~€19.35) instead. No Egypt resale listing found; the relevant Facebook group exists but isn't accessible to search tools."),
  imp('seed-bb-02', 'Pronutra Stage 1 800g', 'Aptamil', 'baby', 'Germany', 'DM / Müller', 19.95, 'EUR', 1400, 900, 'Buy price confirmed at the correct 800g size via dm.de, 2026-07-16 (slightly above prior estimate). No Egypt resale listing found — one used/partial-tin listing (250 EGP) was excluded as not comparable to a new sealed unit.'),
  imp('seed-bb-03', 'Classic Stage 1 900g', 'Kendamil', 'baby', 'UK', 'Boots / Tesco', 15, 'GBP', 1250, 1000, 'Buy price could not be reverified — Boots blocked by bot-detection, Tesco price not retrieved, only a dated £10 RRP reference found. Kept prior estimate. No Egypt resale listing found.'),

  // ── Bring to Egypt: Tech accessories ─────────────────────
  imp('seed-tc-01', 'AirPods Pro 2 (USB-C)', 'Apple', 'tech', 'USA', 'Costco / Best Buy', 199, 'USD', 8000, 300, 'Sell price corrected significantly: real dubizzle.com.eg individual-reseller listings across multiple cities (Heliopolis, Maadi, Alexandria, Giza, New Cairo) cluster around 6,500–9,500 EGP for "original" AirPods Pro 2 — set to the ~8,000 EGP median. Prior 13,050 EGP formula estimate was well above real market. Buy price confirmed at Costco/Walmart non-member ($199); Costco members get $149.99.'),
  imp('seed-tc-02', 'Watch Sport Band', 'Apple', 'tech', 'USA', 'Apple Store', 49, 'USD', 3200, 120, 'Buy price corrected: Apple raised the list price to $49 (was $45), confirmed via 9to5toys.com, 2026-07-16. No individual Egypt resale listing found for bands specifically — sell price recomputed on the formula from the new buy price.'),
  imp('seed-tc-03', 'MagSafe Charger 1m', 'Apple', 'tech', 'USA', 'Apple Store', 39, 'USD', 2550, 150, 'Buy price confirmed unchanged via apple.com, 2026-07-16. Egypt search only surfaced official Noon retail (~2,990 EGP) — explicitly not used per instructions (that reflects duty/markup, not personal resale). Sell price stays formula-based.'),
  imp('seed-tc-04', '20W USB-C Power Adapter', 'Apple', 'tech', 'USA', 'Apple Store', 19, 'USD', 1250, 100, 'Buy price confirmed unchanged via apple.com, 2026-07-16. No Egypt resale listing found.'),
  imp('seed-tc-05', 'Nano 65W GaN Charger', 'Anker', 'tech', 'USA', 'Amazon / Best Buy', 33, 'USD', 2150, 180, 'Buy price corrected: Anker rebranded this as "715/735 Charger (Nano II 65W)", confirmed list price $33 via anker.com, 2026-07-16. No Egypt reseller listing found (dubizzle surfaced only unrelated Anker laptop power banks) — sell price recomputed on formula.'),
  imp('seed-tc-06', 'PowerCore 10K Power Bank', 'Anker', 'tech', 'USA', 'Amazon / Best Buy', 25, 'USD', 1650, 250, 'Buy price confirmed close to estimate ($25-26, now marketed as "PowerCore Slim 10000"), 2026-07-16. No Egypt reseller listing found.'),
  imp('seed-tc-07', 'Nexode 100W GaN Charger', 'UGREEN', 'tech', 'USA', 'Amazon', 45, 'USD', 2950, 260, 'Buy price ambiguous: several near-identical UGREEN Nexode 100W SKUs (3/4/5-port, retractable-cable) span $33-$55 depending on variant — list price $54.99, frequent sale $33. Kept prior $45 estimate as a reasonable mid-point rather than pick one variant. No Egypt reseller listing found.'),
  imp('seed-tc-08', 'AirTag 4-Pack', 'Apple', 'tech', 'Dubai', 'Dubai Duty Free', 319, 'AED', 5700, 150, 'Buy price unconfirmed for Dubai Duty Free specifically — UAE general retail (Noon/Jumbo) runs 349-439 AED, somewhat above the 319 AED estimate; duty-free could plausibly undercut to that level but not verified directly. Only official Amazon.eg/Noon Egypt retail (1,030-2,009 EGP) found, not peer resale — kept formula estimate.'),

  // ── Bring to Egypt: Fashion ──────────────────────────────
  imp('seed-fs-01', 'Samba OG', 'Adidas', 'fashion', 'UK', 'JD Sports / Outlet', 95, 'GBP', 7850, 900, 'Buy price confirmed via jdsports.co.uk, 2026-07-16. Egypt search only surfaced official Adidas Egypt/Farfetch retail (10,999-13,707 EGP) — not used, per instructions; sell price stays formula-based.'),
  imp('seed-fs-02', '550 White/Green', 'New Balance', 'fashion', 'USA', 'Nike/NB Outlet', 120, 'USD', 7900, 1000, 'Buy price corrected: New Balance raised MSRP to $120 (was $110), confirmed via newbalance.com/StockX, 2026-07-16. No individual Egypt reseller listing found — sell price recomputed on formula.'),
  imp('seed-fs-03', 'Wayfarer Classic', 'Ray-Ban', 'fashion', 'Italy', 'The Mall Firenze Outlet', 90, 'EUR', 6400, 250, 'Buy price unconfirmed for the specific outlet (general Florence retail runs ~145 EUR full price; outlet stock typically undercuts that, so 90 EUR stays plausible but unverified). Egypt side: real dubizzle.com.eg individual listings found, but for "Ray-Ban sunglasses" broadly (not Wayfarer-specific, condition/authenticity unverified) — wide range 1,300-7,500 EGP. Too unspecific to confidently overwrite the formula estimate; kept as-is with this real range noted for reference.'),
  imp('seed-fs-04', 'Dunk Low Panda', 'Nike', 'fashion', 'USA', 'Nike Outlet / StockX', 115, 'USD', 7550, 950, 'Buy price corrected: retail has crept to $115-120 (was $100), confirmed via sneaker retail tracking, 2026-07-16. No individual Egypt reseller listing found (only Farfetch official retail) — sell price recomputed on formula.'),
  imp('seed-fs-05', '2-Piece Suit', 'Primark', 'fashion', 'UK', 'Primark', 45, 'GBP', 3700, 1500, "Buy price unconfirmed — Primark's site doesn't display prices without in-store location selection, and no reliable secondhand comparable was found either. Kept prior estimate entirely unverified. No Egypt resale data found."),

  // ── Bring to Egypt: Collectibles ─────────────────────────
  imp('seed-cl-01', 'Labubu Big Into Energy (blind box)', 'Pop Mart', 'collectibles', 'China/HK', 'Pop Mart Flagship', 28, 'USD', 1150, 150, 'Buy price corrected significantly: single boxes run $20-28 (was $15), confirmed via StockX/retailer case pricing, 2026-07-16. Egypt resale: directional data only (aggregated market summary, not a specific listing) puts regular boxes at 800-1,500 EGP, up to 5,000 for rare/secret editions — set to the ~1,150 EGP midpoint, medium confidence.'),
  imp('seed-cl-02', 'Sonny Angel (blind box)', 'Sonny Angel', 'collectibles', 'Japan', 'Kiddy Land', 20, 'USD', 1300, 60, 'Buy price corrected significantly: single boxes run ~$19-21 in Japan currently (was $8), confirmed via Japan blind-box retail guides, 2026-07-16. No individual Egypt reseller listing found (only official Sonny Angel Egypt store/UAE retail) — sell price recomputed on formula.'),
  imp('seed-cl-03', 'Quencher H2.0 40oz Tumbler', 'Stanley', 'collectibles', 'USA', 'Target', 45, 'USD', 2950, 900, 'Buy price confirmed exactly via target.com, 2026-07-16. Egypt search only surfaced official Jumia/Noon retail (2,490-8,000 EGP depending on SKU) — not used, per instructions; sell price stays formula-based.'),
  imp('seed-cl-04', 'FreeSip 24oz Bottle', 'Owala', 'collectibles', 'USA', 'Target / Amazon', 24, 'USD', 1600, 400, 'Buy price confirmed via target.com ($23.99, was $28), 2026-07-16. No individual Egypt reseller listing found (only branded owala-egypt.com retail) — sell price recomputed on formula.'),
]
