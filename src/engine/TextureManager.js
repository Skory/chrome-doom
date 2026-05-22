/**
 * Procedural high-res textures (256×256) — nearest-neighbor sampling.
 * Avoids copyrighted Doom WAD assets while matching aesthetic.
 */

const TEX_SIZE = 256;

function makeCanvas(w = TEX_SIZE, h = TEX_SIZE) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function noise(ctx, w, h, scale, alpha = 0.15) {
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * scale;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function brickTexture(base, mortar, rows = 8, cols = 4) {
  const c = makeCanvas();
  const ctx = c.getContext('2d');
  const bw = TEX_SIZE / cols, bh = TEX_SIZE / rows;
  ctx.fillStyle = mortar;
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const off = (r % 2) * (bw / 2);
      const shade = 0.85 + Math.random() * 0.15;
      const [cr, cg, cb] = base;
      ctx.fillStyle = `rgb(${cr * shade},${cg * shade},${cb * shade})`;
      ctx.fillRect(col * bw + off % bw, r * bh, bw - 3, bh - 3);
    }
  }
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.08);
  return c;
}

function metalPanel() {
  const c = makeCanvas();
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, TEX_SIZE, TEX_SIZE);
  g.addColorStop(0, '#3a4555');
  g.addColorStop(0.5, '#5a6a7a');
  g.addColorStop(1, '#2a3545');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = '#1a2030';
    ctx.lineWidth = 4;
    ctx.strokeRect(8 + i * 40, 8, TEX_SIZE - 16 - i * 40, TEX_SIZE - 16);
  }
  ctx.fillStyle = '#8899aa';
  ctx.fillRect(TEX_SIZE / 2 - 20, TEX_SIZE / 2 - 20, 40, 40);
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.06);
  return c;
}

function techWall() {
  const c = makeCanvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#2a2840';
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  for (let y = 0; y < TEX_SIZE; y += 32) {
    for (let x = 0; x < TEX_SIZE; x += 32) {
      ctx.fillStyle = ((x + y) / 32) % 2 ? '#3a3860' : '#323050';
      ctx.fillRect(x + 2, y + 2, 28, 28);
      ctx.strokeStyle = '#5544aa';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 4, y + 4, 24, 24);
    }
  }
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.1);
  return c;
}

function floorTile(color1, color2) {
  const c = makeCanvas();
  const ctx = c.getContext('2d');
  const ts = 64;
  for (let y = 0; y < TEX_SIZE; y += ts) {
    for (let x = 0; x < TEX_SIZE; x += ts) {
      ctx.fillStyle = ((x + y) / ts) % 2 ? color1 : color2;
      ctx.fillRect(x, y, ts, ts);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.strokeRect(x, y, ts, ts);
    }
  }
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.05);
  return c;
}

function ceilingPanel() {
  const c = makeCanvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1a1828';
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = `rgba(60, 50, 90, ${0.1 + Math.random() * 0.2})`;
    ctx.fillRect(Math.random() * TEX_SIZE, Math.random() * TEX_SIZE, 40 + Math.random() * 80, 8);
  }
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.12);
  return c;
}

function drawImpFrame(ctx, frame, w, h) {
  ctx.clearRect(0, 0, w, h);
  const skin = frame === 'death' ? '#553322' : '#aa6644';
  const horn = '#884422';
  // Body
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.55, w * 0.22, h * 0.35, 0, 0, TAU);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.28, w * 0.18, h * 0.2, 0, 0, TAU);
  ctx.fill();
  // Horns
  ctx.fillStyle = horn;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.15);
  ctx.lineTo(w * 0.28, h * 0.02);
  ctx.lineTo(w * 0.42, h * 0.2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w * 0.65, h * 0.15);
  ctx.lineTo(w * 0.72, h * 0.02);
  ctx.lineTo(w * 0.58, h * 0.2);
  ctx.fill();
  // Eyes (glow)
  if (frame !== 'death') {
    ctx.fillStyle = '#ff2200';
    ctx.shadowColor = '#ff4400';
    ctx.shadowBlur = 8;
    ctx.fillRect(w * 0.42, h * 0.24, 8, 6);
    ctx.fillRect(w * 0.54, h * 0.24, 8, 6);
    ctx.shadowBlur = 0;
  }
  // Arms / fireball pose
  if (frame === 'attack') {
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(w * 0.75, h * 0.45, 12, 0, TAU);
    ctx.fill();
  }
  if (frame === 'pain') {
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  if (frame === 'death') {
    ctx.save();
    ctx.translate(w / 2, h * 0.7);
    ctx.rotate(0.4);
    ctx.fillStyle = skin;
    ctx.fillRect(-w * 0.3, -h * 0.1, w * 0.6, h * 0.15);
    ctx.restore();
  }
}

const TAU = Math.PI * 2;

function drawDemonFrame(ctx, frame, w, h) {
  ctx.clearRect(0, 0, w, h);
  const fur = frame === 'death' ? '#442211' : '#cc4422';
  ctx.fillStyle = fur;
  // Bulky body
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.5, w * 0.35, h * 0.4, 0, 0, TAU);
  ctx.fill();
  // Head / mouth
  ctx.fillStyle = '#aa2211';
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.22, w * 0.25, h * 0.18, 0, 0, TAU);
  ctx.fill();
  // Teeth
  ctx.fillStyle = '#ffeedd';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(w * 0.35 + i * 10, h * 0.28, 6, 14);
  }
  // Eyes
  if (frame !== 'death') {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(w * 0.38, h * 0.16, 12, 8);
    ctx.fillRect(w * 0.54, h * 0.16, 12, 8);
  }
  if (frame === 'pain') {
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  if (frame === 'death') {
    ctx.fillStyle = '#330000';
    ctx.fillRect(0, h * 0.75, w, h * 0.25);
  }
}

function createSpriteSheet(drawFn, frames, size = 128) {
  const c = makeCanvas(size * frames.length, size);
  const ctx = c.getContext('2d');
  frames.forEach((f, i) => {
    ctx.save();
    ctx.translate(i * size, 0);
    drawFn(ctx, f, size, size);
    ctx.restore();
  });
  return { canvas: c, frameW: size, frames: frames.length };
}

function cachePixels(canvas) {
  const d = canvas.getContext('2d').getImageData(0, 0, TEX_SIZE, TEX_SIZE).data;
  return d;
}

export class TextureManager {
  constructor() {
    this.walls = [];
    this.wallPx = [];
    this.floors = [];
    this.floorPx = [];
    this.ceilings = [];
    this.ceilPx = [];
    this.sprites = {};
    this.weapon = null;
    this._init();
  }

  _init() {
    // Wall textures: 0=none, 1-8 walls
    this.walls[0] = null;
    this.walls[1] = brickTexture([120, 90, 70], '#3a3028');
    this.walls[2] = brickTexture([80, 85, 95], '#2a2a30');
    this.walls[3] = metalPanel();
    this.walls[4] = techWall();
    this.walls[5] = brickTexture([140, 50, 40], '#2a1818');
    this.walls[6] = brickTexture([60, 100, 80], '#1a2820');
    this.walls[7] = metalPanel();
    this.walls[8] = techWall();

    this.floors[1] = floorTile('#3a3530', '#2a2520');
    this.floors[2] = floorTile('#2a3040', '#1a2030');
    this.floors[3] = floorTile('#404035', '#303028');

    this.ceilings[1] = ceilingPanel();
    this.ceilings[2] = ceilingPanel();
    this.ceilings[3] = (() => {
      const c = makeCanvas();
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#0a0820';
      ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `hsl(${220 + Math.random() * 40}, 40%, ${15 + Math.random() * 15}%)`;
        ctx.fillRect(Math.random() * TEX_SIZE, Math.random() * TEX_SIZE, 2, 2);
      }
      return c;
    })();

    const impFrames = ['idle', 'walk', 'attack', 'pain', 'death'];
    const demonFrames = ['idle', 'walk', 'attack', 'pain', 'death'];
    this.sprites.imp = createSpriteSheet(drawImpFrame, impFrames);
    this.sprites.demon = createSpriteSheet(drawDemonFrame, demonFrames);

    // Animated prop: lamp
    this.sprites.lamp = this._createLampSprite();

    this.weapon = this._createWeaponSprite();

    for (let i = 0; i < this.walls.length; i++)
      if (this.walls[i]) this.wallPx[i] = cachePixels(this.walls[i]);
    for (let i = 0; i < this.floors.length; i++)
      if (this.floors[i]) this.floorPx[i] = cachePixels(this.floors[i]);
    for (let i = 0; i < this.ceilings.length; i++)
      if (this.ceilings[i]) this.ceilPx[i] = cachePixels(this.ceilings[i]);
  }

  _createLampSprite() {
    const size = 64;
    const c = makeCanvas(size * 4, size);
    const ctx = c.getContext('2d');
    for (let f = 0; f < 4; f++) {
      const x = f * size;
      ctx.fillStyle = '#444';
      ctx.fillRect(x + size / 2 - 4, size * 0.3, 8, size * 0.7);
      const glow = 0.6 + Math.sin(f * Math.PI / 2) * 0.4;
      ctx.fillStyle = `rgba(255, 200, 80, ${glow})`;
      ctx.beginPath();
      ctx.arc(x + size / 2, size * 0.25, 14 + f, 0, TAU);
      ctx.fill();
    }
    return { canvas: c, frameW: size, frames: 4 };
  }

  _createWeaponSprite() {
    const c = makeCanvas(320, 280);
    const ctx = c.getContext('2d');
    // Pistol / shotgun style
    ctx.fillStyle = '#3a3a40';
    ctx.fillRect(100, 120, 120, 50);
    ctx.fillStyle = '#2a2a30';
    ctx.fillRect(80, 160, 160, 80);
    ctx.fillStyle = '#554433';
    ctx.fillRect(130, 200, 60, 70);
    ctx.fillStyle = '#666';
    ctx.fillRect(200, 100, 80, 30);
    return c;
  }

  _samplePx(px, u, v) {
    const x = (clamp(u, 0, 0.999) * (TEX_SIZE - 1)) | 0;
    const y = (clamp(v, 0, 0.999) * (TEX_SIZE - 1)) | 0;
    const i = (y * TEX_SIZE + x) << 2;
    return [px[i], px[i + 1], px[i + 2]];
  }

  sampleWall(texId, u, v) {
    const px = this.wallPx[texId];
    return px ? this._samplePx(px, u, v) : [40, 40, 50];
  }

  sampleFloor(texId, u, v) {
    const px = this.floorPx[texId] || this.floorPx[1];
    return px ? this._samplePx(px, u % 1, v % 1) : [40, 40, 40];
  }

  sampleCeiling(texId, u, v) {
    const px = this.ceilPx[texId] || this.ceilPx[1];
    return px ? this._samplePx(px, u % 1, v % 1) : [30, 30, 40];
  }
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }