// Page shell: <head>, header, hero, TOC rail, pager, footer, scripts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, LEVELS, TOTAL_TOPICS, TOTAL_MINUTES } from '../data/topics.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let SPRITE = '';
try { SPRITE = fs.readFileSync(path.join(root, 'assets/img/icons.svg'), 'utf8'); } catch (e) { SPRITE = ''; }

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function icon(name, cls = '') {
  return `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
}

export function sprite() { return `<div hidden>${SPRITE}</div>`; }

function head({ prefix, title, description, levelKey, urlPath = '', extraHead = '' }) {
  const accent = LEVELS.find((l) => l.key === levelKey)?.accent || SITE.accent;
  const base = (SITE.url || '').replace(/\/+$/, '');
  const canonical = base ? `${base}/${urlPath}` : '';
  const ogImage = base ? `${base}/assets/img/og.png` : `${prefix}assets/img/og.png`;
  return `<!DOCTYPE html>
<html lang="en" class="no-js" data-theme="dark"${levelKey ? ` data-level="${levelKey}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="${accent}">
<meta name="author" content="dbt Complete Tutorial">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
${canonical ? `<meta property="og:url" content="${canonical}">
<link rel="canonical" href="${canonical}">` : ''}
<link rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<meta name="generator" content="dbt-tutorial-build">
<link rel="icon" href="${prefix}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${prefix}assets/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefix}assets/fonts/fonts.css">
<link rel="stylesheet" href="${prefix}css/style.css">
<script>(function(){var d=document.documentElement;d.classList.remove('no-js');d.classList.add('js');try{var t=localStorage.getItem('dbt-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}d.dataset.theme=t;}catch(e){d.dataset.theme='dark';}})();</script>
${extraHead}
</head>
<body>`;
}

function header(prefix, activeLevel) {
  const links = LEVELS.map((l) => `
        <a href="${prefix}${l.key}/index.html"${l.key === activeLevel ? ' aria-current="true"' : ''}><span class="dot" style="color:${l.accent}"></span>${l.name}</a>`).join('');
  return `<a class="skiplink" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${prefix}index.html">
      <span class="brand__mark">${icon('git-branch')}</span>
      <span class="brand__text">dbt <b>Tutorial</b></span>
    </a>
    <nav class="site-nav" aria-label="Levels">
      <a href="${prefix}index.html"${activeLevel === null ? '' : ''}>${icon('layers')}Home</a>${links}
    </nav>
    <div class="header-actions">
      <button class="search-trigger" type="button" aria-label="Search topics">
        ${icon('search')}<span>Search topics…</span><span class="kbd">Ctrl K</span>
      </button>
      <div class="progress-ring" role="img" aria-label="Overall progress">
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle class="track" cx="20" cy="20" r="16" fill="none" stroke-width="3"></circle>
          <circle class="bar" cx="20" cy="20" r="16" fill="none" stroke-width="3" stroke-dasharray="100" stroke-dashoffset="100"></circle>
        </svg>
        <span class="pct">0%</span>
      </div>
      <button class="icon-btn theme-toggle" type="button" aria-label="Toggle theme">
        <svg class="icon" data-icon="sun" aria-hidden="true"><use href="#i-sun"></use></svg>
        <svg class="icon" data-icon="moon" aria-hidden="true" style="display:none"><use href="#i-moon"></use></svg>
      </button>
      <button class="icon-btn nav-toggle" type="button" aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
</header>
<nav class="mobile-nav" aria-label="Mobile">
  <a href="${prefix}index.html">${icon('layers')}Home</a>${links}
</nav>`;
}

export function tocRail(items, doneLabel) {
  if (!items || !items.length) return '';
  const list = items.map((i) => `<li><a class="${i.level === 3 ? 'lvl-3' : ''}" href="#${i.id}">${esc(i.text)}</a></li>`).join('');
  return `<aside class="toc-rail">
    <nav class="toc" aria-label="On this page">
      <div class="toc__title">${icon('list-tree')} On this page</div>
      <ul class="toc__list">${list}</ul>
      <div class="toc__progress">
        <div class="label"><span>Your progress</span><span class="count">${doneLabel || ''}</span></div>
        <div class="bar"><span style="width:0"></span></div>
      </div>
    </nav>
  </aside>`;
}

export function pager(prev, next, prefix) {
  const link = (t, dir) => t ? `<a class="pager__link pager__link--${dir === 'prev' ? 'prev' : 'next'}" href="${prefix}${t.level}/${t.slug}.html">
      <span class="dir">${icon(dir === 'prev' ? 'arrow-left' : 'arrow-right')}${dir === 'prev' ? 'Previous' : 'Next'}</span>
      <span class="t">${esc(t.title)}</span></a>` : '<span></span>';
  return `<nav class="pager" aria-label="Topic navigation">${link(prev, 'prev')}${link(next, 'next')}</nav>`;
}

function footer(prefix) {
  const levelLinks = LEVELS.map((l) => `<a href="${prefix}${l.key}/index.html">${l.name} — ${esc(l.label)}</a>`).join('');
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-col footer-brand">
        <a class="brand" href="${prefix}index.html"><span class="brand__mark">${icon('git-branch')}</span><span class="brand__text">dbt <b>Tutorial</b></span></a>
        <p>${esc(SITE.description)}</p>
      </div>
      <div class="footer-col"><h4>Levels</h4>${levelLinks}</div>
      <div class="footer-col"><h4>Official docs</h4>
        <a href="${SITE.repo}" target="_blank" rel="noopener">dbt-core on GitHub ${icon('external-link')}</a>
        <a href="https://docs.getdbt.com/" target="_blank" rel="noopener">docs.getdbt.com ${icon('external-link')}</a>
        <a href="https://duckdb.org/docs/" target="_blank" rel="noopener">DuckDB docs ${icon('external-link')}</a>
        <a href="https://hub.getdbt.com/" target="_blank" rel="noopener">dbt package hub ${icon('external-link')}</a>
      </div>
      <div class="footer-col"><h4>This guide</h4>
        <a href="${prefix}index.html">All topics</a>
        <a href="${prefix}index.html#quick-jump">Quick jump table</a>
        <a href="${prefix}beginner/1-intro.html">Start from scratch</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} dbt Complete Tutorial · ${TOTAL_TOPICS} topics · ${Math.round(TOTAL_MINUTES / 60)} h of material</span>
      <span>Content <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a> · Code MIT</span>
      <span>Built with ${icon('database')} DuckDB · ${esc(SITE.version)}</span>
    </div>
  </div>
</footer>`;
}

function searchDialog(prefix) {
  return `<dialog class="search-dialog" aria-label="Search">
  <div class="search-panel">
    <div class="search-field">
      ${icon('search')}
      <input type="search" placeholder="Search ${TOTAL_TOPICS} topics — try 'incremental' or 'snapshot'" aria-label="Search topics">
      <span class="kbd">Esc</span>
    </div>
    <div class="search-results"></div>
  </div>
</dialog>`;
}

function scripts(prefix) {
  return `<script src="${prefix}assets/js/topics.js"></script>
<script src="${prefix}assets/js/vendor/prism-bundle.js" defer></script>
<script src="${prefix}assets/js/app.js" defer></script>`;
}

/**
 * @param {object} o
 * @param {number} o.depth        0 for root, 1 for level/ (prefix === '../')
 * @param {string} o.title
 * @param {string} o.description
 * @param {string} [o.levelKey]
 * @param {string} o.main         inner HTML (page content)
 * @param {string} [o.hero]       hero HTML (optional; home/level pages supply their own)
 * @param {Array}  [o.toc]        [{id,text,level}]
 * @param {string} [o.pager]      pager HTML
 * @param {string} [o.extraHead]
 * @param {string} [o.bodyClass]
 * @param {string} [o.urlPath]    path relative to the site root for canonical/og:url (e.g. 'beginner/1-intro.html')
 */
export function renderPage(o) {
  const prefix = o.depth === 0 ? '' : '../';
  const activeLevel = o.levelKey || null;
  const mainWrap = o.toc ? `<div class="shell">
      ${tocRail(o.toc)}
      <main id="main" class="prose">${o.main}${o.pager || ''}</main>
    </div>` : `<main id="main">${o.main}</main>`;
  return `${head({ prefix, title: o.title, description: o.description, levelKey: o.levelKey, urlPath: o.urlPath || '', extraHead: o.extraHead || '' })}
${sprite()}
${header(prefix, activeLevel)}
${o.hero || ''}
${mainWrap}
${footer(prefix)}
${searchDialog(prefix)}
${scripts(prefix)}
</body>
</html>
`;
}
