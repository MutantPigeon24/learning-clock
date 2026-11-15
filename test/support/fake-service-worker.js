// Runs sw.js in Node with a pretend browser around it: a cache store, a
// network and the service worker's events. Tests then fire install, activate
// and fetch events and check what the worker did.

import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const ORIGIN = 'https://example.github.io';
export const BASE = `${ORIGIN}/learning-clock/`;

const swSource = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');

/** Drops the query string, for ignoreSearch matching. */
const withoutSearch = (url) => url.split('?')[0];

/** A pretend CacheStorage, keyed by full URL. */
class FakeCaches {
  constructor() {
    this.stores = new Map();
  }

  async open(name) {
    if (!this.stores.has(name)) this.stores.set(name, new Map());
    const store = this.stores.get(name);
    const urlOf = (key) => (typeof key === 'string' ? new URL(key, BASE).href : key.url);
    return {
      addAll: async (requests) => {
        const fetched = [];
        for (const request of requests) {
          const response = await this.network(request);
          if (!response.ok) throw new TypeError(`addAll: ${request.url} gave ${response.status}`);
          fetched.push([request.url, response]);
        }
        for (const [url, response] of fetched) store.set(url, response);
      },
      put: async (key, response) => store.set(urlOf(key), response),
      match: async (key, { ignoreSearch = false } = {}) => {
        const want = urlOf(key);
        for (const [url, response] of store) {
          if (url === want || (ignoreSearch && withoutSearch(url) === withoutSearch(want))) return response.clone();
        }
        return undefined;
      },
    };
  }

  async keys() {
    return [...this.stores.keys()];
  }

  async delete(name) {
    return this.stores.delete(name);
  }
}

/**
 * Loads sw.js. `network(request)` answers fetches: return a Response or
 * throw for "offline". Returns helpers to fire events and inspect state.
 */
export function loadServiceWorker({ network }) {
  const listeners = {};
  const requests = [];
  const calls = { skipWaiting: 0, claim: 0 };
  const fetchFromNetwork = async (request) => {
    requests.push(request);
    return network(request);
  };
  const caches = new FakeCaches();
  caches.network = fetchFromNetwork;

  // Requests made inside the worker resolve relative to its own address.
  class WorkerRequest extends Request {
    constructor(input, init) {
      super(typeof input === 'string' ? new URL(input, BASE).href : input, init);
    }
  }

  const self = {
    location: new URL('sw.js', BASE),
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    skipWaiting: async () => {
      calls.skipWaiting += 1;
    },
    clients: {
      claim: async () => {
        calls.claim += 1;
      },
    },
  };
  vm.runInNewContext(swSource, {
    self,
    caches,
    fetch: fetchFromNetwork,
    Request: WorkerRequest,
    Response,
    URL,
    Promise,
  });

  /** Fires an event and waits for everything it asked to wait for. */
  async function fire(type, props = {}) {
    const waits = [];
    let responded;
    const event = {
      ...props,
      waitUntil: (p) => waits.push(p),
      respondWith: (p) => {
        responded = Promise.resolve(p);
      },
    };
    listeners[type](event);
    await Promise.all(waits);
    return responded;
  }

  return {
    caches,
    calls,
    requests,
    install: () => fire('install'),
    activate: () => fire('activate'),
    /** Resolves to the Response the worker gave, or undefined if it let the browser handle it. */
    fetch: (url, { mode = 'no-cors', method = 'GET' } = {}) => {
      const request = new Request(new URL(url, BASE).href, { method });
      Object.defineProperty(request, 'mode', { value: mode });
      return fire('fetch', { request });
    },
  };
}
