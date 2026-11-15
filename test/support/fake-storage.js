// A pretend localStorage for tests: getItem/setItem over a Map (items),
// keeping values as strings like the real one. brokenStorage throws on every
// call, like a blocked or full store.

export function fakeStorage(initial = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    getItem: (k) => (items.has(k) ? items.get(k) : null),
    setItem: (k, v) => items.set(k, String(v)),
  };
}

export const brokenStorage = Object.freeze({
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('full');
  },
});
