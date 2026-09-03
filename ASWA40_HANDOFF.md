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
- Branch: `main`
- GitHub `main` is the stable code source of truth unless **Active local work** below names another working branch.
- Always resolve the current branch HEAD instead of relying on a copied commit hash.

### Official public / visual reference

`https://aswa40-films.vercel.app/`

This is the public production reference. The historical `aswa40-films-live` project was deleted on 2026-09-02 and must not be used as a visual source of truth.

### Current production / finalization state

`v0.9.9` remains the visible version label and the accepted baseline for the ASWA40 2000–2024 site. A small post-`v0.9.9` finalization batch is now present on `main` and deployed:

- film-detail panels have **previous / next navigation arrows**;
- ranked films navigate in ranking order and wrap from `#135 → #1` and `#1 → #135`;
- “Grands oubliés” navigate within their own ordered set;
- keyboard **Left / Right Arrow** performs the same navigation while a detail panel is open;
- mobile supports **swipe left = next** and **swipe right = previous**;
- swipe recognition uses a horizontal threshold and dominance check so ordinary vertical scrolling does not trigger navigation accidentally;
- accessible labels identify the previous/next title;
- navigation now animates the **entire detail card**, not only its inner content: the current card slides slightly out in the navigation direction and the next card enters from the opposite side;
- the directional slide applies consistently to arrow buttons, keyboard navigation and mobile swipe;
- motion is intentionally restrained on desktop and slightly more pronounced on mobile so the interaction reads naturally as a swipe/carousel gesture;
- rapid repeated navigation is temporarily locked while the transition is running to prevent visual glitches;
- `prefers-reduced-motion` bypasses the slide animation and switches cards directly.

The cinematic detail-card treatment from `v0.9.7–0.9.9` remains intact: local TMDB backdrops, vertical transparency fade, larger poster, Letterboxd link, and stale-backdrop protection.

### Current header direction

The current header remains LOTR-inspired:

- current local hero asset: `assets/cinema-hero.jpg`;
- title artwork: `assets/header-title.png`;
- semantic H1 remains in the DOM behind the image treatment;
- title sits high in the hero, with diffuse CSS drop shadow / halo;
- circular scroll cue uses a thin outline and subtle floating motion;
- palette is gold / bronze for surrounding UI accents;
- body/UI remains Inter Tight;
- editorial/display titles use a visible serif treatment.

**Pending requested header change:** replace the current hero image with the TMDB backdrop at:

`https://image.tmdb.org/t/p/original/oiwc338EoBgS4sEI2ixAny4KQKg.jpg`

This has **not yet been applied**. When implementing it, follow the existing TMDB asset policy: fetch it through the authenticated/local asset workflow and serve a local repository copy. Do not hotlink the TMDB image URL in browser code.

### Latest validated visual / UX state

- LOTR title artwork is smaller and positioned 45 px higher using layout positioning independent from its entrance animation.
- The title has a strong diffuse CSS drop shadow.
- Hero image is brighter than the earlier pass.
- Logo and circular scroll cue float subtly and stop under `prefers-reduced-motion`.
- Circular cue smoothly scrolls to the first Top 25 section.
- “Insights collectifs” heading is intentionally removed.
- “Année reine” uses a crown icon; “Le quatuor” uses a clapper icon.
- Director portraits and rows link to IMDb.
- Year and Director card rollover outlines use gold/bronze.
- All 135 ranked-film posters and 15 “Grands oubliés” posters are local TMDB-sourced assets.
- All current film / forgotten-film detail panels use local TMDB backdrops.
- Opening a different film never flashes the previous backdrop; stale image load events are ignored.
- On mobile, #1 spans the Top 5 grid width; #2–5 follow in two columns. The winner keeps both crown and rank visible.
- Detail-card previous/next navigation uses a full-card directional slide so backdrop, poster, text and controls move together as one object.

### Phase status

- **Status: active finalization batch on top of accepted `v0.9.9`.**
- Detail-panel arrow / keyboard / swipe navigation is implemented and deployed.
- Full-card directional transition for detail navigation is implemented and deployed.
- The requested replacement header backdrop is still pending.
- Do not bump or infer a new visible version number unless the user explicitly validates / names the next release.

### Active local work

- None for the 2000–2024 site at this moment.
- Treat current `main` as the working baseline for the next 2000–2024 change.

### Immediate rule for every space

When resuming in Master, Local or Work:

1. Read this file.
2. Check **Active local work**.
3. If none is active, start from current `main`.
4. Read only files relevant to the requested change; do not begin with a full audit.
5. Preserve unrelated validated work and UX invariants.
6. Batch related changes.
7. Update this handoff after a coherent validated batch or roughly ten related micro-iterations.
8. Verify Vercel and the public URL separately before declaring a production change live.

## 1. Current architecture

The site is static with separated responsibilities:

- `index.html` — semantic structure, sections, sidebar and modal shell
- `assets/styles.css` — main visual system, layout, responsive rules and animations
- `assets/top5-hover-fix.css` — late-loading override layer carrying Top 5 + recent hero/type/palette refinements
- `scripts/data.js` — film ranking, poster references and editorial data
- `scripts/backdrops.js` — generated local TMDB backdrop mappings
- `scripts/app.js` — rendering, accordions, modal content, cover-flow, progressive ranking loading, parallax and year interactions
- `scripts/detail-nav.js` — film-detail previous/next navigation, keyboard navigation, mobile swipe handling and full-card directional transition
- `assets/posters/2000-2024/` — 135 local ranked-film posters
- `assets/grands-oublies/2000-2024/` — 15 local “Grands oubliés” posters
- `assets/backdrops/2000-2024/` — ranked-film local backdrops
- `assets/backdrops/grands-oublies/` — “Grands oubliés” local backdrops
- `data/2000-2024/poster-manifest.json` — audited TMDB poster correspondences
- `scripts/fetch-posters-2000-2024.mjs` — authenticated poster-fetch utility
- `assets/tmdb-logo.svg` — official TMDB attribution mark
- `assets/directors/` — local director portraits
- `assets/cinema-hero.jpg` — current hero image, pending requested replacement
- `assets/header-title.png` — LOTR-style hero title artwork
- `favicon.svg` — cinema clapper favicon
- `vercel.json` — static Vercel configuration

Do **not** return to the old monolithic `aswa40_prod_deploy.html` workflow.

## 2. Deployment / production guardrail

The sole production project is `aswa40-films`.

Official URL:

`https://aswa40-films.vercel.app/`

Before calling a change live:

1. Read current GitHub `main`.
2. Check the Vercel status for `aswa40-films`.
3. Verify the actual public page.
4. Never say “live” only because a GitHub commit succeeded.

Historical note: the deleted duplicate `aswa40-films-live` project caused redundant builds and contributed to `build-rate-limit` failures.

## 3. TMDB image / attribution policy

- TMDB is the standard source for ASWA40 poster / backdrop assets.
- Fetch via authenticated build / asset tooling, then serve local repository copies.
- Never expose `TMDB_ACCESS_TOKEN` in browser code, committed source, handoff text or logs.
- Do not hotlink TMDB image URLs in the production browser experience.
- Each TMDB-powered Top uses one discreet shared footer with the official TMDB logo and:
  `This product uses the TMDB API but is not endorsed or certified by TMDB.`
- TMDB attribution does not imply blanket rights to the underlying movie artwork; treat it as third-party copyrighted promotional material.

## 4. UX / visual invariants

### Header / hero

- LOTR direction is intentional.
- Inter Tight remains the UI/body typeface.
- Editorial/display headings use serif treatment.
- `2000–2024` is roman, not italic.
- Hero has subtle parallax.
- Preserve refined header spacing / title position.
- Use CSS for title scale, position and shadow; do not edit `header-title.png` unless artwork itself changes.
- Keep the 45 px upward title offset independent from entrance-animation transform.
- Preserve semantic H1 behind the title artwork.
- Gold/bronze accents and circular cue are intentional.
- Motion must respect `prefers-reduced-motion`.

### Main sections

Sections:

1. `TOP 25`
2. `#25–135` / full ranking
3. `Les grands oubliés`
4. `Les OVNIS`

Opening one section must not force-close the others. Sections already open in initial HTML must render in final state on refresh; section-entry animation is for explicit user opening only.

### Top 25

- `#topHero` = Top 5.
- `#topRest` = ranks 6–25.
- Desktop cover-flow is intentional.
- Top 5 rollover: tile grows more than poster, revealing slightly more crop; no cover→contain jump, no black bars, no shrinking-poster impression.
- Mobile: #1 spans full width, #2–5 use two columns; winner crown and rank both remain visible.

### Full ranking #26–135

- Progressive batches are preserved on close/reopen.
- Cover-flow neighbours are calculated by visual row, not rank adjacency.
- Desktop poster ratio stays `2:3` with `object-fit:cover` and no letterbox bands.

### Detail panels

- Film and “Grand oublié” panels use local TMDB backdrops with a vertical fade.
- Backdrop remains hidden until the requested image has loaded; stale load events must not reveal a previous film.
- Poster remains enlarged and Letterboxd link stays visually aligned near poster bottom.
- Previous / next arrows remain part of the panel navigation.
- Ranked-film arrows follow ranking order and wrap at the ends.
- “Grands oubliés” arrows navigate only within the forgotten-film set.
- Keyboard Left / Right navigates when the modal is open.
- Mobile swipe left / right navigates next / previous, with enough horizontal threshold to preserve vertical scrolling.
- **The entire modal card moves as one unit during navigation**: backdrop, poster, text, Letterboxd link, close control and nav controls stay visually attached.
- Navigating forward sends the current card slightly left and brings the next card in from the right; navigating backward mirrors that direction.
- Desktop movement stays restrained; mobile gets a slightly larger translation so the gesture feels naturally connected to swiping.
- Buttons, keyboard and swipe all use the same directional animation language.
- Repeated inputs are ignored while a transition is running to avoid double-navigation glitches.
- `prefers-reduced-motion` switches directly without the directional slide.

### Sidebar

Four editorial insight accordions plus Year and Director special cards; no visible group heading.

- Religion commune
- Monsieur Consensus
- Duo cinéphile
- OVNI culturel
- Année reine
- Le quatuor

Year / Director UI accent borders remain gold/bronze. The year chart’s semantic highlight red is intentionally distinct from the card UI palette.

### Director quartet

- Denis Villeneuve
- Christopher Nolan
- Quentin Tarantino
- Wes Anderson

Paul Thomas Anderson is intentionally excluded. Portraits and detail rows link to IMDb.

## 5. Data / rendering details worth preserving

- All current poster references are local; no base64 / third-party runtime poster URLs remain.
- `scripts/backdrops.js` maps each film / forgotten film to local backdrop assets.
- Letterboxd URLs include manual slug exceptions for franchises.
- Some editorial modal detail exists only for selected ranks.
- Full-ranking poster images use deferred `data-src` loading.
- Responsive column count affects progressive batch sizes.
- Cover-flow is enabled only when `(hover:hover) and (pointer:fine)` matches.
- Reduced-motion preferences are respected.

## 6. Three-space working method

### Master chat

- Read this handoff first.
- Start from **Active local work** if one exists, otherwise current `main`.
- Inspect targeted files / branch diff only.
- Preserve validated work.
- Prefer a coherent batch instead of chains of tiny production commits.
- Update handoff after a meaningful validated batch.

### Local

- Use a named branch for visual exploration.
- Record branch name and starting `main` commit under **Active local work**.
- Test locally rather than through Vercel.
- Update branch handoff at meaningful checkpoints.
- Promote only after user validation.

### Work

- Read handoff and active branch first.
- Continue the unfinished branch when the task belongs to it.
- Make the smallest coherent change.
- Update handoff when decisions, branch status or remaining work materially change.
- Verify Vercel / public page separately from GitHub push success.

## 7. Continuity rule

If conversation memory conflicts with this file, current GitHub code wins for code state. If `main` and production disagree, treat `main` as the latest source and production as potentially stale until verified.

For visual/product decisions, Master chat is the decision thread; once recorded here, Local and Work should follow the handoff without asking the user to restate them.
