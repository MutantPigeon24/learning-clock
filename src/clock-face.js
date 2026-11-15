// The analog clock's drawing (02-analog-clock.feature, 08-set-the-clock.feature,
// 11-hour-and-minute-colours.feature), as in the Clock Hub design
// (design/concepts-generator/parts.mjs, clock()).
//
// The SVG is 240 units square. The face has radius 96 at the centre (120, 120),
// with the 0–55 minutes ring round it. With the helpers off the ring is hidden
// and the face grows by 1.2 to fill the space.

export const VIEWBOX = 240;
const C = VIEWBOX / 2;
const FACE_RADIUS = 96;
const RIM_WIDTH = 8;
const HELPERS_OFF_SCALE = 1.2;

/** The face's radius as a share of half the SVG's width. */
export function faceShare(helpers) {
  return (FACE_RADIUS * (helpers ? 1 : HELPERS_OFF_SCALE)) / C;
}

/**
 * A pointer position as a point on the face, relative to its centre, in units
 * of the face's radius, with y pointing down. This is what nearestHand and
 * pointerAngle in set-clock.js expect. rect is the SVG's bounding box.
 */
export function facePoint(clientX, clientY, rect, helpers) {
  const unit = (rect.width / 2) * faceShare(helpers);
  return {
    x: (clientX - (rect.left + rect.width / 2)) / unit,
    y: (clientY - (rect.top + rect.height / 2)) / unit,
  };
}

/** Font size (SVG units) for the ring numbers, so they are never under 16 px on screen. */
export function ringFontSize(clockPx) {
  return Math.max(13, Math.ceil((16 * VIEWBOX * 10) / clockPx) / 10);
}

const round1 = (n) => Math.round(n * 10) / 10;
const around = (index, count, radius) => {
  const a = (index * (360 / count) * Math.PI) / 180;
  return [round1(C + radius * Math.sin(a)), round1(C - radius * Math.cos(a))];
};

function ticks() {
  let out = '';
  for (let i = 0; i < 60; i += 1) {
    const bold = i % 5 === 0;
    out += `<line x1="${C}" y1="${C - FACE_RADIUS + 4}" x2="${C}" y2="${C - FACE_RADIUS + (bold ? 15 : 9)}" stroke-width="${bold ? 3.4 : 1.5}" transform="rotate(${i * 6} ${C} ${C})"/>`;
  }
  return out;
}

function numbers(count, radius, label) {
  let out = '';
  for (let k = 0; k < 12; k += 1) {
    const [x, y] = around(k, count, radius);
    out += `<text x="${x}" y="${y}">${label(k)}</text>`;
  }
  return out;
}

// A focus ring round a grip: dark inside, yellow outside, like the buttons'.
const focusRing = (cy, r) => `<g class="focus-ring"><circle cx="${C}" cy="${cy}" r="${r + 4}" stroke="#0B1035" stroke-width="3"/><circle cx="${C}" cy="${cy}" r="${r + 8}" stroke="#FFD43B" stroke-width="4.5"/></g>`;

// A hand: a white edge, the coloured hand, and a round grip near its tip.
function hand(name, { back, tip, width, grip, gripAt, gripEdge, dot }) {
  return `<g class="hand" data-hand="${name}" role="slider" tabindex="0" aria-label="${name === 'hour' ? 'Hour hand' : 'Minute hand'}" aria-valuemin="${name === 'hour' ? 1 : 0}" aria-valuemax="${name === 'hour' ? 12 : 59}">
<g data-part="${name}-turn">
<line x1="${C}" y1="${C + back}" x2="${C}" y2="${C - tip}" stroke="#FFFFFF" stroke-width="${width + 4}" stroke-linecap="round"/>
<line data-part="${name}-colour" x1="${C}" y1="${C + back}" x2="${C}" y2="${C - tip}" stroke-width="${width}" stroke-linecap="round"/>
<circle data-part="${name}-grip" cx="${C}" cy="${C - gripAt}" r="${grip}" stroke="#FFFFFF" stroke-width="${gripEdge}"/>
<circle cx="${C}" cy="${C - gripAt}" r="${dot}" fill="#FFFFFF" opacity=".85"/>
${focusRing(C - gripAt, grip)}
</g></g>`;
}

/**
 * The clock's SVG markup. Colours, the hands' angles, the ring and the labels
 * are filled in by app.js, through the data-part elements.
 */
export function clockFaceMarkup() {
  return `<svg class="clock-face" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" role="group">
<g data-part="ring" aria-hidden="true">
<circle cx="${C}" cy="${C}" r="117" class="ring-band"/>
<g data-part="ring-numbers" class="ring-numbers">${numbers(12, FACE_RADIUS + 13, (k) => k * 5)}</g>
</g>
<g data-part="face">
<circle cx="${C}" cy="${C + 4}" r="${FACE_RADIUS}" fill="rgba(0,0,0,.18)"/>
<circle cx="${C}" cy="${C}" r="${FACE_RADIUS - RIM_WIDTH / 2}" stroke-width="${RIM_WIDTH}" class="face-disc"/>
<g class="ticks" stroke-linecap="round" aria-hidden="true">${ticks()}</g>
<g data-part="hour-numbers" class="hour-numbers" aria-hidden="true">${numbers(12, FACE_RADIUS - 31, (k) => k || 12)}</g>
${hand('hour', { back: 10, tip: 50, width: 11, grip: 10, gripAt: 44, gripEdge: 3, dot: 3.2 })}
${hand('minute', { back: 14, tip: 80, width: 6.5, grip: 7, gripAt: 82, gripEdge: 2.5, dot: 2.2 })}
<circle data-part="centre" cx="${C}" cy="${C}" r="8"/><circle cx="${C}" cy="${C}" r="3" fill="#FFFFFF"/>
</g>
</svg>`;
}

/** The face group's transform: none with the ring, grown to fill the space without it. */
export function faceTransform(helpers) {
  return helpers ? '' : `translate(${C} ${C}) scale(${HELPERS_OFF_SCALE}) translate(${-C} ${-C})`;
}
