// Keeping small things on the device (the child's look, the grown-up
// settings) in localStorage. Every function fails quietly: a missing,
// blocked, full or damaged store never stops the app, it just doesn't
// remember.

/** The device's localStorage, or null where it's missing or blocked. */
export function deviceStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** The value stored under key, or undefined if there is none or it can't be read. */
export function readStored(storage, key) {
  try {
    const text = storage?.getItem(key);
    return text == null ? undefined : JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Stores value (as JSON) under key. */
export function writeStored(storage, key, value) {
  try {
    storage?.setItem(key, JSON.stringify(value));
  } catch {
    // not kept this time
  }
}
