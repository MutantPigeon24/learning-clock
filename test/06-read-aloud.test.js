// Reading the time aloud (06-read-aloud.feature): src/read-aloud.js with a
// pretend speech engine, and the words it reads from src/clock-view.js.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createReader, pickVoice, VOICE_WAIT_MS } from '../src/read-aloud.js';
import { clockView } from '../src/clock-view.js';
import { realClock } from '../src/set-clock.js';
import { SPEECH_RATE, defaultSettings } from '../src/settings.js';

const voice = (name, lang, localService = true, isDefault = false) => ({ name, lang, localService, default: isDefault });
const ON_DEVICE = voice('English (UK)', 'en-GB', true, true);
const ONLINE = voice('Online English', 'en-US', false);

/** A pretend speechSynthesis: records utterances and lets a test end them. */
function fakeEngine(voices = [ON_DEVICE]) {
  const listeners = {};
  const engine = {
    voices,
    spoken: [],
    cancels: 0,
    playing: null,
    getVoices: () => engine.voices,
    addEventListener: (type, fn) => { listeners[type] = fn; },
    speak(u) { engine.spoken.push(u); engine.playing = u; },
    cancel() {
      engine.cancels += 1;
      const u = engine.playing;
      engine.playing = null;
      u?.onerror?.({ error: 'interrupted' }); // Chrome reports a cancelled reading as an error
    },
    finish() { const u = engine.playing; engine.playing = null; u?.onend?.(); },
    voicesArrive(list) { engine.voices = list; listeners.voiceschanged?.(); },
  };
  return engine;
}

class FakeUtterance {
  constructor(text) { this.text = text; }
}

/** Timers a test can run by hand. */
function fakeTimers() {
  let next = 1;
  const pending = new Map();
  return {
    setTimeout: (fn, ms) => { pending.set(next, { fn, ms }); return next++; },
    clearTimeout: (id) => pending.delete(id),
    run(ms) { for (const [id, t] of [...pending]) if (t.ms <= ms) { pending.delete(id); t.fn(); } },
    get count() { return pending.size; },
  };
}

function setUp(voices, language = 'en-GB') {
  const engine = fakeEngine(voices);
  const timers = fakeTimers();
  const states = [];
  const reader = createReader({ synth: engine, Utterance: FakeUtterance, language, timers, onChange: (s) => states.push(s) });
  return { engine, timers, states, reader };
}

const at = (hours, minutes) => ({ setByHand: true, wall: { year: 2026, month: 11, day: 15, hours, minutes } });
const NOW = new Date(2026, 10, 15, 14, 20);

describe('Hearing the current time', () => {
  test('pressing the button says exactly the sentence shown in the words', () => {
    const view = clockView(at(9, 12), NOW);
    assert.equal(view.words, 'It is 12 minutes past 9 in the morning.');
    assert.equal(view.words, view.sentence.map((p) => p.text).join(''));
    const { engine, reader } = setUp();
    assert.equal(reader.speak(view.words), true);
    assert.equal(engine.spoken.at(-1).text, 'It is 12 minutes past 9 in the morning.');
  });

  test('it reads the time set by hand, or the real time', () => {
    assert.equal(clockView(at(21, 45), NOW).words, 'It is 45 minutes past 9 at night.');
    assert.equal(clockView(realClock(), NOW).words, 'It is 20 minutes past 2 in the afternoon.');
  });

  test('the wording setting changes what is said too', () => {
    assert.equal(clockView(at(9, 15), NOW, { wording: 'quarter' }).words, 'It is quarter past 9 in the morning.');
  });
});

describe('Speaking clearly for young children', () => {
  test('by default it speaks a little slower than normal', () => {
    const rate = SPEECH_RATE[defaultSettings().talkingSpeed];
    assert.ok(rate < 1);
    const { engine, reader } = setUp();
    reader.speak('It is 1 minute past 1 at night.', rate);
    assert.equal(engine.spoken.at(-1).rate, rate);
  });

  test('"Normal" speaks at normal speed', () => {
    const { engine, reader } = setUp();
    reader.speak('Hi', SPEECH_RATE.normal);
    assert.equal(engine.spoken.at(-1).rate, 1);
  });
});

describe('Reading aloud without internet', () => {
  test('only a voice on the device is used', () => {
    assert.equal(pickVoice([ONLINE, ON_DEVICE]), ON_DEVICE);
    assert.equal(pickVoice([ONLINE]), null);
    const { engine, reader } = setUp([ONLINE, ON_DEVICE]);
    reader.speak('Hi');
    assert.equal(engine.spoken.at(-1).voice, ON_DEVICE);
  });

  test('the voice is English, preferring the device language, then the default voice', () => {
    const us = voice('US', 'en-US');
    const gb = voice('UK', 'en_GB');
    const fr = voice('French', 'fr-FR', true, true);
    const za = voice('South Africa', 'en-ZA', true, true);
    assert.equal(pickVoice([fr]), null, 'the sentence is English');
    assert.equal(pickVoice([fr, us, gb], 'en-GB'), gb);
    assert.equal(pickVoice([us, za], 'fr-FR'), za, 'the default English voice when the language has none');
    assert.equal(pickVoice([us, gb], 'de-DE'), us);
    assert.equal(pickVoice([]), null);
    assert.equal(pickVoice(undefined), null);
  });
});

describe('Pressing the button again while it is speaking', () => {
  test('it stops and starts again, so two readings never play over each other', () => {
    const { engine, reader, states } = setUp();
    reader.speak('first');
    const cancelsBefore = engine.cancels;
    const seen = states.length;
    reader.speak('second');
    assert.ok(states.slice(seen).every((s) => s.speaking), 'the button never flickers off between readings');
    assert.equal(engine.cancels, cancelsBefore + 1, 'the first reading is stopped first');
    assert.equal(engine.playing.text, 'second');
    // The first reading's "stopped" event must not make the button stop showing it is speaking.
    assert.equal(states.at(-1).speaking, true);
    assert.equal(reader.state().speaking, true);
    engine.finish();
    assert.equal(reader.state().speaking, false);
  });
});

describe('The minute changes while it is speaking', () => {
  test('the reading finishes as it started, and the next press says the new time', () => {
    const { engine, reader } = setUp();
    reader.speak(clockView(at(9, 12), NOW).words);
    // Nothing in the reader re-reads or stops on its own when the time moves on.
    assert.equal(engine.spoken.length, 1);
    assert.equal(engine.playing.text, 'It is 12 minutes past 9 in the morning.');
    engine.finish();
    reader.speak(clockView(at(9, 13), NOW).words);
    assert.equal(engine.spoken.at(-1).text, 'It is 13 minutes past 9 in the morning.');
  });
});

describe('Showing that the app is speaking', () => {
  test('the button shows speaking from the start of a reading to its end', () => {
    const { engine, reader, states } = setUp();
    assert.equal(reader.state().speaking, false);
    reader.speak('Hi');
    assert.deepEqual(states.at(-1), { voice: 'ready', speaking: true });
    engine.finish();
    assert.deepEqual(states.at(-1), { voice: 'ready', speaking: false });
  });

  test('if the engine never says it has finished, the button still comes back', () => {
    const { reader, timers } = setUp();
    reader.speak('Hi', 0.8);
    timers.run(Math.round(12000 / 0.8));
    assert.equal(reader.state().speaking, false);
  });

  test('a reading that fails also ends the speaking state', () => {
    const { engine, reader } = setUp();
    reader.speak('Hi');
    engine.playing.onerror({ error: 'synthesis-failed' });
    assert.equal(reader.state().speaking, false);
  });

  test('stopping (the app going into the background) ends the reading', () => {
    const { engine, reader } = setUp();
    reader.speak('Hi');
    reader.stop();
    assert.equal(reader.state().speaking, false);
    assert.equal(engine.playing, null);
  });
});

describe('No voice is available on the device', () => {
  test('a browser without speech has no voice from the start', () => {
    const states = [];
    const reader = createReader({ synth: undefined, Utterance: undefined, onChange: (s) => states.push(s) });
    assert.equal(reader.state().voice, 'none');
    assert.equal(reader.speak('Hi'), false);
    assert.equal(states.at(-1).speaking, false);
  });

  test('only online voices: after waiting for the voices, there is no voice', () => {
    const { reader, timers, engine } = setUp([ONLINE]);
    assert.equal(reader.state().voice, 'checking', 'the button looks normal while the voices load');
    timers.run(VOICE_WAIT_MS);
    assert.equal(reader.state().voice, 'none');
    assert.equal(reader.speak('Hi'), false);
    assert.equal(engine.spoken.length, 0, 'nothing is said');
  });

  test('voices that arrive late are used', () => {
    const { reader, engine, timers, states } = setUp([]);
    assert.equal(reader.state().voice, 'checking');
    engine.voicesArrive([ON_DEVICE]);
    assert.equal(reader.state().voice, 'ready');
    assert.equal(states.at(-1).voice, 'ready');
    assert.equal(timers.count, 0, 'no longer waiting');
  });

  test('a voice added after the wait is found at the next press', () => {
    const { reader, engine, timers } = setUp([]);
    timers.run(VOICE_WAIT_MS);
    assert.equal(reader.state().voice, 'none');
    engine.voices = [ON_DEVICE];
    assert.equal(reader.speak('Hi'), true);
    assert.equal(reader.state().voice, 'ready');
  });

  test('pressing while the voices are still loading and there are none says there is no voice', () => {
    const { reader } = setUp([]);
    assert.equal(reader.speak('Hi'), false);
    assert.equal(reader.state().voice, 'none');
  });
});
