// Browser test of the static export in out/: every page, every internal link and download,
// mobile layout and menu, contact-form validation, no console errors. Saves screenshots.
// Usage: npm run build && npm test   (set CHROME_PATH if Chrome is not found; E2E_OFFLINE=1 skips web fonts)
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'out');
const shots = join(root, 'docs/screenshots');
mkdirSync(shots, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.csv': 'text/csv', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let p = join(out, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404, { 'content-type': 'text/html' }); res.end(readFileSync(join(out, '404.html'))); return; }
  res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

const chrome = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean).find(existsSync);
const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
const results = [];
async function step(name, fn) {
  try { await fn(); results.push(true); console.log(`  ✔ ${name}`); }
  catch (e) { results.push(false); console.log(`  ✘ ${name}\n    ${e.message.split('\n').slice(0, 3).join(' | ')}`); }
}
async function context(opts) {
  const ctx = await browser.newContext(opts);
  if (process.env.E2E_OFFLINE) await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  return ctx;
}

const pages = ['/', '/projects/', '/experience/', '/contact/', '/projects/automotive-nps-feedback-analysis/', '/projects/uae-higher-education-demand-employment/', '/projects/uae-judicial-services-mystery-shopping/', '/projects/kitchenware-market-research-uae/'];
const errors = [];

try {
  const ctx = await context({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await step('every page renders with one h1 and a unique title', async () => {
    const titles = new Set();
    for (const p of pages) {
      const res = await page.goto(BASE + p);
      assert.equal(res.status(), 200, p);
      assert.equal(await page.locator('h1').count(), 1, `${p}: h1 count`);
      titles.add(await page.title());
    }
    assert.equal(titles.size, pages.length, 'titles should be unique');
  });

  await step('recruiter can identify the role within the first screen', async () => {
    await page.goto(BASE + '/');
    const h1 = await page.locator('h1').innerText();
    assert.match(h1, /Rohith Mohan/);
    assert.match(h1, /Market Research Analyst/);
    assert.ok(await page.getByRole('link', { name: /Download CV/ }).first().isVisible());
  });

  await step('all internal links and downloads resolve (no 404s)', async () => {
    const seen = new Set();
    for (const p of pages) {
      await page.goto(BASE + p);
      for (const href of await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))) {
        if (!href || /^(https?:|mailto:|#)/.test(href)) continue;
        seen.add(new URL(href, BASE + p).pathname);
      }
    }
    for (const path of seen) {
      const r = await fetch(BASE + path);
      assert.equal(r.status, 200, `broken link ${path}`);
    }
    for (const f of ['/cv/Rohith-Mohan-Market-Research-Analyst-CV.pdf', '/reports/kitchenware-sample-report.pdf', '/reports/automotive-nps-sample-report.pdf', '/data/kitchenware_synthetic_observations.csv']) assert.ok(seen.has(f), `missing link to ${f}`);
  });

  await step('each case study shows the data notice, methodology, dashboard and findings', async () => {
    for (const p of pages.filter((x) => x.startsWith('/projects/') && x !== '/projects/')) {
      await page.goto(BASE + p);
      await page.getByText('About the data.').waitFor();
      for (const h of ['The problem', 'Research methodology', 'Analysis dashboard', 'Key findings (demonstration)', 'Implementation & deliverables']) await page.getByRole('heading', { name: h, exact: true }).waitFor();
      assert.ok(await page.locator('figure').count() >= 4, `${p}: dashboard blocks`);
    }
  });

  await step('confidential project does not name the client', async () => {
    await page.goto(BASE + '/projects/uae-judicial-services-mystery-shopping/');
    const text = await page.locator('body').innerText();
    assert.doesNotMatch(text, /DIFC|Dubai International Financial Centre/i);
    await page.getByText('Client not disclosed').waitFor();
  });

  await step('contact form validates and prepares a message', async () => {
    await page.goto(BASE + '/contact/');
    await page.getByRole('button', { name: /Copy message|Write email/ }).click();
    await page.getByText('Please enter your name.').waitFor();
    assert.equal(await page.getByLabel('Name *').getAttribute('aria-invalid'), 'true');
    await page.getByLabel('Name *').fill('Hiring Manager');
    await page.getByLabel('Email *').fill('hr@example.com');
    await page.getByLabel('Message *').fill('We would like to discuss a research analyst role.');
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: /Copy message|Write email/ }).click();
    await page.locator('[aria-live="polite"] p, [aria-live="polite"] div').first().waitFor();
  });

  await step('desktop screenshots', async () => {
    for (const [p, name] of [['/', '01-home'], ['/projects/automotive-nps-feedback-analysis/', '02-case-study-nps'], ['/projects/uae-judicial-services-mystery-shopping/', '03-case-study-mystery-shopping'], ['/experience/', '04-experience']]) {
      await page.goto(BASE + p);
      await page.waitForTimeout(900);
      await page.screenshot({ path: join(shots, `${name}.png`), fullPage: true });
    }
  });

  await step('mobile: no horizontal scroll, menu works', async () => {
    const m = await context({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const mp = await m.newPage();
    for (const p of pages) {
      await mp.goto(BASE + p);
      assert.ok(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${p}: horizontal scroll`);
    }
    await mp.goto(BASE + '/');
    await mp.screenshot({ path: join(shots, '05-mobile-home.png') });
    await mp.getByRole('button', { name: 'Open menu' }).click();
    await mp.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Projects' }).click();
    await mp.waitForURL(/\/projects\/$/);
    assert.equal(await mp.getByRole('navigation', { name: 'Mobile' }).count(), 0, 'menu closes after navigating');
    await m.close();
  });

  await step('no console errors', async () => { assert.deepEqual(errors, []); });
} finally {
  await browser.close();
  server.close();
}
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
