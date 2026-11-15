// Checks every theme × hour/minute colour pair:
//  1. contrast of the hour and minute colours on the face, cards and minutes ring (≥ 4.5 : 1)
//  2. contrast of text on the main button and of control outlines on cards (≥ 4.5 and ≥ 3)
//  3. the accent (buttons, selected AM/PM) never looks like the hour or minute colour
// Run: node design/concepts-generator/check.mjs
import { THEMES, PAIRS, CLASH } from './parts.mjs';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hue = (h) => {
  const [r, g, b] = hex(h), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return { h: 0, s: 0 };
  const hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (hh * 60 + 360) % 360, s: d / (1 - Math.abs(mx + mn - 1)) };
};
const hueGap = (a, b) => { const d = Math.abs(hue(a).h - hue(b).h); return Math.min(d, 360 - d); };

const fails = [];
let low = { r: 99 };
for (const t of THEMES) {
  for (const p of PAIRS) {
    const pr = p.id === 'theme' ? { h: t.hc, m: t.mc, hL: t.hcT, mL: t.mcT } : { h: p.h, m: p.m, hL: p.hL, mL: p.mL };
    // On the face and ring the light-surface colours are used; on dark cards the light variants.
    const checks = [
      ['hour on face', pr.h, t.face], ['minute on face', pr.m, t.face], ['minute on ring', t.dark ? pr.mL : pr.m, t.soft],
      ['hour on card', t.dark ? pr.hL : pr.h, t.card], ['minute on card', t.dark ? pr.mL : pr.m, t.card],
    ];
    for (const [what, fg, bg] of checks) {
      const r = ratio(fg, bg);
      if (r < low.r) low = { r, what: `${t.id} · ${p.id} · ${what}` };
      if (r < 4.5) fails.push(`${t.id} · ${p.id} · ${what}: ${r.toFixed(2)}`);
    }
    if ((CLASH[t.id] || []).includes(p.id)) continue; // the picker hides this pair for this look
    for (const [k, c] of [['hour', pr.h], ['minute', pr.m]]) {
      const gap = hueGap(t.accent, c), lgap = ratio(t.accent, c);
      if (gap < 25 && lgap < 1.6) fails.push(`${t.id} · ${p.id} · accent ${t.accent} looks like the ${k} colour ${c} (hue gap ${gap.toFixed(0)}°)`);
    }
  }
  const btn = ratio(t.onAccent, t.accent), ctl = ratio(t.ctl, t.card), ink = ratio(t.ink, t.card), sub = ratio(t.sub, t.card);
  if (btn < 4.5) fails.push(`${t.id} · button text ${btn.toFixed(2)}`);
  if (ctl < 3) fails.push(`${t.id} · control outline ${ctl.toFixed(2)}`);
  if (ink < 7 || sub < 4.5) fails.push(`${t.id} · card text ink ${ink.toFixed(2)} sub ${sub.toFixed(2)}`);
}
console.log('Pairs hidden per look:', JSON.stringify(CLASH));
console.log(`Lowest hour/minute contrast: ${low.r.toFixed(2)} (${low.what})`);
console.log(fails.length ? 'Problems:\n  ' + fails.join('\n  ') : 'No problems.');
process.exitCode = fails.length ? 1 : 0;
