// The look picker and each look's kit (10-looks.feature): what the picker
// shows (src/look-choice.js), keeping the child's choice on the device, and
// that every look has all its pictures and styles (src/look-art.js).
// The panel itself is checked by eye in a browser; see HANDOFF.md.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { LOOK_IDS, LOOKS, contrastRatio } from '../src/colours.js';
import { BADGES, cornerArt, LOOK_STYLES, lookStyleSheet, MOTIF_SPOTS, MOTIFS, ringArt } from '../src/look-art.js';
import { LOOK_STORAGE_KEY, loadLookChoice, lookPicker, readLookChoice, saveLookChoice } from '../src/look-choice.js';

/** A pretend localStorage. */
function fakeStorage(initial = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    getItem: (k) => (items.has(k) ? items.get(k) : null),
    setItem: (k, v) => items.set(k, String(v)),
  };
}

describe('Opening the look picker', () => {
  test('six tiles in order, with the look in use marked', () => {
    const { looks } = lookPicker({ look: 'dino', pair: 'theme' }, true);
    assert.deepEqual(looks.map((l) => l.name), ['Sky', 'Blossom', 'Unicorn', 'Hero', 'Dino', 'Space']);
    assert.deepEqual(looks.filter((l) => l.selected).map((l) => l.id), ['dino']);
  });

  test('each tile has its own picture, so it can be chosen without reading', () => {
    for (const id of LOOK_IDS) assert.match(BADGES[id], /^<circle /, id);
    assert.equal(new Set(LOOK_IDS.map((id) => BADGES[id])).size, LOOK_IDS.length);
  });

  test('every tile name is readable on its tile', () => {
    for (const id of LOOK_IDS) {
      assert.ok(contrastRatio(LOOKS[id].softInk, LOOKS[id].soft) >= 4.5, id);
    }
  });
});

describe('Hour and minute colours in the picker', () => {
  test("only the pairs the look allows, with the look's own pair first", () => {
    const { pairs } = lookPicker({ look: 'sky', pair: 'theme' }, true);
    assert.deepEqual(pairs.map((p) => p.id), ['theme', 'orange-purple', 'pink-teal', 'purple-orange']);
    assert.deepEqual(pairs[0], { id: 'theme', name: 'Match the look', hour: LOOKS.sky.hc, minute: LOOKS.sky.mc, selected: true });
  });

  test('the picked pair is marked', () => {
    const { pairs } = lookPicker({ look: 'hero', pair: 'pink-teal' }, true);
    assert.deepEqual(pairs.filter((p) => p.selected).map((p) => p.id), ['pink-teal']);
  });

  test("a picked pair the look hides shows as the look's own colours", () => {
    const { pairs } = lookPicker({ look: 'sky', pair: 'red-blue' }, true);
    assert.deepEqual(pairs.filter((p) => p.selected).map((p) => p.id), ['theme']);
  });

  test('no colours to pick while the helpers are off, but the looks are still there', () => {
    const view = lookPicker({ look: 'hero', pair: 'theme' }, false);
    assert.deepEqual(view.pairs, []);
    assert.equal(view.looks.length, 6);
  });
});

describe('Keeping the look', () => {
  test('a picked look and pair are there next time the app opens', () => {
    const storage = fakeStorage();
    saveLookChoice(storage, { look: 'dino', pair: 'pink-teal' });
    assert.deepEqual(readLookChoice(storage), { look: 'dino', pair: 'pink-teal' });
  });

  test('a pair the look hides is kept, for when the child changes look again', () => {
    assert.deepEqual(loadLookChoice('{"look":"sky","pair":"red-blue"}'), { look: 'sky', pair: 'red-blue' });
  });

  test('the first time, or with anything unknown or damaged, the defaults are used', () => {
    const defaults = { look: 'sky', pair: 'theme' };
    for (const text of [null, undefined, '', 'not json', 'null', '5', '[]', '{"look":"pirate","pair":"green-gold"}', '{"look":7}']) {
      assert.deepEqual(loadLookChoice(text), defaults, String(text));
    }
    assert.deepEqual(loadLookChoice('{"look":"space","pair":"nope"}'), { look: 'space', pair: 'theme' });
  });

  test('a blocked or full store never stops the app', () => {
    const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
    assert.deepEqual(readLookChoice(broken), { look: 'sky', pair: 'theme' });
    assert.doesNotThrow(() => saveLookChoice(broken, { look: 'dino', pair: 'theme' }));
    assert.deepEqual(readLookChoice(null), { look: 'sky', pair: 'theme' });
  });

  test('only the look and pair are stored, under one key', () => {
    const storage = fakeStorage();
    saveLookChoice(storage, { look: 'hero', pair: 'theme', extra: 'x' });
    assert.deepEqual([...storage.items.keys()], [LOOK_STORAGE_KEY]);
    assert.deepEqual(JSON.parse(storage.items.get(LOOK_STORAGE_KEY)), { look: 'hero', pair: 'theme' });
  });
});

describe("Each look's kit", () => {
  test('every look has a ring shape, two corner pictures, a motif and its styles', () => {
    const rings = ringArt(120, 'var(--soft)');
    const corners = cornerArt();
    for (const id of LOOK_IDS) {
      assert.ok(rings[id].length > 100, `${id} ring`);
      assert.ok(corners[id].tr.length > 100 && corners[id].bl.length > 100, `${id} corners`);
      assert.match(MOTIFS[id], /^M/, `${id} motif`);
      for (const key of ['deco', 'edge', 'body', 'cardFx', 'cardTex', 'btnFx', 'dfont']) assert.ok(LOOK_STYLES[id][key], `${id} ${key}`);
    }
    assert.deepEqual(Object.keys(rings), LOOK_IDS);
    assert.deepEqual(Object.keys(corners), LOOK_IDS);
  });

  test("the ring shape is filled with the look's soft colour, behind the minute numbers", () => {
    for (const [id, art] of Object.entries(ringArt(120, 'SOFT'))) assert.match(art, /fill:SOFT/, id);
  });

  test("things only seen by day can be faded by the scenes", () => {
    assert.match(cornerArt('opacity:0').sky.tr, /style="opacity:0"/);
  });

  test('the style sheet gives every look its card style, and Space a dark colour scheme', () => {
    const css = lookStyleSheet();
    for (const id of LOOK_IDS) {
      assert.ok(css.includes(`[data-look="${id}"] .card { ${LOOK_STYLES[id].cardFx}; }`), id);
    }
    assert.doesNotMatch(css, /font-family/, 'display fonts are for look names only');
    assert.match(css, /:root\[data-look="space"\] \{ color-scheme: dark; \}/);
    assert.equal((css.match(/color-scheme/g) ?? []).length, 1);
  });

  test('motifs stay on the screen', () => {
    for (const [left, top] of MOTIF_SPOTS) assert.ok(left >= 0 && left < 100 && top >= 0 && top < 100);
  });
});
