# ASWA40 — Phase 1 header consolidation

Date: 2026-09-09
Branch: `work-cleanup-sept9`
Starting point: Phase 0 commit `159ac0a7c42055db7adbf66a0817915f34093dcd`

## What changed

Phase 1 removes the order-dependent title rendering chain and leaves one renderer responsible for hero title markup.

### Canonical renderer

`v2/scripts/app.js` now renders configured title artwork directly as a real `<img class="hero-title-art">` inside `.hero-title-art-wrap`.

The renderer reads the artwork, alt text, maximum width, vertical offset and fit from `top.hero` configuration. It no longer represents approved artwork as a CSS `background-image`.

### Canonical hero configuration

`v2/scripts/hero-config.js` centralizes the approved configuration for the five current Tops:

- 2000–2024 → `../assets/header2000.webp`
- 1975–1999 → `../assets/header-title-1975-1999.svg`
- Sci-fi réalistes → `../assets/header-sci-fi.svg`
- Animation → `../assets/header-animation-01.svg`
- Biopics → `../assets/header-Biopics.svg`

It also owns the current approved hero image URLs/positions for Sci-fi, Animation and Biopics.

### Removed from runtime

`v2/index.html` no longer loads:

- `v2/scripts/header-polish.js`
- `v2/scripts/hero-title-final.js`

Those files remain in the repository for now and can be deleted only during the later cleanup phase after reference checks.

### Legacy 2000 behavior

`v2/scripts/legacy-parity.js` no longer replaces `.hero-title.innerHTML`.

It still owns the 2000 metadata/nav treatment, sidebar parity and its existing modal-wheel behavior. Those responsibilities are intentionally deferred to later phases.

### CSS responsibility

A dedicated `v2/styles/hero.css` now owns the title artwork layout and medallion presentation.

Duplicate 2000 title rules were removed from:

- `v2/styles/legacy-parity.css`
- `v2/styles/content-expansion.css`

The base `app.css` still contains historical generic hero primitives; removing obsolete base selectors safely belongs to the final cleanup pass unless visual validation proves they interfere.

## Build validation

Vercel status for the Phase 1 code state succeeded.

Deployment dashboard:
https://vercel.com/kasper6/aswa40-films/ADG2mXX1bBFZjtmiDm7pPGEj8eyP

No production promotion or merge to `main` was performed.

## Important blocker: Animation source asset

The approved source of truth remains `assets/header-animation-01.svg`, exactly as required by the refactor guide.

However, inspection of both the current file and its original introduction commit shows that this SVG itself contains malformed/corrupted data inside one of the white title paths. This predates Phase 1 and explains why using the approved file directly can still make the Animation title fail to render.

Phase 1 deliberately does **not** substitute `header-animation-clean.svg`, because that file is explicitly not approved and visually differs from the desired artwork.

Therefore:

- the renderer problem is consolidated;
- 2000, 1975, Sci-fi and Biopics now point directly to their approved assets through one renderer;
- exact Animation visual validation remains blocked until a valid copy of the approved `header-animation-01.svg` artwork is supplied/restored.

Do not solve this with another runtime override.

## Validation still required in Work/browser

At 1440×900 and mobile, verify:

1. 2000–2024 artwork is visible and matches `header2000.webp`.
2. 1975–1999 artwork remains unchanged.
3. Sci-fi artwork remains unchanged.
4. Biopics artwork remains unchanged.
5. Animation behavior is checked after restoring a valid approved SVG source.
6. No one-frame title replacement or temporary text title occurs.
7. Hero swipe/arrows still work.
8. No browser console errors.
9. `prefers-reduced-motion` remains acceptable.

## Phase boundary

No Phase 2 sidebar refactor has started.
