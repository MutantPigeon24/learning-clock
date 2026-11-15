import { cornerArt, ringArt, BADGES, MOTIFS } from '../../src/look-art.js';
import { PAINT, LIGHT, SKY, cornerDayStyle, sceneMarkup } from '../../src/scene-art.js';

export { BADGES, MOTIFS, PAINT, LIGHT, SKY };

// Theme art: everything that makes a theme more than colours.
// Each theme is a kit: sky paint per scene, a landscape, two corner props,
// a clock-ring shape, a picker badge, card and button styles and a label font.
// The art is in src/look-art.js (corners, ring, badges, motifs, styles) and
// src/scene-art.js (each scene's paint and the landscapes), which the app uses too.
// Every piece is drawn for all six themes and shown with display:{{ bd.<id> }},
// so one state drives every frame.

const show = (id, inner, extra = '') => `<g style="display:{{ bd.${id} }}${extra}">${inner}</g>`;

// The canvas fills the scene's holes from its state: {{ sc.<name> }}.
export const hole = (name, unit = '') => `{{ sc.${name} }}${unit}`;
const T = `transition:${hole('dur')}`;

// The sky and every look's landscape; the look in use shows through display:{{ bd.<id> }}.
export function scene(id) {
  return sceneMarkup(id, hole, undefined, show);
}

// ---------- corner props (200 × 200) ----------
// The art is in src/look-art.js. Sky's balloon lands for the night with the others.
const CORNERS = cornerArt(cornerDayStyle(hole));

export function corners(z) {
  const s = Math.round(Math.min(z.W, z.H) * (z.phone ? 0.26 : 0.22));
  let tr = '', bl = '';
  for (const [id, c] of Object.entries(CORNERS)) { tr += show(id, c.tr); bl += show(id, c.bl); }
  const st = `position:absolute;width:${s}px;height:${s}px;overflow:visible;filter:brightness({{ sc.lumP }});${T}`;
  return `<svg aria-hidden="true" viewBox="0 0 200 200" style="${st};right:${Math.round(s * 0.02)}px;top:${Math.round(s * 0.02)}px">${tr}</svg>
<svg aria-hidden="true" viewBox="0 0 200 200" style="${st};left:0;bottom:0">${bl}</svg>`;
}

// ---------- clock-ring shapes (clock viewBox 240, centre 120) ----------
// The art is in src/look-art.js; this shows the one for the look in use.
export function ringDress(c) {
  const art = ringArt(c, '{{ th.soft }}');
  return show('sky', art.sky) + show('blossom', art.blossom) + show('unicorn', art.unicorn) + show('hero', art.hero) + show('dino', art.dino) + show('space', art.space);
}

export function badge(size, holeObj) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible">${Object.entries(BADGES).map(([id, art]) => `<g style="display:{{ ${holeObj}.${id} }}">${art}</g>`).join('')}</svg>`;
}

