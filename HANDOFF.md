# Handoff

## What this is
Learning Clock is a small offline web app (PWA) for an Android tablet. It helps a young child (about 7 years old) learn to tell time from analog and digital clocks.

## Current state
- **Requirements are written in BDD** in [`features/`](features/). No app code exists yet.
- [`features/README.md`](features/README.md) has the file index, platform notes, hosting and install steps, **assumptions** and **open questions**. Read it first.

| Feature file | Covers |
|---|---|
| `00-learning-clock.feature` | Goal, PWA install and update, works offline, survives the host being taken down, kid-friendly layout |
| `01-current-time.feature` | Device time, minute rollover, midnight, resuming from the background |
| `02-analog-clock.feature` | Clock face, hands, hour hand moving gradually between numbers |
| `03-digital-clocks.feature` | 12-hour with AM/PM highlighted; 24-hour with no AM/PM |
| `04-time-in-words.feature` | "It is 12 minutes past 9 in the morning." past/to rules, midday/midnight |
| `05-time-of-day-scene.feature` | Sunrise / day / sunset / night background at fixed times |
| `06-read-aloud.feature` | Speaker button, on-device text-to-speech, the same sentence as the words |

## Decisions made
- **Platform:** Android tablet, Chrome, installable offline PWA. No backend, no accounts, no network calls after install.
- **Hosting:** the repo stays **private** during development. To install or update, it's made public with GitHub Pages turned on, installed on the tablet, then made private again. The app must keep working once its address is gone. Only the owner changes repo visibility.

## Waiting on the owner (open questions)
1. Second hand on the analog clock? (Assumed no.)
2. Should the scene boundaries (sunset starts 18:00) line up with the part-of-day words (evening starts 17:00)?
3. Is "quarter to 12 midday" the right wording for 11:45?
4. Highlight each word as it's spoken? (Nice-to-have.)
5. Screen layout: portrait, landscape or both? Should the analog clock be the largest?

## Likely next steps
1. Get answers to the open questions, then update the feature files.
2. More ideas may come (quizzes, setting the clock, rewards, a parent mode). Add each as a new `features/NN-*.feature`.
3. Choose a stack. Plain HTML/CSS/JS or a light build (such as Vite) is enough. Bundle every asset locally.
4. Build the time-in-words logic first, test-driven from the Examples tables in `04-time-in-words.feature`, because it's the trickiest part.

## Repo rules
- No personal details (names, emails, home-folder paths) in files or git metadata. Commits use the repo-local GitHub noreply identity.

## Workflow
- **`main` must always be installable.** GitHub Pages builds from `main`, and that's what goes on the tablet.
- Use one **short-lived branch per change**, then a **PR**, then the owner **squash-merges** it and the branch is deleted. Only trivial fixes such as typos go straight to `main`.
- **Tag each installed version** (`v1`, `v2`, …) so it's clear what's on the tablet.
- Once there's code, a GitHub Action runs the unit tests on every PR. The tests come from the `Examples` tables in the feature files.
- Keep this file up to date in the same PR as the work it describes.
- **Test the logic, check the visuals by eye:** time maths and wording live in plain, unit-tested functions.
