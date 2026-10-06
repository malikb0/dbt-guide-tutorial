// Static integrity checks for the generated site. Run: node tools/check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const warn = [];
let checked = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', 'content', 'templates', 'tools', 'data', 'assets', 'docs', 'licenses', '_site', '.git', '.github'].includes(e.name)) return [];
      return walk(p);
    }
    return e.name.endsWith('.html') ? [p] : [];
  });
}

const files = walk(root);
for (const file of files) {
  checked++;
  const rel = path.relative(root, file);
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);

  // 1. unresolved placeholders
  for (const m of html.matchAll(/\{\{(diagram|icon):/g)) problems.push(`${rel}: unresolved {{${m[1]}:}} placeholder`);

  // 2. icon <use> targets have a symbol
  const symbols = new Set([...html.matchAll(/id="(i-[a-z0-9-]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#(i-[a-z0-9-]+)"/g)) {
    if (!symbols.has(m[1])) problems.push(`${rel}: missing icon symbol #${m[1]}`);
  }

  // 3. internal links resolve
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#|data:)/.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = path.resolve(dir, clean);
    if (!fs.existsSync(target)) problems.push(`${rel}: broken link → ${href}`);
  }

  // 4. in-page anchors resolve (ignore icon-sprite <use href="#i-…"> refs)
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const idSet = new Set(ids);
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (m[1].startsWith('i-')) continue;
    if (!idSet.has(m[1])) problems.push(`${rel}: dangling anchor #${m[1]}`);
  }

  // 5. duplicate ids
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) problems.push(`${rel}: duplicate id "${id}"`); seen.add(id); }

  // 6. required head tags
  if (!/name="viewport"/.test(html)) problems.push(`${rel}: missing viewport meta`);
  if (!/name="description"/.test(html)) warn.push(`${rel}: missing meta description`);

  // 7. required structural pieces
  if (!/class="skip?link"|class="skiplink"/.test(html)) warn.push(`${rel}: missing skip link`);
}

// JS syntax
for (const js of ['assets/js/app.js', 'assets/js/topics.js']) {
  const r = spawnSync(process.execPath, ['--check', path.join(root, js)], { encoding: 'utf8' });
  if (r.status !== 0) problems.push(`${js}: syntax error\n${r.stderr}`);
}

console.log(`Checked ${checked} HTML files.`);
if (warn.length) { console.log(`\n${warn.length} warnings:`); warn.slice(0, 20).forEach((w) => console.log('  ⚠', w)); }
if (problems.length) { console.log(`\n${problems.length} problems:`); problems.forEach((p) => console.log('  ✗', p)); process.exit(1); }
console.log('\n✓ No problems found.');
