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
