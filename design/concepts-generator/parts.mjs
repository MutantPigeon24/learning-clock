// Shared pieces for the Learning Clock concept artboards.

export const THEMES = [
  { id: 'sky', name: 'Sky', card: '#FFFFFF', ink: '#0B2545', sub: '#3D5A80', accent: '#1A64C8', onAccent: '#FFFFFF', soft: '#DCEBFF', softInk: '#0B2545', face: '#FFFFFF', rim: '#1A64C8', tick: '#0B2545', num: '#0B2545', hc: '#B23B0B', mc: '#6741D9', deco: '#FFFFFF', edge: '#0F4A99', body: '#5AA9F2', motif: 'M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.6 4.7 4.7 0 0 1 18.3 19z' },
  { id: 'blossom', name: 'Blossom', card: '#FFFFFF', ink: '#4A0D2E', sub: '#7A2E55', accent: '#C2185B', onAccent: '#FFFFFF', soft: '#FFE1EE', softInk: '#4A0D2E', face: '#FFF7FB', rim: '#E0457B', tick: '#4A0D2E', num: '#4A0D2E', hc: '#A61E4D', mc: '#0A6B66', deco: '#FF8FB8', edge: '#8E1243', body: '#F48FB1', motif: 'M12 21s-7.5-4.6-9.6-9.1C1 8.6 3 5 6.5 5c2.1 0 3.7 1.2 5.5 3.2C13.8 6.2 15.4 5 17.5 5 21 5 23 8.6 21.6 11.9 19.5 16.4 12 21 12 21z' },
  { id: 'unicorn', name: 'Unicorn', card: '#FFFFFF', ink: '#35155D', sub: '#5B3A8C', accent: '#7C3AED', onAccent: '#FFFFFF', soft: '#EFE5FF', softInk: '#35155D', face: '#FFFFFF', rim: '#B48CF2', tick: '#35155D', num: '#35155D', hc: '#C2255C', mc: '#1864AB', deco: '#FFE066', edge: '#5B21B6', body: '#F3EDFF', motif: 'M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z' },
  { id: 'hero', name: 'Hero', card: '#FFFFFF', ink: '#111C3A', sub: '#34416B', accent: '#D3242C', onAccent: '#FFFFFF', soft: '#FFF0C2', softInk: '#111C3A', face: '#FFFFFF', rim: '#F2B705', tick: '#111C3A', num: '#111C3A', hc: '#C92A2A', mc: '#1D4ED8', deco: '#FFC21A', edge: '#8F1219', body: '#3B6FE0', motif: 'M13.5 2L4 13.5h6.5L9 22l11-12.5h-6.8z' },
  { id: 'dino', name: 'Dino', card: '#FFFFFF', ink: '#173A1E', sub: '#2F5D36', accent: '#2E7D32', onAccent: '#FFFFFF', soft: '#E2F3D5', softInk: '#173A1E', face: '#FFFDF5', rim: '#5FAE4E', tick: '#173A1E', num: '#173A1E', hc: '#B23B0B', mc: '#1D4ED8', deco: '#7CC46A', edge: '#1B5E20', body: '#6CC05C', motif: 'M4 20C4 10 10 4 21 3c-.5 11-7 17-17 17z' },
  { id: 'space', name: 'Space', dark: true, card: '#1E1B4B', ink: '#FFFFFF', sub: '#C7C9F5', accent: '#FFC93C', onAccent: '#1E1B4B', soft: '#312E81', softInk: '#FFFFFF', face: '#FFFFFF', rim: '#6D63FF', tick: '#1E1B4B', num: '#1E1B4B', hc: '#B23B0B', mc: '#3B5BDB', hcT: '#FFA94D', mcT: '#A5B4FF', deco: '#FFC93C', edge: '#0F0C33', body: '#8E87FF', motif: 'M12 2c3.2 2.2 5 6 5 10l-2 4H9l-2-4c0-4 1.8-7.8 5-10zM9 16l-3 4.5 4.5-1.5zM15 16l3 4.5-4.5-1.5z' },
];

// Hour and minute colour pairs a child can pick instead of the theme's own.
// h/m sit on light cards and the clock face; hL/mL are for dark cards.
export const PAIRS = [
  { id: 'theme', name: 'Match the look' },
  { id: 'red-blue', name: 'Red and blue', h: '#C92A2A', m: '#1D4ED8', hL: '#FF8787', mL: '#91A7FF' },
  { id: 'orange-purple', name: 'Orange and purple', h: '#B23B0B', m: '#6741D9', hL: '#FFA94D', mL: '#B197FC' },
  { id: 'pink-teal', name: 'Pink and teal', h: '#C2255C', m: '#0A6B66', hL: '#F783AC', mL: '#63E6BE' },
  { id: 'purple-orange', name: 'Purple and orange', h: '#6741D9', m: '#B23B0B', hL: '#B197FC', mL: '#FFA94D' },
];

export const SCENES = {
  sunrise: { top: '#FF9E8A', bot: '#FFE1B0', orb: '#FF7A3D', ox: 290, oy: 800, os: 1.1, h1: '#F2A65A', h2: '#E07A4F', stars: 0, moon: 0, cloud: 0.5 },
  day: { top: '#4FAEF5', bot: '#CDEBFF', orb: '#FFD43B', ox: 700, oy: 470, os: 1, h1: '#8BD17C', h2: '#5BAF5B', stars: 0, moon: 0, cloud: 1 },
  sunset: { top: '#5B3A8E', bot: '#FF9254', orb: '#FF5E3A', ox: 700, oy: 820, os: 1.25, h1: '#7A3F6E', h2: '#4E2A57', stars: 0.25, moon: 0, cloud: 0 },
  night: { top: '#0B1035', bot: '#27306E', orb: '#F4F1C9', ox: 690, oy: 480, os: 0.8, h1: '#1C2456', h2: '#111739', stars: 1, moon: 1, cloud: 0 },
};

export const FRAMES = [
  { id: 'L', W: 1280, H: 800, label: 'Tablet · landscape · 1280 × 800' },
  { id: 'P', W: 800, H: 1280, label: 'Tablet · portrait · 800 × 1280' },
  { id: 'A', W: 915, H: 412, label: 'Phone · landscape · 915 × 412' },
  { id: 'B', W: 412, H: 915, label: 'Phone · portrait · 412 × 915' },
  { id: 'D', W: 1440, H: 900, label: 'Desktop · browser window · 1440 × 900' },
];

export function sizes(W, H) {
  const S = Math.min(W, H) / 800;
  const r = (v) => Math.round(v);
  return {
    W, H, S, wide: W / H >= 1.2, phone: Math.min(W, H) < 500,
    pad: r(Math.max(14, 32 * S)), gap: r(Math.max(10, 22 * S)), btn: r(Math.max(52, 84 * S)),
    small: r(Math.max(48, 60 * S)), fs: r(Math.max(18, 36 * S)), fd: r(Math.max(30, 72 * S)),
    fl: r(Math.max(14, 20 * S)), r: r(Math.max(16, 28 * S)), ampH: r(Math.max(48, 64 * S)),
    cp: r(Math.max(12, 24 * S)), chip: r(Math.max(14, 18 * S)),
  };
}

// Height of the sentence card for a given width, conservatively.
export function wordsH(z, width, fs = z.fs, cp = z.cp) {
  const lines = Math.max(1, Math.ceil((fs * 0.53 * 42) / Math.max(60, width - 2 * cp)));
  return Math.round(lines * fs * 1.3 + 2 * cp);
}
export function fdFor(z, cardW, cp = z.cp, max = z.fd) {
  const chipW = z.chip * 2.4 + 18;
  return Math.floor(Math.min(max, (cardW - 2 * cp - chipW - 10) / 2.75));
}

const ICONS = {
  speaker: '<path d="M4 9.5v5h4l5 4v-13l-5 4z"></path><path d="M16.5 9.5a3.5 3.5 0 0 1 0 5"></path>',
  speaking: '<path d="M4 9.5v5h4l5 4v-13l-5 4z"></path><path d="M16.5 9.5a3.5 3.5 0 0 1 0 5"></path><path d="M19 7a7 7 0 0 1 0 10"></path>',
  now: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"></path><path d="M3.5 4.5v4.5H8"></path><path d="M12 8v4.2l2.8 1.8"></path>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.7-.8 1.7-1.6 0-1.2-1-1.6-1-2.6 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"></path><circle cx="7.5" cy="11.5" r="1.3"></circle><circle cx="10" cy="7.3" r="1.3"></circle><circle cx="14.8" cy="7.3" r="1.3"></circle>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2.2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"></rect><path d="M3.5 10h17M8 3v4M16 3v4"></path>',
  close: '<path d="M6 6l12 12M18 6L6 18"></path>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"></path>',
  back: '<path d="M9 5h11v14H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>',
  hand: '<path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5.5"></path><path d="M12 10a1.5 1.5 0 0 1 3 0v1.5"></path><path d="M15 10.8a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2l-2.4-3a1.6 1.6 0 0 1 2.4-2.1L9 15"></path>',
};
export function icon(name, size, sw = 2.4) {
  const s = Math.round(size);
  return `<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${ICONS[name]}</svg>`;
}

// The analog clock. Hands and colours are holes, so every frame follows one state.
export function clock(size, o = {}) {
  const ring = o.ring !== false;
  const vb = ring ? 240 : 200, c = vb / 2, R = 96;
  const rimW = o.rimW || 8;
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const bold = i % 5 === 0;
    ticks += `<line x1="${c}" y1="${c - R + 4}" x2="${c}" y2="${c - R + (bold ? 15 : 9)}" stroke-width="${bold ? 3.4 : 1.5}" transform="rotate(${i * 6} ${c} ${c})"></line>`;
  }
  let nums = '';
  for (let n = 1; n <= 12; n++) {
    const a = (n * 30 * Math.PI) / 180, rr = R - 31;
    nums += `<text x="${(c + rr * Math.sin(a)).toFixed(1)}" y="${(c - rr * Math.cos(a)).toFixed(1)}" text-anchor="middle" dominant-baseline="central">${n}</text>`;
  }
  let ringNums = '';
  if (ring) {
    for (let k = 0; k < 12; k++) {
      const a = (k * 30 * Math.PI) / 180, rr = R + 13;
      ringNums += `<text x="${(c + rr * Math.sin(a)).toFixed(1)}" y="${(c - rr * Math.cos(a)).toFixed(1)}" text-anchor="middle" dominant-baseline="central">${k * 5}</text>`;
    }
  }
  const hourC = o.hourC || '{{ lf.h }}', minC = o.minC || '{{ lf.m }}';
  const numC = o.numC || '{{ lf.h }}';
  return `<svg width="${Math.round(size)}" height="${Math.round(size)}" viewBox="0 0 ${vb} ${vb}" role="group" aria-label="{{ t.aria }}" onPointerDown="{{ onDown }}" onPointerMove="{{ onMove }}" onPointerUp="{{ onUp }}" onPointerCancel="{{ onUp }}" style="display:block;flex:none;touch-action:none;cursor:grab;user-select:none">
${ring ? `<g style="display:{{ ck.ring }}"><circle cx="${c}" cy="${c}" r="${c - 2}" style="fill:{{ th.soft }}"></circle><g style="fill:{{ lk.m }}" font-size="13" font-weight="800">${ringNums}</g></g>` : ''}
<g transform="${ring ? '{{ ck.tf }}' : 'translate(0 0)'}">
${o.shadow !== false ? `<circle cx="${c}" cy="${c + 4}" r="${R}" fill="rgba(0,0,0,.18)"></circle>` : ''}
<circle cx="${c}" cy="${c}" r="${R - rimW / 2}" stroke-width="${rimW}" style="fill:{{ th.face }};stroke:${o.rimC || '{{ th.rim }}'}"></circle>
${o.double ? `<circle cx="${c}" cy="${c}" r="${R - rimW - 3}" fill="none" stroke-width="2" stroke-dasharray="3 5" style="stroke:{{ th.rim }}"></circle>` : ''}
<g style="stroke:{{ th.tick }}" stroke-linecap="round">${ticks}</g>
<g style="fill:${numC}" font-size="${o.numSize || 19}" font-weight="800">${nums}</g>
<g transform="rotate({{ hz.hour }} ${c} ${c})"><line x1="${c}" y1="${c + 10}" x2="${c}" y2="${c - 50}" stroke-width="11" stroke-linecap="round" style="stroke:${hourC}"></line></g>
<g transform="rotate({{ hz.min }} ${c} ${c})"><line x1="${c}" y1="${c + 14}" x2="${c}" y2="${c - 80}" stroke-width="6.5" stroke-linecap="round" style="stroke:${minC}"></line></g>
<circle cx="${c}" cy="${c}" r="8" style="fill:${hourC}"></circle><circle cx="${c}" cy="${c}" r="3" fill="#FFFFFF"></circle>
</g>
</svg>`;
}

export function scene(id) {
  let stars = '';
  const pts = [[230, 420], [330, 520], [420, 400], [520, 470], [600, 560], [780, 410], [840, 540], [300, 640], [460, 610], [560, 380], [760, 640], [250, 560], [880, 450], [650, 450]];
  pts.forEach(([x, y], i) => { stars += `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 4 : 2.5}" fill="#FFFFFF"></circle>`; });
  const t = 'transition:{{ sc.dur }}';
  return `<svg aria-hidden="true" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax slice" style="position:absolute;inset:0;width:100%;height:100%;display:block">
<defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" style="stop-color:{{ sc.top }};${t}"></stop><stop offset="1" style="stop-color:{{ sc.bot }};${t}"></stop></linearGradient></defs>
<rect width="1000" height="1000" fill="url(#sky-${id})"></rect>
<g style="opacity:{{ sc.stars }};${t}">${stars}</g>
<g style="transform:translate({{ sc.ox }}px, {{ sc.oy }}px) scale({{ sc.os }});${t}"><circle r="62" style="fill:{{ sc.orb }};${t}"></circle><circle cx="22" cy="-14" r="54" style="fill:{{ sc.top }};opacity:{{ sc.moon }};${t}"></circle></g>
<g style="opacity:{{ sc.cloud }};${t}" fill="#FFFFFF"><ellipse cx="300" cy="520" rx="70" ry="26"></ellipse><ellipse cx="335" cy="500" rx="42" ry="30"></ellipse><ellipse cx="540" cy="420" rx="56" ry="20"></ellipse><ellipse cx="566" cy="404" rx="32" ry="24"></ellipse></g>
<path d="M0 860 Q 250 760 500 840 T 1000 820 V1000 H0z" style="fill:{{ sc.h1 }};${t}"></path>
<path d="M0 925 Q 300 845 620 915 T 1000 905 V1000 H0z" style="fill:{{ sc.h2 }};${t}"></path>
</svg>`;
}

// Theme decorations, placed in % so they follow any screen shape.
export function deco(z, spots) {
  return spots.map(([x, y, s, rot]) => {
    const px = Math.round(s * Math.max(0.6, z.S));
    return `<svg aria-hidden="true" width="${px}" height="${px}" viewBox="0 0 24 24" style="position:absolute;left:${x}%;top:${y}%;transform:rotate(${rot}deg);opacity:.9"><path d="{{ th.motif }}" style="fill:{{ th.deco }}"></path></svg>`;
  }).join('');
}

export const lab = (txt, fs) => `<span style="font-size:${fs}px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:{{ th.sub }}">${txt}</span>`;

export function digits12(fd, z, o = {}) {
  const cf = Math.round(Math.max(13, fd * 0.26));
  const num = o.link !== false
    ? `<span style="color:{{ lk.h }}">{{ t.h12 }}</span>:<span style="color:{{ lk.m }}">{{ t.mm }}</span>`
    : '{{ t.d12 }}';
  return `<div style="display:flex;align-items:center;gap:${Math.round(fd * 0.16)}px">
<span style="font-size:${fd}px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;white-space:nowrap${o.color ? ';color:' + o.color : ''}">${num}</span>
<span style="display:flex;flex-direction:${o.row ? 'row' : 'column'};gap:4px">
<span style="padding:2px 9px;border-radius:999px;border:2px solid;font-size:${cf}px;font-weight:800;text-align:center;line-height:1.25;{{ ap.amChip }}">AM</span>
<span style="padding:2px 9px;border-radius:999px;border:2px solid;font-size:${cf}px;font-weight:800;text-align:center;line-height:1.25;{{ ap.pmChip }}">PM</span>
</span></div>`;
}
export function digits24(fd, o = {}) {
  const num = o.link !== false
    ? `<span style="color:{{ lk.h }}">{{ t.h24 }}</span>:<span style="color:{{ lk.m }}">{{ t.mm }}</span>`
    : '{{ t.d24 }}';
  return `<span style="font-size:${fd}px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;white-space:nowrap${o.color ? ';color:' + o.color : ''}">${num}</span>`;
}

// The sentence, with the hour in the hour colour and the minutes in the minute colour.
export const SAY = '<sc-for list="{{ t.parts }}" as="p" hint-placeholder-count="5"><span style="{{ p.style }}">{{ p.tx }}</span></sc-for>';

export function ampm(h, w, z, o = {}) {
  const fs = Math.round(Math.max(18, h * 0.38));
  const r = o.radius ?? Math.round(h / 2);
  const dir = o.vertical ? 'column' : 'row';
  return `<button type="button" onClick="{{ ampm }}" aria-label="AM or PM switch. Showing {{ t.ap }}" style="display:flex;flex-direction:${dir};padding:5px;gap:5px;${o.vertical ? `width:${h}px;height:${w}px` : `height:${h}px;width:${Math.round(w)}px`};box-sizing:border-box;border-radius:${r}px;border:3px solid {{ th.accent }};background:{{ th.card }};cursor:pointer;font-family:inherit;flex:none">
<span style="flex:1;display:flex;align-items:center;justify-content:center;border-radius:${Math.max(6, r - 6)}px;font-size:${fs}px;font-weight:800;{{ ap.am }}">AM</span>
<span style="flex:1;display:flex;align-items:center;justify-content:center;border-radius:${Math.max(6, r - 6)}px;font-size:${fs}px;font-weight:800;{{ ap.pm }}">PM</span>
</button>`;
}

export function speakBtn(sz, z, o = {}) {
  const label = o.label !== false;
  const fs = Math.round(Math.max(17, sz * 0.3));
  return `<button type="button" onClick="{{ speak }}" aria-label="Hear the time" style="height:${sz}px;min-width:${sz}px;${o.grow ? 'flex:1 1 auto;' : 'flex:none;'}${o.w ? `width:${o.w}px;` : ''}padding:0 ${label ? Math.round(sz * 0.32) : 0}px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:${Math.round(sz * 0.14)}px;border:none;border-radius:${o.radius ?? Math.round(sz / 2)}px;background:{{ th.accent }};color:{{ th.onAccent }};font-family:inherit;font-size:${fs}px;font-weight:800;white-space:nowrap;cursor:pointer;${o.extra || ''}">
<sc-if value="{{ speaking }}" hint-placeholder-val="{{ false }}">${icon('speaking', sz * 0.52)}${label ? '<span>Speaking</span>' : ''}</sc-if>
<sc-if value="{{ notSpeaking }}" hint-placeholder-val="{{ true }}">${icon('speaker', sz * 0.52)}${label ? '<span>Hear it</span>' : ''}</sc-if>
</button>`;
}

export function nowBtn(sz, z, o = {}) {
  const label = o.label !== false;
  const fs = Math.round(Math.max(16, sz * 0.27));
  return `<sc-if value="{{ isSet }}" hint-placeholder-val="{{ false }}"><button type="button" onClick="{{ now }}" aria-label="Back to the real time" style="height:${sz}px;min-width:${sz}px;flex:none;padding:0 ${label ? Math.round(sz * 0.26) : 0}px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:${Math.round(sz * 0.1)}px;border:${Math.max(3, Math.round(sz * 0.05))}px solid {{ th.accent }};border-radius:${o.radius ?? Math.round(sz / 2)}px;background:{{ th.card }};color:{{ th.ink }};font-family:inherit;font-size:${fs}px;font-weight:800;white-space:nowrap;cursor:pointer;${o.extra || ''}">${icon('now', sz * 0.5)}${label ? '<span>Now</span>' : ''}</button></sc-if>`;
}

export function iconBtn(name, sz, aria, handler, o = {}) {
  return `<button type="button" onClick="{{ ${handler} }}" aria-label="${aria}" style="width:${sz}px;height:${sz}px;flex:none;display:flex;align-items:center;justify-content:center;padding:0;border:none;border-radius:${o.radius ?? Math.round(sz / 2)}px;background:${o.bg || '{{ th.card }}'};color:${o.color || '{{ th.accent }}'};cursor:pointer;${o.extra || ''}">${icon(name, sz * (o.k || 0.5))}</button>`;
}
export const themeBtn = (f, sz, o = {}) => `<sc-if value="{{ canTheme }}" hint-placeholder-val="{{ true }}">${iconBtn('palette', sz, 'Change the look', `ov.${f}.openTheme`, o)}</sc-if>`;
export const lockBtn = (f, sz, o = {}) => iconBtn('lock', sz, 'Grown-up settings', `ov.${f}.openGate`, { color: '{{ th.sub }}', k: 0.44, ...o });
export const calBtn = (sz, o = {}) => iconBtn('calendar', sz, 'Calendar, coming later', 'cal', o);

export function chip(z, o = {}) {
  const h = o.h || Math.round(Math.max(36, 48 * z.S));
  const fs = Math.round(Math.max(14, h * 0.36));
  return `<div style="display:inline-flex;align-items:center;gap:8px;height:${h}px;padding:0 ${Math.round(h * 0.4)}px;box-sizing:border-box;border-radius:999px;background:{{ th.card }};color:{{ th.ink }};font-weight:800;font-size:${fs}px;flex:none;white-space:nowrap">
<sc-if value="{{ isLive }}" hint-placeholder-val="{{ true }}"><span aria-hidden="true" style="width:${Math.round(fs * 0.7)}px;height:${Math.round(fs * 0.7)}px;border-radius:50%;background:#1F9D55;flex:none"></span><span>Real time</span></sc-if>
<sc-if value="{{ isSet }}" hint-placeholder-val="{{ false }}">${icon('hand', fs * 1.3, 2.2)}<span>My time</span></sc-if>
</div>`;
}

// Child look picker, grown-up check and grown-up settings, for one frame.
export function overlays(f, z, gate) {
  const small = z.phone;
  const pw = Math.min(z.W - 2 * z.pad, z.wide ? 760 * Math.max(z.S, 0.8) : 680);
  const head = (title, ic) => `<div style="display:flex;align-items:center;gap:12px">
<span style="color:{{ th.accent }};display:flex">${icon(ic, small ? 26 : 36)}</span>
<h2 style="margin:0;flex:1;font-size:${small ? 20 : 30}px;line-height:1.15;font-weight:800">${title}</h2>
${iconBtn('close', small ? 48 : 60, 'Close', 'close', { bg: '{{ th.soft }}', color: '{{ th.softInk }}' })}
</div>`;
  const shell = (flag, aria, inner) => `<sc-if value="{{ ov.${f}.${flag} }}" hint-placeholder-val="{{ false }}"><div style="position:absolute;inset:0;z-index:30;background:rgba(10,14,30,.55);display:flex;align-items:center;justify-content:center;padding:${z.pad}px;box-sizing:border-box">
<div role="dialog" aria-modal="true" aria-label="${aria}" style="width:100%;max-width:${Math.round(pw)}px;max-height:100%;overflow:auto;box-sizing:border-box;background:{{ th.card }};color:{{ th.ink }};border-radius:${small ? 20 : 32}px;padding:${small ? 16 : 28}px;display:flex;flex-direction:column;gap:${small ? 12 : 22}px;box-shadow:0 18px 50px rgba(0,0,0,.35)">${inner}</div></div></sc-if>`;

  const cols = z.wide && small ? 6 : 3;
  const mini = small ? (z.wide ? 54 : 64) : 104;
  const themeInner = `${head('Pick a look', 'palette')}
<div style="display:grid;grid-template-columns:repeat(${cols}, minmax(0, 1fr));gap:${small ? 8 : 16}px">
<sc-for list="{{ themes }}" as="it" hint-placeholder-count="6"><button type="button" onClick="{{ it.pick }}" aria-pressed="{{ it.sel }}" aria-label="{{ it.name }} look" style="display:flex;flex-direction:column;align-items:center;gap:${small ? 4 : 10}px;padding:${small ? 8 : 16}px 4px;border-radius:${small ? 16 : 24}px;border:4px solid;cursor:pointer;font-family:inherit;position:relative;{{ it.tile }}">
<svg aria-hidden="true" width="${mini}" height="${mini}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke-width="7" style="fill:{{ it.face }};stroke:{{ it.rim }}"></circle><line x1="50" y1="50" x2="31" y2="35" stroke-width="8" stroke-linecap="round" style="stroke:{{ it.hour }}"></line><line x1="50" y1="50" x2="74" y2="26" stroke-width="5" stroke-linecap="round" style="stroke:{{ it.minute }}"></line><g transform="translate(66 64) scale(1.25)"><path d="{{ it.motif }}" style="{{ it.motifS }}"></path></g></svg>
<span style="font-size:${small ? 15 : 22}px;font-weight:800">{{ it.name }}</span>
</button></sc-for>
</div>
<sc-if value="{{ helpersOn }}" hint-placeholder-val="{{ true }}"><h3 style="margin:0;font-size:${small ? 17 : 24}px;font-weight:800">Hour and minute colours</h3>
<div style="display:grid;grid-template-columns:repeat(${z.wide && small ? 5 : (small ? 3 : 5)}, minmax(0, 1fr));gap:${small ? 8 : 12}px">
<sc-for list="{{ pairs }}" as="pp" hint-placeholder-count="5"><button type="button" onClick="{{ pp.pick }}" aria-pressed="{{ pp.sel }}" aria-label="{{ pp.name }}" style="display:flex;flex-direction:column;align-items:center;gap:${small ? 4 : 8}px;padding:${small ? 8 : 12}px 4px;min-height:${small ? 64 : 96}px;border-radius:${small ? 14 : 20}px;border:4px solid;cursor:pointer;font-family:inherit;{{ pp.tile }}">
<svg aria-hidden="true" width="${small ? 44 : 64}" height="${small ? 24 : 32}" viewBox="0 0 64 32"><line x1="6" y1="10" x2="34" y2="10" stroke-width="9" stroke-linecap="round" style="stroke:{{ pp.h }}"></line><line x1="6" y1="24" x2="58" y2="24" stroke-width="5" stroke-linecap="round" style="stroke:{{ pp.m }}"></line></svg>
<span style="font-size:${small ? 13 : 17}px;font-weight:800;line-height:1.15;text-align:center">{{ pp.name }}</span>
</button></sc-for>
</div></sc-if>`;

  const key = small ? 52 : 68;
  const padCols = z.wide && small ? 6 : 3;
  const pad = `<div style="display:grid;grid-template-columns:repeat(${padCols}, minmax(0, 1fr));gap:${small ? 8 : 12}px;max-width:${padCols === 6 ? 520 : 340}px;width:100%;align-self:center">
<sc-for list="{{ pad }}" as="k" hint-placeholder-count="10"><button type="button" onClick="{{ k.press }}" style="height:${key}px;border-radius:${small ? 14 : 18}px;border:none;background:{{ th.soft }};color:{{ th.softInk }};font-family:inherit;font-size:${small ? 22 : 30}px;font-weight:800;cursor:pointer">{{ k.d }}</button></sc-for>
<button type="button" onClick="{{ del }}" aria-label="Delete" style="height:${key}px;border-radius:${small ? 14 : 18}px;border:none;background:transparent;color:{{ th.ink }};display:flex;align-items:center;justify-content:center;cursor:pointer">${icon('back', small ? 26 : 32)}</button>
</div>`;
  const entry = `<p aria-live="polite" style="margin:0;text-align:center;font-size:${small ? 26 : 38}px;font-weight:800;letter-spacing:.2em;font-variant-numeric:tabular-nums">{{ g.entry }}</p>
<sc-if value="{{ g.wrong }}" hint-placeholder-val="{{ false }}"><p style="margin:0;text-align:center;font-size:${small ? 15 : 19}px;font-weight:700;color:{{ th.sub }}">Not quite. Try again.</p></sc-if>`;
  const tf = small ? 16 : 22;
  let gateBody;
  if (gate === 'hold') {
    const ring = small ? (z.wide ? 120 : 150) : 200;
    gateBody = `<p style="margin:0;font-size:${tf}px;line-height:1.4;font-weight:600;color:{{ th.sub }}">Press and hold the lock for 3 seconds.</p>
<button type="button" onPointerDown="{{ holdStart }}" onPointerUp="{{ holdEnd }}" onPointerLeave="{{ holdEnd }}" onPointerCancel="{{ holdEnd }}" aria-label="Press and hold to open grown-up settings" style="align-self:center;width:${ring}px;height:${ring}px;border-radius:50%;border:none;padding:${Math.round(ring * 0.07)}px;cursor:pointer;touch-action:none;{{ g.holdBg }}"><span style="display:flex;width:100%;height:100%;border-radius:50%;align-items:center;justify-content:center;background:{{ th.card }};color:{{ th.accent }}">${icon('lock', ring * 0.36)}</span></button>
<p style="margin:0;text-align:center;font-size:${small ? 14 : 18}px;font-weight:700;color:{{ th.sub }}">{{ g.holdPct }}%</p>`;
  } else if (gate === 'math') {
    gateBody = `<p style="margin:0;font-size:${tf}px;line-height:1.4;font-weight:600;color:{{ th.sub }}">Answer the times-table question to open the settings.</p>
<p style="margin:0;text-align:center;font-size:${small ? 30 : 46}px;font-weight:800">What is {{ g.q }}?</p>${entry}${pad}`;
  } else {
    gateBody = `<p style="margin:0;font-size:${tf}px;line-height:1.4;font-weight:600;color:{{ th.sub }}">Tap these numbers to open the settings.</p>
<p style="margin:0;text-align:center;font-size:${small ? 26 : 40}px;font-weight:800">{{ g.q }}</p>${entry}${pad}`;
  }
  const gateInner = `${head('For grown-ups', 'lock')}${gateBody}`;

  const setInner = `${head('Grown-up settings', 'lock')}
<sc-for list="{{ prefs }}" as="row" hint-placeholder-count="4"><div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;padding-bottom:${small ? 10 : 16}px;border-bottom:2px solid {{ th.soft }}">
<span style="font-size:${small ? 16 : 21}px;font-weight:700;flex:1 1 200px">{{ row.label }}</span>
<div style="display:flex;gap:8px;flex-wrap:wrap"><sc-for list="{{ row.opts }}" as="op" hint-placeholder-count="2"><button type="button" onClick="{{ op.pick }}" aria-pressed="{{ op.sel }}" style="min-height:48px;padding:0 ${small ? 12 : 18}px;border-radius:999px;border:3px solid;font-family:inherit;font-size:${small ? 15 : 18}px;font-weight:800;cursor:pointer;{{ op.style }}">{{ op.label }}</button></sc-for></div>
</div></sc-for>
<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px">
<span style="font-size:${small ? 16 : 21}px;font-weight:700;flex:1 1 200px">Parts of the day</span>
<span style="font-size:${small ? 14 : 17}px;font-weight:600;color:{{ th.sub }}">Morning 05:00 · Afternoon 12:00 · Evening 17:00 · Night 20:00</span>
</div>
<div style="display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap">
<button type="button" onClick="{{ reset }}" style="min-height:52px;padding:0 20px;border-radius:999px;border:3px solid {{ th.sub }};background:transparent;color:{{ th.ink }};font-family:inherit;font-size:${small ? 16 : 19}px;font-weight:800;cursor:pointer">Reset to defaults</button>
<button type="button" onClick="{{ close }}" style="min-height:52px;padding:0 26px;border-radius:999px;border:none;background:{{ th.accent }};color:{{ th.onAccent }};font-family:inherit;font-size:${small ? 16 : 19}px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:8px">${icon('check', 22)}<span>Done</span></button>
</div>`;

  return shell('theme', 'Pick a look', themeInner) + shell('gate', 'Grown-up check', gateInner) + shell('settings', 'Grown-up settings', setInner);
}

export function toast(z) {
  return `<sc-if value="{{ hasToast }}" hint-placeholder-val="{{ false }}"><div role="status" style="position:absolute;left:50%;bottom:${z.pad + 4}px;transform:translateX(-50%);z-index:40;max-width:80%;padding:${z.phone ? 10 : 16}px ${z.phone ? 16 : 26}px;border-radius:999px;background:{{ th.ink }};color:{{ th.card }};font-size:${z.phone ? 15 : 20}px;font-weight:700;text-align:center">{{ toast }}</div></sc-if>`;
}

// Component logic, shared by every concept.
export function logic(cfg) {
  return `
const THEMES = ${JSON.stringify(THEMES)};
const SCENES = ${JSON.stringify(SCENES)};
const PAIRS = ${JSON.stringify(PAIRS)};
const GATE = '${cfg.gate}';
const DEFAULT_THEME = '${cfg.theme}';
const DEFAULT_TIME = '${cfg.time}';
const LINK_HANDS = ${cfg.linkHands ? 'true' : 'false'};
const HAND_LEN = { on: [0.42, 0.67], off: [0.5, 0.8] };
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const FRAMES = ['L', 'P', 'A', 'B', 'D'];
function norm(x) { return ((Math.round(x) % 1440) + 1440) % 1440; }
function sceneOf(t) { if (t >= 300 && t < 420) return 'sunrise'; if (t >= 420 && t < 1020) return 'day'; if (t >= 1020 && t < 1200) return 'sunset'; return 'night'; }
function partOf(t) { if (t >= 300 && t < 720) return 'in the morning'; if (t >= 720 && t < 1020) return 'in the afternoon'; if (t >= 1020 && t < 1200) return 'in the evening'; return 'at night'; }
function minWord(n) { return n === 1 ? '1 minute' : n + ' minutes'; }
function sayParts(t, style) {
  const h = Math.floor(t / 60), m = t % 60, hr = String((h % 12) || 12), nx = String(((h + 1) % 12) || 12), when = ' ' + partOf(t) + '.';
  if (m === 0 && h === 12) return ['It is ', ['h', '12'], " o'clock midday."];
  if (m === 0 && h === 0) return ['It is ', ['h', '12'], " o'clock midnight."];
  if (m === 0) return ['It is ', ['h', hr], " o'clock" + when];
  if (style === 'quarter') {
    if (m === 15) return ['It is ', ['m', 'quarter'], ' past ', ['h', hr], when];
    if (m === 30) return ['It is ', ['m', 'half'], ' past ', ['h', hr], when];
    if (m === 45) return ['It is ', ['m', 'quarter'], ' to ', ['h', nx], when];
    if (m > 30) return ['It is ', ['m', minWord(60 - m)], ' to ', ['h', nx], when];
  }
  return ['It is ', ['m', minWord(m)], ' past ', ['h', hr], when];
}
class Component extends DCLogic {
  constructor(...args) {
    super(...args);
    this.state = { set: false, mins: 0, drag: null, theme: null, hands: null, helpers: null, ov: null, hold: 0, entry: '', q: '', ans: '', wrong: false, speaking: false, toast: '', style: 'past', speed: 'slow', hemi: 'north', themeLock: false, tick: 0 };
  }
  nowM() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  componentDidMount() {
    this.timer = setInterval(() => { if (!this.state.set) this.setState({ tick: Date.now() }); }, 1000);
    this.applyTime(this.props.time ?? DEFAULT_TIME);
  }
  componentDidUpdate(prev) {
    if (prev.time !== this.props.time) this.applyTime(this.props.time ?? DEFAULT_TIME);
    if (prev.theme !== this.props.theme) this.setState({ theme: null });
    if (prev.hands !== this.props.hands) this.setState({ hands: null });
    if (prev.helpers !== this.props.helpers) this.setState({ helpers: null });
  }
  componentWillUnmount() { clearInterval(this.timer); clearInterval(this.holdT); clearTimeout(this.speakT); clearTimeout(this.toastT); }
  applyTime(v) {
    const m = /^(\\d\\d):(\\d\\d)/.exec(v || '');
    if (m) this.setState({ set: true, mins: Number(m[1]) * 60 + Number(m[2]) });
    else this.setState({ set: false });
  }
  helpersOn() { const v = this.state.helpers; return v === null ? this.props.helpers !== 'off' : v; }
  base() { return this.state.set ? this.state.mins : this.nowM(); }
  pt(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    return { x: x, y: y, ang: (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360 };
  }
  onDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    const p = this.pt(e), b = this.base(), tf = ((b % 1440) + 1440) % 1440;
    const ma = (tf % 60) * 6 * Math.PI / 180, ha = ((tf / 60) % 12) * 30 * Math.PI / 180;
    const dist = (a, len) => { const ux = Math.sin(a), uy = -Math.cos(a); const s = Math.max(0, Math.min(len, p.x * ux + p.y * uy)); return Math.hypot(p.x - ux * s, p.y - uy * s); };
    const hl = this.helpersOn() ? HAND_LEN.on : HAND_LEN.off;
    this.hand = dist(ha, hl[0]) < dist(ma, hl[1]) ? 'h' : 'm';
    this.m = b; this.lastAng = p.ang;
    this.setState({ drag: this.hand, set: true, mins: b });
  }
  onMove(e) {
    if (!this.hand) return;
    e.preventDefault(); e.stopPropagation();
    const p = this.pt(e);
    if (this.hand === 'm') {
      const d = ((p.ang - this.lastAng + 540) % 360) - 180;
      this.m += d / 6; this.lastAng = p.ang;
    } else {
      const tf = norm(this.m), mm = tf % 60, cur = Math.floor(tf / 60) % 12;
      const tgt = ((Math.round(p.ang / 30 - mm / 60) % 12) + 12) % 12;
      const dh = ((tgt - cur + 18) % 12) - 6;
      if (dh !== 0) this.m = Math.round(this.m) + dh * 60;
    }
    this.setState({ mins: this.m });
  }
  onUp() { if (!this.hand) return; this.hand = null; this.setState({ drag: null, mins: Math.round(this.m) }); }
  ampm() { const b = Math.round(this.base()); this.setState({ set: true, mins: b + (norm(b) < 720 ? 720 : -720) }); }
  now() { this.hand = null; this.setState({ set: false, drag: null }); }
  sentence() { return sayParts(norm(this.base()), this.state.style).map(p => typeof p === 'string' ? p : p[1]).join(''); }
  speak() {
    const text = this.sentence();
    clearTimeout(this.speakT);
    try {
      const s = window.speechSynthesis;
      if (s) { s.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = this.state.speed === 'slow' ? 0.8 : 1; u.onend = () => this.setState({ speaking: false }); s.speak(u); }
    } catch (err) {}
    this.setState({ speaking: true });
    this.speakT = setTimeout(() => this.setState({ speaking: false }), 5000);
  }
  open(f, k) {
    const st = { ov: { f: f, k: k }, hold: 0, entry: '', wrong: false };
    if (k === 'gate' && GATE === 'math') { const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4); st.q = a + ' × ' + b; st.ans = String(a * b); }
    if (k === 'gate' && GATE === 'words') { const ds = [0, 0, 0].map(() => 1 + Math.floor(Math.random() * 9)); st.q = ds.map(d => WORDS[d]).join(' · '); st.ans = ds.join(''); }
    this.setState(st);
  }
  close() { clearInterval(this.holdT); this.setState({ ov: null, hold: 0 }); }
  holdStart(e) {
    e.preventDefault(); clearInterval(this.holdT);
    this.holdT = setInterval(() => {
      const h = this.state.hold + 5;
      if (h >= 100) { clearInterval(this.holdT); this.setState({ hold: 0, ov: { f: this.state.ov ? this.state.ov.f : 'L', k: 'settings' } }); }
      else this.setState({ hold: h });
    }, 150);
  }
  holdEnd() { clearInterval(this.holdT); if (this.state.ov && this.state.ov.k === 'gate') this.setState({ hold: 0 }); }
  key(d) {
    const e = (this.state.entry + d).slice(0, 4), ans = this.state.ans;
    if (e.length >= ans.length) {
      if (e === ans) this.setState({ entry: '', wrong: false, ov: { f: this.state.ov.f, k: 'settings' } });
      else this.setState({ entry: '', wrong: true });
    } else this.setState({ entry: e, wrong: false });
  }
  del() { this.setState({ entry: this.state.entry.slice(0, -1), wrong: false }); }
  toastMsg(msg) { clearTimeout(this.toastT); this.setState({ toast: msg }); this.toastT = setTimeout(() => this.setState({ toast: '' }), 2400); }
  reset() { this.setState({ style: 'past', speed: 'slow', hemi: 'north', themeLock: false, theme: null, hands: null, helpers: null }); }
  renderVals() {
    const st = this.state;
    const thId = st.theme || this.props.theme || DEFAULT_THEME;
    const th = THEMES.find(x => x.id === thId) || THEMES[0];
    const raw = st.set ? st.mins : this.nowM();
    const tf = ((raw % 1440) + 1440) % 1440, t = norm(raw);
    const h = Math.floor(t / 60), m = t % 60, mm = String(m).padStart(2, '0'), h12 = String((h % 12) || 12);
    const isAM = h < 12;
    const pairId = st.hands || this.props.hands || 'theme';
    const pr = PAIRS.find(x => x.id === pairId) || PAIRS[0];
    const lfOn = pr.id === 'theme' ? { h: th.hc, m: th.mc } : { h: pr.h, m: pr.m };
    const helpers = this.helpersOn();
    const lkOn = th.dark ? (pr.id === 'theme' ? { h: th.hcT, m: th.mcT } : { h: pr.hL, m: pr.mL }) : lfOn;
    const lf = helpers ? lfOn : { h: th.tick, m: th.tick };
    const lk = helpers ? lkOn : { h: th.ink, m: th.ink };
    const ck = { ring: helpers ? 'inline' : 'none', tf: helpers ? 'translate(0 0)' : 'translate(120 120) scale(1.2) translate(-120 -120)' };
    const parts = sayParts(t, st.style);
    const sentence = parts.map(p => typeof p === 'string' ? p : p[1]).join('');
    const tParts = parts.map(p => typeof p === 'string' ? { tx: p, style: '' } : { tx: p[1], style: helpers ? 'color:' + (p[0] === 'h' ? lk.h : lk.m) + ';font-weight:800' : '' });
    const scName = sceneOf(t);
    const sc = Object.assign({}, SCENES[scName], { name: scName, dur: st.drag ? '0.4s' : '2.5s' });
    const on = 'background:' + th.accent + ';color:' + th.onAccent;
    const off = 'background:transparent;color:' + th.sub;
    const chipOn = 'background:' + th.accent + ';color:' + th.onAccent + ';border-color:' + th.accent;
    const chipOff = 'background:transparent;color:' + th.sub + ';border-color:' + th.sub + ';font-weight:600';
    const ov = {};
    FRAMES.forEach(f => {
      const k = st.ov && st.ov.f === f ? st.ov.k : '';
      ov[f] = { theme: k === 'theme', gate: k === 'gate', settings: k === 'settings', openTheme: () => this.open(f, 'theme'), openGate: () => this.open(f, 'gate') };
    });
    const themes = THEMES.map(x => ({ id: x.id, name: x.name, sel: x.id === th.id, pick: () => this.setState({ theme: x.id }), tile: 'background:' + x.soft + ';color:' + x.softInk + ';border-color:' + (x.id === th.id ? x.accent : 'transparent'), face: x.face, rim: x.rim, hour: !helpers ? x.tick : (pr.id === 'theme' ? x.hc : lf.h), minute: !helpers ? x.tick : (pr.id === 'theme' ? x.mc : lf.m), motif: x.motif, motifS: 'fill:' + x.accent }));
    const pairs = PAIRS.map(x => { const c = x.id === 'theme' ? { h: th.hc, m: th.mc } : x; return { name: x.name, sel: x.id === pr.id, h: c.h, m: c.m, pick: () => this.setState({ hands: x.id }), tile: 'background:' + th.soft + ';color:' + th.softInk + ';border-color:' + (x.id === pr.id ? th.accent : 'transparent') }; });
    const cur = (key) => key === 'helpers' ? helpers : st[key];
    const seg = (key, val, label) => ({ label: label, sel: cur(key) === val, pick: () => this.setState({ [key]: val }), style: cur(key) === val ? 'background:' + th.accent + ';color:' + th.onAccent + ';border-color:' + th.accent : 'background:transparent;color:' + th.ink + ';border-color:' + th.sub });
    const prefs = [
      { label: 'How the time is said', opts: [seg('style', 'past', '45 minutes past 9'), seg('style', 'quarter', 'quarter to 10')] },
      { label: 'Hour and minute helpers: colours and the minutes ring', opts: [seg('helpers', true, 'On'), seg('helpers', false, 'Off')] },
      { label: 'Talking speed', opts: [seg('speed', 'slow', 'Slower'), seg('speed', 'normal', 'Normal')] },
      { label: 'Seasons on the calendar', opts: [seg('hemi', 'north', 'Northern'), seg('hemi', 'south', 'Southern')] },
      { label: 'Children can change the look', opts: [seg('themeLock', false, 'Yes'), seg('themeLock', true, 'No')] }
    ];
    const pad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(d => ({ d: d, press: () => this.key(d) }));
    const len = Math.max(1, st.ans.length);
    const entry = (st.entry + '______').slice(0, len).split('').join(' ');
    const bd = {};
    THEMES.forEach(x => { bd[x.id] = x.id === th.id ? 'inline' : 'none'; });
    bd.mouthOpen = st.speaking ? 'inline' : 'none';
    bd.mouthSmile = st.speaking ? 'none' : 'inline';
    return {
      th: th, sc: sc, ov: ov, themes: themes, pairs: pairs, prefs: prefs, pad: pad, lk: lk, lf: lf, ck: ck, helpersOn: helpers, bd: bd,
      t: { h12: h12, mm: mm, d12: h12 + ':' + mm, d24: String(h).padStart(2, '0') + ':' + mm, h24: String(h).padStart(2, '0'), ap: isAM ? 'AM' : 'PM', sentence: sentence, parts: tParts, aria: 'Clock showing ' + h12 + ':' + mm + ' ' + (isAM ? 'AM' : 'PM') + '. Drag a hand to change the time.' },
      ap: { am: isAM ? on : off, pm: isAM ? off : on, amChip: isAM ? chipOn : chipOff, pmChip: isAM ? chipOff : chipOn },
      hz: { hour: ((tf / 60) % 12) * 30, min: (tf % 60) * 6 },
      isSet: st.set, isLive: !st.set, speaking: st.speaking, notSpeaking: !st.speaking,
      canTheme: !st.themeLock, toast: st.toast, hasToast: !!st.toast,
      g: { q: st.q, entry: entry, wrong: st.wrong, holdPct: st.hold, holdBg: 'background:conic-gradient(' + th.accent + ' ' + st.hold + '%, ' + th.soft + ' 0)' },
      onDown: (e) => this.onDown(e), onMove: (e) => this.onMove(e), onUp: (e) => this.onUp(e),
      ampm: () => this.ampm(), now: () => this.now(), speak: () => this.speak(), close: () => this.close(),
      holdStart: (e) => this.holdStart(e), holdEnd: () => this.holdEnd(), del: () => this.del(), reset: () => this.reset(),
      cal: () => this.toastMsg('The calendar is coming in a later version.')
    };
  }
}
`;
}
