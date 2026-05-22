# CHROME DOOM

Premium browser Doom-style raycaster FPS — Episode 1 Hangar (E1M1-inspired).

## Play Now

**Local:** `npm run dev` → http://localhost:5173

**Live demo:** http://brilliant-bienenstitch-868d74.netlify.app

## Controls

| Input | Action |
|-------|--------|
| WASD | Move |
| Mouse | Look (click canvas to lock) |
| Click / Fire btn | Shoot |
| Space | Jump |
| C / Ctrl | Crouch |
| M | Toggle minimap |
| F | Fullscreen |
| Esc | Menu |

## Features

- Column raycaster with variable wall heights, textured floors/ceilings
- Dynamic lighting + bloom, vignette, CRT toggle
- Imp + Demon enemies with AI (chase, attack, pain, death)
- Hitscan combat, blood splats, muzzle flash, weapon bob
- Web Audio music + SFX
- E1M1-style Hangar map, pickups, exit portal win condition

## Development

```bash
npm install
npm run dev
npm test
npm run capture   # screenshots + video (requires puppeteer, ffmpeg)
```

## Validation Assets

- Screenshots: `docs/screenshots/`
- Gameplay video: `docs/video/gameplay.mp4`