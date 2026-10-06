// Static site generator. Composes data + HTML fragments + templates into
// committed HTML at the repo root. Run: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE, LEVELS, TOPICS, allTopics, levelByKey, topicsByLevel,
  TOTAL_TOPICS, TOTAL_MINUTES,
} from '../data/topics.mjs';
import { renderPage, icon, esc, pager, tocRail } from '../templates/layout.mjs';
import { diagram } from '../templates/diagrams.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = (rel, content) => {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
  console.log('  ✓', rel);
};

/* ── content interpolation: {{diagram:key|caption}} {{icon:name}} ── */
function interpolate(html) {
  return html
    .replace(/\{\{diagram:([a-z0-9-]+)(?:\|([^}]+))?\}\}/gi, (_m, k, c) => diagram(k, c))
    .replace(/\{\{icon:([a-z0-9-]+)\}\}/gi, (_m, n) => icon(n));
}

/* ── heading ids + TOC extraction ──────────────────────────── */
function slugify(text) {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'section';
}
function processContent(html) {
  const toc = [];
  const seen = new Map();
  const withIds = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (m, lvl, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugify(text);
    if (seen.has(id)) { seen.set(id, seen.get(id) + 1); id = `${id}-${seen.get(id)}`; } else { seen.set(id, 1); }
    toc.push({ id, text, level: Number(lvl) });
    const existingId = /id="[^"]*"/.test(attrs);
    const cleanAttrs = attrs.replace(/\s*id="[^"]*"/, '');
    const anchor = `<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a>`;
    return `<h${lvl}${existingId ? '' : ` id="${id}"`}${cleanAttrs}>${inner} ${anchor}</h${lvl}>`;
  });
  return { html: withIds, toc };
}

/* ── hero builders ─────────────────────────────────────────── */
function topicHero(t, anchor) {
  const lvl = levelByKey[t.level];
  const idx = topicsByLevel[t.level].findIndex((x) => x.slug === t.slug) + 1;
  const tags = (t.tags || []).map((x) => `<span class="chip">${icon('table-properties')}${esc(x)}</span>`).join('');
  return `<section class="hero">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="../index.html">Home</a>${icon('chevron-right')}
      <a href="./index.html">${lvl.name}</a>${icon('chevron-right')}
      <span>${esc(t.nav || t.title)}</span>
    </nav>
    <div class="hero__eyebrow" style="margin-top:1rem">${icon(t.icon)} ${lvl.name} · Topic ${idx} of ${topicsByLevel[t.level].length}</div>
    <h1 class="hero__title">${esc(t.title)}</h1>
    <p class="hero__lede">${esc(t.lede)}</p>
    <div class="hero__meta">
      <span>${icon('clock')} ${t.time} min</span>
      <span>${icon('target')} ${t.skills.length} skills</span>
      ${tags}
    </div>
    <div class="hero__cta">
      <button class="btn btn--ghost markdone" data-key="${t.level}/${t.slug}" type="button">${icon('circle-check')}<span data-label>Mark as complete</span></button>
      <a class="btn btn--primary" href="#${anchor || 'main'}">${icon('book-open')}Start reading</a>
    </div>
  </div>
</section>`;
}

function levelHero(level) {
  return `<section class="hero">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a>${icon('chevron-right')}<span>${level.name}</span></nav>
    <div class="hero__eyebrow" style="margin-top:1rem">${icon(level.icon)} Level · ${esc(level.label)}</div>
    <h1 class="hero__title">${level.emoji} ${esc(level.name)} <span class="grad">${esc(level.label)}</span></h1>
    <p class="hero__lede">${esc(level.blurb)}</p>
    <div class="hero__meta">
      <span>${icon('layers')} ${topicsByLevel[level.key].length} topics</span>
      <span>${icon('clock')} ${esc(level.time)}</span>
      <span>${icon('target')} ${topicsByLevel[level.key].reduce((s, t) => s + t.skills.length, 0)} skills</span>
    </div>
  </div>
</section>`;
}

/* ── topic cards / rows ────────────────────────────────────── */
function topicCards(level) {
  return topicsByLevel[level.key].map((t) => `<a class="card reveal" href="./${t.slug}.html">
    <div class="card__icon">${icon(t.icon)}</div>
    <div class="card__title">${esc(t.nav || t.title)}</div>
    <p class="card__text">${esc(t.lede)}</p>
    <div class="card__meta">${icon('clock')} ${t.time} min<span>${t.tags.slice(0, 2).map((x) => `<span class="tag">${esc(x)}</span>`).join(' ')}</span></div>
  </a>`).join('\n');
}

/* ── level index page ──────────────────────────────────────── */
function buildLevel(level) {
  const topics = topicsByLevel[level.key];
  const skills = [...new Set(topics.flatMap((t) => t.skills))].slice(0, 8);
  const main = `
<section class="wrap" style="padding:3rem 0 2rem">
  <div class="section-head center" style="margin-bottom:2rem">
    <span class="eyebrow">${icon('route')} What's inside</span>
    <h2 style="margin-top:.5rem">${topics.length} topics, in order</h2>
    <p class="muted" style="max-width:60ch;margin:.6rem auto 0">${esc(level.summary)} Work top to bottom, or jump to what you need.</p>
  </div>
  <div class="cards cards--2">${topicCards(level)}</div>
</section>

<section class="wrap" style="padding:1rem 0 3rem">
  <div class="split">
    <div class="split__body stack">
      <span class="eyebrow">${icon('target')} Outcomes</span>
      <h2 style="font-size:var(--step-2)">By the end you can…</h2>
      <ul class="checklist">${skills.map((s) => `<li>${icon('circle-check')}<span>${esc(s)}</span></li>`).join('')}</ul>
    </div>
    <div class="split__visual">
      ${diagram(level.diagram, `${level.name} level at a glance`)}
    </div>
  </div>
</section>`;
  return renderPage({
    depth: 1,
    urlPath: `${level.key}/`,
    title: `${level.name} — ${level.label} | ${SITE.name}`,
    description: level.summary + ' ' + level.blurb,
    levelKey: level.key,
    hero: levelHero(level),
    main,
  });
}

/* ── home page ─────────────────────────────────────────────── */
function buildHome() {
  const levelCards = LEVELS.map((l) => `<a class="level-card reveal" data-level="${l.key}" href="${l.key}/index.html">
    <div class="level-card__head">
      <div class="level-card__icon">${icon(l.icon)}</div>
      <span class="level-card__tag">${esc(l.label)}</span>
    </div>
    <h3>${l.emoji} ${esc(l.name)}</h3>
    <p>${esc(l.summary)}</p>
    <div class="level-card__bar"><span></span></div>
    <div class="level-card__foot"><span data-count>0/${topicsByLevel[l.key].length} topics</span><span>${esc(l.time)}</span></div>
  </a>`).join('\n');

  const groups = LEVELS.map((l) => `<div class="topic-group reveal" data-level="${l.key}">
    <div class="topic-group__title">${icon(l.icon)} ${esc(l.name)} — ${esc(l.label)}<span class="chip">${topicsByLevel[l.key].length} topics</span></div>
    <div class="topic-list">${topicsByLevel[l.key].map((t) => topicRow(t, l)).join('\n')}</div>
  </div>`).join('\n');

  const jump = LEVELS.map((l) => `<tr><td><span class="badge badge--${l.key}">${esc(l.name)}</span></td>
      <td><a href="${l.key}/index.html">${icon(l.icon)} ${esc(l.label)} overview</a></td><td>${esc(l.time)}</td></tr>` +
    topicsByLevel[l.key].map((t) => `<tr><td></td><td><a href="${t.level}/${t.slug}.html">${t.emoji} ${esc(t.title)}</a></td><td>${t.time} min</td></tr>`).join('')
  ).join('\n');

  const main = `
<section class="wrap" id="levels" style="padding:1rem 0 2rem">
  <div class="section-head center">
    <span class="eyebrow">${icon('graduation-cap')} Pick your level</span>
    <h2 style="margin-top:.5rem">Four levels, one path</h2>
    <p class="muted" style="max-width:60ch;margin:.6rem auto 0">Each level builds on the last. Start where you fit — progress is saved in your browser.</p>
  </div>
  <div class="level-grid" style="margin-top:2.2rem">${levelCards}</div>
</section>

<section class="wrap" style="padding:1rem 0 2rem">
  <div class="stat-grid">
    <div class="stat"><div class="stat__value">${TOTAL_TOPICS}</div><div class="stat__label">Topics</div></div>
    <div class="stat"><div class="stat__value">${LEVELS.length}</div><div class="stat__label">Levels</div></div>
    <div class="stat"><div class="stat__value">${Math.round(TOTAL_MINUTES / 60)}<span class="unit">h</span></div><div class="stat__label">Guided material</div></div>
    <div class="stat"><div class="stat__value">100<span class="unit">%</span></div><div class="stat__label">Hands-on with DuckDB</div></div>
  </div>
</section>

<section class="wrap" style="padding:2rem 0">
  <div class="split split--rev">
    <div class="split__body stack">
      <span class="eyebrow">${icon('git-branch')} The big picture</span>
      <h2 style="font-size:var(--step-2)">From raw data to a trusted dashboard</h2>
      <p>dbt sits in the transformation layer: it takes raw tables, compiles your SQL into a dependency graph, tests every step, and documents the lineage — so analytics becomes a software discipline.</p>
      <div class="flow">
        <span class="flow__node">${icon('satellite')}Sources</span>
        <span class="flow__arrow">${icon('arrow-right')}</span>
        <span class="flow__node">${icon('layers')}dbt models</span>
        <span class="flow__arrow">${icon('arrow-right')}</span>
        <span class="flow__node">${icon('circle-check')}Tests</span>
        <span class="flow__arrow">${icon('arrow-right')}</span>
        <span class="flow__node">${icon('chart-line')}Dashboards</span>
      </div>
      <div class="hero__cta"><a class="btn btn--primary" href="beginner/1-intro.html">${icon('play')}Start with the basics</a></div>
    </div>
    <div class="split__visual">${diagram('pipeline', 'The dbt transformation pipeline')}</div>
  </div>
</section>

<section class="wrap" style="padding:2rem 0">
  <div class="section-head center">
    <span class="eyebrow">${icon('book-open')} Browse everything</span>
    <h2 style="margin-top:.5rem">All ${TOTAL_TOPICS} topics</h2>
  </div>
  ${groups}
</section>

<section class="wrap" style="padding:2rem 0 3rem" id="quick-jump">
  <div class="section-head center" style="margin-bottom:1.6rem">
    <span class="eyebrow">${icon('zap')} Quick jump</span>
    <h2 style="margin-top:.5rem">The whole map</h2>
  </div>
  <div class="table-wrap">
    <table class="table--zebra"><thead><tr><th>Level</th><th>Topic</th><th>Time</th></tr></thead>
    <tbody>${jump}</tbody></table>
  </div>
</section>`;

  const ringsUnused = '';
  return renderPage({
    depth: 0,
    urlPath: '',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    levelKey: null,
    hero: homeHero(),
    main,
    extraHead: '<meta name="keywords" content="dbt, data build tool, analytics engineering, DuckDB, SQL, tutorial">',
  });
}

function homeHero() {
  return `<section class="hero">
  <div class="wrap center">
    <span class="hero__eyebrow" style="margin-inline:auto">${icon('sparkles')} Data Build Tool · visualization-first guide</span>
    <h1 class="hero__title">Learn <span class="grad">dbt</span>, beautifully.</h1>
    <p class="hero__lede" style="margin-inline:auto">${esc(SITE.tagline)} Every concept gets a diagram, a runnable example and a real warehouse — no cloud account required.</p>
    <div class="hero__meta" style="justify-content:center">
      <span>${icon('layers')} ${TOTAL_TOPICS} topics</span>
      <span>${icon('route')} 4 levels</span>
      <span>${icon('database')} DuckDB warehouse</span>
      <span>${icon('shield-check')} Works fully offline</span>
    </div>
    <div class="hero__cta" style="justify-content:center">
      <a class="btn btn--primary" href="beginner/1-intro.html">${icon('play')}Start learning</a>
      <a class="btn btn--ghost" href="#quick-jump">${icon('list-tree')}Browse the map</a>
    </div>
  </div>
</section>`;
}

function topicRow(t, level) {
  return `<a class="topic-row" data-key="${t.level}/${t.slug}" href="${t.level}/${t.slug}.html">
    <span class="topic-row__icon">${icon(t.icon)}</span>
    <span class="topic-row__body">
      <span class="topic-row__title">${t.emoji} ${esc(t.title)}</span>
      <span class="topic-row__desc">${esc(t.lede)}</span>
    </span>
    <span class="topic-row__side">${icon('clock')} ${t.time}m ${icon('chevron-right')}</span>
  </a>`;
}

/* ── browser data ──────────────────────────────────────────── */
function emitBrowserData() {
  const data = {
    SITE: { name: SITE.name, version: SITE.version },
    LEVELS: LEVELS.map((l) => ({ key: l.key, name: l.name, label: l.label, accent: l.accent, icon: l.icon })),
    TOPICS: TOPICS.map((t) => ({ level: t.level, slug: t.slug, title: t.title, nav: t.nav, lede: t.lede, icon: t.icon, time: t.time, tags: t.tags })),
    search: allTopics.map((t) => ({ title: t.title, lede: t.lede, level: t.level, url: `${t.level}/${t.slug}.html`, tags: t.tags })),
  };
  write('assets/js/topics.js', `window.DBTT_DATA = ${JSON.stringify(data, null, 2)};\n`);
}

/* ── favicon ───────────────────────────────────────────────── */
function emitFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f8cff"/><stop offset="1" stop-color="#818cf8"/></linearGradient></defs>
<rect width="64" height="64" rx="16" fill="url(#g)"/>
<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<circle cx="24" cy="22" r="4"/><circle cx="42" cy="32" r="4"/><circle cx="24" cy="44" r="4"/>
<path d="M27 24l12 6M27 42l12-8"/></g></svg>`;
  write('assets/img/favicon.svg', svg);
}

/* ── sitemap + robots ──────────────────────────────────────── */
function emitExtras() {
  const base = SITE.url.replace(/\/+$/, '');
  const today = new Date().toISOString().slice(0, 10);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
  const urls = [
    `${base}/`,
    ...LEVELS.map((l) => `${base}/${l.key}/`),
    ...allTopics.map((t) => `${base}/${t.level}/${t.slug}.html`),
  ];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  write('404.html', renderPage({
    depth: 0,
    urlPath: '404.html',
    title: `Page not found | ${SITE.name}`,
    description: 'The page you were looking for does not exist.',
    hero: `<section class="hero"><div class="wrap center"><span class="hero__eyebrow" style="margin-inline:auto">${icon('compass')} 404</span><h1 class="hero__title">Lost in the <span class="grad">DAG</span></h1><p class="hero__lede" style="margin-inline:auto">This node has no upstream. Pick a path back to the graph.</p><div class="hero__cta" style="justify-content:center"><a class="btn btn--primary" href="index.html">${icon('arrow-left')}Back home</a></div></div></section>`,
    main: '',
  }));
}

/* ── topics ────────────────────────────────────────────────── */
function buildTopic(t) {
  const fragPath = path.join(root, 'content', t.level, `${t.slug}.html`);
  if (!fs.existsSync(fragPath)) { console.warn('  ! missing fragment', path.relative(root, fragPath)); return; }
  const raw = interpolate(fs.readFileSync(fragPath, 'utf8'));
  const { html, toc } = processContent(raw);
  const sibs = topicsByLevel[t.level];
  const i = sibs.findIndex((x) => x.slug === t.slug);
  const prev = i > 0 ? sibs[i - 1] : null;
  const next = i < sibs.length - 1 ? sibs[i + 1] : null;
  const page = renderPage({
    depth: 1,
    urlPath: `${t.level}/${t.slug}.html`,
    title: `${t.title} | ${levelByKey[t.level].name} · ${SITE.shortName}`,
    description: t.lede,
    levelKey: t.level,
    hero: topicHero(t, toc[0] && toc[0].id),
    main: html,
    toc,
    pager: pager(prev, next, '../'),
  });
  write(`${t.level}/${t.slug}.html`, page);
}

/* ── clean: remove generated output, keep sources ──────────── */
function clean() {
  const generated = [
    'index.html', '404.html', 'sitemap.xml', 'robots.txt',
    'assets/js/topics.js', 'assets/img/favicon.svg',
    ...LEVELS.map((l) => `${l.key}/index.html`),
    ...allTopics.map((t) => `${t.level}/${t.slug}.html`),
  ];
  let n = 0;
  for (const rel of generated) {
    const abs = path.join(root, rel);
    if (fs.existsSync(abs)) { fs.rmSync(abs); console.log('  ✗ removed', rel); n++; }
  }
  console.log(`Cleaned ${n} generated files (content/, data/, templates/, css/ untouched).`);
}

/* ── run ───────────────────────────────────────────────────── */
if (process.argv.includes('--clean')) {
  console.log('Cleaning generated output…');
  clean();
  process.exit(0);
}
fs.mkdirSync(path.join(root, 'content'), { recursive: true });
console.log('Building dbt tutorial…');
emitBrowserData();
emitFavicon();
emitExtras();
console.log('Topics:');
for (const t of allTopics) buildTopic(t);
console.log('Levels:');
for (const l of LEVELS) write(`${l.key}/index.html`, buildLevel(l));
console.log('Home:');
write('index.html', buildHome());
console.log(`Done. ${TOTAL_TOPICS} topics across ${LEVELS.length} levels.`);
