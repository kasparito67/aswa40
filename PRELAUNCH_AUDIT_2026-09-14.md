# ASWA40 — Prelaunch audit — 2026-09-14

## Frozen rollback point

The production/live version that existed before the redesign launch is preserved on:

- Branch: `backup/live-pre-overhaul-2026-09-14`
- Commit: `e482e08afb34013fa590dbb1c89993014d5b79c2`
- This is also the current `main` / production commit at the time of this audit.

Do not delete or move this backup branch. It is the canonical rollback point for the pre-overhaul site.

## Audited redesign

Audit work was performed on `audit/prelaunch-2026-09-14`, branched directly from `design-overhaul-phase-a`.

The launch candidate includes the desktop/mobile redesign plus the audit fixes described below. The audited commit immediately before this report is:

- `4e0a46bc8b43b1f665b89d3cd29232eeaf9fb605`

## Audit coverage

Automated checks now cover:

- JavaScript syntax and full data-pipeline evaluation
- seven expected Tops and contiguous ranking data
- local asset existence and CSS `url()` references
- high-confidence credential/token patterns accidentally committed to text files
- exact 35 Top-5 curated backdrops and 35 mobile focal points
- desktop/mobile shared short Top-5 names
- Top 2000–2024 gold palette
- `Le reste` section naming and section boundaries
- year-label normalization
- documented forgotten-film sections and duplicate/collision checks
- mobile title-width parity and horizontal overflow
- flat/full-bleed sidebar rows on desktop and mobile
- sidebar disclosure behavior
- year-chart rollover metadata
- `Voir plus` actually appending ranking cards
- direct routing to every Top
- modal opening/closing and accent behavior
- repeated rapid trackpad swipes: one physical swipe queues exactly one film
- Documentaires forgotten-film section on desktop/mobile, including click-through detail sheets
- local 404 detection during browser navigation
- page/console errors during browser checks

The original `scripts/audit-project.mjs` and `scripts/smoke-browser.mjs` remain in place; the prelaunch checks are additional gates, not replacements.

## Bugs found and corrected during prelaunch audit

1. Some content normalization (`Le reste`, year labels, forgotten sections) was desktop-only. It now runs before both renderers.
2. Mobile forgotten-film cards without a rank were not opening a detail sheet. They now use the shared modal language.
3. Four Documentaires forgotten-film poster paths referenced nonexistent local files. They now have durable fallbacks/runtime image hydration rather than guaranteed 404s.
4. `Harlan County War` was the wrong identity for the documentary list. It is normalized to `Harlan County, USA`.
5. The previous mobile parity stylesheet loaded before other mobile overrides, allowing older CSS to win in equal-specificity cases. The parity layer is now last in the mobile cascade.
6. Rapid desktop trackpad swipes could still be dropped during a modal animation. Swipe intents are now queued and drained only when the previous modal transition is actually idle.
7. An earlier redesign pass had introduced unverified “Grands oubliés” lists for Sci-Fi, Animation and Biopics. Those fabricated lists were removed rather than shipped as data.

## Editorial content gap

Verified “Grands oubliés” data currently exists for:

- 1975–1999
- 2000–2024
- Documentaires

Re.Watched uses its ghost-card treatment for OVNIs rather than forgotten films.

There is currently no verified project source available for “Grands oubliés” lists for:

- Sci-Fi réalistes
- Animation
- Biopics

Do not invent these lists. Add them only when an editorial/source list is supplied.

## Promotion procedure

1. Keep `backup/live-pre-overhaul-2026-09-14` fixed at `e482e08…`.
2. Fast-forward `design-overhaul-phase-a` to the fully green audited commit.
3. Confirm Vercel preview, static audit, standard browser smoke and extended prelaunch browser audit are all green on the design branch.
4. Only with explicit owner approval, fast-forward `main` to the audited design commit.
5. Verify the production alias and key routes immediately after production deployment.

## Rollback procedure

If production must return to the previous site, move `main` back to:

`backup/live-pre-overhaul-2026-09-14` / `e482e08afb34013fa590dbb1c89993014d5b79c2`

Then allow Vercel to redeploy `main` and verify the production alias.

The backup branch should remain untouched even after a successful redesign launch.