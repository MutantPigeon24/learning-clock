# Design concepts generator

These scripts write the claude.ai design canvas "Learning Clock — 6 Design Concepts". It has a journeys, screens and UX rules board, plus six interactive concepts, each shown on five screens (desktop, tablet landscape and portrait, phone landscape and portrait).

This is design tooling only. The app doesn't use it, and `npm test` ignores it. It does use the app's colours from `src/colours.js`, so the canvas and the app always agree.

| File | What it holds |
|---|---|
| `theme-art.mjs` | Each look's kit: sky paint per scene, scene lighting, landscape, corner pictures, clock-ring shape, picker badge and corner motif |
| `check.mjs` | Contrast and colour-clash check over every look × colour pair (`node design/concepts-generator/check.mjs`). `npm test` runs the same checks on `src/colours.js` |
| `parts.mjs` | Themes (decoration, card and button styles, label font; each look's name and colours, its hour and minute colours and the colour pairs a child can pick come from [`src/colours.js`](../../src/colours.js)), scenes, screen frames, sizing helpers, shared components (clock, digits, buttons, look picker, grown-up check, settings) and the logic class every concept shares |
| `concepts.mjs` | One layout function per concept, the concept list and the artboard wrapper |
| `main.mjs` | The journeys board text (journeys, screens, rules), canvas notes and positions, and the command line |

## Run

```bash
mkdir -p out
OUT=out node design/concepts-generator/main.mjs index   # canvas.json
OUT=out node design/concepts-generator/main.mjs main    # Main.dc.html
OUT=out node design/concepts-generator/main.mjs 1       # Concept1.dc.html … up to 6
```

Then publish the changed files to the canvas artifact (`project/<file>`). The artifact keeps its own copy, so this folder is only the source.

Concept 1, Clock Hub, is the chosen one. Its board also has the two in-between frames (`MID_FRAMES` in `parts.mjs`) and is the only one kept up to date on the canvas. Each board has tweaks for the look, the colour pair, the helpers, the time, whether the device has a voice, and less motion.
