# ASWA40 — Canonical Project Handoff

This file is the shared source of truth for ChatGPT Chat, Work, Local and any future development session.

## 0. Current state — read this first

### Decision / coordination model

- **Master chat** is the decision and visual-direction thread.
- **Local branch chat** is the default space for visual experiments and day-to-day implementation without Vercel redeploys.
- **Work** is the targeted execution, debugging and consolidation environment, not a separate source of truth.
- Every new Master, Local or Work session must read this file and the correct Git branch before editing.
- Do not reconstruct state from another conversation if this file + the relevant branch already answer the question.
- Batch related changes and update this file after a coherent validated batch, not after every micro-query.

### Current code reference

- Repository: `kasparito67/aswa40`
- Stable branch: `main`
- Active working branch: `work-cleanup-sept9`
- Do not merge or promote the working branch without explicit user validation.

### Official public / visual reference

`https://aswa40-films.vercel.app/`

This remains the production reference. The historical `aswa40-films-live` project was deleted on 2026-09-02 and must not be used.

### Active refactor state — September 10, 2026

The multi-Top platform is being cleaned up phase by phase on `work-cleanup-sept9`.

Validated / implemented before Phase 4:
- one canonical hero-title renderer;
- shared interactions and modal behavior aligned across Tops;
- poster metadata audited and repaired;
- Documentaires and Re.Watched added to the platform;
- Icarus locked to TMDB 432976 / 2017 documentary;
- Senna locked to TMDB 58496 / 2010 documentary;
- Home Alone locked to TMDB 771;
- Re.Watched title artwork uses `assets/header-rewatch.svg`.

### Phase 4 — routes + virtualized iOS-like navigation

Phase 4 is **in validation**, not yet approved.

Target architecture:
- one repository and one Vercel project;
- one SPA shell and one shared renderer;
- one shareable route per Top (`/tops/<top.id>`);
- only the active Top remains mounted while idle;
- during a horizontal transition, only the current Top + one adjacent Top are mounted temporarily;
- after the transition, the old Top is unmounted;
- swipe, trackpad, arrows and keyboard update the route;
- browser Back / Forward restores the correct Top;
- `/v2` remains a compatibility entry and resolves to the first routed Top;
- Vercel rewrite sends `/tops/:top` to `/v2`.

This is intentionally **not** a collection of visually separate page loads. The user wants an iOS-like continuous screen-navigation feeling. Route separation exists for deep-linking/history, while the visual experience stays inside one shell.

Latest Phase 4 correction batch:
- removes the fake hero-background transition experiment;
- transitions use two real `.era-screen` nodes side-by-side only while moving;
- trackpad inertia is treated as one gesture;
- Re.Watched Top 50 is rendered canonically with normal hierarchy: large #1, medium #2–5, then #6–50 grid;
- Re.Watched OVNI cards carry ranks and open the canonical film modal;
- OVNI editorial explanations are rendered by the canonical renderer for all current Top categories;
- `Jesus of Nazareth` is an explicit curated OVNI in 1975–1999: 1/7 vote, best rank #2; no chooser name should be invented unless sourced;
- Documentaires OVNI copy may name Quentin where source material explicitly supports it;
- late DOM restructuring in `content-expansion.js`, `qa-fixes.js` and `ovnis-polish.js` has been neutralized where Phase 4 now owns the behavior canonically. Phase 5 may remove obsolete files after proving they are no longer referenced.

### Phase status

- Phase 0 — baseline: complete
- Phase 1 — single hero renderer: complete
- Phase 2 — interaction parity / consolidation: complete
- Phase 3 — poster/data QA: complete
- Phase 4 — shareable routes + virtualized continuous navigation: **implementation in validation**
- Phase 5 — cleanup obsolete layers: not started
- Phase 6 — final Work handoff/audit: not started

Do not start Phase 5 until the user validates Phase 4 visually and behaviorally.

## 1. Current architecture

Entry:
- `v2/index.html`

Current key scripts:
- `v2/scripts/app.js` — canonical rendering, sections, modal, cover-flow, progressive loading, routed Top navigation and temporary two-screen transitions
- `v2/scripts/data.js`
- `v2/scripts/new-tops.js`
- `v2/scripts/expanded-tops.js`
- `v2/scripts/poster-metadata.js`
- `v2/scripts/poster-aliases.js`
- `v2/scripts/expansion-media.js`
- `v2/scripts/qa-data-fixes.js`
- `v2/scripts/top-skeletons.js`
- `v2/scripts/hero-config.js`
- `v2/scripts/section-polish.js`
- `v2/scripts/content-expansion.js`
- `v2/scripts/ovnis-polish.js`
- `v2/scripts/parallax.js`
- `v2/scripts/qa-fixes.js`

Current styles:
- `v2/styles/app.css`
- `v2/styles/hero.css`
- `v2/styles/legacy-parity.css`
- `v2/styles/content-expansion.css`
- `v2/styles/modal-polish.css`
- `v2/styles/section-polish.css`
- `v2/styles/interaction-fix.css`
- `v2/styles/parallax.css`
- `v2/styles/qa-fixes.css`

Do not add another late-loading `final`, `fix-2`, or override layer. Consolidate into existing canonical files.

## 2. Deployment guardrail

The sole Vercel project is `aswa40-films`.

Production URL:
`https://aswa40-films.vercel.app/`

Working branch preview is used for validation. A successful GitHub commit alone is not enough to call a change live; verify Vercel status separately.

Never merge `work-cleanup-sept9` into `main` or promote it without explicit user approval.

## 3. TMDB image / attribution policy

- TMDB is the standard metadata source for posters/backdrops.
- Never expose `TMDB_ACCESS_TOKEN` in browser code, committed source, handoff text or logs.
- Prefer local repository assets for final production where the asset workflow supports it.
- TMDB attribution remains required where TMDB-powered content is presented.

## 4. UX / visual invariants

### Platform navigation

- Must feel like horizontally navigable iOS screens, not unrelated page loads.
- Route changes must not introduce a black frame or fake-background crossfade.
- At idle, only one Top screen is mounted.
- During a transition, current + target neighbor may coexist briefly.
- One physical trackpad gesture must result in at most one Top navigation.
- Incomplete gestures should return smoothly to the current Top.
- Arrow navigation, swipe and keyboard use the same directional model.
- Browser Back / Forward and direct refresh on `/tops/<id>` must work.
- Reduced-motion preference must remain respected.

### Top hierarchy

Default ranking presentation:
- #1 is the dominant tile;
- #2–5 are medium hero tiles;
- remaining films in the featured ranking use the smaller grid treatment.

Re.Watched Top 50 follows the same hierarchy, with #6–50 in the smaller grid.

### OVNIs

- OVNI cards are editorial, not just duplicated bottom-ranked films.
- Each current category should show a short reason explaining why the film is an OVNI.
- A low-vote / bottom-ranked status is itself a valid editorial reason when nothing more distinctive is known.
- Name the chooser only when supported by source material; never infer a member identity from point totals alone.
- Ranked OVNI cards must remain clickable and open the same canonical modal as the film elsewhere in the ranking.
- `Jesus of Nazareth` is intentionally highlighted as a strong 1975–1999 OVNI.

### Header / hero

- Hero distinct. Interface common. Palette adapted.
- Inter + Inter Tight remain the interface typography.
- Approved source artwork should be rendered directly; do not recreate artwork in CSS.
- Preserve semantic structure and `prefers-reduced-motion` behavior.

### Main interactions

- Sections are independent accordions.
- Desktop cover-flow is intentional.
- Full ranking preserves progressive loading.
- Film modal retains poster + backdrop + previous/next + keyboard + touch/trackpad behavior.
- Sidebar remains sticky and keeps Year / Director disclosures.

## 5. Important current Top data notes

Current Tops include:
- `1975-1999`
- `2000-2024`
- `sci-fi-realiste`
- `animation`
- `biopics`
- `documentaires`
- `rewatched`

Re.Watched:
- Top 50 featured section;
- #51–263 full section;
- curated OVNI set includes UHF, Airbag, Grind, Le Retour de Goldorak and Condorman;
- Home Alone is TMDB 771.

Documentaires:
- Top 15 featured section;
- #16–83 full section;
- Icarus = TMDB 432976;
- Senna = TMDB 58496.

## 6. Working method

1. Read this handoff and inspect current `work-cleanup-sept9` HEAD.
2. Work on one phase at a time.
3. Preserve unrelated validated work.
4. Prefer canonical renderer/data changes over post-render DOM rewrites.
5. Commit coherent batches distinctly.
6. Validate Vercel preview after each meaningful phase batch.
7. Update this handoff after coherent changes, not every micro-adjustment.
8. Stop for user validation before the next phase.

## 7. Immediate validation checklist for Phase 4

Before declaring Phase 4 complete, test:
- direct route opens for every Top;
- refresh preserves the Top;
- browser Back / Forward works;
- arrow navigation updates URL;
- keyboard Left / Right updates Top and URL;
- pointer/touch horizontal swipe feels continuous;
- Mac trackpad gesture causes one navigation only;
- no black/fake background appears between Tops;
- incomplete swipe returns smoothly;
- only one `.era-screen` remains mounted after the transition;
- Re.Watched has #1 / #2–5 / #6–50 hierarchy;
- Re.Watched OVNIs open their film modal;
- OVNI editorial reason appears for every current category;
- desktop/mobile layout remains intact.

Stop after validation. Phase 5 is cleanup only and must not begin early.
