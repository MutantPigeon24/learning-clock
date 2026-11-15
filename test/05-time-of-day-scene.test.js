import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { partOfDay, partOfDayPhrase, scene } from '../src/time.js';
import { clockView } from '../src/clock-view.js';
import { realClock } from '../src/set-clock.js';
import { LOOK_IDS } from '../src/colours.js';
import { ORB_MIN, SCENE_NAMES, orbSpot, orbValues, sceneHoles, sceneMarkup, sceneTiming, sceneValues, skyBand } from '../src/scene-art.js';

// Turns the picture description in the feature file into a scene name.
function sceneName(description) {
  if (description.includes('sunrise')) return 'sunrise';
  if (description.includes('sunny day')) return 'day';
  if (description.includes('sunset')) return 'sunset';
  if (description.includes('night')) return 'night';
  throw new Error(`Unknown scene: ${description}`);
}

for (const row of examples('05-time-of-day-scene.feature', 'Showing the scene for the current time')) {
  test(`scene at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    assert.equal(scene(hours, minutes), sceneName(row.scene));
  });
}

for (const row of examples('05-time-of-day-scene.feature', 'Matching the scene to the part of the day')) {
  test(`scene and words agree at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    assert.equal(scene(hours, minutes), row.scene);
    assert.equal(partOfDayPhrase(partOfDay(hours, minutes)), row['part of day']);
  });
}

test('the scene and the words agree at every minute of the day', () => {
  const allowed = {
    sunrise: ['morning'],
    day: ['morning', 'afternoon'],
    sunset: ['evening'],
    night: ['night'],
  };
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes++) {
      const s = scene(hours, minutes);
      const p = partOfDay(hours, minutes);
      assert.ok(allowed[s].includes(p), `${hours}:${minutes} shows ${s} but says ${p}`);
    }
  }
});

// --- The scene on the clock screen (src/clock-view.js, src/scene-art.js) ---

const NOW = new Date(2026, 10, 15, 14, 20);
const setTo = (time) => {
  const { hours, minutes } = parseTime(time);
  return { setByHand: true, wall: { year: 2026, month: 11, day: 15, hours, minutes } };
};
const seconds = (dur) => parseFloat(dur);

for (const row of examples('05-time-of-day-scene.feature', 'Showing the scene for the current time')) {
  test(`the clock screen shows the ${sceneName(row.scene)} scene at ${row.time}`, () => {
    assert.equal(clockView(setTo(row.time), NOW).scene, sceneName(row.scene));
  });
}

test('the scene follows the real time when nothing is set', () => {
  assert.equal(clockView(realClock(), new Date(2026, 10, 15, 21, 5)).scene, 'night');
  assert.equal(clockView(realClock(), new Date(2026, 10, 15, 6, 30)).scene, 'sunrise');
});

test('moving from one scene to the next fades slowly, with nothing jumping', () => {
  const { dur, stag } = sceneTiming();
  assert.ok(seconds(dur) >= 1.5 && seconds(dur) <= 3, `takes ${dur}`);
  assert.equal(stag, 1, 'night lights come one by one');
  // Every change is a CSS transition of a value in the markup; nothing is swapped in.
  const markup = sceneMarkup('test', sceneHoles, ['sky']);
  assert.ok(!markup.includes('@keyframes') && !markup.includes('animation'));
  assert.match(markup, /transition:var\(--sc-dur\)/);
});

test('every value the scene needs is set for every look and scene', () => {
  const markup = sceneMarkup('test', sceneHoles);
  const holes = new Set([...markup.matchAll(/var\(--sc-(\w+)\)/g)].map((m) => m[1]));
  for (const look of LOOK_IDS) {
    for (const name of SCENE_NAMES) {
      const values = { ...sceneValues(look, name), ...sceneTiming() };
      for (const hole of holes) assert.ok(values[hole] !== undefined, `${look} ${name} has no ${hole}`);
    }
  }
});

test('the night lights are on at night and off by day', () => {
  assert.equal(sceneValues('sky', 'night').glow, 1);
  assert.equal(sceneValues('sky', 'day').glow, 0);
  assert.equal(sceneValues('sky', 'night').dayO, 0, 'things seen only by day have gone');
  assert.equal(sceneValues('sky', 'day').dayO, 1);
});

// --- The sun and moon in the open sky above the cards ---
// Rects measured in the browser on the Clock Hub screen: [left, top, right, bottom].
const SCREENS = {
  'tablet landscape 1280 × 800': { size: [1280, 800], clock: [32, 32, 682, 768], cards: [[726, 197, 1248, 345], [726, 446, 976, 583], [998, 446, 1248, 583]], corner: [1100, 4, 1276, 180] },
  'window 1024 × 768': { size: [1024, 768], clock: [31, 31, 492, 737], cards: [[534, 193, 993, 336], [534, 434, 753, 558], [774, 434, 993, 558]], corner: [852, 3, 1021, 172] },
  'tablet portrait 800 × 1280': { size: [800, 1280], clock: [32, 118, 768, 839], cards: [[32, 861, 768, 962], [32, 984, 389, 1142], [411, 984, 768, 1142]], corner: [620, 4, 796, 180] },
  'phone portrait 412 × 915': { size: [412, 915], clock: [24, 80, 388, 665], cards: [[24, 677, 388, 732], [24, 744, 200, 835], [212, 744, 388, 835]], corner: [303, 2, 410, 109] },
  'phone landscape 915 × 412': { size: [915, 412], clock: [24, 16, 344, 396], cards: [[368, 111, 891, 166], [368, 209, 624, 301], [636, 209, 891, 301]], corner: [806, 2, 913, 109] },
  'narrow window 1000 × 900': { size: [1000, 900], clock: [36, 36, 614, 744], cards: [[664, 439, 964, 712], [664, 68, 964, 228], [664, 253, 964, 414]], corner: [798, 4, 996, 202] },
  'small square window 470 × 470': { size: [470, 470], clock: [24, 19, 260, 386], cards: [[286, 231, 446, 374], [286, 31, 446, 118], [286, 131, 446, 218]], corner: [346, 2, 468, 124] },
};
const rect = ([left, top, right, bottom]) => ({ left, top, right, bottom });
const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const orbRect = ({ x, y, size }) => ({ left: x - size / 2, top: y - size / 2, right: x + size / 2, bottom: y + size / 2 });
// How much of the orb's height is above a line (the top of whatever hides it).
const shownAbove = (o, line) => Math.min(1, Math.max(0, (line - (o.y - o.size / 2)) / o.size));

for (const [name, s] of Object.entries(SCREENS)) {
  test(`the sun and moon show in the open sky: ${name}`, () => {
    const [width, height] = s.size;
    const parts = { clock: rect(s.clock), cards: s.cards.map(rect), corner: rect(s.corner) };
    const band = skyBand(parts);
    const short = Math.min(width, height);
    const spot = Object.fromEntries(SCENE_NAMES.map((n) => [n, orbSpot(band, n, short)]));
    for (const n of SCENE_NAMES) {
      const o = spot[n];
      const r = orbRect(o);
      assert.ok(o.size >= ORB_MIN, `${n} is too small`);
      assert.ok(r.left >= 0 && r.right <= width && r.top >= -2, `${n} is off the screen`);
      assert.ok(!overlaps(r, parts.corner), `${n} is behind the corner picture`);
      // It never sits on the clock face.
      assert.ok(!overlaps({ ...r, bottom: band.bottom }, parts.clock) || band.bottom <= parts.clock.top, `${n} is on the clock`);
      // The scene's values put it back at the same place on the screen.
      const v = orbValues(o, width, height);
      const scale = Math.max(width, height) / 1000;
      assert.ok(Math.abs(v.ox * scale + (width - 1000 * scale) / 2 - o.x) < 1);
      assert.ok(Math.abs(v.oy * scale + height - 1000 * scale - o.y) < 1);
      assert.ok(Math.abs(62 * v.os * scale * 2 - o.size) < 1);
    }
    // High by day and at night: (nearly) all of it shows above the cards.
    assert.ok(shownAbove(spot.day, band.bottom) >= 0.7, 'the sun is hidden by day');
    assert.ok(shownAbove(spot.night, band.bottom) >= 0.7, 'the moon is hidden');
    // Low at sunrise and sunset, peeking over the cards: on the left, then on the right.
    for (const n of ['sunrise', 'sunset']) {
      assert.ok(spot[n].y > spot.day.y, `${n} is not lower than day`);
      assert.ok(shownAbove(spot[n], band.bottom) >= 0.5, `${n} is hidden`);
    }
    assert.ok(spot.sunrise.x <= spot.sunset.x);
  });
}
