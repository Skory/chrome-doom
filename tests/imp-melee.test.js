import { createLevel } from '../src/data/e1m1.js';
import { GameMap } from '../src/engine/Map.js';
import { Player } from '../src/entities/Player.js';
import { Enemy } from '../src/entities/Enemy.js';

const map = new GameMap(createLevel());
const player = new Player({ x: 10, y: 10 });
const imp = new Enemy('imp', 10.2, 10.2);
imp.state = 'attack';
imp.attackCooldown = 0;

const hp0 = player.health;
for (let i = 0; i < 5; i++) imp.update(0.1, player, map, null);
if (player.health >= hp0) {
  console.error('Imp failed to damage at melee range');
  process.exit(1);
}
console.log('✓ imp melee damage');
process.exit(0);