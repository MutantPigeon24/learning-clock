import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { handAngles } from '../src/time.js';

// Angles are in degrees, clockwise from 12. Each hour mark is 30 degrees apart.
function hourPositionAngle(text) {
  const exact = text.match(/^pointing exactly at (\d+)$/);
  if (exact) return (Number(exact[1]) % 12) * 30;

  const fractions = {
    'a quarter of the way from': 0.25,
    'halfway between': 0.5,
    'three quarters of the way from': 0.75,
  };
  for (const [phrase, fraction] of Object.entries(fractions)) {
    const m = text.match(new RegExp(`^${phrase} (\\d+) (?:and|to) (\\d+)$`));
    if (m) return ((Number(m[1]) % 12) + fraction) * 30;
  }
  throw new Error(`Unknown hour position: ${text}`);
}

for (const row of examples('02-analog-clock.feature', 'Moving the hour hand smoothly between hours')) {
  test(`hands at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    const angles = handAngles(hours, minutes);
    assert.equal(angles.minute, Number(row.minute) * 6);
    assert.equal(angles.hour, hourPositionAngle(row['hour position']));
  });
}

test('morning and evening look the same on the clock face', () => {
  assert.deepEqual(handAngles(9, 30), handAngles(21, 30));
});

test('midnight and midday point straight up', () => {
  assert.deepEqual(handAngles(0, 0), { hour: 0, minute: 0 });
  assert.deepEqual(handAngles(12, 0), { hour: 0, minute: 0 });
});
