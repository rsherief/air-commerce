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
  notes: 'Seeded estimate — verify prices',
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
) => p(id, name, brand, category, 'to-egypt', sourceRegion, sourceStore, buyPrice, buyCurrency, sellPriceEGP, 'EGP', weightGrams)

export const seedProducts: Product[] = [
  // ── Sell abroad: Egyptian goods carried out of Egypt ─────
  p('seed-eg-01', 'Corona Chocolate Box (24 bars)', 'Corona', 'food', 'from-egypt', 'Egypt', 'Local supermarket', 350, 'EGP', 18, 'GBP', 700),
  p('seed-eg-02', 'Premium Siwa Dates 1kg', 'Siwa', 'food', 'from-egypt', 'Egypt', 'Local market', 250, 'EGP', 15, 'GBP', 1100),
  p('seed-eg-03', 'Karkade (Hibiscus) 500g', 'Aswan', 'food', 'from-egypt', 'Egypt', 'Spice market', 120, 'EGP', 9, 'GBP', 550),
  p('seed-eg-04', 'Halawa Tahini 700g', 'El Rashidi El Mizan', 'food', 'from-egypt', 'Egypt', 'Local supermarket', 180, 'EGP', 12, 'GBP', 750),
  p('seed-eg-05', 'Dukkah Spice Mix 250g', 'Local blend', 'food', 'from-egypt', 'Egypt', 'Spice market', 90, 'EGP', 8, 'GBP', 300),
  p('seed-eg-06', 'Dried Molokhia 200g', 'Local', 'food', 'from-egypt', 'Egypt', 'Local market', 60, 'EGP', 6, 'GBP', 250),
  p('seed-eg-07', 'Egyptian Cotton Towel Set (3pc)', 'Egyptian cotton', 'home', 'from-egypt', 'Egypt', 'Cotton outlet', 900, 'EGP', 35, 'GBP', 1200),
  p('seed-eg-08', 'Egyptian Cotton Bed Sheets (queen)', 'Egyptian cotton', 'home', 'from-egypt', 'Egypt', 'Cotton outlet', 1400, 'EGP', 55, 'GBP', 1500),
  p('seed-eg-09', 'Papyrus Artwork (medium)', 'Handmade', 'collectibles', 'from-egypt', 'Egypt', 'Khan el-Khalili', 150, 'EGP', 15, 'USD', 100),
  p('seed-eg-10', 'Mango Juice Cans (12-pack)', 'Juhayna', 'food', 'from-egypt', 'Egypt', 'Local supermarket', 240, 'EGP', 14, 'GBP', 4200),

  // ── Bring to Egypt: Perfume ──────────────────────────────
  imp('seed-pf-01', 'Baccarat Rouge 540 EDP 70ml', 'Maison Francis Kurkdjian', 'perfume', 'France', 'CDG Duty Free', 240, 'EUR', 19500, 550),
  imp('seed-pf-02', 'Layton EDP 125ml', 'Parfums de Marly', 'perfume', 'France', 'Paris Duty Free', 200, 'EUR', 16500, 700),
  imp('seed-pf-03', 'Delina EDP 75ml', 'Parfums de Marly', 'perfume', 'France', 'Paris Duty Free', 190, 'EUR', 15500, 600),
  imp('seed-pf-04', 'Aventus EDP 100ml', 'Creed', 'perfume', 'UK', 'Heathrow Duty Free', 285, 'GBP', 26500, 700),
  imp('seed-pf-05', 'Ombré Leather EDP 100ml', 'Tom Ford', 'perfume', 'UK', 'TK Maxx', 95, 'GBP', 9500, 600),
  imp('seed-pf-06', 'Santal 33 EDP 50ml', 'Le Labo', 'perfume', 'France', 'Le Labo Paris', 190, 'EUR', 15500, 450),
  imp('seed-pf-07', 'Good Girl EDP 80ml', 'Carolina Herrera', 'perfume', 'UK', 'TK Maxx', 68, 'GBP', 7200, 600),
  imp('seed-pf-08', 'Khamrah EDP 100ml', 'Lattafa', 'perfume', 'Dubai', 'Dubai Mall', 95, 'AED', 2400, 700),
  imp('seed-pf-09', 'Bleu de Chanel Parfum 100ml', 'Chanel', 'perfume', 'Dubai', 'Dubai Duty Free', 430, 'AED', 12500, 650),

  // ── Bring to Egypt: Skincare ─────────────────────────────
  imp('seed-sk-01', 'Foaming Facial Cleanser 473ml', 'CeraVe', 'skincare', 'Germany', 'DM / Rossmann', 12, 'EUR', 1450, 550),
  imp('seed-sk-02', 'Moisturising Cream 454g', 'CeraVe', 'skincare', 'Germany', 'DM / Rossmann', 13, 'EUR', 1550, 520),
  imp('seed-sk-03', 'Niacinamide 10% + Zinc 1% 30ml', 'The Ordinary', 'skincare', 'UK', 'Boots', 6, 'GBP', 800, 90),
  imp('seed-sk-04', 'Glycolic Acid 7% Toner 240ml', 'The Ordinary', 'skincare', 'UK', 'Boots', 9, 'GBP', 1100, 320),
  imp('seed-sk-05', 'Sensibio H2O Micellar 500ml', 'Bioderma', 'skincare', 'France', 'City Pharma', 11, 'EUR', 1300, 560),
  imp('seed-sk-06', 'Anthelios UVMune SPF50+ 50ml', 'La Roche-Posay', 'skincare', 'France', 'City Pharma', 12, 'EUR', 1450, 90),
  imp('seed-sk-07', 'Effaclar Duo+ M 40ml', 'La Roche-Posay', 'skincare', 'France', 'City Pharma', 14, 'EUR', 1550, 80),
  imp('seed-sk-08', 'Cicalfate+ Repair Cream 100ml', 'Avène', 'skincare', 'France', 'City Pharma', 10, 'EUR', 1200, 140),
  imp('seed-sk-09', 'Huile Prodigieuse 100ml', 'Nuxe', 'skincare', 'France', 'City Pharma', 15, 'EUR', 1650, 250),
  imp('seed-sk-10', 'Lait-Crème Concentré 75ml', 'Embryolisse', 'skincare', 'France', 'City Pharma', 12, 'EUR', 1350, 120),
  imp('seed-sk-11', 'Relief Sun SPF50+ 50ml', 'Beauty of Joseon', 'skincare', 'Korea', 'Olive Young', 12, 'USD', 1000, 80),
  imp('seed-sk-12', 'Advanced Snail 96 Essence 100ml', 'COSRX', 'skincare', 'Korea', 'Olive Young', 14, 'USD', 1150, 200),
  imp('seed-sk-13', 'Heartleaf 77% Soothing Toner 250ml', 'Anua', 'skincare', 'Korea', 'Olive Young', 18, 'USD', 1500, 350),
  imp('seed-sk-14', 'Skin Perfecting 2% BHA 118ml', "Paula's Choice", 'skincare', 'USA', 'Sephora / Ulta', 32, 'USD', 2700, 180),
  imp('seed-sk-15', 'C E Ferulic Serum 30ml', 'SkinCeuticals', 'skincare', 'USA', 'Dermstore', 165, 'USD', 12500, 150),

  // ── Bring to Egypt: Cosmetics ────────────────────────────
  imp('seed-cm-01', 'Bum Bum Cream 240ml', 'Sol de Janeiro', 'cosmetics', 'USA', 'Sephora', 48, 'USD', 4300, 350),
  imp('seed-cm-02', 'Perfume Mist 62 240ml', 'Sol de Janeiro', 'cosmetics', 'USA', 'Sephora', 38, 'USD', 3500, 320),
  imp('seed-cm-03', 'Lip Sleeping Mask 20g', 'Laneige', 'cosmetics', 'USA', 'Sephora', 24, 'USD', 2100, 60),
  imp('seed-cm-04', 'Soft Pinch Liquid Blush', 'Rare Beauty', 'cosmetics', 'USA', 'Sephora', 23, 'USD', 2200, 80),
  imp('seed-cm-05', 'Hollywood Flawless Filter 34ml', 'Charlotte Tilbury', 'cosmetics', 'UK', 'Boots / CT.com', 39, 'GBP', 4600, 120),
  imp('seed-cm-06', 'Gloss Bomb Lip Luminizer', 'Fenty Beauty', 'cosmetics', 'USA', 'Sephora', 21, 'USD', 1900, 70),
  imp('seed-cm-07', 'D-Bronzi Bronzing Drops 30ml', 'Drunk Elephant', 'cosmetics', 'USA', 'Sephora', 38, 'USD', 3700, 100),

  // ── Bring to Egypt: Supplements ──────────────────────────
  imp('seed-sp-01', 'Gold Standard Whey 5lb', 'Optimum Nutrition', 'supplements', 'USA', 'Costco / Vitamin Shoppe', 75, 'USD', 7000, 2400),
  imp('seed-sp-02', 'Micronised Creatine 500g', 'Optimum Nutrition', 'supplements', 'USA', 'Vitamin Shoppe', 30, 'USD', 2900, 600),
  imp('seed-sp-03', 'Impact Whey 2.5kg', 'Myprotein', 'supplements', 'UK', 'Myprotein / Sports Direct', 55, 'GBP', 6500, 2600),
  imp('seed-sp-04', 'Omega-3 240 softgels', 'California Gold Nutrition', 'supplements', 'USA', 'iHerb', 20, 'USD', 2000, 350),
  imp('seed-sp-05', 'Centrum Adults 200ct', 'Centrum', 'supplements', 'USA', 'Costco', 15, 'USD', 1600, 300),
  imp('seed-sp-06', 'Magnesium Glycinate 240ct', "Doctor's Best", 'supplements', 'USA', 'iHerb', 22, 'USD', 2100, 320),
  imp('seed-sp-07', 'Collagen Peptides 567g', 'Vital Proteins', 'supplements', 'USA', 'Costco', 43, 'USD', 4000, 650),

  // ── Bring to Egypt: Baby ─────────────────────────────────
  imp('seed-bb-01', 'Combiotik Stage 1 800g', 'HiPP', 'baby', 'Germany', 'DM / Rossmann', 17, 'EUR', 2000, 900),
  imp('seed-bb-02', 'Pronutra Stage 1 800g', 'Aptamil', 'baby', 'Germany', 'DM / Müller', 19, 'EUR', 2200, 900),
  imp('seed-bb-03', 'Classic Stage 1 900g', 'Kendamil', 'baby', 'UK', 'Boots / Tesco', 15, 'GBP', 2000, 1000),

  // ── Bring to Egypt: Tech accessories ─────────────────────
  imp('seed-tc-01', 'AirPods Pro 2 (USB-C)', 'Apple', 'tech', 'USA', 'Costco / Best Buy', 199, 'USD', 16500, 300),
  imp('seed-tc-02', 'Watch Sport Band', 'Apple', 'tech', 'USA', 'Apple Store', 45, 'USD', 3900, 120),
  imp('seed-tc-03', 'MagSafe Charger 1m', 'Apple', 'tech', 'USA', 'Apple Store', 39, 'USD', 3400, 150),
  imp('seed-tc-04', '20W USB-C Power Adapter', 'Apple', 'tech', 'USA', 'Apple Store', 19, 'USD', 1700, 100),
  imp('seed-tc-05', 'Nano 65W GaN Charger', 'Anker', 'tech', 'USA', 'Amazon / Best Buy', 36, 'USD', 3100, 180),
  imp('seed-tc-06', 'PowerCore 10K Power Bank', 'Anker', 'tech', 'USA', 'Amazon / Best Buy', 25, 'USD', 2300, 250),
  imp('seed-tc-07', 'Nexode 100W GaN Charger', 'UGREEN', 'tech', 'USA', 'Amazon', 45, 'USD', 3900, 260),
  imp('seed-tc-08', 'AirTag 4-Pack', 'Apple', 'tech', 'Dubai', 'Dubai Duty Free', 319, 'AED', 7000, 150),

  // ── Bring to Egypt: Fashion ──────────────────────────────
  imp('seed-fs-01', 'Samba OG', 'Adidas', 'fashion', 'UK', 'JD Sports / Outlet', 90, 'GBP', 9000, 900),
  imp('seed-fs-02', '550 White/Green', 'New Balance', 'fashion', 'USA', 'Nike/NB Outlet', 110, 'USD', 9800, 1000),
  imp('seed-fs-03', 'Wayfarer Classic', 'Ray-Ban', 'fashion', 'Italy', 'The Mall Firenze Outlet', 90, 'EUR', 8200, 250),
  imp('seed-fs-04', 'Dunk Low Panda', 'Nike', 'fashion', 'USA', 'Nike Outlet / StockX', 100, 'USD', 9200, 950),
  imp('seed-fs-05', '2-Piece Suit', 'Primark', 'fashion', 'UK', 'Primark', 45, 'GBP', 4500, 1500),

  // ── Bring to Egypt: Collectibles ─────────────────────────
  imp('seed-cl-01', 'Labubu Big Into Energy (blind box)', 'Pop Mart', 'collectibles', 'China/HK', 'Pop Mart Flagship', 15, 'USD', 2600, 150),
  imp('seed-cl-02', 'Sonny Angel (blind box)', 'Sonny Angel', 'collectibles', 'Japan', 'Kiddy Land', 8, 'USD', 950, 60),
  imp('seed-cl-03', 'Quencher H2.0 40oz Tumbler', 'Stanley', 'collectibles', 'USA', 'Target', 45, 'USD', 4300, 900),
  imp('seed-cl-04', 'FreeSip 24oz Bottle', 'Owala', 'collectibles', 'USA', 'Target / Amazon', 28, 'USD', 2700, 400),
]
