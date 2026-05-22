/**
 * Screen-space effects: vignette, CRT scanlines, bloom, color grade.
 * Renders to overlay canvas (double-buffer style composite).
 */

export class PostProcess {
  constructor(overlayCanvas) {
    this.canvas = overlayCanvas;
    this.ctx = overlayCanvas.getContext('2d');
    this.crt = true;
    this.bloom = true;
    this.vignette = true;
    this._bloomCanvas = document.createElement('canvas');
    this._bloomCtx = this._bloomCanvas.getContext('2d');
  }

  setOptions({ crt, bloom, vignette }) {
    if (crt !== undefined) this.crt = crt;
    if (bloom !== undefined) this.bloom = bloom;
    if (vignette !== undefined) this.vignette = vignette;
  }

  apply(gameCanvas, muzzleFlash = 0) {
    const w = gameCanvas.width, h = gameCanvas.height;
    if (this.canvas.width !== w) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx.clearRect(0, 0, w, h);

    if (this.bloom) {
      this._bloomCanvas.width = w >> 2;
      this._bloomCanvas.height = h >> 2;
      this._bloomCtx.drawImage(gameCanvas, 0, 0, w >> 2, h >> 2);
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.globalAlpha = 0.25 + muzzleFlash * 0.3;
      this.ctx.filter = 'blur(8px) brightness(1.4)';
      this.ctx.drawImage(this._bloomCanvas, 0, 0, w, h);
      this.ctx.restore();
    }

    if (this.vignette) {
      const g = this.ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.85);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.55)');
      this.ctx.fillStyle = g;
      this.ctx.fillRect(0, 0, w, h);
    }

    // Color grading — warm shadows
    this.ctx.fillStyle = 'rgba(40, 20, 60, 0.08)';
    this.ctx.fillRect(0, 0, w, h);

    if (this.crt) {
      this.ctx.globalAlpha = 0.12;
      this.ctx.fillStyle = '#000';
      for (let y = 0; y < h; y += 3) {
        this.ctx.fillRect(0, y, w, 1);
      }
      this.ctx.globalAlpha = 0.04;
      this.ctx.fillStyle = 'rgba(255,0,0,0.5)';
      this.ctx.fillRect(2, 0, w, h);
      this.ctx.fillStyle = 'rgba(0,0,255,0.5)';
      this.ctx.fillRect(-2, 0, w, h);
      this.ctx.globalAlpha = 1;
    }

    if (muzzleFlash > 0) {
      this.ctx.fillStyle = `rgba(255, 220, 150, ${muzzleFlash * 0.35})`;
      this.ctx.fillRect(0, 0, w, h);
    }
  }
}