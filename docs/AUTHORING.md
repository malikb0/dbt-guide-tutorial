# Authoring a topic page

You are writing **one HTML content fragment per topic page**. The build system
(`node tools/build.mjs`) wraps fragments with the shared shell (head, header,
hero, table-of-contents, pager, footer). Your job is ONLY the body prose.

## Output
- Write to `content/<level>/<slug>.html`.
- Output plain HTML — **no** `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, `<h1>`,
  nav, footer, hero, `<script>`, or `<style>`.
- Start with `<p class="lead">…</p>`, then `<h2>` sections.
- The page `<h1>` and the page lede already exist in the hero — do NOT repeat them.
- `<h2>`/`<h3>` (only levels 2 and 3) are auto-numbered with ids and anchors by
  the build. Use them for structure; the TOC is built from them.

## Read these first
- `content/beginner/1-intro.html` — the reference page. Match its quality, tone
  and component usage.
- `css/style.css` — the component inventory (classes below).
- `data/topics.mjs` — the page's title, lede, tags, skills and icon. Keep the body
  consistent with the metadata already declared there.

## Voice
Clear, confident, plain English. Explain *why* before *how*. Use concrete
e-commerce examples (customers, orders, products). Short paragraphs. No filler.
Do not invent dbt features. No emoji inside headings (the UI uses line icons).

## Accuracy rules (IMPORTANT — the old pages got these wrong)
- Incremental models: dbt does **not** auto-add `WHERE order_date > MAX(...)`.
  The user must write `{% if is_incremental() %} where order_date > (select max(order_date) from {{ this }}) {% endif %}`.
- Never reference a model with a bare table name — always `{{ ref('name') }}`.
  Sources use `{{ source('src','table') }}`.
- `dbt init <name>` creates a NEW folder named `<name>`; don't `mkdir` the same
  name first.
- DuckDB requires a `profiles.yml` with `type: duckdb` and a `path:` to a
  `.duckdb` file — show it.
- `dbt test` runs tests; generic tests are `not_null`, `unique`, `accepted_values`,
  `relationships`. Advanced ones come from `dbt_utils`.
- Snapshots are configured in a `.sql` file with `{% snapshot name %} … {% endsnapshot %}`,
  strategy `timestamp` or `check`, and add `dbt_valid_from`, `dbt_valid_to`, `dbt_scd_id`.
- Packages are installed by adding to `packages.yml` then running `dbt deps`.
- `dbt build` = run + test + snapshot + seed in DAG order. Mention exact CLI flags.

## Components (use these classes — do NOT add inline styles)

Callout:
```html
<div class="callout callout--tip|--info|--warning|--danger|--concept|--story">
  <div class="callout__icon">{{icon:lightbulb}}</div>
  <div><div class="callout__title">Title</div><p>Body text.</p></div>
</div>
```

Cards (auto-fit grid; add `reveal` for entrance animation):
```html
<div class="cards">
  <div class="card reveal"><div class="card__icon">{{icon:database}}</div>
    <div class="card__title">Title</div><p class="card__text">Text.</p></div>
</div>
```

Steps (numbered vertical stepper):
```html
<div class="steps">
  <div class="step reveal"><div class="step__marker">1</div>
    <div><div class="step__title">Step title</div><p class="step__body">Details.</p></div></div>
</div>
```

Flow (horizontal node chain — replaces ASCII arrows):
```html
<div class="flow">
  <span class="flow__node">{{icon:satellite}}Sources</span>
  <span class="flow__arrow">{{icon:arrow-right}}</span>
  <span class="flow__node">{{icon:layers}}Models</span>
</div>
```

Tabs (JS-free fallback works; app.js enhances):
```html
<div class="tabs">
  <div class="tabs__list" role="tablist">
    <button class="tab" type="button" aria-selected="true">View</button>
    <button class="tab" type="button">Table</button>
  </div>
  <div class="tabs__panel"><p>…</p></div>
  <div class="tabs__panel"><p>…</p></div>
</div>
```

Table (always wrap; use `table--compare` for comparison, `table--zebra` for long lists;
highlight a row with `class="highlight"`):
```html
<div class="table-wrap"><table class="table--compare">
  <thead><tr><th>A</th><th>B</th></tr></thead>
  <tbody><tr><td>x</td><td>y</td></tr></tbody>
</table></div>
```
Cell colors: `class="cell-good"`, `cell-bad`, `cell-ok`.

Code block (EXACT structure):
```html
<div class="codeblock">
  <div class="codeblock__bar">
    <span class="codeblock__dots"><i></i><i></i><i></i></span>
    <span class="codeblock__file">models/example.sql</span>
    <span class="codeblock__lang">sql</span>
    <button class="codeblock__copy" type="button">{{icon:copy}} <span data-copylabel>Copy</span></button>
  </div>
  <pre><code class="language-sql">select 1 as id</code></pre>
</div>
```
Language classes: `language-sql`, `language-bash`, `language-yaml`, `language-json`,
`language-powershell`, `language-markup`. For CSV/plain, use no language class.
Inside `<code>`, escape only `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`.
Jinja `{{ … }}` and `{% … %}` are safe to write literally.

Checklist:
```html
<ul class="checklist">
  <li>{{icon:circle-check}}<span>Point</span></li>
</ul>
```
Use `class="checklist checklist--x"` for anti-patterns.

Pros/cons:
```html
<div class="pros-cons">
  <div class="pc pc--pros"><div class="pc__title">{{icon:circle-check}} Pros</div><ul><li>…</li></ul></div>
  <div class="pc pc--cons"><div class="pc__title">{{icon:circle-x}} Cons</div><ul><li>…</li></ul></div>
</div>
```

Try-it box:
```html
<div class="tryit"><div class="tryit__head">{{icon:terminal}} Try it<span class="kbd">terminal</span></div>
  <div class="tryit__body"><div class="codeblock">…</div><p>Expected output…</p></div></div>
```

Split (text + visual side by side):
```html
<div class="split"><div class="split__body stack">…</div><div class="split__visual">…</div></div>
```
Add `split--rev` to flip.

Timeline:
```html
<div class="timeline"><div class="tl-item"><div class="tl-item__time">T+0</div><strong>Title</strong><p>…</p></div></div>
```

Stat grid / metrics:
```html
<div class="stat-grid">
  <div class="stat"><div class="stat__value">2×</div><div class="stat__label">faster reads</div></div>
</div>
```

Accordion (native details, useful for pitfalls/FAQ):
```html
<div class="accordion">
  <details class="acc"><summary>Question?</summary><div class="acc__body"><p>Answer.</p></div></details>
</div>
```

Quiz (put ONE at the end of every page):
```html
<div class="quiz" data-explain="Explanation shown after answering.">
  <div class="quiz__q">{{icon:circle-help}} <span>Question?</span></div>
  <div class="quiz__options">
    <button class="quiz__option" type="button"><span class="mark">A</span><span>Wrong</span></button>
    <button class="quiz__option" type="button" data-correct="true"><span class="mark">B</span><span>Right</span></button>
  </div>
  <div class="quiz__feedback"></div>
</div>
```

Badges/chips/kbd: `<span class="badge badge--beginner|--intermediate|--advanced|--expert|--brand">…</span>`,
`<span class="chip">{{icon:tag}}</span>` (no `tag` icon — use `table-properties`), `<span class="kbd">Ctrl K</span>`.
Inline code: `<code>…</code>`. Utilities: `.lead`, `.muted`, `.accent-text`, `.center`,
`.stack`, `.grid-2`, `.mt-2`, `.mt-3`, `.reveal`.

## Diagrams — place inline with a placeholder
`{{diagram:KEY|caption text}}` (caption optional). Available keys:
`pipeline`, `install`, `layers`, `first-model`, `seeds-sources`, `tests`,
`materializations`, `macros`, `snapshot`, `cicd`, `cache`, `lineage`,
`partition`, `environments`, `marts`.
Use 2–4 diagrams per page. Do not draw ASCII diagrams.

## Icons — inline with `{{icon:NAME}}`
Available: rocket, wrench, flame, crown, compass, package, blocks, hammer, sprout,
circle-check, box, puzzle, flask-conical, history, refresh-cw, zap, chart-line,
satellite, settings, bot, gauge, dna, sliders-horizontal, landmark, sun, moon,
search, menu, x, arrow-left, arrow-right, copy, check, info, triangle-alert,
lightbulb, book-open, layers, terminal, external-link, chevron-down, chevron-right,
circle-help, sparkles, database, table, git-branch, play, list-checks, target,
graduation-cap, route, circle-dot, clock, star, shield-check, workflow, rows-3,
columns-3, file-code, plug, key, filter, calendar, message-square, quote,
book-marked, boxes, package-open, database-zap, file-json, server, cog,
git-pull-request, circle-play, chart-column, waypoints, network, split, merge,
timer, git-merge, circle-x, lock, eye, sigma, percent, wand-sparkles, microscope,
git-compare, file-check, table-properties, braces, binary, scan-line, list-tree,
folder-tree, square-stack, component, pickaxe, trophy, medal, award.

## Every page must end with
1. `<h2>Key takeaways</h2>` + `<ul class="checklist">…</ul>` (4–6 points).
2. A `.quiz`.
3. A `.callout--tip` "Up next" linking to the next topic (or the level hub if last).

## Length & quality
Aim for a thorough lesson: roughly 6–10 `<h2>` sections, 2–4 diagrams, 2–4 code
blocks, at least one table, at least one callout, one try-it or tabs/steps, one
quiz. Quality over volume — every section should teach something specific.

## Before you finish
Run `npm run verify` (build + integrity check). It fails on broken links, unknown
icons, unknown diagram keys, duplicate ids and leftover `{{…}}` placeholders.
