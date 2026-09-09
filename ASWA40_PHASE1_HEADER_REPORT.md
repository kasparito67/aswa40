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

- 2000–2024 → `../assets/header-title.png`
- 1975–1999 → `../assets/header-title-1975-1999.svg`
- Sci-fi réalistes → `../assets/header-sci-fi.svg`
- Animation → `../assets/header-animation-01.svg`
- Biopics → `../assets/header-Biopics.svg`

For 2000–2024, `header-title.png` is the valid 1,288,767-byte PNG corresponding to the artwork embedded in the supplied `header2000.svg`. The malformed `header2000.webp` is no longer referenced.

For Animation, `header-animation-01.svg` has been restored from the valid supplied SVG source; the corrupted repository copy is no longer used.

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

## Asset repair after browser validation

Two source-asset failures were exposed once the renderer was consolidated:

1. `assets/header2000.webp` was not a valid renderable WebP. The canonical configuration now uses `assets/header-title.png`, which is the valid source-equivalent PNG already present in the repository.
2. `assets/header-animation-01.svg` contained malformed path data. It has been replaced with the valid supplied SVG source.

No post-render patch or second renderer was introduced to solve these issues.

## Validation still required in Work/browser

At 1440×900 and mobile, verify:

1. 2000–2024 artwork is visible and matches the supplied source.
2. 1975–1999 artwork remains unchanged.
3. Sci-fi artwork remains unchanged.
4. Biopics artwork remains unchanged.
5. Animation artwork is visible and matches its supplied SVG.
6. No one-frame title replacement or temporary text title occurs.
7. Hero swipe/arrows still work.
8. No browser console errors.
9. `prefers-reduced-motion` remains acceptable.

## Phase boundary

No Phase 2 sidebar refactor has started.
