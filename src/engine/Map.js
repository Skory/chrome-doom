/** Map collision & door state */

export class GameMap {
  constructor(level) {
    this.width = level.width;
    this.height = level.height;
    this.cells = level.cells.slice();
    this.wallHeights = level.wallHeights;
    this.floorTex = level.floorTex;
    this.ceilTex = level.ceilTex;
    this.floorHeight = level.floorHeight ?? 0;
    this.ceilHeight = level.ceilHeight ?? 4;
    this.lights = level.lights || [];
    this.doors = new Map();
    this.exitPos = null;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y * this.width + x] === 10) {
          this.exitPos = { x: x + 0.5, y: y + 0.5 };
        }
      }
    }
  }

  getCell(x, y) {
    const mx = Math.floor(x), my = Math.floor(y);
    if (mx < 0 || my < 0 || mx >= this.width || my >= this.height) return 1;
    return this.cells[my * this.width + mx];
  }

  isSolid(x, y, radius = 0.25) {
    const samples = [
      [x - radius, y - radius], [x + radius, y - radius],
      [x - radius, y + radius], [x + radius, y + radius],
      [x, y - radius], [x, y + radius], [x - radius, y], [x + radius, y],
    ];
    for (const [sx, sy] of samples) {
      const c = this.getCell(sx, sy);
      if (c > 0 && c !== 9) return true;
      if (c === 9) {
        const key = `${Math.floor(sx)},${Math.floor(sy)}`;
        const d = this.doors.get(key);
        if (!d || d.open < 0.85) return true;
      }
    }
    return false;
  }

  updateDoors(dt) {
    for (const [, d] of this.doors) {
      if (d.opening) d.open = Math.min(1, d.open + dt * 1.5);
      else if (d.closing) d.open = Math.max(0, d.open - dt * 1.5);
    }
  }

  tryOpenDoor(px, py) {
    const mx = Math.floor(px), my = Math.floor(py);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = mx + dx, y = my + dy;
        if (this.cells[y * this.width + x] === 9) {
          const key = `${x},${y}`;
          if (!this.doors.has(key)) this.doors.set(key, { open: 0, opening: true, closing: false });
          else {
            const d = this.doors.get(key);
            d.opening = true;
            d.closing = false;
          }
        }
      }
    }
  }

  getWallHeight(mx, my) {
    if (mx < 0 || my < 0 || mx >= this.width || my >= this.height) return 1;
    return this.wallHeights[my * this.width + mx] || 1;
  }
}