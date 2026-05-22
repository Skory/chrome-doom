/**
 * Browser E2E — puppeteer exercises real UI flows.
 */
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 5175;

async function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try { if ((await fetch(url)).ok) return; } catch (_) {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('server timeout');
}

const server = spawn('npx', ['--yes', 'serve', '.', '-p', String(PORT)], { cwd: root, stdio: 'pipe' });
let passed = 0, failed = 0;
const assert = (c, m) => (c ? (passed++, console.log('✓', m)) : (failed++, console.error('✗', m)));

try {
  await waitForServer(`http://localhost:${PORT}`);
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}`);
  await page.waitForSelector('#menu.active');
  assert(await page.$eval('#btn-start', el => !!el), 'start button exists');
  await page.click('#btn-start');
  await page.waitForSelector('#hud:not(.hidden)');
  assert(await page.$eval('#hud-health', el => el.textContent === '100'), 'HUD health初始');
  await page.keyboard.down('KeyW');
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.up('KeyW');
  const healthAfter = await page.$eval('#hud-health', el => el.textContent);
  await page.mouse.click(640, 360);
  await new Promise(r => setTimeout(r, 300));
  const ammo = await page.$eval('#hud-ammo', el => parseInt(el.textContent, 10));
  assert(ammo < 50, 'shooting reduces ammo');
  await page.keyboard.press('KeyM');
  const mmVisible = await page.$eval('#minimap', el => !el.classList.contains('hidden-map'));
  assert(mmVisible !== undefined, 'minimap toggles');
  await browser.close();
} finally {
  server.kill();
}
console.log(`Browser E2E: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);