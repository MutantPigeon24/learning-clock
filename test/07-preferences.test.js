// The grown-up check and the settings are in the first version. The custom
// part-of-day and scene times are @future, but they are inputs to the logic
// now, so adding them to the settings later needs no rewrite.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { timeInWords, sentenceParts, partOfDay, scene, DEFAULT_PARTS_OF_DAY, DEFAULT_SCENES } from '../src/time.js';
import { TABLES, newQuestion, openCheck, pressKey } from '../src/grown-up-check.js';
import { SETTINGS, SPEECH_RATE, defaultSettings, loadSettings } from '../src/settings.js';

const FEATURE = '07-preferences.feature';

const styles = {
  'minutes past (default)': 'past',
  'quarter, half, past and to': 'quarter',
};

for (const row of examples(FEATURE, 'Choosing a wording style')) {
  test(`${row.style} wording at ${row.time}`, () => {
    const { hours, minutes } = parseTime(row.time);
    assert.equal(timeInWords(hours, minutes, { style: styles[row.style] }), row.sentence);
  });
}

test('"quarter" style keeps midday and midnight for exactly 12 o\'clock', () => {
  assert.equal(timeInWords(12, 0, { style: 'quarter' }), 'It is 12 o\'clock midday.');
  assert.equal(timeInWords(0, 0, { style: 'quarter' }), 'It is 12 o\'clock midnight.');
  assert.equal(timeInWords(23, 45, { style: 'quarter' }), 'It is quarter to 12 at night.');
  assert.equal(timeInWords(20, 50, { style: 'quarter' }), 'It is 10 minutes to 9 at night.');
  assert.equal(timeInWords(9, 59, { style: 'quarter' }), 'It is 1 minute to 10 in the morning.');
});

test('evening can be moved to start at 18:00', () => {
  const partsOfDay = { ...DEFAULT_PARTS_OF_DAY, evening: '18:00' };
  const scenes = { ...DEFAULT_SCENES, sunset: '18:00' };
  assert.equal(partOfDay(17, 30, partsOfDay), 'afternoon');
  assert.equal(scene(17, 30, scenes), 'day');
  assert.equal(timeInWords(17, 30, { partsOfDay }), 'It is 30 minutes past 5 in the afternoon.');
});

test('the scene times can be set separately from the words', () => {
  const scenes = { ...DEFAULT_SCENES, sunset: '18:00' };
  assert.equal(partOfDay(17, 30), 'evening');
  assert.equal(scene(17, 30, scenes), 'day');
});

// The grown-up check

function checkFor(questionText) {
  const [, a, b] = questionText.match(/^What is (\d) × (\d)\?$/);
  const question = { a: Number(a), b: Number(b), text: questionText, answer: String(a * b) };
  return { question, entry: '', wrong: false, passed: false };
}

for (const row of examples(FEATURE, 'Answering the question')) {
  test(`"${row.question}", pressing ${row.keys}: ${row.result}`, () => {
    const start = checkFor(row.question);
    const end = row.keys.split(' ').reduce(pressKey, start);
    if (row.result === 'the settings open') {
      assert.equal(end.passed, true);
    } else if (row.result === 'the answer is cleared and the same question stays') {
      assert.deepEqual(end, { ...start, wrong: true });
    } else if (row.result === 'it waits for the second digit') {
      assert.equal(end.passed, false);
      assert.equal(end.wrong, false);
      assert.equal(end.entry.length, 1);
    } else {
      assert.fail(`unknown result "${row.result}"`);
    }
  });
}

test('every question comes from the 6 to 9 tables, has a two-digit answer and is written "What is a × b?"', () => {
  const seen = new Set();
  for (let i = 0; i < 1000; i++) {
    const q = newQuestion(null, () => i / 1000);
    assert.ok(TABLES.includes(q.a) && TABLES.includes(q.b));
    assert.equal(q.answer, String(q.a * q.b));
    assert.equal(q.answer.length, 2);
    assert.equal(q.text, `What is ${q.a} × ${q.b}?`);
    seen.add(q.text);
  }
  assert.equal(seen.size, 16, 'every question can come up');
});

test('a new question never has the same answer as the last one', () => {
  const answers = new Set(TABLES.flatMap((a) => TABLES.map((b) => String(a * b))));
  for (const previous of answers) {
    for (let i = 0; i < 100; i++) {
      assert.notEqual(newQuestion(previous, () => i / 100).answer, previous);
    }
  }
  assert.notEqual(openCheck('56').question.answer, '56');
});

test('a wrong answer, again and again, never locks the pad', () => {
  let check = checkFor('What is 8 × 7?');
  for (let i = 0; i < 20; i++) check = ['1', '2'].reduce(pressKey, check);
  assert.equal(check.wrong, true);
  check = ['5', '6'].reduce(pressKey, check);
  assert.equal(check.passed, true);
});

test('the check opens with nothing typed, and other keys are ignored', () => {
  const check = openCheck();
  assert.equal(check.entry, '');
  assert.equal(check.passed, false);
  assert.deepEqual(pressKey(check, 'x'), check);
  assert.deepEqual(pressKey(check, 'delete'), check);
});

// The settings

for (const row of examples(FEATURE, 'Seeing each setting')) {
  test(`setting "${row.setting}"`, () => {
    const setting = SETTINGS.find((s) => s.label === row.setting);
    assert.ok(setting, `no setting called "${row.setting}"`);
    const choices = [...row.choices.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(setting.choices.map((c) => c.label), choices);
    assert.equal(setting.choices.find((c) => c.value === defaultSettings()[setting.key]).label, row.default);
  });
}

test('the settings table lists every setting', () => {
  assert.deepEqual(examples(FEATURE, 'Seeing each setting').map((r) => r.setting), SETTINGS.map((s) => s.label));
});

test('reset gives every default, as a fresh copy', () => {
  const a = defaultSettings();
  a.helpers = false;
  assert.equal(defaultSettings().helpers, true);
  assert.deepEqual(loadSettings({}), defaultSettings());
});

test('settings that are missing or damaged take their defaults', () => {
  for (const stored of [undefined, null, 'oops', 42, [], {}]) {
    assert.deepEqual(loadSettings(stored), defaultSettings());
  }
  const loaded = loadSettings({ wording: 'quarter', helpers: 'yes', talkingSpeed: 'fast', extra: 1 });
  assert.deepEqual(loaded, { ...defaultSettings(), wording: 'quarter' });
});

test('stored settings are kept', () => {
  const changed = { wording: 'quarter', helpers: false, talkingSpeed: 'normal', childrenCanChangeLook: false };
  assert.deepEqual(loadSettings(JSON.parse(JSON.stringify(changed))), changed);
});

for (const row of examples(FEATURE, 'Choosing how fast the voice speaks')) {
  test(`talking speed "${row.speed}" speaks at ${row.rate}`, () => {
    const value = SETTINGS.find((s) => s.key === 'talkingSpeed').choices.find((c) => c.label === row.speed).value;
    assert.equal(SPEECH_RATE[value], Number(row.rate));
  });
}

for (const row of examples(FEATURE, 'Colouring the hour and minutes in the other wording style')) {
  test(`quarter wording at ${row.time}: "${row['hour words']}" and "${row['minute words']}" coloured`, () => {
    const { hours, minutes } = parseTime(row.time);
    const parts = sentenceParts(hours, minutes, { style: 'quarter' });
    assert.equal(parts.filter((p) => p.kind === 'hour').map((p) => p.text).join(''), row['hour words']);
    assert.equal(parts.filter((p) => p.kind === 'minute').map((p) => p.text).join(''), row['minute words']);
  });
}
