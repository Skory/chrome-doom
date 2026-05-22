import { rayWallIntersect } from '../utils/math.js';
import { dist } from '../utils/math.js';

export class Combat {
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

    // Check wall first
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
}