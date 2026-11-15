import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examples, parseTime } from './support/gherkin-examples.js';
import { LOOKS, LOOK_IDS, PAIRS, contrastRatio, hiddenPairs, pairsFor, pairInUse } from '../src/colours.js';
import { scene } from '../src/time.js';
import { cornerArt } from '../src/look-art.js';
import { PAINT, cornerDayStyle, landParts, sceneHoles, sceneMarkup, sceneTiming, sceneValues } from '../src/scene-art.js';

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

// --- Each look's scenes (src/scene-art.js) ---

const lightness = (hex) => contrastRatio(hex, '#000000');
const seconds = (dur) => parseFloat(dur);

for (const row of examples('10-looks.feature', 'Each look has its own version of each scene')) {
  test(`${row.look} at ${row.time} shows its own ${row.scene} scene`, () => {
    const { hours, minutes } = parseTime(row.time);
    assert.equal(scene(hours, minutes), row.scene);
    const look = lookId(row.look);
    const paint = PAINT[look][row.scene];
    // Painted in the look's own colours: no other look has this sky.
    for (const other of LOOK_IDS.filter((id) => id !== look)) {
      assert.notDeepEqual(PAINT[other][row.scene], paint, `${row.look} and ${other} share a ${row.scene} sky`);
    }
    // The look draws its own world, and only that look's world.
    const markup = sceneMarkup('test', sceneHoles, [look]);
    const ground = (id) => landParts(id).ground.replace(/-ID/g, '-test'); // pattern ids are filled in
    assert.ok(markup.includes(ground(look)));
    for (const other of LOOK_IDS.filter((id) => id !== look)) {
      assert.ok(!markup.includes(ground(other)), `${row.look} also draws ${other}`);
    }
  });
}

for (const row of examples('10-looks.feature', 'Every look keeps the same reading of the day')) {
  test(`${row.look}: a light sky with the sun high by day, a dark sky with the moon and stars at night`, () => {
    const look = lookId(row.look);
    assert.equal(scene(12, 0), 'day');
    assert.equal(scene(21, 0), 'night');
    const day = sceneValues(look, 'day');
    const night = sceneValues(look, 'night');
    // Even the darkest part of the day sky is clearly lighter than any of the night sky.
    const darkestDay = Math.min(lightness(day.top), lightness(day.bot));
    const lightestNight = Math.max(lightness(night.top), lightness(night.bot));
    assert.ok(darkestDay / lightestNight >= 2.5, `${row.look}: day and night skies are too alike`);
    // The sun is high by day, and low at sunrise and sunset.
    assert.ok(day.oy < sceneValues(look, 'sunrise').oy && day.oy < sceneValues(look, 'sunset').oy);
    assert.equal(day.moon, 0);
    assert.equal(day.stars, 0);
    // At night the moon and stars are out, and the moon stands out from the sky.
    assert.equal(night.moon, 1);
    assert.equal(night.stars, 1);
    assert.ok(contrastRatio(night.orb, night.top) >= 3);
  });
}

for (const row of examples('10-looks.feature', 'Moving into the night')) {
  test(`${row.look} has its own change into the night`, () => {
    const land = landParts(lookId(row.look));
    // Night lights (all at once or one by one), or things that leave for the night.
    assert.ok(land.glow || land.seq?.length || land.drift, `${row.look} has nothing that changes at night`);
    if (/one by one/.test(row.change) && row.look !== 'Space') {
      assert.ok(land.seq?.length > 1, `${row.look}'s lights don't come one by one`);
    }
    // About 2 seconds, with the lights and stars coming one by one.
    const { dur, stag } = sceneTiming();
    assert.ok(seconds(dur) >= 1.5 && seconds(dur) <= 3);
    assert.equal(stag, 1);
  });
}

test('moving into the morning: night lights go out and day things come back', () => {
  for (const look of LOOK_IDS) {
    const night = sceneValues(look, 'night');
    const sunrise = sceneValues(look, 'sunrise');
    assert.ok(sunrise.glow < night.glow);
    assert.ok(sunrise.dayO > night.dayO);
    assert.ok(sunrise.sink < night.sink, 'the balloons come back up');
  }
});

test('changing scene while dragging the hands keeps up with them', () => {
  const quick = sceneTiming({ dragging: true });
  assert.ok(seconds(quick.dur) <= 0.5, `takes ${quick.dur}`);
  assert.equal(quick.stag, 0, 'nothing waits its turn');
});

test('with less motion the new scene appears straight away', () => {
  assert.deepEqual(sceneTiming({ reducedMotion: true }), { dur: '0s', stag: 0 });
  assert.deepEqual(sceneTiming({ reducedMotion: true, dragging: true }), { dur: '0s', stag: 0 });
});

test('the app fills every hole with a CSS variable, and the canvas with its own', () => {
  const app = sceneMarkup('app', sceneHoles, ['sky']);
  assert.ok(!app.includes('{{'));
  assert.match(app, /translate\(calc\(var\(--sc-ox\) \* 1px\), calc\(var\(--sc-oy\) \* 1px\)\)/);
  assert.match(cornerDayStyle(sceneHoles), /^opacity:var\(--sc-dayO\);/);
});

test("the corner pictures follow the night too: Sky's balloon, Unicorn's rainbow and Dino's pterosaur go", () => {
  const corners = cornerArt('DAY-ONLY');
  for (const look of ['sky', 'unicorn', 'dino']) {
    assert.ok(corners[look].tr.includes('style="DAY-ONLY"'), `${look}'s corner stays out at night`);
  }
});
