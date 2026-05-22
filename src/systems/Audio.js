/**
 * Web Audio API — procedural Doom-like SFX + ambient music.
 */

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicOsc = null;
    this.enabled = false;
    this._musicStarted = false;
  }

  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.12;
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.6;
    this.sfxGain.connect(this.master);
    this.enabled = true;
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  startMusic() {
    if (!this.ctx || this._musicStarted) return;
    this._musicStarted = true;
    const t = this.ctx.currentTime;
    // E1M1-ish minor progression arpeggio
    const notes = [110, 130.81, 146.83, 164.81, 146.83, 130.81, 98, 110];
    let time = t;
    const playNote = (freq, dur) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 800;
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.08, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, time + dur);
      o.connect(f);
      f.connect(g);
      g.connect(this.musicGain);
      o.start(time);
      o.stop(time + dur);
      time += dur * 0.85;
    };
    const loop = () => {
      if (!this._musicStarted) return;
      notes.forEach((n, i) => playNote(n, 0.35));
      setTimeout(loop, notes.length * 0.35 * 850);
    };
    loop();
    // Bass drone
    const bass = this.ctx.createOscillator();
    const bg = this.ctx.createGain();
    bass.type = 'sawtooth';
    bass.frequency.value = 55;
    bg.gain.value = 0.04;
    const bf = this.ctx.createBiquadFilter();
    bf.type = 'lowpass';
    bf.frequency.value = 200;
    bass.connect(bf);
    bf.connect(bg);
    bg.connect(this.musicGain);
    bass.start();
    this.musicOsc = bass;
  }

  stopMusic() {
    this._musicStarted = false;
    this.musicOsc?.stop();
    this.musicOsc = null;
  }

  _noise(duration, filterFreq = 1000) {
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    return { src, g };
  }

  playGunshot() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const { src, g } = this._noise(0.15, 2000);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    src.start(t);
    src.stop(t + 0.2);
    const o = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    og.gain.setValueAtTime(0.2, t);
    og.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    o.connect(og);
    og.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.15);
  }

  playFootstep() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const { src, g } = this._noise(0.05, 400);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    src.start(t);
    src.stop(t + 0.06);
  }

  playEnemyPain() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(200, t);
    o.frequency.linearRampToValueAtTime(80, t + 0.2);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.3);
  }

  playEnemyAttack(type) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type === 'demon' ? 'sawtooth' : 'triangle';
    o.frequency.value = type === 'demon' ? 90 : 300;
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.2);
  }

  playPickup() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(440, t);
    o.frequency.linearRampToValueAtTime(880, t + 0.1);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.25);
  }

  playWin() {
    if (!this.ctx) return;
    [523, 659, 784].forEach((f, i) => {
      const t = this.ctx.currentTime + i * 0.15;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      o.connect(g);
      g.connect(this.sfxGain);
      o.start(t);
      o.stop(t + 0.5);
    });
  }
}