/**
 * Capture screenshots + gameplay video via Puppeteer.
 */
import { spawn } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const outDir = join(root, 'docs', 'screenshots');
const PORT = 5174;

async function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch (_) {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('Server did not start');
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(join(root, 'docs', 'video'), { recursive: true });

  const server = spawn('npx', ['--yes', 'serve', '.', '-p', String(PORT)], {
    cwd: root,
    stdio: 'pipe',
  });

  try {
    await waitForServer(`http://localhost:${PORT}`);
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });

    // Title screen
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#menu.active');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: join(outDir, '01-title-screen.png'), fullPage: false });

    // Start game
    await page.click('#btn-start');
    await new Promise(r => setTimeout(r, 800));

    // In-game
    await page.screenshot({ path: join(outDir, '02-in-game.png') });

    // Minimap close-up — crop via clip
    const mm = await page.$('#minimap');
    if (mm) await mm.screenshot({ path: join(outDir, '03-minimap.png') });

    // Simulate movement + combat
    await page.keyboard.down('KeyW');
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('ArrowRight');
      await new Promise(r => setTimeout(r, 50));
    }
    await page.keyboard.up('KeyW');

    for (let i = 0; i < 15; i++) {
      await page.mouse.click(640, 360);
      await new Promise(r => setTimeout(r, 200));
    }
    await page.screenshot({ path: join(outDir, '04-combat-action.png') });

    // Enemy sprites showcase — menu overlay canvas
    await page.evaluate(() => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      document.body.appendChild(c);
      c.id = 'sprite-showcase';
      c.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;background:#111';
      // Drawn in page from textures - use imp/demon from game internals
    });

    // Record video frames as WebM via puppeteer screencast alternative: multiple frames
    const framesDir = join(root, 'docs', 'video', 'frames');
    await mkdir(framesDir, { recursive: true });

    await page.click('#btn-start').catch(() => {});
    await new Promise(r => setTimeout(r, 300));
    const actions = async () => {
      for (let f = 0; f < 90; f++) {
        if (f % 10 === 0) await page.keyboard.down('KeyW');
        if (f % 10 === 5) await page.keyboard.up('KeyW');
        if (f % 3 === 0) await page.mouse.move(640 + Math.sin(f * 0.2) * 80, 360);
        if (f % 8 === 0) await page.mouse.click(640, 360);
        await page.screenshot({ path: join(framesDir, `frame_${String(f).padStart(4, '0')}.png`) });
        await new Promise(r => setTimeout(r, 33));
      }
    };
    await actions();
    await page.screenshot({ path: join(outDir, '05-end-state.png') });

    // Sprite sheet from procedural textures in page
    await page.evaluate(async () => {
      const { TextureManager } = await import('./src/engine/TextureManager.js');
      const tm = new TextureManager();
      const c = document.createElement('canvas');
      c.width = 520; c.height = 140;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#1a1a22';
      ctx.fillRect(0, 0, 520, 140);
      ctx.drawImage(tm.sprites.imp.canvas, 10, 10, 250, 64);
      ctx.drawImage(tm.sprites.demon.canvas, 270, 10, 250, 64);
      ctx.fillStyle = '#aaa';
      ctx.font = '12px monospace';
      ctx.fillText('IMP (5 frames)', 10, 120);
      ctx.fillText('DEMON (5 frames)', 270, 120);
      const a = document.createElement('a');
      a.download = 'sprites.png';
      // store on window
      window.__spriteData = c.toDataURL('image/png');
    });

    // Simpler: screenshot enemy in game
    await page.screenshot({ path: join(outDir, '06-enemy-sprites-ingame.png') });

    await browser.close();

    // Try ffmpeg for video
    const { spawn: sp } = await import('child_process');
    const videoPath = join(root, 'docs', 'video', 'gameplay.mp4');
    await new Promise((resolve) => {
      const ff = sp('ffmpeg', [
        '-y', '-framerate', '30',
        '-i', join(framesDir, 'frame_%04d.png'),
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        videoPath,
      ], { stdio: 'pipe' });
      ff.on('close', resolve);
      ff.on('error', () => resolve());
    });

    const manifest = {
      screenshots: [
        'docs/screenshots/01-title-screen.png',
        'docs/screenshots/02-in-game.png',
        'docs/screenshots/03-minimap.png',
        'docs/screenshots/04-combat-action.png',
        'docs/screenshots/05-end-state.png',
        'docs/screenshots/06-enemy-sprites-ingame.png',
      ],
      video: 'docs/video/gameplay.mp4',
      capturedAt: new Date().toISOString(),
    };
    await writeFile(join(root, 'docs', 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('Capture complete:', manifest);
  } finally {
    server.kill();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});