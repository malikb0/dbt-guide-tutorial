/* ═══════════════════════════════════════════════════════════════════════
   dbt Complete Tutorial — client runtime
   Progressive enhancement only: the site works without JS.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const DATA = window.DBTT_DATA || { SITE: {}, LEVELS: [], TOPICS: [] };
  const PROGRESS_KEY = 'dbt-tutorial-progress';
  const THEME_KEY = 'dbt-theme';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ── Theme ───────────────────────────────────────────────── */
  function initTheme() {
    const root = document.documentElement;
    const set = (t) => { root.dataset.theme = t; $$('.theme-toggle').forEach((b) => {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      const sun = b.querySelector('[data-icon="sun"]'), moon = b.querySelector('[data-icon="moon"]');
      if (sun && moon) { sun.style.display = t === 'dark' ? '' : 'none'; moon.style.display = t === 'dark' ? 'none' : ''; }
    }); };
    $$('.theme-toggle').forEach((b) => b.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      set(next);
    }));
    set(root.dataset.theme || 'dark');
  }

  /* ── Progress storage ────────────────────────────────────── */
  const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch (e) { return {}; } };
  const saveProgress = (p) => { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch (e) {} };
  const keyOf = (t) => `${t.level}/${t.slug}`;
  const isDone = (t) => !!getProgress()[keyOf(t)];
  function setDone(t, done) {
    const p = getProgress(); if (done) p[keyOf(t)] = true; else delete p[keyOf(t)];
    saveProgress(p); refreshProgressUI();
  }
  const TOTAL = DATA.TOPICS.length || 1;
  const doneCount = () => DATA.TOPICS.filter(isDone).length;

  function currentTopic() {
    const parts = location.pathname.split('/').filter(Boolean);
    let file = parts.pop() || 'index.html';
    if (!file.endsWith('.html')) return null;
    const slug = file.replace(/\.html$/, '');
    const level = parts.pop();
    return DATA.TOPICS.find((t) => t.level === level && t.slug === slug) || null;
  }

  function refreshProgressUI() {
    const done = doneCount();
    const pct = Math.round((done / TOTAL) * 100);
    // header ring
    const ring = $('.progress-ring');
    if (ring) {
      const C = 2 * Math.PI * 16;
      const bar = ring.querySelector('.bar');
      if (bar) { bar.style.strokeDasharray = String(C); bar.style.strokeDashoffset = String(C * (1 - done / TOTAL)); }
      const label = ring.querySelector('.pct'); if (label) label.textContent = pct + '%';
      ring.setAttribute('title', `${done} of ${TOTAL} topics complete`);
    }
    // toc progress
    const tocBar = $('.toc__progress .bar > span');
    if (tocBar) tocBar.style.width = pct + '%';
    const tocLabel = $('.toc__progress .count'); if (tocLabel) tocLabel.textContent = `${done}/${TOTAL}`;
    // level cards
    $$('.level-card').forEach((card) => {
      const key = card.dataset.level;
      const items = DATA.TOPICS.filter((t) => t.level === key);
      const d = items.filter(isDone).length;
      const bar = card.querySelector('.level-card__bar > span'); if (bar) bar.style.width = (items.length ? (d / items.length) * 100 : 0) + '%';
      const count = card.querySelector('[data-count]'); if (count) count.textContent = `${d}/${items.length} topics`;
    });
    // topic rows
    DATA.TOPICS.forEach((t) => {
      const row = $(`.topic-row[data-key="${keyOf(t)}"]`);
      if (row) row.classList.toggle('is-done', isDone(t));
    });
    // mark-done buttons
    $$('.markdone').forEach((b) => {
      const t = DATA.TOPICS.find((x) => keyOf(x) === b.dataset.key); if (!t) return;
      const done = isDone(t); b.dataset.done = String(done);
      const label = b.querySelector('[data-label]'); if (label) label.textContent = done ? 'Completed' : 'Mark as complete';
    });
  }

  function initProgress() {
    const t = currentTopic();
    if (t) {
      setDone(t, true);
      const btn = $('.markdone');
      if (btn) btn.addEventListener('click', () => { const done = isDone(t); setDone(t, !done); });
    }
    refreshProgressUI();
  }

  /* ── Copy code ───────────────────────────────────────────── */
  function initCopy() {
    $$('.codeblock').forEach((block) => {
      const btn = block.querySelector('.codeblock__copy'); if (!btn) return;
      btn.addEventListener('click', async () => {
        const code = block.querySelector('code'); if (!code) return;
        const text = code.innerText;
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {
          const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (_) {} ta.remove();
        }
        btn.classList.add('is-copied');
        const lbl = btn.querySelector('[data-copylabel]'); if (lbl) lbl.textContent = 'Copied!';
        setTimeout(() => { btn.classList.remove('is-copied'); if (lbl) lbl.textContent = 'Copy'; }, 1600);
      });
    });
  }

  /* ── Tabs ────────────────────────────────────────────────── */
  function initTabs() {
    $$('.tabs').forEach((tabs, i) => {
      const list = tabs.querySelector('.tabs__list');
      const panels = $$(':scope > .tabs__panel', tabs);
      if (!list) return;
      list.setAttribute('role', 'tablist');
      $$('.tab', list).forEach((tab, j) => {
        const panel = panels[j]; if (!panel) return;
        const id = `tab-${i}-${j}`;
        tab.id = id + '-tab'; tab.setAttribute('role', 'tab');
        panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id);
        const active = tab.getAttribute('aria-selected') === 'true' || j === 0;
        tab.setAttribute('aria-selected', String(active));
        panel.hidden = !active;
        tab.addEventListener('click', () => select(j));
      });
      function select(n) {
        $$('.tab', list).forEach((x, j) => { const on = j === n; x.setAttribute('aria-selected', String(on)); if (panels[j]) panels[j].hidden = !on; });
      }
    });
  }

  /* ── TOC scrollspy ───────────────────────────────────────── */
  function initToc() {
    const links = $$('.toc__list a');
    if (!links.length) return;
    const map = new Map();
    links.forEach((a) => { const id = a.getAttribute('href').slice(1); const h = document.getElementById(id); if (h) map.set(h, a); });
    if (!map.size) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          const a = map.get(e.target); if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-88px 0px -70% 0px', threshold: [0, 1] });
    map.forEach((_a, h) => obs.observe(h));
  }

  /* ── Reveal on scroll ────────────────────────────────────── */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => obs.observe(e));
  }

  /* ── Quizzes ─────────────────────────────────────────────── */
  function initQuiz() {
    $$('.quiz').forEach((quiz) => {
      const options = $$('.quiz__option', quiz);
      const feedback = $('.quiz__feedback', quiz);
      const explain = quiz.dataset.explain || '';
      options.forEach((opt, idx) => {
        opt.addEventListener('click', () => {
          if (quiz.dataset.answered) return;
          quiz.dataset.answered = '1';
          const correct = opt.dataset.correct === 'true';
          options.forEach((o) => {
            if (o.dataset.correct === 'true') o.classList.add('is-correct');
            o.setAttribute('aria-disabled', 'true');
          });
          if (!correct) opt.classList.add('is-wrong');
          if (feedback) {
            feedback.classList.add('show');
            feedback.innerHTML = (correct ? '<strong>Nice — correct.</strong> ' : '<strong>Not quite.</strong> ') + explain;
          }
        });
      });
    });
  }

  /* ── Mobile nav ──────────────────────────────────────────── */
  function initMobileNav() {
    const toggle = $('.nav-toggle'); const nav = $('.mobile-nav'); if (!toggle || !nav) return;
    toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  }

  /* ── Search ──────────────────────────────────────────────── */
  function initSearch() {
    const dialog = $('.search-dialog'); if (!dialog || typeof dialog.showModal !== 'function') return;
    const input = $('.search-field input', dialog);
    const results = $('.search-results', dialog);
    const index = (window.DBTT_DATA.search || DATA.TOPICS.map((t) => ({ title: t.title, lede: t.lede, level: t.level, url: `${t.level}/${t.slug}.html`, tags: t.tags || [] })));
    let active = 0;

    function score(t, q) {
      const hay = (t.title + ' ' + t.lede + ' ' + (t.tags || []).join(' ') + ' ' + t.level).toLowerCase();
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return 1;
      let s = 0;
      for (const term of terms) {
        const i = hay.indexOf(term);
        if (i === -1) return 0;
        s += term.length + (t.title.toLowerCase().includes(term) ? 6 : 0);
      }
      return s;
    }
    function render(q) {
      const list = index.map((t) => ({ t, s: score(t, q) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 9);
      active = 0;
      if (!list.length) { results.innerHTML = '<div class="search-empty">No topics match “' + q.replace(/[<>&]/g, '') + '”.</div>'; return; }
      results.innerHTML = list.map((x, i) => `
        <a class="search-result${i === 0 ? ' is-active' : ''}" href="${x.t.url}">
          <svg class="icon" aria-hidden="true"><use href="#i-${levelIcon(x.t.level)}"></use></svg>
          <span>${x.t.title}</span>
          <span class="lvl">${x.t.level}</span>
        </a>`).join('');
    }
    function levelIcon(level) { const m = { beginner: 'rocket', intermediate: 'wrench', advanced: 'flame', expert: 'crown' }; return m[level] || 'book-open'; }
    function open() { if (!dialog.open) { dialog.showModal(); input.value = ''; render(''); input.focus(); } }
    function move(d) { const items = $$('.search-result', results); if (!items.length) return; items[active] && items[active].classList.remove('is-active'); active = (active + d + items.length) % items.length; items[active].classList.add('is-active'); items[active].scrollIntoView({ block: 'nearest' }); }
    $$('.search-trigger').forEach((b) => b.addEventListener('click', open));
    input && input.addEventListener('input', () => render(input.value.trim()));
    input && input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { const it = $$('.search-result', results)[active]; if (it) location.href = it.getAttribute('href'); }
    });
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    });
  }

  /* ── Boot ────────────────────────────────────────────────── */
  function boot() {
    initTheme(); initCopy(); initTabs(); initToc(); initReveal(); initQuiz(); initMobileNav(); initSearch(); initProgress();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
