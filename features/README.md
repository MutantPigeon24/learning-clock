# Requirements (BDD)

Each `.feature` file describes one part of the Learning Clock in Gherkin.

| File | Covers |
|------|--------|
| `00-learning-clock.feature` | Overall goal, offline use, what's on the clock screen, the layout picked from the screen's shape (tablet, phone or desktop window) |
| `01-current-time.feature` | Getting the device's time and keeping it current |
| `02-analog-clock.feature` | Analog clock face and hands |
| `03-digital-clocks.feature` | 12-hour (AM/PM) and 24-hour digital clocks |
| `04-time-in-words.feature` | The written sentence, e.g. "It is 45 minutes past 9 in the morning." |
| `05-time-of-day-scene.feature` | Sunrise / day / sunset / night background |
| `06-read-aloud.feature` | Button that speaks the time; word-by-word highlight (low priority) |
| `07-preferences.feature` | Grown-up check (a times-table question) and settings: wording style, hour and minute helpers, talking speed, whether children can change the look, reset. **Future:** part-of-day and scene times, voice, hemisphere |
| `08-set-the-clock.feature` | Dragging the analog hands to set any time; AM/PM switch; every display follows; "back to now" button |
| `09-calendar.feature` | **Future:** calendar screen for days, weeks, months, years and seasons, using the same ideas as the clock |
| `10-looks.feature` | Six looks children can pick; each look's own world, its own version of each scene and its own way of changing between them |
| `11-hour-and-minute-colours.feature` | Hour colour and minute colour on the same parts of every display, the minutes ring, each look's own pair, pairs a child can pick, contrast, and the helpers switched off |

Tags: `@future` means not in the first version (on a whole feature, or on one `Rule:`). `@low-priority` means build it after everything else works.

## Platform

The app is an **installable offline web app (PWA)** for an **Android tablet running Chrome**. The same app also works on a phone and in a desktop browser window, because its layout comes from the screen's shape (`00-learning-clock.feature`):

- It's installed once from an HTTPS web address with Chrome's "Add to Home screen" or "Install app". After that it opens full screen from its own icon.
- A service worker stores every file on the tablet, so after the first visit it needs no internet.
- Everything it uses (fonts, images, sounds) ships with the app. Nothing comes from an outside server or CDN.
- Speech uses Android's own text-to-speech engine through the browser's Web Speech API. The English voice data must be downloaded on the tablet so speech works offline.
- It needs HTTPS hosting for the first install and for updates. Opening the HTML file directly on the tablet won't work offline.

### Hosting and installing

The repo stays **private** during development. To install or update the app:

1. Make the repo public and turn on GitHub Pages (Settings → Pages → Deploy from a branch → `main`, `/ (root)`). Wait for the Pages build to finish.
2. On the tablet, open the Pages address in Chrome and choose "Install app". Open the app once so it stores its files.
   - **For an update:** open the installed app once while online, so it downloads the new version in the background. Then close it fully (swipe it away in Recents) and open it again. The new version only takes over when the app starts fresh, not when it comes back from the background, so nothing changes while a child is using it.
3. Make the repo private again. This takes the Pages site offline.

So that this works:

- The app must keep working when its address returns "page not found". See the "web address is taken down" rule in `00-learning-clock.feature`.
- The app asks Chrome for persistent storage, so the tablet doesn't clear its files to free up space.
- If Chrome's data for the app is ever cleared, or the app is uninstalled, it can't be reinstalled until the repo is made public again.
- Every update means repeating steps 1–3.
- An empty `.nojekyll` file in the repo root stops GitHub Pages running Jekyll, so files are published exactly as they are.

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
7. **Voice and wording preferences** come later (`07-preferences.feature`). *Updated by decision 23: the wording style and talking speed are now first-version settings.*
8. **The clock can be set by dragging the analog hands** (`08-set-the-clock.feature`). Both digital clocks, the words, the voice and the scene follow the set time. A button goes back to the real time.
9. **A set time is static.** It doesn't tick. Pressing "back to now" returns to the real time, which ticks again.
10. **Setting the time never speaks by itself.** The time is only read aloud when the read-aloud button is pressed.
11. **An AM/PM switch on the analog clock** swaps between morning and evening without moving the hands, so the hour hand doesn't have to be dragged round past the 12. Using it while showing the real time sets the clock by hand.
12. **Each hand has a round grip near its tip** so a child can see the hands can be moved. The grip is the hand's colour, and the hour grip is bigger (`08-set-the-clock.feature`).
13. **No button for a feature that isn't built yet.** The calendar button stays hidden until the calendar exists, but each layout keeps room for it (`00-learning-clock.feature`).
14. **A button can show only its picture** when the picture alone makes its meaning clear. Otherwise it gets a short word too. Every button has a full label for screen readers (`00-learning-clock.feature`).
15. **The 12-hour clock shows only the AM or PM that applies, as plain text** ("9:45 PM"). The AM and PM chips are gone because they looked like buttons but did nothing. AM and PM side by side only appear on the AM/PM switch, which works (`03-digital-clocks.feature`).
16. **The time picks the scene, the look paints it.** Each look has its own world and its own sunrise, day, sunset and night, and changes between them in its own way (lights coming on one by one, balloons landing, lava glowing). The scenes still change at the same times in every look, so the picture always agrees with the words (`10-looks.feature`, `05-time-of-day-scene.feature`).
17. **One "Now" sign shows the real time.** It has a green dot and is not a button. When the clock is set by hand, the same sign turns into the "back to now" button in the same place, with a turn-back arrow and an outline (`08-set-the-clock.feature`).
18. **The Storybook tags stay tilted.** The slight tilt is fine for reading.
19. **Any screen.** Tablet and phone in both orientations, plus a desktop window. The layout is picked from width ÷ height: wide (1.2 or more), tall (0.85 or less) or in between. Nothing scrolls (`00-learning-clock.feature`).
20. **Hours and minutes linked by colour everywhere.** The hour colour is on the short hand, the 1–12 numbers, the hour digits and the hour in the sentence. The minute colour is on the long hand, a 0–55 minutes ring, the minute digits and "N minutes" in the sentence. Each look has its own pair. A child can pick another pair (red/blue, orange/purple, pink/teal, purple/orange) in the look picker. Every pair is at least 4.5 : 1 on the face, the cards and the ring. Colour is never the only clue: the hour hand is short and thick, the minute hand long and thin (`11-hour-and-minute-colours.feature`).
21. **The helpers can be switched off.** The grown-up setting "Hour and minute helpers" (on by default) removes the minutes ring and the colours once the child can read minutes. The hands and numbers take the clock's ink, and the digits and words are plain text (`11-hour-and-minute-colours.feature`).
22. **The grown-up check is one times-table question** from the 6 to 9 tables ("What is 7 × 8?") on a big number pad. There's a new question each time, and a wrong answer just clears it (`07-preferences.feature`).
23. **The settings are in the first version**: how the time is said, hour and minute helpers, talking speed, whether children can change the look, and reset. Part-of-day times, the voice and the hemisphere come later (`07-preferences.feature`).
24. **"Reset to defaults" leaves the child's look and colour pair alone**, because they're the child's own choice. It only resets the grown-up settings (`07-preferences.feature`).
25. **In the "quarter, half, past and to" wording, "quarter" and "half" take the minute colour**, and the hour after "to" takes the hour colour (`07-preferences.feature`).
26. **Concept 1, Clock Hub, is the one to build** (chosen on 15 Nov 2026). The analog clock sits beside the cards (wide), above them (tall), or beside a strip of the two digital clocks and the words (in between), with the buttons in one row.
27. **The hands can be moved with a keyboard.** Each hand is a slider: arrows move 1 minute or 1 hour, page up and page down move the minute hand 5 minutes (`08-set-the-clock.feature`).
28. **"Reset to defaults" has an Undo** until the settings close (`07-preferences.feature`).

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
8. **Hour and minute colours** (`11-hour-and-minute-colours.feature`):
   - The colon, AM or PM and the other words of the sentence stay in the look's ink.
   - Looks with dark cards (Space) use lighter versions of the hour and minute colours on the cards. The clock face is always light, so the hands and numbers use the ordinary ones.
   - With the helpers off, the look picker shows no colour pairs. The child's picked pair is kept and comes back when the helpers are switched on again.
9. **Grown-up check and settings** (`07-preferences.feature`):
   - The 6 to 9 tables are both numbers, so every answer has two digits (36 to 81) and the check answers as soon as two digits are typed.
   - "A new question each time" means a different answer from last time, so an answer seen over a grown-up's shoulder doesn't work twice.
   - The default talking speed is "Slower" (0.8 × normal), matching "a little slower than normal speech" in `06-read-aloud.feature`.
   - Settings that can't be read from the tablet take their defaults.
   - The hemisphere setting only appears once the calendar is built, like every other feature that isn't built yet.
10. **A short side under 480 pixels is a small screen** (like a phone), with smaller type and buttons that never go below the minimum sizes.

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
