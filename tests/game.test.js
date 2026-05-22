/**
 * Integration tests — level data, map collision, module exports.
 */

import { createLevel, MAP_W, MAP_H } from '../src/data/e1m1.js';
import { GameMap } from '../src/engine/Map.js';
import { Player } from '../src/entities/Player.js';
import { Enemy } from '../src/entities/Enemy.js';
import { Combat } from '../src/systems/Combat.js';
import { dist } from '../src/utils/math.js';

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ ${msg}`); }
}

console.log('=== Level tests ===');
const level = createLevel();
assert(level.cells.length === MAP_W * MAP_H, 'cells grid size');
assert(level.playerStart.x > 0, 'player start x');
assert(level.enemies.length >= 10, 'enough enemies');
const impCount = level.enemies.filter(e => e.type === 'imp').length;
const demonCount = level.enemies.filter(e => e.type === 'demon').length;
assert(impCount >= 5, 'imp enemies');
assert(demonCount >= 3, 'demon enemies');
assert(level.props.length >= 5, 'animated props');
assert(level.lights.length >= 4, 'dynamic lights');
assert(level.cells.includes(10), 'exit cell exists');

console.log('=== Map collision ===');
const map = new GameMap(level);
const p = new Player(level.playerStart);
assert(!map.isSolid(p.x, p.y, p.radius), 'player start not solid');
let wallCount = 0;
for (let y = 0; y < MAP_H; y++)
  for (let x = 0; x < MAP_W; x++)
    if (map.cells[y * MAP_W + x] > 0 && map.cells[y * MAP_W + x] !== 9) wallCount++;
assert(wallCount > 50, 'map has walls');
assert(map.exitPos !== null, 'exit position found');

console.log('=== Player movement ===');
const input = { forward: true, back: false, left: false, right: false, mouseLook: false, mouseDX: 0, mouseDY: 0, turnLeft: false, turnRight: false, jump: false, crouch: false };
const ox = p.x, oy = p.y;
for (let i = 0; i < 30; i++) p.update(0.016, input, map);
assert(dist(ox, oy, p.x, p.y) > 0.1, 'player moved forward');
assert(p.canFire(), 'can fire initially');
assert(p.fire(), 'fire consumes ammo');
assert(p.ammo === 49, 'ammo decremented');

console.log('=== Combat ===');
const combat = new Combat();
const enemies = [new Enemy('imp', p.x + 2, p.y)];
p.angle = Math.atan2(enemies[0].y - p.y, enemies[0].x - p.x);
const res = combat.shoot(p, enemies, map, () => {});
assert(res.hit || res.kill, 'hitscan hits enemy in front');
enemies[0].takeDamage(999);
assert(!enemies[0].alive, 'enemy dies');

console.log('=== Enemy AI states ===');
const e2 = new Enemy('demon', p.x + 5, p.y);
e2.update(0.1, p, map, null);
assert(['idle', 'chase', 'attack'].includes(e2.state), 'enemy has valid state');

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);