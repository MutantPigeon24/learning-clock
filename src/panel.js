// What every panel (a native <dialog> opened with showModal) does the same
// way: its close buttons, a tap on the dimmed screen outside it, and putting
// the focus back on the button that opened it. Escape is the browser's own.

/** True when a point is outside the box. */
export function isOutside(rect, x, y) {
  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
}

/**
 * Wires up a panel. opener: the button that opens it (focus goes back to it
 * on close). closeButtons: buttons that close it. onClose: anything else to
 * do when it closes, however that happens.
 */
export function setUpPanel(dialog, { opener, closeButtons = [], onClose = () => {} }) {
  for (const button of closeButtons) button.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    // A click on the panel's own padding also targets the dialog, so check
    // that it really fell outside the panel.
    if (e.target === dialog && isOutside(dialog.getBoundingClientRect(), e.clientX, e.clientY)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    onClose();
    opener.focus();
  });
}
