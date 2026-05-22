# Play CHROME DOOM

## Instant local play

```bash
npm run dev
```

Open **http://localhost:5173**

## GitHub Pages (recommended live hosting)

1. Push this repo to GitHub
2. Settings → Pages → Source: **main** branch, folder **/** (root)
3. Play at `https://<username>.github.io/<repo>/`

The game uses ES modules and requires HTTP (not `file://`).

## Netlify Drop (no account workflow)

```bash
npm run dev &
npx netlify-cli deploy --dir=. --prod
```

## Validation assets

| Asset | Path |
|-------|------|
| Title screen | `docs/screenshots/01-title-screen.png` |
| In-game | `docs/screenshots/02-in-game.png` |
| Minimap | `docs/screenshots/03-minimap.png` |
| Combat | `docs/screenshots/04-combat-action.png` |
| Enemy sprites | `docs/screenshots/07-enemy-sprites.png` |
| Gameplay video | `docs/video/gameplay.mp4` |