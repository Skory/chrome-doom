/**
 * Raycaster frame-time benchmark (software renderer only).
 */
import { createLevel } from '../src/data/e1m1.js';
import { GameMap } from '../src/engine/Map.js';
import { TextureManager } from '../src/engine/TextureManager.js';
import { Raycaster } from '../src/engine/Raycaster.js';
import { Player } from '../src/entities/Player.js';
import { createCanvas } from 'canvas';

global.document = {
  createElement: (tag) => (tag === 'canvas' ? createCanvas(256, 256) : {}),
};

const canvas = createCanvas(800, 450);
const tex = new TextureManager();
const rc = new Raycaster(canvas, tex);
rc.resize(800, 450);
const map = new GameMap(createLevel());
const player = new Player({ x: 32.5, y: 24.5, angle: 0 });

// Warmup
for (let i = 0; i < 5; i++) rc.render(player, map, map.lights);

const frames = 30;
const t0 = performance.now();
for (let i = 0; i < frames; i++) rc.render(player, map, map.lights);
const ms = (performance.now() - t0) / frames;
console.log(`Raycaster avg frame: ${ms.toFixed(1)}ms (${(1000 / ms).toFixed(0)} FPS)`);
if (ms > 33) {
  console.error('FAIL: target <33ms per frame for 30+ FPS');
  process.exit(1);
}
console.log('✓ performance target met');
process.exit(0);