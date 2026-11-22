// Builds the two PDFs the site links to, from the same data the site uses:
//   public/cv/Rohith-Mohan-Market-Research-Analyst-CV.pdf  (from src/lib/site.ts)
//   public/reports/kitchenware-sample-report.pdf           (from src/data/kitchenware.json, synthetic)
// Usage: npm run pdfs   (needs Chrome/Chromium; set CHROME_PATH if it is not found)
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { site, experience, education, certifications, skillGroups } from '../src/lib/site.ts';

const root = new URL('..', import.meta.url);
const kw = JSON.parse(readFileSync(new URL('src/data/kitchenware.json', root), 'utf8'));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const base = `
  @page { size: A4; margin: 16mm 16mm 18mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.45 'Helvetica Neue', Arial, sans-serif; color: #0c1d2e; margin: 0; }
  h1 { font-size: 22pt; margin: 0; letter-spacing: -.01em; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: .06em; color: #1d4ed8; border-bottom: 1.5px solid #1d4ed8; padding-bottom: 3px; margin: 16px 0 8px; }
  h3 { font-size: 11pt; margin: 0; }
  p { margin: 0 0 6px; }
  ul { margin: 4px 0 0; padding-left: 16px; }
  li { margin-bottom: 2px; }
  .muted { color: #5f6f80; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  th, td { text-align: left; padding: 5px 6px; border-bottom: 1px solid #e2e8ef; vertical-align: top; }
  th { color: #5f6f80; font-weight: 600; }
  td.num, th.num { text-align: right; white-space: nowrap; }
`;

function cvHtml() {
  const contact = [site.location.replace('Open to roles in ', ''), site.email, site.linkedin.replace('https://www.', ''), site.url.replace('https://', '')].filter(Boolean);
  const research = experience.find((e) => e.org === 'The Digital Tantra');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${site.name} – CV</title><style>${base}
    .head { border-bottom: 3px solid #0c1d2e; padding-bottom: 10px; }
    .title { font-size: 12.5pt; color: #1d4ed8; font-weight: 600; margin-top: 2px; }
    .contact { margin-top: 6px; font-size: 9.5pt; color: #33475b; }
    .job { margin-bottom: 10px; } .row { display: flex; justify-content: space-between; gap: 12px; }
    .skills td:first-child { width: 28%; font-weight: 600; color: #0c1d2e; }
  </style></head><body>
    <div class="head">
      <h1>${esc(site.name)}</h1>
      <div class="title">${esc(site.positioning)}</div>
      <div class="contact">${contact.map(esc).join(' &nbsp;|&nbsp; ')}</div>
    </div>
    <h2>Profile</h2>
    <p>Market research professional with two years at The Digital Tantra (Oct 2024 – Oct 2026) working on customer feedback and NPS analysis, consumer insights, competitor benchmarking and research reporting in Excel and Power BI. Holds an MCA (GPA 8.7), which adds strong data handling and SQL skills. Available immediately for roles in Dubai, Abu Dhabi and Sharjah.</p>
    <h2>Core skills</h2>
    <table class="skills">${skillGroups.map((g) => `<tr><td>${esc(g.title)}</td><td>${g.items.map(esc).join(', ')}</td></tr>`).join('')}</table>
    <h2>Professional experience</h2>
    ${experience.map((e) => `<div class="job"><div class="row"><h3>${esc(e.role)} · ${esc(e.org)}</h3><span class="muted">${esc(e.period || 'Internship')}</span></div>
      <div class="muted">${esc(e.place)}</div>${e.points.length ? `<ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}</div>`).join('')}
    <h2>Selected research projects</h2>
    <ul>
      <li><b>Automotive Customer NPS &amp; Feedback Analysis</b> – customer satisfaction and NPS benchmarking of TVS vs Bajaj and Haojue in Nigeria, Egypt, the Philippines and DR Congo; promoter/detractor and feedback-theme analysis (The Digital Tantra).</li>
      <li><b>UAE Higher Education Demand &amp; Employment Research</b> – demand assessment, university competitor analysis and employment mapping for BSc Library &amp; Information Science and BSc Cognitive Science &amp; AI (The Digital Tantra).</li>
      <li><b>UAE Judicial Services Mystery Shopping Programme, W1 2026</b> (confidential) – email, telephone, social media, registry and ancillary service evaluation with scorecards and response-time analysis.</li>
      <li><b>Kitchenware Market Research – UAE</b> – e-commerce (Noon, Amazon.ae), organised retail and showroom research with pricing and competitor benchmarking.</li>
    </ul>
    <p class="muted" style="margin-top:6px">Public case studies with demonstration dashboards: ${esc(site.url.replace('https://', ''))}</p>
    <h2>Education</h2>
    ${education.map((ed) => `<div class="row"><span><b>${esc(ed.degree)}</b>, ${esc(ed.school)}${ed.grade ? ' – ' + esc(ed.grade) : ''}</span><span class="muted">${esc(ed.period)}</span></div>`).join('')}
    <h2>Certifications</h2>
    <ul>${certifications.map((c) => `<li>${esc(c.name)}${c.issuer ? ` – ${esc(c.issuer)}` : ''}${c.year ? ` (${esc(c.year)})` : ''}</li>`).join('')}</ul>
  </body></html>`;
}

function kitchenwareHtml() {
  const ch = kw.channels;
  const maxIdx = Math.max(...kw.priceIndex.map((p) => p.index));
  const bar = (v, max, colour = '#1d4ed8') => `<div style="display:flex;align-items:center;gap:6px"><div style="height:12px;width:${(v / max) * 100}%;max-width:78%;background:${colour};border-radius:0 3px 3px 0"></div><span>${v}</span></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Kitchenware Market Research – UAE (sample report)</title><style>${base}
    .cover { height: 250mm; display: flex; flex-direction: column; justify-content: space-between; }
    .band { background: #0c1d2e; color: #fff; padding: 28px; border-radius: 6px; }
    .band h1 { font-size: 26pt; } .notice { border: 1.5px solid #d97706; background: #fffbeb; padding: 10px 12px; border-radius: 4px; color: #78350f; }
    .page { page-break-before: always; } .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 10px 0 4px; }
    .kpi { background: #f4f7fa; border-radius: 4px; padding: 8px; } .kpi b { display: block; font-size: 15pt; }
  </style></head><body>
    <section class="cover">
      <div>
        <p class="muted">Sample research report · portfolio demonstration</p>
        <div class="band"><h1>Kitchenware Market Research – UAE</h1><p style="margin-top:8px;font-size:12pt">Channel, pricing and assortment benchmarking</p></div>
        <p style="margin-top:14px">Prepared by ${esc(site.name)}</p>
      </div>
      <div class="notice"><b>Synthetic demonstration data.</b> All prices, discounts and ratings in this report are simulated. Channels and brands are anonymised (Marketplace A/B, Hypermarket chain, Specialist showroom, Brand A–F). The figures are not observations from Noon, Amazon.ae or any named retailer, and they are not the findings of the original confidential study.</div>
    </section>

    <section class="page">
      <h2>1. Objectives and scope</h2>
      <p>The study benchmarks how kitchenware is priced, discounted and ranged across four types of UAE sales channel: two e-commerce marketplaces, an organised-retail hypermarket chain and a specialist showroom. Six categories are covered: cookware sets, non-stick frying pans, pressure cookers, kitchen knives, food storage and bakeware.</p>
      <h2>2. Method</h2>
      <ul>
        <li>Standard capture sheet per listing: category, brand, brand tier, list price, selling price, discount, rating and stock status.</li>
        <li>Marketplace listings captured with consistent search terms and filters; hypermarket and showroom ranges recorded through shelf audits.</li>
        <li>Benchmarks: median selling price by category and channel, channel price index (Marketplace A = 100, average of category ratios), share of listings on promotion, average discount depth and brand-tier mix.</li>
      </ul>
      <div class="kpis">
        <div class="kpi"><span class="muted">Listings</span><b>${kw.observations}</b></div>
        <div class="kpi"><span class="muted">Channels</span><b>${ch.length}</b></div>
        <div class="kpi"><span class="muted">Categories</span><b>${kw.medianByCategoryChannel.length}</b></div>
        <div class="kpi"><span class="muted">Brands</span><b>6</b></div>
      </div>
      <h2>3. Channel price index</h2>
      <table>${kw.priceIndex.map((p) => `<tr><td style="width:32%">${esc(p.channel)}</td><td>${bar(p.index, maxIdx)}</td></tr>`).join('')}</table>
      <p class="muted" style="margin-top:6px">Index = average across categories of (channel median ÷ Marketplace A median) × 100.</p>
      <h2>4. Median selling price by category (AED)</h2>
      <table><tr><th>Category</th>${ch.map((c) => `<th class="num">${esc(c.name)}</th>`).join('')}</tr>
        ${kw.medianByCategoryChannel.map((r) => `<tr><td>${esc(r.category)}</td>${ch.map((c) => `<td class="num">${r[c.id]}</td>`).join('')}</tr>`).join('')}</table>
    </section>

    <section class="page">
      <h2>5. Promotions, availability and assortment</h2>
      <table><tr><th>Channel</th><th>Type</th><th class="num">Listings</th><th class="num">On promotion</th><th class="num">Avg discount when on promotion</th><th class="num">In stock</th></tr>
        ${kw.channelStats.map((c) => `<tr><td>${esc(c.channel)}</td><td>${esc(c.type)}</td><td class="num">${c.skus}</td><td class="num">${c.onDealPct}%</td><td class="num">${c.avgDiscountWhenOnDeal}%</td><td class="num">${c.inStockPct}%</td></tr>`).join('')}</table>
      <h3 style="margin-top:14px">Brand-tier mix (% of listings)</h3>
      <table><tr><th>Channel</th><th class="num">Value</th><th class="num">Mid-market</th><th class="num">Premium</th></tr>
        ${kw.tierMix.map((t) => `<tr><td>${esc(t.channel)}</td><td class="num">${t.Value}%</td><td class="num">${t['Mid-market']}%</td><td class="num">${t.Premium}%</td></tr>`).join('')}</table>
      <h2>6. Observations (demonstration)</h2>
      <ul>
        <li>Marketplaces carry the widest range and promote most often, making them the price reference point for shoppers.</li>
        <li>The showroom price index is high mainly because showrooms stock premium and mid-market brands only: a mix effect rather than like-for-like overpricing. Category-level comparisons by brand tier are needed before drawing pricing conclusions.</li>
        <li>Hypermarkets sit close to marketplace prices with less discounting, competing on convenience and in-store availability.</li>
        <li>A brand entering the market should set clear price positioning per channel to avoid undercutting its own showroom partners online.</li>
      </ul>
      <h2>7. Limitations</h2>
      <p>Simulated data; a real audit would also record pack sizes and materials to compare like-for-like products, repeat captures over several weeks to smooth promotions, and weight results by sales where available.</p>
    </section>
  </body></html>`;
}

const chrome = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean).find(existsSync);
const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
const page = await browser.newPage();
const footer = (label) => `<div style="font:8px Arial;color:#5f6f80;width:100%;padding:0 16mm;display:flex;justify-content:space-between"><span>${label}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
for (const [html, out, label] of [
  [cvHtml(), 'public/cv/Rohith-Mohan-Market-Research-Analyst-CV.pdf', `${site.name} · CV`],
  [kitchenwareHtml(), 'public/reports/kitchenware-sample-report.pdf', 'Kitchenware Market Research – UAE · synthetic demonstration data']
]) {
  mkdirSync(new URL(out.split('/').slice(0, -1).join('/') + '/', root), { recursive: true });
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({ path: new URL(out, root).pathname, format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer(label), margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' } });
  console.log('wrote', out);
}
await browser.close();
