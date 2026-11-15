# Design concepts generator

These scripts write the claude.ai design canvas "Learning Clock — 6 Design Concepts". It has a journeys, screens and UX rules board, plus six interactive concepts, each shown on five screens (desktop, tablet landscape and portrait, phone landscape and portrait).

This is design tooling only. The app doesn't use it, and `npm test` ignores it.

| File | What it holds |
|---|---|
| `theme-art.mjs` | Each look's kit: sky paint per scene, scene lighting, landscape, corner pictures, clock-ring shape, picker badge and corner motif |
| `check.mjs` | Contrast and colour-clash check over every look × colour pair (`node design/concepts-generator/check.mjs`) |
| `parts.mjs` | Themes (tokens, card and button styles, label font, including each theme's hour and minute colours), colour pairs a child can pick, scenes, screen frames, sizing helpers, shared components (clock, digits, buttons, look picker, grown-up check, settings) and the logic class every concept shares |
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
