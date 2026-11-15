import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { twelveHourClock, twentyFourHourClock } from '../src/time.js';

for (const row of examples('03-digital-clocks.feature', 'Writing the time on the 12-hour clock')) {
  test(`12-hour clock at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    assert.deepEqual(twelveHourClock(hours, minutes), { display: row.display, period: row.label });
  });
}

for (const row of examples('03-digital-clocks.feature', 'Writing the time on the 24-hour clock')) {
  test(`24-hour clock at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    assert.equal(twentyFourHourClock(hours, minutes), row.display);
  });
}
