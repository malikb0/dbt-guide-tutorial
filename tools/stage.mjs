// Assemble a clean, deployable copy of the site into _site/.
// Only runtime files ship: HTML, css/, assets/, robots.txt, sitemap.xml, .nojekyll.
// Sources (content/, data/, templates/, tools/, docs/) and node_modules/ are excluded.
// Run: node tools/build.mjs && node tools/stage.mjs  (or: npm run stage)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LEVELS, allTopics } from '../data/topics.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

let count = 0;
const copy = (relS, relD = relS) => {
  const src = path.join(root, relS);
  if (!fs.existsSync(src)) { console.warn('  ! missing', relS); return; }
  const dest = path.join(out, relD);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  count++;
};

// root files + whole directories
for (const f of ['index.html', '404.html', 'robots.txt', 'sitemap.xml', '.nojekyll']) copy(f);
for (const d of ['css', 'assets']) copy(d);

// generated topic pages, one level directory at a time
for (const l of LEVELS) {
  for (const t of allTopics.filter((x) => x.level === l.key)) {
    copy(`${l.key}/${t.slug}.html`, `${l.key}/${t.slug}.html`);
  }
  copy(`${l.key}/index.html`, `${l.key}/index.html`);
}

const bytes = (function size(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((s, e) =>
    s + (e.isDirectory() ? size(path.join(dir, e.name)) : fs.statSync(path.join(dir, e.name)).size), 0);
})(out);

console.log(`Staged ${count} entries → _site/ (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
