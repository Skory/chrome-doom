/**
 * CHROME DOOM — main game loop
 * requestAnimationFrame · modular systems · E1M1 Hangar
 */

import { createLevel } from './data/e1m1.js';
import { GameMap } from './engine/Map.js';
import { TextureManager } from './engine/TextureManager.js';
import { Raycaster } from './engine/Raycaster.js';
import { SpriteRenderer } from './engine/SpriteRenderer.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Input } from './systems/Input.js';
import { AudioSystem } from './systems/Audio.js';
import { Combat } from './systems/Combat.js';
import { HUD } from './ui/HUD.js';
import { Minimap } from './ui/Minimap.js';
import { PostProcess } from './effects/PostProcess.js';
import { dist } from './utils/math.js';

const STATE = { MENU: 0, PLAYING: 1, DEAD: 2, WIN: 3 };

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.overlay = document.getElementById('overlay');
    this.state = STATE.MENU;
    this.textures = new TextureManager();
    this.raycaster = new Raycaster(this.canvas, this.textures);
    this.spriteRenderer = new SpriteRenderer(
      this.raycaster.ctx,
      this.textures,
      this.canvas.width,
      this.canvas.height
    );
    this.input = new Input(this.canvas);
    this.audio = new AudioSystem();
    this.combat = new Combat();
    this.hud = new HUD();
    this.minimap = new Minimap(document.getElementById('minimap'));
    this.post = new PostProcess(this.overlay);
    this.lastTime = 0;
    this.pickups = [];
    this._bindUI();
    this._resize();
    window.addEventListener('resize', () => this._resize());
    this.hud.setWeaponImage(this.textures.weapon.toDataURL());
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  _bindUI() {
    document.getElementById('btn-start').addEventListener('click', () => this.startGame());
    document.getElementById('btn-retry').addEventListener('click', () => this.startGame());
    document.getElementById('btn-menu').addEventListener('click', () => this.showMenu());
    document.getElementById('btn-fullscreen').addEventListener('click', () => this._toggleFullscreen());
    window.addEventListener('keydown', e => {
      if (e.code === 'KeyF') this._toggleFullscreen();
      if (e.code === 'Escape' && this.state === STATE.PLAYING) this.showMenu();
    });
    window.addEventListener('mousedown', e => {
      if (this.state === STATE.PLAYING && e.button === 0) this.input.fire = true;
    });
    this._initTouch();
  }

  _initTouch() {
    const tc = document.getElementById('touch-controls');
    if ('ontouchstart' in window) tc.classList.remove('hidden');

    const moveStick = document.getElementById('stick-move');
    const lookStick = document.getElementById('stick-look');
    const setupStick = (el, onMove) => {
      let active = false;
      const knob = el.querySelector('.stick-knob');
      const rect = () => el.getBoundingClientRect();
      const handle = (cx, cy) => {
        const r = rect();
        const cx0 = r.left + r.width / 2, cy0 = r.top + r.height / 2;
        let dx = cx - cx0, dy = cy - cy0;
        const max = 40;
        const d = Math.hypot(dx, dy);
        if (d > max) { dx = (dx / d) * max; dy = (dy / d) * max; }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        onMove(dx / max, dy / max);
      };
      el.addEventListener('touchstart', e => { active = true; handle(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); });
      el.addEventListener('touchmove', e => { if (active) handle(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); });
      el.addEventListener('touchend', () => { active = false; knob.style.transform = ''; onMove(0, 0); });
    };
    setupStick(moveStick, (x, y) => {
      this.input.forward = y < -0.2;
      this.input.back = y > 0.2;
      this.input.left = x < -0.2;
      this.input.right = x > 0.2;
    });
    setupStick(lookStick, (x, y) => {
      this.input.mouseDX = x * 4;
      this.input.mouseDY = y * 4;
      this.input.mouseLook = true;
    });
    document.getElementById('btn-fire').addEventListener('touchstart', e => {
      this.input.fire = true;
      e.preventDefault();
    });
  }

  _resize() {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;
    const aspect = 16 / 9;
    let w = maxW, h = w / aspect;
    if (h > maxH) { h = maxH; w = h * aspect; }
    w = Math.floor(w);
    h = Math.floor(h);
    this.canvas.width = w;
    this.canvas.height = h;
    this.overlay.width = w;
    this.overlay.height = h;
    this.raycaster.resize(w, h);
    this.spriteRenderer.resize(w, h);
  }

  async startGame() {
    await this.audio.init();
    this.audio.resume();
    this.audio.startMusic();

    const level = createLevel();
    this.map = new GameMap(level);
    this.player = new Player({ ...level.playerStart });
    this.enemies = level.enemies.map(e => new Enemy(e.type, e.x, e.y));
    this.props = level.props.map(p => ({ ...p, anim: 0 }));
    this.pickups = [
      { type: 'health', x: 18, y: 5, amount: 25 },
      { type: 'armor', x: 46, y: 5, amount: 50 },
      { type: 'ammo', x: 15, y: 54, amount: 30 },
      { type: 'ammo', x: 50, y: 54, amount: 30 },
    ];
    this.totalEnemies = this.enemies.length;

    document.getElementById('menu').classList.remove('active');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    this.post.setOptions({
      crt: document.getElementById('opt-crt').checked,
      bloom: document.getElementById('opt-bloom').checked,
      vignette: document.getElementById('opt-vignette').checked,
    });

    this.state = STATE.PLAYING;
    this.hud.showMessage('HANGAR — CLEAR THE DECKS', 3);
    this.canvas.requestPointerLock?.();
  }

  showMenu() {
    this.state = STATE.MENU;
    document.exitPointerLock?.();
    this.audio.stopMusic();
    document.getElementById('menu').classList.add('active');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
  }

  _toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  _endGame(won) {
    this.state = won ? STATE.WIN : STATE.DEAD;
    document.exitPointerLock?.();
    const panel = document.getElementById('game-over');
    panel.classList.remove('hidden');
    panel.classList.toggle('win', won);
    document.getElementById('end-title').textContent = won ? 'MISSION COMPLETE' : 'YOU DIED';
    document.getElementById('end-stats').textContent =
      `Kills: ${this.player.kills}/${this.totalEnemies} · Health: ${Math.max(0, Math.ceil(this.player.health))}`;
    if (won) this.audio.playWin();
  }

  _loop(now) {
    requestAnimationFrame(this._loop);
    const dt = Math.min(0.05, (now - this.lastTime) / 1000) || 0.016;
    this.lastTime = now;

    if (this.state === STATE.PLAYING) {
      this._update(dt);
      this._render();
    }
    this.input.endFrame();
  }

  _update(dt) {
    this.map.updateDoors(dt);
    this.player.update(dt, this.input, this.map);

    if (this.input.minimapToggle) this.minimap.toggle();

    // Shooting
    if ((this.input.fire || this.input.firePressed) && this.player.canFire()) {
      if (this.player.fire()) {
        this.audio.playGunshot();
        const result = this.combat.shoot(
          this.player,
          this.enemies,
          this.map,
          (x, y) => this.spriteRenderer.spawnBlood(
            this._worldToScreen(x, y)?.x ?? this.canvas.width / 2,
            this._worldToScreen(x, y)?.y ?? this.canvas.height / 2
          )
        );
        if (result?.hit || result?.kill) this.audio.playEnemyPain();
      }
    }

    for (const e of this.enemies) {
      e.update(dt, this.player, this.map, this.audio);
    }

    for (const p of this.props) {
      p.anim += dt * 4;
    }

    // Pickups
    this.pickups = this.pickups.filter(pk => {
      if (dist(this.player.x, this.player.y, pk.x, pk.y) < 1) {
        if (pk.type === 'health') this.player.health = Math.min(100, this.player.health + pk.amount);
        if (pk.type === 'armor') this.player.armor = Math.min(100, this.player.armor + pk.amount);
        if (pk.type === 'ammo') this.player.ammo += pk.amount;
        this.audio.playPickup();
        return false;
      }
      return true;
    });

    // Footsteps
    if (this.player.footstepTimer > 0.35 && this.player.speed > 1) {
      this.audio.playFootstep();
      this.player.footstepTimer = 0;
    }

    // Win: exit or all dead
    if (this.map.exitPos && dist(this.player.x, this.player.y, this.map.exitPos.x, this.map.exitPos.y) < 1.5) {
      if (this.enemies.every(e => !e.alive)) this._endGame(true);
      else this.hud.showMessage('CLEAR ALL ENEMIES FIRST', 1.5);
    }
    if (this.enemies.every(e => !e.alive)) {
      this.hud.showMessage('EXIT PORTAL OPEN — NORTH-EAST', 2);
    }

    if (this.player.health <= 0) this._endGame(false);

    this.hud.update(this.player);
  }

  _worldToScreen(wx, wy) {
    const dx = wx - this.player.x, dy = wy - this.player.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    let rel = Math.atan2(dy, dx) - this.player.angle;
    while (rel < -Math.PI) rel += Math.PI * 2;
    while (rel > Math.PI) rel -= Math.PI * 2;
    const fov = Math.PI / 3.2;
    if (Math.abs(rel) > fov * 0.65) return null;
    return {
      x: (0.5 + rel / fov) * this.canvas.width,
      y: this.canvas.height / 2,
    };
  }

  _render() {
    const zBuf = this.raycaster.render(this.player, this.map, this.map.lights);
    this.spriteRenderer.render(
      this.player,
      this.enemies,
      this.props,
      zBuf,
      this.map,
      this.map.lights
    );
    this.post.apply(this.canvas, this.player.muzzleFlash);
    this.minimap.render(this.map, this.player, this.enemies);
  }
}

const game = new Game();
window.__game = game;