import { normalizeAngle, TAU } from '../utils/math.js';

export class Player {
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
      this.angle = normalizeAngle(this.angle + input.mouseDX * 0.0022);
      this.pitch = Math.max(-0.4, Math.min(0.4, this.pitch - input.mouseDY * 0.0015));
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
      this.vx = (this.vx / spd) * maxSpeed;
      this.vy = (this.vy / spd) * maxSpeed;
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
    this.height = this.crouching ? 1.0 : 1.6;

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
}