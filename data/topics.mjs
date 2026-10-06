// ─────────────────────────────────────────────────────────────
//  dbt Complete Tutorial — single source of truth
//  Consumed by tools/build.mjs (Node) and emitted to the browser
//  as assets/js/topics.js. Edit here, never in generated pages.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'dbt Complete Tutorial',
  shortName: 'dbt Tutorial',
  tagline: 'From absolute beginner to expert — SQL-only analytics engineering, made visual.',
  description:
    'A visual, hands-on guide to dbt: models, sources, tests, macros, snapshots, incremental builds, CI/CD and production patterns. Built with DuckDB.',
  warehouse: 'DuckDB',
  repo: 'https://github.com/dbt-labs/dbt-core',
  version: 'dbt 1.8+',
  accent: '#3b82f6',
  // Absolute base URL of the deployed site — drives <link rel="canonical">,
  // og:url, absolute og:image and sitemap.xml. Override at build time with
  // SITE_URL=… (the GitHub Pages workflow sets it from the Pages URL).
  url: (process.env.SITE_URL || 'https://your-username.github.io/dbt-guide-tutorial').replace(/\/+$/, ''),
};

export const LEVELS = [
  {
    key: 'beginner',
    name: 'Beginner',
    label: 'Foundations',
    icon: 'rocket',
    emoji: '🚀',
    accent: '#10b981',
    accent2: '#059669',
    summary: 'What dbt is, why it exists, how to install it, and your first model.',
    blurb:
      'Start here if dbt is new to you. No prior data-engineering background needed — just curiosity and a terminal.',
    time: '~2.5 h',
    diagram: 'pipeline',
  },
  {
    key: 'intermediate',
    name: 'Intermediate',
    label: 'Level Up',
    icon: 'wrench',
    emoji: '🔧',
    accent: '#f59e0b',
    accent2: '#d97706',
    summary: 'Materializations, macros, snapshots, testing and performance.',
    blurb:
      'You can build models. Now learn to build smart ones: incremental data, reusable Jinja, history tracking and tests.',
    time: '~4 h',
    diagram: 'materializations',
  },
  {
    key: 'advanced',
    name: 'Advanced',
    label: 'Go Deep',
    icon: 'flame',
    emoji: '🔥',
    accent: '#ef4444',
    accent2: '#dc2626',
    summary: 'Source contracts, macro engineering and CI/CD at scale.',
    blurb:
      'Production patterns: source freshness and contracts, advanced Jinja, and automated pipelines with GitHub Actions.',
    time: '~3 h',
    diagram: 'cicd',
  },
  {
    key: 'expert',
    name: 'Expert',
    label: 'Master Class',
    icon: 'crown',
    emoji: '👑',
    accent: '#7c3aed',
    accent2: '#6d28d9',
    summary: 'Custom materializations, multi-env deploys and expert optimization.',
    blurb:
      'Build dbt itself: custom materializations, promotion workflows, partition strategy and the patterns teams standardize on.',
    time: '~3.5 h',
    diagram: 'marts',
  },
];

// num = display order within a level, slug = filename stem, time = minutes
export const TOPICS = [
  // ── Beginner ──────────────────────────────────────────────
  {
    level: 'beginner', num: 1, slug: '1-intro',
    title: 'What is dbt? Why use it?',
    nav: 'What is dbt?',
    icon: 'compass', emoji: '🧭', time: 15,
    lede: 'Meet the tool that turns raw SQL files into a tested, documented, version-controlled data pipeline.',
    tags: ['concepts', 'analytics-engineering'],
    diagram: 'pipeline',
    skills: ['Explain the transformation layer', 'Read a dbt project DAG', 'Tell dbt apart from ELT tools'],
  },
  {
    level: 'beginner', num: 2, slug: '2-installation',
    title: 'Setup & Installation',
    nav: 'Setup & Installation',
    icon: 'package', emoji: '🧰', time: 30,
    lede: 'Install dbt-core with the DuckDB adapter on Linux or Windows and wire up your first profile.',
    tags: ['setup', 'duckdb', 'profiles'],
    diagram: 'install',
    skills: ['Install dbt + DuckDB', 'Write profiles.yml', 'Run dbt debug successfully'],
  },
  {
    level: 'beginner', num: 3, slug: '3-core-concepts',
    title: 'Core Concepts: Models, Sources & Seeds',
    nav: 'Core Concepts',
    icon: 'blocks', emoji: '🧱', time: 25,
    lede: 'The four building blocks of every dbt project — and how ref() stitches them into a DAG.',
    tags: ['models', 'sources', 'seeds', 'ref'],
    diagram: 'layers',
    skills: ['Distinguish model vs source vs seed', 'Use ref() and source()', 'Understand the DAG'],
  },
  {
    level: 'beginner', num: 4, slug: '4-your-first-model',
    title: 'Your First dbt Model',
    nav: 'Your First Model',
    icon: 'hammer', emoji: '🔨', time: 30,
    lede: 'Write, compile and run a real model against sample e-commerce data, then inspect the result.',
    tags: ['models', 'sql', 'duckdb'],
    diagram: 'first-model',
    skills: ['Create a .sql model', 'Use dbt run/compile', 'Read compiled SQL'],
  },
  {
    level: 'beginner', num: 5, slug: '5-seeds-and-sources',
    title: 'Seeds & Sources Explained',
    nav: 'Seeds & Sources',
    icon: 'sprout', emoji: '🌱', time: 20,
    lede: 'Load small reference CSVs with seeds and register raw warehouse tables with sources.',
    tags: ['seeds', 'sources', 'csv'],
    diagram: 'seeds-sources',
    skills: ['Load a seed CSV', 'Declare a source', 'Check source freshness'],
  },
  {
    level: 'beginner', num: 6, slug: '6-basic-tests',
    title: 'Basic Tests (NOT NULL, UNIQUE)',
    nav: 'Basic Tests',
    icon: 'check', emoji: '✅', time: 15,
    lede: 'Catch dirty data before it reaches a dashboard with dbt’s built-in generic tests.',
    tags: ['tests', 'data-quality'],
    diagram: 'tests',
    skills: ['Add not_null & unique tests', 'Run dbt test', 'Interpret test failures'],
  },

  // ── Intermediate ───────────────────────────────────────────
  {
    level: 'intermediate', num: 1, slug: '1-concepts',
    title: 'Materializations: View, Table & Incremental',
    nav: 'Materializations',
    icon: 'box', emoji: '🧊', time: 20,
    lede: 'Choose how dbt persists each model — and understand the freshness, cost and performance trade-offs.',
    tags: ['materializations', 'incremental', 'performance'],
    diagram: 'materializations',
    skills: ['Pick a materialization', 'Write an incremental filter', 'Reason about cost vs freshness'],
  },
  {
    level: 'intermediate', num: 2, slug: '2-macros-jinja',
    title: 'Macros & Jinja Templating',
    nav: 'Macros & Jinja',
    icon: 'puzzle', emoji: '🧩', time: 35,
    lede: 'Stop copy-pasting SQL. Write reusable functions with Jinja macros and control flow.',
    tags: ['jinja', 'macros', 'dry'],
    diagram: 'macros',
    skills: ['Write a macro', 'Use loops & conditionals', 'Access project vars'],
  },
  {
    level: 'intermediate', num: 3, slug: '3-tests-refine',
    title: 'Refining Tests with dbt_utils',
    nav: 'Tests with dbt_utils',
    icon: 'flask-conical', emoji: '🧪', time: 15,
    lede: 'Go beyond not_null and unique with relationships, accepted_values and dbt_utils power tests.',
    tags: ['tests', 'dbt_utils', 'data-quality'],
    diagram: 'tests',
    skills: ['Test relationships', 'Use accepted_values', 'Install a dbt package'],
  },
  {
    level: 'intermediate', num: 4, slug: '4-snapshots',
    title: 'Snapshots for SCD Type 2',
    nav: 'Snapshots (SCD2)',
    icon: 'history', emoji: '⏱️', time: 20,
    lede: 'Record history automatically. Snapshot a mutable table and query how each row changed over time.',
    tags: ['snapshots', 'scd2', 'history'],
    diagram: 'snapshot',
    skills: ['Configure a snapshot', 'Choose timestamp vs check strategy', 'Query validity windows'],
  },
  {
    level: 'intermediate', num: 5, slug: '5-ci-cd',
    title: 'CI/CD Pipelines Overview',
    nav: 'CI/CD Overview',
    icon: 'refresh-cw', emoji: '🔄', time: 15,
    lede: 'The ideas behind continuous integration and delivery for data: what runs, when, and why.',
    tags: ['ci-cd', 'automation', 'github-actions'],
    diagram: 'cicd',
    skills: ['Describe a CI/CD flow', 'Separate build from deploy', 'Trigger dbt on a schedule'],
  },
  {
    level: 'intermediate', num: 6, slug: '6-performance',
    title: 'Query Optimization & Caching',
    nav: 'Performance & Caching',
    icon: 'zap', emoji: '⚡', time: 20,
    lede: 'dbt only rebuilds what changed. Learn the DAG state, incremental builds and cheaper queries.',
    tags: ['performance', 'caching', 'incremental'],
    diagram: 'cache',
    skills: ['Use state:modified', 'Explain dbt caching', 'Reduce scanned bytes'],
  },
  {
    level: 'intermediate', num: 7, slug: '7-exposures',
    title: 'Exposures: Tracking Business Metrics',
    nav: 'Exposures',
    icon: 'chart-line', emoji: '📈', time: 15,
    lede: 'Connect your models to the dashboards and metrics that depend on them — closing the lineage loop.',
    tags: ['exposures', 'lineage', 'docs'],
    diagram: 'lineage',
    skills: ['Declare an exposure', 'Map model → dashboard', 'Read the lineage graph'],
  },

  // ── Advanced ───────────────────────────────────────────────
  {
    level: 'advanced', num: 1, slug: '1-sources',
    title: 'Source Discovery & Lineage',
    nav: 'Sources & Lineage',
    icon: 'satellite', emoji: '📡', time: 30,
    lede: 'Make raw tables first-class citizens with freshness checks, source tests and end-to-end lineage.',
    tags: ['sources', 'freshness', 'lineage', 'contracts'],
    diagram: 'lineage',
    skills: ['Add source freshness', 'Test sources', 'Enforce source contracts'],
  },
  {
    level: 'advanced', num: 2, slug: '2-macros-advanced',
    title: 'Advanced Macro Patterns',
    nav: 'Advanced Macros',
    icon: 'cog', emoji: '⚙️', time: 25,
    lede: 'Dispatch, adapter-aware SQL, run_query and packaging macros into installable dbt packages.',
    tags: ['jinja', 'macros', 'packages', 'adapters'],
    diagram: 'macros',
    skills: ['Use adapter.dispatch', 'Query the warehouse in Jinja', 'Package a macro'],
  },
  {
    level: 'advanced', num: 3, slug: '3-ci-cd-github-actions',
    title: 'CI/CD with GitHub Actions',
    nav: 'GitHub Actions',
    icon: 'bot', emoji: '🤖', time: 20,
    lede: 'A real workflow file: lint, build on a clone, run tests on every pull request, deploy on merge.',
    tags: ['ci-cd', 'github-actions', 'yaml'],
    diagram: 'cicd',
    skills: ['Write a dbt CI workflow', 'Use a CI schema', 'Comment results on a PR'],
  },
  {
    level: 'advanced', num: 4, slug: '4-performance-optimization',
    title: 'Performance Tuning at Scale',
    nav: 'Performance at Scale',
    icon: 'gauge', emoji: '🏎️', time: 15,
    lede: 'Partitioning, clustering, incremental strategy and threading for datasets in the tens of millions.',
    tags: ['performance', 'partitions', 'incremental'],
    diagram: 'partition',
    skills: ['Partition large models', 'Pick an incremental strategy', 'Tune threads & concurrency'],
  },

  // ── Expert ─────────────────────────────────────────────────
  {
    level: 'expert', num: 1, slug: '1-materializations',
    title: 'Custom Materializations & Build Hooks',
    nav: 'Custom Materializations',
    icon: 'dna', emoji: '🧬', time: 30,
    lede: 'Write your own materialization and hook into dbt’s lifecycle for logic the built-ins can’t express.',
    tags: ['materializations', 'python', 'hooks'],
    diagram: 'materializations',
    skills: ['Author a materialization', 'Use pre/post hooks', 'Wire up on-run-end'],
  },
  {
    level: 'expert', num: 2, slug: '2-ci-cd-deploy',
    title: 'CI/CD Deployment Pipelines',
    nav: 'Deployment Pipelines',
    icon: 'rocket', emoji: '🚀', time: 25,
    lede: 'Promote the same artifacts from dev → staging → production with approvals and safe rollback.',
    tags: ['ci-cd', 'deployment', 'environments'],
    diagram: 'environments',
    skills: ['Promote artifacts', 'Gate prod with approvals', 'Roll back safely'],
  },
  {
    level: 'expert', num: 3, slug: '3-performance-expert',
    title: 'Expert-Level Query Optimization',
    nav: 'Expert Optimization',
    icon: 'sliders-horizontal', emoji: '🎛️', time: 30,
    lede: 'Partition pruning, materialized caches, micro-batching and reading the query plan like a DBA.',
    tags: ['performance', 'query-plan', 'partitions'],
    diagram: 'partition',
    skills: ['Read a query plan', 'Prune partitions', 'Design a caching layer'],
  },
  {
    level: 'expert', num: 4, slug: '4-best-practices',
    title: 'Best Practices & Patterns',
    nav: 'Best Practices',
    icon: 'landmark', emoji: '🏛️', time: 20,
    lede: 'Naming, project layout, code review and the team conventions that keep a warehouse trustworthy.',
    tags: ['best-practices', 'naming', 'team'],
    diagram: 'marts',
    skills: ['Structure staging → marts', 'Apply naming conventions', 'Run an effective model review'],
  },
];

export const levelByKey = Object.fromEntries(LEVELS.map((l) => [l.key, l]));
export const topicsByLevel = Object.fromEntries(
  LEVELS.map((l) => [l.key, TOPICS.filter((t) => t.level === l.key).sort((a, b) => a.num - b.num)]),
);
export const allTopics = TOPICS;
export function topicPath(t) { return `${t.level}/${t.slug}.html`; }
export function levelIndexPath(l) { return `${l.key}/index.html`; }
export const TOTAL_TOPICS = TOPICS.length;
export const TOTAL_MINUTES = TOPICS.reduce((s, t) => s + t.time, 0);
