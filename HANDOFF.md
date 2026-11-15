# Handoff

## What this is
Learning Clock is a small offline web app (PWA) for an Android tablet. It helps a young child (about 7 years old) learn to tell time from analog and digital clocks.

## Current state
- **Requirements are written in BDD** in [`features/`](features/).
- **Time logic is built and tested** in [`src/time.js`](src/time.js): time in words (both wording styles), part of day, scene, 12- and 24-hour clocks, analog hand angles.
- **Setting the clock is built and tested** in [`src/set-clock.js`](src/set-clock.js): dragging the minute and hour hands (the short way round, so going past the 12 changes the hour and AM/PM), the AM/PM switch, which hand a finger picks up, and "real time" or "set by hand" state with `shownTime`, `changeTime` and `realClock` ("back to now"). Times are wall times with a date, so going past midnight changes the day.
- **Tests read the `Examples` tables straight from the `.feature` files** ([`test/support/gherkin-examples.js`](test/support/gherkin-examples.js)), so changing an example changes the test. There are 100 tests. Run them with `npm test` (Node 22+, no dependencies). A GitHub Action runs them on every PR and on `main`.
- **No screen, PWA files or assets exist yet.** Nothing is installable on the tablet so far, and there are no version tags.
- **Six design concepts are ready to choose from** in a private claude.ai design canvas: [Learning Clock — 6 Design Concepts](https://claude.ai/artifact/Gqu9s9HPezc2AZosmrLtNG). The first board covers 10 journeys, every screen and how to reach it, and 9 UX rules. Each concept is a working prototype (press Play) on five screens: desktop 1440 × 900, tablet 1280 × 800 and 800 × 1280, phone 915 × 412 and 412 × 915. The generator that writes the canvas is in [`design/concepts-generator/`](design/concepts-generator/). **The owner hasn't picked a final concept yet.**
- [`features/README.md`](features/README.md) has the file index, platform notes, hosting and install steps, **assumptions** and **open questions**. Read it first.

| Feature file | Covers |
|---|---|
| `00-learning-clock.feature` | Goal, PWA install and update, works offline, survives the host being taken down, kid-friendly layout in portrait and landscape |
| `01-current-time.feature` | Device time, minute rollover, midnight, resuming from the background |
| `02-analog-clock.feature` | Clock face, hour and minute hands (no second hand), hour hand moving gradually between numbers |
| `03-digital-clocks.feature` | 12-hour with AM/PM highlighted; 24-hour with no AM/PM |
| `04-time-in-words.feature` | "It is 45 minutes past 9 in the morning." Always "minutes past", no fractions; midday/midnight |
| `05-time-of-day-scene.feature` | Sunrise / day / sunset / night background at fixed times that match the part-of-day words |
| `06-read-aloud.feature` | Speaker button, on-device text-to-speech, the same sentence as the words, word highlight (`@low-priority`) |
| `07-preferences.feature` | `@future`: parent preferences for wording style, part-of-day and scene times, voice |
| `08-set-the-clock.feature` | Drag the analog hands to set any time; AM/PM switch on the analog clock; a set time is static; every display follows; "back to now" button |
| `09-calendar.feature` | `@future`: calendar screen for days, weeks, months, years and seasons (by hemisphere), using the same ideas as the clock |

## Decisions made
- **Platform:** Android tablet, Chrome, installable offline PWA. No backend, no accounts, no network calls after install.
- **Hosting:** the repo stays **private** during development. To install or update, it's made public with GitHub Pages turned on, installed on the tablet, then made private again. The app must keep working once its address is gone. Only the owner changes repo visibility.
- **Stack:** plain HTML/CSS/JS with ES modules and no build step. Tests use Node's built-in runner, with no dependencies.
- **Answers from the owner** are recorded under "Decisions" in [`features/README.md`](features/README.md): no second hand; always "N minutes past H" (no quarter, half or to, because the child hasn't learnt fractions); the scene and the part-of-day words share boundaries (morning 05:00, afternoon 12:00, evening 17:00, night 20:00; scenes sunrise 05:00, day 07:00, sunset 17:00, night 20:00); word highlight is low priority; portrait and landscape are both supported, with the analog clock as the largest display; preferences come later.

## Design decisions (from the owner's review of the concepts)
These hold whichever concept is chosen. **They aren't in the feature files yet** (see next steps).
- **Any screen:** tablet and phone in both orientations, plus a desktop window. The layout is picked from width ÷ height, and nothing scrolls.
- **Themes children can pick**, named by picture: Sky, Blossom, Unicorn, Hero, Dino, Space. A theme only dresses the cards, clock rim, buttons and decorations. The sunrise, day, sunset or night scene always follows the time. Children change the look without a check, and a grown-up can hide the look button.
- **Hours and minutes linked by colour everywhere:** the hour colour is on the short hand, the 1–12 numbers, the hour digits and the hour in the sentence. The minute colour is on the long hand, a 0–55 minutes ring, the minute digits and "N minutes" in the sentence. Each theme has its own pair (Hero: red hours, blue minutes). Children can pick another pair in the look picker: red/blue, orange/purple, pink/teal or purple/orange. Every pair is checked at 4.5 : 1 or better on the face, cards and ring. Colour is never the only clue: the hour hand is short and thick, the minute hand long and thin.
- **Helpers can be switched off:** the grown-up setting "Hour and minute helpers" (default on) removes the ring and the colours once the child can read minutes. Both hands and all numbers take the theme's ink, and the digits and words become plain text.
- **Grown-up check:** one times-table question from the 6 to 9 tables (e.g. "What is 7 × 8?") on a big number pad. A new question each time; a wrong answer just clears it. It guards: wording style, hour and minute helpers, talking speed, hemisphere, whether children can change the look, part-of-day times, reset.

## Waiting on the owner (open questions)
- **Which concept** (or which mix) to build: 1 Clock Hub, 2 Storybook, 3 Toy Blocks, 4 Colour Links, 5 Full Face or 6 Clock Buddy. Answers for the future calendar (northern hemisphere by default, dd/mm/yyyy, week starts on Monday, months at their clock numbers on the year wheel) are under "Future: calendar" in [`features/README.md`](features/README.md).

## Likely next steps
1. Once a concept is chosen, write the design decisions above into BDD: a new feature file for themes and the look picker, the hour and minute colour links and the helpers setting (in or next to `02`/`03`/`04`), the grown-up check and settings (`07-preferences.feature`, now no longer only `@future`), and "any screen including desktop" in `00`. Add tests from their Examples where there's logic, such as which colour each part gets and the times-table check.
2. Build the clock screen (`index.html`, `src/app.js`, `styles.css`): plain HTML/CSS/JS with ES modules, no build step, every asset bundled locally. Follow the chosen concept: the generator's `parts.mjs` already has the theme tokens, colour pairs, sizes and the clock SVG. Draw the analog clock with SVG using `handAngles`. Every display reads `shownTime(state, new Date())`. Re-render once a minute and on `visibilitychange`; a set time stays still. Use pointer events with `touch-action: none` on the face, `pointerAngle` and `nearestHand` to pick up a hand, and `dragMinuteHand` or `dragHourHand` on each move.
3. Add the four scenes, then the read-aloud button (`speechSynthesis`, a local voice, `cancel()` before `speak()`).
4. Make it an installable offline PWA: manifest, icons, a cache-first service worker that never overwrites the cache with error responses, and `navigator.storage.persist()`.
5. Leave `@low-priority` and `@future` until the rest works.
6. More ideas may come (quizzes, rewards, special days on the calendar). Add each as a new `features/NN-*.feature`, or list it under "Possible later additions" in `features/README.md` until it's planned.

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
