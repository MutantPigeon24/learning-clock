// Time logic for the Learning Clock. Plain functions of hours (0-23) and
// minutes (0-59), with no DOM and no clock reading, so they are easy to test.
// Requirements: features/02 to 05, 07 and 11.

/** When each part of the day starts (24-hour "HH:MM"). Shared with the scenes. */
export const DEFAULT_PARTS_OF_DAY = Object.freeze({
  morning: '05:00',
  afternoon: '12:00',
  evening: '17:00',
  night: '20:00',
});

/** When each background scene starts. Lines up with DEFAULT_PARTS_OF_DAY. */
export const DEFAULT_SCENES = Object.freeze({
  sunrise: '05:00',
  day: '07:00',
  sunset: '17:00',
  night: '20:00',
});

const PART_OF_DAY_PHRASES = {
  morning: 'in the morning',
  afternoon: 'in the afternoon',
  evening: 'in the evening',
  night: 'at night',
};

/** Hours and minutes from a Date, in the device's own time zone. */
export function fromDate(date) {
  return { hours: date.getHours(), minutes: date.getMinutes() };
}

function minutesSinceMidnight(text) {
  const [h, m] = text.split(':').map(Number);
  return h * 60 + m;
}

// Picks the period whose start is the latest one at or before the time.
// Before the earliest start, the last period of the day is still running.
function periodAt(hours, minutes, starts) {
  const now = hours * 60 + minutes;
  const sorted = Object.entries(starts)
    .map(([name, start]) => [name, minutesSinceMidnight(start)])
    .sort((a, b) => a[1] - b[1]);
  let current = sorted[sorted.length - 1][0];
  for (const [name, start] of sorted) {
    if (start <= now) current = name;
  }
  return current;
}

/** "morning", "afternoon", "evening" or "night". */
export function partOfDay(hours, minutes, partsOfDay = DEFAULT_PARTS_OF_DAY) {
  return periodAt(hours, minutes, partsOfDay);
}

/** "in the morning", ..., "at night". */
export function partOfDayPhrase(part) {
  return PART_OF_DAY_PHRASES[part];
}

/** "sunrise", "day", "sunset" or "night". */
export function scene(hours, minutes, scenes = DEFAULT_SCENES) {
  return periodAt(hours, minutes, scenes);
}

function twelveHour(hours) {
  return hours % 12 || 12;
}

function minutesWord(n) {
  return n === 1 ? '1 minute' : `${n} minutes`;
}

/**
 * The sentence shown on screen and read aloud,
 * e.g. "It is 45 minutes past 9 in the morning."
 *
 * style "past" (default): always "N minutes past H", no fractions.
 * style "quarter": quarter past, half past, quarter to, and "to" after 30.
 */
export function timeInWords(hours, minutes, options) {
  return sentenceParts(hours, minutes, options).map((p) => p.text).join('');
}

/**
 * The same sentence as timeInWords, in pieces, so the hour can be shown in the
 * hour colour and the minutes in the minute colour
 * (11-hour-and-minute-colours.feature). kind is "hour", "minute" or "plain".
 * [{ text: "It is ", kind: "plain" }, { text: "45 minutes", kind: "minute" }, ...]
 */
export function sentenceParts(hours, minutes, { style = 'past', partsOfDay = DEFAULT_PARTS_OF_DAY } = {}) {
  const plain = (text) => ({ text, kind: 'plain' });
  const hourPart = (h) => ({ text: String(h), kind: 'hour' });
  const minutePart = (text) => ({ text, kind: 'minute' });

  if (minutes === 0 && (hours === 12 || hours === 0)) {
    return [plain('It is '), hourPart(12), plain(` o'clock ${hours === 12 ? 'midday' : 'midnight'}.`)];
  }

  const when = partOfDayPhrase(partOfDay(hours, minutes, partsOfDay));
  const hour = twelveHour(hours);
  const nextHour = twelveHour(hours + 1);

  let time;
  if (minutes === 0) {
    time = [hourPart(hour), plain(" o'clock")];
  } else if (style === 'quarter') {
    if (minutes === 15) time = [minutePart('quarter'), plain(' past '), hourPart(hour)];
    else if (minutes === 30) time = [minutePart('half'), plain(' past '), hourPart(hour)];
    else if (minutes === 45) time = [minutePart('quarter'), plain(' to '), hourPart(nextHour)];
    else if (minutes < 30) time = [minutePart(minutesWord(minutes)), plain(' past '), hourPart(hour)];
    else time = [minutePart(minutesWord(60 - minutes)), plain(' to '), hourPart(nextHour)];
  } else {
    time = [minutePart(minutesWord(minutes)), plain(' past '), hourPart(hour)];
  }
  return [plain('It is '), ...time, plain(` ${when}.`)];
}

/**
 * { display: "9:12", period: "AM", hourDigits: "9", minuteDigits: "12" }
 * The hour and minute digits are given apart so each can take its colour.
 */
export function twelveHourClock(hours, minutes) {
  const hourDigits = String(twelveHour(hours));
  const minuteDigits = String(minutes).padStart(2, '0');
  return {
    display: `${hourDigits}:${minuteDigits}`,
    period: hours < 12 ? 'AM' : 'PM',
    hourDigits,
    minuteDigits,
  };
}

/** "09:12" */
export function twentyFourHourClock(hours, minutes) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * The numbers on the minutes ring, next to each clock number:
 * [{ at: 12, minutes: 0 }, { at: 1, minutes: 5 }, ..., { at: 11, minutes: 55 }]
 */
export function minutesRing() {
  return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((at) => ({ at, minutes: (at % 12) * 5 }));
}

/**
 * Angles of the analog clock hands in degrees, clockwise from 12.
 * The hour hand moves gradually between the numbers as the minutes pass.
 */
export function handAngles(hours, minutes) {
  return {
    hour: (hours % 12) * 30 + minutes * 0.5,
    minute: minutes * 6,
  };
}
