// The look picker panel (10-looks.feature): six picture tiles, then the hour
// and minute colours the look allows. A pick applies straight away. What the
// panel shows comes from lookPicker in look-choice.js; this file only puts it
// on the page.
//
// It is a native <dialog> opened with showModal(), so the browser keeps the
// focus inside it, closes it on Escape and makes the screen behind inert.

import { LOOKS } from './colours.js';
import { BADGES, LOOK_STYLES } from './look-art.js';
import { lookPicker } from './look-choice.js';

const $ = (id) => document.getElementById(id);

function lookTile({ id, name }) {
  const look = LOOKS[id];
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'look-tile';
  button.dataset.lookId = id;
  button.style.setProperty('--tile-bg', look.soft);
  button.style.setProperty('--tile-ink', look.softInk);
  button.style.setProperty('--tile-edge', look.accent);
  button.innerHTML = `<svg class="look-badge" viewBox="0 0 100 100" aria-hidden="true">${BADGES[id]}</svg>`;
  const label = document.createElement('span');
  label.className = 'look-name';
  label.style.fontFamily = LOOK_STYLES[id].dfont;
  label.textContent = name;
  button.append(label);
  return button;
}

function pairTile({ id, name, hour, minute, selected }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pair-tile';
  button.dataset.pairId = id;
  button.setAttribute('aria-pressed', String(selected));
  // A short thick hour hand and a long thin minute hand in the pair's colours.
  button.innerHTML = `<svg class="pair-hands" viewBox="0 0 64 32" aria-hidden="true"><line x1="6" y1="10" x2="34" y2="10" stroke-width="9" stroke-linecap="round" stroke="${hour}"/><line x1="6" y1="24" x2="58" y2="24" stroke-width="5" stroke-linecap="round" stroke="${minute}"/></svg>`;
  const label = document.createElement('span');
  label.textContent = name;
  button.append(label);
  return button;
}

/**
 * Wires up the picker. getChoice/getHelpers read the app's state; onPick is
 * called with the new { look, pair }. Returns { open, refresh }.
 */
export function setUpLookPicker({ getChoice, getHelpers, onPick }) {
  const dialog = $('look-picker');
  const opener = $('look-button');
  const lookTiles = $('look-tiles');
  const pairTiles = $('pair-tiles');

  lookTiles.replaceChildren(...lookPicker(getChoice(), true).looks.map(lookTile));

  function refresh() {
    const view = lookPicker(getChoice(), getHelpers());
    for (const { id, selected } of view.looks) {
      lookTiles.querySelector(`[data-look-id="${id}"]`).setAttribute('aria-pressed', String(selected));
    }
    $('pair-section').hidden = view.pairs.length === 0;
    pairTiles.replaceChildren(...view.pairs.map(pairTile));
  }

  function open() {
    refresh();
    dialog.showModal();
    lookTiles.querySelector('[aria-pressed="true"]')?.focus();
  }

  lookTiles.addEventListener('click', (e) => {
    const id = e.target.closest('[data-look-id]')?.dataset.lookId;
    if (id) onPick({ ...getChoice(), look: id });
  });
  pairTiles.addEventListener('click', (e) => {
    const id = e.target.closest('[data-pair-id]')?.dataset.pairId;
    if (!id) return;
    onPick({ ...getChoice(), pair: id });
    pairTiles.querySelector(`[data-pair-id="${id}"]`)?.focus(); // the tiles were rebuilt
  });

  $('look-picker-close').addEventListener('click', () => dialog.close());
  // A tap on the dimmed screen outside the panel closes it too.
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dialog.close();
  });
  dialog.addEventListener('close', () => opener.focus());
  opener.addEventListener('click', open);

  return { open, refresh };
}
