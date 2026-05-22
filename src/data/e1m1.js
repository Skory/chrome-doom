/**
 * Hangar-inspired level (E1M1 layout simplified).
 * Cell codes: 0=empty, 1-8=wall tex id, 9=door (opens), 10=exit
 * floorTex/ceilTex per region via defaults
 */

export const MAP_W = 64;
export const MAP_H = 64;
export const TILE = 1;

/** Build empty grid */
function grid(fill = 0) {
  return new Array(MAP_W * MAP_H).fill(fill);
}

function setRect(cells, x, y, w, h, v) {
  for (let j = y; j < y + h; j++)
    for (let i = x; i < x + w; i++)
      if (i >= 0 && i < MAP_W && j >= 0 && j < MAP_H)
        cells[j * MAP_W + i] = v;
}

function carve(cells) {
  // Outer boundary
  setRect(cells, 0, 0, MAP_W, 1, 1);
  setRect(cells, 0, MAP_H - 1, MAP_W, 1, 2);
  setRect(cells, 0, 0, 1, MAP_H, 3);
  setRect(cells, MAP_W - 1, 0, 1, MAP_H, 4);

  // Main hangar bay (large central area) — E1M1 style open space
  setRect(cells, 8, 8, 48, 40, 0);

  // Perimeter inner walls
  setRect(cells, 8, 8, 48, 1, 5);
  setRect(cells, 8, 47, 48, 1, 6);
  setRect(cells, 8, 8, 1, 40, 1);
  setRect(cells, 55, 8, 1, 40, 2);

  // Central pillars (variable height markers in wallHeights)
  const pillars = [[20, 20], [44, 20], [20, 36], [44, 36], [30, 30]];
  for (const [px, py] of pillars) {
    setRect(cells, px, py, 2, 2, 3);
  }

  // West corridor wing
  setRect(cells, 2, 22, 6, 12, 0);
  setRect(cells, 2, 22, 1, 12, 7);
  setRect(cells, 7, 22, 1, 12, 7);
  setRect(cells, 2, 22, 6, 1, 7);
  setRect(cells, 2, 33, 6, 1, 7);
  // Opening to hangar
  cells[22 * MAP_W + 7] = 0;
  cells[30 * MAP_W + 7] = 0;

  // East tech corridor
  setRect(cells, 56, 18, 6, 16, 0);
  setRect(cells, 56, 18, 1, 16, 4);
  setRect(cells, 61, 18, 1, 16, 4);
  cells[26 * MAP_W + 56] = 0;
  cells[28 * MAP_W + 56] = 0;

  // North annex rooms
  setRect(cells, 14, 2, 10, 6, 0);
  setRect(cells, 14, 2, 10, 1, 6);
  setRect(cells, 14, 7, 10, 1, 6);
  setRect(cells, 14, 2, 1, 6, 6);
  setRect(cells, 23, 2, 1, 6, 6);
  cells[5 * MAP_W + 18] = 0;

  setRect(cells, 40, 2, 12, 6, 0);
  setRect(cells, 40, 2, 12, 1, 5);
  setRect(cells, 40, 7, 12, 1, 5);
  setRect(cells, 40, 2, 1, 6, 5);
  setRect(cells, 51, 2, 1, 6, 5);
  cells[5 * MAP_W + 46] = 0;

  // South storage alcoves
  setRect(cells, 12, 50, 8, 8, 0);
  setRect(cells, 12, 50, 8, 1, 2);
  setRect(cells, 12, 57, 8, 1, 2);
  setRect(cells, 12, 50, 1, 8, 2);
  setRect(cells, 19, 50, 1, 8, 2);
  cells[49 * MAP_W + 16] = 0;

  setRect(cells, 44, 50, 10, 8, 0);
  setRect(cells, 44, 50, 10, 1, 1);
  setRect(cells, 44, 57, 10, 1, 1);
  setRect(cells, 44, 50, 1, 8, 1);
  setRect(cells, 53, 50, 1, 8, 1);
  cells[49 * MAP_W + 48] = 0;

  // Dividing walls inside hangar
  setRect(cells, 30, 12, 1, 10, 8);
  setRect(cells, 34, 30, 1, 12, 8);
  // Door gap
  cells[16 * MAP_W + 30] = 9;
  cells[36 * MAP_W + 34] = 9;

  // Raised platform area (south-center) — low walls
  setRect(cells, 26, 40, 12, 1, 6);
  setRect(cells, 26, 40, 1, 6, 6);
  setRect(cells, 37, 40, 1, 6, 6);
  cells[45 * MAP_W + 32] = 0;

  // Exit portal room (north-east)
  setRect(cells, 48, 10, 6, 6, 0);
  setRect(cells, 48, 10, 6, 1, 4);
  setRect(cells, 48, 15, 6, 1, 4);
  setRect(cells, 48, 10, 1, 6, 4);
  setRect(cells, 53, 10, 1, 6, 4);
  cells[12 * MAP_W + 51] = 10; // exit

  return cells;
}

export function createLevel() {
  const cells = carve(grid(1));
  // Fix outer boundary inner side — ensure hangar accessible
  for (let y = 9; y < 47; y++) {
    cells[y * MAP_W + 9] = cells[y * MAP_W + 9] === 1 ? 0 : cells[y * MAP_W + 9];
    cells[y * MAP_W + 54] = cells[y * MAP_W + 54] === 2 ? 0 : cells[y * MAP_W + 54];
  }
  for (let x = 9; x < 55; x++) {
    cells[9 * MAP_W + x] = cells[9 * MAP_W + x] === 5 ? 0 : cells[9 * MAP_W + x];
    cells[47 * MAP_W + x] = cells[47 * MAP_W + x] === 6 ? 0 : cells[47 * MAP_W + x];
  }

  const wallHeights = new Float32Array(MAP_W * MAP_H);
  const floorTex = new Uint8Array(MAP_W * MAP_H);
  const ceilTex = new Uint8Array(MAP_W * MAP_H);

  for (let i = 0; i < cells.length; i++) {
    floorTex[i] = 1;
    ceilTex[i] = 1;
    wallHeights[i] = 1;
  }
  // Tech area east
  for (let y = 18; y < 34; y++)
    for (let x = 56; x < 62; x++) {
      floorTex[y * MAP_W + x] = 2;
      ceilTex[y * MAP_W + x] = 2;
    }
  // North rooms ceiling
  for (let y = 2; y < 8; y++)
    for (let x = 14; x < 52; x++) {
      ceilTex[y * MAP_W + x] = 3;
    }
  // Variable height pillars
  const tall = [[20, 20], [44, 20], [20, 36], [44, 36], [30, 30]];
  for (const [px, py] of tall) {
    wallHeights[(py) * MAP_W + px] = 1.8;
    wallHeights[(py) * MAP_W + px + 1] = 1.8;
    wallHeights[(py + 1) * MAP_W + px] = 1.8;
    wallHeights[(py + 1) * MAP_W + px + 1] = 1.8;
  }
  wallHeights[28 * MAP_W + 32] = 0.5; // low divider

  const playerStart = { x: 32.5, y: 24.5, angle: Math.PI / 2 };
  const enemies = [
    { type: 'imp', x: 18, y: 24 },
    { type: 'imp', x: 46, y: 22 },
    { type: 'imp', x: 32, y: 18 },
    { type: 'demon', x: 24, y: 34 },
    { type: 'demon', x: 40, y: 34 },
    { type: 'imp', x: 15, y: 42 },
    { type: 'imp', x: 50, y: 42 },
    { type: 'demon', x: 32, y: 42 },
    { type: 'imp', x: 10, y: 28 },
    { type: 'demon', x: 58, y: 26 },
    { type: 'imp', x: 48, y: 12 },
    { type: 'demon', x: 20, y: 12 },
  ];
  const props = [
    { type: 'lamp', x: 16.5, y: 16.5 },
    { type: 'lamp', x: 48.5, y: 16.5 },
    { type: 'lamp', x: 16.5, y: 40.5 },
    { type: 'lamp', x: 48.5, y: 40.5 },
    { type: 'lamp', x: 32.5, y: 32.5 },
    { type: 'lamp', x: 28.5, y: 26.5 },
    { type: 'lamp', x: 36.5, y: 26.5 },
  ];
  const lights = [
    { x: 32, y: 28, r: 14, intensity: 1.2 },
    { x: 16, y: 16, r: 8, intensity: 0.9 },
    { x: 48, y: 16, r: 8, intensity: 0.9 },
    { x: 16, y: 40, r: 8, intensity: 0.7 },
    { x: 48, y: 40, r: 8, intensity: 0.7 },
  ];

  return {
    width: MAP_W,
    height: MAP_H,
    cells,
    wallHeights,
    floorTex,
    ceilTex,
    playerStart,
    enemies,
    props,
    lights,
    floorHeight: 0,
    ceilHeight: 4,
  };
}