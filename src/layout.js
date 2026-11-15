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

// --- Sizes for the Clock Hub screen -----------------------------------------
// The design canvas generator (design/concepts-generator) imports these too,
// so the app and the canvas are laid out by the same numbers.

/**
 * Every size on the screen, in CSS pixels, scaled from an 800 px short side
 * and never below the minimums for small fingers and young readers.
 * pad/px: space at the top and bottom / sides (24 px or more at the sides,
 * clear of Android's back gesture). gap: between cards. bg: between buttons.
 * btn: child buttons. small: grown-up buttons. kid: the header row.
 * fs: the sentence. fd: the digits (largest). fl: card labels. r: card corners.
 * ampH: the AM/PM switch's height. cp: card padding. chip: AM or PM text.
 */
export function screenSizes(W, H) {
  const S = Math.min(W, H) / 800;
  const r = (v) => Math.round(v);
  const lay = layoutFor(W, H);
  return {
    W, H, S, wide: lay.shape === 'wide', mid: lay.shape === 'in between', phone: lay.small,
    pad: r(Math.max(14, 32 * S)), px: r(Math.max(24, 32 * S)), gap: r(Math.max(12, 22 * S)), bg: r(Math.max(12, 13 * S)), btn: r(Math.max(52, 84 * S)),
    small: r(Math.max(48, 60 * S)), kid: r(Math.max(Math.min(W, H) < SMALL_BELOW ? 52 : 64, 60 * S)), fs: r(Math.max(18, 36 * S)), fd: r(Math.max(30, 72 * S)),
    fl: r(Math.max(14, 20 * S)), r: r(Math.max(16, 28 * S)), ampH: r(Math.max(48, 64 * S)),
    cp: r(Math.max(12, 24 * S)), chip: r(Math.max(14, 18 * S)),
  };
}

/** Height of the sentence card at a given width, allowing generously for wrapping. */
export function wordsCardHeight(z, width, fs = z.fs, cp = z.cp) {
  const lines = Math.max(1, Math.ceil((fs * 0.53 * 42) / Math.max(60, width - 2 * cp)));
  return Math.round(lines * fs * 1.3 + 2 * cp);
}

// Room for the AM or PM text after the 12-hour digits.
const periodWidth = (z) => z.chip * 2.2 + 12;

/** The digit size that fits "12:45 PM" in a card of this width. */
export function digitSize(z, cardW, cp = z.cp, max = z.fd) {
  return Math.floor(Math.min(max, (cardW - 2 * cp - periodWidth(z) - 10) / 2.75));
}

/** The card width that fits "12:45 PM" at this digit size (the reverse of digitSize). */
export function digitCardWidth(z, fd) {
  return Math.ceil(2.75 * fd + 2 * z.cp + periodWidth(z) + 10);
}

/** Height of a digital clock card: its label, the digits and padding. */
export function digitCardHeight(z, fd) {
  return z.fl * 1.3 + fd + 2 * z.cp + 8;
}

/**
 * The Clock Hub layout for a screen: every size from screenSizes, plus
 * shape ("wide", "tall" or "in between"), clock (the analog clock's side),
 * digits (the digit size) and side (the width beside the clock, or the
 * full inner width when the clock is on top).
 *   wide: the clock (with AM/PM under it) beside a column of the header,
 *         the sentence, the two digital clocks and the buttons.
 *   in between: the clock beside a strip of the two digital clocks and the
 *         sentence, with the buttons along the bottom.
 *   tall: the header, the clock, the sentence, the two digital clocks and
 *         the buttons, top to bottom.
 */
export function clockHubLayout(W, H) {
  const z = screenSizes(W, H);
  const { pad, px, gap, btn, ampH } = z;
  const inner = W - 2 * px;
  const shape = z.wide ? 'wide' : z.mid ? 'in between' : 'tall';

  if (z.wide) {
    // The clock fills the height, but leaves the column beside it room for
    // two digital clocks side by side at 60 % or more of the full digit size.
    const minDigits = Math.min(z.fd, Math.max(30, Math.round(z.fd * 0.6)));
    const minSide = 2 * digitCardWidth(z, minDigits) + gap;
    const clock = Math.min(H - 2 * pad - ampH - gap, inner - minSide - 2 * gap);
    const side = inner - clock - 2 * gap;
    return { ...z, shape, clock, side, digits: digitSize(z, (side - gap) / 2) };
  }
  if (z.mid) {
    const topH = H - 2 * pad - btn - gap;
    const minSide = z.phone ? 160 : 300;
    const stripH = (side) => {
      const fd = Math.min(z.fd, digitSize(z, side));
      return 2 * digitCardHeight(z, fd) + wordsCardHeight(z, side) + 2 * gap;
    };
    let clock = Math.min(topH - ampH - gap, inner - minSide - 2 * gap);
    while (clock > 120 && stripH(inner - clock - 2 * gap) > topH) clock -= 2;
    const side = inner - clock - 2 * gap;
    return { ...z, shape, clock, side, digits: Math.min(z.fd, digitSize(z, side)) };
  }
  const digits = digitSize(z, (inner - gap) / 2);
  const rest = 2 * pad + z.kid + ampH + wordsCardHeight(z, inner) + digitCardHeight(z, digits) + btn + 6 * gap;
  return { ...z, shape, clock: Math.min(inner, H - rest), side: inner, digits };
}
