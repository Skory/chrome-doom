// src/data/e1m1.js
var MAP_W = 64;
var MAP_H = 64;
function grid(fill = 0) {
  return new Array(MAP_W * MAP_H).fill(fill);
}
function setRect(cells, x, y, w, h, v) {
  for (let j = y; j < y + h; j++)
    for (let i = x; i < x + w; i++)
      if (i >= 0 && i < MAP_W && j >= 0 && j < MAP_H)
        cells[j * MAP_W + i] = v;
}
function carve(cells) {
  setRect(cells, 0, 0, MAP_W, 1, 1);
  setRect(cells, 0, MAP_H - 1, MAP_W, 1, 2);
  setRect(cells, 0, 0, 1, MAP_H, 3);
  setRect(cells, MAP_W - 1, 0, 1, MAP_H, 4);
  setRect(cells, 8, 8, 48, 40, 0);
  setRect(cells, 8, 8, 48, 1, 5);
  setRect(cells, 8, 47, 48, 1, 6);
  setRect(cells, 8, 8, 1, 40, 1);
  setRect(cells, 55, 8, 1, 40, 2);
  const pillars = [[20, 20], [44, 20], [20, 36], [44, 36], [30, 30]];
  for (const [px, py] of pillars) {
    setRect(cells, px, py, 2, 2, 3);
  }
  setRect(cells, 2, 22, 6, 12, 0);
  setRect(cells, 2, 22, 1, 12, 7);
  setRect(cells, 7, 22, 1, 12, 7);
  setRect(cells, 2, 22, 6, 1, 7);
  setRect(cells, 2, 33, 6, 1, 7);
  cells[22 * MAP_W + 7] = 0;
  cells[30 * MAP_W + 7] = 0;
  setRect(cells, 56, 18, 6, 16, 0);
  setRect(cells, 56, 18, 1, 16, 4);
  setRect(cells, 61, 18, 1, 16, 4);
  cells[26 * MAP_W + 56] = 0;
  cells[28 * MAP_W + 56] = 0;
  setRect(cells, 14, 2, 10, 6, 0);
  setRect(cells, 14, 2, 10, 1, 6);
  setRect(cells, 14, 7, 10, 1, 6);
  setRect(cells, 14, 2, 1, 6, 6);
  setRect(cells, 23, 2, 1, 6, 6);
  cells[5 * MAP_W + 18] = 0;
  setRect(cells, 40, 2, 12, 6, 0);
  setRect(cells, 40, 2, 12, 1, 5);
  setRect(cells, 40, 7, 12, 1, 5);
  setRect(cells, 40, 2, 1, 6, 5);
  setRect(cells, 51, 2, 1, 6, 5);
  cells[5 * MAP_W + 46] = 0;
  setRect(cells, 12, 50, 8, 8, 0);
  setRect(cells, 12, 50, 8, 1, 2);
  setRect(cells, 12, 57, 8, 1, 2);
  setRect(cells, 12, 50, 1, 8, 2);
  setRect(cells, 19, 50, 1, 8, 2);
  cells[49 * MAP_W + 16] = 0;
  setRect(cells, 44, 50, 10, 8, 0);
  setRect(cells, 44, 50, 10, 1, 1);
  setRect(cells, 44, 57, 10, 1, 1);
  setRect(cells, 44, 50, 1, 8, 1);
  setRect(cells, 53, 50, 1, 8, 1);
  cells[49 * MAP_W + 48] = 0;
  setRect(cells, 30, 12, 1, 10, 8);
  setRect(cells, 34, 30, 1, 12, 8);
  cells[16 * MAP_W + 30] = 9;
  cells[36 * MAP_W + 34] = 9;
  setRect(cells, 26, 40, 12, 1, 6);
  setRect(cells, 26, 40, 1, 6, 6);
  setRect(cells, 37, 40, 1, 6, 6);
  cells[45 * MAP_W + 32] = 0;
  setRect(cells, 48, 10, 6, 6, 0);
  setRect(cells, 48, 10, 6, 1, 4);
  setRect(cells, 48, 15, 6, 1, 4);
  setRect(cells, 48, 10, 1, 6, 4);
  setRect(cells, 53, 10, 1, 6, 4);
  cells[12 * MAP_W + 51] = 10;
  return cells;
}
function createLevel() {
  const cells = carve(grid(1));
  for (let y = 9; y < 47; y++) {
    cells[y * MAP_W + 9] = cells[y * MAP_W + 9] === 1 ? 0 : cells[y * MAP_W + 9];
    cells[y * MAP_W + 54] = cells[y * MAP_W + 54] === 2 ? 0 : cells[y * MAP_W + 54];
  }
  for (let x = 9; x < 55; x++) {
    cells[9 * MAP_W + x] = cells[9 * MAP_W + x] === 5 ? 0 : cells[9 * MAP_W + x];
    cells[47 * MAP_W + x] = cells[47 * MAP_W + x] === 6 ? 0 : cells[47 * MAP_W + x];
  }
  const wallHeights = new Float32Array(MAP_W * MAP_H);
  const floorTex = new Uint8Array(MAP_W * MAP_H);
  const ceilTex = new Uint8Array(MAP_W * MAP_H);
  for (let i = 0; i < cells.length; i++) {
    floorTex[i] = 1;
    ceilTex[i] = 1;
    wallHeights[i] = 1;
  }
  for (let y = 18; y < 34; y++)
    for (let x = 56; x < 62; x++) {
      floorTex[y * MAP_W + x] = 2;
      ceilTex[y * MAP_W + x] = 2;
    }
  for (let y = 2; y < 8; y++)
    for (let x = 14; x < 52; x++) {
      ceilTex[y * MAP_W + x] = 3;
    }
  const tall = [[20, 20], [44, 20], [20, 36], [44, 36], [30, 30]];
  for (const [px, py] of tall) {
    wallHeights[py * MAP_W + px] = 1.8;
    wallHeights[py * MAP_W + px + 1] = 1.8;
    wallHeights[(py + 1) * MAP_W + px] = 1.8;
    wallHeights[(py + 1) * MAP_W + px + 1] = 1.8;
  }
  wallHeights[28 * MAP_W + 32] = 0.5;
  const playerStart = { x: 32.5, y: 24.5, angle: Math.PI / 2 };
  const enemies = [
    { type: "imp", x: 18, y: 24 },
    { type: "imp", x: 46, y: 22 },
    { type: "imp", x: 32, y: 18 },
    { type: "demon", x: 24, y: 34 },
    { type: "demon", x: 40, y: 34 },
    { type: "imp", x: 15, y: 42 },
    { type: "imp", x: 50, y: 42 },
    { type: "demon", x: 32, y: 42 },
    { type: "imp", x: 10, y: 28 },
    { type: "demon", x: 58, y: 26 },
    { type: "imp", x: 48, y: 12 },
    { type: "demon", x: 20, y: 12 }
  ];
  const props = [
    { type: "lamp", x: 16.5, y: 16.5 },
    { type: "lamp", x: 48.5, y: 16.5 },
    { type: "lamp", x: 16.5, y: 40.5 },
    { type: "lamp", x: 48.5, y: 40.5 },
    { type: "lamp", x: 32.5, y: 32.5 },
    { type: "lamp", x: 28.5, y: 26.5 },
    { type: "lamp", x: 36.5, y: 26.5 }
  ];
  const lights = [
    { x: 32, y: 28, r: 14, intensity: 1.2 },
    { x: 16, y: 16, r: 8, intensity: 0.9 },
    { x: 48, y: 16, r: 8, intensity: 0.9 },
    { x: 16, y: 40, r: 8, intensity: 0.7 },
    { x: 48, y: 40, r: 8, intensity: 0.7 }
  ];
  return {
    width: MAP_W,
    height: MAP_H,
    cells,
    wallHeights,
    floorTex,
    ceilTex,
    playerStart,
    enemies,
    props,
    lights,
    floorHeight: 0,
    ceilHeight: 4
  };
}

// src/engine/Map.js
var GameMap = class {
  constructor(level) {
    this.width = level.width;
    this.height = level.height;
    this.cells = level.cells.slice();
    this.wallHeights = level.wallHeights;
    this.floorTex = level.floorTex;
    this.ceilTex = level.ceilTex;
    this.floorHeight = level.floorHeight ?? 0;
    this.ceilHeight = level.ceilHeight ?? 4;
    this.lights = level.lights || [];
    this.doors = /* @__PURE__ */ new Map();
    this.exitPos = null;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y * this.width + x] === 10) {
          this.exitPos = { x: x + 0.5, y: y + 0.5 };
        }
      }
    }
  }
  getCell(x, y) {
    const mx = Math.floor(x), my = Math.floor(y);
    if (mx < 0 || my < 0 || mx >= this.width || my >= this.height) return 1;
    return this.cells[my * this.width + mx];
  }
  isSolid(x, y, radius = 0.25) {
    const samples = [
      [x - radius, y - radius],
      [x + radius, y - radius],
      [x - radius, y + radius],
      [x + radius, y + radius],
      [x, y - radius],
      [x, y + radius],
      [x - radius, y],
      [x + radius, y]
    ];
    for (const [sx, sy] of samples) {
      const c = this.getCell(sx, sy);
      if (c > 0 && c !== 9) return true;
      if (c === 9) {
        const key = `${Math.floor(sx)},${Math.floor(sy)}`;
        const d = this.doors.get(key);
        if (!d || d.open < 0.85) return true;
      }
    }
    return false;
  }
  updateDoors(dt) {
    for (const [, d] of this.doors) {
      if (d.opening) d.open = Math.min(1, d.open + dt * 1.5);
      else if (d.closing) d.open = Math.max(0, d.open - dt * 1.5);
    }
  }
  tryOpenDoor(px, py) {
    const mx = Math.floor(px), my = Math.floor(py);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = mx + dx, y = my + dy;
        if (this.cells[y * this.width + x] === 9) {
          const key = `${x},${y}`;
          if (!this.doors.has(key)) this.doors.set(key, { open: 0, opening: true, closing: false });
          else {
            const d = this.doors.get(key);
            d.opening = true;
            d.closing = false;
          }
        }
      }
    }
  }
  getWallHeight(mx, my) {
    if (mx < 0 || my < 0 || mx >= this.width || my >= this.height) return 1;
    return this.wallHeights[my * this.width + mx] || 1;
  }
};

// src/engine/TextureManager.js
var TEX_SIZE = 256;
function makeCanvas(w = TEX_SIZE, h = TEX_SIZE) {
  const c = document.createElement("canvas");
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
  const ctx = c.getContext("2d");
  const bw = TEX_SIZE / cols, bh = TEX_SIZE / rows;
  ctx.fillStyle = mortar;
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const off = r % 2 * (bw / 2);
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
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, TEX_SIZE, TEX_SIZE);
  g.addColorStop(0, "#3a4555");
  g.addColorStop(0.5, "#5a6a7a");
  g.addColorStop(1, "#2a3545");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = "#1a2030";
    ctx.lineWidth = 4;
    ctx.strokeRect(8 + i * 40, 8, TEX_SIZE - 16 - i * 40, TEX_SIZE - 16);
  }
  ctx.fillStyle = "#8899aa";
  ctx.fillRect(TEX_SIZE / 2 - 20, TEX_SIZE / 2 - 20, 40, 40);
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.06);
  return c;
}
function techWall() {
  const c = makeCanvas();
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#2a2840";
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  for (let y = 0; y < TEX_SIZE; y += 32) {
    for (let x = 0; x < TEX_SIZE; x += 32) {
      ctx.fillStyle = (x + y) / 32 % 2 ? "#3a3860" : "#323050";
      ctx.fillRect(x + 2, y + 2, 28, 28);
      ctx.strokeStyle = "#5544aa";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 4, y + 4, 24, 24);
    }
  }
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.1);
  return c;
}
function floorTile(color1, color2) {
  const c = makeCanvas();
  const ctx = c.getContext("2d");
  const ts = 64;
  for (let y = 0; y < TEX_SIZE; y += ts) {
    for (let x = 0; x < TEX_SIZE; x += ts) {
      ctx.fillStyle = (x + y) / ts % 2 ? color1 : color2;
      ctx.fillRect(x, y, ts, ts);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.strokeRect(x, y, ts, ts);
    }
  }
  noise(ctx, TEX_SIZE, TEX_SIZE, 0.05);
  return c;
}
function ceilingPanel() {
  const c = makeCanvas();
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1a1828";
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
  const skin = frame === "death" ? "#553322" : "#aa6644";
  const horn = "#884422";
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.55, w * 0.22, h * 0.35, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.28, w * 0.18, h * 0.2, 0, 0, TAU);
  ctx.fill();
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
  if (frame !== "death") {
    ctx.fillStyle = "#ff2200";
    ctx.shadowColor = "#ff4400";
    ctx.shadowBlur = 8;
    ctx.fillRect(w * 0.42, h * 0.24, 8, 6);
    ctx.fillRect(w * 0.54, h * 0.24, 8, 6);
    ctx.shadowBlur = 0;
  }
  if (frame === "attack") {
    ctx.fillStyle = "#ff6600";
    ctx.beginPath();
    ctx.arc(w * 0.75, h * 0.45, 12, 0, TAU);
    ctx.fill();
  }
  if (frame === "pain") {
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  if (frame === "death") {
    ctx.save();
    ctx.translate(w / 2, h * 0.7);
    ctx.rotate(0.4);
    ctx.fillStyle = skin;
    ctx.fillRect(-w * 0.3, -h * 0.1, w * 0.6, h * 0.15);
    ctx.restore();
  }
}
var TAU = Math.PI * 2;
function drawDemonFrame(ctx, frame, w, h) {
  ctx.clearRect(0, 0, w, h);
  const fur = frame === "death" ? "#442211" : "#cc4422";
  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.5, w * 0.35, h * 0.4, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#aa2211";
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.22, w * 0.25, h * 0.18, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#ffeedd";
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(w * 0.35 + i * 10, h * 0.28, 6, 14);
  }
  if (frame !== "death") {
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(w * 0.38, h * 0.16, 12, 8);
    ctx.fillRect(w * 0.54, h * 0.16, 12, 8);
  }
  if (frame === "pain") {
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  if (frame === "death") {
    ctx.fillStyle = "#330000";
    ctx.fillRect(0, h * 0.75, w, h * 0.25);
  }
}
function createSpriteSheet(drawFn, frames, size = 128) {
  const c = makeCanvas(size * frames.length, size);
  const ctx = c.getContext("2d");
  frames.forEach((f, i) => {
    ctx.save();
    ctx.translate(i * size, 0);
    drawFn(ctx, f, size, size);
    ctx.restore();
  });
  return { canvas: c, frameW: size, frames: frames.length };
}
var TextureManager = class {
  constructor() {
    this.walls = [];
    this.floors = [];
    this.ceilings = [];
    this.sprites = {};
    this.weapon = null;
    this._init();
  }
  _init() {
    this.walls[0] = null;
    this.walls[1] = brickTexture([120, 90, 70], "#3a3028");
    this.walls[2] = brickTexture([80, 85, 95], "#2a2a30");
    this.walls[3] = metalPanel();
    this.walls[4] = techWall();
    this.walls[5] = brickTexture([140, 50, 40], "#2a1818");
    this.walls[6] = brickTexture([60, 100, 80], "#1a2820");
    this.walls[7] = metalPanel();
    this.walls[8] = techWall();
    this.floors[1] = floorTile("#3a3530", "#2a2520");
    this.floors[2] = floorTile("#2a3040", "#1a2030");
    this.floors[3] = floorTile("#404035", "#303028");
    this.ceilings[1] = ceilingPanel();
    this.ceilings[2] = ceilingPanel();
    this.ceilings[3] = (() => {
      const c = makeCanvas();
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#0a0820";
      ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `hsl(${220 + Math.random() * 40}, 40%, ${15 + Math.random() * 15}%)`;
        ctx.fillRect(Math.random() * TEX_SIZE, Math.random() * TEX_SIZE, 2, 2);
      }
      return c;
    })();
    const impFrames = ["idle", "walk", "attack", "pain", "death"];
    const demonFrames = ["idle", "walk", "attack", "pain", "death"];
    this.sprites.imp = createSpriteSheet(drawImpFrame, impFrames);
    this.sprites.demon = createSpriteSheet(drawDemonFrame, demonFrames);
    this.sprites.lamp = this._createLampSprite();
    this.weapon = this._createWeaponSprite();
  }
  _createLampSprite() {
    const size = 64;
    const c = makeCanvas(size * 4, size);
    const ctx = c.getContext("2d");
    for (let f = 0; f < 4; f++) {
      const x = f * size;
      ctx.fillStyle = "#444";
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
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#3a3a40";
    ctx.fillRect(100, 120, 120, 50);
    ctx.fillStyle = "#2a2a30";
    ctx.fillRect(80, 160, 160, 80);
    ctx.fillStyle = "#554433";
    ctx.fillRect(130, 200, 60, 70);
    ctx.fillStyle = "#666";
    ctx.fillRect(200, 100, 80, 30);
    return c;
  }
  /** Sample wall texture with nearest-neighbor */
  sampleWall(texId, u, v) {
    const tex = this.walls[texId];
    if (!tex) return [40, 40, 50];
    const x = Math.floor(clamp(u, 0, 0.999) * (TEX_SIZE - 1));
    const y = Math.floor(clamp(v, 0, 0.999) * (TEX_SIZE - 1));
    const ctx = tex.getContext("2d");
    const d = ctx.getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  sampleFloor(texId, u, v) {
    const tex = this.floors[texId] || this.floors[1];
    const x = Math.floor(clamp(u % 1, 0, 0.999) * (TEX_SIZE - 1));
    const y = Math.floor(clamp(v % 1, 0, 0.999) * (TEX_SIZE - 1));
    const d = tex.getContext("2d").getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  sampleCeiling(texId, u, v) {
    const tex = this.ceilings[texId] || this.ceilings[1];
    const x = Math.floor(clamp(u % 1, 0, 0.999) * (TEX_SIZE - 1));
    const y = Math.floor(clamp(v % 1, 0, 0.999) * (TEX_SIZE - 1));
    const d = tex.getContext("2d").getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
};
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// src/utils/math.js
var TAU2 = Math.PI * 2;
function normalizeAngle(a) {
  a %= TAU2;
  if (a < 0) a += TAU2;
  return a;
}
function dist2(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  return dx * dx + dy * dy;
}
function dist(x1, y1, x2, y2) {
  return Math.sqrt(dist2(x1, y1, x2, y2));
}
function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}
function rayWallIntersect(ox, oy, dx, dy, map, maxDist = 64) {
  let x = ox, y = oy;
  const step = 0.02;
  let d = 0;
  while (d < maxDist) {
    x += dx * step;
    y += dy * step;
    d += step;
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if (mx < 0 || my < 0 || mx >= map.width || my >= map.height) return { hit: true, dist: d, x, y, mx, my, side: 0 };
    const cell = map.cells[my * map.width + mx];
    if (cell > 0 && cell !== 9) return { hit: true, dist: d, x, y, mx, my, side: Math.abs(x - mx - 0.5) > Math.abs(y - my - 0.5) ? 0 : 1 };
  }
  return { hit: false, dist: maxDist };
}

// src/engine/Raycaster.js
var Raycaster = class {
  constructor(canvas, textures) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.textures = textures;
    this.w = canvas.width;
    this.h = canvas.height;
    this.halfH = this.h / 2;
    this.zBuffer = new Float32Array(this.w);
    this.imageData = this.ctx.createImageData(this.w, this.h);
    this.pixels = this.imageData.data;
    this.fov = Math.PI / 3.2;
    this.numRays = this.w;
    this.rayStep = 1;
  }
  resize(w, h) {
    this.w = w;
    this.h = h;
    this.halfH = h / 2;
    this.canvas.width = w;
    this.canvas.height = h;
    this.zBuffer = new Float32Array(w);
    this.imageData = this.ctx.createImageData(w, h);
    this.pixels = this.imageData.data;
    this.numRays = w;
  }
  render(player, map, lights) {
    const { x: px, y: py, angle: pa, pitch } = player;
    const cosP = Math.cos(pitch || 0);
    const sinP = Math.sin(pitch || 0);
    const planeDist = this.w / 2 / Math.tan(this.fov / 2);
    const pitchOff = Math.floor(pitch * this.h * 0.5);
    const cells = map.cells;
    const mw = map.width;
    for (let col = 0; col < this.w; col += this.rayStep) {
      const cameraX = 2 * col / this.w - 1;
      const rayAngle = normalizeAngle(pa + Math.atan(cameraX * Math.tan(this.fov / 2)));
      const sinA = Math.sin(rayAngle);
      const cosA = Math.cos(rayAngle);
      const hit = this._castDDA(px, py, sinA, cosA, map);
      this.zBuffer[col] = hit.dist * cosA;
      const dist3 = Math.max(0.01, hit.dist);
      const lineH = Math.min(this.h * 2, this.h * hit.wallH / dist3);
      const drawStart = Math.floor(-lineH / 2 + this.halfH + pitchOff);
      const drawEnd = Math.floor(lineH / 2 + this.halfH + pitchOff);
      if (this.rayStep === 1) {
        this._drawFloorCeil(col, px, py, sinA, cosA, dist3, drawEnd, drawStart, map, pitchOff, lights);
      }
      let texU = hit.texU;
      const texId = hit.texId;
      const shade = this._calcLight(hit.x, hit.y, dist3, hit.side, lights, map);
      for (let y = Math.max(0, drawStart); y < Math.min(this.h, drawEnd); y++) {
        const texV = (y - drawStart) / (drawEnd - drawStart);
        const [r, g, b] = this.textures.sampleWall(texId, texU, texV);
        const idx = (y * this.w + col) * 4;
        this.pixels[idx] = r * shade;
        this.pixels[idx + 1] = g * shade;
        this.pixels[idx + 2] = b * shade;
        this.pixels[idx + 3] = 255;
      }
      if (this.rayStep > 1 && col + 1 < this.w) {
        this.zBuffer[col + 1] = this.zBuffer[col];
      }
    }
    this.ctx.putImageData(this.imageData, 0, 0);
    return this.zBuffer;
  }
  _castDDA(ox, oy, sinA, cosA, map) {
    const cells = map.cells;
    const mw = map.width, mh = map.height;
    let mapX = Math.floor(ox), mapY = Math.floor(oy);
    const deltaDistX = Math.abs(1 / (cosA || 1e-10));
    const deltaDistY = Math.abs(1 / (sinA || 1e-10));
    let stepX, stepY, sideDistX, sideDistY;
    if (cosA < 0) {
      stepX = -1;
      sideDistX = (ox - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - ox) * deltaDistX;
    }
    if (sinA < 0) {
      stepY = -1;
      sideDistY = (oy - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - oy) * deltaDistY;
    }
    let hit = false, side = 0, texId = 1, texU = 0, dist3 = 0;
    let hx = ox, hy = oy;
    for (let i = 0; i < 64; i++) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
        dist3 = sideDistX - deltaDistX;
        texU = oy + dist3 * sinA - mapY;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
        dist3 = sideDistY - deltaDistY;
        texU = ox + dist3 * cosA - mapX;
      }
      if (mapX < 0 || mapY < 0 || mapX >= mw || mapY >= mh) {
        hit = true;
        texId = 2;
        break;
      }
      const cell = cells[mapY * mw + mapX];
      if (cell === 9) {
        const key = `${mapX},${mapY}`;
        const d = map.doors.get(key);
        if (d && d.open > 0.15) {
          if (d.open > 0.85) continue;
          hit = true;
          texId = 3;
          break;
        }
        hit = true;
        texId = 3;
        break;
      }
      if (cell > 0 && cell !== 10) {
        hit = true;
        texId = cell;
        break;
      }
      if (cell === 10) {
        hit = true;
        texId = 4;
        break;
      }
    }
    texU -= Math.floor(texU);
    hx = ox + cosA * dist3;
    hy = oy + sinA * dist3;
    const wallH = map.getWallHeight(mapX, mapY);
    return { dist: dist3, side, texId, texU, x: hx, y: hy, wallH, mx: mapX, my: mapY };
  }
  _drawFloorCeil(col, px, py, sinA, cosA, wallDist, drawEnd, drawStart, map, pitchOff, lights) {
    const mw = map.width;
    let floorDist;
    for (let y = drawEnd; y < this.h; y++) {
      const p = y - this.halfH - pitchOff;
      floorDist = this.h * 0.5 / (p || 1);
      const rx = px + cosA * floorDist;
      const ry = py + sinA * floorDist;
      const mx = Math.floor(rx), my = Math.floor(ry);
      const fi = my * mw + mx;
      const ft = map.floorTex[fi] || 1;
      const [r, g, b] = this.textures.sampleFloor(ft, rx, ry);
      const shade = this._calcLight(rx, ry, floorDist, 2, lights, map) * 0.85;
      const idx = (y * this.w + col) * 4;
      this.pixels[idx] = r * shade;
      this.pixels[idx + 1] = g * shade;
      this.pixels[idx + 2] = b * shade;
      this.pixels[idx + 3] = 255;
    }
    for (let y = 0; y < drawStart; y++) {
      const p = this.halfH - y + pitchOff;
      floorDist = this.h * 0.5 / (p || 1);
      const rx = px + cosA * floorDist;
      const ry = py + sinA * floorDist;
      const mx = Math.floor(rx), my = Math.floor(ry);
      const fi = my * mw + mx;
      const ct = map.ceilTex[fi] || 1;
      const [r, g, b] = this.textures.sampleCeiling(ct, rx, ry);
      const shade = this._calcLight(rx, ry, floorDist, 3, lights, map) * 0.7;
      const idx = (y * this.w + col) * 4;
      this.pixels[idx] = r * shade;
      this.pixels[idx + 1] = g * shade;
      this.pixels[idx + 2] = b * shade;
      this.pixels[idx + 3] = 255;
    }
  }
  _calcLight(x, y, dist3, side, lights, map) {
    let light = 0.35 + 0.15 * (side === 0 ? 1 : 0.85);
    light += Math.max(0, 1 - dist3 / 18) * 0.25;
    for (const L of lights) {
      const dx = L.x - x, dy = L.y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < L.r) light += L.intensity * (1 - d / L.r) * 0.5;
    }
    return Math.min(1.15, light);
  }
};

// src/engine/SpriteRenderer.js
var FRAME_MAP = { idle: 0, walk: 1, attack: 2, pain: 3, death: 4 };
var SpriteRenderer = class {
  constructor(ctx, textures, w, h) {
    this.ctx = ctx;
    this.textures = textures;
    this.w = w;
    this.h = h;
    this.bloodParticles = [];
  }
  resize(w, h) {
    this.w = w;
    this.h = h;
  }
  render(player, entities, props, zBuffer, map, lights) {
    const sprites = [];
    for (const e of entities) {
      if (!e.alive && e.deathTimer > 2) continue;
      sprites.push({ ...e, isEnemy: true });
    }
    for (const p of props) {
      sprites.push({ x: p.x, y: p.y, type: p.type, frame: Math.floor(p.anim) % 4, alive: true, isProp: true });
    }
    sprites.sort((a, b) => {
      const da = dist(player.x, player.y, a.x, a.y);
      const db = dist(player.x, player.y, b.x, b.y);
      return db - da;
    });
    const px = player.x, py = player.y, pa = player.angle;
    const fov = Math.PI / 3.2;
    for (const sp of sprites) {
      const dx = sp.x - px, dy = sp.y - py;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.3 || d > 40) continue;
      let rel = Math.atan2(dy, dx) - pa;
      while (rel < -Math.PI) rel += TAU2;
      while (rel > Math.PI) rel -= TAU2;
      if (Math.abs(rel) > fov * 0.65) continue;
      const screenX = Math.floor((0.5 + rel / fov) * this.w);
      const spriteH = Math.min(this.h, this.h * 0.9 / d);
      const spriteW = spriteH * 0.7;
      const top = (this.h - spriteH) / 2;
      const left = screenX - spriteW / 2;
      if (screenX < 0 || screenX >= this.w) continue;
      if (zBuffer[Math.floor(screenX)] < d - 0.1) continue;
      const tex = this.textures.sprites[sp.type];
      if (!tex) continue;
      let frame = 0;
      if (sp.isProp) frame = sp.frame;
      else {
        const state = sp.dead ? "death" : sp.painTimer > 0 ? "pain" : sp.state === "attack" ? "attack" : sp.state === "chase" ? "walk" : "idle";
        frame = FRAME_MAP[state] ?? 0;
        if (sp.dead) frame = 4;
      }
      const angleToPlayer = angleBetween(sp.x, sp.y, px, py);
      const flip = Math.cos(angleToPlayer - pa) < 0;
      let shade = 0.4 + Math.max(0, 1 - d / 16) * 0.5;
      for (const L of lights) {
        const ldx = L.x - sp.x, ldy = L.y - sp.y;
        const ld = Math.sqrt(ldx * ldx + ldy * ldy);
        if (ld < L.r) shade += L.intensity * (1 - ld / L.r) * 0.35;
      }
      shade = Math.min(1.2, shade);
      this.ctx.save();
      this.ctx.globalAlpha = sp.dead ? Math.max(0, 1 - sp.deathTimer / 2) : 1;
      this.ctx.filter = `brightness(${shade})`;
      if (flip) {
        this.ctx.translate(left + spriteW, top);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(tex.canvas, frame * tex.frameW, 0, tex.frameW, tex.frameW, 0, 0, spriteW, spriteH);
      } else {
        this.ctx.drawImage(tex.canvas, frame * tex.frameW, 0, tex.frameW, tex.frameW, left, top, spriteW, spriteH);
      }
      this.ctx.restore();
    }
    this._renderBlood();
    this._updateBlood();
  }
  spawnBlood(x, y) {
    for (let i = 0; i < 8; i++) {
      this.bloodParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        life: 0.4 + Math.random() * 0.3
      });
    }
  }
  _updateBlood() {
    this.bloodParticles = this.bloodParticles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.016;
      return p.life > 0;
    });
  }
  _renderBlood() {
    for (const p of this.bloodParticles) {
      const sz = 4 + (1 - p.life) * 8;
      this.ctx.fillStyle = `rgba(180, 0, 0, ${p.life})`;
      this.ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
    }
  }
};

// src/entities/Player.js
var Player = class {
  constructor(start) {
    this.x = start.x;
    this.y = start.y;
    this.angle = start.angle;
    this.pitch = 0;
    this.health = 100;
    this.armor = 0;
    this.ammo = 50;
    this.kills = 0;
    this.vx = 0;
    this.vy = 0;
    this.speed = 0;
    this.radius = 0.28;
    this.crouching = false;
    this.onGround = true;
    this.vz = 0;
    this.height = 1.6;
    this.weaponBob = 0;
    this.recoil = 0;
    this.muzzleFlash = 0;
    this.fireCooldown = 0;
    this.footstepTimer = 0;
  }
  update(dt, input, map) {
    const accel = 28;
    const friction = 12;
    const maxSpeed = this.crouching ? 3.5 : 7;
    const turnSpeed = 2.8;
    let moveX = 0, moveY = 0;
    if (input.forward) moveY += 1;
    if (input.back) moveY -= 1;
    if (input.left) moveX -= 1;
    if (input.right) moveX += 1;
    if (input.mouseLook) {
      this.angle = normalizeAngle(this.angle + input.mouseDX * 22e-4);
      this.pitch = Math.max(-0.4, Math.min(0.4, this.pitch - input.mouseDY * 15e-4));
    } else {
      if (input.turnLeft) this.angle = normalizeAngle(this.angle - turnSpeed * dt);
      if (input.turnRight) this.angle = normalizeAngle(this.angle + turnSpeed * dt);
    }
    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      moveX /= len;
      moveY /= len;
      const sin = Math.sin(this.angle), cos = Math.cos(this.angle);
      const dirX = moveX * cos - moveY * sin;
      const dirY = moveX * sin + moveY * cos;
      this.vx += dirX * accel * dt;
      this.vy += dirY * accel * dt;
    }
    this.vx -= this.vx * friction * dt;
    this.vy -= this.vy * friction * dt;
    const spd = Math.hypot(this.vx, this.vy);
    if (spd > maxSpeed) {
      this.vx = this.vx / spd * maxSpeed;
      this.vy = this.vy / spd * maxSpeed;
    }
    this.speed = Math.hypot(this.vx, this.vy);
    this._moveAxis(this.vx * dt, 0, map);
    this._moveAxis(0, this.vy * dt, map);
    if (input.jump && this.onGround) {
      this.vz = 4.5;
      this.onGround = false;
    }
    if (!this.onGround) {
      this.vz -= 12 * dt;
      if (this.vz < 0 && this.onGround) this.vz = 0;
    }
    this.crouching = input.crouch;
    this.height = this.crouching ? 1 : 1.6;
    if (this.fireCooldown > 0) this.fireCooldown -= dt;
    if (this.muzzleFlash > 0) this.muzzleFlash -= dt * 8;
    if (this.recoil > 0) this.recoil -= dt * 6;
    this.weaponBob += this.speed * dt * 9;
    this.footstepTimer += this.speed * dt;
    map.tryOpenDoor(this.x, this.y);
  }
  _moveAxis(dx, dy, map) {
    const nx = this.x + dx, ny = this.y + dy;
    if (!map.isSolid(nx, this.y, this.radius)) this.x = nx;
    if (!map.isSolid(this.x, ny, this.radius)) this.y = ny;
  }
  canFire() {
    return this.fireCooldown <= 0 && this.ammo > 0;
  }
  fire() {
    if (!this.canFire()) return false;
    this.ammo--;
    this.fireCooldown = 0.35;
    this.muzzleFlash = 1;
    this.recoil = 1;
    return true;
  }
  takeDamage(amt) {
    const absorbed = Math.min(this.armor, amt * 0.35);
    this.armor = Math.max(0, this.armor - absorbed * 0.5);
    this.health -= amt - absorbed * 0.65;
    return this.health <= 0;
  }
};

// src/entities/Enemy.js
var TYPES = {
  imp: { health: 60, speed: 3.2, damage: 8, range: 12, attackRate: 1.2, radius: 0.35, score: 100 },
  demon: { health: 150, speed: 4.8, damage: 15, range: 1.2, attackRate: 0.8, radius: 0.5, score: 200 }
};
var Enemy = class {
  constructor(type, x, y) {
    const def = TYPES[type] || TYPES.imp;
    this.type = type;
    this.x = x;
    this.y = y;
    this.health = def.health;
    this.maxHealth = def.health;
    this.speed = def.speed;
    this.damage = def.damage;
    this.range = def.range;
    this.attackRate = def.attackRate;
    this.radius = def.radius;
    this.score = def.score;
    this.alive = true;
    this.dead = false;
    this.deathTimer = 0;
    this.painTimer = 0;
    this.state = "idle";
    this.attackCooldown = 0;
    this.anim = 0;
    this.angle = 0;
  }
  takeDamage(amt, bloodCb) {
    if (!this.alive) return;
    this.health -= amt;
    this.painTimer = 0.25;
    if (bloodCb) bloodCb(this.x, this.y);
    if (this.health <= 0) {
      this.alive = false;
      this.dead = true;
      this.deathTimer = 0;
      this.state = "death";
    }
  }
  update(dt, player, map, audio) {
    if (!this.alive) {
      this.deathTimer += dt;
      return;
    }
    if (this.painTimer > 0) this.painTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    const d = dist(this.x, this.y, player.x, player.y);
    if (d > 28) {
      this.state = "idle";
      return;
    }
    if (d <= this.range && this.attackCooldown <= 0) {
      this.state = "attack";
      this.attackCooldown = 1 / this.attackRate;
      if (this.type === "imp" && d > 2) {
        if (!map.isSolid((this.x + player.x) / 2, (this.y + player.y) / 2, 0.1)) {
          player.takeDamage(this.damage);
          audio?.playEnemyAttack("imp");
        }
      } else if (this.type === "demon") {
        player.takeDamage(this.damage);
        audio?.playEnemyAttack("demon");
      }
      return;
    }
    if (d < 24) {
      this.state = "chase";
      const ang = angleBetween(this.x, this.y, player.x, player.y);
      this.angle = ang;
      const mx = Math.cos(ang) * this.speed * dt;
      const my = Math.sin(ang) * this.speed * dt;
      const nx = this.x + mx, ny = this.y + my;
      if (!map.isSolid(nx, this.y, this.radius)) this.x = nx;
      if (!map.isSolid(this.x, ny, this.radius)) this.y = ny;
      if (!map.isSolid(nx, ny, this.radius)) {
        this.x = nx;
        this.y = ny;
      }
    } else {
      this.state = "idle";
    }
    this.anim += dt * 6;
  }
};

// src/systems/Input.js
var Input = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = /* @__PURE__ */ new Set();
    this.forward = false;
    this.back = false;
    this.left = false;
    this.right = false;
    this.turnLeft = false;
    this.turnRight = false;
    this.jump = false;
    this.crouch = false;
    this.fire = false;
    this.firePressed = false;
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.mouseLook = false;
    this.minimapToggle = false;
    this._bind();
  }
  _bind() {
    window.addEventListener("keydown", (e) => {
      this.keys.add(e.code);
      if (e.code === "KeyW") this.forward = true;
      if (e.code === "KeyS") this.back = true;
      if (e.code === "KeyA") this.left = true;
      if (e.code === "KeyD") this.right = true;
      if (e.code === "ArrowLeft") this.turnLeft = true;
      if (e.code === "ArrowRight") this.turnRight = true;
      if (e.code === "Space") this.jump = true;
      if (e.code === "ControlLeft" || e.code === "KeyC") this.crouch = true;
      if (e.code === "KeyM") this.minimapToggle = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.code);
      if (e.code === "KeyW") this.forward = false;
      if (e.code === "KeyS") this.back = false;
      if (e.code === "KeyA") this.left = false;
      if (e.code === "KeyD") this.right = false;
      if (e.code === "ArrowLeft") this.turnLeft = false;
      if (e.code === "ArrowRight") this.turnRight = false;
      if (e.code === "Space") this.jump = false;
      if (e.code === "ControlLeft" || e.code === "KeyC") this.crouch = false;
    });
    window.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement === this.canvas) {
        this.mouseDX = e.movementX;
        this.mouseDY = e.movementY;
        this.mouseLook = true;
      }
    });
    window.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.firePressed = true;
    });
    window.addEventListener("mouseup", (e) => {
      if (e.button === 0) this.fire = false;
    });
    this.canvas.addEventListener("click", () => {
      if (document.pointerLockElement !== this.canvas) {
        this.canvas.requestPointerLock?.();
      }
    });
  }
  endFrame() {
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.firePressed = false;
    this.minimapToggle = false;
    if (this.keys.has("Space")) this.jump = true;
    if (this.mouseLook || this.keys.has("KeyW") || this.keys.has("KeyS")) {
    }
    if (document.pointerLockElement === this.canvas && this.keys.has("KeyF")) {
    }
  }
  isDown(code) {
    return this.keys.has(code);
  }
};

// src/systems/Audio.js
var AudioSystem = class {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicOsc = null;
    this.enabled = false;
    this._musicStarted = false;
  }
  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.12;
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.6;
    this.sfxGain.connect(this.master);
    this.enabled = true;
  }
  resume() {
    if (this.ctx?.state === "suspended") this.ctx.resume();
  }
  startMusic() {
    if (!this.ctx || this._musicStarted) return;
    this._musicStarted = true;
    const t = this.ctx.currentTime;
    const notes = [110, 130.81, 146.83, 164.81, 146.83, 130.81, 98, 110];
    let time = t;
    const playNote = (freq, dur) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 800;
      o.type = "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.08, time + 0.02);
      g.gain.exponentialRampToValueAtTime(1e-3, time + dur);
      o.connect(f);
      f.connect(g);
      g.connect(this.musicGain);
      o.start(time);
      o.stop(time + dur);
      time += dur * 0.85;
    };
    const loop = () => {
      if (!this._musicStarted) return;
      notes.forEach((n, i) => playNote(n, 0.35));
      setTimeout(loop, notes.length * 0.35 * 850);
    };
    loop();
    const bass = this.ctx.createOscillator();
    const bg = this.ctx.createGain();
    bass.type = "sawtooth";
    bass.frequency.value = 55;
    bg.gain.value = 0.04;
    const bf = this.ctx.createBiquadFilter();
    bf.type = "lowpass";
    bf.frequency.value = 200;
    bass.connect(bf);
    bf.connect(bg);
    bg.connect(this.musicGain);
    bass.start();
    this.musicOsc = bass;
  }
  stopMusic() {
    this._musicStarted = false;
    this.musicOsc?.stop();
    this.musicOsc = null;
  }
  _noise(duration, filterFreq = 1e3) {
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    return { src, g };
  }
  playGunshot() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const { src, g } = this._noise(0.15, 2e3);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    src.start(t);
    src.stop(t + 0.2);
    const o = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    og.gain.setValueAtTime(0.2, t);
    og.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    o.connect(og);
    og.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.15);
  }
  playFootstep() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const { src, g } = this._noise(0.05, 400);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    src.start(t);
    src.stop(t + 0.06);
  }
  playEnemyPain() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(200, t);
    o.frequency.linearRampToValueAtTime(80, t + 0.2);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.3);
  }
  playEnemyAttack(type) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type === "demon" ? "sawtooth" : "triangle";
    o.frequency.value = type === "demon" ? 90 : 300;
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.2);
  }
  playPickup() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(440, t);
    o.frequency.linearRampToValueAtTime(880, t + 0.1);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.25);
  }
  playWin() {
    if (!this.ctx) return;
    [523, 659, 784].forEach((f, i) => {
      const t = this.ctx.currentTime + i * 0.15;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      o.connect(g);
      g.connect(this.sfxGain);
      o.start(t);
      o.stop(t + 0.5);
    });
  }
};

// src/systems/Combat.js
var Combat = class {
  constructor() {
    this.hitEffects = [];
  }
  /** Hitscan from player view */
  shoot(player, enemies, map, onHit) {
    const cos = Math.cos(player.angle);
    const sin = Math.sin(player.angle);
    const maxDist = 40;
    let closest = null;
    let closestDist = maxDist;
    const wallHit = rayWallIntersect(player.x, player.y, cos, sin, map, maxDist);
    const wallDist = wallHit.hit ? wallHit.dist : maxDist;
    for (const e of enemies) {
      if (!e.alive) continue;
      const dx = e.x - player.x, dy = e.y - player.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > wallDist || d > maxDist) continue;
      const ang = Math.atan2(dy, dx);
      let diff = ang - player.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      const hitRadius = e.radius / d + 0.04;
      if (Math.abs(diff) < hitRadius && d < closestDist) {
        closest = e;
        closestDist = d;
      }
    }
    if (closest) {
      const dmg = 20 + Math.floor(Math.random() * 15);
      closest.takeDamage(dmg, onHit);
      if (!closest.alive) {
        player.kills++;
        return { kill: true, enemy: closest };
      }
      return { hit: true, enemy: closest };
    }
    return { miss: true };
  }
};

// src/ui/HUD.js
var HUD = class {
  constructor() {
    this.healthEl = document.getElementById("hud-health");
    this.armorEl = document.getElementById("hud-armor");
    this.ammoEl = document.getElementById("hud-ammo");
    this.killsEl = document.getElementById("hud-kills");
    this.weaponEl = document.getElementById("weapon-sprite");
    this.messageEl = document.getElementById("message");
    this.msgTimer = 0;
  }
  update(player) {
    this.healthEl.textContent = Math.max(0, Math.ceil(player.health));
    this.armorEl.textContent = Math.ceil(player.armor);
    this.ammoEl.textContent = player.ammo;
    this.killsEl.textContent = player.kills;
    const bobX = Math.sin(player.weaponBob) * 8;
    const bobY = Math.abs(Math.cos(player.weaponBob * 0.5)) * 6;
    const recoilY = player.recoil * 25;
    const fireScale = player.muzzleFlash > 0 ? 1.05 : 1;
    this.weaponEl.style.transform = `translateX(calc(-50% + ${bobX}px)) translateY(${bobY + recoilY}px) scale(${fireScale})`;
    if (player.muzzleFlash > 0) {
      this.weaponEl.style.filter = `drop-shadow(0 0 ${20 * player.muzzleFlash}px rgba(255,200,100,0.9)) brightness(1.3)`;
    } else {
      this.weaponEl.style.filter = "drop-shadow(0 4px 12px rgba(0,0,0,0.8))";
    }
    if (this.msgTimer > 0) {
      this.msgTimer -= 0.016;
      if (this.msgTimer <= 0) this.messageEl.classList.add("hidden");
    }
  }
  showMessage(text, duration = 2) {
    this.messageEl.textContent = text;
    this.messageEl.classList.remove("hidden");
    this.msgTimer = duration;
  }
  setWeaponImage(dataUrl) {
    this.weaponEl.style.backgroundImage = `url(${dataUrl})`;
  }
};

// src/ui/Minimap.js
var Minimap = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.visible = true;
    this.scale = 3;
  }
  toggle() {
    this.visible = !this.visible;
    this.canvas.classList.toggle("hidden-map", !this.visible);
  }
  render(map, player, enemies) {
    if (!this.visible) return;
    const w = this.canvas.width, h = this.canvas.height;
    const mw = map.width, mh = map.height;
    const sc = Math.min(w / mw, h / mh);
    const ox = (w - mw * sc) / 2, oy = (h - mh * sc) / 2;
    this.ctx.fillStyle = "rgba(0, 30, 0, 0.9)";
    this.ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < mh; y++) {
      for (let x = 0; x < mw; x++) {
        const c = map.cells[y * mw + x];
        if (c > 0 && c !== 9) {
          this.ctx.fillStyle = c === 10 ? "#ffcc00" : "#448844";
          this.ctx.fillRect(ox + x * sc, oy + y * sc, sc, sc);
        } else if (c === 9) {
          this.ctx.fillStyle = "#886644";
          this.ctx.fillRect(ox + x * sc, oy + y * sc, sc, sc);
        }
      }
    }
    for (const e of enemies) {
      if (!e.alive && e.deathTimer > 1) continue;
      this.ctx.fillStyle = e.alive ? "#ff2222" : "#662222";
      this.ctx.fillRect(ox + e.x * sc - 2, oy + e.y * sc - 2, 4, 4);
    }
    const px = ox + player.x * sc, py = oy + player.y * sc;
    this.ctx.fillStyle = "#44ff44";
    this.ctx.beginPath();
    this.ctx.arc(px, py, 3, 0, Math.PI * 2);
    this.ctx.fill();
    const len = 10;
    this.ctx.strokeStyle = "#aaffaa";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(px + Math.cos(player.angle) * len, py + Math.sin(player.angle) * len);
    this.ctx.stroke();
  }
};

// src/effects/PostProcess.js
var PostProcess = class {
  constructor(overlayCanvas) {
    this.canvas = overlayCanvas;
    this.ctx = overlayCanvas.getContext("2d");
    this.crt = true;
    this.bloom = true;
    this.vignette = true;
    this._bloomCanvas = document.createElement("canvas");
    this._bloomCtx = this._bloomCanvas.getContext("2d");
  }
  setOptions({ crt, bloom, vignette }) {
    if (crt !== void 0) this.crt = crt;
    if (bloom !== void 0) this.bloom = bloom;
    if (vignette !== void 0) this.vignette = vignette;
  }
  apply(gameCanvas, muzzleFlash = 0) {
    const w = gameCanvas.width, h = gameCanvas.height;
    if (this.canvas.width !== w) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx.clearRect(0, 0, w, h);
    if (this.bloom) {
      this._bloomCanvas.width = w >> 2;
      this._bloomCanvas.height = h >> 2;
      this._bloomCtx.drawImage(gameCanvas, 0, 0, w >> 2, h >> 2);
      this.ctx.save();
      this.ctx.globalCompositeOperation = "screen";
      this.ctx.globalAlpha = 0.25 + muzzleFlash * 0.3;
      this.ctx.filter = "blur(8px) brightness(1.4)";
      this.ctx.drawImage(this._bloomCanvas, 0, 0, w, h);
      this.ctx.restore();
    }
    if (this.vignette) {
      const g = this.ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.85);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      this.ctx.fillStyle = g;
      this.ctx.fillRect(0, 0, w, h);
    }
    this.ctx.fillStyle = "rgba(40, 20, 60, 0.08)";
    this.ctx.fillRect(0, 0, w, h);
    if (this.crt) {
      this.ctx.globalAlpha = 0.12;
      this.ctx.fillStyle = "#000";
      for (let y = 0; y < h; y += 3) {
        this.ctx.fillRect(0, y, w, 1);
      }
      this.ctx.globalAlpha = 0.04;
      this.ctx.fillStyle = "rgba(255,0,0,0.5)";
      this.ctx.fillRect(2, 0, w, h);
      this.ctx.fillStyle = "rgba(0,0,255,0.5)";
      this.ctx.fillRect(-2, 0, w, h);
      this.ctx.globalAlpha = 1;
    }
    if (muzzleFlash > 0) {
      this.ctx.fillStyle = `rgba(255, 220, 150, ${muzzleFlash * 0.35})`;
      this.ctx.fillRect(0, 0, w, h);
    }
  }
};

// src/main.js
var STATE = { MENU: 0, PLAYING: 1, DEAD: 2, WIN: 3 };
var Game = class {
  constructor() {
    this.canvas = document.getElementById("game");
    this.overlay = document.getElementById("overlay");
    this.state = STATE.MENU;
    this.textures = new TextureManager();
    this.raycaster = new Raycaster(this.canvas, this.textures);
    this.spriteRenderer = new SpriteRenderer(
      this.raycaster.ctx,
      this.textures,
      this.canvas.width,
      this.canvas.height
    );
    this.input = new Input(this.canvas);
    this.audio = new AudioSystem();
    this.combat = new Combat();
    this.hud = new HUD();
    this.minimap = new Minimap(document.getElementById("minimap"));
    this.post = new PostProcess(this.overlay);
    this.lastTime = 0;
    this.pickups = [];
    this._bindUI();
    this._resize();
    window.addEventListener("resize", () => this._resize());
    this.hud.setWeaponImage(this.textures.weapon.toDataURL());
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }
  _bindUI() {
    document.getElementById("btn-start").addEventListener("click", () => this.startGame());
    document.getElementById("btn-retry").addEventListener("click", () => this.startGame());
    document.getElementById("btn-menu").addEventListener("click", () => this.showMenu());
    document.getElementById("btn-fullscreen").addEventListener("click", () => this._toggleFullscreen());
    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyF") this._toggleFullscreen();
      if (e.code === "Escape" && this.state === STATE.PLAYING) this.showMenu();
    });
    window.addEventListener("mousedown", (e) => {
      if (this.state === STATE.PLAYING && e.button === 0) this.input.fire = true;
    });
    this._initTouch();
  }
  _initTouch() {
    const tc = document.getElementById("touch-controls");
    if ("ontouchstart" in window) tc.classList.remove("hidden");
    const moveStick = document.getElementById("stick-move");
    const lookStick = document.getElementById("stick-look");
    const setupStick = (el, onMove) => {
      let active = false;
      const knob = el.querySelector(".stick-knob");
      const rect = () => el.getBoundingClientRect();
      const handle = (cx, cy) => {
        const r = rect();
        const cx0 = r.left + r.width / 2, cy0 = r.top + r.height / 2;
        let dx = cx - cx0, dy = cy - cy0;
        const max = 40;
        const d = Math.hypot(dx, dy);
        if (d > max) {
          dx = dx / d * max;
          dy = dy / d * max;
        }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        onMove(dx / max, dy / max);
      };
      el.addEventListener("touchstart", (e) => {
        active = true;
        handle(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      });
      el.addEventListener("touchmove", (e) => {
        if (active) handle(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      });
      el.addEventListener("touchend", () => {
        active = false;
        knob.style.transform = "";
        onMove(0, 0);
      });
    };
    setupStick(moveStick, (x, y) => {
      this.input.forward = y < -0.2;
      this.input.back = y > 0.2;
      this.input.left = x < -0.2;
      this.input.right = x > 0.2;
    });
    setupStick(lookStick, (x, y) => {
      this.input.mouseDX = x * 4;
      this.input.mouseDY = y * 4;
      this.input.mouseLook = true;
    });
    document.getElementById("btn-fire").addEventListener("touchstart", (e) => {
      this.input.fire = true;
      e.preventDefault();
    });
  }
  _resize() {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;
    const aspect = 16 / 9;
    let w = maxW, h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    w = Math.floor(w);
    h = Math.floor(h);
    this.canvas.width = w;
    this.canvas.height = h;
    this.overlay.width = w;
    this.overlay.height = h;
    this.raycaster.resize(w, h);
    this.spriteRenderer.resize(w, h);
  }
  async startGame() {
    await this.audio.init();
    this.audio.resume();
    this.audio.startMusic();
    const level = createLevel();
    this.map = new GameMap(level);
    this.player = new Player({ ...level.playerStart });
    this.enemies = level.enemies.map((e) => new Enemy(e.type, e.x, e.y));
    this.props = level.props.map((p) => ({ ...p, anim: 0 }));
    this.pickups = [
      { type: "health", x: 18, y: 5, amount: 25 },
      { type: "armor", x: 46, y: 5, amount: 50 },
      { type: "ammo", x: 15, y: 54, amount: 30 },
      { type: "ammo", x: 50, y: 54, amount: 30 }
    ];
    this.totalEnemies = this.enemies.length;
    document.getElementById("menu").classList.remove("active");
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("hud").classList.remove("hidden");
    this.post.setOptions({
      crt: document.getElementById("opt-crt").checked,
      bloom: document.getElementById("opt-bloom").checked,
      vignette: document.getElementById("opt-vignette").checked
    });
    this.state = STATE.PLAYING;
    this.hud.showMessage("HANGAR \u2014 CLEAR THE DECKS", 3);
    this.canvas.requestPointerLock?.();
  }
  showMenu() {
    this.state = STATE.MENU;
    document.exitPointerLock?.();
    this.audio.stopMusic();
    document.getElementById("menu").classList.add("active");
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("hud").classList.add("hidden");
    document.getElementById("game-over").classList.add("hidden");
  }
  _toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  _endGame(won) {
    this.state = won ? STATE.WIN : STATE.DEAD;
    document.exitPointerLock?.();
    const panel = document.getElementById("game-over");
    panel.classList.remove("hidden");
    panel.classList.toggle("win", won);
    document.getElementById("end-title").textContent = won ? "MISSION COMPLETE" : "YOU DIED";
    document.getElementById("end-stats").textContent = `Kills: ${this.player.kills}/${this.totalEnemies} \xB7 Health: ${Math.max(0, Math.ceil(this.player.health))}`;
    if (won) this.audio.playWin();
  }
  _loop(now) {
    requestAnimationFrame(this._loop);
    const dt = Math.min(0.05, (now - this.lastTime) / 1e3) || 0.016;
    this.lastTime = now;
    if (this.state === STATE.PLAYING) {
      this._update(dt);
      this._render();
    }
    this.input.endFrame();
  }
  _update(dt) {
    this.map.updateDoors(dt);
    this.player.update(dt, this.input, this.map);
    if (this.input.minimapToggle) this.minimap.toggle();
    if ((this.input.fire || this.input.firePressed) && this.player.canFire()) {
      if (this.player.fire()) {
        this.audio.playGunshot();
        const result = this.combat.shoot(
          this.player,
          this.enemies,
          this.map,
          (x, y) => this.spriteRenderer.spawnBlood(
            this._worldToScreen(x, y)?.x ?? this.canvas.width / 2,
            this._worldToScreen(x, y)?.y ?? this.canvas.height / 2
          )
        );
        if (result?.hit || result?.kill) this.audio.playEnemyPain();
      }
    }
    for (const e of this.enemies) {
      e.update(dt, this.player, this.map, this.audio);
    }
    for (const p of this.props) {
      p.anim += dt * 4;
    }
    this.pickups = this.pickups.filter((pk) => {
      if (dist(this.player.x, this.player.y, pk.x, pk.y) < 1) {
        if (pk.type === "health") this.player.health = Math.min(100, this.player.health + pk.amount);
        if (pk.type === "armor") this.player.armor = Math.min(100, this.player.armor + pk.amount);
        if (pk.type === "ammo") this.player.ammo += pk.amount;
        this.audio.playPickup();
        return false;
      }
      return true;
    });
    if (this.player.footstepTimer > 0.35 && this.player.speed > 1) {
      this.audio.playFootstep();
      this.player.footstepTimer = 0;
    }
    if (this.map.exitPos && dist(this.player.x, this.player.y, this.map.exitPos.x, this.map.exitPos.y) < 1.5) {
      if (this.enemies.every((e) => !e.alive)) this._endGame(true);
      else this.hud.showMessage("CLEAR ALL ENEMIES FIRST", 1.5);
    }
    if (this.enemies.every((e) => !e.alive)) {
      this.hud.showMessage("EXIT PORTAL OPEN \u2014 NORTH-EAST", 2);
    }
    if (this.player.health <= 0) this._endGame(false);
    this.hud.update(this.player);
  }
  _worldToScreen(wx, wy) {
    const dx = wx - this.player.x, dy = wy - this.player.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    let rel = Math.atan2(dy, dx) - this.player.angle;
    while (rel < -Math.PI) rel += Math.PI * 2;
    while (rel > Math.PI) rel -= Math.PI * 2;
    const fov = Math.PI / 3.2;
    if (Math.abs(rel) > fov * 0.65) return null;
    return {
      x: (0.5 + rel / fov) * this.canvas.width,
      y: this.canvas.height / 2
    };
  }
  _render() {
    const zBuf = this.raycaster.render(this.player, this.map, this.map.lights);
    this.spriteRenderer.render(
      this.player,
      this.enemies,
      this.props,
      zBuf,
      this.map,
      this.map.lights
    );
    this.post.apply(this.canvas, this.player.muzzleFlash);
    this.minimap.render(this.map, this.player, this.enemies);
  }
};
new Game();
