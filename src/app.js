// Placeholder screen until the Clock Hub clock screen is built: the 12-hour
// time and the time in words, kept current.

import { fromDate, timeInWords, twelveHourClock } from './time.js';
import { startOffline } from './pwa.js';

const digital = document.getElementById('digital');
const words = document.getElementById('words');
let timer;

function render() {
  const { hours, minutes } = fromDate(new Date());
  const { display, period } = twelveHourClock(hours, minutes);
  digital.textContent = `${display} ${period}`;
  words.textContent = timeInWords(hours, minutes);
}

// Re-render just after each minute starts.
function scheduleNextMinute() {
  clearTimeout(timer);
  const now = new Date();
  const wait = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;
  timer = setTimeout(() => {
    render();
    scheduleNextMinute();
  }, wait);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    render();
    scheduleNextMinute();
  }
});

render();
scheduleNextMinute();
startOffline();
