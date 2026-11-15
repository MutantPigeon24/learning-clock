// Draws the app icons as PNG files, with no dependencies.
// Run: node tools/make-icons.mjs   (writes icons/*.png)
//
// The icon is a clock at ten past ten: a white face with a blue rim, twelve
// marks, a short thick hour hand and a long thin minute hand, on the Sky blue.
// The maskable icon keeps the clock inside the middle 80 %, the safe zone
// Android crops to.

import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { LOOKS } from '../src/colours.js';

const sky = LOOKS.sky;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const COLOURS = {
  back: hex(sky.accent),
  face: hex(sky.face),
  ink: hex(sky.ink),
  hour: hex(sky.hc),
  minute: hex(sky.mc),
};

// Distance from p to the segment a–b.
function segmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// Angle in degrees, clockwise from 12, to a unit vector in screen space.
const toward = (deg) => [Math.sin((deg * Math.PI) / 180), -Math.cos((deg * Math.PI) / 180)];

/**
 * The colour at a point, in units where the clock face has radius 1 and its
 * centre is (0, 0). `edge` is the half-size of the whole square in those units.
 */
function colourAt(x, y, edge, rounded) {
  const corner = edge * 0.22;
  if (rounded) {
    // Rounded square: outside the corners is transparent.
    const qx = Math.max(Math.abs(x) - (edge - corner), 0);
    const qy = Math.max(Math.abs(y) - (edge - corner), 0);
    if (Math.hypot(qx, qy) > corner) return null;
  }
  const r = Math.hypot(x, y);
  if (r > 1) return COLOURS.back;
  if (r > 0.88) return COLOURS.ink;

  const [hx, hy] = toward(10 * 30 + 10 * 0.5); // 10:10 hour hand
  const [mx, my] = toward(10 * 6); // 10 minutes
  if (r < 0.09) return COLOURS.ink;
  if (segmentDistance(x, y, 0, 0, mx * 0.62, my * 0.62) < 0.045) return COLOURS.minute;
  if (segmentDistance(x, y, 0, 0, hx * 0.48, hy * 0.48) < 0.08) return COLOURS.hour;

  for (let i = 0; i < 12; i += 1) {
    const [tx, ty] = toward(i * 30);
    const long = i % 3 === 0;
    const from = long ? 0.66 : 0.72;
    if (segmentDistance(x, y, tx * from, ty * from, tx * 0.8, ty * 0.8) < (long ? 0.045 : 0.03)) return COLOURS.ink;
  }
  return COLOURS.face;
}

/** RGBA pixels for a square icon, 4 × 4 samples per pixel for smooth edges. */
function draw(size, { faceShare, rounded }) {
  const edge = 1 / faceShare; // half the square, in face radii
  const pixels = Buffer.alloc(size * size * 4);
  const n = 4;
  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < n; sy += 1) {
        for (let sx = 0; sx < n; sx += 1) {
          const x = ((px + (sx + 0.5) / n) / size) * 2 * edge - edge;
          const y = ((py + (sy + 0.5) / n) / size) * 2 * edge - edge;
          const c = colourAt(x, y, edge, rounded);
          if (c) { r += c[0]; g += c[1]; b += c[2]; a += 1; }
        }
      }
      const i = (py * size + px) * 4;
      if (a) {
        pixels[i] = Math.round(r / a);
        pixels[i + 1] = Math.round(g / a);
        pixels[i + 2] = Math.round(b / a);
      }
      pixels[i + 3] = Math.round((a / (n * n)) * 255);
    }
  }
  return pixels;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, k) => {
  let c = k;
  for (let i = 0; i < 8; i += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** A PNG file (8-bit RGBA) from raw pixels. */
export function encodePng(size, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const rows = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    pixels.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const ICONS = [
  { file: 'icon-192.png', size: 192, faceShare: 0.84, rounded: true },
  { file: 'icon-512.png', size: 512, faceShare: 0.84, rounded: true },
  { file: 'icon-maskable-512.png', size: 512, faceShare: 0.66, rounded: false },
];

const outDir = new URL('../icons/', import.meta.url);
mkdirSync(outDir, { recursive: true });
for (const icon of ICONS) {
  writeFileSync(new URL(icon.file, outDir), encodePng(icon.size, draw(icon.size, icon)));
  console.log(`icons/${icon.file}`);
}
