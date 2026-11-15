import fs from 'node:fs';
import path from 'node:path';
import { CONCEPTS, conceptFile, ART_W, ART_H } from './concepts.mjs';

const OUT = process.env.OUT;
const MAIN_H = 3700;

const JOURNEYS = [
  ['Now', 'Read the time', 'Child opens the app', ['Tap the Learning Clock icon.', 'The clock screen opens full screen at the real time.', 'Analog clock, 12-hour, 24-hour, words and scene all show the same minute.', 'Each new minute everything changes together. Coming back from the background jumps straight to now.'], 'Real time · sunrise, day, sunset, night · midday and midnight'],
  ['Now', 'Hear the time', 'Child taps the speaker', ['Tap the big speaker button.', 'The sentence on screen is spoken a little slower than normal.', 'The button shows it is speaking. Tap again to start again from the beginning.', 'No voice on the tablet: the speaker is greyed out and everything else works.'], 'Ready · speaking · no voice · later: each word lights up'],
  ['Now', 'Set my own time', 'Child drags a hand', ['Touch the clock face. The hand nearest the finger is picked up.', 'Drag it round. Every display and the scene follow minute by minute.', 'Going past the 12 moves between AM and PM.', 'Let go: the minute hand settles on a whole minute and the Now sign turns into Back to now. A touch that moves nothing leaves the Now sign. Nothing is spoken by itself.'], 'Dragging · set by hand · past midnight'],
  ['Now', 'Swap AM and PM', 'Child taps the switch', ['Tap the AM/PM switch next to the clock.', 'The hands stay still and the time jumps 12 hours.', 'Words, 12-hour label, 24-hour clock and scene change, e.g. 9:45 day to 21:45 night.', 'If it was showing the real time, the Now sign turns into Back to now.'], 'AM · PM · midday and midnight swaps'],
  ['Now', 'Back to now', 'Child goes back to the real time', ['While the clock shows the real time, one sign says Now next to a green dot. It is not a button.', 'Set the time by hand and the same sign turns into a big Back to now button in the same place: a turn-back arrow round a clock and an outline, so it works without reading and nothing else moves.', 'Tap it: every display jumps to the real time and starts ticking again.', 'The button turns back into the Now sign. Dragging back to the real time still counts as set by hand.'], 'Now sign (live) · Back to now button (set)'],
  ['Now', 'Turn the tablet', 'Any screen, any way round', ['The child turns the tablet, or the app opens on a phone, or in a desktop window that can be resized.', 'The layout picks itself from the shape: wide, tall, very wide or very tall.', 'Nothing restarts: a set time, the look and an open panel all stay.', 'The analog clock is always the biggest thing, and nothing scrolls.'], 'Wide · tall · very wide · very tall'],
  ['New', 'Change the look', 'Child picks a theme', ['Tap the palette button.', 'Big picture tiles: Sky, Blossom, Unicorn, Hero, Dino, Space.', 'Tap one: the whole world changes at once: landscape, sky colours, clock ring, cards, buttons and corner pictures. The time still decides sunrise, day, sunset or night.', 'Below the looks: hour and minute colours. Keep the look’s own pair or pick one; hands, numbers, digital times and words all change together.', 'The choice is saved on the tablet. A grown-up can switch the palette button off.'], 'Picker open · each theme × each scene × each colour pair'],
  ['Future', 'Grown-up settings', 'Parent behind a check', ['Tap the small lock in the corner.', 'A grown-up check: a times-table question from the 6 to 9 tables, e.g. “What is 7 × 8?”, answered on a big number pad.', 'Settings: how the time is said, hour and minute helpers on or off, talking speed, whether children can change the look, and reset (with Undo until the panel closes; the child’s look and colours stay). Later: part-of-day times, the voice and the hemisphere.', 'Done returns to the clock exactly as it was.'], 'Question · wrong answer, new try · settings · reset and undo'],
  ['Future', 'Calendar', 'Child opens the calendar', ['Once it is built, a calendar button appears on the clock screen. Until then there is no button, but every layout keeps room for it.', 'Date in words, month page, week row, year wheel, dd/mm/yyyy, season picture, read aloud.', 'Tap another day to choose it. Back to today returns.', 'A clock button goes back.'], 'Today · chosen day · each season · north and south'],
  ['Parent', 'Install and update', 'Done once by a grown-up', ['Install from the web address in Chrome.', 'Every file is saved, so it works with no internet, even after the address is gone.', 'Updates download quietly when online and are used next time.', 'No error screens, links, ads or sign-in. Only the icon and a splash in the theme colours.'], 'Splash · offline · quiet update'],
];

const SCREENS = [
  ['Clock screen', 'Child', 'App icon', 'Analog clock with AM/PM switch, 12-hour (with AM or PM written after it), 24-hour, words, scene, speaker, Now sign (becomes Back to now when set), look, lock. A calendar button joins them once the calendar is built.'],
  ['Look picker', 'Child', 'Palette button', 'Six big picture tiles (balloon, blossom, unicorn, hero shield, dino, rocket), then the hour-and-minute colour choices that suit that look. Picks apply at once. A clear close button.'],
  ['Grown-up check', 'Grown-up', 'Lock button', 'A times-table question (6 to 9 tables) on a number pad. Getting it wrong just clears it.'],
  ['Grown-up settings', 'Grown-up', 'After the check', 'Wording, hour and minute helpers, talking speed, look lock, reset with undo, Done. Later: part-of-day times, voice, hemisphere'],
  ['Calendar (future)', 'Child', 'Calendar button (once built)', 'The clock’s pattern for dates, with a clock button back'],
  ['Short messages', 'Everyone', 'e.g. “coming later”', 'One line at the bottom, gone after about 2 seconds'],
  ['Later ideas', 'Child', 'One spare toolbar slot', 'Quizzes, rewards, special days: same panel pattern as the look picker'],
];

const RULES = [
  ['Hours and minutes always linked', 'One hour colour and one minute colour run through everything: the short hand, the 1 to 12 numbers, the hour digits and the hour in the words; the long hand, the 0 to 55 minutes ring, the minute digits and the minutes in the words. Each theme brings its own pair and a child can pick another, but within a screen they never swap. Colour is never the only clue: the hour hand stays short and thick, the minute hand long and thin, and the words say “minutes”. Every pair is checked at 4.5 : 1 or better on cards, face and ring. Once a child reads minutes, a grown-up can turn the helpers off: the ring goes, the face grows to fill the space, both hands and all numbers take the theme’s own ink, and digits and words go back to plain text.'],
  ['Shape, not device', 'Phones, tablets and desktop windows all run the same app. Pick the layout from width ÷ height. Wide (1.2 or more): clock on one side, the rest beside it. Tall (0.85 or less): clock on top, the rest stacked. In between: clock beside a two-row strip. Short side under 480 px (phones): smaller type and buttons, never below the minimums. Size everything from the short side so nothing ever scrolls. On a desktop the mouse drags the hands and the keyboard works everywhere.'],
  ['Big, forgiving targets', 'Children’s buttons are 64 px or more on tablets and never under 48 px, with 12 px or more between them. The whole clock face is the drag area. No double-taps or long presses for children. Keep buttons 24 px in from the edges so Android’s back gesture doesn’t fire.'],
  ['Readable in every scene', 'Text sits on solid cards, never straight on the sky, at 4.5 : 1 or better in every theme and scene. Pictures stay behind the cards and never inside the clock face. Button colours never look like the hour or minute colour; the picker hides a colour pair that would clash with the look. Hands differ in length, thickness, colour and lightness. AM and PM use fill and weight, not colour alone. The sentence is 28 px or more. A font with a child-style a and g (Andika) helps early readers.'],
  ['Works without reading', 'Every button has a picture that says what it does on its own, plus a short word where there is room. A picture-only button is fine when the picture alone is clear (speaker, clock with a back arrow, palette, lock). Every button has a full label for screen readers. Each hand has a round grip near its tip, so a child can see it can be moved. The clock acts as two sliders (hours and minutes) for keyboard and switch users. AM/PM is a real switch. Focus rings are thick, dark inside and yellow outside.'],
  ['Time picks the scene, the look paints it', 'The time decides which scene shows: sunrise, day, sunset or night, so the picture always agrees with the words. The look decides how that scene is painted and what lives in it: a sea of clouds and balloons, a blossom meadow, a rainbow and castle, a comic city, a volcano valley, a moon base. Every look keeps the same reading: light sky and a high sun is day, dark sky and a moon is night. Each look also changes in its own way: windows, fireflies and stars come on one by one, balloons drift down to land, lava starts to glow. Each look is a kit with the same parts: sky paint, landscape, corner pictures, clock ring, picker badge, card and button style, label font and tokens. A new look is one kit; a new screen reuses the kit.'],
  ['Grown-up things behind a check', 'Settings, the look lock and reset sit behind a check a 7-year-old won’t pass by chance. Children can still pick a look, hear the time, set it and go back to now. The check is one times-table question from the 6 to 9 tables, on a big number pad, with a clear close button. A new question comes each time.'],
  ['Calm motion', 'Scenes fade over about 2 seconds, and faster while dragging, so they keep up. Nothing flashes or bounces. If the tablet asks for less motion, changes are instant. The only sound is speech, and only when asked for.'],
  ['Offline and private', 'Fonts, pictures and voices are stored on the tablet. No links, ads, accounts or tracking. The chosen look and settings are saved on the tablet. A set time is kept in the background but a fresh open shows the real time.'],
];

const tagColor = { Now: ['#DCEBFF', '#0B2545'], New: ['#FFE1EE', '#4A0D2E'], Future: ['#EFE5FF', '#35155D'], Parent: ['#E2F3D5', '#173A1E'] };

function mainFile() {
  const jcards = JOURNEYS.map(([tag, title, who, steps, states], i) => `<div style="background:#FFFFFF;border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:16px;box-shadow:0 2px 0 rgba(0,0,0,.06)">
<div style="display:flex;align-items:center;gap:12px"><span style="font-size:20px;font-weight:800;color:#5B6070">J${i + 1}</span><span style="padding:4px 14px;border-radius:999px;font-size:17px;font-weight:700;background:${tagColor[tag][0]};color:${tagColor[tag][1]}">${tag}</span></div>
<h3 style="margin:0;font-family:'Baloo 2', sans-serif;font-size:36px;line-height:1.05;font-weight:800;color:#141826">${title}</h3>
<p style="margin:0;font-size:19px;font-weight:600;color:#4A5063">${who}</p>
<ol style="margin:0;padding-left:26px;display:flex;flex-direction:column;gap:8px;font-size:19px;line-height:1.4;color:#222736">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
<p style="margin:auto 0 0;padding-top:14px;border-top:2px solid #ECEEF2;font-size:17px;line-height:1.4;color:#4A5063"><b style="color:#222736">States to design:</b> ${states}</p></div>`).join('');
  const srows = SCREENS.map(([n, who, from, shows]) => `<div style="display:grid;grid-template-columns:320px 160px 300px minmax(0, 1fr);gap:24px;padding:16px 0;border-top:2px solid #ECEEF2;font-size:20px;line-height:1.4;color:#222736"><b>${n}</b><span>${who}</span><span style="color:#4A5063">${from}</span><span>${shows}</span></div>`).join('');
  const rcards = RULES.map(([t, b], i) => `<div style="background:#FFFFFF;border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:12px"><span style="font-size:20px;font-weight:800;color:#5B6070">${i + 1}</span><h3 style="margin:0;font-family:'Baloo 2', sans-serif;font-size:32px;line-height:1.1;font-weight:800;color:#141826">${t}</h3><p style="margin:0;font-size:19px;line-height:1.5;color:#222736">${b}</p></div>`).join('');
  const props = { $preview: { width: 2812, height: MAIN_H } };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Learning Clock journeys and UX rules</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&amp;family=Inter:wght@400;600;700;800&amp;display=swap">
<style>
body{margin:0}
a{color:#1A64C8}a:hover{color:#0F4A99}
</style>
</helmet>
<div style="width:2812px;height:${MAIN_H}px;box-sizing:border-box;padding:80px;display:flex;flex-direction:column;gap:56px;background:#F4F5F8;font-family:Inter, system-ui, sans-serif;color:#141826">
<div style="display:flex;flex-direction:column;gap:16px;max-width:1800px">
<h1 style="margin:0;font-family:'Baloo 2', sans-serif;font-size:88px;line-height:1;font-weight:800">Learning Clock · journeys, screens and UX rules</h1>
<p style="margin:0;font-size:28px;line-height:1.45;color:#3A3F4B">Everything the app does now, plus what is planned (grown-up settings, calendar) and what was asked for here (themes children can pick). Every concept below follows these rules and works the same way: it only looks and arranges things differently.</p>
</div>
<div style="display:flex;flex-direction:column;gap:24px">
<h2 style="margin:0;font-size:40px;font-weight:800">1 · Journeys</h2>
<div style="display:grid;grid-template-columns:repeat(5, minmax(0, 1fr));gap:24px">${jcards}</div>
</div>
<div style="display:flex;flex-direction:column;gap:8px;background:#FFFFFF;border-radius:28px;padding:40px">
<h2 style="margin:0 0 12px;font-size:40px;font-weight:800">2 · Screens and how you get to them</h2>
<div style="display:grid;grid-template-columns:320px 160px 300px minmax(0, 1fr);gap:24px;padding-bottom:8px;font-size:17px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#4A5063"><span>Screen</span><span>For</span><span>Opened from</span><span>Shows</span></div>${srows}
</div>
<div style="display:flex;flex-direction:column;gap:24px">
<h2 style="margin:0;font-size:40px;font-weight:800">3 · Rules every concept follows</h2>
<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:24px">${rcards}</div>
</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='${JSON.stringify(props)}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
`;
}

function indexFile() {
  const boards = { 'Main.dc.html': { x: 0, y: 0, w: 2812, h: MAIN_H, title: 'Journeys, screens and UX rules' } };
  const order = ['Main.dc.html'];
  const notes = {
    howto: { x: -700, y: 0, w: 600, fill: 'gray', size: 'l', text: 'How to review\n\nStart here, then scroll down to the six concepts. Each concept shows the same live app in a desktop window, on a tablet (landscape and portrait) and on a phone (landscape and portrait).\n\nPress Play on a concept to try it: drag the hands, tap AM/PM, Hear it, Now, the palette (pick a look) and the lock (times-table question, then settings).\n\nTweaks on each concept: theme (Sky, Blossom, Unicorn, Hero, Dino, Space), hour and minute colours, helpers on or off, and a start time for each scene.' },
    concepts: { x: 0, y: MAIN_H + 260, text: 'Six concepts · same app, different shape and feel', kind: 'title1', maxW: 2812 },
  };
  const why = {
    1: 'Clock Hub\n\nThe safe, balanced one. Big clock, everything else in tidy cards beside or below it. One long toolbar: Hear it, Now, look.\n\nGood for: the clearest first version.\nTrade-off: the plainest.\nGrown-up check: a times-table question.',
    2: 'Storybook\n\nThe scene is the star. The digital clocks hang like tags and the sentence sits on a ribbon with the speaker at its end, so "the words" and "hearing them" are one thing.\n\nGood for: warmth and story.\nTrade-off: the clock is smaller on phones.\nGrown-up check: a times-table question.',
    3: 'Toy Blocks\n\nChunky blocks with thick bottom edges that feel pressable. Buttons live in their own rail at the edge, away from the clock, so drags and taps don’t clash.\n\nGood for: small hands and lots of tapping.\nTrade-off: busier.\nGrown-up check: a times-table question.',
    4: 'Colour Links\n\nThe teaching one, and where the hour and minute colours now used by every concept came from. Adds a key at the top (short hand: hours, long hand: minutes) and puts the coloured words at the bottom, full width.\n\nGood for: learning, not just showing.\nTrade-off: the busiest top bar.\nGrown-up check: a times-table question.',
    5: 'Full Face\n\nThe clock takes the whole height. Digital clocks become small pills and the buttons float in a dock. Calmest, and best on small screens and at night.\n\nGood for: phones and focus.\nTrade-off: the digital clocks are less prominent.\nGrown-up check: a times-table question.',
    6: 'Clock Buddy\n\nA character that changes with the theme (unicorn, hero, dino, astronaut…) says the time in a speech bubble. Tap the buddy to hear it. Picking a look means picking a friend.\n\nGood for: motivation, and future quizzes and rewards.\nTrade-off: the most to draw and animate.\nGrown-up check: a times-table question.',
  };
  const fills = { 1: 'blue', 2: 'pink', 3: 'orange', 4: 'green', 5: 'purple', 6: 'teal' };
  let y = MAIN_H + 560;
  for (const c of CONCEPTS) {
    boards[c.file] = { x: 0, y, w: ART_W, h: ART_H, title: c.title, is_interactive: true };
    order.push(c.file);
    notes['why' + c.n] = { x: -700, y, w: 600, fill: fills[c.n], size: 'l', text: why[c.n] };
    y += ART_H + 240;
  }
  return JSON.stringify({ v: 3, createdOnFiles: { v: 1, at: new Date().toISOString().replace(/\.\d+Z$/, 'Z') }, title: 'Learning Clock — 6 Design Concepts', launch: { view: 'canvas' }, pages: [], boards, order, notes, designSystems: [] }, null, 1);
}

const what = process.argv[2];
const P = (f) => path.join(OUT, f);
if (what === 'index') fs.writeFileSync(P('canvas.json'), indexFile());
else if (what === 'main') fs.writeFileSync(P('Main.dc.html'), mainFile());
else {
  const c = CONCEPTS.find((x) => String(x.n) === what);
  fs.writeFileSync(P(c.file), conceptFile(c));
}
console.log('wrote', what);
