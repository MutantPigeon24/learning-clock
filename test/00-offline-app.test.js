// The installable offline app (00-learning-clock.feature): the manifest, the
// files the service worker stores, how it serves them with no internet or no
// web address, and asking to keep the files.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadServiceWorker, BASE, ORIGIN } from './support/fake-service-worker.js';
import { storedFiles, writtenBuild, fingerprint } from '../tools/stamp-sw.mjs';
import { keepFilesStored, startOffline } from '../src/pwa.js';
import { LOOKS } from '../src/colours.js';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');
const manifest = JSON.parse(read('manifest.webmanifest'));
const FILES = storedFiles();
const fullUrl = (file) => new URL(file, BASE).href;

const ok = (body = 'stored') => new Response(body, { status: 200 });
const notFound = () => new Response('page not found', { status: 404 });
const offline = () => {
  throw new TypeError('Failed to fetch');
};

// How each kind of file points at other files.
const LINKS = {
  '.html': [/\s(?:src|href)="([^"#]+)"/g],
  '.js': [/\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g],
  '.css': [/url\(\s*['"]?([^'")]+)['"]?\s*\)/g, /@import\s+['"]([^'"]+)['"]/g],
  '.webmanifest': [/"src"\s*:\s*"([^"]+)"/g],
};

/** The addresses a file's text points at, skipping inline data: URLs. */
function linksIn(extension, text) {
  return (LINKS[extension] ?? [])
    .flatMap((pattern) => [...text.matchAll(pattern)].map((m) => m[1]))
    .filter((link) => !link.startsWith('data:'));
}

/**
 * Every file the app loads, starting from index.html: links and scripts in
 * the page, icons in the manifest, JS imports (static, dynamic and
 * re-exports), and url() and @import in CSS.
 */
function filesTheAppLoads() {
  const found = new Set();
  const visit = (file) => {
    if (found.has(file)) return;
    found.add(file);
    const extension = file.slice(file.lastIndexOf('.'));
    if (!LINKS[extension]) return;
    for (const link of linksIn(extension, read(file))) {
      visit(`./${new URL(link, new URL(file, root)).href.slice(root.href.length)}`);
    }
  };
  visit('./index.html');
  return found;
}

test('the file finder follows every kind of link', () => {
  const js = "import { a } from './a.js';\nexport { b } from \"./b.js\";\nimport './c.js';\nawait import('./d.js');";
  assert.deepEqual(linksIn('.js', js), ['./a.js', './b.js', './c.js', './d.js']);
  const css = "@import 'x.css';\n@font-face { src: url(fonts/a.woff2); }\n.b { background: url(\"img/b.png\"); }\n.c { background: url(data:image/png;base64,AA); }";
  assert.deepEqual(linksIn('.css', css), ['fonts/a.woff2', 'img/b.png', 'x.css']);
});

/** Width and height from a PNG's header. */
function pngSize(file) {
  const bytes = readFileSync(new URL(file, root));
  assert.equal(bytes.toString('latin1', 1, 4), 'PNG', `${file} is a PNG`);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

/** A worker that has installed with every file stored. */
async function installed(network = () => ok()) {
  let answer = () => ok();
  const sw = loadServiceWorker({ network: (r) => answer(r) });
  await sw.install();
  await sw.activate();
  answer = network;
  sw.requests.length = 0;
  return sw;
}

describe('The app is installed once from a web address', () => {
  test('the manifest has what Chrome needs to offer "Install app"', () => {
    for (const key of ['name', 'short_name', 'start_url', 'scope', 'theme_color', 'background_color']) {
      assert.ok(manifest[key], `manifest has ${key}`);
    }
    assert.ok(manifest.short_name.length <= 12, 'short name fits under a home-screen icon');
  });

  test('the app opens full screen, with no address bar', () => {
    assert.ok(['standalone', 'fullscreen'].includes(manifest.display));
    assert.equal(manifest.display_override[0], 'fullscreen');
  });

  test('every address is relative, so the app works from a GitHub Pages sub-folder', () => {
    assert.equal(manifest.start_url, './');
    assert.equal(manifest.scope, './');
    for (const icon of manifest.icons) assert.ok(!icon.src.startsWith('/'), icon.src);
    for (const file of FILES) assert.ok(file.startsWith('./'), file);
  });

  test('icons come in 192 and 512 pixels, plus a maskable one, at the size they say', () => {
    const sizes = manifest.icons.map((i) => i.sizes);
    assert.ok(sizes.includes('192x192'));
    assert.ok(sizes.includes('512x512'));
    assert.ok(manifest.icons.some((i) => i.purpose === 'maskable'));
    for (const icon of manifest.icons) {
      const [w, h] = pngSize(icon.src);
      assert.equal(`${w}x${h}`, icon.sizes, icon.src);
    }
  });

  test("the install splash and status bar use Sky's colours from colours.js", () => {
    assert.equal(manifest.theme_color, LOOKS.sky.accent);
    assert.equal(manifest.background_color, LOOKS.sky.soft);
    assert.match(read('index.html'), new RegExp(`<meta name="theme-color" content="${LOOKS.sky.accent}">`));
  });

  test('the page links the manifest, does not block zoom and leaves room for notches', () => {
    const html = read('index.html');
    assert.match(html, /<link rel="manifest" href="manifest.webmanifest">/);
    const viewport = html.match(/<meta name="viewport" content="([^"]+)">/)[1];
    assert.match(viewport, /viewport-fit=cover/);
    assert.doesNotMatch(viewport, /user-scalable=no|maximum-scale/);
  });
});

describe('Everything is saved during installation', () => {
  test('the stored files are exactly the files the app loads', () => {
    assert.deepEqual([...filesTheAppLoads()].sort(), [...FILES].sort());
  });

  test('every stored file exists', () => {
    for (const file of FILES) assert.ok(existsSync(new URL(file, root)), file);
  });

  test('nothing is loaded from the internet', () => {
    for (const file of [...FILES, './sw.js'].filter((f) => !f.endsWith('.png'))) {
      assert.doesNotMatch(read(file), /\b(?:https?:)?\/\/[a-z0-9-]+\.[a-z]/i, `${file} has no outside address`);
    }
  });

  test('installing stores every file, skipping the browser cache', async () => {
    const sw = loadServiceWorker({ network: () => ok() });
    await sw.install();
    assert.deepEqual(sw.requests.map((r) => r.url).sort(), FILES.map(fullUrl).sort());
    for (const r of sw.requests) assert.equal(r.cache, 'reload', r.url);
    for (const file of FILES) assert.ok(await sw.fetch(file), file);
  });

  test('if any file fails to download, installing fails and nothing is half-stored', async () => {
    const sw = loadServiceWorker({ network: (r) => (r.url.endsWith('styles.css') ? notFound() : ok()) });
    await assert.rejects(sw.install());
    const [store] = sw.caches.stores.values();
    assert.equal(store.size, 0);
  });
});

describe('Getting updates', () => {
  test('a new version waits until the app is next opened', async () => {
    const sw = loadServiceWorker({ network: () => ok() });
    await sw.install();
    assert.equal(sw.calls.skipWaiting, 0);
  });

  test("the version fingerprint matches the stored files (run 'npm run stamp' if not)", () => {
    assert.equal(writtenBuild(), fingerprint());
  });

  test("a new version removes only older versions' files", async () => {
    const sw = loadServiceWorker({ network: () => ok() });
    await sw.caches.open('learning-clock-oldversion1');
    await sw.caches.open('something-else');
    await sw.install();
    await sw.activate();
    const names = await sw.caches.keys();
    assert.deepEqual(names.sort(), [`learning-clock-${writtenBuild()}`, 'something-else']);
    assert.equal(sw.calls.claim, 1);
  });
});

describe('The app keeps working offline and after its web address is taken down', () => {
  for (const [name, network] of [['offline', offline], ['web address gone', notFound]]) {
    test(`${name}: opening the app shows the stored start page`, async () => {
      const sw = await installed(network);
      for (const page of ['./', './index.html', './?source=home-screen']) {
        const response = await sw.fetch(page, { mode: 'navigate' });
        assert.equal(response.status, 200, page);
        assert.equal(await response.text(), 'stored');
      }
      assert.equal(sw.requests.length, 0, 'no network needed');
    });

    test(`${name}: every stored file is served from the device`, async () => {
      const sw = await installed(network);
      for (const file of FILES) assert.equal((await sw.fetch(file)).status, 200, file);
      assert.equal(sw.requests.length, 0);
    });
  }

  test('a failed answer from the network is never stored over a good file', async () => {
    const sw = await installed(notFound);
    const missing = await sw.fetch('./not-stored.js');
    assert.equal(missing.status, 404);
    assert.equal(await sw.fetch('./not-stored.js').then((r) => r.status), 404);
    const [store] = sw.caches.stores.values();
    assert.equal(store.size, FILES.length);
  });

  test('a file that is not stored and cannot be fetched fails like any offline request', async () => {
    const sw = await installed(offline);
    await assert.rejects(sw.fetch('./not-stored.js'));
  });

  test('if the stored files cannot be read, the network is used instead', async () => {
    const sw = await installed(() => ok('from network'));
    sw.caches.open = async () => {
      throw new Error('storage broken');
    };
    const response = await sw.fetch('./', { mode: 'navigate' });
    assert.equal(await response.text(), 'from network');
  });

  test('requests that are not plain GETs to the app are left to the browser', async () => {
    const sw = await installed();
    assert.equal(await sw.fetch('./index.html', { method: 'POST' }), undefined);
    assert.equal(await sw.fetch('https://elsewhere.example/x.js'), undefined);
    assert.ok(await sw.fetch(`${ORIGIN}/learning-clock/index.html`));
  });
});

describe('Asking the tablet to keep the app\'s files', () => {
  test('asks when the files are not kept yet', async () => {
    let asked = 0;
    const storage = { persisted: async () => false, persist: async () => (asked += 1) > 0 };
    assert.equal(await keepFilesStored(storage), true);
    assert.equal(asked, 1);
  });

  test('does not ask again once the files are kept', async () => {
    let asked = 0;
    const storage = { persisted: async () => true, persist: async () => (asked += 1) > 0 };
    assert.equal(await keepFilesStored(storage), true);
    assert.equal(asked, 0);
  });

  test('carries on quietly when the browser refuses or has no storage API', async () => {
    assert.equal(await keepFilesStored(undefined), false);
    assert.equal(await keepFilesStored({ persisted: async () => false, persist: async () => false }), false);
    assert.equal(await keepFilesStored({ persisted: async () => { throw new Error('no'); }, persist: async () => true }), false);
  });
});

describe('Registering the service worker', () => {
  test('registers sw.js next to the page, skipping the HTTP cache for update checks', () => {
    const calls = [];
    startOffline({ serviceWorker: { register: async (...args) => calls.push(args) } });
    assert.deepEqual(calls, [['./sw.js', { scope: './', updateViaCache: 'none' }]]);
  });

  test('a failed update check (address gone) fails quietly', async () => {
    let rejected;
    const failing = new Promise((_, reject) => { rejected = reject; });
    startOffline({ serviceWorker: { register: () => failing } });
    rejected(new TypeError('404'));
    await new Promise((r) => setImmediate(r)); // an unhandled rejection would fail the test run
  });

  test('does nothing in a browser without service workers', () => {
    assert.doesNotThrow(() => startOffline({}));
  });
});
