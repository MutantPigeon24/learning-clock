// The Clock Hub clock screen: what every display shows (src/clock-view.js),
// the clock face's drawing and finger maths (src/clock-face.js), and its
// sizes on every screen (clockHubLayout in src/layout.js).
// The page itself is checked by eye in a browser; see HANDOFF.md.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { clockView } from '../src/clock-view.js';
import { clockFaceMarkup, faceShare, facePoint, faceTransform, ringFontSize, VIEWBOX } from '../src/clock-face.js';
import { clockHubLayout, digitCardWidth, digitSize, layoutFor, screenSizes } from '../src/layout.js';
import { changeTime, CENTRE_DEAD_ZONE, dragHandTo, moveTime, nearestHand, pointerAngle, realClock, sameTime } from '../src/set-clock.js';
import { LOOKS, partColours } from '../src/colours.js';

const NOW = new Date(2026, 10, 15, 14, 20);
const setTo = (time) => {
  const { hours, minutes } = parseTime(time);
  return { setByHand: true, wall: { year: 2026, month: 11, day: 15, hours, minutes } };
};
const sentenceText = (view) => view.sentence.map((p) => p.text).join('');

describe('Every display shows the same time', () => {
  for (const row of examples('03-digital-clocks.feature', 'Writing the time on the 12-hour clock')) {
    test(`12-hour clock at ${row.time}`, () => {
      const view = clockView(setTo(row.time), NOW);
      assert.equal(view.time12, `${row.display} ${row.label}`);
      assert.equal(`${view.twelve.hourDigits}:${view.twelve.minuteDigits}`, row.display);
    });
  }

  for (const row of examples('03-digital-clocks.feature', 'Writing the time on the 24-hour clock')) {
    test(`24-hour clock at ${row.time}`, () => {
      const { twentyFour } = clockView(setTo(row.time), NOW);
      assert.equal(`${twentyFour.hourDigits}:${twentyFour.minuteDigits}`, row.display);
      assert.equal(twentyFour.display, row.display);
    });
  }

  test('a set time of 09:45 shows on the hands, both digital clocks and the words', () => {
    const view = clockView(setTo('09:45'), NOW);
    assert.deepEqual(view.angles, { hour: 292.5, minute: 270 });
    assert.equal(view.time12, '9:45 AM');
    assert.equal(view.twentyFour.display, '09:45');
    assert.equal(sentenceText(view), 'It is 45 minutes past 9 in the morning.');
    assert.equal(view.setByHand, true);
  });

  test('the real time follows the device, and the "Now" sign shows', () => {
    const view = clockView(realClock(), NOW);
    assert.equal(view.twentyFour.display, '14:20');
    assert.equal(view.setByHand, false);
  });

  test('a set time does not tick as real minutes pass', () => {
    const later = new Date(2026, 10, 15, 16, 5);
    assert.deepEqual(clockView(setTo('09:45'), NOW), clockView(setTo('09:45'), later));
  });

  test('the other wording style is used when a grown-up picks it', () => {
    assert.equal(sentenceText(clockView(setTo('09:45'), NOW, { wording: 'quarter' })), 'It is quarter to 10 in the morning.');
  });

  test('screen readers hear the time on the clock and on each hand', () => {
    const view = clockView(setTo('21:05'), NOW);
    assert.equal(view.hourHandValue, 9);
    assert.equal(view.minuteHandValue, 5);
    assert.equal(view.time12, '9:05 PM');
    assert.match(view.clockLabel, /^Clock showing 9:05 PM\./);
  });

  test('the hour hand reads 12 at midday and midnight, not 0', () => {
    assert.equal(clockView(setTo('00:30'), NOW).hourHandValue, 12);
    assert.equal(clockView(setTo('12:30'), NOW).hourHandValue, 12);
  });
});

describe('Hours and minutes linked by colour', () => {
  const sky = partColours('sky');
  for (const row of examples('11-hour-and-minute-colours.feature', 'Colouring the sentence')) {
    test(`the sentence at ${row.time}`, () => {
      const view = clockView(setTo(row.time), NOW);
      assert.equal(sentenceText(view), row.sentence);
      const inColour = (colour) => view.sentence.filter((p) => p.colour === colour).map((p) => p.text);
      assert.deepEqual(inColour(sky.hourWords), [row['hour words']]);
      assert.deepEqual(inColour(sky.minuteWords), row['minute words'] === 'nothing' ? [] : [row['minute words']]);
    });
  }

  test('helpers off: the sentence is plain text and the digits are in the look\'s ink', () => {
    const view = clockView(setTo('09:45'), NOW, { helpers: false });
    assert.ok(view.sentence.every((p) => p.colour === null));
    assert.equal(view.colours.hourDigits, LOOKS.sky.ink);
    assert.equal(view.colours.minuteDigits, LOOKS.sky.ink);
    assert.equal(view.colours.minutesRing, null);
    assert.equal(view.helpers, false);
  });
});

describe('The clock face', () => {
  const svg = clockFaceMarkup();
  const texts = (part) => [...svg.split(`data-part="${part}"`)[1].split('</g>')[0].matchAll(/>(\d+)<\/text>/g)].map((m) => Number(m[1]));

  test('has the numbers 12, 1, 2 … 11 going round from the top', () => {
    assert.deepEqual(texts('hour-numbers'), [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  test('has the minutes ring 0, 5 … 55 going round from the top', () => {
    assert.deepEqual(texts('ring-numbers'), [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  });

  test('has 60 minute marks and only an hour hand and a minute hand', () => {
    assert.equal(svg.split('<g class="ticks"')[1].split('</g>')[0].match(/<line /g).length, 60);
    assert.deepEqual([...svg.matchAll(/data-hand="(\w+)"/g)].map((m) => m[1]), ['hour', 'minute']);
  });

  test('each hand is a slider a keyboard can reach, with its name and range', () => {
    assert.match(svg, /data-hand="hour" role="slider" tabindex="0" aria-label="Hour hand" aria-valuemin="1" aria-valuemax="12"/);
    assert.match(svg, /data-hand="minute" role="slider" tabindex="0" aria-label="Minute hand" aria-valuemin="0" aria-valuemax="59"/);
  });

  test('the hour hand is shorter and thicker, with a bigger grip', () => {
    const hand = (name) => svg.split(`data-hand="${name}"`)[1];
    const tipOf = (h) => Number(h.match(/y2="([\d.]+)"/)[1]);
    const widthOf = (h) => Number(h.match(/data-part="\w+-colour"[^>]*stroke-width="([\d.]+)"/)[1]);
    const gripOf = (h) => Number(h.match(/data-part="\w+-grip"[^>]*r="([\d.]+)"/)[1]);
    assert.ok(tipOf(hand('hour')) > tipOf(hand('minute')), 'hour tip is further from the top');
    assert.ok(widthOf(hand('hour')) > widthOf(hand('minute')));
    assert.ok(gripOf(hand('hour')) > gripOf(hand('minute')));
  });

  test('the face grows to fill the space when the ring is hidden', () => {
    assert.equal(faceShare(true), 0.8);
    assert.ok(Math.abs(faceShare(false) - 0.96) < 1e-9);
    assert.equal(faceTransform(true), '');
    assert.match(faceTransform(false), /scale\(1\.2\)/);
  });

  for (const helpers of [true, false]) {
    test(`a finger is measured in face radii (helpers ${helpers ? 'on' : 'off'})`, () => {
      const rect = { left: 100, top: 50, width: 480, height: 480 };
      const radius = 240 * faceShare(helpers);
      assert.deepEqual(facePoint(340, 290, rect, helpers), { x: 0, y: 0 });
      const top = facePoint(340, 290 - radius, rect, helpers);
      assert.ok(Math.abs(top.x) < 1e-9 && Math.abs(top.y + 1) < 1e-9, 'the top of the face is (0, -1)');
      assert.equal(pointerAngle(facePoint(340 + radius, 290, rect, helpers)), 90);
    });
  }

  test('touching the end of the minute hand picks it up, with the ring on or off', () => {
    const wall = { year: 2026, month: 11, day: 15, hours: 3, minutes: 0 }; // minute hand at the 12
    const rect = { left: 0, top: 0, width: 480, height: 480 };
    for (const helpers of [true, false]) {
      const tipY = 240 - 0.75 * 240 * faceShare(helpers);
      assert.equal(nearestHand(wall, facePoint(240, tipY, rect, helpers)), 'minute');
      assert.equal(nearestHand(wall, facePoint(240 + 0.4 * 240 * faceShare(helpers), 240, rect, helpers)), 'hour');
    }
  });

  test('the ring numbers are 16 px or more on screen at any clock size', () => {
    for (let px = 120; px <= 1200; px += 7) {
      assert.ok((ringFontSize(px) * px) / VIEWBOX >= 16 - 1e-9, `${px} px clock`);
    }
  });
});

describe('Setting the time', () => {
  test('a touch that does not move the time leaves the clock showing the real time', () => {
    const wall = { year: 2026, month: 11, day: 15, hours: 14, minutes: 20 };
    assert.ok(sameTime(wall, { ...wall }));
    assert.ok(!sameTime(wall, { ...wall, minutes: 21 }));
    assert.ok(!sameTime(wall, { ...wall, day: 16 }));
  });

  test('touching the clock without moving the time leaves it following the real time', () => {
    const live = realClock();
    assert.equal(moveTime(live, NOW, (w) => w), live);
    assert.equal(moveTime(live, NOW, (w) => dragHandTo(w, 'minute', { x: 0, y: -0.75 })).setByHand, true, 'the minute hand moved from 20 to 0');
    assert.equal(moveTime(live, NOW, (w) => dragHandTo(w, 'minute', { x: 0.866, y: 0.5 })), live, 'the minute hand is already at 20');
  });

  test('a finger at the very centre does not move a hand', () => {
    const wall = { year: 2026, month: 11, day: 15, hours: 14, minutes: 20 };
    const near = CENTRE_DEAD_ZONE / 2;
    assert.deepEqual(dragHandTo(wall, 'minute', { x: near, y: 0 }), wall);
    assert.deepEqual(dragHandTo(wall, 'hour', { x: 0, y: -near }), wall);
  });

  test('dragging each hand follows the finger', () => {
    const wall = { year: 2026, month: 11, day: 15, hours: 14, minutes: 20 };
    assert.deepEqual(dragHandTo(wall, 'minute', { x: 0.8, y: 0 }), { ...wall, minutes: 15 }, 'minute hand to the 3');
    assert.deepEqual(dragHandTo(wall, 'hour', { x: -0.5, y: 0 }), { ...wall, hours: 9 }, 'hour hand to the 9, the short way back');
  });

  test('dragging the hands back to the real time still counts as set by hand', () => {
    const state = moveTime(setTo('09:45'), NOW, (w) => ({ ...w, hours: 14, minutes: 20 }));
    assert.equal(state.setByHand, true);
    assert.equal(clockView(state, NOW).setByHand, true);
  });

  test('a change gives a set time that every display follows', () => {
    const state = changeTime(realClock(), NOW, (w) => ({ ...w, hours: 9, minutes: 45 }));
    assert.equal(clockView(state, NOW).time12, '9:45 AM');
  });
});

describe('Sizes on every screen', () => {
  const screens = examples('00-learning-clock.feature', "Picking the layout from the screen's shape");
  const extra = [{ width: '1920', height: '1080' }, { width: '1024', height: '1366' }, { width: '640', height: '360' }, { width: '360', height: '640' }];

  for (const row of [...screens, ...extra]) {
    const W = Number(row.width);
    const H = Number(row.height);
    test(`${W} × ${H}: the clock and its AM/PM switch fit, beside or above the rest`, () => {
      const l = clockHubLayout(W, H);
      assert.equal(l.shape, layoutFor(W, H).shape);
      assert.ok(l.clock > 0);
      assert.ok(l.clock + l.ampH + l.gap + 2 * l.pad <= H, 'fits the height');
      if (l.shape === 'tall') {
        assert.ok(l.clock <= W - 2 * l.px, 'fits the width');
      } else {
        assert.equal(l.clock + l.side + 2 * l.gap, W - 2 * l.px, 'clock and the column beside it fill the width');
      }
    });
  }

  for (const row of screens.filter((r) => layoutFor(Number(r.width), Number(r.height)).shape === 'wide')) {
    const W = Number(row.width);
    const H = Number(row.height);
    test(`${W} × ${H} (wide): the digital clocks keep 60 % or more of their full size`, () => {
      const l = clockHubLayout(W, H);
      assert.ok(l.digits >= Math.min(l.fd, Math.max(30, Math.round(0.6 * l.fd))), `digits ${l.digits} of ${l.fd}`);
    });
  }

  test('digitCardWidth is the reverse of digitSize', () => {
    for (const [W, H] of [[1280, 800], [412, 915], [1920, 1080]]) {
      const z = screenSizes(W, H);
      for (let fd = 20; fd <= 100; fd += 7) assert.ok(digitSize(z, digitCardWidth(z, fd), z.cp, 999) >= fd);
    }
  });
});
