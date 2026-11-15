// Reading the time aloud (06-read-aloud.feature): picking a voice that is on
// the device, so it works offline, and speaking one reading at a time.
//
// No DOM here. The speech engine (window.speechSynthesis) and the utterance
// class are passed in, so this can be tested in Node with a pretend engine;
// src/app.js connects it to the page.

/** How long to wait for the device's voices before saying there is none. */
export const VOICE_WAIT_MS = 2500;

/**
 * The voice to use, or null when there is none the app can use.
 * Only voices on the device (localService) count, so speech works offline,
 * and only English ones, because the sentence is English. A voice for the
 * device's own language (such as en-GB) comes first, then the device's
 * default voice, then any other English one.
 */
export function pickVoice(voices, preferred = 'en') {
  const lang = (v) => String(v.lang || '').replace('_', '-').toLowerCase();
  const usable = [...(voices || [])].filter((v) => v.localService && lang(v).startsWith('en'));
  if (usable.length === 0) return null;
  const want = String(preferred).toLowerCase();
  return (
    usable.find((v) => lang(v) === want && v.default) ||
    usable.find((v) => lang(v) === want) ||
    usable.find((v) => v.default) ||
    usable[0]
  );
}

/**
 * Reads text aloud, one reading at a time.
 *
 * synth: the speech engine (window.speechSynthesis), or nothing if the
 * browser has none. Utterance: SpeechSynthesisUtterance. language: the
 * device's language (navigator.language). onChange(state) is called whenever
 * something the button shows changes: { voice: 'checking' | 'ready' | 'none',
 * speaking: true | false }. timers: setTimeout and clearTimeout (for tests).
 */
export function createReader({ synth, Utterance, language = 'en', onChange = () => {}, timers = globalThis } = {}) {
  let voice = null;
  let voiceState = synth && Utterance ? 'checking' : 'none';
  let speaking = false;
  let reading = 0; // which reading is playing; an older one's events are ignored
  let safety = null;
  let waiting = null;

  const state = () => ({ voice: voiceState, speaking });
  const tell = () => onChange(state());

  function findVoice() {
    if (voiceState === 'none' && !(synth && Utterance)) return;
    voice = pickVoice(synth.getVoices(), language);
    if (voice) {
      voiceState = 'ready';
      if (waiting) timers.clearTimeout(waiting);
      waiting = null;
    }
    return voice;
  }

  if (voiceState === 'checking') {
    // Some browsers list their voices only after a moment.
    synth.addEventListener?.('voiceschanged', () => {
      const before = voiceState;
      findVoice();
      if (voiceState !== before) tell();
    });
    findVoice();
    if (voiceState === 'checking') {
      waiting = timers.setTimeout(() => {
        waiting = null;
        if (voiceState === 'checking') {
          voiceState = 'none';
          tell();
        }
      }, VOICE_WAIT_MS);
    }
  }

  function finish(which) {
    if (which !== reading || !speaking) return;
    speaking = false;
    if (safety) timers.clearTimeout(safety);
    safety = null;
    tell();
  }

  return {
    state,

    /**
     * Reads the text aloud. A reading that is still playing stops first, so
     * two readings never play over each other. Returns false (and says
     * nothing) when the device has no voice.
     */
    speak(text, rate = 1) {
      if (voiceState !== 'ready' && !findVoice()) {
        if (voiceState === 'checking') {
          voiceState = 'none';
          if (waiting) timers.clearTimeout(waiting);
          waiting = null;
        }
        tell();
        return false;
      }
      // Count the new reading first, so the old one's "stopped" event is ignored.
      const which = ++reading;
      synth.cancel();
      const utterance = new Utterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = rate;
      utterance.onend = () => finish(which);
      utterance.onerror = () => finish(which);
      speaking = true;
      if (safety) timers.clearTimeout(safety);
      // If the engine never says it has finished, the button still comes back.
      safety = timers.setTimeout(() => finish(which), Math.round(12000 / rate));
      synth.speak(utterance);
      tell();
      return true;
    },

    /** Stops any reading, for example when the app goes into the background. */
    stop() {
      if (!speaking) return;
      reading += 1;
      speaking = false;
      if (safety) timers.clearTimeout(safety);
      safety = null;
      synth?.cancel();
      tell();
    },
  };
}
