# ASWA40 — Canonical Project Handoff

This file is the shared source of truth for ChatGPT Chat, Work, Local and any future development session.

## 0. Current state — read this first

### Coordination

- Repository: `kasparito67/aswa40`
- Stable production branch: `main`
- Active working branch: `work-cleanup-sept9`
- Production remains `https://aswa40-films.vercel.app/`
- Working preview: `https://aswa40-films-git-work-cleanup-sept9-kasper6.vercel.app/`
- Never merge or promote `work-cleanup-sept9` without explicit user approval.
- The branch + this handoff are the source of truth, not conversation history.

### Current refactor state — September 10, 2026

Phases 0–5 have been implemented on the working branch. Phase 5 technical cleanup commit:

`ec8f9f167c501eeca4650ec7ef91d22fb3725959` — `Remove obsolete platform overrides`

A documentation-only handoff commit follows that cleanup commit.

The user must visually validate the Phase 5 preview before any overhaul or merge.

## 1. Platform architecture

ASWA40 is one static app / one Vercel project with one shareable route per Top.

Canonical routes:

- `/tops/1975-1999`
- `/tops/2000-2024`
- `/tops/sci-fi-realiste`
- `/tops/animation`
- `/tops/biopics`
- `/tops/documentaires`
- `/tops/rewatched`

Navigation model:

- one `.era-screen` remains mounted while idle;
- during a horizontal transition, current + adjacent target screen may coexist temporarily;
- swipe follows the finger directly on touch;
- arrows, keyboard and trackpad use the same directional model;
- routes update with navigation and browser Back / Forward works;
- refresh restores the routed Top;
- neighboring hero assets are prewarmed, while secondary content remains progressively loaded;
- arrow navigation has a subtle motion blur; direct touch swipe remains sharp;
- reduced-motion preference is respected.

The site must feel like continuous iOS-style screens, not separate page loads.

## 2. Current runtime files

Entry:

- `v2/index.html`

### Canonical runtime / renderer

- `v2/scripts/app.js` — renderer, sections, sidebar bindings, modal, coverflow, progressive ranking, routes and carousel
- `v2/scripts/runtime.js` — focused runtime support: OVNI modal editorial injection, perceived-loading warmup, arrow motion-blur trigger and mobile stability guards
- `v2/scripts/parallax.js` — desktop parallax only; mobile is intentionally lightweight

### Data / configuration

- `v2/scripts/data.js`
- `v2/scripts/new-tops.js`
- `v2/scripts/expanded-tops.js`
- `v2/scripts/animation-data.js` — canonical animation-list correction
- `v2/scripts/poster-metadata.js`
- `v2/scripts/poster-aliases.js`
- `v2/scripts/expansion-media.js`
- `v2/scripts/canonical-data.js` — durable identity locks and canonical metadata corrections
- `v2/scripts/top-skeletons.js`
- `v2/scripts/hero-config.js`
- `v2/scripts/platform-config.js` — Top ordering, OVNI curation, section configuration and mobile media sizing

The former runtime filenames `animation-fix.js`, `qa-data-fixes.js`, `section-polish.js` and `qa-fixes.js` are no longer loaded.

## 3. Current styles

Loaded styles are now responsibility-based:

- `v2/styles/app.css` — common renderer/base UI
- `v2/styles/hero.css` — hero artwork and title normalization
- `v2/styles/top-themes.css` — intentional per-Top exceptions, primarily the validated 2000–2024 treatment
- `v2/styles/modal.css` — film-detail visual model
- `v2/styles/components.css` — sidebar/disclosure/component presentation
- `v2/styles/modal-layout.css` — canonical modal layout and responsive geometry
- `v2/styles/parallax.css` — parallax presentation
- `v2/styles/responsive.css` — mobile grid/navigation/loading refinements

Removed old loaded paths:

- `v2/styles/legacy-parity.css`
- `v2/styles/modal-polish.css`
- `v2/styles/section-polish.css`
- `v2/styles/interaction-fix.css`
- `v2/styles/qa-fixes.css`

`modal-layout.css` replaces the old `interaction-fix.css` cascade with normal source-order precedence; the large block of modal `!important` declarations was removed.

Do not introduce a new `final`, `fix-2`, `qa-2`, or last-loaded override layer. Put future work in the canonical responsibility file.

## 4. Phase status

- Phase 0 — baseline: complete
- Phase 1 — single hero renderer: complete
- Phase 2 — interaction parity / consolidation: complete
- Phase 3 — poster/data QA: complete
- Phase 4 — routed continuous Top navigation: complete and behaviorally validated
- Phase 5 — final cleanup / responsibility-based files: implementation complete; visual regression check pending
- Phase 6 — optional Work handoff/audit: not started
- Visual overhaul — not started

Do not begin the visual overhaul until the user validates the Phase 5 preview.

## 5. UX / visual invariants

### Navigation

- Continuous horizontal screen navigation is core to the product.
- At rest, only one Top is mounted.
- During transition, only current + target neighbor may coexist.
- Incomplete touch swipe returns naturally.
- One physical trackpad gesture causes at most one navigation.
- No black frame, fake page load or hard seam should appear between Tops.
- Mobile scrollbars are visually hidden during the screen experience.

### Headers

- Hero distinct. Interface common. Palette adapted.
- Approved source artwork is rendered directly; do not recreate it in CSS.
- Mobile title placement is optically normalized.
- 1975–1999 has a deliberate mobile backdrop crop to remove the dark top strip.
- Re.Watched has a small optical right-shift because the superscript `50` distorts geometric centering.
- 2000–2024 and Re.Watched use custom mobile title boxes because their source artworks are not normalized 1920×1080 artboards.

### Ranking hierarchy

- #1 dominant tile;
- #2–5 medium tiles;
- remaining featured ranking uses the smaller poster grid;
- Re.Watched Top 50 follows the same hierarchy, with #6–50 in the smaller grid;
- mobile grids use two columns and preserve poster aspect ratio.

### OVNIs

- Each category has an editorial OVNI reason.
- Reasons appear on desktop rollover and in the film detail card after click; they do not permanently cover mobile poster tiles.
- Chooser identity is named only where source material explicitly supports it.
- Ranked OVNI cards remain clickable and open the canonical film modal.
- `Jesus of Nazareth` is intentionally highlighted as a major 1975–1999 OVNI.

### Modal

- Desktop: poster + cinematic backdrop + details + previous/next navigation.
- Mobile: vertically scrolling sheet, centered full poster, full-width title/stats/editorial copy.
- No negative pull-up or poster clipping on mobile.

### Performance

- sections other than the first are rendered on demand;
- full rankings use progressive loading;
- mobile TMDB posters use reduced image sizes;
- hero / likely-next assets are decoded or warmed opportunistically;
- save-data / slow connections receive smaller prewarm budgets;
- parallax is disabled on mobile;
- permanent GPU layers are avoided where possible.

## 6. Important Top data locks

Current Tops:

- `1975-1999`
- `2000-2024`
- `sci-fi-realiste`
- `animation`
- `biopics`
- `documentaires`
- `rewatched`

Durable identity locks:

- Icarus = 2017 documentary, TMDB 432976
- Senna = 2010 documentary, TMDB 58496
- Home Alone = 1990 film, TMDB 771

Documentaires:

- Top 15 featured section
- #16–83 full ranking

Re.Watched:

- Top 50 featured section
- #51–263 full ranking
- curated OVNI set
- title artwork: `assets/header-rewatch.svg`

## 7. Deployment guardrail

Sole Vercel project: `aswa40-films`.

A successful GitHub commit is not sufficient to call a change live; verify Vercel deployment status separately.

Never merge into `main` or promote the preview without explicit user approval.

## 8. Next visual direction — only after Phase 5 validation

The planned overhaul changes the interface below the hero while preserving the stabilized architecture and interactions.

Reference direction:

- festival / cinematheque / editorial-program feel;
- black or very dark transparent panels rather than heavy opaque cards;
- minimal or absent rounded corners;
- thin rules and typography create hierarchy;
- image-first poster presentation;
- fewer visible containers;
- hover / interaction reveals secondary information;
- insights become lighter editorial rows rather than dashboard cards;
- current heroes remain the starting point and should not be redesigned automatically.

This overhaul must begin in a dedicated visual branch or clearly isolated commit series after the current Phase 5 state is visually approved.

## 9. Immediate validation checklist

Before starting the overhaul, validate on desktop and mobile:

- every direct Top route opens;
- refresh and browser Back / Forward preserve the correct Top;
- arrow, keyboard, touch swipe and trackpad navigation work;
- touch swipe follows the finger and has no jump-back;
- arrow motion blur is subtle and does not affect direct swipe;
- no seam / scrollbar line appears between mobile screens;
- 1975–1999 header has no black top strip;
- 2000–2024 and Re.Watched mobile titles are optically aligned;
- sections open with no missing images;
- full ranking progressive load works;
- modal works and is not clipped on mobile;
- OVNI editorial copy appears in modal;
- sidebar Year / Director / Insight disclosures still work;
- no obvious visual regression from the Phase 5 file consolidation.

Stop after this validation. Do not merge to `main` automatically.
