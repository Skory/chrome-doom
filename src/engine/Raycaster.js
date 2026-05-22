/**
 * Column-based raycaster — DDA, variable wall heights,
 * textured floors/ceilings, per-column dynamic lighting.
 */

import { normalizeAngle, TAU } from '../utils/math.js';

export class Raycaster {
  constructor(canvas, textures) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
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
    const planeDist = (this.w / 2) / Math.tan(this.fov / 2);
    const pitchOff = Math.floor(pitch * this.h * 0.5);

    // Clear to ceiling/floor base via per-column render
    const cells = map.cells;
    const mw = map.width;

    for (let col = 0; col < this.w; col += this.rayStep) {
      const cameraX = (2 * col / this.w) - 1;
      const rayAngle = normalizeAngle(pa + Math.atan(cameraX * Math.tan(this.fov / 2)));
      const sinA = Math.sin(rayAngle);
      const cosA = Math.cos(rayAngle);

      const hit = this._castDDA(px, py, sinA, cosA, map);
      this.zBuffer[col] = hit.dist * cosA; // remove fisheye

      const dist = Math.max(0.01, hit.dist);
      const lineH = Math.min(this.h * 2, (this.h * hit.wallH) / dist);
      const drawStart = Math.floor(-lineH / 2 + this.halfH + pitchOff);
      const drawEnd = Math.floor(lineH / 2 + this.halfH + pitchOff);

      // Floor & ceiling cast for this column
      if (this.rayStep === 1) {
        this._drawFloorCeil(col, px, py, sinA, cosA, dist, drawEnd, drawStart, map, pitchOff, lights);
      }

      // Wall column
      let texU = hit.texU;
      const texId = hit.texId;
      const shade = this._calcLight(hit.x, hit.y, dist, hit.side, lights, map);

      for (let y = Math.max(0, drawStart); y < Math.min(this.h, drawEnd); y++) {
        const texV = (y - drawStart) / (drawEnd - drawStart);
        const [r, g, b] = this.textures.sampleWall(texId, texU, texV);
        const idx = (y * this.w + col) * 4;
        this.pixels[idx] = r * shade;
        this.pixels[idx + 1] = g * shade;
        this.pixels[idx + 2] = b * shade;
        this.pixels[idx + 3] = 255;
      }
      // Fill rayStep width
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
    if (cosA < 0) { stepX = -1; sideDistX = (ox - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1 - ox) * deltaDistX; }
    if (sinA < 0) { stepY = -1; sideDistY = (oy - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1 - oy) * deltaDistY; }

    let hit = false, side = 0, texId = 1, texU = 0, dist = 0;
    let hx = ox, hy = oy;

    for (let i = 0; i < 64; i++) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
        dist = sideDistX - deltaDistX;
        texU = oy + dist * sinA - mapY;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
        dist = sideDistY - deltaDistY;
        texU = ox + dist * cosA - mapX;
      }
      if (mapX < 0 || mapY < 0 || mapX >= mw || mapY >= mh) {
        hit = true; texId = 2; break;
      }
      const cell = cells[mapY * mw + mapX];
      if (cell === 9) {
        const key = `${mapX},${mapY}`;
        const d = map.doors.get(key);
        if (d && d.open > 0.15) {
          if (d.open > 0.85) continue;
          hit = true; texId = 3; break;
        }
        hit = true; texId = 3; break;
      }
      if (cell > 0 && cell !== 10) {
        hit = true;
        texId = cell;
        break;
      }
      if (cell === 10) { hit = true; texId = 4; break; }
    }
    texU -= Math.floor(texU);
    hx = ox + cosA * dist;
    hy = oy + sinA * dist;
    const wallH = map.getWallHeight(mapX, mapY);
    return { dist, side, texId, texU, x: hx, y: hy, wallH, mx: mapX, my: mapY };
  }

  _drawFloorCeil(col, px, py, sinA, cosA, wallDist, drawEnd, drawStart, map, pitchOff, lights) {
    const mw = map.width;
    let floorDist;
    for (let y = drawEnd; y < this.h; y++) {
      const p = y - this.halfH - pitchOff;
      floorDist = (this.h * 0.5) / (p || 1);
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
      floorDist = (this.h * 0.5) / (p || 1);
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

  _calcLight(x, y, dist, side, lights, map) {
    let light = 0.35 + 0.15 * (side === 0 ? 1 : 0.85);
    light += Math.max(0, 1 - dist / 18) * 0.25;
    for (const L of lights) {
      const dx = L.x - x, dy = L.y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < L.r) light += L.intensity * (1 - d / L.r) * 0.5;
    }
    return Math.min(1.15, light);
  }
}