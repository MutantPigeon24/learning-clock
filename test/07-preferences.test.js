// The preferences screen is @future, but the wording styles and custom times
// are inputs to the logic now, so adding the screen later needs no rewrite.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { timeInWords, partOfDay, scene, DEFAULT_PARTS_OF_DAY, DEFAULT_SCENES } from '../src/time.js';

const styles = {
  'minutes past (default)': 'past',
  'quarter, half, past and to': 'quarter',
};

for (const row of examples('07-preferences.feature', 'Choosing a wording style')) {
  test(`${row.style} wording at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    assert.equal(timeInWords(hours, minutes, { style: styles[row.style] }), row.sentence);
  });
}

test('"quarter" style keeps midday and midnight for exactly 12 o\'clock', () => {
  assert.equal(timeInWords(12, 0, { style: 'quarter' }), 'It is 12 o\'clock midday.');
  assert.equal(timeInWords(0, 0, { style: 'quarter' }), 'It is 12 o\'clock midnight.');
  assert.equal(timeInWords(23, 45, { style: 'quarter' }), 'It is quarter to 12 at night.');
  assert.equal(timeInWords(20, 50, { style: 'quarter' }), 'It is 10 minutes to 9 at night.');
  assert.equal(timeInWords(9, 59, { style: 'quarter' }), 'It is 1 minute to 10 in the morning.');
});

test('evening can be moved to start at 18:00', () => {
  const partsOfDay = { ...DEFAULT_PARTS_OF_DAY, evening: '18:00' };
  const scenes = { ...DEFAULT_SCENES, sunset: '18:00' };
  assert.equal(partOfDay(17, 30, partsOfDay), 'afternoon');
  assert.equal(scene(17, 30, scenes), 'day');
  assert.equal(timeInWords(17, 30, { partsOfDay }), 'It is 30 minutes past 5 in the afternoon.');
});

test('the scene times can be set separately from the words', () => {
  const scenes = { ...DEFAULT_SCENES, sunset: '18:00' };
  assert.equal(partOfDay(17, 30), 'evening');
  assert.equal(scene(17, 30, scenes), 'day');
});
