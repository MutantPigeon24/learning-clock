// Which layout the clock screen uses (00-learning-clock.feature). The layout
// comes from the shape of the screen or window, not from the kind of device,
// so a phone, a tablet and a desktop window all work the same way.

/** Width ÷ height at or above this is wide: the clock beside everything else. */
export const WIDE_FROM = 1.2;
/** Width ÷ height at or below this is tall: the clock on top, the rest below. */
export const TALL_UP_TO = 0.85;
/** A short side under this many CSS pixels is a small screen, like a phone. */
export const SMALL_BELOW = 480;

/**
 * { shape: "wide" | "tall" | "in between", small: true | false }
 * "in between" puts the clock beside a strip of two rows.
 * small screens use smaller type and buttons, never below the minimum sizes.
 */
export function layoutFor(width, height) {
  const ratio = width / height;
  const shape = ratio >= WIDE_FROM ? 'wide' : ratio <= TALL_UP_TO ? 'tall' : 'in between';
  return { shape, small: Math.min(width, height) < SMALL_BELOW };
}
