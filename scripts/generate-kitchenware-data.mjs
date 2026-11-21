// SYNTHETIC DEMONSTRATION DATA — UAE kitchenware price and assortment benchmark.
// The original study's observations are confidential. This script creates a realistic but entirely
// simulated dataset (seeded, so it is reproducible). Channels and brands are anonymised on purpose:
// no figure here is a real price, listing or rating from any named retailer or brand.
import { writeFileSync } from 'node:fs';

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(20260115);
const normal = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

export const CHANNELS = [
  { id: 'mp-a', name: 'Marketplace A', type: 'E-commerce marketplace', priceFactor: 0.92, discount: 0.18, assortment: 1.0 },
  { id: 'mp-b', name: 'Marketplace B', type: 'E-commerce marketplace', priceFactor: 0.95, discount: 0.15, assortment: 0.9 },
  { id: 'hyper', name: 'Hypermarket chain', type: 'Organised retail', priceFactor: 1.0, discount: 0.1, assortment: 0.55 },
  { id: 'show', name: 'Specialist showroom', type: 'Showroom', priceFactor: 1.18, discount: 0.06, assortment: 0.4 }
];
const CATEGORIES = [
  { id: 'cookware-sets', name: 'Cookware sets', base: 420, spread: 0.45 },
  { id: 'frying-pans', name: 'Non-stick frying pans', base: 95, spread: 0.4 },
  { id: 'pressure-cookers', name: 'Pressure cookers', base: 165, spread: 0.35 },
  { id: 'knives', name: 'Kitchen knives', base: 120, spread: 0.55 },
  { id: 'storage', name: 'Food storage', base: 60, spread: 0.4 },
  { id: 'bakeware', name: 'Bakeware', base: 75, spread: 0.4 }
];
const BRANDS = [
  { id: 'A', tier: 'Premium', factor: 1.6 }, { id: 'B', tier: 'Premium', factor: 1.4 },
  { id: 'C', tier: 'Mid-market', factor: 1.0 }, { id: 'D', tier: 'Mid-market', factor: 0.9 },
  { id: 'E', tier: 'Value', factor: 0.62 }, { id: 'F', tier: 'Value', factor: 0.55 }
];

const rows = [];
for (const c of CATEGORIES) for (const ch of CHANNELS) for (const b of BRANDS) {
  // Showrooms rarely carry value brands; hypermarkets carry fewer premium lines
  if (ch.id === 'show' && b.tier === 'Value') continue;
  if (ch.id === 'hyper' && b.id === 'A') continue;
  const skus = Math.max(1, Math.round((3 + rnd() * 9) * ch.assortment));
  for (let i = 0; i < skus; i++) {
    const list = Math.max(12, c.base * b.factor * ch.priceFactor * Math.exp(normal() * c.spread * 0.5));
    const onDeal = rnd() < (ch.discount * 2.2);
    const disc = onDeal ? Math.min(0.45, Math.max(0.05, ch.discount + normal() * 0.07)) : 0;
    const rating = ch.type === 'E-commerce marketplace' ? Math.min(5, Math.max(2.8, 4.1 + normal() * 0.35 + (b.tier === 'Premium' ? 0.15 : 0))) : null;
    rows.push({ category: c.id, channel: ch.id, brand: b.id, tier: b.tier, list_price_aed: Math.round(list), discount_pct: Math.round(disc * 100), selling_price_aed: Math.round(list * (1 - disc)), rating: rating && Math.round(rating * 10) / 10, in_stock: rnd() > (ch.type === 'Showroom' ? 0.08 : 0.12) });
  }
}

const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const by = (f) => rows.filter(f);
const summary = {
  observations: rows.length,
  medianByCategoryChannel: CATEGORIES.map((c) => ({ category: c.name, ...Object.fromEntries(CHANNELS.map((ch) => [ch.id, median(by((r) => r.category === c.id && r.channel === ch.id).map((r) => r.selling_price_aed))])) })),
  priceIndex: CHANNELS.map((ch) => {
    const ratios = CATEGORIES.map((c) => median(by((r) => r.category === c.id && r.channel === ch.id).map((r) => r.selling_price_aed)) / median(by((r) => r.category === c.id && r.channel === 'mp-a').map((r) => r.selling_price_aed)));
    return { channel: ch.name, index: Math.round(100 * ratios.reduce((s, x) => s + x, 0) / ratios.length) };
  }),
  channelStats: CHANNELS.map((ch) => {
    const r = by((x) => x.channel === ch.id);
    return { channel: ch.name, type: ch.type, skus: r.length, onDealPct: Math.round(100 * r.filter((x) => x.discount_pct > 0).length / r.length), avgDiscountWhenOnDeal: Math.round(r.filter((x) => x.discount_pct > 0).reduce((s, x) => s + x.discount_pct, 0) / Math.max(1, r.filter((x) => x.discount_pct > 0).length)), inStockPct: Math.round(100 * r.filter((x) => x.in_stock).length / r.length) };
  }),
  tierMix: CHANNELS.map((ch) => { const r = by((x) => x.channel === ch.id); return { channel: ch.name, Premium: Math.round(100 * r.filter((x) => x.tier === 'Premium').length / r.length), 'Mid-market': Math.round(100 * r.filter((x) => x.tier === 'Mid-market').length / r.length), Value: Math.round(100 * r.filter((x) => x.tier === 'Value').length / r.length) }; })
};
writeFileSync(new URL('../public/data/kitchenware_synthetic_observations.csv', import.meta.url),
  ['category,channel,brand,tier,list_price_aed,discount_pct,selling_price_aed,rating,in_stock', ...rows.map((r) => [r.category, CHANNELS.find((c) => c.id === r.channel).name, `Brand ${r.brand}`, r.tier, r.list_price_aed, r.discount_pct, r.selling_price_aed, r.rating ?? '', r.in_stock].join(','))].join('\n') + '\n');
writeFileSync(new URL('../src/data/kitchenware.json', import.meta.url), JSON.stringify({ note: 'Synthetic demonstration data generated by scripts/generate-kitchenware-data.mjs. Not real prices.', channels: CHANNELS.map(({ id, name, type }) => ({ id, name, type })), ...summary }, null, 2));
console.log(JSON.stringify(summary.priceIndex), JSON.stringify(summary.channelStats));
