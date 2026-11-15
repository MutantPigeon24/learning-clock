import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples } from './support/gherkin-examples.js';
import { layoutFor } from '../src/layout.js';

for (const row of examples('00-learning-clock.feature', "Picking the layout from the screen's shape")) {
  test(`${row.screen} (${row.width} × ${row.height}) is ${row.shape}`, () => {
    const layout = layoutFor(Number(row.width), Number(row.height));
    assert.equal(layout.shape, row.shape);
    assert.equal(layout.small, row.small === 'is');
  });
}

test('every shape from very tall to very wide gets exactly one layout', () => {
  const seen = new Set();
  for (let w = 300; w <= 3000; w += 10) {
    const { shape } = layoutFor(w, 1000);
    assert.ok(['wide', 'tall', 'in between'].includes(shape));
    seen.add(shape);
  }
  assert.equal(seen.size, 3);
});

// "The app doesn't zoom or select text like a web page": the page settings
// that stop it, checked in the files themselves.
import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

test('the screen does not zoom when pinched or double-tapped', () => {
  const viewport = read('index.html').match(/<meta name="viewport" content="([^"]*)"/)?.[1] ?? '';
  const parts = Object.fromEntries(viewport.split(',').map((p) => p.trim().split('=')));
  assert.equal(parts['maximum-scale'], '1');
  assert.equal(parts['user-scalable'], 'no');
  // Panels taller than the screen still scroll.
  assert.match(htmlRule(), /touch-action:\s*pan-x pan-y;/);
});

test('holding a finger on a word does not select it', () => {
  assert.match(htmlRule(), /(^|\s)user-select:\s*none;/);
  assert.match(htmlRule(), /-webkit-user-select:\s*none;/);
});

function htmlRule() {
  return read('styles.css').match(/^html \{([^}]*)\}/m)?.[1] ?? '';
}
