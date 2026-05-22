/** @module utils/math — vector & angle helpers */

export const TAU = Math.PI * 2;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const lerp = (a, b, t) => a + (b - a) * t;

export function normalizeAngle(a) {
  a %= TAU;
  if (a < 0) a += TAU;
  return a;
}

export function dist2(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  return dx * dx + dy * dy;
}

export function dist(x1, y1, x2, y2) {
  return Math.sqrt(dist2(x1, y1, x2, y2));
}

export function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

export function rayWallIntersect(ox, oy, dx, dy, map, maxDist = 64) {
  let x = ox, y = oy;
  const step = 0.02;
  let d = 0;
  while (d < maxDist) {
    x += dx * step;
    y += dy * step;
    d += step;
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if (mx < 0 || my < 0 || mx >= map.width || my >= map.height) return { hit: true, dist: d, x, y, mx, my, side: 0 };
    const cell = map.cells[my * map.width + mx];
    if (cell === 9) {
      const door = map.doors?.get(`${mx},${my}`);
      if (!door || door.open < 0.85) return { hit: true, dist: d, x, y, mx, my, side: Math.abs(x - mx - 0.5) > Math.abs(y - my - 0.5) ? 0 : 1 };
    }
    if (cell > 0 && cell !== 9) return { hit: true, dist: d, x, y, mx, my, side: Math.abs(x - mx - 0.5) > Math.abs(y - my - 0.5) ? 0 : 1 };
  }
  return { hit: false, dist: maxDist };
}