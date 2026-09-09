# ASWA40 — Phase 0 baseline audit

Date: 2026-09-09

## Starting point

- `main` SHA confirmed: `dcd80bc031093250e1d2109d06545ac9921b8415`
- cleanup branch created from that exact SHA: `work-cleanup-sept9`
- no production change and no visual refactor in Phase 0
- legacy comparison reference only: `94df10080de6e2e9023872b963dabde3a5b1ae1d`

## Files actually loaded by `v2/index.html`

### CSS — 6 files
1. `v2/styles/app.css`
2. `v2/styles/legacy-parity.css`
3. `v2/styles/content-expansion.css`
4. `v2/styles/modal-polish.css`
5. `v2/styles/section-polish.css`
6. `v2/styles/interaction-fix.css`

### JavaScript — 14 files
1. `scripts/data.js`
2. `scripts/backdrops.js`
3. `v2/scripts/data.js`
4. `v2/scripts/new-tops.js`
5. `v2/scripts/top-skeletons.js`
6. `v2/scripts/header-polish.js`
7. `v2/scripts/section-polish.js`
8. `v2/scripts/app.js`
9. `v2/scripts/legacy-parity.js`
10. `v2/scripts/content-expansion.js`
11. `v2/scripts/modal-polish.js`
12. `v2/scripts/ovnis-polish.js`
13. `v2/scripts/interaction-fix.js`
14. `v2/scripts/hero-title-final.js`

Important finding: `v2/scripts/sidebar-polish.js` exists in the repository but is **not loaded by the current `v2/index.html`**. The same must be checked before relying on any behavior believed to live there.

## Concurrent header renderers / mutators

### `header-polish.js`
Mutates `TOPS[*].hero` before the render. It sets hero images, positions and `titleArt` for Sci-fi, Animation, Biopics and 2000–2024.

### `app.js`
`heroTitle(top)` performs the canonical initial render. If `titleArt` exists it creates `.hero-title-art` as a CSS `background-image`; otherwise it creates an `<h1>` text title.

### `legacy-parity.js`
After the generic render, it locates the 2000–2024 screen and replaces `.hero-title.innerHTML` with a new text/medallion header. It also rewrites the 2000 sidebar HTML.

### `hero-title-final.js`
Runs on `requestAnimationFrame` after the other scripts and replaces `.hero-title.innerHTML` again for Sci-fi, Animation, Biopics and 2000–2024.

Conclusion: the current 2000 header is produced/mutated through four layers. This is order-dependent and confirms the diagnosis in the refactor guide.

## Sidebar renderers / state collisions

### `app.js`
Builds the initial sidebar and binds dropdown state with class `.open`.

### `legacy-parity.js`
Replaces the whole 2000 sidebar with `innerHTML`, then binds a separate model using `.is-open` for insights, year and directors.

### `sidebar-polish.js`
Exists and would replace non-2000 year/director card HTML and bind `.is-open`, but it is currently not included by `v2/index.html`.

### `interaction-fix.js`
Still assumes `.parity-year-card` and `.parity-director-card` exist and adds ARIA synchronization listeners to them. Because `sidebar-polish.js` is not loaded, this code can be partially inert depending on the DOM actually produced.

Conclusion: `.open` and `.is-open` coexist; some corrective code targets DOM structures whose generating script is not currently loaded.

## Modal / navigation collisions

### `app.js`
Owns the base modal state, opening, poster/title/stats/body updates, prev/next, keyboard, pointer gesture and stage navigation.

### `legacy-parity.js`
Adds a separate horizontal `wheel` handler to the modal with threshold accumulation and a 230 ms busy lock.

### `modal-polish.js`
Uses a `MutationObserver` on `#modalTitle` to update backdrop and Letterboxd content after the base modal has already changed.

### `interaction-fix.js`
Adds another capture-phase horizontal `wheel` system intended to stop the older handler, plus another title `MutationObserver` to animate film changes and additional key/click direction tracking.

### Legacy behavioral reference `94df100.../scripts/detail-nav.js`
The old validated model preloaded target media before changing films and owned one coherent navigation path for arrows, keyboard and touch drag. This is a useful behavioral reference, but its architecture should not be copied wholesale.

Conclusion: modal media, animation and horizontal navigation are currently split across multiple systems.

## CSS collision baseline

`interaction-fix.css` is a heavy override layer for the modal and sidebar. It uses many `!important` declarations to force geometry/state over earlier styles. This confirms that CSS responsibility is not currently consolidated.

## Baseline links

Production baseline:
- https://aswa40-films.vercel.app/

Cleanup branch:
- https://github.com/kasparito67/aswa40/tree/work-cleanup-sept9

Current main commit:
- https://github.com/kasparito67/aswa40/commit/dcd80bc031093250e1d2109d06545ac9921b8415

Legacy behavior reference:
- https://github.com/kasparito67/aswa40/tree/94df10080de6e2e9023872b963dabde3a5b1ae1d

## Visual capture limitation in this Phase 0 run

No visual code was changed. The available GitHub tooling can inspect and branch the code but does not provide browser viewport capture for the live site. The production URL above is therefore the visual baseline link for this audit. Desktop/mobile screenshots should be captured in Work before Phase 1 changes are approved.

## Phase 0 verdict

The project is recoverable. The core generic renderer and data model remain useful. The fragility comes from post-render replacement and duplicated listeners/styles, especially:

1. four header mutation layers;
2. two sidebar state conventions (`.open` / `.is-open`);
3. a sidebar correction script that currently is not loaded;
4. multiple modal/wheel systems;
5. mutation-observer-based media correction;
6. a large CSS override layer.

No Phase 1 work has started.
