import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples } from './support/gherkin-examples.js';
import { LOOKS, LOOK_IDS, PAIRS, hiddenPairs, pairsFor, pairInUse } from '../src/colours.js';

const lookId = (name) => LOOK_IDS.find((id) => LOOKS[id].name === name);

test('there are six looks, in picker order', () => {
  assert.deepEqual(LOOK_IDS.map((id) => LOOKS[id].name), ['Sky', 'Blossom', 'Unicorn', 'Hero', 'Dino', 'Space']);
});

for (const row of examples('10-looks.feature', 'Hiding colour pairs that clash with the look')) {
  test(`${row.look} hides ${row.hidden}`, () => {
    const expected = row.hidden === 'nothing' ? [] : row.hidden.split(', ');
    const names = hiddenPairs(lookId(row.look)).map((id) => PAIRS.find((p) => p.id === id).name.toLowerCase());
    assert.deepEqual(names.sort(), expected.sort());
    // The picker never offers a hidden pair, and always offers "Match the look".
    const offered = pairsFor(lookId(row.look)).map((p) => p.id);
    assert.ok(offered.includes('theme'));
    for (const id of hiddenPairs(lookId(row.look))) assert.ok(!offered.includes(id));
  });
}

test("changing to a look that hides the picked colours uses the look's own colours", () => {
  const p = pairInUse('sky', 'red-blue');
  assert.equal(p.id, 'theme');
  assert.equal(p.hour, LOOKS.sky.hc);
  assert.equal(p.minute, LOOKS.sky.mc);
  // Going back to a look that offers the pair brings it back.
  assert.equal(pairInUse('hero', 'red-blue').id, 'red-blue');
});
