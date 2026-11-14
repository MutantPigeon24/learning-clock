import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { timeInWords } from '../src/time.js';

const outlines = [
  'Saying the time',
  'Naming the part of the day',
  'Saying times close to 12 o\'clock',
];

for (const outline of outlines) {
  for (const row of examples('04-time-in-words.feature', outline)) {
    test(`${outline}: ${row.time}`, () => {
      const { hours, minutes } = parseTime(row.time);
      assert.equal(timeInWords(hours, minutes), row.sentence);
    });
  }
}

test('never uses "quarter", "half" or "to" at any minute of the day', () => {
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes++) {
      assert.doesNotMatch(timeInWords(hours, minutes), /\b(quarter|half|to)\b/i);
    }
  }
});

test('writes numbers as digits', () => {
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes++) {
      assert.doesNotMatch(
        timeInWords(hours, minutes),
        /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/i,
      );
    }
  }
});
