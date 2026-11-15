// What every display on the clock screen shows, worked out from the clock's
// state, the time now and the settings. No DOM here, so it can be tested in
// Node; src/app.js puts the result on the screen.

import { handAngles, scene, sentenceParts, twelveHourClock, twentyFourHourClock } from './time.js';
import { isSetByHand, shownTime } from './set-clock.js';
import { partColours } from './colours.js';

/**
 * Everything the clock screen shows.
 * state: from set-clock.js (realClock() or a set time). now: a Date.
 * look/pair: the look and colour pair (colours.js). helpers: hour and minute
 * helpers on or off. wording: "past" or "quarter" (07-preferences.feature).
 */
export function clockView(state, now, { look = 'sky', pair = 'theme', helpers = true, wording = 'past' } = {}) {
  const wall = shownTime(state, now);
  const { hours, minutes } = wall;
  const twelve = twelveHourClock(hours, minutes);
  const time12 = `${twelve.display} ${twelve.period}`;
  const colours = partColours(look, pair, helpers);
  // With the helpers off the sentence is plain text, so no part is picked out.
  const wordColour = helpers ? { hour: colours.hourWords, minute: colours.minuteWords, plain: null } : {};

  return {
    wall,
    setByHand: isSetByHand(state),
    // The background follows the time shown, so it always agrees with the words.
    scene: scene(hours, minutes),
    helpers,
    colours,
    angles: handAngles(hours, minutes),
    twelve,
    time12,
    twentyFour: {
      hourDigits: String(hours).padStart(2, '0'),
      minuteDigits: twelve.minuteDigits,
      display: twentyFourHourClock(hours, minutes),
    },
    sentence: sentenceParts(hours, minutes, { style: wording }).map((p) => ({ text: p.text, colour: wordColour[p.kind] ?? null })),
    hourHandValue: Number(twelve.hourDigits),
    minuteHandValue: minutes,
    clockLabel: `Clock showing ${time12}. Drag a hand, or use the arrow keys on a hand, to change the time.`,
  };
}
