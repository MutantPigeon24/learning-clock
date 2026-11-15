// Each look's kit beyond its colours (10-looks.feature): card and button
// styles, the minutes-ring shape, the corner pictures, the picker picture and
// the small motifs. The colours themselves are in colours.js.
//
// This is the one place the art is defined. The design canvas generator
// (design/concepts-generator) imports it too. Every function returns SVG
// markup as a string.

export const r1 = (v) => Math.round(v * 10) / 10;
// Deterministic wobble so generated shapes look hand-placed but never change.
export const wob = (i, k = 1) => Math.sin(i * 12.9898 + k * 78.233) * 0.5 + 0.5;

import { LOOK_IDS, LOOKS } from './colours.js';

// ---------- card, button and label styles ----------
// deco/edge/body: picture colours. cardFx: extra card styling (border,
// texture, shadow). cardTex: texture only, for layouts that draw their own
// borders. btnFx: extra style on the main button. dfont: display font for
// look names (never the sentence, digits or labels a child must read).
export const LOOK_STYLES = Object.freeze({
  sky: { deco: '#FFFFFF', edge: '#0F4A99', body: '#5AA9F2',
    cardFx: 'border:3px solid #CFE2FB;background-image:linear-gradient(180deg,#FFFFFF 55%,#EDF5FF)', cardTex: 'background-image:linear-gradient(180deg,#FFFFFF 55%,#EDF5FF)', btnFx: 'box-shadow:0 5px 0 #0F4A99', dfont: "'Baloo 2', sans-serif" },
  blossom: { deco: '#FF8FB8', edge: '#8E1243', body: '#F48FB1',
    cardFx: 'border:3px solid #FFC2D9;background-image:radial-gradient(circle at 100% 0,#FFE1EE 0 22px,transparent 23px),radial-gradient(circle at 0 100%,#FFF0F6 0 30px,transparent 31px)', cardTex: 'background-image:radial-gradient(circle at 100% 0,#FFE1EE 0 22px,transparent 23px),radial-gradient(circle at 0 100%,#FFF0F6 0 30px,transparent 31px)', btnFx: 'box-shadow:0 5px 0 #8E1243', dfont: "'Grandstander', sans-serif" },
  unicorn: { deco: '#FFE066', edge: '#5B21B6', body: '#F3EDFF',
    cardFx: 'border:4px solid transparent;background-image:linear-gradient(#FFFFFF,#FFFFFF),linear-gradient(90deg,#FF8FA3,#FFB86B,#FFE16B,#8FE3A8,#8EC5FF,#C8A2FF);background-origin:border-box;background-clip:padding-box,border-box', cardTex: 'background-image:radial-gradient(circle at 92% 14%,#FFF4C2 0 5px,transparent 6px),radial-gradient(circle at 8% 88%,#F3E8FF 0 7px,transparent 8px)', btnFx: 'background-image:linear-gradient(135deg,#7C3AED,#B62BC9);box-shadow:0 5px 0 #5B21B6', dfont: "'Sniglet', sans-serif" },
  hero: { deco: '#FFC21A', edge: '#111C3A', body: '#3B6FE0',
    cardFx: 'border:4px solid #111C3A;box-shadow:6px 6px 0 #111C3A;background-image:radial-gradient(rgba(29,78,216,.10) 1.6px,transparent 2.1px);background-size:9px 9px', cardTex: 'background-image:radial-gradient(rgba(29,78,216,.10) 1.6px,transparent 2.1px);background-size:9px 9px', btnFx: 'border:3px solid #111C3A;box-shadow:4px 4px 0 #111C3A', dfont: "'Bangers', Impact, sans-serif" },
  dino: { deco: '#7CC46A', edge: '#1B5E20', body: '#6CC05C',
    cardFx: 'border:3px solid #A5D16E;background-color:#FFFDF5;background-image:radial-gradient(circle,#EEF6E2 2.2px,transparent 2.8px);background-size:18px 18px', cardTex: 'background-color:#FFFDF5;background-image:radial-gradient(circle,#EEF6E2 2.2px,transparent 2.8px);background-size:18px 18px', btnFx: 'box-shadow:0 5px 0 #1B5E20', dfont: "'Chewy', sans-serif" },
  space: { deco: '#FFC93C', edge: '#0F0C33', body: '#8E87FF',
    cardFx: 'border:2px solid rgba(165,180,255,.5);box-shadow:0 0 0 4px rgba(109,99,255,.22),0 12px 30px rgba(0,0,0,.35);background-image:radial-gradient(1.6px 1.6px at 18% 28%,rgba(255,255,255,.7),transparent),radial-gradient(1.2px 1.2px at 72% 64%,rgba(255,255,255,.6),transparent),radial-gradient(1.6px 1.6px at 88% 18%,rgba(255,255,255,.6),transparent),radial-gradient(1.2px 1.2px at 40% 86%,rgba(255,255,255,.5),transparent),linear-gradient(160deg,#2A2672,#1E1B4B 60%)', cardTex: 'background-image:radial-gradient(1.6px 1.6px at 18% 28%,rgba(255,255,255,.7),transparent),radial-gradient(1.2px 1.2px at 72% 64%,rgba(255,255,255,.6),transparent),linear-gradient(160deg,#2A2672,#1E1B4B 60%)', btnFx: 'box-shadow:0 0 0 3px rgba(255,201,60,.35),0 0 22px rgba(255,201,60,.45)', dfont: "'Audiowide', sans-serif" },
});

// ---------- small shapes ----------
export const star4 = (x, y, s, fill, op = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-10 L2.4-2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4-2.4z" fill="${fill}" opacity="${op}"></path>`;
export const star5 = (x, y, r, fill, stroke = '') => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r;
    d += (i ? 'L' : 'M') + r1(x + rr * Math.cos(a)) + ' ' + r1(y + rr * Math.sin(a));
  }
  return `<path d="${d}z" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"` : ''}></path>`;
};
export const flower = (x, y, r, petal, centre = '#FFE066', dark = '') => {
  let s = '';
  for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="${r1(-r * 0.55)}" rx="${r1(r * 0.42)}" ry="${r1(r * 0.55)}" fill="${petal}" transform="rotate(${i * 72})"></ellipse>`;
  if (dark) for (let i = 0; i < 5; i++) s += `<line x1="0" y1="0" x2="0" y2="${r1(-r * 0.5)}" stroke="${dark}" stroke-width="${r1(r * 0.07)}" stroke-linecap="round" transform="rotate(${i * 72 + 36})"></line>`;
  return `<g transform="translate(${x} ${y})">${s}<circle r="${r1(r * 0.24)}" fill="${centre}"></circle></g>`;
};
export const burst = (cx, cy, rOut, rIn, n, fill, stroke, rot = 0, even = false) => {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (i * 180 / n + rot) * Math.PI / 180, rr = i % 2 ? rIn : (even ? rOut : rOut * (0.86 + 0.14 * wob(i, 3)));
    d += (i ? 'L' : 'M') + r1(cx + rr * Math.cos(a)) + ' ' + r1(cy + rr * Math.sin(a));
  }
  return `<path d="${d}z" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"></path>`;
};
export const cloudPuff = (x, y, s, fill, shade) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="8" rx="62" ry="20" fill="${shade}"></ellipse><circle cx="-34" cy="0" r="22" fill="${fill}"></circle><circle cx="-6" cy="-14" r="30" fill="${fill}"></circle><circle cx="28" cy="-4" r="24" fill="${fill}"></circle><rect x="-56" y="-2" width="106" height="18" rx="9" fill="${fill}"></rect></g>`;
export const balloon = (x, y, s, a = '#FF6B6B', b = '#FFD43B', c = '#4DABF7') => `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M0-60 C34-60 50-32 44-6 C38 16 16 30 10 40 L-10 40 C-16 30-38 16-44-6 C-50-32-34-60 0-60z" fill="${a}"></path>
<path d="M0-60 C14-60 20-32 18-6 C16 16 8 30 5 40 L-5 40 C-8 30-16 16-18-6 C-20-32-14-60 0-60z" fill="${b}"></path>
<path d="M-44-6 C-38 16-16 30-10 40 L-5 40 C-8 30-16 16-18-6z M44-6 C38 16 16 30 10 40 L5 40 C8 30 16 16 18-6z" fill="${c}"></path>
<path d="M-9 40 L-8 54 M9 40 L8 54" stroke="#6B4226" stroke-width="2.5"></path><rect x="-10" y="53" width="20" height="14" rx="3" fill="#A0522D"></rect></g>`;
export const tulip = (x, y, h, cup) => `<g transform="translate(${x} ${y})"><path d="M0 0 C0 ${-h * 0.4} 1 ${-h * 0.7} 0 ${-h}" stroke="#3E8E41" stroke-width="4" fill="none"></path><path d="M0 ${-h * 0.25} C-12 ${-h * 0.4} -14 ${-h * 0.6} -10 ${-h * 0.75} C-4 ${-h * 0.6} -2 ${-h * 0.45} 0 ${-h * 0.3}z" fill="#4CAF50"></path><path d="M-10 ${-h} C-12 ${-h - 16} -6 ${-h - 22} -5 ${-h - 22} L0 ${-h - 14} L5 ${-h - 22} C6 ${-h - 22} 12 ${-h - 16} 10 ${-h} C8 ${-h + 8} -8 ${-h + 8} -10 ${-h}z" fill="${cup}"></path></g>`;
export const fern = (x, y, len, rot, col) => {
  let s = `<path d="M0 0 Q ${len * 0.15} ${-len * 0.5} 0 ${-len}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"></path>`;
  for (let i = 1; i < 9; i++) {
    const t = i / 9, py = -len * t, px = len * 0.15 * Math.sin(Math.PI * t) * 1.2, w = len * 0.28 * (1 - t * 0.7);
    s += `<path d="M${r1(px)} ${r1(py)} q ${r1(-w * 0.6)} ${r1(-w * 0.15)} ${r1(-w)} ${r1(w * 0.35)} q ${r1(w * 0.5)} ${r1(-w * 0.05)} ${r1(w)} ${r1(-w * 0.35)}z M${r1(px)} ${r1(py)} q ${r1(w * 0.6)} ${r1(-w * 0.15)} ${r1(w)} ${r1(w * 0.35)} q ${r1(-w * 0.5)} ${r1(-w * 0.05)} ${r1(-w)} ${r1(-w * 0.35)}z" fill="${col}"></path>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${s}</g>`;
};
export const palm = (x, y, h, lean) => {
  const tx = x + lean, ty = y - h;
  let s = `<path d="M${x} ${y} Q ${x + lean * 0.2} ${y - h * 0.5} ${tx} ${ty}" stroke="#8D6E4E" stroke-width="12" fill="none" stroke-linecap="round"></path>`;
  [[-70, 1], [-25, 0.8], [20, 0.9], [65, 1], [160, 0.7], [205, 0.8]].forEach(([a, k], i) => {
    const L = 70 * k;
    s += `<path d="M${tx} ${ty} q ${r1(L * 0.5 * Math.cos((a - 90) * Math.PI / 180) + 10)} ${r1(L * 0.5 * Math.sin((a - 90) * Math.PI / 180) - 14)} ${r1(L * Math.cos((a - 60) * Math.PI / 180))} ${r1(L * Math.sin((a - 60) * Math.PI / 180) + 18)} q ${r1(-L * 0.3)} ${-6} ${r1(-L * Math.cos((a - 60) * Math.PI / 180))} ${r1(-L * Math.sin((a - 60) * Math.PI / 180) - 18)}z" fill="${i % 2 ? '#2E7D32' : '#43A047'}"></path>`;
  });
  return s;
};
export const pterosaur = (x, y, s, col = '#5D4037') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0 L-28-14 L-50-8 L-30-4 L-12 4 L-4 2 L8 6 L22-2 L18 2 L30 0 L14-6 L40-20 L60-18 L36-4 L12 0z M24-2 L34-10 L38-6z" fill="${col}"></path>`;
export const footprint = (x, y, s, rot, col) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${col}"><ellipse cx="0" cy="6" rx="7" ry="8"></ellipse><ellipse cx="-8" cy="-6" rx="3" ry="6" transform="rotate(-25 -8 -6)"></ellipse><ellipse cx="0" cy="-9" rx="3" ry="6"></ellipse><ellipse cx="8" cy="-6" rx="3" ry="6" transform="rotate(25 8 -6)"></ellipse></g>`;

// ---------- corner pictures (200 × 200), top right and bottom left ----------
// Sky's balloon, Unicorn's rainbow and Dino's pterosaur are only seen by day.
// dayStyle is the style for those; the scenes use it to fade them out at night.
export function cornerArt(dayStyle = '') {
  return {
  sky: {
    // The balloon lands for the night with the others.
    tr: `<g style="${dayStyle}">${balloon(110, 92, 1.25)}</g>${cloudPuff(60, 170, 0.7, '#FFFFFF', '#E3EEFF')}`,
    bl: `${cloudPuff(90, 150, 1.5, '#FFFFFF', '#E3EEFF')}${cloudPuff(150, 110, 0.8, '#FFFFFF', '#E3EEFF')}`,
  },
  blossom: {
    tr: `<path d="M205-5 C160 30 120 40 40 70 M150 30 C140 60 120 80 110 110 M95 52 C80 40 60 30 40 28" stroke="#7A4A2E" stroke-width="9" fill="none" stroke-linecap="round"></path>
<ellipse cx="128" cy="60" rx="10" ry="5" fill="#66BB6A" transform="rotate(30 128 60)"></ellipse><ellipse cx="70" cy="42" rx="10" ry="5" fill="#66BB6A" transform="rotate(-20 70 42)"></ellipse>
${flower(40, 70, 26, '#FFB3CF', '#FFE066', '#FF6F9F')}${flower(110, 112, 22, '#FFC9DD', '#FFE066', '#FF6F9F')}${flower(160, 26, 24, '#FF9EC4', '#FFE066', '#E8436E')}${flower(40, 28, 16, '#FFC9DD', '#FFE066')}${flower(92, 50, 14, '#FFB3CF', '#FFE066')}`,
    bl: `${tulip(40, 205, 90, '#E8436E')}${tulip(80, 205, 120, '#FF8FB8')}${tulip(122, 205, 80, '#FFC93C')}${tulip(156, 205, 105, '#B57EDC')}`,
  },
  unicorn: {
    // The rainbow has gone at night.
    tr: `<g style="${dayStyle}">${['#FF8FA3', '#FFB86B', '#FFE16B', '#8FE3A8', '#8EC5FF', '#C8A2FF'].map((c, i) => `<path d="M${20 + i * 11} 150 A ${80 - i * 11} ${80 - i * 11} 0 0 1 ${180 - i * 11} 150" stroke="${c}" stroke-width="11" fill="none"></path>`).join('')}</g>${cloudPuff(30, 152, 0.55, '#FFFFFF', '#F1E8FF')}${cloudPuff(172, 152, 0.55, '#FFFFFF', '#F1E8FF')}`,
    bl: `${star4(70, 110, 4.5, '#FFD36E')}${star4(140, 60, 2.4, '#FF8FC8')}${star4(150, 150, 2, '#8EC5FF')}${star4(35, 40, 1.6, '#C8A2FF')}${star5(110, 170, 16, '#FFE16B', '#D69E2E')}`,
  },
  hero: {
    tr: `${burst(100, 92, 96, 58, 12, '#FFC21A', '#111C3A', 8)}${burst(100, 92, 64, 44, 10, '#D3242C', '#111C3A')}<text x="100" y="108" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="46" fill="#FFFFFF" stroke="#111C3A" stroke-width="3" paint-order="stroke">ZAP!</text>`,
    bl: `${burst(96, 110, 86, 54, 11, '#FFFFFF', '#111C3A', 4)}${burst(96, 110, 58, 40, 9, '#1D4ED8', '#111C3A')}<text x="96" y="124" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="40" fill="#FFC21A" stroke="#111C3A" stroke-width="3" paint-order="stroke">POW!</text>`,
  },
  dino: {
    // The pterosaur has gone at night, with the ones in the sky.
    tr: `<g style="${dayStyle}">${pterosaur(108, 92, 2.4, '#6D4C41')}<path transform="translate(108 92) scale(2.4)" d="M-12 4 L-4 2 L8 6 L-2 7z" fill="#A1887F"></path><circle cx="178" cy="83" r="3" fill="#FFFFFF"></circle></g>`,
    bl: `${fern(40, 215, 190, 25, '#2E7D32')}${fern(95, 215, 150, 5, '#43A047')}${fern(150, 215, 110, -18, '#66BB6A')}`,
  },
  space: {
    tr: `<g transform="translate(108 96)"><ellipse rx="92" ry="22" fill="none" stroke="#C9B6FF" stroke-width="8" transform="rotate(-18)"></ellipse><circle r="52" fill="#8E7CFF"></circle><path d="M-50-14 Q0-2 50-16 L52-2 Q0 10-52 2z M-42 22 Q0 30 44 18 L38 32 Q0 40-34 34z" fill="#6D5BEF"></path><circle cx="-18" cy="-22" r="9" fill="#A99BFF"></circle><path d="M-92 0 A 92 22 0 0 0 92 0" fill="none" stroke="#C9B6FF" stroke-width="8" transform="rotate(-18)"></path></g>${star4(28, 180, 1.4, '#FFE066')}`,
    bl: `<g transform="translate(100 120) rotate(-10)"><path d="M-30 18 L-50 70 M0 22 L0 76 M30 18 L50 70" stroke="#FFE066" stroke-width="5" stroke-linecap="round" opacity=".7"></path><ellipse rx="80" ry="24" fill="#9AA3C7"></ellipse><ellipse cy="-6" rx="80" ry="16" fill="#C9CEE8"></ellipse><path d="M-38-12 a38 34 0 0 1 76 0z" fill="#A5F3FC" stroke="#67B8C4" stroke-width="3"></path><g fill="#FFC93C"><circle cx="-52" cy="6" r="6"></circle><circle cx="-20" cy="12" r="6"></circle><circle cx="20" cy="12" r="6"></circle><circle cx="52" cy="6" r="6"></circle></g></g>`,
  },
};
}

// ---------- minutes-ring shapes (clock viewBox 240, centre c = 120) ----------
// The ring shape replaces the plain disc behind the 0–55 minutes. It is filled
// with the look's soft colour, so the minute numbers keep the contrast checked in check.mjs.
// When helpers are off the face grows over it and only the edge peeks out.
/** Each look's ring shape, filled with `soft` (a colour or a template hole). */
export function ringArt(c, soft) {
  const at = (deg, r) => [r1(c + r * Math.sin(deg * Math.PI / 180)), r1(c - r * Math.cos(deg * Math.PI / 180))];
  // Sky: a cloud of bumps.
  let sky = `<circle cx="${c}" cy="${c}" r="117" style="fill:${soft}"></circle>`;
  for (let i = 0; i < 18; i++) { const [x, y] = at(i * 20 + 10, 115); sky += `<circle cx="${x}" cy="${y}" r="14" style="fill:${soft}"></circle>`; }
  // Blossom: twelve petals, one behind each minute number.
  let petals = '';
  for (let k = 0; k < 12; k++) { const [x, y] = at(k * 30, 106); petals += `<ellipse cx="${x}" cy="${y}" rx="20" ry="16" transform="rotate(${k * 30} ${x} ${y})" stroke="#FF8FB8" stroke-width="3" style="fill:${soft}"></ellipse>`; }
  let petalDots = '';
  for (let k = 0; k < 12; k++) { const [x, y] = at(k * 30 + 15, 116); petalDots += `<circle cx="${x}" cy="${y}" r="3.5" fill="#FF6F9F"></circle>`; }
  const blossom = `${petals}<circle cx="${c}" cy="${c}" r="104" style="fill:${soft}"></circle>${petalDots}`;
  // Unicorn: a rainbow edge with sparkles.
  const bands = ['#C8A2FF', '#8EC5FF', '#8FE3A8', '#FFE16B', '#FFB86B', '#FF8FA3'];
  let unicorn = bands.map((col, i) => `<circle cx="${c}" cy="${c}" r="${131 - i * 2.2}" fill="${col}"></circle>`).join('') + `<circle cx="${c}" cy="${c}" r="119" style="fill:${soft}"></circle>`;
  [45, 135, 225, 315].forEach((d) => { const [x, y] = at(d, 125); unicorn += star4(x, y, 0.9, '#FFFFFF'); });
  // Hero: a comic starburst with ink outlines.
  const hero = burst(c, c, 131, 117, 20, '#FFC21A', '#111C3A', 9, true) + `<circle cx="${c}" cy="${c}" r="119.5" stroke="#111C3A" stroke-width="3" style="fill:${soft}"></circle>`;
  // Dino: back plates between the numbers.
  let plates = '';
  for (let k = 0; k < 12; k++) {
    const d = k * 30 + 15, [x1, y1] = at(d - 7, 116), [x2, y2] = at(d + 7, 116), [tx, ty] = at(d, 132);
    plates += `<path d="M${x1} ${y1} L${tx} ${ty} L${x2} ${y2}z" fill="${k % 2 ? '#7CC46A' : '#5FAE4E'}" stroke="#1B5E20" stroke-width="2.5" stroke-linejoin="round"></path>`;
  }
  const dino = plates + `<circle cx="${c}" cy="${c}" r="119.5" stroke="#5FAE4E" stroke-width="3" style="fill:${soft}"></circle>`;
  // Space: an orbit with a small planet and a moon.
  const [px, py] = at(62, 127), [mx, my] = at(242, 127);
  const space = `<ellipse cx="${c}" cy="${c}" rx="131" ry="42" fill="none" stroke="#A5B4FF" stroke-width="3" stroke-dasharray="7 6" transform="rotate(-28 ${c} ${c})"></ellipse><circle cx="${c}" cy="${c}" r="119.5" stroke="#6D63FF" stroke-width="3" style="fill:${soft}"></circle>
${[20, 100, 160, 200, 280, 340].map((d) => { const [x, y] = at(d, 116); return `<circle cx="${x}" cy="${y}" r="1.8" fill="#FFFFFF"></circle>`; }).join('')}
<circle cx="${px}" cy="${py}" r="9" fill="#FFB86B" stroke="#1E1B4B" stroke-width="2"></circle><circle cx="${mx}" cy="${my}" r="6" fill="#C9D1F5" stroke="#1E1B4B" stroke-width="2"></circle>`;
  return { sky, blossom, unicorn, hero, dino, space };
}

// ---------- look picker pictures (100 × 100), one big picture per look ----------
export const BADGES = {
  sky: `<circle cx="50" cy="50" r="46" fill="#9FD0FF"></circle>${cloudPuff(36, 76, 0.42, '#FFFFFF', '#E3EEFF')}${balloon(56, 50, 0.62)}${cloudPuff(78, 30, 0.28, '#FFFFFF', '#E3EEFF')}`,
  blossom: `<circle cx="50" cy="50" r="46" fill="#FFE1EE"></circle><ellipse cx="74" cy="76" rx="14" ry="7" fill="#66BB6A" transform="rotate(-30 74 76)"></ellipse>${flower(48, 48, 40, '#FF9EC4', '#FFE066', '#E8436E')}${flower(80, 26, 13, '#FFC9DD', '#FFE066')}`,
  unicorn: `<circle cx="50" cy="50" r="46" fill="#EFE5FF"></circle>
<path d="M32 92 C26 70 30 50 44 38 L70 44 C74 56 70 70 62 78 L60 92z" fill="#FFFFFF" stroke="#CBB6F5" stroke-width="3"></path>
<ellipse cx="66" cy="50" rx="20" ry="14" fill="#FFFFFF" stroke="#CBB6F5" stroke-width="3" transform="rotate(25 66 50)"></ellipse>
<path d="M56 34 L66 4 L70 36z" fill="#FFC93C" stroke="#D69E2E" stroke-width="2"></path>
<circle cx="44" cy="36" r="9" fill="#FF8FC8"></circle><circle cx="36" cy="48" r="8" fill="#FFD36E"></circle><circle cx="31" cy="62" r="8" fill="#8EC5FF"></circle><circle cx="30" cy="76" r="7" fill="#8FE3A8"></circle>
<circle cx="70" cy="48" r="3.5" fill="#35155D"></circle><circle cx="78" cy="58" r="3" fill="#FF8FC8" opacity=".7"></circle>${star4(22, 24, 0.9, '#FFD36E')}`,
  hero: `<circle cx="50" cy="50" r="46" fill="#FFF0C2"></circle><path d="M28 24 C10 50 14 80 22 92 L78 92 C86 80 90 50 72 24z" fill="#D3242C"></path>
<path d="M50 14 L80 24 C80 54 70 74 50 86 C30 74 20 54 20 24z" fill="#1D4ED8" stroke="#111C3A" stroke-width="4" stroke-linejoin="round"></path>${star5(50, 46, 20, '#FFC21A', '#111C3A')}`,
  dino: `<circle cx="50" cy="50" r="46" fill="#E2F3D5"></circle>
<path d="M22 30 L30 18 L36 30 L44 14 L50 30 L58 16 L62 32z" fill="#7CC46A" stroke="#1B5E20" stroke-width="2.5" stroke-linejoin="round"></path>
<path d="M18 92 C14 60 24 34 50 32 C74 30 90 44 88 58 C86 70 72 72 60 70 L58 92z" fill="#5FAE4E" stroke="#1B5E20" stroke-width="3"></path>
<path d="M60 64 q12 4 22-4" stroke="#1B5E20" stroke-width="3" fill="none" stroke-linecap="round"></path><path d="M66 66 l3 6 3-7 M74 64 l2 6 3-8" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.5"></path>
<circle cx="62" cy="46" r="8" fill="#FFFFFF"></circle><circle cx="64" cy="47" r="4" fill="#173A1E"></circle><circle cx="34" cy="60" r="5" fill="#7CC46A"></circle><circle cx="42" cy="74" r="4" fill="#7CC46A"></circle>`,
  space: `<circle cx="50" cy="50" r="46" fill="#312E81"></circle>${star4(20, 30, 0.6, '#FFFFFF')}${star4(80, 70, 0.5, '#FFFFFF')}<circle cx="76" cy="26" r="11" fill="#8E7CFF"></circle><ellipse cx="76" cy="26" rx="18" ry="4" fill="none" stroke="#C9B6FF" stroke-width="2.5" transform="rotate(-18 76 26)"></ellipse>
<g transform="translate(48 54) rotate(30)"><path d="M-6 22 L0 38 L6 22z" fill="#FFB86B"></path><path d="M-12 8 L-20 22 L-10 20z M12 8 L20 22 L10 20z" fill="#E5484D"></path><path d="M-10 22 L-10-6 C-10-20 0-32 0-32 C0-32 10-20 10-6 L10 22z" fill="#F8F9FF"></path><path d="M-7-16 C-4-24 0-32 0-32 C0-32 4-24 7-16z" fill="#E5484D"></path><circle cy="0" r="5" fill="#4DABF7" stroke="#2B3A67" stroke-width="2"></circle></g>`,
};
// Small motifs scattered at the screen corners (24 × 24).
export const MOTIFS = Object.freeze({
  sky: 'M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.6 4.7 4.7 0 0 1 18.3 19z',
  blossom: 'M12 2.5c1.6 0 2.7 1.6 2.4 3.6 1.7-1 3.6-.6 4.2.9.5 1.5-.6 3.1-2.5 3.6 1.7 1 2.2 3 1.2 4.2-1 1.2-2.9 1-4.2-.5-.4 2-1.8 3.3-3.3 3-1.5-.4-2.1-2.2-1.4-4.1-1.9.5-3.6-.4-3.8-2-.2-1.5 1.3-2.8 3.3-2.8-1.3-1.5-1.3-3.4 0-4.2 1.2-.8 2.9-.1 3.7 1.6.1-1.9.9-3.3 2.4-3.3z',
  unicorn: 'M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z',
  hero: 'M13.5 2L4 13.5h6.5L9 22l11-12.5h-6.8z',
  dino: 'M12 22c-3 0-5-2-5-4.5 0-2.3 2.2-4 5-4s5 1.7 5 4c0 2.5-2 4.5-5 4.5zM5.5 12.5c-1.3 0-2.5-1.5-2.5-3.3S4 6 5.3 6s2.4 1.5 2.4 3.3-.9 3.2-2.2 3.2zM12 10c-1.4 0-2.4-1.6-2.4-3.6S10.6 2.8 12 2.8s2.4 1.6 2.4 3.6S13.4 10 12 10zm6.5 2.5c-1.3 0-2.2-1.4-2.2-3.2S17.4 6 18.7 6 21 7.5 21 9.3s-1.2 3.2-2.5 3.2z',
  space: 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z',
});

// Where the motifs sit on the screen: [left %, top %, size px at 800 px, turn °].
export const MOTIF_SPOTS = Object.freeze([[3, 4, 46, -12], [90, 3, 36, 14], [46, 2, 28, 0], [2, 88, 34, 8], [93, 90, 42, -10]]);

/**
 * CSS for every look's own card style, keyed on data-look on the root
 * element. Space is dark, so its form controls are too. The display fonts
 * (dfont) are only for look names, never for labels a child must read
 * (design/REVIEW.md 6.4), so they are not used here.
 */
export function lookStyleSheet() {
  return LOOK_IDS.map((id) => {
    const scheme = LOOKS[id].dark ? `\n:root[data-look="${id}"] { color-scheme: dark; }` : '';
    return `[data-look="${id}"] .card { ${LOOK_STYLES[id].cardFx}; }${scheme}`;
  }).join('\n');
}
