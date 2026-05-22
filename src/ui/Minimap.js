/** Toggleable automap — walls, player, enemies */

export class Minimap {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.visible = true;
    this.scale = 3;
  }

  toggle() {
    this.visible = !this.visible;
    this.canvas.classList.toggle('hidden-map', !this.visible);
  }

  render(map, player, enemies) {
    if (!this.visible) return;
    const w = this.canvas.width, h = this.canvas.height;
    const mw = map.width, mh = map.height;
    const sc = Math.min(w / mw, h / mh);
    const ox = (w - mw * sc) / 2, oy = (h - mh * sc) / 2;

    this.ctx.fillStyle = 'rgba(0, 30, 0, 0.9)';
    this.ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < mh; y++) {
      for (let x = 0; x < mw; x++) {
        const c = map.cells[y * mw + x];
        if (c > 0 && c !== 9) {
          this.ctx.fillStyle = c === 10 ? '#ffcc00' : '#448844';
          this.ctx.fillRect(ox + x * sc, oy + y * sc, sc, sc);
        } else if (c === 9) {
          this.ctx.fillStyle = '#886644';
          this.ctx.fillRect(ox + x * sc, oy + y * sc, sc, sc);
        }
      }
    }

    for (const e of enemies) {
      if (!e.alive && e.deathTimer > 1) continue;
      this.ctx.fillStyle = e.alive ? '#ff2222' : '#662222';
      this.ctx.fillRect(ox + e.x * sc - 2, oy + e.y * sc - 2, 4, 4);
    }

    const px = ox + player.x * sc, py = oy + player.y * sc;
    this.ctx.fillStyle = '#44ff44';
    this.ctx.beginPath();
    this.ctx.arc(px, py, 3, 0, Math.PI * 2);
    this.ctx.fill();
    const len = 10;
    this.ctx.strokeStyle = '#aaffaa';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(px + Math.cos(player.angle) * len, py + Math.sin(player.angle) * len);
    this.ctx.stroke();
  }
}