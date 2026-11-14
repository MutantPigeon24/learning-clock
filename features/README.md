# Requirements (BDD)

Each `.feature` file describes one part of the Learning Clock in Gherkin.

| File | Covers |
|------|--------|
| `00-learning-clock.feature` | Overall goal, offline use, what's on the clock screen |
| `01-current-time.feature` | Getting the device's time and keeping it current |
| `02-analog-clock.feature` | Analog clock face and hands |
| `03-digital-clocks.feature` | 12-hour (AM/PM) and 24-hour digital clocks |
| `04-time-in-words.feature` | The written sentence, e.g. "It is 12 minutes past 9 in the morning." |
| `05-time-of-day-scene.feature` | Sunrise / day / sunset / night background |
| `06-read-aloud.feature` | Button that speaks the time |

## Platform

The app is an **installable offline web app (PWA)** for an **Android tablet running Chrome**:

- It's installed once from an HTTPS web address with Chrome's "Add to Home screen" or "Install app". After that it opens full screen from its own icon.
- A service worker stores every file on the tablet, so after the first visit it needs no internet.
- Everything it uses (fonts, images, sounds) ships with the app. Nothing comes from an outside server or CDN.
- Speech uses Android's own text-to-speech engine through the browser's Web Speech API. The English voice data must be downloaded on the tablet so speech works offline.
- It needs HTTPS hosting for the first install and for updates. Opening the HTML file directly on the tablet won't work offline.

### Hosting and installing

The repo stays **private** during development. To install or update the app:

1. Make the repo public and turn on GitHub Pages.
2. On the tablet, open the Pages address in Chrome and choose "Install app". Open the app once so it stores its files.
3. Make the repo private again. This takes the Pages site offline.

So that this works:

- The app must keep working when its address returns "page not found". See the "web address is taken down" rule in `00-learning-clock.feature`.
- The app asks Chrome for persistent storage, so the tablet doesn't clear its files to free up space.
- If Chrome's data for the app is ever cleared, or the app is uninstalled, it can't be reinstalled until the repo is made public again.
- Every update means repeating steps 1–3.

## Assumptions (change any of these if they're wrong)

1. **Wording follows the "past / to" convention.** Minutes 1–30 are "past" the hour and 31–59 are "to" the next hour, with "quarter past", "half past" and "quarter to".
2. **Parts of the day:** morning 05:00–11:59, afternoon 12:00–16:59, evening 17:00–20:59, night 21:00–04:59. Exactly 12:00 is "midday" and exactly 00:00 is "midnight".
3. **Scene times are fixed** (sunrise 05:00, day 07:00, sunset 18:00, night 20:00), not real sunrise and sunset times, so the app never needs location access.
4. **No seconds are shown** on either digital clock, and the analog clock has no second hand.
5. **Words use digits** ("12 minutes past 9"), matching the example given. Speech says the numbers naturally.
6. **The spoken sentence is exactly the written sentence**, so one piece of logic drives both.
7. **Speech uses a voice built into the device**, so it works offline.

## Open questions

- Should the analog clock have a second hand? It makes the clock feel alive, but it can distract.
- Should the scene and the "part of day" words share the same boundaries? At the moment 18:00 is "evening" in words while the scene changes to sunset.
- Should the app highlight each word as it's spoken? It helps with reading, but it's harder to build and depends on the device's voice. Treat it as a nice-to-have.
- How should the screen be laid out on the tablet: portrait, landscape or both? With four displays plus a button, the analog clock should probably be the largest.
