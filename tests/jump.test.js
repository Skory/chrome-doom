import { createLevel } from '../src/data/e1m1.js';
import { GameMap } from '../src/engine/Map.js';
import { Player } from '../src/entities/Player.js';

const level = createLevel();
const map = new GameMap(level);
const p = new Player(level.playerStart);
const input = { forward: false, back: false, left: false, right: false, mouseLook: false, mouseDX: 0, mouseDY: 0, turnLeft: false, turnRight: false, jump: true, crouch: false };

p.update(0.016, input, map);
let airborne = false;
for (let i = 0; i < 120; i++) {
  p.update(0.016, { ...input, jump: false }, map);
  if (!p.onGround) airborne = true;
}
if (!airborne || !p.onGround) {
  console.error('Jump failed: airborne=', airborne, 'onGround=', p.onGround, 'z=', p.z);
  process.exit(1);
}
console.log('✓ jump takeoff and landing');
process.exit(0);