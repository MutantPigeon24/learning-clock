// The grown-up panel (07-preferences.feature): the lock button opens a
// times-table check, and the right answer turns the same panel into the
// settings. Each change applies straight away. The rules live in
// grown-up-check.js and settings.js; this file only puts them on the page.
//
// It is a native <dialog> opened with showModal(), like the look picker, so
// the browser keeps the focus inside it and closes it on Escape (panel.js).

import { entryDisplay, openCheck, pressKey } from './grown-up-check.js';
import { defaultSettings, sameSettings, settingRows } from './settings.js';
import { setUpPanel } from './panel.js';

const $ = (id) => document.getElementById(id);

/**
 * Wires up the panel. getSettings reads the app's settings; onChange is
 * called with a new, complete set whenever a grown-up changes one. `hidden`
 * lists settings for features that aren't built yet.
 */
export function setUpGrownUpPanel({ getSettings, onChange, hidden = [] }) {
  const dialog = $('grown-up');
  const opener = $('lock-button');
  let check = null;
  let lastAnswer = null; // so the next question has a different answer
  let undo = null; // the settings before "Reset to defaults", until the panel closes

  // --- The check -------------------------------------------------------------

  function showCheck() {
    $('grown-up-title').textContent = 'For grown-ups';
    $('gate-question').textContent = check.question.text;
    $('gate-typed').textContent = entryDisplay(check);
    $('gate-wrong').hidden = !check.wrong;
  }

  function press(key) {
    check = pressKey(check, key);
    if (check.passed) {
      openSettings();
    } else {
      showCheck();
    }
  }

  $('number-pad').addEventListener('click', (e) => {
    const key = e.target.closest('[data-key]')?.dataset.key;
    if (key) press(key);
  });

  // A keyboard works too: digits, and Backspace or Delete.
  dialog.addEventListener('keydown', (e) => {
    if ($('gate').hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    const key = /^[0-9]$/.test(e.key) ? e.key : e.key === 'Backspace' || e.key === 'Delete' ? 'delete' : null;
    if (!key) return;
    e.preventDefault();
    press(key);
  });

  // --- The settings ----------------------------------------------------------

  function showSettings() {
    const rows = settingRows(getSettings(), hidden).map((row) => {
      const wrap = document.createElement('div');
      wrap.className = 'setting-row';
      wrap.setAttribute('role', 'group');
      const label = document.createElement('span');
      label.className = 'setting-label';
      label.id = `setting-${row.key}`;
      label.textContent = row.label;
      wrap.setAttribute('aria-labelledby', label.id);
      const choices = document.createElement('div');
      choices.className = 'setting-choices';
      for (const [i, choice] of row.choices.entries()) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'setting-choice';
        button.dataset.key = row.key;
        button.dataset.index = String(i);
        button.setAttribute('aria-pressed', String(choice.selected));
        button.textContent = choice.label;
        choices.append(button);
      }
      wrap.append(label, choices);
      return wrap;
    });
    $('setting-rows').replaceChildren(...rows);
    $('reset-note').textContent = undo ? 'Settings are back to the defaults.' : '';
    $('undo-reset').hidden = !undo;
    $('reset-settings').hidden = Boolean(undo);
  }

  function change(next) {
    onChange(next);
    showSettings();
  }

  function openSettings() {
    lastAnswer = check.question.answer;
    check = null;
    $('grown-up-title').textContent = 'Grown-up settings';
    $('gate').hidden = true;
    $('settings').hidden = false;
    showSettings();
    $('setting-rows').querySelector('[aria-pressed="true"]')?.focus();
  }

  $('setting-rows').addEventListener('click', (e) => {
    const button = e.target.closest('.setting-choice');
    if (!button) return;
    const { key, index } = button.dataset;
    const setting = settingRows(getSettings()).find((row) => row.key === key);
    undo = null; // a new choice ends the chance to undo the reset
    change({ ...getSettings(), [key]: setting.choices[Number(index)].value });
    $('setting-rows').querySelector(`[data-key="${key}"][data-index="${index}"]`)?.focus();
  });

  // Only the grown-up settings: the child's look and colours are theirs.
  // Undo is only offered when the reset changed something.
  $('reset-settings').addEventListener('click', () => {
    const before = getSettings();
    if (sameSettings(before, defaultSettings())) {
      $('reset-note').textContent = 'Settings are already the defaults.';
      return;
    }
    undo = before;
    change(defaultSettings());
    $('undo-reset').focus();
  });
  $('undo-reset').addEventListener('click', () => {
    const before = undo;
    undo = null;
    change(before);
    $('reset-settings').focus();
  });

  // --- Opening and closing ---------------------------------------------------

  function open() {
    check = openCheck(lastAnswer);
    undo = null;
    $('gate').hidden = false;
    $('settings').hidden = true;
    showCheck();
    dialog.showModal();
    $('number-pad').querySelector('[data-key="1"]').focus();
  }

  setUpPanel(dialog, {
    opener,
    closeButtons: [$('grown-up-close'), $('settings-done')],
    onClose() {
      // The next visit asks a new question first.
      if (check) lastAnswer = check.question.answer;
      check = null;
      undo = null;
    },
  });
  opener.addEventListener('click', open);

  return { open };
}
