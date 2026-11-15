// Time logic for the Learning Clock. Plain functions of hours (0-23) and
// minutes (0-59), with no DOM and no clock reading, so they are easy to test.
// Requirements: features/02 to 05 and 07.

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
export function timeInWords(hours, minutes, { style = 'past', partsOfDay = DEFAULT_PARTS_OF_DAY } = {}) {
  if (minutes === 0 && hours === 12) return "It is 12 o'clock midday.";
  if (minutes === 0 && hours === 0) return "It is 12 o'clock midnight.";

  const when = partOfDayPhrase(partOfDay(hours, minutes, partsOfDay));
  const hour = twelveHour(hours);
  const nextHour = twelveHour(hours + 1);

  let time;
  if (minutes === 0) {
    time = `${hour} o'clock`;
  } else if (style === 'quarter') {
    if (minutes === 15) time = `quarter past ${hour}`;
    else if (minutes === 30) time = `half past ${hour}`;
    else if (minutes === 45) time = `quarter to ${nextHour}`;
    else if (minutes < 30) time = `${minutesWord(minutes)} past ${hour}`;
    else time = `${minutesWord(60 - minutes)} to ${nextHour}`;
  } else {
    time = `${minutesWord(minutes)} past ${hour}`;
  }
  return `It is ${time} ${when}.`;
}

/** { display: "9:12", period: "AM" } */
export function twelveHourClock(hours, minutes) {
  return {
    display: `${twelveHour(hours)}:${String(minutes).padStart(2, '0')}`,
    period: hours < 12 ? 'AM' : 'PM',
  };
}

/** "09:12" */
export function twentyFourHourClock(hours, minutes) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
