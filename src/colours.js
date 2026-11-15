// Colours for each look, and the hour and minute colours that link the same
// part of every display (11-hour-and-minute-colours.feature).
//
// This is the one place these colours are defined. The design canvas
// generator (design/concepts-generator/parts.mjs) imports them too.

/**
 * Each look's colours.
 * card/ink/sub: cards and their text. soft/softInk: the soft panel (and the
 * minutes ring). accent/onAccent: buttons and the selected state; it must
 * never look like the hour or minute colour. ctl: control outlines on cards.
 * face/rim/tick/num: the clock face, its edge, its marks and its numbers.
 * hc/mc: the look's own hour and minute colours, on light surfaces.
 * hcT/mcT: the same on dark cards (only looks with dark: true have them).
 */
export const LOOKS = Object.freeze({
  sky: { name: 'Sky', card: '#FFFFFF', ink: '#0B2545', sub: '#3D5A80', accent: '#1A64C8', onAccent: '#FFFFFF', ctl: '#1A64C8', soft: '#DCEBFF', softInk: '#0B2545', face: '#FFFFFF', rim: '#1A64C8', tick: '#0B2545', num: '#0B2545', hc: '#B23B0B', mc: '#6741D9' },
  blossom: { name: 'Blossom', card: '#FFFFFF', ink: '#4A0D2E', sub: '#7A2E55', accent: '#C2185B', onAccent: '#FFFFFF', ctl: '#C2185B', soft: '#FFE1EE', softInk: '#4A0D2E', face: '#FFF7FB', rim: '#E0457B', tick: '#4A0D2E', num: '#4A0D2E', hc: '#6A2BB5', mc: '#0A6B66' },
  unicorn: { name: 'Unicorn', card: '#FFFFFF', ink: '#35155D', sub: '#5B3A8C', accent: '#7C3AED', onAccent: '#FFFFFF', ctl: '#7C3AED', soft: '#EFE5FF', softInk: '#35155D', face: '#FFFFFF', rim: '#B48CF2', tick: '#35155D', num: '#35155D', hc: '#C2255C', mc: '#1864AB' },
  hero: { name: 'Hero', card: '#FFFFFF', ink: '#111C3A', sub: '#34416B', accent: '#FFC21A', onAccent: '#111C3A', ctl: '#111C3A', soft: '#FFF0C2', softInk: '#111C3A', face: '#FFFFFF', rim: '#111C3A', tick: '#111C3A', num: '#111C3A', hc: '#C92A2A', mc: '#1D4ED8' },
  dino: { name: 'Dino', card: '#FFFFFF', ink: '#173A1E', sub: '#2F5D36', accent: '#2E7D32', onAccent: '#FFFFFF', ctl: '#2E7D32', soft: '#E2F3D5', softInk: '#173A1E', face: '#FFFDF5', rim: '#5FAE4E', tick: '#173A1E', num: '#173A1E', hc: '#B23B0B', mc: '#1D4ED8' },
  space: { name: 'Space', dark: true, card: '#1E1B4B', ink: '#FFFFFF', sub: '#C7C9F5', accent: '#FFC93C', onAccent: '#1E1B4B', ctl: '#FFC93C', soft: '#312E81', softInk: '#FFFFFF', face: '#FFFFFF', rim: '#6D63FF', tick: '#1E1B4B', num: '#1E1B4B', hc: '#B23B0B', mc: '#3B5BDB', hcT: '#FFA94D', mcT: '#A5B4FF' },
});

export const LOOK_IDS = Object.freeze(Object.keys(LOOKS));

/**
 * Hour and minute colour pairs a child can pick instead of the look's own.
 * h/m sit on light cards and the clock face; hL/mL are for dark cards.
 */
export const PAIRS = Object.freeze([
  { id: 'theme', name: 'Match the look' },
  { id: 'red-blue', name: 'Red and blue', h: '#C92A2A', m: '#1D4ED8', hL: '#FF8787', mL: '#91A7FF' },
  { id: 'orange-purple', name: 'Orange and purple', h: '#B23B0B', m: '#6741D9', hL: '#FFA94D', mL: '#B197FC' },
  { id: 'pink-teal', name: 'Pink and teal', h: '#C2255C', m: '#0A6B66', hL: '#F783AC', mL: '#63E6BE' },
  { id: 'purple-orange', name: 'Purple and orange', h: '#6741D9', m: '#B23B0B', hL: '#B197FC', mL: '#FFA94D' },
]);

const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two "#RRGGBB" colours, from 1 to 21. */
export function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (light + 0.05) / (dark + 0.05);
}

/** Hue in degrees (0–360) of a "#RRGGBB" colour. Greys give 0. */
export function hueOf(hex) {
  const [r, g, b] = channels(hex);
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (!d) return 0;
  const k = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (k * 60 + 360) % 360;
}

/** Two colours look alike when their hues are close and their lightness is too. */
export function looksAlike(a, b) {
  const d = Math.abs(hueOf(a) - hueOf(b));
  return Math.min(d, 360 - d) < 25 && contrastRatio(a, b) < 1.6;
}

/**
 * Ids of the pairs the look picker hides for a look, because their hour or
 * minute colour looks like the look's button colour (10-looks.feature).
 */
export function hiddenPairs(lookId) {
  const accent = LOOKS[lookId].accent;
  return PAIRS.filter((p) => p.h && (looksAlike(accent, p.h) || looksAlike(accent, p.m))).map((p) => p.id);
}

/** The pairs the look picker offers for a look, in order. */
export function pairsFor(lookId) {
  const hidden = hiddenPairs(lookId);
  return PAIRS.filter((p) => !hidden.includes(p.id));
}

/**
 * The hour and minute colours in use. The look's own pair is used for
 * "theme", an unknown id, or a pair the look hides.
 * hour/minute go on light surfaces, hourOnDark/minuteOnDark on dark cards.
 */
export function pairInUse(lookId, pairId = 'theme') {
  const look = LOOKS[lookId];
  const pair = pairsFor(lookId).find((p) => p.id === pairId && p.h);
  if (!pair) {
    return { id: 'theme', hour: look.hc, minute: look.mc, hourOnDark: look.hcT ?? look.hc, minuteOnDark: look.mcT ?? look.mc };
  }
  return { id: pair.id, hour: pair.h, minute: pair.m, hourOnDark: pair.hL, minuteOnDark: pair.mL };
}

/**
 * The colour of each part of the clock screen.
 * With the helpers on, every hour part takes the hour colour and every
 * minute part the minute colour. With them off, the hands and numbers take
 * the clock's own ink, the digits and words are plain text, and there is no
 * minutes ring (minutesRing is null).
 */
export function partColours(lookId, pairId = 'theme', helpers = true) {
  const look = LOOKS[lookId];
  if (!helpers) {
    return {
      hourHand: look.tick, hourNumbers: look.num, hourDigits: look.ink, hourWords: look.ink,
      minuteHand: look.tick, minutesRing: null, minuteDigits: look.ink, minuteWords: look.ink,
      plainText: look.ink,
    };
  }
  const pair = pairInUse(lookId, pairId);
  const onCard = look.dark ? { hour: pair.hourOnDark, minute: pair.minuteOnDark } : pair;
  return {
    hourHand: pair.hour, hourNumbers: pair.hour, hourDigits: onCard.hour, hourWords: onCard.hour,
    minuteHand: pair.minute, minutesRing: look.dark ? pair.minuteOnDark : pair.minute,
    minuteDigits: onCard.minute, minuteWords: onCard.minute,
    plainText: look.ink,
  };
}
