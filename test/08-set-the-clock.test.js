import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { handAngles, twelveHourClock, twentyFourHourClock, timeInWords, scene } from '../src/time.js';
import {
  addMinutes,
  angleToMinute,
  changeTime,
  dragHourHand,
  dragMinuteHand,
  handKeyStep,
  isSetByHand,
  moveHandByKey,
  nearestHand,
  pointerAngle,
  realClock,
  shownTime,
  swapAmPm,
  wallFromDate,
} from '../src/set-clock.js';

const FEATURE = '08-set-the-clock.feature';

// A day to put the example times on. The examples only give times.
function wallAt(time, date = { year: 2026, month: 11, day: 15 }) {
  return { ...date, ...parseTime(time) };
}

function hhmm(wall) {
  return twentyFourHourClock(wall.hours, wall.minutes);
}

// Reads a direction like "clockwise, past the 12" or "clockwise, twice round".
function parseDirection(text) {
  return {
    sign: text.startsWith('anticlockwise') ? -1 : 1,
    pastTheTwelve: text.includes('past the 12'),
    turns: text.includes('twice round') ? 2 : 0,
  };
}

// Moves a finger round the face in small steps (a third of a minute each),
// the way a real drag sends many pointer moves, and checks the example's
// "past the 12" wording matches the path.
function dragMinuteTo(wall, directionText, targetMinute) {
  const { sign, pastTheTwelve, turns } = parseDirection(directionText);
  const start = wall.minutes;
  const travel = ((sign * (targetMinute - start)) % 60 + 60) % 60 + 60 * turns;
  const end = start + sign * travel;
  if (turns === 0) {
    assert.equal(end >= 60 || end < 0, pastTheTwelve, `"${directionText}" doesn't match the path`);
  }
  for (let step = 1; step <= travel * 3; step++) {
    wall = dragMinuteHand(wall, (start + (sign * step) / 3) * 6);
  }
  return wall;
}

function dragHourTo(wall, directionText, targetHour) {
  const { sign, pastTheTwelve } = parseDirection(directionText);
  const start = handAngles(wall.hours, wall.minutes).hour;
  const target = (targetHour % 12) * 30 + wall.minutes * 0.5;
  const travel = ((sign * (target - start)) % 360 + 360) % 360;
  const end = start + sign * travel;
  assert.equal(end >= 360 || end < 0, pastTheTwelve, `"${directionText}" doesn't match the path`);
  for (let deg = 2; deg < travel; deg += 2) {
    wall = dragHourHand(wall, start + sign * deg);
  }
  return dragHourHand(wall, end);
}

// --- Rule: The hands can be dragged with a finger ---------------------------

test('letting go between two minute marks settles on the nearest minute', () => {
  assert.equal(angleToMinute(10.4), 2); // 1.73 minutes
  assert.equal(angleToMinute(8.9), 1); // 1.48 minutes
  assert.equal(angleToMinute(357), 0); // just before the 12
  assert.equal(angleToMinute(-6), 59);
  assert.equal(angleToMinute(720 + 90), 15);
});

test('the finger angle is measured clockwise from the 12', () => {
  assert.equal(pointerAngle({ x: 0, y: -1 }), 0);
  assert.equal(pointerAngle({ x: 1, y: 0 }), 90);
  assert.equal(pointerAngle({ x: 0, y: 1 }), 180);
  assert.equal(pointerAngle({ x: -1, y: 0 }), 270);
});

test('the hand closest to the finger is the one that moves', () => {
  const wall = wallAt('09:15'); // hour hand near the 9, minute hand at the 3
  assert.equal(nearestHand(wall, { x: 0.6, y: 0 }), 'minute');
  assert.equal(nearestHand(wall, { x: -0.4, y: -0.02 }), 'hour');
  // Hands on top of each other: past the end of the hour hand means the minute hand.
  const together = wallAt('12:00');
  assert.equal(nearestHand(together, { x: 0, y: -0.75 }), 'minute');
  assert.equal(nearestHand(together, { x: 0, y: -0.3 }), 'hour');
});

// --- Rule: The hands can also be moved with a keyboard ----------------------

const KEYS = { 'right arrow': 'ArrowRight', 'left arrow': 'ArrowLeft', 'up arrow': 'ArrowUp', 'down arrow': 'ArrowDown', 'page up': 'PageUp', 'page down': 'PageDown' };

for (const row of examples(FEATURE, 'Moving a hand with the keyboard')) {
  test(`${row.key} on the ${row.hand} hand at ${row.start}`, () => {
    const key = KEYS[row.key];
    assert.ok(key, `unknown key "${row.key}"`);
    const end = moveHandByKey(wallAt(row.start), row.hand, key);
    assert.equal(hhmm(end), row.end);
    const state = changeTime(realClock(), new Date(), (shown) => moveHandByKey(shown, row.hand, key));
    assert.equal(isSetByHand(state), true);
  });
}

test('other keys leave the clock alone', () => {
  for (const hand of ['hour', 'minute']) {
    for (const key of ['Tab', 'Enter', ' ', 'Home', 'a', 'Escape']) {
      assert.equal(handKeyStep(hand, key), 0, `${key} on the ${hand} hand`);
    }
  }
  assert.deepEqual(moveHandByKey(wallAt('09:45'), 'minute', 'Tab'), wallAt('09:45'));
});

test('a key past midnight changes the date too', () => {
  assert.deepEqual(moveHandByKey(wallAt('00:00'), 'minute', 'ArrowLeft'), { year: 2026, month: 11, day: 14, hours: 23, minutes: 59 });
});

// --- Rule: Moving the minute hand also moves the hour hand ------------------

for (const row of examples(FEATURE, 'Dragging the minute hand')) {
  test(`minute hand from ${row.start}, ${row.direction}, to ${row.minute}`, () => {
    const end = dragMinuteTo(wallAt(row.start), row.direction, Number(row.minute));
    assert.equal(hhmm(end), row.end);
  });
}

// --- Rule: Moving the hour hand changes the hour and keeps the minutes ------

for (const row of examples(FEATURE, 'Dragging the hour hand')) {
  test(`hour hand from ${row.start}, ${row.direction}, to the ${row.hour}`, () => {
    const start = wallAt(row.start);
    const end = dragHourTo(start, row.direction, Number(row.hour));
    assert.equal(hhmm(end), row.end);
    assert.equal(end.minutes, start.minutes);
  });
}

// --- Rule: Going round past the 12 moves between morning and evening --------

for (const row of examples(FEATURE, 'Crossing midday and midnight')) {
  test(`crossing the 12 from ${row.start} to ${row.end}`, () => {
    const end = dragMinuteTo(wallAt(row.start), row.direction, Number(row.minute));
    assert.equal(hhmm(end), row.end);
    assert.equal(twelveHourClock(end.hours, end.minutes).period, row.label);
    assert.equal(timeInWords(end.hours, end.minutes), row.sentence);
  });
}

test('going past midnight changes the date too', () => {
  const forward = dragMinuteTo(wallAt('23:55'), 'clockwise, past the 12', 5);
  assert.deepEqual(forward, { year: 2026, month: 11, day: 16, hours: 0, minutes: 5 });
  const back = dragMinuteTo(forward, 'anticlockwise, past the 12', 55);
  assert.deepEqual(back, { year: 2026, month: 11, day: 15, hours: 23, minutes: 55 });
});

test('adding minutes handles month and year ends and leap days', () => {
  assert.deepEqual(addMinutes(wallAt('23:59', { year: 2026, month: 12, day: 31 }), 1),
    { year: 2027, month: 1, day: 1, hours: 0, minutes: 0 });
  assert.deepEqual(addMinutes(wallAt('23:30', { year: 2028, month: 2, day: 28 }), 60),
    { year: 2028, month: 2, day: 29, hours: 0, minutes: 30 });
  assert.deepEqual(addMinutes(wallAt('00:10', { year: 2026, month: 3, day: 1 }), -20),
    { year: 2026, month: 2, day: 28, hours: 23, minutes: 50 });
});

// --- Rule: An AM/PM switch on the analog clock ------------------------------

for (const row of examples(FEATURE, 'Swapping between AM and PM')) {
  test(`AM/PM switch from ${row.start}`, () => {
    const start = wallAt(row.start);
    const end = swapAmPm(start);
    assert.equal(hhmm(end), row.end);
    assert.deepEqual(handAngles(end.hours, end.minutes), handAngles(start.hours, start.minutes));
    assert.equal(twelveHourClock(end.hours, end.minutes).period, row.label);
    assert.equal(timeInWords(end.hours, end.minutes), row.sentence);
  });
}

test('the AM/PM switch keeps the date', () => {
  const start = wallAt('21:45');
  const end = swapAmPm(start);
  assert.deepEqual(end, { ...start, hours: 9 });
  assert.deepEqual(swapAmPm(wallAt('00:05')), wallAt('12:05'));
});

test('the scene follows the switch', () => {
  const end = swapAmPm(wallAt('09:45'));
  assert.equal(scene(9, 45), 'day');
  assert.equal(scene(end.hours, end.minutes), 'night');
});

test('using the switch while showing the real time sets the clock by hand', () => {
  const now = new Date(2026, 10, 15, 9, 45);
  const state = changeTime(realClock(), now, swapAmPm);
  assert.equal(isSetByHand(state), true);
  assert.equal(hhmm(shownTime(state, now)), '21:45');
});

// --- Rule: Every display follows the set time --------------------------------

test('the scene follows the set time', () => {
  const end = dragMinuteTo(wallAt('16:50'), 'clockwise, past the 12', 10);
  assert.equal(hhmm(end), '17:10');
  assert.equal(scene(16, 50), 'day');
  assert.equal(scene(end.hours, end.minutes), 'sunset');
});

// --- Rule: A set time stays still until it is changed or reset --------------

test('the real clock shows the device time', () => {
  const now = new Date(2026, 10, 15, 9, 12);
  assert.equal(isSetByHand(realClock()), false);
  assert.deepEqual(shownTime(realClock(), now), wallFromDate(now));
});

test('a set time does not tick', () => {
  const set = changeTime(realClock(), new Date(2026, 10, 15, 9, 12),
    (wall) => ({ ...wall, hours: 9, minutes: 45 }));
  const later = new Date(2026, 10, 15, 9, 20);
  assert.equal(hhmm(shownTime(set, later)), '09:45');
});

test('going back to now shows the real time and ticks again', () => {
  const set = changeTime(realClock(), new Date(2026, 10, 15, 9, 12), (w) => ({ ...w, minutes: 45 }));
  const back = realClock();
  assert.equal(isSetByHand(back), false);
  assert.equal(hhmm(shownTime(back, new Date(2026, 10, 15, 14, 20))), '14:20');
  assert.equal(hhmm(shownTime(back, new Date(2026, 10, 15, 14, 21))), '14:21');
  assert.equal(isSetByHand(set), true);
});

test('dragging the hands back to the real time still counts as set by hand', () => {
  const now = new Date(2026, 10, 15, 14, 20);
  const set = changeTime(realClock(), now, (w) => ({ ...w, hours: 9, minutes: 45 }));
  const draggedBack = changeTime(set, now, (w) => ({ ...w, hours: 14, minutes: 20 }));
  assert.equal(hhmm(shownTime(draggedBack, now)), '14:20');
  assert.equal(isSetByHand(draggedBack), true);
});
