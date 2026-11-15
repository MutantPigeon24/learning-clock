// Theme art: everything that makes a theme more than colours.
// Each theme is a kit: sky paint per scene, a landscape, two corner props,
// a clock-ring shape, a picker badge, card and button styles and a label font.
// Every piece is drawn for all six themes and shown with display:{{ bd.<id> }},
// so one state drives every frame.

const r1 = (v) => Math.round(v * 10) / 10;
const show = (id, inner, extra = '') => `<g style="display:{{ bd.${id} }}${extra}">${inner}</g>`;
// Deterministic wobble so generated shapes look hand-placed but never change.
const wob = (i, k = 1) => Math.sin(i * 12.9898 + k * 78.233) * 0.5 + 0.5;

// Time still decides WHICH scene shows (sunrise, day, sunset, night).
// The theme decides how that scene is painted. Every theme keeps the same
// reading: a light sky with a high sun is day, a dark sky with a moon is night.
export const PAINT = {
  sky: {
    sunrise: { top: '#FF9E8A', bot: '#FFE1B0', orb: '#FF7A3D' },
    day: { top: '#4FAEF5', bot: '#CDEBFF', orb: '#FFD43B' },
    sunset: { top: '#5B3A8E', bot: '#FF9254', orb: '#FF5E3A' },
    night: { top: '#0B1035', bot: '#27306E', orb: '#F4F1C9' },
  },
  blossom: {
    sunrise: { top: '#FF9EB5', bot: '#FFE3C9', orb: '#FF7A59' },
    day: { top: '#7CC8FF', bot: '#FFE4F0', orb: '#FFD43B' },
    sunset: { top: '#7A2E6E', bot: '#FF8FA3', orb: '#FF5E7A' },
    night: { top: '#1E0F33', bot: '#4A1F4F', orb: '#FFE9F3' },
  },
  unicorn: {
    sunrise: { top: '#F9A8D4', bot: '#FDE68A', orb: '#FF8FB8' },
    day: { top: '#8FB8FF', bot: '#F5D0FE', orb: '#FFE066' },
    sunset: { top: '#6D28D9', bot: '#F472B6', orb: '#FF7AB6' },
    night: { top: '#1E1046', bot: '#4C1D95', orb: '#FFF1C9' },
  },
  hero: {
    sunrise: { top: '#FF8A3D', bot: '#FFE08A', orb: '#FF5A1F' },
    day: { top: '#1E9BF0', bot: '#BDE8FF', orb: '#FFD43B' },
    sunset: { top: '#B3263A', bot: '#FF9F43', orb: '#FF4D2E' },
    night: { top: '#0A1230', bot: '#1F3A75', orb: '#FFF3B0' },
  },
  dino: {
    sunrise: { top: '#FF8F5A', bot: '#FFE0A3', orb: '#FF6A2B' },
    day: { top: '#5FBBD0', bot: '#F3EFC0', orb: '#FFD43B' },
    sunset: { top: '#8A2E2E', bot: '#FFA552', orb: '#FF5A2B' },
    night: { top: '#0E2222', bot: '#1F4A45', orb: '#F1F5C9' },
  },
  space: {
    sunrise: { top: '#5B2A86', bot: '#FF9B71', orb: '#FF7A3D' },
    day: { top: '#2F55D4', bot: '#A8BEFF', orb: '#FFD43B' },
    sunset: { top: '#2E1A6B', bot: '#FF7A59', orb: '#FF5E3A' },
    night: { top: '#03041A', bot: '#1A1446', orb: '#F4F1C9' },
  },
};

// How each scene lights the landscape and props.
// lum/sat: brightness and saturation of the ground layer. dayO: things only seen
// in daylight (birds, butterflies, rainbows, smoke). glow: lights that come on
// at night (windows, lava, fireflies). sink: how far Sky's balloons have drifted
// down out of sight (they land for the night).
export const LIGHT = {
  sunrise: { lum: 0.92, sat: 0.95, lumP: 0.95, dayO: 0.75, glow: 0.25, sink: 0 },
  day: { lum: 1, sat: 1, lumP: 1, dayO: 1, glow: 0, sink: 0 },
  sunset: { lum: 0.74, sat: 0.92, lumP: 0.85, dayO: 0.35, glow: 0.6, sink: 70 },
  night: { lum: 0.46, sat: 0.75, lumP: 0.72, dayO: 0, glow: 1, sink: 320 },
};

// ---------- small shapes ----------
const star4 = (x, y, s, fill, op = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-10 L2.4-2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4-2.4z" fill="${fill}" opacity="${op}"></path>`;
const star5 = (x, y, r, fill, stroke = '') => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r;
    d += (i ? 'L' : 'M') + r1(x + rr * Math.cos(a)) + ' ' + r1(y + rr * Math.sin(a));
  }
  return `<path d="${d}z" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"` : ''}></path>`;
};
const flower = (x, y, r, petal, centre = '#FFE066', dark = '') => {
  let s = '';
  for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="${r1(-r * 0.55)}" rx="${r1(r * 0.42)}" ry="${r1(r * 0.55)}" fill="${petal}" transform="rotate(${i * 72})"></ellipse>`;
  if (dark) for (let i = 0; i < 5; i++) s += `<line x1="0" y1="0" x2="0" y2="${r1(-r * 0.5)}" stroke="${dark}" stroke-width="${r1(r * 0.07)}" stroke-linecap="round" transform="rotate(${i * 72 + 36})"></line>`;
  return `<g transform="translate(${x} ${y})">${s}<circle r="${r1(r * 0.24)}" fill="${centre}"></circle></g>`;
};
const burst = (cx, cy, rOut, rIn, n, fill, stroke, rot = 0, even = false) => {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (i * 180 / n + rot) * Math.PI / 180, rr = i % 2 ? rIn : (even ? rOut : rOut * (0.86 + 0.14 * wob(i, 3)));
    d += (i ? 'L' : 'M') + r1(cx + rr * Math.cos(a)) + ' ' + r1(cy + rr * Math.sin(a));
  }
  return `<path d="${d}z" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"></path>`;
};
const cloudPuff = (x, y, s, fill, shade) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="8" rx="62" ry="20" fill="${shade}"></ellipse><circle cx="-34" cy="0" r="22" fill="${fill}"></circle><circle cx="-6" cy="-14" r="30" fill="${fill}"></circle><circle cx="28" cy="-4" r="24" fill="${fill}"></circle><rect x="-56" y="-2" width="106" height="18" rx="9" fill="${fill}"></rect></g>`;
const balloon = (x, y, s, a = '#FF6B6B', b = '#FFD43B', c = '#4DABF7') => `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M0-60 C34-60 50-32 44-6 C38 16 16 30 10 40 L-10 40 C-16 30-38 16-44-6 C-50-32-34-60 0-60z" fill="${a}"></path>
<path d="M0-60 C14-60 20-32 18-6 C16 16 8 30 5 40 L-5 40 C-8 30-16 16-18-6 C-20-32-14-60 0-60z" fill="${b}"></path>
<path d="M-44-6 C-38 16-16 30-10 40 L-5 40 C-8 30-16 16-18-6z M44-6 C38 16 16 30 10 40 L5 40 C8 30 16 16 18-6z" fill="${c}"></path>
<path d="M-9 40 L-8 54 M9 40 L8 54" stroke="#6B4226" stroke-width="2.5"></path><rect x="-10" y="53" width="20" height="14" rx="3" fill="#A0522D"></rect></g>`;
const tulip = (x, y, h, cup) => `<g transform="translate(${x} ${y})"><path d="M0 0 C0 ${-h * 0.4} 1 ${-h * 0.7} 0 ${-h}" stroke="#3E8E41" stroke-width="4" fill="none"></path><path d="M0 ${-h * 0.25} C-12 ${-h * 0.4} -14 ${-h * 0.6} -10 ${-h * 0.75} C-4 ${-h * 0.6} -2 ${-h * 0.45} 0 ${-h * 0.3}z" fill="#4CAF50"></path><path d="M-10 ${-h} C-12 ${-h - 16} -6 ${-h - 22} -5 ${-h - 22} L0 ${-h - 14} L5 ${-h - 22} C6 ${-h - 22} 12 ${-h - 16} 10 ${-h} C8 ${-h + 8} -8 ${-h + 8} -10 ${-h}z" fill="${cup}"></path></g>`;
const fern = (x, y, len, rot, col) => {
  let s = `<path d="M0 0 Q ${len * 0.15} ${-len * 0.5} 0 ${-len}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"></path>`;
  for (let i = 1; i < 9; i++) {
    const t = i / 9, py = -len * t, px = len * 0.15 * Math.sin(Math.PI * t) * 1.2, w = len * 0.28 * (1 - t * 0.7);
    s += `<path d="M${r1(px)} ${r1(py)} q ${r1(-w * 0.6)} ${r1(-w * 0.15)} ${r1(-w)} ${r1(w * 0.35)} q ${r1(w * 0.5)} ${r1(-w * 0.05)} ${r1(w)} ${r1(-w * 0.35)}z M${r1(px)} ${r1(py)} q ${r1(w * 0.6)} ${r1(-w * 0.15)} ${r1(w)} ${r1(w * 0.35)} q ${r1(-w * 0.5)} ${r1(-w * 0.05)} ${r1(-w)} ${r1(-w * 0.35)}z" fill="${col}"></path>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${s}</g>`;
};
const palm = (x, y, h, lean) => {
  const tx = x + lean, ty = y - h;
  let s = `<path d="M${x} ${y} Q ${x + lean * 0.2} ${y - h * 0.5} ${tx} ${ty}" stroke="#8D6E4E" stroke-width="12" fill="none" stroke-linecap="round"></path>`;
  [[-70, 1], [-25, 0.8], [20, 0.9], [65, 1], [160, 0.7], [205, 0.8]].forEach(([a, k], i) => {
    const L = 70 * k;
    s += `<path d="M${tx} ${ty} q ${r1(L * 0.5 * Math.cos((a - 90) * Math.PI / 180) + 10)} ${r1(L * 0.5 * Math.sin((a - 90) * Math.PI / 180) - 14)} ${r1(L * Math.cos((a - 60) * Math.PI / 180))} ${r1(L * Math.sin((a - 60) * Math.PI / 180) + 18)} q ${r1(-L * 0.3)} ${-6} ${r1(-L * Math.cos((a - 60) * Math.PI / 180))} ${r1(-L * Math.sin((a - 60) * Math.PI / 180) - 18)}z" fill="${i % 2 ? '#2E7D32' : '#43A047'}"></path>`;
  });
  return s;
};
const pterosaur = (x, y, s, col = '#5D4037') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0 L-28-14 L-50-8 L-30-4 L-12 4 L-4 2 L8 6 L22-2 L18 2 L30 0 L14-6 L40-20 L60-18 L36-4 L12 0z M24-2 L34-10 L38-6z" fill="${col}"></path>`;
const footprint = (x, y, s, rot, col) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${col}"><ellipse cx="0" cy="6" rx="7" ry="8"></ellipse><ellipse cx="-8" cy="-6" rx="3" ry="6" transform="rotate(-25 -8 -6)"></ellipse><ellipse cx="0" cy="-9" rx="3" ry="6"></ellipse><ellipse cx="8" cy="-6" rx="3" ry="6" transform="rotate(25 8 -6)"></ellipse></g>`;

// A circle-bump cloud bank along y, filled to the bottom.
function cloudBank(y, rMin, rMax, step, k, fill) {
  let s = `<rect x="-50" y="${y}" width="1100" height="${1000 - y + 10}" fill="${fill}"></rect>`;
  for (let x = -40, i = 0; x < 1060; x += step, i++) {
    const r = rMin + (rMax - rMin) * wob(i, k);
    s += `<circle cx="${x}" cy="${r1(y + 10 - r * 0.2 * wob(i, k + 2))}" r="${r1(r)}" fill="${fill}"></circle>`;
  }
  return s;
}

// ---------- landscapes (scene viewBox 1000 × 1000, bottom-anchored) ----------
// Safe area seen on every screen shape: x 275–725, y 375–1000.
function skyLand() {
  return {
    drift: `${balloon(330, 640, 0.55)}${balloon(690, 560, 0.38, '#7C5CFF', '#FFFFFF', '#FF8FB8')}${balloon(560, 720, 0.28, '#20C997', '#FFE066', '#FF922B')}`,
    ground: `${cloudBank(800, 55, 85, 78, 1, '#D9E9FF')}${cloudBank(860, 50, 80, 70, 4, '#EEF5FF')}${cloudBank(925, 45, 70, 64, 7, '#FFFFFF')}`,
    day: `<g transform="translate(250 430) rotate(-12)"><path d="M0-46 L30 0 L0 46 L-30 0z" fill="#FF6B6B"></path><path d="M0-46 L0 46 M-30 0 L30 0" stroke="#FFFFFF" stroke-width="3"></path><path d="M0-46 L30 0 L0 0z" fill="#FFD43B"></path><path d="M0 0 L-30 0 L0 46z" fill="#4DABF7"></path><path d="M0 46 C-10 70 14 84 0 108 C-12 128 10 140 -2 162" stroke="#2B3A55" stroke-width="2.5" fill="none"></path><g fill="#7C5CFF"><path d="M-2 70 l-12-6 2 12z"></path><path d="M2 106 l12-6-2 12z"></path><path d="M-4 140 l-12-6 2 12z"></path></g></g>
<g transform="translate(640 650) rotate(-14)"><path d="M0 0 L60-14 L18 6z" fill="#FFFFFF" stroke="#9CC7F2" stroke-width="2"></path><path d="M18 6 L60-14 L22 18z" fill="#DCEBFF" stroke="#9CC7F2" stroke-width="2"></path><path d="M-8 4 q-40 10-70-8" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 8" fill="none" stroke-linecap="round"></path></g>
<g fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"><path d="M420 500 q10-10 20 0 q10-10 20 0"></path><path d="M470 470 q8-8 16 0 q8-8 16 0"></path><path d="M600 530 q7-7 14 0 q7-7 14 0"></path></g>`,
    glow: '',
  };
}
function blossomLand() {
  const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M0 0 C4-50-2-70-12-95 M-2-40 C18-70 34-80 50-88 M-4-60 C-24-80-40-86-56-90" stroke="#7A4A2E" stroke-width="14" fill="none" stroke-linecap="round"></path>
<circle cx="-50" cy="-110" r="48" fill="#FFC9DD"></circle><circle cx="0" cy="-135" r="58" fill="#FFB3CF"></circle><circle cx="55" cy="-110" r="50" fill="#FF9EC4"></circle><circle cx="-20" cy="-80" r="40" fill="#FFB3CF"></circle><circle cx="30" cy="-78" r="42" fill="#FFC9DD"></circle>
${[[-60, -120], [-30, -150], [10, -165], [40, -130], [70, -100], [-10, -100], [20, -105], [-45, -85], [55, -75]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="6" fill="#FF6F9F"></circle>`).join('')}</g>`;
  const tulips = [70, 140, 200, 410, 470, 540, 610, 820, 880, 950].map((x, i) => tulip(x, 935 + 12 * wob(i, 2), 34 + 10 * wob(i, 5), ['#E8436E', '#FFC93C', '#FF8FB8', '#B57EDC'][i % 4])).join('');
  let daisies = '';
  for (let i = 0; i < 10; i++) daisies += flower(r1(40 + i * 100 + 20 * wob(i, 8)), r1(850 + 30 * wob(i, 9)), 9, '#FFFFFF', '#FFC93C');
  let petals = '';
  for (let i = 0; i < 14; i++) petals += `<ellipse cx="${r1(250 + 520 * wob(i, 11))}" cy="${r1(400 + 330 * wob(i, 12))}" rx="7" ry="4.5" fill="#FFB3CF" transform="rotate(${r1(360 * wob(i, 13))} ${r1(250 + 520 * wob(i, 11))} ${r1(400 + 330 * wob(i, 12))})"></ellipse>`;
  const butterfly = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-9" cy="-6" rx="10" ry="12" fill="${c}"></ellipse><ellipse cx="9" cy="-6" rx="10" ry="12" fill="${c}"></ellipse><ellipse cx="-7" cy="8" rx="7" ry="8" fill="${c}"></ellipse><ellipse cx="7" cy="8" rx="7" ry="8" fill="${c}"></ellipse><rect x="-2" y="-14" width="4" height="28" rx="2" fill="#4A2C2A"></rect></g>`;
  const flies = [];
  for (let i = 0; i < 10; i++) flies.push(`<circle cx="${r1(120 + 780 * wob(i, 21))}" cy="${r1(700 + 220 * wob(i, 22))}" r="5" fill="#FFF3A0"></circle><circle cx="${r1(120 + 780 * wob(i, 21))}" cy="${r1(700 + 220 * wob(i, 22))}" r="12" fill="#FFF3A0" opacity=".25"></circle>`);
  return {
    ground: `<path d="M0 845 Q 220 765 480 825 T 1000 805 V1000 H0z" fill="#B5E08F"></path>${daisies}${tree(310, 830, 1)}${tree(780, 810, 0.62)}
<path d="M0 910 Q 300 845 600 905 T 1000 895 V1000 H0z" fill="#86C96C"></path>${tulips}${petals}`,
    day: `${butterfly(560, 610, 1.1, '#FF8FB8')}${butterfly(430, 670, 0.8, '#FFC93C')}`,
    glow: '',
    seq: flies,
  };
}
function unicornLand() {
  const cols = ['#FF8FA3', '#FFB86B', '#FFE16B', '#8FE3A8', '#8EC5FF', '#C8A2FF'];
  const rainbow = cols.map((c, i) => { const r = 390 - i * 28; return `<path d="M${520 - r} 900 A ${r} ${r} 0 0 1 ${520 + r} 900" stroke="${c}" stroke-width="29" fill="none"></path>`; }).join('');
  const castle = `<g transform="translate(660 830)">
<rect x="-55" y="-70" width="110" height="70" fill="#FFFFFF"></rect><rect x="-75" y="-110" width="32" height="110" fill="#FFFFFF"></rect><rect x="43" y="-110" width="32" height="110" fill="#FFFFFF"></rect><rect x="-16" y="-140" width="32" height="80" fill="#FFFFFF"></rect>
<path d="M-81-108 L-59-160 L-37-108z M37-108 L59-160 L81-108z M-22-138 L0-200 L22-138z" fill="#B794F4"></path>
<path d="M-59-160 v-18 l14 6 -14 6 M59-160 v-18 l14 6 -14 6 M0-200 v-20 l16 7 -16 7" stroke="#8B5CF6" stroke-width="2" fill="#FFD36E"></path>
<path d="M-14 0 v-26 a14 14 0 0 1 28 0 v26z" fill="#B794F4"></path>
<g fill="#D9CCF7"><rect x="-66" y="-90" width="12" height="18" rx="6"></rect><rect x="54" y="-90" width="12" height="18" rx="6"></rect><rect x="-6" y="-118" width="12" height="18" rx="6"></rect><rect x="-40" y="-55" width="12" height="16" rx="6"></rect><rect x="28" y="-55" width="12" height="16" rx="6"></rect></g></g>`;
  const castleGlow = [[-40, -55, 16], [28, -55, 16], [-66, -90, 18], [54, -90, 18], [-6, -118, 18]].map(([x, y, h]) => `<rect x="${660 + x}" y="${830 + y}" width="12" height="${h}" rx="6" fill="#FFE58A"></rect>`);
  const unicorn = `<g transform="translate(370 905) scale(1.05)">
<path d="M-50-50 C-78-58-86-30-70-14 C-64-26-58-34-50-36z" fill="#FF8FC8"></path><path d="M-52-44 C-74-40-74-18-64-8" stroke="#8EC5FF" stroke-width="7" fill="none" stroke-linecap="round"></path>
<g fill="#FFFFFF" stroke="#CBB6F5" stroke-width="3"><rect x="-40" y="-30" width="11" height="32" rx="5"></rect><rect x="-22" y="-30" width="11" height="32" rx="5"></rect><rect x="12" y="-30" width="11" height="32" rx="5"></rect><rect x="28" y="-30" width="11" height="32" rx="5"></rect>
<ellipse cx="0" cy="-42" rx="52" ry="26"></ellipse><path d="M28-58 L44-104 L66-98 L46-44z"></path><ellipse cx="62" cy="-104" rx="24" ry="15" transform="rotate(20 62 -104)"></ellipse></g>
<g fill="#C8A2FF"><rect x="-40" y="-2" width="11" height="6" rx="2"></rect><rect x="-22" y="-2" width="11" height="6" rx="2"></rect><rect x="12" y="-2" width="11" height="6" rx="2"></rect><rect x="28" y="-2" width="11" height="6" rx="2"></rect></g>
<path d="M56-118 L64-160 L72-116z" fill="#FFC93C" stroke="#D69E2E" stroke-width="2"></path>
<circle cx="44" cy="-112" r="10" fill="#FF8FC8"></circle><circle cx="36" cy="-96" r="9" fill="#FFD36E"></circle><circle cx="30" cy="-80" r="9" fill="#8EC5FF"></circle><circle cx="26" cy="-64" r="8" fill="#8FE3A8"></circle>
<circle cx="68" cy="-106" r="3.5" fill="#35155D"></circle><circle cx="78" cy="-96" r="3" fill="#FF8FC8" opacity=".7"></circle></g>`;
  let sparkles = '';
  for (let i = 0; i < 12; i++) sparkles += star4(r1(240 + 540 * wob(i, 31)), r1(390 + 330 * wob(i, 32)), r1(0.7 + 0.8 * wob(i, 33)), i % 3 ? '#FFFFFF' : '#FFE066', 0.9);
  return {
    ground: `<path d="M0 830 Q 260 740 520 810 T 1000 790 V1000 H0z" fill="#BFEBD9"></path>${castle}
<path d="M0 880 Q 240 820 470 870 T 1000 860 V1000 H0z" fill="#F7C6E0"></path>
<path d="M0 935 Q 300 885 600 930 T 1000 920 V1000 H0z" fill="#D9C7FF"></path>${unicorn}${sparkles}`,
    day: rainbow,
    glow: '',
    seq: castleGlow,
    behind: true,
  };
}
function heroLand() {
  let back = '', front = '', wins = '';
  const lit = [];
  for (let i = 0, x = -10; x < 1010; i++) {
    const w = 60 + 30 * wob(i, 41), h = 120 + 110 * wob(i, 42);
    back += `<rect x="${r1(x)}" y="${r1(900 - h - 60)}" width="${r1(w)}" height="${r1(h + 120)}" fill="#7B8FC7"></rect>`;
    x += w + 6;
  }
  const blds = [[0, 70, 150], [76, 90, 110], [172, 60, 190], [238, 100, 130], [344, 80, 170], [430, 110, 120], [546, 100, 250], [652, 70, 150], [728, 90, 200], [824, 80, 120], [910, 100, 170]];
  blds.forEach(([x, w, h], i) => {
    const top = 960 - h;
    front += `<rect x="${x}" y="${top}" width="${w}" height="${h + 40}" fill="${i % 2 ? '#2E3A66' : '#34416B'}"></rect>`;
    wins += `<rect x="${x + 6}" y="${top + 10}" width="${w - 14}" height="${940 - top - 10}" fill="url(#win-ID)"></rect>`;
    for (let yy = top + 16, n = 0; yy < 940; yy += 26) for (let xx = x + 12; xx < x + w - 14; xx += 22, n++) {
      if (wob(xx * 3 + yy, 44) > 0.72) lit.push(`<rect x="${xx}" y="${yy}" width="10" height="13" rx="2" fill="#FFE066"></rect>`);
    }
  });
  const tower = `<g transform="translate(250 830)"><rect x="-4" y="0" width="5" height="30" fill="#1C2444"></rect><rect x="30" y="0" width="5" height="30" fill="#1C2444"></rect><path d="M-8 0 h50 v-34 a25 10 0 0 0-50 0z" fill="#8D6E63"></path><path d="M-10-34 L17-56 L44-34z" fill="#5D4037"></path></g>`;
  const hero = `<g transform="translate(596 710)">
<path d="M-10-58 C-30-40-46-10-52 6 C-30 0-14-10-4-18z" fill="#D3242C"></path>
<rect x="-12" y="-14" width="10" height="30" rx="4" fill="#1D4ED8"></rect><rect x="2" y="-14" width="10" height="30" rx="4" fill="#1D4ED8"></rect>
<rect x="-12" y="10" width="10" height="8" rx="3" fill="#D3242C"></rect><rect x="2" y="10" width="10" height="8" rx="3" fill="#D3242C"></rect>
<path d="M-15-56 h30 l-3 44 h-24z" fill="#1D4ED8"></path><rect x="-15" y="-18" width="30" height="6" fill="#FFC21A"></rect>
<path d="M-15-52 L-30-78 L-22-82 L-8-56z M15-52 L30-78 L22-82 L8-56z" fill="#1D4ED8"></path>
${star5(0, -38, 9, '#FFC21A')}<circle cx="0" cy="-70" r="12" fill="#F2C29B"></circle><path d="M-12-74 h24 v7 h-24z" fill="#111C3A"></path><path d="M-12-74 a12 12 0 0 1 24 0z" fill="#111C3A"></path></g>`;
  const beam = `<path d="M520 715 L380 300 L470 290z" fill="#FFF6C2" opacity=".45"></path><circle cx="425" cy="292" r="44" fill="#FFF6C2" opacity=".55"></circle>${star5(425, 292, 26, '#111C3A')}`;
  return {
    ground: `<rect x="0" y="0" width="1000" height="780" fill="url(#dots-ID)" opacity=".22"></rect>${back}${front}${wins}${tower}${hero}<rect x="-20" y="955" width="1040" height="60" fill="#1C2444"></rect>
<g stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".55"><path d="M250 470 h70 M270 490 h90 M240 510 h60"></path><path d="M690 430 h70 M670 450 h90 M700 470 h60"></path></g>`,
    day: '',
    glow: '',
    seq: [...lit, beam],
  };
}
function dinoLand() {
  const volcano = `<path d="M560 840 L680 615 Q 710 600 740 615 L880 840z" fill="#7D6656"></path><path d="M668 640 L680 615 Q 710 600 740 615 L752 640 Q 710 628 668 640z" fill="#4E3B31"></path>
<path d="M684 622 L694 680 L704 640 L714 700 L724 642 L732 668 L738 620 Q 710 610 684 622z" fill="#FF7043"></path>`;
  const smoke = `<g fill="#EDE6DE"><circle cx="705" cy="585" r="22"></circle><circle cx="730" cy="552" r="28"></circle><circle cx="765" cy="515" r="34"></circle><circle cx="805" cy="480" r="28"></circle></g>`;
  const lava = `<circle cx="710" cy="615" r="60" fill="#FF8A50" opacity=".35"></circle><path d="M684 622 L694 680 L704 640 L714 700 L724 642 L732 668 L738 620 Q 710 610 684 622z" fill="#FFB74D"></path>`;
  const brachio = `<g transform="translate(360 808)">
<path d="M-60-26 C-110-20-140-6-160 4 C-120 4-90-4-56-10z" fill="#4E9A57"></path>
<g fill="#3F8A4A"><rect x="-50" y="-22" width="18" height="40" rx="7"></rect><rect x="-22" y="-22" width="18" height="40" rx="7"></rect><rect x="22" y="-22" width="18" height="40" rx="7"></rect><rect x="46" y="-22" width="18" height="40" rx="7"></rect></g>
<ellipse cx="0" cy="-34" rx="70" ry="36" fill="#4E9A57"></ellipse>
<path d="M44-52 C70-110 72-150 92-176" stroke="#4E9A57" stroke-width="24" fill="none" stroke-linecap="round"></path>
<ellipse cx="106" cy="-180" rx="26" ry="15" fill="#4E9A57"></ellipse><circle cx="112" cy="-186" r="3.5" fill="#173A1E"></circle><path d="M118-174 q8 3 12-2" stroke="#173A1E" stroke-width="2.5" fill="none" stroke-linecap="round"></path>
<g fill="#7CC46A"><circle cx="-20" cy="-50" r="8"></circle><circle cx="6" cy="-58" r="6"></circle><circle cx="22" cy="-40" r="7"></circle><circle cx="-38" cy="-36" r="5"></circle></g></g>`;
  let prints = '';
  for (let i = 0; i < 6; i++) prints += footprint(380 + i * 60, 958 + (i % 2) * 14, 0.9, 80, '#4E7F30');
  return {
    ground: `${volcano}<path d="M0 840 Q 230 770 500 830 T 1000 815 V1000 H0z" fill="#A5D16E"></path>${brachio}${palm(200, 860, 170, 20)}${palm(870, 880, 150, -24)}
<path d="M0 915 Q 280 855 560 910 T 1000 900 V1000 H0z" fill="#73B04F"></path>${prints}
${fern(40, 1000, 190, 30, '#2E7D32')}${fern(110, 1000, 150, 8, '#43A047')}${fern(960, 1000, 190, -30, '#2E7D32')}${fern(890, 1000, 140, -8, '#43A047')}`,
    day: `${smoke}${pterosaur(480, 500, 1.1)}${pterosaur(590, 450, 0.75)}`,
    glow: lava,
  };
}
function spaceLand() {
  const planet = `<g transform="translate(810 430)"><ellipse rx="86" ry="20" fill="none" stroke="#FFE0B2" stroke-width="7" transform="rotate(-16)"></ellipse><circle r="46" fill="#FFB86B"></circle><path d="M-44-12 Q0-4 44-14 L46-2 Q0 8-46 0z M-40 16 Q0 22 40 14 L36 24 Q0 32-34 26z" fill="#F08C4A"></path><path d="M-86 0 A 86 20 0 0 0 86 0" fill="none" stroke="#FFE0B2" stroke-width="7" transform="rotate(-16)"></path></g>`;
  const moonlet = `<g transform="translate(230 470)"><circle r="20" fill="#C9D1F5"></circle><circle cx="-6" cy="-4" r="5" fill="#AAB4E0"></circle><circle cx="7" cy="6" r="4" fill="#AAB4E0"></circle></g>`;
  let craters = '';
  [[120, 930, 46], [330, 960, 30], [560, 940, 52], [820, 955, 38], [930, 915, 26], [460, 850, 24], [240, 845, 30]].forEach(([x, y, r]) => { craters += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 0.32)}" fill="#525C8F"></ellipse><ellipse cx="${x}" cy="${y - 3}" rx="${r1(r * 0.8)}" ry="${r1(r * 0.22)}" fill="#47507F"></ellipse>`; });
  const rocket = `<g transform="translate(680 880)">
<path d="M-50 0 L-40-150 M50 0 L40-150 M-46-40 L44-80 M-44-80 L42-120 M46-40 L-44-80" stroke="#9AA0B5" stroke-width="5"></path><rect x="-60" y="-6" width="120" height="14" rx="4" fill="#7C84A8"></rect>
<path d="M-22-20 L-46 0 L-46-40 L-22-62z M22-20 L46 0 L46-40 L22-62z" fill="#E5484D"></path>
<path d="M-24-12 L-24-140 C-24-176 0-206 0-206 C0-206 24-176 24-140 L24-12z" fill="#F8F9FF" stroke="#C5CAE9" stroke-width="3"></path>
<path d="M-17-170 C-10-190 0-206 0-206 C0-206 10-190 17-170z" fill="#E5484D"></path>
<circle cx="0" cy="-120" r="12" fill="#4DABF7" stroke="#2B3A67" stroke-width="4"></circle><rect x="-24" y="-60" width="48" height="8" fill="#E5484D"></rect></g>`;
  const astro = `<g transform="translate(410 900)">
<path d="M60 0 V-110" stroke="#C5CAE9" stroke-width="4"></path><path d="M62-110 h52 v32 h-52z" fill="#6D63FF"></path>${star5(88, -94, 10, '#FFC93C')}
<rect x="-30" y="-74" width="20" height="40" rx="6" fill="#DDE1F5"></rect>
<rect x="-18" y="-30" width="13" height="30" rx="5" fill="#F8F9FF"></rect><rect x="5" y="-30" width="13" height="30" rx="5" fill="#F8F9FF"></rect>
<rect x="-20" y="-78" width="40" height="52" rx="14" fill="#F8F9FF"></rect><path d="M18-68 L44-88" stroke="#F8F9FF" stroke-width="11" stroke-linecap="round"></path><path d="M-18-66 L-30-40" stroke="#F8F9FF" stroke-width="11" stroke-linecap="round"></path>
<circle cx="0" cy="-98" r="22" fill="#F8F9FF"></circle><ellipse cx="3" cy="-98" rx="15" ry="11" fill="#FFC93C"></ellipse><ellipse cx="-2" cy="-102" rx="5" ry="3" fill="#FFF3C4"></ellipse>
<rect x="-10" y="-62" width="20" height="10" rx="3" fill="#6D63FF"></rect></g>`;
  const dome = `<g transform="translate(170 835)"><rect x="-50" y="0" width="100" height="40" fill="#B8BEDD"></rect><path d="M-54 0 a54 54 0 0 1 108 0z" fill="#D6DAF0"></path><path d="M-6-52 h12 v52 h-12z" fill="#3B4270"></path><rect x="-30" y="12" width="14" height="14" rx="3" fill="#7C84A8"></rect></g>`;
  return {
    ground: `${planet}${moonlet}<path d="M0 820 Q 150 780 300 805 T 600 790 T 1000 800 V1000 H0z" fill="#8D96C4"></path>${dome}${rocket}
<path d="M0 905 Q 250 865 500 895 T 1000 885 V1000 H0z" fill="#636DA0"></path>${craters}${astro}`,
    day: '',
    glow: `<rect x="134" y="847" width="14" height="14" rx="3" fill="#FFE066"></rect><circle cx="680" cy="760" r="9" fill="#FFE066"></circle><g transform="translate(330 430) rotate(-28)"><path d="M0 0 L-140 0" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".55"></path><circle r="8" fill="#FFFFFF"></circle></g>`,
  };
}
const LANDS = { sky: skyLand(), blossom: blossomLand(), unicorn: unicornLand(), hero: heroLand(), dino: dinoLand(), space: spaceLand() };

const T = 'transition:{{ sc.dur }}';
// Things in the sky that sit behind the ground (rainbows), then the ground, then night lights.
export function landscape(sid) {
  let behind = '', ground = '', day = '', glow = '', drift = '', seq = '';
  for (const [id, L] of Object.entries(LANDS)) {
    if (L.drift) drift += show(id, L.drift);
    // Night lights that come on one by one (and go off one by one in the morning).
    if (L.seq) seq += show(id, L.seq.map((el, i) => `<g style="opacity:{{ sc.glow }};transition:opacity 0.8s ease calc({{ sc.stag }} * ${(0.3 + (i * 2.6) / L.seq.length).toFixed(2)}s)">${el}</g>`).join(''));
    if (L.behind) behind += show(id, L.day);
    else if (L.day) day += show(id, L.day);
    ground += show(id, L.ground.replace(/win-ID/g, 'win-' + sid).replace(/dots-ID/g, 'dots-' + sid));
    if (L.glow) glow += show(id, L.glow);
  }
  const defs = `<defs><pattern id="win-${sid}" width="22" height="26" patternUnits="userSpaceOnUse"><rect x="6" y="6" width="10" height="13" rx="2" fill="#5B6DA6"></rect></pattern><pattern id="dots-${sid}" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="3" fill="#FFFFFF"></circle><circle cx="12" cy="12" r="3" fill="#FFFFFF"></circle></pattern></defs>`;
  return `${defs}<g style="opacity:{{ sc.dayO }};${T}">${behind}</g>
<g style="filter:brightness({{ sc.lum }}) saturate({{ sc.sat }});${T}">${ground}</g>
<g style="opacity:{{ sc.dayO }};${T}">${day}</g>
<g style="opacity:{{ sc.glow }};${T}">${glow}</g>${seq}
<g style="opacity:{{ sc.dayO }};transform:translateY({{ sc.sink }}px);transition:opacity 2.5s ease, transform calc(0.4s + {{ sc.stag }} * 2.6s) ease-in-out">${drift}</g>`;
}

// ---------- corner props (200 × 200) ----------
const CORNERS = {
  sky: {
    // The balloon lands for the night with the others.
    tr: `<g style="opacity:{{ sc.dayO }};transform:translateY(calc({{ sc.sink }}px * 0.25));transition:opacity 2.5s ease, transform 2.6s ease-in-out">${balloon(110, 92, 1.25)}</g>${cloudPuff(60, 170, 0.7, '#FFFFFF', '#E3EEFF')}`,
    bl: `${cloudPuff(90, 150, 1.5, '#FFFFFF', '#E3EEFF')}${cloudPuff(150, 110, 0.8, '#FFFFFF', '#E3EEFF')}`,
  },
  blossom: {
    tr: `<path d="M205-5 C160 30 120 40 40 70 M150 30 C140 60 120 80 110 110 M95 52 C80 40 60 30 40 28" stroke="#7A4A2E" stroke-width="9" fill="none" stroke-linecap="round"></path>
<ellipse cx="128" cy="60" rx="10" ry="5" fill="#66BB6A" transform="rotate(30 128 60)"></ellipse><ellipse cx="70" cy="42" rx="10" ry="5" fill="#66BB6A" transform="rotate(-20 70 42)"></ellipse>
${flower(40, 70, 26, '#FFB3CF', '#FFE066', '#FF6F9F')}${flower(110, 112, 22, '#FFC9DD', '#FFE066', '#FF6F9F')}${flower(160, 26, 24, '#FF9EC4', '#FFE066', '#E8436E')}${flower(40, 28, 16, '#FFC9DD', '#FFE066')}${flower(92, 50, 14, '#FFB3CF', '#FFE066')}`,
    bl: `${tulip(40, 205, 90, '#E8436E')}${tulip(80, 205, 120, '#FF8FB8')}${tulip(122, 205, 80, '#FFC93C')}${tulip(156, 205, 105, '#B57EDC')}`,
  },
  unicorn: {
    tr: `${['#FF8FA3', '#FFB86B', '#FFE16B', '#8FE3A8', '#8EC5FF', '#C8A2FF'].map((c, i) => `<path d="M${20 + i * 11} 150 A ${80 - i * 11} ${80 - i * 11} 0 0 1 ${180 - i * 11} 150" stroke="${c}" stroke-width="11" fill="none"></path>`).join('')}${cloudPuff(30, 152, 0.55, '#FFFFFF', '#F1E8FF')}${cloudPuff(172, 152, 0.55, '#FFFFFF', '#F1E8FF')}`,
    bl: `${star4(70, 110, 4.5, '#FFD36E')}${star4(140, 60, 2.4, '#FF8FC8')}${star4(150, 150, 2, '#8EC5FF')}${star4(35, 40, 1.6, '#C8A2FF')}${star5(110, 170, 16, '#FFE16B', '#D69E2E')}`,
  },
  hero: {
    tr: `${burst(100, 92, 96, 58, 12, '#FFC21A', '#111C3A', 8)}${burst(100, 92, 64, 44, 10, '#D3242C', '#111C3A')}<text x="100" y="108" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="46" fill="#FFFFFF" stroke="#111C3A" stroke-width="3" paint-order="stroke">ZAP!</text>`,
    bl: `${burst(96, 110, 86, 54, 11, '#FFFFFF', '#111C3A', 4)}${burst(96, 110, 58, 40, 9, '#1D4ED8', '#111C3A')}<text x="96" y="124" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="40" fill="#FFC21A" stroke="#111C3A" stroke-width="3" paint-order="stroke">POW!</text>`,
  },
  dino: {
    tr: `${pterosaur(108, 92, 2.4, '#6D4C41')}<path transform="translate(108 92) scale(2.4)" d="M-12 4 L-4 2 L8 6 L-2 7z" fill="#A1887F"></path><circle cx="178" cy="83" r="3" fill="#FFFFFF"></circle>`,
    bl: `${fern(40, 215, 190, 25, '#2E7D32')}${fern(95, 215, 150, 5, '#43A047')}${fern(150, 215, 110, -18, '#66BB6A')}`,
  },
  space: {
    tr: `<g transform="translate(108 96)"><ellipse rx="92" ry="22" fill="none" stroke="#C9B6FF" stroke-width="8" transform="rotate(-18)"></ellipse><circle r="52" fill="#8E7CFF"></circle><path d="M-50-14 Q0-2 50-16 L52-2 Q0 10-52 2z M-42 22 Q0 30 44 18 L38 32 Q0 40-34 34z" fill="#6D5BEF"></path><circle cx="-18" cy="-22" r="9" fill="#A99BFF"></circle><path d="M-92 0 A 92 22 0 0 0 92 0" fill="none" stroke="#C9B6FF" stroke-width="8" transform="rotate(-18)"></path></g>${star4(28, 180, 1.4, '#FFE066')}`,
    bl: `<g transform="translate(100 120) rotate(-10)"><path d="M-30 18 L-50 70 M0 22 L0 76 M30 18 L50 70" stroke="#FFE066" stroke-width="5" stroke-linecap="round" opacity=".7"></path><ellipse rx="80" ry="24" fill="#9AA3C7"></ellipse><ellipse cy="-6" rx="80" ry="16" fill="#C9CEE8"></ellipse><path d="M-38-12 a38 34 0 0 1 76 0z" fill="#A5F3FC" stroke="#67B8C4" stroke-width="3"></path><g fill="#FFC93C"><circle cx="-52" cy="6" r="6"></circle><circle cx="-20" cy="12" r="6"></circle><circle cx="20" cy="12" r="6"></circle><circle cx="52" cy="6" r="6"></circle></g></g>`,
  },
};

export function corners(z) {
  const s = Math.round(Math.min(z.W, z.H) * (z.phone ? 0.26 : 0.22));
  let tr = '', bl = '';
  for (const [id, c] of Object.entries(CORNERS)) { tr += show(id, c.tr); bl += show(id, c.bl); }
  const st = `position:absolute;width:${s}px;height:${s}px;overflow:visible;filter:brightness({{ sc.lumP }});${T}`;
  return `<svg aria-hidden="true" viewBox="0 0 200 200" style="${st};right:${Math.round(s * 0.02)}px;top:${Math.round(s * 0.02)}px">${tr}</svg>
<svg aria-hidden="true" viewBox="0 0 200 200" style="${st};left:0;bottom:0">${bl}</svg>`;
}

// ---------- clock-ring shapes (clock viewBox 240, centre 120) ----------
// The ring shape replaces the plain disc behind the 0–55 minutes. It is filled
// with th.soft, so the minute numbers keep the contrast checked in check.mjs.
// When helpers are off the face grows over it and only the edge peeks out.
export function ringDress(c) {
  const at = (deg, r) => [r1(c + r * Math.sin(deg * Math.PI / 180)), r1(c - r * Math.cos(deg * Math.PI / 180))];
  const soft = '{{ th.soft }}';
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
  return show('sky', sky) + show('blossom', blossom) + show('unicorn', unicorn) + show('hero', hero) + show('dino', dino) + show('space', space);
}

// ---------- picker badges (100 × 100), one big picture per look ----------
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
export function badge(size, holeObj) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible">${Object.entries(BADGES).map(([id, art]) => `<g style="display:{{ ${holeObj}.${id} }}">${art}</g>`).join('')}</svg>`;
}

// Small motifs scattered at the screen corners (24 × 24).
export const MOTIFS = {
  sky: 'M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.6 4.7 4.7 0 0 1 18.3 19z',
  blossom: 'M12 2.5c1.6 0 2.7 1.6 2.4 3.6 1.7-1 3.6-.6 4.2.9.5 1.5-.6 3.1-2.5 3.6 1.7 1 2.2 3 1.2 4.2-1 1.2-2.9 1-4.2-.5-.4 2-1.8 3.3-3.3 3-1.5-.4-2.1-2.2-1.4-4.1-1.9.5-3.6-.4-3.8-2-.2-1.5 1.3-2.8 3.3-2.8-1.3-1.5-1.3-3.4 0-4.2 1.2-.8 2.9-.1 3.7 1.6.1-1.9.9-3.3 2.4-3.3z',
  unicorn: 'M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z',
  hero: 'M13.5 2L4 13.5h6.5L9 22l11-12.5h-6.8z',
  dino: 'M12 22c-3 0-5-2-5-4.5 0-2.3 2.2-4 5-4s5 1.7 5 4c0 2.5-2 4.5-5 4.5zM5.5 12.5c-1.3 0-2.5-1.5-2.5-3.3S4 6 5.3 6s2.4 1.5 2.4 3.3-.9 3.2-2.2 3.2zM12 10c-1.4 0-2.4-1.6-2.4-3.6S10.6 2.8 12 2.8s2.4 1.6 2.4 3.6S13.4 10 12 10zm6.5 2.5c-1.3 0-2.2-1.4-2.2-3.2S17.4 6 18.7 6 21 7.5 21 9.3s-1.2 3.2-2.5 3.2z',
  space: 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z',
};
