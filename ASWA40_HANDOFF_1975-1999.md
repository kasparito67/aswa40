# ASWA40 — Handoff 1975–1999

## Purpose

This file is the working handoff for the new ASWA40 **Top films 1975–1999** page.

The user wants to begin from the **latest 2000–2024 site as an exact duplicate**, then progressively replace/adapt the content for 1975–1999. Do not redesign or rebuild the page from scratch at this stage.

## What Master Chat did on 2026-09-02

1. Confirmed the current 2000–2024 reference is the latest `main` state, currently carrying the v0.9.6+ site architecture and subsequent recorded fixes in the canonical handoff.
2. Created a new branch:
   - `local/top-1975-1999`
   - created directly from current `main`
3. **No site content has been changed yet on this branch.** It is currently an exact duplicate of the latest 2000–2024 page.
4. No ZIP/export workflow should be used for this task.
5. No Vercel deployment should be used for normal iteration. The user wants a local/workflow branch implementation first.
6. An older preparation branch already exists:
   - `local/top-1975-1999-assets`
   - contains previously prepared TMDB poster assets for the future 1975–1999 Top
   - recorded checkpoint: 97/97 poster candidates fetched successfully (90 ranked films + 7 editorial grands oubliés)
   - treat this as an **asset source**, not as the new page/code base
7. A separate prototype branch also exists (`local/modal-backdrop-prototype`). Do not use it as the 1975–1999 starting branch unless explicitly requested.

## Required starting point for Work

Work should:

1. Read `ASWA40_HANDOFF.md` for the canonical site architecture and validated 2000–2024 UX rules.
2. Work from `local/top-1975-1999`, not from an exported HTML, ZIP, old attachment, or the older asset-preparation branch.
3. Compare `local/top-1975-1999-assets` only to bring over the prepared 1975–1999 assets/data when useful.
4. Preserve the current site structure, styles, responsive behavior, interactions, animations, modal/detail behavior and local-image architecture unless the user explicitly requests a change.
5. Build the 1975–1999 version by changing content/data first.

## Initial content conversion requested

For the first functional pass, keep the page visually and structurally equivalent to the latest 2000–2024 version and adapt only what is necessary for the 1975–1999 dataset.

Expected first-pass changes include:

- Hero period: `1975–1999`
- Community count/content where applicable: 7 participants/cinéphiles for this ranking
- Top 25 remains Top 25
- Full ranking ends at rank 90, so the ranking section should become `#26–90` (or equivalent wording consistent with current structure)
- Replace ranked movie data with the 1975–1999 ranking
- Replace poster references with the prepared local 1975–1999 assets
- Replace “Grands oubliés” content/assets with the 1975–1999 editorial set
- Replace OVNI/bottom-ranking content from the new dataset
- Recalculate/adapt sidebar insights, year insight and director insight from the new 1975–1999 data rather than copying 2000–2024 facts
- Keep TMDB attribution/footer policy intact

Do not invent new visual direction during this first pass. The user explicitly wants an **exact duplicate of the latest 2000–2024 page with the content adjusted**; visual iteration will happen afterward.

## Important current architecture

The stable site is a static site with separated responsibilities:

- `index.html` — semantic page structure/sidebar markup
- `assets/styles.css` — main visual system/responsive behavior
- `assets/top5-hover-fix.css` — late override layer containing current validated visual refinements
- `scripts/data.js` — ranking/poster/editorial data
- `scripts/app.js` — rendering and interactions
- local poster/backdrop/director assets under `assets/`

Do not revert to the old monolithic HTML workflow.

## Production guardrail

- Stable production remains the 2000–2024 page on `main`.
- Do not modify or merge to `main` until the user has reviewed the 1975–1999 page.
- Do not claim the 1975–1999 page is live.
- Normal iteration should remain on `local/top-1975-1999`.

## Immediate Work-agent objective

Create a locally previewable **first-pass 1975–1999 page** on `local/top-1975-1999` that is visually/structurally identical to the latest 2000–2024 site, using the 1975–1999 ranking and prepared assets. Once that baseline is working, stop and let the user inspect it before redesign/visual iteration.
