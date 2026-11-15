# Design canvas review (15 Nov 2026)

A critical review of the six concepts and six looks before building starts. Changes marked **Done** are in the generator and on the canvas. The rest are recommendations to settle when a concept is chosen.

## 1. Theme depth: how far each look leans into its theme

Scored out of 10: colour palette (2), pictures and characters (3), background and landscape (2), styled parts such as cards, buttons and the clock ring (2), lettering (1).

| Look | Before | What it had | After | What it has now |
|---|---|---|---|---|
| Sky | 3 | Blue cards and a white cloud motif that blended into the real clouds | **7** | Above-the-clouds world: a sea of clouds for ground, hot-air balloons, a kite, a paper plane, birds, a cloud-shaped clock ring, soft sky-gradient cards |
| Blossom | 3 | Pink colours and a **heart** motif (not a blossom) | **8** | Cherry trees, tulips, daisies, falling petals, butterflies by day and fireflies at night, a blossom branch in the corner, a 12-petal clock ring, petal-corner cards |
| Unicorn | 3 | Purple colours and a sparkle motif (the buddy in concept 6 only) | **8** | Rainbow, fairy-tale castle with windows that light up at night, a unicorn on candy-coloured hills, sparkles, a rainbow clock ring, rainbow-edged cards, a gradient main button |
| Hero | 3–4 | Red, yellow and blue, and a small bolt motif | **8** | A comic city with lit windows and a searchlight at night, a caped hero on a rooftop, halftone sky, ZAP! and POW! bursts, a comic starburst clock ring, ink-outlined panels with hard shadows |
| Dino | 2–3 | Greens and a leaf motif; no dinosaur anywhere except the concept 6 buddy | **8** | Smoking volcano (glowing lava at night), a long-neck dinosaur, pterosaurs, palms, ferns, footprints, back-plate spikes round the clock, speckled cards |
| Space | 4 | Dark cards and a rocket motif; only spacey when the scene happened to be night | **8** | Moon base with craters, rocket on its pad, astronaut with flag, observatory, ringed planets, a UFO, an orbit ring with a planet and moon round the clock, starry glass cards and a glowing button |

Every look now has the same eight parts, so they differ in more than font and colour:

1. **Sky paint:** its own colours for sunrise, day, sunset and night.
2. **Landscape:** its own ground and characters, dimmed by the scene, with lights that come on at night.
3. **Corner pictures:** one at the top right, one at the bottom left.
4. **Clock ring shape:** cloud, petals, rainbow, starburst, spikes or orbit. It sits behind the 0–55 minutes and never inside the face.
5. **Picker badge:** one big picture per look, so a child who can't read can still choose.
6. **Card and button style.**
7. **Label font:** used for small labels and look names only. The sentence and the digits keep the readable font.
8. **Colour tokens.**

The "Change the look" journey and rule 6 on the first board have been updated to match. The rule is now written as `10-looks.feature`. On the canvas, each look also changes in its own way: windows, castle lights, fireflies and stars come on one by one, Sky's balloons drift down to land, and Dino's lava starts to glow.

**One decision changed (confirmed by the owner).** The old rule was "scene and theme stay apart". The new one is "**the time picks the scene, the look paints it**": the time still decides sunrise, day, sunset or night, so the picture always agrees with the words, but each look paints that scene its own way (for example, Space's day sky is a deeper cobalt). Every look keeps the same reading: a light sky with a high sun is day, a dark sky with a moon is night.

## 2. Accessibility and clarity

- **Done:** the button colour no longer looks like the hour or minute colour. Hero's buttons were the same red as its hours, so "red" meant both "hours" and "press me". Hero buttons are now yellow with dark ink. Blossom's hour colour moved from crimson (next to its pink buttons) to purple. `check.mjs` now also hides any child-pickable colour pair that clashes with the current look: red/blue on Sky; red/blue and pink/teal on Blossom; orange/purple and purple/orange on Unicorn.
- **Done:** the hands have a thin white outline, so the hour hand stays visible when it sits under the minute hand (for example at 6:30 or 12:00).
- **Done:** labels are no longer in capitals ("12-hour", not "12-HOUR"). Lower case is easier for early readers.
- **Done:** the focus ring is two-tone (dark inside, yellow outside), so it shows on white cards too. Yellow alone was about 1.4 : 1 on white.
- **Done:** icon buttons have a soft edge, so they don't vanish against light backgrounds such as Sky's clouds.
- **Done:** `check.mjs` checks every look × colour pair. The lowest hour or minute contrast is 4.73 : 1, button text is 4.5 : 1 or better, control outlines are 3 : 1 or better, and card text ink is 7 : 1 or better.
- **Done:** the AM and PM chips on the 12-hour clock are gone. They looked like buttons but did nothing. The 12-hour clock now writes the one that applies after the time as plain text ("9:45 PM"). AM and PM side by side only appear on the AM/PM switch, which works. This is in `03-digital-clocks.feature`.
- **Decided:** picture-only buttons are fine when the picture alone makes the meaning clear (speaker, clock with a back arrow, palette, lock). Otherwise a short word goes with it. Every button keeps a full label for screen readers. This is in `00-learning-clock.feature` and rule 5.
- **Decided:** the Storybook tags keep their slight tilt. It looks good, and children can still read it.

## 3. Ease of use (UX)

- **Done:** each hand now has a round grip near its tip, in the hand's colour with a light edge, so a child can see the hands can be moved. The hour grip is bigger. This is in `08-set-the-clock.feature`. Still an idea: a one-time gentle "wiggle" hint on first open (it would respect reduce-motion).
- **Done:** the calendar button is hidden until the calendar is built, and every layout keeps room for it (`CALENDAR_BUILT` in `parts.mjs`). This is in `00-learning-clock.feature`.
- **Done:** "Real time" and "My time" are replaced by one sign in one place. It says "Now" with a green dot while the clock follows the tablet, and it is not a button. When the time is set by hand, it turns into the "Back to now" button: a turn-back arrow and an outline instead of the dot. Nothing else moves. I didn't use a red dot or a cross: red means "wrong" to many children, and it's the hour colour in several looks. This is in `08-set-the-clock.feature`.
- On the grown-up number pad, the 0 sits bottom-left. Put it in the middle of the bottom row, like a phone keypad.

## 4. Appeal for children

- Concepts that cover most of the screen with cards (3 Toy Blocks, and 5 Full Face on phones) hide most of the landscape. The looks still show through the clock ring, cards and corners, but Clock Hub, Storybook, Colour Links and Clock Buddy show off the looks best.
- The Clock Buddy (concept 6) is the strongest single appeal feature. The new landscapes give each look a character too (unicorn, hero, dinosaur, astronaut), so a buddy could be added to any concept later.

## 5. Room to grow

- A new look is one entry in `THEMES` plus one kit in `theme-art.mjs`: paint, landscape, corners, ring, badge and motif. A new screen (calendar, quizzes, rewards) reuses the kit: card style, label font, badge and characters.
- **For the real app:** each look's pictures should be separate SVG files loaded only for the chosen look. On the canvas all six are inlined in every frame, which is why each artboard is about 600 KB. The scene lighting uses CSS filters. If that's slow on the tablet, render the four scene versions ahead of time.
