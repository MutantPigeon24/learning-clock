// The look and the hour and minute colours a child picks (10-looks.feature,
// 11-hour-and-minute-colours.feature): kept on the device, and what the look
// picker shows.

import { LOOK_IDS, LOOKS, PAIRS, pairInUse, pairsFor } from './colours.js';
import { readStored, writeStored } from './storage.js';

export const LOOK_STORAGE_KEY = 'learning-clock:look';
const DEFAULT_CHOICE = Object.freeze({ look: 'sky', pair: 'theme' });

/**
 * A valid { look, pair } from whatever was stored. Anything missing, unknown
 * or damaged takes the default. A pair the look hides is kept, so it comes
 * back when the child changes to a look that allows it; pairInUse shows the
 * look's own colours meanwhile.
 */
export function loadLookChoice(saved) {
  const choice = saved && typeof saved === 'object' ? saved : {};
  return {
    look: LOOK_IDS.includes(choice.look) ? choice.look : DEFAULT_CHOICE.look,
    pair: PAIRS.some((p) => p.id === choice.pair) ? choice.pair : DEFAULT_CHOICE.pair,
  };
}

/** Reads the choice from storage (see storage.js). */
export function readLookChoice(storage) {
  return loadLookChoice(readStored(storage, LOOK_STORAGE_KEY));
}

/** Keeps the choice in storage. */
export function saveLookChoice(storage, choice) {
  writeStored(storage, LOOK_STORAGE_KEY, { look: choice.look, pair: choice.pair });
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
