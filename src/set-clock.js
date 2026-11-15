// Setting the clock by hand: dragging the hands, the AM/PM switch, and
// switching between the real time and a set time. Requirements:
// features/08-set-the-clock.feature.
//
// Times here are "wall times": { year, month (1-12), day, hours, minutes }
// as shown on the clock, with no time zone. Keeping the date as well means
// going past midnight changes the day, ready for the future calendar
// (features/09-calendar.feature).

/** Lengths of the hands as a fraction of the clock face's radius. */
export const HOUR_HAND_LENGTH = 0.5;
export const MINUTE_HAND_LENGTH = 0.8;

/** The wall time of a Date, in the device's own time zone. */
export function wallFromDate(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

/**
 * Moves a wall time on (or back, if negative) by whole minutes, rolling over
 * days, months and years. Uses UTC maths so daylight saving can't skip or
 * repeat an hour on the clock face.
 */
export function addMinutes(wall, minutes) {
  const ms = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hours, wall.minutes) + minutes * 60_000;
  const d = new Date(ms);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
  };
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

/** The nearest whole minute (0-59) for an angle in degrees clockwise from 12. */
export function angleToMinute(angle) {
  return mod(Math.round(angle / 6), 60);
}

/**
 * The angle of a point on the clock face, in degrees clockwise from 12.
 * The point is relative to the centre, with y pointing down as on screen.
 */
export function pointerAngle({ x, y }) {
  return mod((Math.atan2(x, -y) * 180) / Math.PI, 360);
}

/**
 * Follows the minute hand to a new angle. The change is taken the short way
 * round, so a drag made of many small moves can go past the 12 (changing the
 * hour, and between AM and PM) or round as many times as it likes.
 */
export function dragMinuteHand(wall, angle) {
  const target = angleToMinute(angle);
  const change = mod(target - wall.minutes + 30, 60) - 30;
  return addMinutes(wall, change);
}

/**
 * Follows the hour hand to a new angle. The hour changes the short way round
 * and the minutes stay the same.
 */
export function dragHourHand(wall, angle) {
  const target = mod(Math.round((angle - wall.minutes * 0.5) / 30), 12);
  const change = mod(target - (wall.hours % 12) + 6, 12) - 6;
  return addMinutes(wall, change * 60);
}

/** Swaps between AM and PM on the same day. The hands don't move. */
export function swapAmPm(wall) {
  return { ...wall, hours: (wall.hours + 12) % 24 };
}

function distanceToHand(point, angle, length) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const along = Math.max(0, Math.min(length, point.x * dx + point.y * dy));
  return Math.hypot(point.x - along * dx, point.y - along * dy);
}

/**
 * Which hand a finger at this point picks up: the closer one. The point is
 * relative to the centre in units of the face's radius, with y pointing down.
 * If both are equally close (the hands overlap), the hour hand wins, so the
 * minute hand is picked up past the end of the hour hand.
 */
export function nearestHand(wall, point) {
  const hourAngle = (wall.hours % 12) * 30 + wall.minutes * 0.5;
  const minuteAngle = wall.minutes * 6;
  const toHour = distanceToHand(point, hourAngle, HOUR_HAND_LENGTH);
  const toMinute = distanceToHand(point, minuteAngle, MINUTE_HAND_LENGTH);
  return toMinute < toHour ? 'minute' : 'hour';
}

/**
 * How far a key moves the time when a hand has the keyboard focus, in minutes,
 * or 0 for any other key (so Tab and the rest work as normal). The arrow keys
 * move the minute hand 1 minute and the hour hand 1 hour. Page up and page
 * down move the minute hand 5 minutes (the gap between two numbers on the
 * clock) and the hour hand 1 hour. Keys are KeyboardEvent.key values.
 */
export function handKeyStep(hand, key) {
  const forward = key === 'ArrowRight' || key === 'ArrowUp';
  const back = key === 'ArrowLeft' || key === 'ArrowDown';
  const jump = key === 'PageUp' ? 1 : key === 'PageDown' ? -1 : 0;
  if (hand === 'hour') return 60 * (forward ? 1 : back ? -1 : jump);
  return forward ? 1 : back ? -1 : 5 * jump;
}

/** The time after a key press on a hand. The hands stay in step, as when dragging. */
export function moveHandByKey(wall, hand, key) {
  return addMinutes(wall, handKeyStep(hand, key));
}

// --- Real time or set by hand ----------------------------------------------

/** The clock following the device's real time. Also used for "back to now". */
export function realClock() {
  return { setByHand: false };
}

/** True when the clock shows a time set by hand. */
export function isSetByHand(state) {
  return state.setByHand;
}

/** The wall time every display should show. A set time never ticks. */
export function shownTime(state, now) {
  return state.setByHand ? state.wall : wallFromDate(now);
}

/**
 * Applies a change (a drag or the AM/PM switch) to the time being shown.
 * The result is always set by hand, even if it happens to match the real time.
 */
export function changeTime(state, now, change) {
  return { setByHand: true, wall: change(shownTime(state, now)) };
}
