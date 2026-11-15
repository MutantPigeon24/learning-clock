import { cornerArt, ringArt, BADGES, MOTIFS } from '../../src/look-art.js';
import { PAINT, LIGHT, SKY, SCENE_NAMES, cornerDayStyle, orbSpot, orbValues, sceneMarkup, skyBand } from '../../src/scene-art.js';

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

// Where Clock Hub's cards, clock and top corner picture sit in each frame,
// measured in the app at the frame's size: [left, top, right, bottom].
// The app finds the open sky above the cards from these and puts the sun and
// moon there (src/scene-art.js); the canvas does the same per frame.
// To measure again, run this in the app's page at each size:
//   const r = (el) => { const b = el.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); };
//   ({ clock: r(document.querySelector('.clock-area')), cards: [...document.querySelectorAll('.layout > .card')].map(r), corner: r(document.querySelector('.corner-top')) })
const HUB_SCREENS = {
  D: { size: [1440, 900], clock: [36, 36, 767, 864], cards: [[817, 218, 1404, 386], [817, 500, 1098, 655], [1123, 500, 1404, 655]], corner: [1238, 4, 1436, 202] },
  L: { size: [1280, 800], clock: [32, 32, 682, 768], cards: [[726, 197, 1248, 345], [726, 446, 976, 583], [998, 446, 1248, 583]], corner: [1100, 4, 1276, 180] },
  P: { size: [800, 1280], clock: [32, 118, 768, 839], cards: [[32, 861, 768, 962], [32, 984, 389, 1142], [411, 984, 768, 1142]], corner: [620, 4, 796, 180] },
  A: { size: [915, 412], clock: [24, 16, 344, 396], cards: [[368, 111, 891, 166], [368, 209, 624, 301], [636, 209, 891, 301]], corner: [806, 2, 913, 109] },
  B: { size: [412, 915], clock: [24, 80, 388, 665], cards: [[24, 677, 388, 732], [24, 744, 200, 835], [212, 744, 388, 835]], corner: [303, 2, 410, 109] },
  M: { size: [1000, 900], clock: [36, 36, 614, 744], cards: [[664, 439, 964, 712], [664, 68, 964, 228], [664, 253, 964, 414]], corner: [798, 4, 996, 202] },
  S: { size: [470, 470], clock: [24, 19, 260, 386], cards: [[286, 231, 446, 374], [286, 31, 446, 118], [286, 131, 446, 218]], corner: [346, 2, 468, 124] },
};
const box = ([left, top, right, bottom]) => ({ left, top, right, bottom });

// The sun or moon's values (ox, oy, os) in each scene and Clock Hub frame: ORB[scene][frame].
export const ORB = Object.fromEntries(SCENE_NAMES.map((name) => [name, Object.fromEntries(Object.entries(HUB_SCREENS).map(([frame, m]) => {
  const band = skyBand({ clock: box(m.clock), cards: m.cards.map(box), corner: box(m.corner) });
  const [w, h] = m.size;
  return [frame, orbValues(orbSpot(band, name, Math.min(w, h)), w, h)];
}))]));

// The sky and every look's landscape; the look in use shows through display:{{ bd.<id> }}.
// With a frame (Clock Hub's), the sun and moon go in that frame's open sky: {{ sc.at.<frame>.ox }}.
export function scene(id, frame = null) {
  const v = frame ? (name, unit = '') => (name === 'ox' || name === 'oy' || name === 'os' ? `{{ sc.at.${frame}.${name} }}${unit}` : hole(name, unit)) : hole;
  return sceneMarkup(id, v, undefined, show);
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

