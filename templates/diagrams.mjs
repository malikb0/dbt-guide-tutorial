// Inline, theme-aware SVG diagrams. Color comes from CSS custom properties so
// every diagram adapts to the light/dark toggle automatically.
import { esc } from './layout.mjs';

const VB = '0 0 760 340';

function wrap(key, inner, vb = VB) {
  return `<figure class="diagram">
  <div class="diagram__frame">
    <svg viewBox="${vb}" role="img" aria-label="${esc(key)} diagram" preserveAspectRatio="xMidYMid meet">${inner}</svg>
  </div>
  <figcaption class="diagram__caption">__CAP__</figcaption>
</figure>`;
}

function defs(key) {
  const id = `arr-${key}`;
  return `<defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--border-2)"/>
    </marker>
    <marker id="${id}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/>
    </marker>
  </defs>`;
}

function use(name, x, y, size = 18, color = 'var(--accent)', sw = 2) {
  return `<use href="#i-${name}" x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function node({ x, y, w = 148, h = 58, title, sub, cls = 'dg-node', icon, iconColor = 'var(--accent)', centered = false }) {
  const tx = icon ? x + 42 : x + 15;
  const anchor = centered ? 'middle' : 'start';
  const cx = centered ? x + w / 2 : tx;
  return `<g>
    <rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>
    ${icon ? use(icon, x + 13, y + h / 2 - 9, 18, iconColor) : ''}
    <text class="dg-label" x="${cx}" y="${y + (sub ? h / 2 - 1 : h / 2 + 1)}" text-anchor="${anchor}" dominant-baseline="middle">${esc(title)}</text>
    ${sub ? `<text class="dg-sub" x="${cx}" y="${y + h / 2 + 15}" text-anchor="${anchor}" dominant-baseline="middle">${esc(sub)}</text>` : ''}
  </g>`;
}

function edge(key, x1, y1, x2, y2, { accent = false, dash = false, marker = true, d } = {}) {
  const cls = `dg-edge${accent ? ' dg-edge--accent' : ''}${dash ? ' dg-edge-dash' : ''}`;
  const m = marker ? ` marker-end="url(#arr-${key}${accent ? '-a' : ''})"` : '';
  return `<path class="${cls}" d="${d || `M${x1},${y1} L${x2},${y2}`}"${m}/>`;
}

function band(x, y, w, h, label, color = 'var(--accent)') {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="7 6" opacity=".7"/>
  <rect x="${x + 14}" y="${y - 11}" width="${label.length * 7.2 + 20}" height="22" rx="11" fill="var(--bg-2)" stroke="${color}" stroke-width="1"/>
  <text x="${x + 24}" y="${y}" dominant-baseline="middle" font-family="var(--font-mono)" font-size="11" fill="${color}">${esc(label)}</text></g>`;
}

const D = {
  /* ── transformation pipeline ─────────────────────────────── */
  pipeline() {
    const k = 'pipeline';
    let s = defs(k);
    s += node({ x: 20, y: 130, w: 150, h: 64, title: 'Source systems', sub: 'Postgres · API · files', cls: 'dg-node dg-node--source', icon: 'satellite', iconColor: '#22d3ee' });
    s += node({ x: 215, y: 130, w: 130, h: 64, title: 'Raw tables', sub: 'landed, untrusted', icon: 'database', iconColor: 'var(--text-3)' });
    s += band(375, 82, 250, 180, 'dbt transformation');
    s += node({ x: 395, y: 112, w: 210, h: 44, title: 'Staging models', sub: 'clean · rename · cast', icon: 'layers' });
    s += node({ x: 395, y: 172, w: 210, h: 44, title: 'Marts models', sub: 'joins · metrics', icon: 'chart-column' });
    s += node({ x: 650, y: 130, w: 92, h: 64, title: 'BI', sub: 'dashboards', cls: 'dg-node dg-node--out', icon: 'chart-line', iconColor: '#34d399' });
    s += edge(k, 170, 162, 215, 162, { accent: true });
    s += edge(k, 345, 162, 395, 134, { accent: true });
    s += edge(k, 605, 134, 650, 150, { accent: true });
    s += edge(k, 500, 156, 500, 172, { accent: true });
    s += `<text class="dg-sub" x="380" y="300" text-anchor="middle" font-size="11">ref() stitches models into a DAG — dbt runs them in dependency order</text>`;
    return wrap(k, s).replace('__CAP__', 'Raw data lands in the warehouse, dbt models transform it, BI reads the marts.');
  },

  /* ── install stack ───────────────────────────────────────── */
  install() {
    const k = 'install';
    let s = defs(k);
    const rows = [
      ['Python 3.8+', 'runtime for dbt-core', 'file-code'],
      ['Virtual environment', 'isolated packages', 'package'],
      ['dbt-duckdb adapter', 'pip install "dbt-duckdb"', 'plug'],
      ['profiles.yml', 'points dbt at DuckDB', 'key'],
      ['dbt project', 'models · seeds · tests', 'folder-tree'],
      ['warehouse.duckdb', 'your local database file', 'database'],
    ];
    rows.forEach(([t, sub, ic], i) => {
      const y = 18 + i * 50;
      s += node({ x: 150, y, w: 460, h: 40, title: t, sub: '', icon: ic, cls: i === 3 ? 'dg-node dg-node--accent' : 'dg-node' });
      if (i < rows.length - 1) s += edge(k, 380, y + 40, 380, y + 50, { accent: i === 3 });
    });
    s += `<text class="dg-sub" x="640" y="20" text-anchor="end">$ dbt debug ✓</text>`;
    return wrap(k, s, '0 0 760 320').replace('__CAP__', 'The install chain: Python → virtualenv → adapter → profile → project → DuckDB file.');
  },

  /* ── layered / medallion architecture ────────────────────── */
  layers() {
    const k = 'layers';
    let s = defs(k);
    s += band(20, 20, 720, 90, 'bronze · sources', '#22d3ee');
    s += band(20, 125, 720, 90, 'silver · staging + intermediate', '#f59e0b');
    s += band(20, 230, 720, 90, 'gold · marts', '#10b981');
    s += node({ x: 45, y: 45, w: 150, h: 42, title: 'raw_orders', sub: 'source table', cls: 'dg-node dg-node--source', icon: 'database', iconColor: '#22d3ee' });
    s += node({ x: 215, y: 45, w: 150, h: 42, title: 'raw_customers', sub: 'source table', cls: 'dg-node dg-node--source', icon: 'database', iconColor: '#22d3ee' });
    s += node({ x: 430, y: 148, w: 200, h: 44, title: 'stg_orders', sub: '1 source → 1 model', icon: 'layers' });
    s += node({ x: 45, y: 148, w: 170, h: 44, title: 'stg_customers', sub: 'clean + cast', icon: 'layers' });
    s += node({ x: 300, y: 255, w: 230, h: 46, title: 'mart_customer_orders', sub: 'business-ready', cls: 'dg-node dg-node--out', icon: 'chart-column', iconColor: '#34d399' });
    s += edge(k, 195, 66, 430, 148, { accent: true, d: 'M195,66 C300,66 340,148 430,148' });
    s += edge(k, 130, 190, 300, 255, { accent: true, d: 'M130,190 C200,190 230,255 300,255' });
    s += edge(k, 530, 170, 530, 255, { accent: true, d: 'M530,170 C530,220 530,255 530,255' });
    return wrap(k, s, '0 0 760 340').replace('__CAP__', 'Layer your project: raw sources → staging/intermediate → gold marts.');
  },

  /* ── first model DAG ─────────────────────────────────────── */
  'first-model'() {
    const k = 'first-model';
    let s = defs(k);
    s += node({ x: 30, y: 60, w: 170, h: 60, title: 'ecommerce.orders', sub: 'source', cls: 'dg-node dg-node--source', icon: 'database', iconColor: '#22d3ee' });
    s += node({ x: 300, y: 60, w: 170, h: 60, title: 'first_orders', sub: 'models/first_orders.sql', cls: 'dg-node dg-node--accent', icon: 'hammer' });
    s += node({ x: 300, y: 200, w: 170, h: 60, title: 'order_summary', sub: 'models/order_summary.sql', icon: 'chart-column', iconColor: 'var(--text-3)' });
    s += node({ x: 560, y: 200, w: 170, h: 60, title: 'mart_revenue', sub: 'downstream', cls: 'dg-node dg-node--out', icon: 'chart-line', iconColor: '#34d399' });
    s += edge(k, 200, 90, 300, 90, { accent: true });
    s += edge(k, 385, 120, 385, 200, { accent: true });
    s += edge(k, 470, 230, 560, 230, { accent: true });
    s += `<text class="dg-sub" x="240" y="80" text-anchor="middle" font-size="10">source()</text>`;
    s += `<text class="dg-sub" x="412" y="165" text-anchor="start" font-size="10">ref()</text>`;
    return wrap(k, s, '0 0 760 300').replace('__CAP__', 'One source feeds the first model; ref() makes downstream models depend on it.');
  },

  /* ── seeds vs sources ────────────────────────────────────── */
  'seeds-sources'() {
    const k = 'seeds-sources';
    let s = defs(k);
    s += band(20, 30, 340, 120, 'seeds · small CSVs', '#f59e0b');
    s += band(400, 30, 340, 120, 'sources · raw tables', '#22d3ee');
    s += node({ x: 45, y: 70, w: 130, h: 52, title: 'country.csv', sub: 'versioned in git', icon: 'file-code', iconColor: '#fbbf24' });
    s += node({ x: 205, y: 70, w: 130, h: 52, title: 'country', sub: 'dbt seed', icon: 'table', iconColor: '#fbbf24' });
    s += node({ x: 425, y: 70, w: 140, h: 52, title: 'raw.customers', sub: 'loaded by EL', cls: 'dg-node dg-node--source', icon: 'database', iconColor: '#22d3ee' });
    s += node({ x: 595, y: 70, w: 120, h: 52, title: 'customers', sub: 'source()', cls: 'dg-node dg-node--source', icon: 'satellite', iconColor: '#22d3ee' });
    s += edge(k, 175, 96, 205, 96, { accent: true, marker: false });
    s += edge(k, 565, 96, 595, 96, { accent: true, marker: false });
    s += node({ x: 250, y: 235, w: 260, h: 56, title: 'models join both', sub: 'ref() + source()', icon: 'merge' });
    s += edge(k, 110, 122, 320, 235, { accent: true, d: 'M110,122 C110,200 200,235 320,235' });
    s += edge(k, 655, 122, 440, 235, { accent: true, d: 'M655,122 C655,200 560,235 440,235' });
    return wrap(k, s, '0 0 760 320').replace('__CAP__', 'Seeds are versioned CSVs dbt loads; sources are tables dbt merely observes.');
  },

  /* ── tests gate ──────────────────────────────────────────── */
  tests() {
    const k = 'tests';
    let s = defs(k);
    s += node({ x: 30, y: 120, w: 150, h: 64, title: 'stg_orders', sub: 'a model', icon: 'layers' });
    s += node({ x: 290, y: 45, w: 170, h: 46, title: 'unique(order_id)', sub: 'generic test', icon: 'circle-check', iconColor: '#34d399' });
    s += node({ x: 290, y: 120, w: 170, h: 46, title: 'not_null(id)', sub: 'generic test', icon: 'circle-check', iconColor: '#34d399' });
    s += node({ x: 290, y: 195, w: 170, h: 46, title: 'relationships(id)', sub: 'dbt_utils', icon: 'git-compare', iconColor: '#34d399' });
    s += node({ x: 580, y: 120, w: 150, h: 64, title: 'fct_orders', sub: 'trusted mart', cls: 'dg-node dg-node--out', icon: 'chart-column', iconColor: '#34d399' });
    s += edge(k, 180, 152, 290, 68, { d: 'M180,152 C230,152 240,68 290,68' });
    s += edge(k, 180, 152, 290, 143, { accent: true });
    s += edge(k, 180, 152, 290, 218, { d: 'M180,152 C230,152 240,218 290,218' });
    s += edge(k, 460, 143, 580, 152, { accent: true });
    s += `<text class="dg-sub" x="520" y="135" text-anchor="middle" font-size="10">all pass →</text>`;
    s += `<text class="dg-sub" x="520" y="180" text-anchor="middle" font-size="10" fill="#fb7185">fail → stop</text>`;
    return wrap(k, s, '0 0 760 280').replace('__CAP__', 'Tests guard each model: only passing data flows to the mart.');
  },

  /* ── materializations ────────────────────────────────────── */
  materializations() {
    const k = 'materializations';
    let s = defs(k);
    const cols = [
      { t: 'View', sub: 'no storage', note: 'always fresh', ic: 'eye', c: '#22d3ee' },
      { t: 'Table', sub: 'full rebuild', note: 'fast reads', ic: 'table', c: '#f59e0b' },
      { t: 'Incremental', sub: 'append/merge', note: 'big data', ic: 'refresh-cw', c: '#10b981' },
      { t: 'Ephemeral', sub: 'inlined CTE', note: 'reuse SQL', ic: 'component', c: '#a78bfa' },
    ];
    cols.forEach((c, i) => {
      const x = 20 + i * 185;
      s += node({ x, y: 60, w: 165, h: 58, title: c.t, sub: c.sub, cls: 'dg-node dg-node--accent', icon: c.ic, iconColor: c.c });
      s += `<rect x="${x + 20}" y="${140}" width="125" height="90" rx="10" fill="var(--bg-3)" stroke="var(--border-2)"/>`;
      s += `<text class="dg-sub" x="${x + 82}" y="188" text-anchor="middle" font-size="11" fill="${c.c}">${esc(c.note)}</text>`;
      s += `<g opacity=".85">${Array.from({ length: 4 }, (_, r) => `<rect x="${x + 40}" y="${152 + r * 18}" width="${85}" height="9" rx="4" fill="${c.c}" opacity="${0.25 + r * 0.16}"/>`).join('')}</g>`;
      s += `<text class="dg-sub" x="${x + 82}" y="272" text-anchor="middle" font-size="10">${i === 0 ? 'freshness' : i === 3 ? 'not persisted' : 'storage cost'}</text>`;
    });
    return wrap(k, s, '0 0 760 300').replace('__CAP__', 'Four ways to persist a model — each trades freshness, storage and speed.');
  },

  /* ── macros DRY ──────────────────────────────────────────── */
  macros() {
    const k = 'macros';
    let s = defs(k);
    s += node({ x: 40, y: 120, w: 220, h: 90, title: 'macro cents_to_dollars()', sub: 'macros/currency.sql', cls: 'dg-node dg-node--accent', icon: 'puzzle' });
    const outs = ['stg_orders', 'stg_payments', 'fct_sales'];
    outs.forEach((o, i) => {
      const y = 40 + i * 90;
      s += node({ x: 500, y, w: 200, h: 54, title: o, sub: 'uses the macro', icon: 'file-code', iconColor: 'var(--text-3)' });
      s += edge(k, 260, 165, 500, y + 27, { accent: true, d: `M260,165 C380,165 380,${y + 27} 500,${y + 27}` });
    });
    return wrap(k, s, '0 0 760 300').replace('__CAP__', 'Write the logic once as a macro and reuse it across every model.');
  },

  /* ── snapshot SCD2 ───────────────────────────────────────── */
  snapshot() {
    const k = 'snapshot';
    let s = defs(k);
    s += `<text class="dg-sub" x="40" y="30" font-size="12" fill="var(--accent)">customer C01 · region changes over time</text>`;
    s += node({ x: 30, y: 70, w: 210, h: 70, title: 'North America', sub: '2023-01-15 → 2024-03-01', cls: 'dg-node dg-node--accent', icon: 'compass' });
    s += node({ x: 300, y: 70, w: 210, h: 70, title: 'Europe', sub: '2024-03-01 → 9999-12-31', icon: 'satellite', iconColor: 'var(--text-3)' });
    s += edge(k, 240, 105, 300, 105, { accent: true });
    s += `<text class="dg-sub" x="270" y="95" text-anchor="middle" font-size="10">moves</text>`;
    s += `<g><rect x="540" y="70" width="190" height="70" rx="12" class="dg-chip"/><text class="dg-label" x="555" y="95">current = true</text><text class="dg-sub" x="555" y="118">for the active row</text></g>`;
    s += `<text class="dg-sub" x="40" y="185">Each snapshot run records a new version when tracked columns change.</text>`;
    s += node({ x: 30, y: 210, w: 700, h: 46, title: 'dbt_valid_from  ·  dbt_valid_to  ·  dbt_scd_id  ·  dbt_updated_at', sub: '', icon: 'history' });
    return wrap(k, s, '0 0 760 290').replace('__CAP__', 'Snapshots keep every version of a row so you can query history (SCD Type 2).');
  },

  /* ── CI/CD ───────────────────────────────────────────────── */
  cicd() {
    const k = 'cicd';
    let s = defs(k);
    const stages = [
      { t: 'Pull request', sub: 'code change', ic: 'git-pull-request', c: '#22d3ee' },
      { t: 'CI · lint+build+test', sub: 'on a clone schema', ic: 'circle-check', c: '#f59e0b' },
      { t: 'Merge to main', sub: 'artifact produced', ic: 'git-merge', c: '#a78bfa' },
      { t: 'CD · deploy', sub: 'dev → staging → prod', ic: 'rocket', c: '#10b981' },
    ];
    stages.forEach((st, i) => {
      const x = 20 + i * 185;
      s += node({ x, y: 110, w: 165, h: 80, title: st.t, sub: st.sub, cls: 'dg-node dg-node--accent', icon: st.ic, iconColor: st.c });
      if (i < stages.length - 1) s += edge(k, x + 165, 150, x + 185, 150, { accent: true });
    });
    s += node({ x: 20, y: 235, w: 720, h: 44, title: 'GitHub Actions workflow · .github/workflows/dbt.yml', sub: '', icon: 'workflow' });
    s += `<text class="dg-sub" x="380" y="60" text-anchor="middle">every push is verified before it ships</text>`;
    return wrap(k, s, '0 0 760 300').replace('__CAP__', 'CI verifies each pull request; CD promotes the built artifact to production.');
  },

  /* ── cache / state:modified ──────────────────────────────── */
  cache() {
    const k = 'cache';
    let s = defs(k);
    s += node({ x: 30, y: 130, w: 150, h: 56, title: 'raw_orders', sub: 'source', cls: 'dg-node dg-node--source', icon: 'database', iconColor: '#22d3ee' });
    s += node({ x: 250, y: 50, w: 160, h: 56, title: 'stg_orders', sub: 'modified ✎', cls: 'dg-node dg-node--accent', icon: 'layers' });
    s += node({ x: 250, y: 210, w: 160, h: 56, title: 'stg_customers', sub: 'unchanged', icon: 'layers', iconColor: 'var(--text-3)' });
    s += node({ x: 490, y: 130, w: 150, h: 56, title: 'fct_orders', sub: 'rebuild', cls: 'dg-node dg-node--accent', icon: 'chart-column' });
    s += node({ x: 660, y: 40, w: 80, h: 56, title: 'mart_a', sub: 'skip', icon: 'boxes', iconColor: 'var(--text-3)', centered: true });
    s += node({ x: 660, y: 220, w: 80, h: 56, title: 'mart_b', sub: 'skip', icon: 'boxes', iconColor: 'var(--text-3)', centered: true });
    s += edge(k, 180, 158, 250, 78, { accent: true, d: 'M180,158 C215,158 215,78 250,78' });
    s += edge(k, 180, 158, 250, 238, { d: 'M180,158 C215,158 215,238 250,238', dash: true });
    s += edge(k, 410, 78, 490, 158, { accent: true, d: 'M410,78 C450,78 450,158 490,158' });
    s += edge(k, 410, 238, 490, 158, { dash: true, d: 'M410,238 C450,238 450,158 490,158' });
    s += edge(k, 640, 158, 660, 68, { dash: true, d: 'M640,158 C660,158 650,68 660,68' });
    s += edge(k, 640, 158, 660, 248, { dash: true, d: 'M640,158 C660,158 650,248 660,248' });
    return wrap(k, s, '0 0 760 300').replace('__CAP__', 'dbt state tracks hashes: only modified models and their children rebuild.');
  },

  /* ── lineage to exposures ────────────────────────────────── */
  lineage() {
    const k = 'lineage';
    let s = defs(k);
    s += node({ x: 20, y: 130, w: 130, h: 56, title: 'jaffle.orders', sub: 'source', cls: 'dg-node dg-node--source', icon: 'database', iconColor: '#22d3ee' });
    s += node({ x: 200, y: 130, w: 130, h: 56, title: 'stg_orders', icon: 'layers' });
    s += node({ x: 380, y: 130, w: 130, h: 56, title: 'fct_orders', icon: 'chart-column' });
    s += node({ x: 560, y: 130, w: 180, h: 56, title: 'Revenue dashboard', sub: 'exposure', cls: 'dg-node dg-node--out', icon: 'chart-line', iconColor: '#34d399' });
    s += edge(k, 150, 158, 200, 158, { accent: true });
    s += edge(k, 330, 158, 380, 158, { accent: true });
    s += edge(k, 510, 158, 560, 158, { accent: true });
    s += `<text class="dg-sub" x="380" y="250" text-anchor="middle">docs + lineage let anyone trace a metric back to its source</text>`;
    return wrap(k, s, '0 0 760 290').replace('__CAP__', 'Exposures connect models to the dashboards and metrics that depend on them.');
  },

  /* ── partitioning ────────────────────────────────────────── */
  partition() {
    const k = 'partition';
    let s = defs(k);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    months.forEach((mo, i) => {
      const x = 40 + i * 115;
      const hot = mo === 'Mar';
      s += `<g><rect x="${x}" y="70" width="95" height="150" rx="10" fill="${hot ? 'var(--accent-soft)' : 'var(--bg-3)'}" stroke="${hot ? 'var(--accent)' : 'var(--border-2)'}" stroke-width="${hot ? 2 : 1.2}"/>
      <text class="dg-label" x="${x + 47}" y="100" text-anchor="middle">${mo}</text>
      ${Array.from({ length: 5 }, (_, r) => `<rect x="${x + 15}" y="${118 + r * 18}" width="65" height="10" rx="4" fill="${hot ? 'var(--accent)' : 'var(--border-2)'}" opacity="${hot ? 0.8 : 0.55}"/>`).join('')}
      <text class="dg-sub" x="${x + 47}" y="238" text-anchor="middle" font-size="10">${hot ? 'scanned' : 'pruned'}</text></g>`;
    });
    s += `<text class="dg-sub" x="380" y="40" text-anchor="middle" font-size="12" fill="var(--accent)">WHERE order_date >= '2024-03-01'  →  only the March partition is read</text>`;
    return wrap(k, s, '0 0 760 270').replace('__CAP__', 'Partition pruning reads only the slices a query needs — far less I/O.');
  },

  /* ── environments / promotion ────────────────────────────── */
  environments() {
    const k = 'environments';
    let s = defs(k);
    const envs = [
      { t: 'dev', sub: 'dbt_dev schema', c: '#22d3ee' },
      { t: 'staging', sub: 'QA + tests', c: '#f59e0b' },
      { t: 'production', sub: 'serving layer', c: '#10b981' },
    ];
    envs.forEach((e, i) => {
      const x = 40 + i * 250;
      s += node({ x, y: 120, w: 190, h: 90, title: e.t, sub: e.sub, cls: 'dg-node dg-node--accent', icon: 'server', iconColor: e.c });
      if (i < 2) s += edge(k, x + 190, 165, x + 250, 165, { accent: true });
    });
    s += node({ x: 290, y: 40, w: 180, h: 40, title: 'artifact (manifest)', sub: '', icon: 'package-open', cls: 'dg-node dg-node--source', iconColor: '#22d3ee' });
    s += edge(k, 380, 80, 380, 120, { accent: true });
    s += `<text class="dg-sub" x="380" y="250" text-anchor="middle">same build promoted · prod gated by approval · rollback = redeploy previous artifact</text>`;
    return wrap(k, s, '0 0 760 280').replace('__CAP__', 'Build once, promote the artifact through dev → staging → production.');
  },

  /* ── marts / star schema ─────────────────────────────────── */
  marts() {
    const k = 'marts';
    let s = defs(k);
    s += node({ x: 320, y: 130, w: 140, h: 80, title: 'fct_sales', sub: 'grain: order line', cls: 'dg-node dg-node--accent', icon: 'boxes', centered: true });
    const dims = [
      { x: 40, y: 40, t: 'dim_customers', ic: 'database' },
      { x: 580, y: 40, t: 'dim_products', ic: 'box' },
      { x: 40, y: 230, t: 'dim_dates', ic: 'calendar' },
      { x: 580, y: 230, t: 'dim_regions', ic: 'compass' },
    ];
    dims.forEach((d) => {
      s += node({ x: d.x, y: d.y, w: 150, h: 52, title: d.t, sub: '', icon: d.ic, iconColor: 'var(--text-3)' });
      const cx = d.x + 75, cy = d.y + 26;
      s += edge(k, cx, cy, 390, 170, { accent: true, dash: true, d: `M${cx},${cy} L${cx < 380 ? 320 : 460},${170} L${cx < 380 ? 320 : 460},170` });
    });
    s += `<text class="dg-sub" x="380" y="320" text-anchor="middle" font-size="11">one fact table + surrounding dimensions = a star schema</text>`;
    return wrap(k, s, '0 0 760 340').replace('__CAP__', 'Marts are modeled as star schemas: a fact table surrounded by dimensions.');
  },
};

export function diagram(key, caption) {
  const fn = D[key];
  if (!fn) return '';
  const html = fn();
  return caption ? html.replace('__CAP__', esc(caption)) : html.replace('__CAP__', '');
}
export const DIAGRAM_KEYS = Object.keys(D);
