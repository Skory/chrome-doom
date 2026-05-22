/**
 * Column-based raycaster — DDA, variable wall heights,
 * textured floors/ceilings, per-column dynamic lighting.
 * Optimized: cached texture pixels, adaptive rayStep, vertical skipping.
 */

import { normalizeAngle } from '../utils/math.js';

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
    this.rayStep = 2;
    this.floorStep = 2;
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
    this.rayStep = w > 720 ? 2 : 1;
    this.floorStep = h > 500 ? 2 : 1;
  }

  render(player, map, lights) {
    const { x: px, y: py, angle: pa, pitch } = player;
    const viewPitch = (pitch || 0) + (player.z || 0) * 0.12;
    const pitchOff = (viewPitch * this.h * 0.5) | 0;
    const w = this.w, h = this.h, halfH = this.halfH;
    const pixels = this.pixels;
    const step = this.rayStep;
    const fStep = this.floorStep;

    for (let col = 0; col < w; col += step) {
      const cameraX = (2 * col / w) - 1;
      const rayAngle = normalizeAngle(pa + Math.atan(cameraX * Math.tan(this.fov / 2)));
      const sinA = Math.sin(rayAngle);
      const cosA = Math.cos(rayAngle);

      const hit = this._castDDA(px, py, sinA, cosA, map);
      const zDist = hit.dist * cosA;
      this.zBuffer[col] = zDist;
      if (step > 1 && col + 1 < w) this.zBuffer[col + 1] = zDist;

      const dist = Math.max(0.01, hit.dist);
      const lineH = Math.min(h * 2, (h * hit.wallH) / dist);
      const drawStart = Math.max(0, (-lineH / 2 + halfH + pitchOff) | 0);
      const drawEnd = Math.min(h, (lineH / 2 + halfH + pitchOff) | 0);

      this._drawFloorCeil(col, px, py, sinA, cosA, dist, drawEnd, drawStart, map, pitchOff, lights, fStep);

      const texId = hit.texId;
      const shade = this._calcLight(hit.x, hit.y, dist, hit.side, lights);
      const texU = hit.texU;
      const wallSpan = drawEnd - drawStart || 1;

      for (let y = drawStart; y < drawEnd; y++) {
        const texV = (y - drawStart) / wallSpan;
        const [r, g, b] = this.textures.sampleWall(texId, texU, texV);
        const idx = (y * w + col) * 4;
        pixels[idx] = r * shade;
        pixels[idx + 1] = g * shade;
        pixels[idx + 2] = b * shade;
        pixels[idx + 3] = 255;
      }

      if (step > 1 && col + 1 < w) {
        for (let y = 0; y < h; y++) {
          const src = (y * w + col) * 4;
          const dst = src + 4;
          pixels[dst] = pixels[src];
          pixels[dst + 1] = pixels[src + 1];
          pixels[dst + 2] = pixels[src + 2];
          pixels[dst + 3] = 255;
        }
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

    let side = 0, texId = 1, texU = 0, dist = 0;

    for (let i = 0; i < 48; i++) {
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
        texId = 2; break;
      }
      const cell = cells[mapY * mw + mapX];
      if (cell === 9) {
        const d = map.doors.get(`${mapX},${mapY}`);
        if (d && d.open > 0.15) {
          if (d.open > 0.85) continue;
          texId = 3; break;
        }
        texId = 3; break;
      }
      if (cell > 0 && cell !== 10) { texId = cell; break; }
      if (cell === 10) { texId = 4; break; }
    }
    texU -= Math.floor(texU);
    return {
      dist, side, texId, texU,
      x: ox + cosA * dist, y: oy + sinA * dist,
      wallH: map.getWallHeight(mapX, mapY),
    };
  }

  _drawFloorCeil(col, px, py, sinA, cosA, wallDist, drawEnd, drawStart, map, pitchOff, lights, fStep) {
    const w = this.w, h = this.h, halfH = this.halfH;
    const pixels = this.pixels;
    const mw = map.width;

    for (let y = drawEnd; y < h; y += fStep) {
      const p = y - halfH - pitchOff;
      const floorDist = (halfH) / (p || 1);
      const rx = px + cosA * floorDist;
      const ry = py + sinA * floorDist;
      const fi = (Math.floor(ry) * mw + Math.floor(rx));
      const [r, g, b] = this.textures.sampleFloor(map.floorTex[fi] || 1, rx, ry);
      const shade = this._calcLight(rx, ry, floorDist, 2, lights) * 0.85;
      const idx = (y * w + col) * 4;
      pixels[idx] = r * shade;
      pixels[idx + 1] = g * shade;
      pixels[idx + 2] = b * shade;
      pixels[idx + 3] = 255;
      if (fStep > 1 && y + 1 < h) {
        const idx2 = ((y + 1) * w + col) * 4;
        pixels[idx2] = pixels[idx];
        pixels[idx2 + 1] = pixels[idx + 1];
        pixels[idx2 + 2] = pixels[idx + 2];
        pixels[idx2 + 3] = 255;
      }
    }
    for (let y = 0; y < drawStart; y += fStep) {
      const p = halfH - y + pitchOff;
      const floorDist = halfH / (p || 1);
      const rx = px + cosA * floorDist;
      const ry = py + sinA * floorDist;
      const fi = (Math.floor(ry) * mw + Math.floor(rx));
      const [r, g, b] = this.textures.sampleCeiling(map.ceilTex[fi] || 1, rx, ry);
      const shade = this._calcLight(rx, ry, floorDist, 3, lights) * 0.7;
      const idx = (y * w + col) * 4;
      pixels[idx] = r * shade;
      pixels[idx + 1] = g * shade;
      pixels[idx + 2] = b * shade;
      pixels[idx + 3] = 255;
      if (fStep > 1 && y + 1 < drawStart) {
        const idx2 = ((y + 1) * w + col) * 4;
        pixels[idx2] = pixels[idx];
        pixels[idx2 + 1] = pixels[idx + 1];
        pixels[idx2 + 2] = pixels[idx + 2];
        pixels[idx2 + 3] = 255;
      }
    }
  }

  _calcLight(x, y, dist, side, lights) {
    let light = 0.35 + (side === 0 ? 0.15 : 0.12);
    light += Math.max(0, 1 - dist / 18) * 0.25;
    for (let i = 0; i < lights.length; i++) {
      const L = lights[i];
      const dx = L.x - x, dy = L.y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < L.r) light += L.intensity * (1 - d / L.r) * 0.5;
    }
    return light > 1.15 ? 1.15 : light;
  }
}