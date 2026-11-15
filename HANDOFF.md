# Handoff

## What this is
Learning Clock is a small offline web app (PWA) for an Android tablet. It helps a young child (about 7 years old) learn to tell time from analog and digital clocks.

## Current state
- **Requirements are written in BDD** in [`features/`](features/).
- **Time logic is built and tested** in [`src/time.js`](src/time.js): time in words (both wording styles), part of day, scene, 12- and 24-hour clocks, analog hand angles. There's no screen yet.
- **Tests read the `Examples` tables straight from the `.feature` files** ([`test/support/gherkin-examples.js`](test/support/gherkin-examples.js)), so changing an example changes the test. Run them with `npm test` (Node 22+, no dependencies). A GitHub Action runs them on every PR.
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
| `08-set-the-clock.feature` | Drag the analog hands to set any time; every display follows; "back to now" button |

## Decisions made
- **Platform:** Android tablet, Chrome, installable offline PWA. No backend, no accounts, no network calls after install.
- **Hosting:** the repo stays **private** during development. To install or update, it's made public with GitHub Pages turned on, installed on the tablet, then made private again. The app must keep working once its address is gone. Only the owner changes repo visibility.

- **Answers from the owner** are recorded under "Decisions" in [`features/README.md`](features/README.md): no second hand; always "N minutes past H" (no quarter, half or to, because the child hasn't learnt fractions); the scene and the part-of-day words share boundaries (morning 05:00, afternoon 12:00, evening 17:00, night 20:00; scenes sunrise 05:00, day 07:00, sunset 17:00, night 20:00); word highlight is low priority; portrait and landscape are both supported, with the analog clock as the largest display; preferences come later.

## Waiting on the owner (open questions)
See "Open questions" in [`features/README.md`](features/README.md). They're about setting the clock: a quicker AM/PM switch, speaking when a hand is let go, and whether a set time should tick.

## Likely next steps
1. Add tested logic for dragging the hands (`08-set-the-clock.feature` Examples): an angle snaps to a minute, and crossing the 12 moves 12 hours either way. Keep the shown time as "real" or "set" state that every display reads from.
2. Build the clock screen: plain HTML/CSS/JS with ES modules, no build step, every asset bundled locally. Draw the analog clock with SVG using `handAngles`. Update all displays together once a minute and on `visibilitychange`.
3. Add the four scenes, then the read-aloud button (`speechSynthesis`, a local voice, `cancel()` before `speak()`).
4. Make it an installable offline PWA: manifest, icons, a cache-first service worker that never overwrites the cache with error responses, and `navigator.storage.persist()`.
5. Leave `@low-priority` and `@future` until the rest works.
6. More ideas may come (quizzes, rewards). Add each as a new `features/NN-*.feature`.

## Repo rules
- No personal details (names, emails, home-folder paths) in files or git metadata. Commits use the repo-local GitHub noreply identity.

## Workflow
- **`main` must always be installable.** GitHub Pages builds from `main`, and that's what goes on the tablet.
- Use one **short-lived branch per change**, then a **PR**, then the owner **squash-merges** it and the branch is deleted. Only trivial fixes such as typos go straight to `main`.
- **Tag each installed version** (`v1`, `v2`, …) so it's clear what's on the tablet.
- A GitHub Action ([`.github/workflows/test.yml`](.github/workflows/test.yml)) runs `npm test` on every PR and on `main`. The tests come from the `Examples` tables in the feature files.
- Keep this file up to date in the same PR as the work it describes.
- **Test the logic, check the visuals by eye:** time maths and wording live in plain, unit-tested functions.
