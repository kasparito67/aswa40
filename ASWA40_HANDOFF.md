# ASWA40 — Canonical Project Handoff

This file is the shared source of truth for ChatGPT Chat, Work, and any future development session.

## 1. Canonical repository

- Repository: `kasparito67/aswa40`
- Branch: `main`
- Always read the current `main` before editing.
- Do not restart from an old exported HTML, old artifact, preview snapshot, or previous chat attachment.
- `main` is the code source of truth. Production must be verified separately because Vercel may lag behind `main`.

## 2. Current architecture

The project is a static site with separated responsibilities:

- `index.html` — semantic page structure and sidebar markup
- `assets/styles.css` — main visual system, layout, responsive rules, animations and rollover states
- `scripts/data.js` — film ranking, poster references and editorial data
- `scripts/app.js` — rendering, accordions, modals, cover-flow, progressive ranking loading, parallax and year-chart interactions
- `assets/posters/` — local poster assets
- `assets/grands-oublies/` — local posters for “Les grands oubliés”
- `assets/directors/` — local director portraits
- `assets/cinema-hero.jpg` — current hero image
- `favicon.svg` — cinema clapper favicon
- `vercel.json` — static Vercel config

Important: do **not** return to the old monolithic `aswa40_prod_deploy.html` workflow. It is not the current architecture.

## 3. Deployment / production guardrail

There have historically been two Vercel projects connected to this repository (`aswa40-films` and `aswa40-films-live`). Do not guess which deployment is current from memory alone.

Before a manual deploy or when checking whether a change is live:

1. Read current GitHub `main`.
2. Inspect the Vercel deployment associated with the intended production alias.
3. Verify the actual public page after deployment.
4. Never say “live” only because a GitHub commit succeeded.

The public URL currently used in the active ASWA40 project conversation is:

`https://aswa40-films.vercel.app/`

Treat this as the visual verification target unless the user explicitly changes the production target.

Known issue: Vercel has recently rejected deployments with `build-rate-limit`. In that situation, GitHub can be ahead of production.

## 4. Working method

Prefer a Work-like development method even when operating from a normal chat:

- Read the current relevant source files first.
- Batch related UI changes.
- Edit the real source files directly.
- Prefer one coherent commit per correction batch.
- Avoid temporary GitHub Actions for simple CSS/JS edits.
- Avoid chains of tiny commits that trigger unnecessary Vercel builds.
- Verify the deployment after the commit before declaring success.
- Never overwrite unrelated visual work while fixing a local bug.

## 5. UX / visual invariants

### Header / hero

- Current LOTR hero is intentional.
- Inter Tight is the site typeface.
- `2000–2024` is roman, not italic.
- Hero has subtle parallax.
- Header spacing and title position have already been refined; do not casually reset them.

### Main sections

Sections:

1. `TOP 25`
2. `#25–135` / full ranking
3. `Les grands oubliés`
4. `Les OVNIS`

Opening one section must **not force-close the others**.

### TOP 25

- `#topHero` = Top 5.
- `#topRest` = ranks 6–25.
- Desktop uses a cover-flow style interaction.
- The Top 5 should feel restrained compared with the more pronounced lower-ranking cover-flow.

Desired Top 5 rollover behavior:

- The tile grows.
- The poster also grows visually, but less than the tile.
- The larger tile should reveal slightly more of the poster through controlled cropping.
- No sudden `cover → contain` jump.
- No black bars.
- No impression that the poster shrinks inside the growing tile.

At the time this handoff was created, the latest Top 5 reveal refinement lives in `assets/top5-hover-fix.css`, loaded after `assets/styles.css`. It was committed but had not reached production because Vercel returned a build-rate-limit failure. On the next relevant cleanup, this tiny override may be consolidated into `assets/styles.css`, but only if doing so does not alter the intended behavior.

### Full ranking #26–135

- Loaded progressively in batches.
- Already-loaded batches are preserved when closing/reopening.
- Cover-flow neighbours are calculated by visual row, not ranking number.
- The progress indicator sits near the upper-right of the section content.

### Les grands oubliés

- Local poster assets are used.
- Descriptive copy stays hidden by default and appears on rollover/focus.
- The card itself enlarges fluidly.

### Insights collectifs

Sidebar contains four editorial insight accordions plus two special cards:

- Religion commune
- Monsieur Consensus
- Duo cinéphile
- OVNI culturel
- Year insight card
- Director quartet card

### Year insight

Closed state centers on:

- `2000`
- `ANNÉE REINE`
- `13 films`

Open state:

- chart covers 2000–2024
- only 2000 is red by default
- hovering another year turns that year red and temporarily turns 2000 off
- leaving restores the default 2000 state
- hovering `2000–2009` highlights the whole decade
- 2007, 2001–02, 2024 and “Le creux” act as interactive highlights
- “Le creux” corresponds to 2008, 2018 and 2020

### Director quartet

The quartet is:

- Denis Villeneuve
- Christopher Nolan
- Quentin Tarantino
- Wes Anderson

Each has four ranking entries. Paul Thomas Anderson is intentionally excluded from this tile.

Closed-state director names are not printed beside the portraits; portrait names appear on rollover. The detail dropdown lists the relevant films.

## 6. Data / rendering details worth preserving

- `scripts/app.js` renders film tiles from `scripts/data.js`.
- Letterboxd URLs include manual slug exceptions for franchises.
- Some modal editorial detail exists only for selected ranks.
- Full-ranking poster images use deferred `data-src` loading.
- Responsive column counts affect progressive batch sizes.
- Cover-flow is enabled only when `(hover:hover) and (pointer:fine)` matches.
- Reduced-motion preferences are respected.

## 7. Before every new development pass

Use this checklist:

1. Read `ASWA40_HANDOFF.md`.
2. Read current `main` for the files relevant to the requested change.
3. Check recent commits if another chat or Work session may have changed the repo.
4. Do not rely on an old chat’s cached source code.
5. Make the smallest coherent source change.
6. Commit once when practical.
7. Check Vercel status.
8. Visually verify the public target before calling the change live.

## 8. Continuity rule

If a new Chat or Work thread disagrees with this file, current GitHub `main` wins for code state. If `main` and production disagree, treat `main` as the latest source and production as a potentially stale deployment until verified.
