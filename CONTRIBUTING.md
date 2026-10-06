# Contributing

Thanks for helping improve the tutorial. This project is a static site generated
from data + HTML fragments — please read [`docs/AUTHORING.md`](docs/AUTHORING.md)
before writing content.

## Quick start

```bash
npm install        # once
npm run serve      # preview at http://localhost:8000 (in another terminal)
npm run verify     # build + integrity checks — must pass before a PR
```

## What to edit

| Change | Edit | Never edit |
|--------|------|------------|
| Page prose | `content/<level>/<slug>.html` | the generated `<level>/<slug>.html` |
| Site/nav metadata, add a topic | `data/topics.mjs` | `assets/js/topics.js` (generated) |
| Layout, head, footer, pager | `templates/layout.mjs` | any built HTML |
| Diagrams | `templates/diagrams.mjs` | — |
| Styling | `css/style.css` | — |
| Runtime behaviour | `assets/js/app.js` | — |

Generated HTML is committed so the site works with no build. After editing
anything above, run `npm run verify` and commit the regenerated files in the
same change.

## Ground rules

- **Accuracy first.** The content targets dbt 1.8+ on DuckDB. Don't invent dbt
  features; where behaviour is adapter- or version-specific, say so. See the
  accuracy rules in `docs/AUTHORING.md`.
- **Use the components.** Follow the class inventory in `docs/AUTHORING.md`; avoid
  inline styles.
- **Every topic page** ends with a "Key takeaways" checklist, one quiz, and an
  "Up next" callout.
- **No ASCII diagrams** — use `{{diagram:key}}`.

## Commit & PR

1. Branch from `main`.
2. Keep changes scoped; regenerate the site in the same commit.
3. Ensure `npm run verify` passes.
4. Open a PR describing what changed and why. The CI workflow runs the same check.

## Reporting issues

Use the issue templates. For content corrections, quote the page and the exact
sentence, and cite the dbt/DuckDB docs that support the fix.

## License

The project is dual-licensed: tutorial **content** is
[CC BY-NC-ND 4.0](LICENSE-CONTENT) and **code** is [MIT](LICENSE-CODE) — see
[LICENSE](LICENSE). By contributing you agree your change is released under the
license that covers the part you edit (content or code), and you confirm you wrote
it or have the right to submit it.
