import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { partOfDay, partOfDayPhrase, scene } from '../src/time.js';

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
