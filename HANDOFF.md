# Handoff

## What this is
Learning Clock is a small offline web app (PWA) for an Android tablet. It helps a young child (about 7 years old) learn to tell time from analog and digital clocks.

## Current state
- **Requirements are written in BDD** in [`features/`](features/).
- **Time logic is built and tested** in [`src/time.js`](src/time.js): time in words (both wording styles), part of day, scene, 12- and 24-hour clocks, analog hand angles.
- **Setting the clock is built and tested** in [`src/set-clock.js`](src/set-clock.js): dragging the minute and hour hands (the short way round, so going past the 12 changes the hour and AM/PM), the AM/PM switch, which hand a finger picks up, and "real time" or "set by hand" state with `shownTime`, `changeTime`, `moveTime` (a change that gives the same time changes nothing, so a touch alone keeps the real time) and `realClock` ("back to now"). `dragHandTo` turns a finger's point into a time, ignoring the middle of the face. Times are wall times with a date, so going past midnight changes the day.
- **Colours, the grown-up check, settings and layout are built and tested:** [`src/colours.js`](src/colours.js) holds every look's colours, the hour and minute colour pairs, which pairs each look hides, and the colour of every part of the screen with the helpers on or off. The design canvas generator imports it, so the canvas and the app share one set of colours. [`src/grown-up-check.js`](src/grown-up-check.js) asks a 6–9 times-table question and handles the number pad. [`src/settings.js`](src/settings.js) has each setting's label, choices and default, and loads stored settings safely. [`src/layout.js`](src/layout.js) picks wide, tall or in between from width ÷ height, and `clockHubLayout` gives every size on the Clock Hub screen. The design generator imports these sizes too. `sentenceParts` in `time.js` splits the sentence into hour, minute and plain pieces for colouring.
- **Tests read the `Examples` tables straight from the `.feature` files** ([`test/support/gherkin-examples.js`](test/support/gherkin-examples.js)), so changing an example changes the test. There are 319 tests. Run them with `npm test` (Node 22+, no dependencies). A GitHub Action runs them on every PR and on `main`.
- **The Clock Hub clock screen is built** (15 Nov), in the Sky look:
  - What it shows: the analog clock with the minutes ring, the AM/PM switch, both digital clocks, the sentence, and the "Now" sign that turns into "Back to now".
  - How it works: drag a hand (or use the arrow and Page keys on it), and all three layouts are picked from the screen's shape.
  - Files: [`index.html`](index.html) and [`styles.css`](styles.css) are the page. [`src/clock-view.js`](src/clock-view.js) works out what every display shows (tested in Node). [`src/clock-face.js`](src/clock-face.js) draws the SVG and turns a finger into a point on the face. [`src/app.js`](src/app.js) only connects them to the page. Tests are in [`test/clock-screen.test.js`](test/clock-screen.test.js).
  - Sizes come from `clockHubLayout` as CSS variables, with two changes from the canvas. In the wide layout, the clock leaves room for digits at 60 % of their full size (at exactly 1.2 wide they were unreadable). In the tall layout, the clock fills whatever height is left (CSS container units).
  - Checked in the browser at 13 screen sizes, including every example in `00`: nothing overflows, overlaps or is cut off, the clock is the largest display, and the ring numbers are 16 px or more. Dragging, the keyboard, AM/PM and "Back to now" were tried by hand.
  - **Not built yet:** the grown-up check and settings (the defaults are used), the scenes (a plain background in the look's soft colour for now), read-aloud and local fonts (the system font for now). There are no buttons for these, and the layout keeps room for them.
- **The look picker and all six looks are built** (15 Nov):
  - **Picker:** the palette button opens [`src/look-picker.js`](src/look-picker.js), a native `<dialog>` (`showModal`), so focus stays inside, Escape closes it, and focus goes back to the button. It has six picture tiles, then the hour and minute colours the look allows (none while the helpers are off). A pick applies straight away.
  - **Saved choice:** [`src/look-choice.js`](src/look-choice.js) keeps `{ look, pair }` in `localStorage` (`learning-clock:look`), loads it safely, and works out what the picker shows. A pair the look hides is kept for later, and the look's own colours are shown meanwhile.
  - **The look's kit:** [`src/look-art.js`](src/look-art.js) holds each look's card style, ring shape, corner pictures, picker picture and motifs. It moved here from the design generator, which now imports it; the canvas output is byte-for-byte the same. `app.js` puts the card styles in a `<style>` built by `lookStyleSheet()`, keyed on `data-look` on `<html>`.
  - **Not used yet:** the display fonts (`dfont`) are for look names only (REVIEW 6.4), and wait for the fonts PR. `btnFx` waits for the speaker button.
  - **Startup:** the page stays hidden until the look is applied, so Sky never flashes up first.
  - Each look's world behind the screen (sky and landscape) comes with the scenes PR. Its paint and landscapes are still in `design/concepts-generator/theme-art.mjs`.
  - Checked in the browser in all six looks and 9 screen sizes. The picker fits (it scrolls inside itself on a 470 × 470 window), its targets are 48 px or more, and the choice survives a reload. Some ring shapes reach about 10 % past the clock and tuck under the AM/PM switch, as in the design.
- **The app is an installable offline PWA** (15 Nov). Pieces:
  - [`manifest.webmanifest`](manifest.webmanifest): full screen (`display_override: fullscreen`, falling back to standalone), any orientation, Sky's colours, and every address relative so it works from the GitHub Pages sub-folder.
  - [`icons/`](icons/): drawn by [`tools/make-icons.mjs`](tools/make-icons.mjs) (`npm run icons`, no dependencies). A clock at ten past ten in Sky's hour and minute colours, with a maskable version.
  - [`sw.js`](sw.js): stores every file in `FILES` on install (skipping the HTTP cache), serves from the device first, never stores network answers, and opens the start page for any page. It has no `skipWaiting`, so a new version takes over only when the app starts fresh. It deletes older `learning-clock-*` caches on activate.
  - [`src/pwa.js`](src/pwa.js): registers the worker with `updateViaCache: 'none'` and asks for persistent storage. A failed update check (address gone) is ignored.
  - **`BUILD` in `sw.js` is a fingerprint of every stored file.** After changing any of them, run `npm run stamp`, or the tests fail. When adding a file the app loads, add it to `FILES` too. A test crawls `index.html`, the manifest, CSS (`url()`, `@import`) and JS imports, and fails if `FILES` doesn't match.
  - [`test/00-offline-app.test.js`](test/00-offline-app.test.js) runs `sw.js` in a pretend browser ([`test/support/fake-service-worker.js`](test/support/fake-service-worker.js)): offline, address gone (404), a failed install, updates, and broken storage.
  - Checked in the built-in browser from a `/learning-clock/` sub-folder: install, offline, an update that waits until the next fresh start, and the host returning 404.
  - `npm run serve` serves the app at `http://localhost:8123`. `.nojekyll` stops GitHub Pages running Jekyll.
  - **While developing,** the service worker keeps serving the old files after you edit them. In Chrome DevTools, go to Application → Service workers and tick "Bypass for network", or clear the site data before reloading.
  - Not yet tagged or installed on the tablet.
- **Concept 1, Clock Hub, is chosen** (15 Nov). The six concepts are in a private claude.ai design canvas: [Learning Clock — 6 Design Concepts](https://claude.ai/artifact/Gqu9s9HPezc2AZosmrLtNG). The first board covers 10 journeys, every screen and how to reach it, and 9 UX rules. Each concept is a working prototype (press Play) on five screens: desktop 1440 × 900, tablet 1280 × 800 and 800 × 1280, phone 915 × 412 and 412 × 915. Clock Hub also has two in-between screens: a desktop window made narrow (1000 × 900) and a small square window (470 × 470). Its board has tweaks for no voice and less motion. The generator that writes the canvas is in [`design/concepts-generator/`](design/concepts-generator/). Only Clock Hub is kept up to date on the canvas now; the other five stay as they were when it was chosen.
- **Design review (15 Nov):** [`design/REVIEW.md`](design/REVIEW.md) scores how far each look leans into its theme (all were 2–4 out of 10). Each look is now a full kit: sky paint, landscape with characters, corner pictures, clock-ring shape, picker badge, card and button style and label font. All six now score 7–8. It also lists accessibility and UX fixes (done or still to decide). Run `node design/concepts-generator/check.mjs` after changing any colour.
- **Standards check (15 Nov):** section 6 of [`design/REVIEW.md`](design/REVIEW.md) checks the concepts and `src/` against the kids-app UI, web interface guidelines, clock logic and offline PWA skills. The logic in `src/` meets them. The 10 canvas fixes are done and republished (reset keeps the child's look and has an Undo, no settings for unbuilt features, focus ring, 12 px gaps, 24 px from phone edges, 64 px child buttons, phone-style number pad, a touch alone doesn't set the time). The 6 design gaps are drawn for Clock Hub (in-between layout, "no voice" state, pressed states, keyboard sliders on the hands, ring numbers at least 16 px, less motion). Section 6.4 lists what to carry into the build.
- [`features/README.md`](features/README.md) has the file index, platform notes, hosting and install steps, **assumptions** and **open questions**. Read it first.

| Feature file | Covers |
|---|---|
| `00-learning-clock.feature` | Goal, PWA install and update, works offline, survives the host being taken down, kid-friendly layout picked from the screen's shape (tablet, phone or desktop window) |
| `01-current-time.feature` | Device time, minute rollover, midnight, resuming from the background |
| `02-analog-clock.feature` | Clock face, hour and minute hands (no second hand), hour hand moving gradually between numbers |
| `03-digital-clocks.feature` | 12-hour with the AM or PM that applies written after it; 24-hour with no AM/PM |
| `04-time-in-words.feature` | "It is 45 minutes past 9 in the morning." Always "minutes past", no fractions; midday/midnight |
| `05-time-of-day-scene.feature` | Sunrise / day / sunset / night background at fixed times that match the part-of-day words |
| `06-read-aloud.feature` | Speaker button, on-device text-to-speech, the same sentence as the words, word highlight (`@low-priority`) |
| `07-preferences.feature` | Grown-up check (one 6–9 times-table question) and settings: wording style, hour and minute helpers, talking speed, children can change the look, reset. `@future` rules: part-of-day and scene times, voice, hemisphere |
| `08-set-the-clock.feature` | Drag the analog hands to set any time; AM/PM switch on the analog clock; a set time is static; every display follows; "back to now" button |
| `09-calendar.feature` | `@future`: calendar screen for days, weeks, months, years and seasons (by hemisphere), using the same ideas as the clock |
| `10-looks.feature` | Six looks children can pick: each look's own world, its own sunrise/day/sunset/night and how it changes between them, readable pictures, colour pairs hidden when they clash |
| `11-hour-and-minute-colours.feature` | The hour colour and minute colour on the same parts of every display, the 0–55 minutes ring, each look's own pair, pairs a child can pick, contrast, and the helpers switched off |

## Decisions made
- **Platform:** Android tablet, Chrome, installable offline PWA. No backend, no accounts, no network calls after install.
- **Hosting:** the repo stays **private** during development. To install or update, it's made public with GitHub Pages turned on, installed on the tablet, then made private again. The app must keep working once its address is gone. Only the owner changes repo visibility.
- **Stack:** plain HTML/CSS/JS with ES modules and no build step. Tests use Node's built-in runner, with no dependencies.
- **Answers from the owner** are recorded under "Decisions" in [`features/README.md`](features/README.md): no second hand; always "N minutes past H" (no quarter, half or to, because the child hasn't learnt fractions); the scene and the part-of-day words share boundaries (morning 05:00, afternoon 12:00, evening 17:00, night 20:00; scenes sunrise 05:00, day 07:00, sunset 17:00, night 20:00); word highlight is low priority; portrait and landscape are both supported, with the analog clock as the largest display; the grown-up settings are in the first version, but part-of-day times, the voice and the hemisphere come later.

## Design decisions (from the owner's review of the concepts)
These hold whichever concept is chosen. **All of them are now in the feature files**, and the ones with logic are tested.
- **Any screen:** tablet and phone in both orientations, plus a desktop window. The layout is picked from width ÷ height (wide 1.2 or more, tall 0.85 or less, otherwise in between), and nothing scrolls (`00`).
- **Themes children can pick**, named by picture: Sky, Blossom, Unicorn, Hero, Dino, Space. **The time picks the scene, the look paints it:** the time decides sunrise, day, sunset or night (so the picture agrees with the words); the look decides the sky colours, landscape, characters, clock ring, cards, buttons and corner pictures. *(Confirmed by the owner on 15 Nov; written as `10-looks.feature`.)* Each look also changes between scenes in its own way. A button colour never looks like the hour or minute colour; the picker hides a colour pair that would clash with the look. Children change the look without a check, and a grown-up can hide the look button.
- **Hours and minutes linked by colour everywhere:** the hour colour is on the short hand, the 1–12 numbers, the hour digits and the hour in the sentence. The minute colour is on the long hand, a 0–55 minutes ring, the minute digits and "N minutes" in the sentence. Each theme has its own pair (Hero: red hours, blue minutes, yellow buttons). Children can pick another pair in the look picker: red/blue, orange/purple, pink/teal or purple/orange. Every pair is checked at 4.5 : 1 or better on the face, cards and ring. Colour is never the only clue: the hour hand is short and thick, the minute hand long and thin (`11`).
- **Helpers can be switched off:** the grown-up setting "Hour and minute helpers" (default on) removes the ring and the colours once the child can read minutes. Both hands and all numbers take the theme's ink, and the digits and words become plain text (`11`, `07`).
- **12-hour clock:** shows only the AM or PM that applies, as plain text after the time ("9:45 PM"). AM and PM side by side only appear on the AM/PM switch (`03`).
- **Now sign:** one sign shows "Now" with a green dot while the clock follows the tablet. When the time is set by hand, it turns into the "Back to now" button in the same place (`08`).
- **Hand grips:** each hand has a round grip near its tip, in the hand's colour, with a bigger one on the hour hand (`08`).
- **Buttons:** a button can show only its picture when the picture is clear, and there is no button for a feature that isn't built yet. The calendar button stays hidden until the calendar exists (`00`).
- **Grown-up check:** one times-table question from the 6 to 9 tables (e.g. "What is 7 × 8?") on a big number pad. A new question each time; a wrong answer just clears it. It guards: wording style, hour and minute helpers, talking speed, whether children can change the look, and reset. Later also part-of-day times, the voice and the hemisphere (`07`). "Reset to defaults" leaves the child's look and colours alone (confirmed by the owner on 15 Nov).

## Waiting on the owner (open questions)
- Nothing blocking. Answers for the future calendar (northern hemisphere by default, dd/mm/yyyy, week starts on Monday, months at their clock numbers on the year wheel) are under "Future: calendar" in [`features/README.md`](features/README.md).

## Likely next steps
Each of these is its own PR. Add every new file to `FILES` in `sw.js` and run `npm run stamp`.
1. **Grown-up check and settings** (`07`): the lock button, `grown-up-check.js` on a big number pad, the settings panel from `settings.js` (reuse the `.panel` dialog styles), kept on the device with `loadSettings`, and reset with Undo. "Children can change the look" already hides the look button when it's off.
2. **Scenes** (`05`, `10`): the four scenes as layers that cross-fade using opacity only, behind the screen. Move each look's paint and landscape from `theme-art.mjs` into `src/` the way `look-art.js` was moved, and pass the day style to `cornerArt()` so Sky's balloon lands at night.
3. **Read-aloud** (`06`): the speaker button (`speechSynthesis`, a local voice, `cancel()` before `speak()`, rate from `SPEECH_RATE`), and the "No voice" state.
4. **Local fonts** (REVIEW 6.4: Baloo 2 for labels, maybe Andika for the sentence and digits, and each look's display font for look names in the picker). Downloading the font files needs the owner's OK.
5. Install it on the tablet (steps in `features/README.md`) and tag `v1`. This can happen at any point to check the install.
6. Leave `@low-priority` and `@future` until the rest works.
7. More ideas may come (quizzes, rewards, special days on the calendar). Add each as a new `features/NN-*.feature`, or list it under "Possible later additions" in `features/README.md` until it's planned.

## Repo rules
- No personal details (names, emails, home-folder paths) in files or git metadata. Commits use the repo-local GitHub noreply identity.

## Workflow
- **`main` must always be installable.** GitHub Pages builds from `main`, and that's what goes on the tablet.
- Use one **short-lived branch per change**, then a **PR**, then the owner **squash-merges** it and the branch is deleted. Only trivial fixes such as typos go straight to `main`.
- **Avoid stacked PRs.** Branch from `main` once the previous PR has merged. If a PR has to be stacked, its base must be changed to `main` (rebase with `git rebase --onto origin/main <old-parent>`) before the owner merges it. Otherwise it merges into the parent branch and never reaches `main`. This happened to PR #5, so its code was landed again in a new PR.
- After each merge, check that the author on `main` is the GitHub handle and noreply email (`git log origin/main -3 --format='%an <%ae>'`).
- **Tag each installed version** (`v1`, `v2`, …) so it's clear what's on the tablet.
- A GitHub Action ([`.github/workflows/test.yml`](.github/workflows/test.yml)) runs `npm test` on every PR and on `main`. The tests come from the `Examples` tables in the feature files.
- Keep this file up to date in the same PR as the work it describes.
- **Test the logic, check the visuals by eye:** time maths and wording live in plain, unit-tested functions.
