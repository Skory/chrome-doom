/** HUD updates — health, armor, ammo, weapon bob */

export class HUD {
  constructor() {
    this.healthEl = document.getElementById('hud-health');
    this.armorEl = document.getElementById('hud-armor');
    this.ammoEl = document.getElementById('hud-ammo');
    this.killsEl = document.getElementById('hud-kills');
    this.weaponEl = document.getElementById('weapon-sprite');
    this.messageEl = document.getElementById('message');
    this.msgTimer = 0;
  }

  update(player) {
    this.healthEl.textContent = Math.max(0, Math.ceil(player.health));
    this.armorEl.textContent = Math.ceil(player.armor);
    this.ammoEl.textContent = player.ammo;
    this.killsEl.textContent = player.kills;

    const bobX = Math.sin(player.weaponBob) * 8;
    const bobY = Math.abs(Math.cos(player.weaponBob * 0.5)) * 6;
    const recoilY = player.recoil * 25;
    const fireScale = player.muzzleFlash > 0 ? 1.05 : 1;
    this.weaponEl.style.transform = `translateX(calc(-50% + ${bobX}px)) translateY(${bobY + recoilY}px) scale(${fireScale})`;

    if (player.muzzleFlash > 0) {
      this.weaponEl.style.filter = `drop-shadow(0 0 ${20 * player.muzzleFlash}px rgba(255,200,100,0.9)) brightness(1.3)`;
    } else {
      this.weaponEl.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))';
    }

    if (this.msgTimer > 0) {
      this.msgTimer -= 0.016;
      if (this.msgTimer <= 0) this.messageEl.classList.add('hidden');
    }
  }

  showMessage(text, duration = 2) {
    this.messageEl.textContent = text;
    this.messageEl.classList.remove('hidden');
    this.msgTimer = duration;
  }

  setWeaponImage(dataUrl) {
    this.weaponEl.style.backgroundImage = `url(${dataUrl})`;
  }
}