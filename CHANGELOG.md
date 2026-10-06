# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-10-06

The site was rebuilt from scratch as a generated, visual, offline-capable guide.

### Added
- Static site generator: `data/topics.mjs` (single source of truth),
  `templates/layout.mjs`, `templates/diagrams.mjs`, `tools/build.mjs`.
- 15 hand-authored, theme-aware inline SVG diagrams; no ASCII diagrams.
- Design system (`css/style.css`): dark "data-lab" theme + light toggle, per-level
  accents, callouts, cards, steps, tabs, tables, try-it boxes, quizzes, timeline,
  accordion, pager.
- Runtime enhancements (`assets/js/app.js`): theme persistence, progress tracking,
  copy buttons, TOC scrollspy, search palette, quizzes, mobile nav.
- Offline assets vendored from npm: Inter, JetBrains Mono, Prism, Lucide sprite.
- Integrity checker (`tools/check.mjs`): links, anchors, icons, duplicate ids,
  unresolved placeholders.
- Repo hygiene: README, LICENSE, CONTRIBUTING, CHANGELOG, third-party
  licenses, `.editorconfig`, `.gitattributes`, `.nvmrc`, issue/PR templates.
- GitHub Pages deployment: staging script (`tools/stage.mjs`), `.nojekyll`,
  canonical/og:url/absolute sitemap, and Actions workflows (`ci`, `pages`).

### Changed
- All 21 topic pages rewritten with diagrams, runnable examples and corrected
  dbt accuracy (e.g. user-written `is_incremental()` filters, `dbt init` nesting,
  DuckDB `profiles.yml`).
- Dual licensing: tutorial content is CC BY-NC-ND 4.0 (attribution,
  non-commercial, no derivatives); the build and site code is MIT. Plain-language
  reuse terms added.

### Removed
- 23 duplicated inline `<style>` blocks and the legacy `js/`, `images/`,
  `assets/css/` directories.
