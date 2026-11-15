// The Clock Hub clock screen: puts clockView on the page in the child's
// look, lays it out for the screen's shape, and handles dragging the hands,
// the keyboard, the AM/PM switch, "Back to now" and the look picker. The logic lives in the modules it imports;
// this file only connects them to the page.

import { LOOKS } from './colours.js';
import { cornerArt, LOOK_STYLES, lookStyleSheet, MOTIF_SPOTS, MOTIFS, ringArt } from './look-art.js';
import { readLookChoice, saveLookChoice } from './look-choice.js';
import { setUpLookPicker } from './look-picker.js';
import { clockHubLayout } from './layout.js';
import { defaultSettings } from './settings.js';
import { dragHandTo, handKeyStep, moveHandByKey, moveTime, nearestHand, realClock, shownTime, swapAmPm } from './set-clock.js';
import { clockFaceMarkup, facePoint, faceTransform, ringFontSize, VIEWBOX } from './clock-face.js';
import { clockView } from './clock-view.js';
import { startOffline } from './pwa.js';

// The grown-up settings are fixed at their defaults until the settings
// panel is built.
const CENTRE = VIEWBOX / 2;
const settings = defaultSettings();

// localStorage can be missing or blocked; the app then just doesn't remember.
const storage = (() => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
})();

const $ = (id) => document.getElementById(id);
const screen = $('screen');
const layout = $('layout');
$('clock').innerHTML = clockFaceMarkup();
const face = document.querySelector('.clock-face');
// The parts of the clock that change, looked up once: parts.ring, parts['hour-turn'] ...
const parts = Object.fromEntries([...face.querySelectorAll('[data-part]')].map((el) => [el.dataset.part, el]));
const hands = { hour: face.querySelector('[data-hand="hour"]'), minute: face.querySelector('[data-hand="minute"]') };

let state = realClock();
let drag = null; // { hand, pointerId } while a hand is held
let choice = readLookChoice(storage); // { look, pair } the child picked

const options = () => ({ look: choice.look, pair: choice.pair, helpers: settings.helpers, wording: settings.wording });

// --- Colours and layout -----------------------------------------------------

const CSS_COLOURS = {
  card: 'card', ink: 'ink', sub: 'sub', accent: 'accent', onAccent: 'on-accent', ctl: 'ctl',
  soft: 'soft', softInk: 'soft-ink', face: 'face', rim: 'rim', tick: 'tick',
};

const RING_ART = ringArt(CENTRE, 'var(--soft)');
const CORNER_ART = cornerArt();

// The look's two corner pictures and its motifs, sized by CSS variables.
function decorMarkup(lookId) {
  const corners = CORNER_ART[lookId];
  const motifs = MOTIF_SPOTS.map(
    ([left, top, size, turn]) => `<svg class="motif" viewBox="0 0 24 24" style="left:${left}%;top:${top}%;--motif:${size}px;transform:rotate(${turn}deg)"><path d="${MOTIFS[lookId]}" fill="${LOOK_STYLES[lookId].deco}"/></svg>`,
  );
  return `<svg class="corner corner-top" viewBox="0 0 200 200">${corners.tr}</svg><svg class="corner corner-bottom" viewBox="0 0 200 200">${corners.bl}</svg>${motifs.join('')}`;
}

/** Dresses the whole screen in a look: colours, cards, ring shape and pictures. */
function applyLook(lookId) {
  const look = LOOKS[lookId];
  const root = document.documentElement;
  root.dataset.look = lookId;
  for (const [key, name] of Object.entries(CSS_COLOURS)) {
    root.style.setProperty(`--${name}`, look[key]);
  }
  document.querySelector('meta[name="theme-color"]').content = look.accent;
  parts['ring-dress'].innerHTML = RING_ART[lookId];
  $('decor').innerHTML = decorMarkup(lookId);
}

const SIZE_VARS = {
  pad: 'pad', px: 'px', gap: 'gap', btn: 'btn', kid: 'kid', fs: 'fs', fl: 'fl', r: 'r',
  ampH: 'amp-h', cp: 'cp', clock: 'clock', digits: 'fd',
};

/** Picks the layout and sizes from the space inside the safe area. */
function applyLayout() {
  const pad = getComputedStyle(screen);
  const width = screen.clientWidth - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight);
  const height = screen.clientHeight - parseFloat(pad.paddingTop) - parseFloat(pad.paddingBottom);
  const sizes = clockHubLayout(width, height);
  layout.dataset.shape = sizes.shape;
  layout.toggleAttribute('data-small', sizes.phone);
  for (const [key, name] of Object.entries(SIZE_VARS)) {
    layout.style.setProperty(`--${name}`, `${sizes[key]}px`);
  }
  layout.style.setProperty('--s', String(sizes.S));
  // The corner pictures and motifs are sized from the whole screen.
  const short = Math.min(screen.clientWidth, screen.clientHeight);
  document.documentElement.style.setProperty('--corner', `${Math.round(short * (sizes.phone ? 0.26 : 0.22))}px`);
  document.documentElement.style.setProperty('--motif-scale', String(Math.max(0.6, sizes.S)));
}

// The ring numbers stay 16 px or more on screen, whatever size the clock is.
function fitRingNumbers() {
  const width = face.getBoundingClientRect().width;
  if (width > 0) parts['ring-numbers'].setAttribute('font-size', String(ringFontSize(width)));
}

// --- Showing the time -------------------------------------------------------

function setDigits(hourId, minuteId, hourText, minuteText, colours) {
  const hour = $(hourId);
  const minute = $(minuteId);
  hour.textContent = hourText;
  hour.style.color = colours.hourDigits;
  minute.textContent = minuteText;
  minute.style.color = colours.minuteDigits;
}

function render() {
  const view = clockView(state, new Date(), options());
  const { colours } = view;

  // Analog clock
  face.setAttribute('aria-label', view.clockLabel);
  parts.ring.style.display = view.helpers ? '' : 'none';
  parts['ring-numbers'].style.fill = colours.minutesRing ?? '';
  parts.face.setAttribute('transform', faceTransform(view.helpers));
  parts['hour-numbers'].style.fill = colours.hourNumbers;
  parts['hour-turn'].setAttribute('transform', `rotate(${view.angles.hour} ${CENTRE} ${CENTRE})`);
  parts['minute-turn'].setAttribute('transform', `rotate(${view.angles.minute} ${CENTRE} ${CENTRE})`);
  parts['hour-colour'].style.stroke = colours.hourHand;
  parts['hour-grip'].style.fill = colours.hourHand;
  parts['minute-colour'].style.stroke = colours.minuteHand;
  parts['minute-grip'].style.fill = colours.minuteHand;
  parts.centre.style.fill = colours.hourHand;
  hands.hour.setAttribute('aria-valuenow', String(view.hourHandValue));
  hands.minute.setAttribute('aria-valuenow', String(view.minuteHandValue));
  for (const hand of Object.values(hands)) hand.setAttribute('aria-valuetext', view.time12);

  // AM/PM switch
  $('ampm').setAttribute('aria-label', `AM or PM switch. Showing ${view.twelve.period}`);
  for (const option of document.querySelectorAll('.ampm-option')) {
    option.classList.toggle('on', option.dataset.period === view.twelve.period);
  }

  // Digital clocks
  setDigits('h12', 'm12', view.twelve.hourDigits, view.twelve.minuteDigits, colours);
  $('period').textContent = view.twelve.period;
  setDigits('h24', 'm24', view.twentyFour.hourDigits, view.twentyFour.minuteDigits, colours);

  // Words
  $('sentence').replaceChildren(
    ...view.sentence.map(({ text, colour }) => {
      if (!colour) return document.createTextNode(text);
      const span = document.createElement('span');
      span.className = 'linked';
      span.style.color = colour;
      span.textContent = text;
      return span;
    }),
  );

  // Now sign or "Back to now"
  $('now-sign').hidden = view.setByHand;
  $('back-to-now').hidden = !view.setByHand;
}

/** Changes the time shown. A change that gives the same time does nothing. */
function change(fn) {
  const next = moveTime(state, new Date(), fn);
  if (next === state) return;
  state = next;
  render();
}

// --- Dragging the hands ------------------------------------------------------

const pointOf = (e) => facePoint(e.clientX, e.clientY, face.getBoundingClientRect(), settings.helpers);

face.addEventListener('pointerdown', (e) => {
  if (drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
  try {
    face.setPointerCapture(e.pointerId);
  } catch {
    return; // the pointer has already gone
  }
  e.preventDefault();
  drag = { hand: nearestHand(shownTime(state, new Date()), pointOf(e)), pointerId: e.pointerId };
  face.classList.add('dragging');
});

face.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.pointerId) return;
  const point = pointOf(e);
  change((wall) => dragHandTo(wall, drag.hand, point));
});

// The capture ends on pointerup and pointercancel, and also whenever the
// browser takes it away, so the hands can never be left stuck.
face.addEventListener('lostpointercapture', (e) => {
  if (!drag || e.pointerId !== drag.pointerId) return;
  drag = null;
  face.classList.remove('dragging');
});

// --- Keyboard on the hands ---------------------------------------------------

face.addEventListener('keydown', (e) => {
  const hand = e.target.closest?.('[data-hand]')?.dataset.hand;
  if (!hand || handKeyStep(hand, e.key) === 0) return; // Tab and other keys work as normal
  e.preventDefault();
  change((wall) => moveHandByKey(wall, hand, e.key));
});

// --- Buttons -----------------------------------------------------------------

$('ampm').addEventListener('click', () => change(swapAmPm));

$('back-to-now').addEventListener('click', () => {
  state = realClock();
  render();
  $('now-sign').focus(); // the button has gone, so keep the focus in the same place
});

// --- Keeping the time current -----------------------------------------------

let timer;
// Re-render just after each minute starts. A set time doesn't change.
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
// Turning the tablet, resizing a window or a change in the safe area.
new ResizeObserver(applyLayout).observe(screen);
new ResizeObserver(fitRingNumbers).observe(face);

// --- The look picker ---------------------------------------------------------

const picker = setUpLookPicker({
  getChoice: () => choice,
  getHelpers: () => settings.helpers,
  onPick(next) {
    choice = next;
    saveLookChoice(storage, choice);
    applyLook(choice.look);
    render();
    picker.refresh();
  },
});
$('look-button').hidden = !settings.childrenCanChangeLook;

// --- Start -------------------------------------------------------------------

const lookStyles = document.createElement('style');
lookStyles.textContent = lookStyleSheet();
document.head.append(lookStyles);

applyLook(choice.look);
applyLayout();
fitRingNumbers();
render();
scheduleNextMinute();
startOffline();
