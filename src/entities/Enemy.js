import { dist, angleBetween, normalizeAngle } from '../utils/math.js';

const TYPES = {
  imp: { health: 60, speed: 3.2, damage: 8, range: 12, attackRate: 1.2, radius: 0.35, score: 100 },
  demon: { health: 150, speed: 4.8, damage: 15, range: 1.2, attackRate: 0.8, radius: 0.5, score: 200 },
};

export class Enemy {
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
    this.state = 'idle';
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
      this.state = 'death';
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
    if (d > 28) { this.state = 'idle'; return; }

    if (d <= this.range && this.attackCooldown <= 0) {
      this.state = 'attack';
      this.attackCooldown = 1 / this.attackRate;
      if (this.type === 'imp' && d > 2) {
        // Ranged — damage if line roughly clear
        if (!map.isSolid((this.x + player.x) / 2, (this.y + player.y) / 2, 0.1)) {
          player.takeDamage(this.damage);
          audio?.playEnemyAttack('imp');
        }
      } else if (this.type === 'demon') {
        player.takeDamage(this.damage);
        audio?.playEnemyAttack('demon');
      }
      return;
    }

    if (d < 24) {
      this.state = 'chase';
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
      this.state = 'idle';
    }
    this.anim += dt * 6;
  }
}