import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { partOfDay, partOfDayPhrase, scene } from '../src/time.js';
import { clockView } from '../src/clock-view.js';
import { realClock } from '../src/set-clock.js';
import { LOOK_IDS } from '../src/colours.js';
import { SCENE_NAMES, sceneHoles, sceneMarkup, sceneTiming, sceneValues } from '../src/scene-art.js';

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
