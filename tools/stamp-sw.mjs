// Keeps sw.js's BUILD fingerprint in step with the files it stores.
// Run: npm run stamp
//
// The fingerprint is a hash of every file in sw.js's FILES list. When any of
// them changes, the fingerprint changes, so sw.js changes too, and that's what
// makes the tablet pick up the new version.

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const swPath = new URL('sw.js', root);

/** The FILES list from sw.js, as written ("./index.html", ...). */
export function storedFiles(source = readFileSync(swPath, 'utf8')) {
  const list = source.match(/const FILES = \[([\s\S]*?)\];/);
  if (!list) throw new Error('No FILES list found in sw.js');
  return [...list[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((m) => m[1]);
}

/** The BUILD value written in sw.js. */
export function writtenBuild(source = readFileSync(swPath, 'utf8')) {
  const build = source.match(/const BUILD = '([0-9a-f]+)';/);
  if (!build) throw new Error('No BUILD found in sw.js');
  return build[1];
}

/** A 12-character hash of the files' names and contents. */
export function fingerprint(files = storedFiles()) {
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(`${file}\0`);
    hash.update(readFileSync(new URL(file, root)));
    hash.update('\0');
  }
  return hash.digest('hex').slice(0, 12);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const source = readFileSync(swPath, 'utf8');
  const build = fingerprint(storedFiles(source));
  if (build === writtenBuild(source)) {
    console.log(`sw.js is up to date (${build})`);
  } else {
    writeFileSync(swPath, source.replace(/const BUILD = '[0-9a-f]+';/, `const BUILD = '${build}';`));
    console.log(`sw.js BUILD is now ${build}`);
  }
}
