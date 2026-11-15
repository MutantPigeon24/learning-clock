// The grown-up panel (07-preferences.feature): what it shows (settingRows,
// entryDisplay), keeping settings on the device (readSettings,
// saveSettings, storage.js) and closing on a tap outside (panel.js).
// The panel itself is checked by eye in a browser; see HANDOFF.md.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { brokenStorage, fakeStorage } from './support/fake-storage.js';
import { examples } from './support/gherkin-examples.js';
import { defaultSettings, readSettings, sameSettings, saveSettings, settingRows, SETTINGS, SETTINGS_STORAGE_KEY } from '../src/settings.js';
import { entryDisplay, openCheck, pressKey } from '../src/grown-up-check.js';
import { deviceStorage, readStored, writeStored } from '../src/storage.js';
import { readLookChoice, saveLookChoice } from '../src/look-choice.js';
import { isOutside } from '../src/panel.js';


describe('Keeping things on the device', () => {
  test('a stored value comes back as it was', () => {
    const storage = fakeStorage();
    writeStored(storage, 'k', { a: 1, b: [true, 'x'] });
    assert.deepEqual(readStored(storage, 'k'), { a: 1, b: [true, 'x'] });
  });

  test('nothing stored, damaged text, a blocked or full store, or no store at all: nothing breaks', () => {
    assert.equal(readStored(fakeStorage(), 'k'), undefined);
    assert.equal(readStored(fakeStorage({ k: '{oops' }), 'k'), undefined);
    assert.equal(readStored(brokenStorage, 'k'), undefined);
    assert.equal(readStored(null, 'k'), undefined);
    assert.doesNotThrow(() => writeStored(brokenStorage, 'k', 1));
    assert.doesNotThrow(() => writeStored(null, 'k', 1));
  });

  test('without a browser there is no device storage, and that is fine', () => {
    assert.equal(deviceStorage(), globalThis.localStorage ?? null);
  });
});

describe('Keeping settings offline', () => {
  test('a changed setting is still in use when the app opens again', () => {
    const storage = fakeStorage();
    saveSettings(storage, { ...defaultSettings(), helpers: false, wording: 'quarter' });
    assert.deepEqual(readSettings(storage), { ...defaultSettings(), helpers: false, wording: 'quarter' });
  });

  test('settings that are missing or damaged use their defaults, and the app works as normal', () => {
    assert.deepEqual(readSettings(fakeStorage()), defaultSettings());
    assert.deepEqual(readSettings(fakeStorage({ [SETTINGS_STORAGE_KEY]: 'not json' })), defaultSettings());
    assert.deepEqual(readSettings(fakeStorage({ [SETTINGS_STORAGE_KEY]: '{"helpers":"maybe","wording":"quarter"}' })), { ...defaultSettings(), wording: 'quarter' });
    assert.deepEqual(readSettings(brokenStorage), defaultSettings());
  });

  test('only real settings are stored', () => {
    const storage = fakeStorage();
    saveSettings(storage, { ...defaultSettings(), look: 'dino', extra: 1 });
    assert.deepEqual(Object.keys(JSON.parse(storage.items.get(SETTINGS_STORAGE_KEY))), SETTINGS.map((s) => s.key));
  });

  test("going back to the defaults leaves the child's look and colours as they were", () => {
    const storage = fakeStorage();
    saveLookChoice(storage, { look: 'space', pair: 'pink-teal' });
    saveSettings(storage, { ...defaultSettings(), helpers: false });
    saveSettings(storage, defaultSettings()); // "Reset to defaults"
    assert.deepEqual(readLookChoice(storage), { look: 'space', pair: 'pink-teal' });
  });
});

describe('Seeing each setting', () => {
  for (const row of examples('07-preferences.feature', 'Seeing each setting')) {
    test(`"${row.setting}" shows its choices with "${row.default}" chosen`, () => {
      const shown = settingRows(defaultSettings()).find((r) => r.label === row.setting);
      const choices = [...row.choices.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
      assert.deepEqual(shown.choices.map((c) => c.label), choices);
      assert.deepEqual(shown.choices.filter((c) => c.selected).map((c) => c.label), [row.default]);
    });
  }

  test('a changed setting shows as chosen', () => {
    const rows = settingRows({ ...defaultSettings(), helpers: false });
    const helpers = rows.find((r) => r.key === 'helpers');
    assert.deepEqual(helpers.choices.map((c) => c.selected), [false, true]);
  });

  test('two sets of settings are the same only when every setting matches', () => {
    assert.ok(sameSettings(defaultSettings(), defaultSettings()));
    assert.ok(sameSettings(defaultSettings(), { ...defaultSettings(), look: 'dino' }), "the child's look isn't a setting");
    assert.ok(!sameSettings(defaultSettings(), { ...defaultSettings(), helpers: false }));
  });

  test('settings for features that are not built yet can be left out', () => {
    const keys = settingRows(defaultSettings(), ['talkingSpeed']).map((r) => r.key);
    assert.deepEqual(keys, ['wording', 'helpers', 'childrenCanChangeLook']);
  });
});

describe('The number pad display', () => {
  const check = (answer, entry = '') => ({ question: { answer }, entry });

  test('a gap for each digit still to come', () => {
    assert.equal(entryDisplay(check('56')), '_ _');
    assert.equal(entryDisplay(check('56', '5')), '5 _');
  });

  test('after a wrong answer the display is empty again', () => {
    let c = openCheck(null, () => 0); // 6 × 6 = 36
    c = pressKey(pressKey(c, '9'), '9');
    assert.equal(c.wrong, true);
    assert.equal(entryDisplay(c), '_ _');
  });
});

describe('Closing a panel with a tap outside it', () => {
  const rect = { left: 100, top: 50, right: 500, bottom: 450 };
  test('a tap outside the panel closes it, a tap inside does not', () => {
    assert.equal(isOutside(rect, 50, 200), true);
    assert.equal(isOutside(rect, 300, 460), true);
    assert.equal(isOutside(rect, 300, 200), false);
    assert.equal(isOutside(rect, 100, 50), false, 'the edge counts as inside');
  });
});
