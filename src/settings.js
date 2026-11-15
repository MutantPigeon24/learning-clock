// Grown-up settings (07-preferences.feature): what each one is called, its
// choices and its default. Settings are kept on the tablet, so loadSettings
// turns whatever was stored into a complete, valid set.

import { readStored, writeStored } from './storage.js';

export const SETTINGS_STORAGE_KEY = 'learning-clock:settings';

export const SETTINGS = Object.freeze([
  {
    key: 'wording',
    label: 'How the time is said',
    choices: [
      { value: 'past', label: '45 minutes past 9' },
      { value: 'quarter', label: 'quarter to 10' },
    ],
    default: 'past',
  },
  {
    key: 'helpers',
    label: 'Hour and minute helpers',
    choices: [
      { value: true, label: 'On' },
      { value: false, label: 'Off' },
    ],
    default: true,
  },
  {
    key: 'talkingSpeed',
    label: 'Talking speed',
    choices: [
      { value: 'slower', label: 'Slower' },
      { value: 'normal', label: 'Normal' },
    ],
    default: 'slower',
  },
  {
    key: 'childrenCanChangeLook',
    label: 'Children can change the look',
    choices: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
    default: true,
  },
]);

/** Speech rate for each talking speed (SpeechSynthesisUtterance.rate). */
export const SPEECH_RATE = Object.freeze({ slower: 0.8, normal: 1 });

/** Every setting at its default. Also what "Reset to defaults" gives. */
export function defaultSettings() {
  return Object.fromEntries(SETTINGS.map((s) => [s.key, s.default]));
}

/**
 * A complete set of settings from what was stored. Missing or unknown values
 * take the default, and keys that aren't settings are dropped, so an older or
 * damaged store never breaks the app.
 */
export function loadSettings(stored) {
  const saved = stored && typeof stored === 'object' ? stored : {};
  return Object.fromEntries(
    SETTINGS.map((s) => {
      const ok = s.choices.some((c) => c.value === saved[s.key]);
      return [s.key, ok ? saved[s.key] : s.default];
    }),
  );
}

/** Reads the settings from storage (see storage.js). */
export function readSettings(storage) {
  return loadSettings(readStored(storage, SETTINGS_STORAGE_KEY));
}

/** Keeps the settings in storage. */
export function saveSettings(storage, settings) {
  writeStored(storage, SETTINGS_STORAGE_KEY, loadSettings(settings));
}

/**
 * The rows of the settings panel: each setting with its choices and the one
 * in use. `hidden` leaves out settings for features that aren't built yet.
 */
export function settingRows(settings, hidden = []) {
  return SETTINGS.filter((s) => !hidden.includes(s.key)).map((s) => ({
    key: s.key,
    label: s.label,
    choices: s.choices.map((c) => ({ value: c.value, label: c.label, selected: c.value === settings[s.key] })),
  }));
}

/** True when two sets of settings are the same. */
export function sameSettings(a, b) {
  return SETTINGS.every((s) => a[s.key] === b[s.key]);
}
