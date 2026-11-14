// Reads the Examples tables out of a .feature file, so the tests always use
// the same examples as the requirements.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const featuresDir = new URL('../../features/', import.meta.url);

/**
 * Returns every row from every Examples table under the Scenario Outline
 * with the given title. Each row is an object keyed by the table's headers.
 */
export function examples(featureFile, outlineTitle) {
  const path = fileURLToPath(new URL(featureFile, featuresDir));
  const lines = readFileSync(path, 'utf8').split('\n').map((l) => l.trim());

  const rows = [];
  let inOutline = false;
  let headers = null;

  for (const line of lines) {
    const outline = line.match(/^Scenario Outline:\s*(.+)$/);
    if (outline) {
      inOutline = outline[1] === outlineTitle;
      headers = null;
      continue;
    }
    if (/^(Scenario|Rule|Feature|Background):/.test(line)) {
      inOutline = false;
      headers = null;
      continue;
    }
    if (!inOutline) continue;

    if (/^Examples:?/.test(line)) {
      headers = [];
      continue;
    }
    if (headers && line.startsWith('|')) {
      const cells = line.slice(1, -1).split('|').map((c) => c.trim());
      if (headers.length === 0) {
        headers = cells;
      } else {
        rows.push(Object.fromEntries(headers.map((h, i) => [h, cells[i]])));
      }
    }
  }

  if (rows.length === 0) {
    throw new Error(`No examples found for "${outlineTitle}" in ${featureFile}`);
  }
  return rows;
}

/** "09:12" -> { hours: 9, minutes: 12 } */
export function parseTime(text) {
  const [hours, minutes] = text.split(':').map(Number);
  return { hours, minutes };
}
