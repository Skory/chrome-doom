/** Keyboard, mouse, pointer lock, touch */

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.forward = false;
    this.back = false;
    this.left = false;
    this.right = false;
    this.turnLeft = false;
    this.turnRight = false;
    this.jump = false;
    this.crouch = false;
    this.fire = false;
    this.firePressed = false;
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.mouseLook = false;
    this.minimapToggle = false;
    this._bind();
  }

  _bind() {
    window.addEventListener('keydown', e => {
      this.keys.add(e.code);
      if (e.code === 'KeyW') this.forward = true;
      if (e.code === 'KeyS') this.back = true;
      if (e.code === 'KeyA') this.left = true;
      if (e.code === 'KeyD') this.right = true;
      if (e.code === 'ArrowLeft') this.turnLeft = true;
      if (e.code === 'ArrowRight') this.turnRight = true;
      if (e.code === 'Space') this.jump = true;
      if (e.code === 'ControlLeft' || e.code === 'KeyC') this.crouch = true;
      if (e.code === 'KeyM') this.minimapToggle = true;
    });
    window.addEventListener('keyup', e => {
      this.keys.delete(e.code);
      if (e.code === 'KeyW') this.forward = false;
      if (e.code === 'KeyS') this.back = false;
      if (e.code === 'KeyA') this.left = false;
      if (e.code === 'KeyD') this.right = false;
      if (e.code === 'ArrowLeft') this.turnLeft = false;
      if (e.code === 'ArrowRight') this.turnRight = false;
      if (e.code === 'Space') this.jump = false;
      if (e.code === 'ControlLeft' || e.code === 'KeyC') this.crouch = false;
    });
    window.addEventListener('mousemove', e => {
      if (document.pointerLockElement === this.canvas) {
        this.mouseDX = e.movementX;
        this.mouseDY = e.movementY;
        this.mouseLook = true;
      }
    });
    window.addEventListener('mousedown', e => {
      if (e.button === 0) this.firePressed = true;
    });
    window.addEventListener('mouseup', e => {
      if (e.button === 0) this.fire = false;
    });
    this.canvas.addEventListener('click', () => {
      if (document.pointerLockElement !== this.canvas) {
        this.canvas.requestPointerLock?.();
      }
    });
  }

  endFrame() {
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.firePressed = false;
    this.minimapToggle = false;
    if (this.keys.has('Space')) this.jump = true;
    if (this.mouseLook || this.keys.has('KeyW') || this.keys.has('KeyS')) {
      // hold fire with mouse down when locked
    }
    if (document.pointerLockElement === this.canvas && this.keys.has('KeyF')) {
      // handled in main
    }
  }

  isDown(code) {
    return this.keys.has(code);
  }
}