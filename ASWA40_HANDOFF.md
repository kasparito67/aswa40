# ASWA40 — Canonical Project Handoff

This file is the compact source of truth for future ChatGPT / Work / local sessions.

For the active redesign process, read **`ASWA40_DESIGN_OVERHAUL_GUIDE.md` first**. It contains the phase plan, design rules, implementation risk classes and promotion guardrails.

## 0. Current state — September 11, 2026

- Repository: `kasparito67/aswa40`
- Production branch: `main`
- Production URL: `https://aswa40-films.vercel.app/`
- Active redesign branch: `design-overhaul-sept11`
- QA/debug source branch: `audit-debug-sept11`
- Audit report: `ASWA40_AUDIT_2026-09-11.md`
- Redesign guide: `ASWA40_DESIGN_OVERHAUL_GUIDE.md`

`design-overhaul-sept11` was created from production and then fast-forwarded to include the validated September 11 QA/debug fixes through commit `33130a791329eae35b2a35f1926bfaf0fb4f5f10` before any redesign work began.

Production must remain untouched during redesign exploration. Never promote or merge the redesign without explicit user approval.

## 1. Current redesign intent

This is a **visual overhaul on top of a stable architecture**, not a ground-up rebuild.

Initial visual scope:

- keep current hero/background identities;
- keep current navigation model and interaction logic;
- keep current rollovers initially;
- deeply redesign typography, sections, ranking presentation, film tiles, insights, spacing, surfaces and visual rhythm;
- allow experiments where the hero/background continues into lower sections;
- allow custom transparency/glass treatments if they remain minimal, intentional and Swiss/editorial rather than generic UI-kit glassmorphism.

The hero/header system is preserved initially, not permanently locked. The redesign may later expand upward if the visual direction justifies it.

## 2. Canonical routes

ASWA40 is one static Vercel app with one routed Top per URL:

- `/tops/1975-1999`
- `/tops/2000-2024`
- `/tops/sci-fi-realiste`
- `/tops/animation`
- `/tops/biopics`
- `/tops/documentaires`
- `/tops/rewatched`

Default entry remains `1975-1999`.

`vercel.json` rewrites `/tops/:top` to `/v2`. Preserve this routing model.

## 3. Stable runtime architecture

Entry: `v2/index.html`

`v2/scripts/bootstrap.js` selects the navigation engine.

### Desktop / fine pointer

- `v2/scripts/app-desktop.js` — renderer, sections/sidebar, native horizontal rail, route/history state, progressive rankings and film modal;
- `v2/scripts/top-nav.js` — bottom direct Top selector;
- `v2/scripts/parallax.js` — desktop parallax.

Desktop Top navigation is **browser-native horizontal scroll + CSS scroll-snap**. All seven Tops sit in one horizontal rail. The browser owns trackpad momentum and snapping.

Do not reintroduce a JS wheel/state-machine carousel over this system without explicit structural approval.

### Mobile / coarse pointer

- `v2/scripts/runtime.js` — focused mobile support;
- `v2/scripts/app.js` — validated transform carousel + renderer/modal;
- `v2/scripts/parallax.js` exits early on mobile.

Mobile keeps the validated touch/transform model. Cosmetic redesigns should not alter this interaction engine.

## 4. Data/configuration load order

`v2/index.html` loads:

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

- `canonical-data.js` — durable film identity/metadata locks;
- `platform-config.js` — Top order, sections, OVNI curation and responsive media/batch configuration;
- `hero-config.js` — hero artwork/position configuration;
- `animation-data.js` — canonical animation-list correction;
- poster/expansion files — generated/verified metadata and media augmentation.

Do not duplicate structural section configuration across multiple files.

## 5. Loaded styles

Current production styles:

- `v2/styles/app.css`
- `v2/styles/hero.css`
- `v2/styles/top-themes.css`
- `v2/styles/modal.css`
- `v2/styles/components.css`
- `v2/styles/modal-layout.css`
- `v2/styles/parallax.css`
- `v2/styles/responsive.css`
- `v2/styles/native-carousel.css`

During redesign, prefer responsibility-based edits. Do not create a chain of `final.css`, `fix.css`, `qa-final.css`, etc.

Temporary prototype CSS is acceptable only for disposable mockups or clearly marked experimental work. Approved production styling should be consolidated.

## 6. September 11 QA/debug baseline

The redesign branch already contains the bugfix baseline from the QA branch.

Validated fixes include:

- 2000–2024 full range corrected to `#26–135`;
- Biopics featured ranking corrected to actual Top 15, with full ranking from `#16`;
- Animation OVNI ranks corrected after reranking;
- Documentaires/Re.Watched section ownership consolidated;
- desktop native programmatic scroll keeps parallax synchronized;
- bottom Top selector no longer competes with global keyboard navigation;
- global left/right navigation ignores focused interactive controls;
- modal trackpad direction uses accumulated movement;
- rapid section open/close no longer loses to stale timers;
- repeated `Voir plus` cannot append duplicate batches;
- section buttons expose correct accessibility state.

Removed dead v2 runtime files:

- `header-polish.js`
- `hero-title-final.js`
- `interaction-fix.js`
- `modal-polish.js`
- `sidebar-polish.js`

## 7. QA tooling

The project contains:

- `scripts/audit-project.mjs`
- `.github/workflows/audit-project.yml`
- `scripts/smoke-browser.mjs`
- `.github/workflows/browser-smoke.yml`

Both workflows run on `design-overhaul-sept11` as well as the QA branch.

Baseline audit result before redesign: **0 errors / 0 warnings** across 7 Tops / 793 ranked films.

Baseline Playwright/Chromium desktop + mobile smoke: **PASS**.

Every meaningful redesign implementation phase should return to green audit + smoke status before being considered stable.

## 8. UX invariants during redesign

### Navigation

- Desktop: native scroll-snap rail.
- Mobile: validated direct touch/transform carousel.
- Routes, refresh and Back/Forward must preserve the correct Top.
- Bottom selector remains functional direct navigation.
- Side arrows remain usable.
- No black flash, fake page load or hard seam between Tops.

### Content hierarchy

- #1 remains dominant.
- #2–5 remain a secondary featured tier unless an approved redesign explicitly establishes an equivalent hierarchy.
- Long rankings remain progressive/lazy rather than eagerly dumping all content.
- Mobile must remain touch-safe and free of horizontal overflow.

### Modal

- Desktop retains previous/next film navigation.
- Mobile remains vertically scrollable.
- OVNI editorial copy remains available where configured.

### Performance

- secondary sections render on demand;
- long rankings reveal progressively;
- mobile image budgets remain lighter;
- parallax remains desktop-only unless explicitly reconsidered;
- avoid permanent unnecessary GPU layers.

## 9. Durable data locks

Never regress:

- Icarus = 2017 documentary, TMDB `432976`
- Senna = 2010 documentary, TMDB `58496`
- Home Alone = 1990 film, TMDB `771`

## 10. Redesign implementation rule

When the user says **“push this into the site”** during this redesign, “site” means **`design-overhaul-sept11`**, not production.

Use the risk classification in `ASWA40_DESIGN_OVERHAUL_GUIDE.md`:

- Class A skinning: implement directly;
- Class B layout adaptation: implement safely while preserving behavior;
- Class C structural change: explain risk and request explicit approval before changing architecture.

HTML mockups are disposable design experiments. Never copy their architecture blindly into the production renderer.

## 11. Promotion guardrail

Before any redesign promotion to `main`:

- user visually validates the Vercel preview;
- project audit is green;
- desktop/mobile browser smoke is green;
- all seven Tops are spot-checked visually;
- navigation, sections, progressive loading and modals are exercised;
- `ASWA40_HANDOFF.md` and the redesign guide are updated with final file responsibilities;
- explicit user approval to merge/go live is obtained.

Until then, `main` stays untouched.
