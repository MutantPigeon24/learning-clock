import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { sentenceParts, timeInWords, twelveHourClock, twentyFourHourClock, minutesRing } from '../src/time.js';
import { LOOKS, LOOK_IDS, PAIRS, pairsFor, pairInUse, partColours, contrastRatio, hueOf, looksAlike } from '../src/colours.js';
import { HOUR_HAND_LENGTH, MINUTE_HAND_LENGTH } from '../src/set-clock.js';

const FEATURE = '11-hour-and-minute-colours.feature';

const lookId = (name) => LOOK_IDS.find((id) => LOOKS[id].name === name);
const pairId = (name) => PAIRS.find((p) => p.name === name).id;
const words = (parts, kind) => parts.filter((p) => p.kind === kind).map((p) => p.text).join('') || 'nothing';

// Colour names in the feature file, as hue ranges in degrees.
const HUES = {
  red: [[345, 360], [0, 10]],
  orange: [[10, 40]],
  yellow: [[40, 65]],
  green: [[65, 170]],
  teal: [[170, 195]],
  blue: [[195, 250]],
  purple: [[250, 290]],
  pink: [[290, 345]],
};
function assertColourName(hex, name) {
  const h = hueOf(hex);
  assert.ok(HUES[name].some(([lo, hi]) => h >= lo && h < hi), `${hex} (hue ${h.toFixed(0)}°) should be ${name}`);
}

// Every look with every pair it offers, and with the helpers on.
const everyLookAndPair = LOOK_IDS.flatMap((look) => pairsFor(look).map((p) => [look, p.id]));

const PARTS = {
  'the short hour hand and its grip': 'hourHand',
  'the numbers 1 to 12 on the clock face': 'hourNumbers',
  'the hour digits on both digital clocks': 'hourDigits',
  'the hour in the sentence': 'hourWords',
  'the long minute hand and its grip': 'minuteHand',
  'the minutes ring round the clock face': 'minutesRing',
  'the minute digits on both digital clocks': 'minuteDigits',
  'the minutes in the sentence': 'minuteWords',
  'the colon, AM or PM and the rest of the words': 'plainText',
};

const partRows = examples(FEATURE, 'Colouring each part of the clock screen');
for (const row of partRows) {
  test(`helpers on: ${row.part} is in the ${row.colour}`, () => {
    const key = PARTS[row.part];
    assert.ok(key, `unknown part "${row.part}"`);
    for (const [look, pair] of everyLookAndPair) {
      const c = partColours(look, pair, true);
      const p = pairInUse(look, pair);
      const expected = {
        'hour colour': [p.hour, p.hourOnDark],
        'minute colour': [p.minute, p.minuteOnDark],
        "look's ink": [LOOKS[look].ink],
      }[row.colour];
      assert.ok(expected.includes(c[key]), `${look} · ${pair} · ${key} is ${c[key]}`);
    }
  });
}

test('the parts table covers every coloured part of the screen', () => {
  const covered = partRows.map((r) => PARTS[r.part]).sort();
  assert.deepEqual(covered, Object.keys(partColours('sky')).sort());
});

for (const row of examples(FEATURE, 'Colouring the sentence')) {
  test(`colouring the sentence at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    const parts = sentenceParts(hours, minutes);
    assert.equal(parts.map((p) => p.text).join(''), row.sentence);
    assert.equal(timeInWords(hours, minutes), row.sentence);
    assert.equal(words(parts, 'hour'), row['hour words']);
    assert.equal(words(parts, 'minute'), row['minute words']);
  });
}

test('every minute of the day: one hour part, matching the 12-hour clock, and minutes only when not on the hour', () => {
  for (let t = 0; t < 24 * 60; t++) {
    const hours = Math.floor(t / 60), minutes = t % 60;
    const parts = sentenceParts(hours, minutes);
    assert.equal(parts.filter((p) => p.kind === 'hour').length, 1);
    assert.equal(words(parts, 'hour'), twelveHourClock(hours, minutes).hourDigits);
    assert.equal(parts.filter((p) => p.kind === 'minute').length, minutes === 0 ? 0 : 1);
    if (minutes) assert.match(words(parts, 'minute'), new RegExp(`^${minutes} minutes?$`));
    for (const style of ['past', 'quarter']) {
      assert.equal(sentenceParts(hours, minutes, { style }).map((p) => p.text).join(''), timeInWords(hours, minutes, { style }));
    }
  }
});

for (const row of examples(FEATURE, 'Colouring the digits')) {
  test(`colouring the digits at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    const twelve = twelveHourClock(hours, minutes);
    assert.equal(twelve.hourDigits, row['12-hour hour']);
    assert.equal(twelve.minuteDigits, row.minutes);
    assert.equal(twelve.display, `${twelve.hourDigits}:${twelve.minuteDigits}`);
    const [h24, m24] = twentyFourHourClock(hours, minutes).split(':');
    assert.equal(h24, row['24-hour hour']);
    assert.equal(m24, row.minutes);
  });
}

for (const row of examples(FEATURE, 'Reading the minutes ring')) {
  test(`the minutes ring shows ${row.minutes} next to the ${row.number}`, () => {
    const mark = minutesRing().find((m) => m.at === Number(row.number));
    assert.equal(mark.minutes, Number(row.minutes));
  });
}

test('the minutes ring has the 12 numbers 0 to 55 in steps of 5', () => {
  assert.deepEqual(minutesRing().map((m) => m.minutes), [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
});

for (const row of examples(FEATURE, "Using the look's own colours")) {
  test(`${row.look} look's own colours`, () => {
    const look = LOOKS[lookId(row.look)];
    const p = pairInUse(lookId(row.look));
    assert.equal(p.id, 'theme');
    assertColourName(p.hour, row.hours);
    assertColourName(p.minute, row.minutes);
    assertColourName(look.accent, row.buttons);
  });
}

for (const row of examples(FEATURE, 'Picking other colours')) {
  test(`picking "${row.pair}"`, () => {
    const id = pairId(row.pair);
    for (const look of LOOK_IDS.filter((l) => pairsFor(l).some((p) => p.id === id))) {
      const p = pairInUse(look, id);
      if (row.hours === "look's hours") {
        assert.equal(p.hour, LOOKS[look].hc);
        assert.equal(p.minute, LOOKS[look].mc);
      } else {
        assert.equal(p.id, id);
        assertColourName(p.hour, row.hours);
        assertColourName(p.minute, row.minutes);
      }
    }
  });
}

test('the picker table lists every pair', () => {
  const names = examples(FEATURE, 'Picking other colours').map((r) => r.pair);
  assert.deepEqual(names, PAIRS.map((p) => p.name));
});

test('every look and every pair it offers is at least 4.5 : 1 on the face, the cards and the minutes ring', () => {
  for (const [lookIdValue, pair] of everyLookAndPair) {
    const look = LOOKS[lookIdValue];
    const c = partColours(lookIdValue, pair, true);
    const where = `${lookIdValue} · ${pair}`;
    for (const key of ['hourHand', 'hourNumbers', 'minuteHand']) {
      assert.ok(contrastRatio(c[key], look.face) >= 4.5, `${where} · ${key} on the face`);
    }
    for (const key of ['hourDigits', 'hourWords', 'minuteDigits', 'minuteWords', 'plainText']) {
      assert.ok(contrastRatio(c[key], look.card) >= 4.5, `${where} · ${key} on the card`);
    }
    assert.ok(contrastRatio(c.minutesRing, look.soft) >= 4.5, `${where} · minutes ring`);
  }
});

test('no hour or minute colour a look offers looks like its buttons', () => {
  for (const [look, pair] of everyLookAndPair) {
    const p = pairInUse(look, pair);
    assert.ok(!looksAlike(LOOKS[look].accent, p.hour), `${look} · ${pair} · hour`);
    assert.ok(!looksAlike(LOOKS[look].accent, p.minute), `${look} · ${pair} · minute`);
  }
});

test('Space uses lighter hour and minute colours on its dark cards, and the ordinary ones on the face', () => {
  for (const pair of pairsFor('space')) {
    const c = partColours('space', pair.id, true);
    const p = pairInUse('space', pair.id);
    assert.equal(c.hourDigits, p.hourOnDark);
    assert.equal(c.minuteWords, p.minuteOnDark);
    assert.equal(c.hourHand, p.hour);
    assert.equal(c.minuteHand, p.minute);
    assert.ok(contrastRatio(c.hourDigits, LOOKS.space.card) > contrastRatio(p.hour, LOOKS.space.card));
  }
  assert.ok(LOOKS.space.dark && !LOOKS.sky.dark);
});

test('the hour hand is shorter than the minute hand', () => {
  assert.ok(HOUR_HAND_LENGTH < MINUTE_HAND_LENGTH);
});

const OFF_PARTS = {
  'the short hour hand and its grip': ['hourHand'],
  'the long minute hand and its grip': ['minuteHand'],
  'the numbers 1 to 12 on the clock face': ['hourNumbers'],
  'the hour and minute digits': ['hourDigits', 'minuteDigits'],
  'the words of the sentence': ['hourWords', 'minuteWords', 'plainText'],
  'the minutes ring': ['minutesRing'],
};

const offRows = examples(FEATURE, 'Clock screen with the helpers off');
for (const row of offRows) {
  test(`helpers off: ${row.part} is ${row.shown}`, () => {
    for (const [look, pair] of everyLookAndPair) {
      const c = partColours(look, pair, false);
      for (const key of OFF_PARTS[row.part]) {
        const expected = {
          "in the clock's own ink": [LOOKS[look].tick, LOOKS[look].num],
          "plain text in the look's ink": [LOOKS[look].ink],
          gone: [null],
        }[row.shown];
        assert.ok(expected.includes(c[key]), `${look} · ${key} is ${c[key]}`);
      }
    }
  });
}

test('the helpers-off table covers every part', () => {
  assert.deepEqual(offRows.flatMap((r) => OFF_PARTS[r.part]).sort(), Object.keys(partColours('sky')).sort());
});

test('switching the helpers back on brings back the picked colours', () => {
  const off = partColours('hero', 'pink-teal', false);
  assert.equal(off.minutesRing, null);
  const on = partColours('hero', 'pink-teal', true);
  assertColourName(on.hourHand, 'pink');
  assertColourName(on.minuteHand, 'teal');
  assert.ok(on.minutesRing);
});
