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

## 6. Check against the design skills (15 Nov 2026)

The six concepts, the generator and the logic in `src/` were checked against four skills: **kids-app-ui-design** (children's UI), **web-design-guidelines** (Vercel's Web Interface Guidelines), **analog-clock-and-calendar-logic** and **offline-pwa-android**. Sizes below were measured from the generated artboards.

Skipped web rules, and why: hydration and React advice (no framework); preconnect to CDNs (offline app, so nothing may load from the web); URL state and deep links (one screen); Title Case, `&` and terse labels (the children's guidance wins: plain whole words); `Intl` date formats (the clock teaches one fixed format on purpose).

### 6.1 What already meets the standards

- **Themes** are token sets named by picture, and children change the look without a check. Every look × colour pair is checked in code (lowest 4.73 : 1). Pairs avoid red/green, and colour is never the only clue (short thick hour hand, long thin minute hand, the word "minutes").
- **The scene follows the time.** The skill says to keep the scene apart from the theme. Our rule, "the time picks the scene, the look paints it", keeps what matters: the picture never disagrees with the words.
- **Grown-up check** (`src/grown-up-check.js`): 6–9 tables, two-digit answers checked as soon as two digits are in, a new question never has the last answer, and the pad never locks.
- **Settings** (`src/settings.js`): one list read by the screen and the tests, a safe loader, and a reset that covers only the grown-up settings.
- **Helpers** are one grown-up setting, on by default. Turning them off hides the ring, the colours and the colour picker.
- **Layout:** `src/layout.js` uses the skill's ratios (1.2 and 0.85). Five screen sizes are drawn. On wide screens every concept keeps 320 px or more beside the clock for the other displays.
- **Clock logic** (`src/set-clock.js`): short-way-round dragging, the hour hand keeps the minutes, snap on release, AM/PM switch, a tie goes to the hour hand, wall-time maths, grips on both hands.
- **Markup:** icon buttons have `aria-label`, pictures are `aria-hidden`, panels are `role="dialog"`, the digits use `tabular-nums`, button labels don't wrap, and the clock face has `touch-action: none` and no text selection.

### 6.2 To fix on the canvas (the prototype disagrees with a decision)

1. **"Reset to defaults" also resets the child's look and colours** (`parts.mjs:421` sets `theme` and `hands` back). The decision and `src/settings.js` leave them alone. It also happens at once, with no "are you sure" or undo.
2. **The settings panel shows features that aren't built:** "Seasons on the calendar" (`parts.mjs:459`) and "Parts of the day" (`parts.mjs:276`). Both are `@future`. Remove them until they exist.
3. **The two-tone focus ring is lost on most buttons.** The `box-shadow` in `button:focus-visible` (`concepts.mjs:264`) is overridden by the inline `box-shadow` on icon buttons, the main button and "Back to now" (`parts.mjs:186`, `204`, `208`). Those buttons get only the yellow outline, about 1.4 : 1 on white. On the canvas, mark the focus `box-shadow` `!important`. In the app, keep button styles in CSS classes rather than inline, so `:focus-visible` wins.
4. **Gaps between children's buttons fall below 12 px on phones:** `gap` is 11 px and the button rows use 0.6–0.8 of it (7–9 px). The look picker uses 8 px. Keep every gap at 12 px or more.
5. **Buttons sit 14–16 px from the screen edge on phones** (`pad` in `parts.mjs:53`, 14 px in Toy Blocks). Android's back gesture starts at the edge, so keep children's buttons about 24 px in.
6. **Clock Buddy's look and "Now" buttons are 60 px on the tablet** (`small` in `concepts.mjs:188`). The skill asks for 64 px or more for children on tablets. (The lock and close buttons are for grown-ups, so 60 px is fine.)
7. **The number pad has the 0 bottom-left** (already noted in section 3). Put it in the middle of the bottom row, with delete on the right.
8. **A tap on the clock face turns the sign into "Back to now" even if no hand moved** (`parts.mjs:365`). The rule is that any *change* sets the time by hand. Wait for the first move.
9. **The minute hand wins a tie** on the canvas (`parts.mjs:363` uses `<`), unlike `nearestHand` in `src/set-clock.js`. Only matters where the hands overlap.
10. **Unused grown-up checks:** the "hold for 3 seconds" and "numbers in words" checks are still in `parts.mjs` (lines 257–268 and 403–411), though every concept uses the times table. Children pass the hold check, so remove both.

### 6.3 Gaps in the designs (not drawn yet)

1. **No "in between" screen.** All five artboards are wide (1.6, 2.2) or tall (0.63, 0.45), and every layout function only knows wide or not wide. A square-ish desktop window (for example 1000 × 900, ratio 1.11) falls into the tall layout. Add an in-between artboard and layout for the chosen concept, matching `layoutFor`.
2. **No "no voice" state for the read-aloud button.** `06-read-aloud.feature` says it shows as unavailable when the tablet has no offline voice. Draw it: greyed out, still labelled, and not looking like the hour or minute colour.
3. **No pressed state.** Buttons only change the cursor. On a touch screen a child needs to see the press: a darker fill or the button moving down onto its shadow.
4. **No keyboard way to set the time.** `00-learning-clock.feature` asks for every button to work with a keyboard, and the web guidelines ask for a tap or keyboard alternative to every drag. Suggest: each hand is a focusable slider (`role="slider"`, `aria-valuetext` like "9:45 AM"), and the arrow keys move it one minute or one hour. This needs a new scenario in `08-set-the-clock.feature` (owner to agree).
5. **Ring numbers are small on phones.** The 0–55 numbers are 13 units in a 240 viewBox, so they come out at 13–16 px on phone landscape in Storybook, Colour Links and Toy Blocks (clocks of 249–289 px). Elsewhere they are 17 px or more. Make them at least 16 px everywhere, by a larger font on small clocks or a bigger clock.
6. **Reduce motion isn't shown.** `10-looks.feature` has it, but the canvas has no `prefers-reduced-motion` rule, so stars, windows and balloons still move. The app must switch every transition off.

### 6.4 For the build (carry into the real app)

- **Fonts:** bundle every font locally; the canvas loads them from Google Fonts. Ten families are used across the concepts, so trim to the chosen concept's body font plus the six label fonts, or fewer. Andika (Colour Links, and the Buddy's sentence) is the only body font made for early readers, with a child-style "a" and "g". Consider it for the sentence and digits in whichever concept is chosen. Bangers (Hero) is all capitals and Audiowide (Space) is hard to read; keep them for look names, not for labels a child must read.
- **Scene changes:** the canvas animates gradient colours, `fill` and CSS `filter` (`parts.mjs:131–137`, `theme-art.mjs:289` and `330`). These redraw every frame. Draw the four scenes as layers and cross-fade them with `opacity` only. This also answers the speed worry in section 5.
- **Panels:** move focus into the panel when it opens and back when it closes, close on Escape, keep focus inside while open, and add `overscroll-behavior: contain` to the scrolling panel. Put "Not quite. Try again." in a live region so a screen reader says it (`parts.mjs:254`).
- **Page setup:** a viewport tag that does **not** block zoom; `env(safe-area-inset-*)` padding for phones with notches; `<meta name="theme-color">` per look; `color-scheme: dark` for Space; `touch-action: manipulation` and a deliberate `-webkit-tap-highlight-color` on buttons.
- **Hand picking:** `nearestHand` measures in units of the face's radius (0.5 and 0.8). With the ring on, the face is smaller than the SVG, so divide the finger's position by the face radius, not by half the SVG width.
- **Small things:** "o'clock" uses a straight apostrophe; the display could use ’ (the spoken text doesn't care, but the tests compare exact strings, so change both together). The slower talking speed is 0.8; the skill suggests 0.85–0.9 for young listeners, so try both on the tablet.
