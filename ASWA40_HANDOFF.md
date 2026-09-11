# ASWA40 — Canonical Project Handoff

This file is the source of truth for future ChatGPT / Work / local sessions.

## 0. Current state — September 11, 2026

- Repository: `kasparito67/aswa40`
- Production branch: `main`
- Production baseline before this audit: `e482e08afb34013fa590dbb1c89993014d5b79c2`
- Production: `https://aswa40-films.vercel.app/`
- Active QA branch: `audit-debug-sept11`
- Audit report: `ASWA40_AUDIT_2026-09-11.md`
- Never promote the QA branch without explicit user visual approval.

The previously validated platform is live on `main`. A full QA/debug pass is now isolated on `audit-debug-sept11`; production is intentionally untouched during validation.

## 1. Canonical routes

ASWA40 is one static Vercel app with a shareable route for each Top:

- `/tops/1975-1999`
- `/tops/2000-2024`
- `/tops/sci-fi-realiste`
- `/tops/animation`
- `/tops/biopics`
- `/tops/documentaires`
- `/tops/rewatched`

Default entry remains `1975-1999`.

`vercel.json` intentionally rewrites `/tops/:top` to `/v2`. Do not change that destination to `/v2/index.html` while `cleanUrls` is enabled.

## 2. Runtime architecture

Entry: `v2/index.html`

`v2/scripts/bootstrap.js` selects one navigation engine.

### Desktop / fine pointer

Condition: `(min-width:701px) and (hover:hover) and (pointer:fine)`

Loaded runtime:

- `v2/scripts/app-desktop.js` — renderer, all sections/sidebar components, native horizontal rail, route/history state, progressive ranking and film modal;
- `v2/scripts/top-nav.js` — bottom direct Top selector;
- `v2/scripts/parallax.js` — desktop visual parallax.

Desktop navigation is now **native horizontal scroll + CSS scroll-snap**. All seven `.era-screen` elements are mounted in one horizontal rail. The browser owns trackpad momentum and snapping. Do not rebuild a wheel/state-machine carousel on top of it.

### Mobile / coarse pointer

Loaded runtime:

- `v2/scripts/runtime.js` — focused mobile runtime support;
- `v2/scripts/app.js` — validated transform carousel + renderer/modal;
- `v2/scripts/parallax.js` — exits early on mobile.

Mobile keeps the validated one-screen-at-rest transform model. Current touch physics should not be changed casually.

## 3. Data / configuration load order

`v2/index.html` loads, in order:

1. `../scripts/data.js`
2. `../scripts/backdrops.js`
3. `scripts/data.js`
4. `scripts/new-tops.js`
5. `scripts/animation-data.js`
6. `scripts/expanded-tops.js`
7. `scripts/poster-metadata.js`
8. `scripts/poster-aliases.js`
9. `scripts/expansion-media.js`
10. `scripts/canonical-data.js`
11. `scripts/top-skeletons.js`
12. `scripts/hero-config.js`
13. `scripts/platform-config.js`
14. `scripts/bootstrap.js`

Responsibilities:

- `canonical-data.js` — durable film identity/metadata locks only;
- `platform-config.js` — Top order, sections, OVNI curation and responsive media/batch configuration;
- `hero-config.js` — hero artwork/position configuration;
- `animation-data.js` — removes invalid `LE...K` entry and reranks animation list;
- poster/expansion files — generated/verified metadata and media augmentation.

Do not reintroduce duplicate section configuration into `canonical-data.js`.

## 4. Loaded styles

- `v2/styles/app.css`
- `v2/styles/hero.css`
- `v2/styles/top-themes.css`
- `v2/styles/modal.css`
- `v2/styles/components.css`
- `v2/styles/modal-layout.css`
- `v2/styles/parallax.css`
- `v2/styles/responsive.css`
- `v2/styles/native-carousel.css`

No loaded v2 stylesheet was identified as dead in the September 11 audit.

Do not add a new `final`, `fix-2`, `qa-2`, or last-loaded override layer. Put changes in the file that owns the responsibility.

## 5. September 11 QA/debug pass

Automated project audit on `audit-debug-sept11` currently checks:

- JS syntax across project scripts;
- production entrypoint references;
- exact data/config pipeline;
- 7 Tops / 793 ranked films;
- rank continuity and section ranges;
- OVNI ranks;
- durable identity locks;
- local rendered assets;
- Vercel route rewrite;
- unloaded v2 runtime drift.

Current audit result: **0 errors / 0 warnings**.

A Playwright/Chromium smoke test also covers desktop and mobile boot/navigation, all seven direct routes, bottom selector, section lazy rendering, rapid section state changes and modal open/close. Current smoke result: **PASS**.

Audit tooling:

- `scripts/audit-project.mjs`
- `.github/workflows/audit-project.yml`
- `scripts/smoke-browser.mjs`
- `.github/workflows/browser-smoke.yml`

These two workflows are intentionally branch-scoped to `audit-debug-sept11` until the audit is approved.

## 6. Bugs fixed on the QA branch

- 2000–2024 full-range label aligned to `#26–135`.
- Biopics explicitly renders `TOP 15`; full ranking starts at `#16`.
- Animation OVNI bottom ranks corrected after list rerank (`#85–89`, not pre-rerank `#86–90`).
- Documentaires/Re.Watched section ownership consolidated in `platform-config.js`.
- Desktop native programmatic scroll now keeps parallax synchronized.
- Bottom Top selector no longer competes with global keyboard navigation.
- Global desktop left/right keys ignore focused interactive controls.
- Modal trackpad direction uses accumulated signed movement rather than the final inertial frame.
- Rapid section open/close no longer loses to a stale height timer.
- Repeated `Voir plus` clicks cannot append duplicate batches.
- Section buttons expose correct `aria-expanded` state.

Removed dead v2 runtime files after proving they were not loaded:

- `header-polish.js`
- `hero-title-final.js`
- `interaction-fix.js`
- `modal-polish.js`
- `sidebar-polish.js`

## 7. UX / visual invariants

### Navigation

- Desktop: browser-native scroll-snap rail; trackpad motion must remain native and seamless.
- Mobile: direct touch/transform carousel; one Top mounted at rest.
- Routes update with navigation; browser Back/Forward and refresh must restore the correct Top.
- No black flash, fake page load or hard seam between Tops.
- Desktop bottom selector is direct navigation, not decorative status dots.
- Side arrows are circular dark controls on desktop and mobile.

### Headers

- Hero artwork stays distinct per Top while interface geometry is shared.
- Desktop hero/section baseline is normalized across Tops.
- Approved source artwork is rendered directly; do not recreate title art in CSS.
- Mobile title placement is optically normalized.
- 1975–1999 has deliberate mobile crop treatment.
- Re.Watched has optical title compensation.

### Rankings

- #1 dominant;
- #2–5 medium;
- remaining featured ranking smaller;
- Re.Watched: Top 50 featured, #51–263 full;
- Documentaires: Top 15 featured, #16–83 full;
- Biopics: Top 15 featured, #16–67 full;
- mobile poster grids remain two columns with correct aspect ratio.

### Modal

- Desktop: cinematic detail card + previous/next navigation.
- Mobile: vertically scrollable sheet with complete poster/title/stats/body.
- OVNI editorial reason appears in relevant detail cards.

### Performance

- secondary sections render on demand;
- full rankings reveal progressively;
- mobile uses reduced TMDB image sizes;
- likely-next assets are opportunistically prewarmed;
- parallax is desktop-only;
- avoid permanent unnecessary GPU layers.

## 8. Durable identity locks

Never regress:

- Icarus = 2017 documentary, TMDB `432976`
- Senna = 2010 documentary, TMDB `58496`
- Home Alone = 1990 film, TMDB `771`

## 9. Repository hygiene

There are historical GitHub Actions workflows tied to old pages or old branches (for example `bump-1975-v037`, old TMDB backdrop/poster fetchers and `unify-era-environment`). They are not part of the current v2 runtime. Some retain narrow write triggers.

They were intentionally **not deleted during the runtime audit** because they are archival/tooling assets, not demonstrated live bugs. Archive or modernize them in a separate repository-hygiene task if desired.

## 10. Promotion checklist

Before moving `audit-debug-sept11` to `main`:

- visually test desktop trackpad, side arrows and bottom selector;
- test vertical scrolling after repeated horizontal navigation;
- test modal navigation with trackpad and arrows;
- test rapid section opening/closing and `Voir plus`;
- spot-check mobile swipe and modal;
- confirm audit workflow PASS;
- confirm browser smoke PASS;
- confirm Vercel preview SUCCESS;
- obtain explicit user approval;
- only then fast-forward/promote `main` and verify the production Vercel deployment.
