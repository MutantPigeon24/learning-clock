// The look and the hour and minute colours a child picks (10-looks.feature,
// 11-hour-and-minute-colours.feature): kept on the device, and what the look
// picker shows.

import { LOOK_IDS, LOOKS, PAIRS, pairInUse, pairsFor } from './colours.js';

export const LOOK_STORAGE_KEY = 'learning-clock:look';
const DEFAULT_CHOICE = Object.freeze({ look: 'sky', pair: 'theme' });

/**
 * A valid { look, pair } from whatever was stored (a JSON string, or
 * nothing). Anything missing, unknown or damaged takes the default. A pair
 * the look hides is kept, so it comes back when the child changes to a look
 * that allows it; pairInUse shows the look's own colours meanwhile.
 */
export function loadLookChoice(text) {
  let saved = {};
  try {
    saved = JSON.parse(text ?? '{}') ?? {};
  } catch {
    // damaged: use the defaults
  }
  return {
    look: LOOK_IDS.includes(saved.look) ? saved.look : DEFAULT_CHOICE.look,
    pair: PAIRS.some((p) => p.id === saved.pair) ? saved.pair : DEFAULT_CHOICE.pair,
  };
}

/** Reads the choice from storage (localStorage). Never throws. */
export function readLookChoice(storage) {
  try {
    return loadLookChoice(storage?.getItem(LOOK_STORAGE_KEY));
  } catch {
    return { ...DEFAULT_CHOICE };
  }
}

/** Keeps the choice in storage. Fails quietly, so a full or blocked store never stops the app. */
export function saveLookChoice(storage, choice) {
  try {
    storage?.setItem(LOOK_STORAGE_KEY, JSON.stringify({ look: choice.look, pair: choice.pair }));
  } catch {
    // the choice just isn't kept this time
  }
}

/**
 * What the look picker shows for a choice: the six looks, and the colour
 * pairs this look allows (none while the helpers are off). One of each is
 * marked as in use. Each pair has the hour and minute colours to draw.
 */
export function lookPicker(choice, helpers) {
  const inUse = pairInUse(choice.look, choice.pair).id;
  const look = LOOKS[choice.look];
  return {
    looks: LOOK_IDS.map((id) => ({ id, name: LOOKS[id].name, selected: id === choice.look })),
    pairs: helpers
      ? pairsFor(choice.look).map((p) => ({
          id: p.id,
          name: p.name,
          hour: p.h ?? look.hc,
          minute: p.m ?? look.mc,
          selected: p.id === inUse,
        }))
      : [],
  };
}
