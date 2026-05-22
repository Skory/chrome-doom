/**
 * Billboard sprite renderer with depth sorting & scaling.
 */

import { dist, angleBetween, normalizeAngle, TAU } from '../utils/math.js';

const FRAME_MAP = { idle: 0, walk: 1, attack: 2, pain: 3, death: 4 };

export class SpriteRenderer {
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
      while (rel < -Math.PI) rel += TAU;
      while (rel > Math.PI) rel -= TAU;
      if (Math.abs(rel) > fov * 0.65) continue;

      const screenX = Math.floor((0.5 + rel / fov) * this.w);
      const spriteH = Math.min(this.h, (this.h * 0.9) / d);
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
        const state = sp.dead ? 'death' : sp.painTimer > 0 ? 'pain' : sp.state === 'attack' ? 'attack' : sp.state === 'chase' ? 'walk' : 'idle';
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
        x, y, vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1,
        life: 0.4 + Math.random() * 0.3,
      });
    }
  }

  _updateBlood() {
    this.bloodParticles = this.bloodParticles.filter(p => {
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
}