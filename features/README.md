# Requirements (BDD)

Each `.feature` file describes one part of the Learning Clock in Gherkin.

| File | Covers |
|------|--------|
| `00-learning-clock.feature` | Overall goal, offline use, what's on the clock screen, portrait and landscape |
| `01-current-time.feature` | Getting the device's time and keeping it current |
| `02-analog-clock.feature` | Analog clock face and hands |
| `03-digital-clocks.feature` | 12-hour (AM/PM) and 24-hour digital clocks |
| `04-time-in-words.feature` | The written sentence, e.g. "It is 45 minutes past 9 in the morning." |
| `05-time-of-day-scene.feature` | Sunrise / day / sunset / night background |
| `06-read-aloud.feature` | Button that speaks the time; word-by-word highlight (low priority) |
| `07-preferences.feature` | **Future:** parent preferences for wording style, part-of-day and scene times, voice |
| `08-set-the-clock.feature` | Dragging the analog hands to set any time; AM/PM switch; every display follows; "back to now" button |
| `09-calendar.feature` | **Future:** calendar screen for days, weeks, months, years and seasons, using the same ideas as the clock |

Tags: `@future` means not in the first version. `@low-priority` means build it after everything else works.

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

## Decisions (answered by the owner)

1. **No second hand** on the analog clock.
2. **Always "minutes past".** The child hasn't learnt fractions yet, so the sentence never uses "quarter", "half" or "to". For example, 9:45 is "45 minutes past 9" and 11:45 is "45 minutes past 11 in the morning". A future preference can switch to the "quarter / half / past / to" style.
3. **The scene and the part-of-day words change at the same times**, so the picture and the sentence always agree. These times are the default. A future preference can change them, or set the scene separately.

   | Time | Words | Scene |
   |---|---|---|
   | 05:00–06:59 | in the morning | sunrise |
   | 07:00–11:59 | in the morning | day |
   | 12:00–16:59 | in the afternoon | day |
   | 17:00–19:59 | in the evening | sunset |
   | 20:00–04:59 | at night | night |

   Exactly 12:00 is "midday" and exactly 00:00 is "midnight".

4. **Each word lights up as it's spoken.** This is low priority.
5. **Portrait and landscape** are both supported. The layout rearranges when the tablet is turned.
6. **The analog clock is the largest display** in both portrait and landscape.
7. **Voice and wording preferences** come later (`07-preferences.feature`).
8. **The clock can be set by dragging the analog hands** (`08-set-the-clock.feature`). Both digital clocks, the words, the voice and the scene follow the set time. A button goes back to the real time.
9. **A set time is static.** It doesn't tick. Pressing "back to now" returns to the real time, which ticks again.
10. **Setting the time never speaks by itself.** The time is only read aloud when the read-aloud button is pressed.
11. **An AM/PM switch on the analog clock** swaps between morning and evening without moving the hands, so the hour hand doesn't have to be dragged round past the 12. Using it while showing the real time sets the clock by hand.

## Assumptions (change any of these if they're wrong)

1. **Scene times are fixed**, not real sunrise and sunset times, so the app never needs location access.
2. **No seconds are shown** on either digital clock.
3. **Words use digits** ("12 minutes past 9"), matching the example given. Speech says the numbers naturally.
4. **The spoken sentence is exactly the written sentence**, so one piece of logic drives both.
5. **Speech uses a voice built into the device**, so it works offline.
6. **Word highlighting is skipped** if the device's voice doesn't report when each word is spoken. Speech still works.
7. **Setting the clock** (`08-set-the-clock.feature`):
   - The hand closest to the finger is the one that moves.
   - The minute hand settles on a whole minute when it's let go.
   - Dragging the minute hand moves the hour hand along with it.
   - Dragging the hour hand changes the hour and leaves the minutes alone.
   - Each time a hand goes past the 12, the time moves between morning and evening (AM and PM). Going forward from 11:50 gives 12:10 PM, going backward from 00:05 gives 11:55 PM.
   - A set time is kept when the app goes into the background, but a fresh open always shows the real time.
   - The "back to now" button only appears when the clock has been set, and dragging the hands back to the real time doesn't count as going back to now.

## Future: calendar (`09-calendar.feature`)

Not part of the first version. It's written down now so the clock's logic can be built in a way that extends to dates.

### Decisions (answered by the owner)
1. **The default hemisphere is northern.** A parent can change it. In the northern hemisphere, winter is December to February, spring is March to May, summer is June to August and autumn is September to November. They're the other way round in the southern hemisphere.
2. **The date in numbers is dd/mm/yyyy**, for example 15/11/2026.
3. **The week starts on Monday.** Saturday and Sunday look different as the weekend.
4. **The year wheel puts each month at its clock number:** January at the 1, March at the 3, December at the 12 at the top. A pointer like a clock hand shows the current month, and each season has its own colour.
5. **Special days aren't planned yet.** Birthdays and holidays are a possible later addition (see "Possible later additions" below).

### Assumptions
1. **A separate calendar screen**, reached by a big button from the clock screen, so the clock screen stays uncluttered.
2. **The same ideas as the clock:** the date shown several ways at once (sentence, month page, week row, year wheel, numbers), a sentence that's also read aloud, a picture that changes, choosing your own date with a "back to today" button, and a chosen date that stays still.
3. **Wording:** "Today is Sunday, the 15th of November 2026." plus "Yesterday was Saturday. Tomorrow is Monday."
4. **Seasons go by whole months**, not by the exact solstice and equinox dates.
5. **The hemisphere is a preference** rather than detected, because the app never uses location.
6. **The clock and calendar share one date and time.** Dragging the clock past midnight changes the date. The AM/PM switch doesn't.

### Open questions
None at the moment.

## Possible later additions (not planned yet)
- Special days on the calendar, such as birthdays and holidays.

## Open questions

None at the moment.
