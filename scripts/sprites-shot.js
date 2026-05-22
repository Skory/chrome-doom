/** Generate enemy sprite sheet screenshot using canvas in Node */
import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', '07-enemy-sprites.png');
mkdirSync(dirname(out), { recursive: true });

const TAU = Math.PI * 2;
function drawImp(ctx, frame, w, h) {
  const skin = frame === 4 ? '#553322' : '#aa6644';
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(w/2, h*0.55, w*0.22, h*0.35, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w/2, h*0.28, w*0.18, h*0.2, 0, 0, TAU); ctx.fill();
  if (frame !== 4) { ctx.fillStyle = '#ff2200'; ctx.fillRect(w*0.42, h*0.24, 8, 6); ctx.fillRect(w*0.54, h*0.24, 8, 6); }
}
function drawDemon(ctx, frame, w, h) {
  const fur = frame === 4 ? '#442211' : '#cc4422';
  ctx.fillStyle = fur;
  ctx.beginPath(); ctx.ellipse(w/2, h*0.5, w*0.35, h*0.4, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#aa2211';
  ctx.beginPath(); ctx.ellipse(w/2, h*0.22, w*0.25, h*0.18, 0, 0, TAU); ctx.fill();
}

const c = createCanvas(900, 200);
const ctx = c.getContext('2d');
ctx.fillStyle = '#121018';
ctx.fillRect(0, 0, 900, 200);
const labels = ['idle', 'walk', 'attack', 'pain', 'death'];
for (let i = 0; i < 5; i++) {
  ctx.save();
  ctx.translate(20 + i * 85, 30);
  drawImp(ctx, i, 80, 100);
  ctx.restore();
  ctx.fillStyle = '#888';
  ctx.font = '11px monospace';
  ctx.fillText(labels[i], 40 + i * 85, 150);
}
ctx.fillStyle = '#ff6644';
ctx.font = '16px monospace';
ctx.fillText('IMP', 200, 20);
for (let i = 0; i < 5; i++) {
  ctx.save();
  ctx.translate(470 + i * 85, 30);
  drawDemon(ctx, i, 80, 100);
  ctx.restore();
  ctx.fillText(labels[i], 490 + i * 85, 150);
}
ctx.fillStyle = '#ff6644';
ctx.fillText('DEMON (PINKY)', 620, 20);
writeFileSync(out, c.toBuffer('image/png'));
console.log('Wrote', out);