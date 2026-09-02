# ASWA40 — Canonical Project Handoff

This file is the shared source of truth for ChatGPT Chat, Work, and any future development session.

## 0. Current state — read this first

### Decision / coordination model

- **Master chat** is the decision and visual-direction thread.
- **Local branch chat** is the default space for visual experiments and day-to-day implementation without Vercel redeploys.
- **Work** is the targeted execution, debugging and consolidation environment, not a separate source of truth.
- Every new Master, Local or Work session must read this file and the correct Git branch before editing.
- Do not try to reconstruct state from another conversation if this file + `main` already answer the question.
- While local work is in progress, the active local branch and its copy of this file are the source of truth for that unfinished batch.
- After an important visual or architectural decision is validated, update this file in the same coherent commit so every space can resume without reading another conversation.

### Current code reference

- Repository: `kasparito67/aswa40`
- Branch: `main`
- Always resolve the current branch HEAD instead of relying on a commit hash copied into this document.
- GitHub `main` is the code source of truth.

### Official public / visual reference

`https://aswa40-films.vercel.app/`

This is the URL the user has shared publicly. Treat it as the official production/visual verification target.

Do **not** use `aswa40-films-live` as the visual source of truth unless the user explicitly changes the official URL.

### Current visual direction

The current header direction is LOTR-inspired:

- local hero image remains `assets/cinema-hero.jpg`
- title artwork is `assets/header-title.png`
- title artwork replaces the visual rendering of the semantic H1
- title should sit relatively high in the hero and feel restrained rather than oversized
- diffuse cinematic drop shadow / halo behind the title is intentional and should be done in CSS, not baked into the PNG
- scroll cue uses a thin circular outline
- accent palette is moving from red/orange toward gold / bronze
- body/UI remains Inter Tight
- editorial/display titles are intended to use a visible serif treatment while utility/body text stays sans-serif
- rollover outlines for Year and Director cards should use the gold/bronze palette, not red

### Latest production-verified visual state

The official URL and GitHub `main` were verified together after the `v0.9.2` visual batch. Version `v0.9.3` removes the section-entry flash on page refresh while preserving click-triggered accordion entry animations. Version `v0.9.4` migrates all film posters to local TMDB-sourced files and adds the required common attribution footer.

- LOTR title artwork is smaller and positioned 45 px higher using layout positioning that remains independent of its entrance animation.
- The title has a stronger diffuse CSS drop shadow for contrast.
- The hero image is approximately 10% brighter than the preceding version.
- The logo and circular scroll cue use subtle, independent floating animations; both stop when reduced motion is requested.
- The version label is aligned with the utility text at the upper-right of the hero and currently reads `v0.9.4`.
- The circular arrow is an accessible button that performs a short smooth scroll to the top of the first Top 25 section.
- The redundant “Insights collectifs” heading has been removed so the sidebar cards align from the top.
- “Année reine” has a crown icon; “Le quatuor” has a clapper icon.
- Director portraits and director detail rows link to the corresponding IMDb pages.
- Year and Director card rollover outlines use the gold/bronze palette.

Do not infer freshness from the version label alone: after any future change, compare production with current `main` and verify the official URL before declaring it live.

### Phase status

- **Status: complete and user-approved.**
- Production version `v0.9.4` is the current state for this ASWA40 2000–2024 pass.
- The refresh behavior is validated: the hero title may replay its entrance animation, but sections already open must remain visually stable.
- All 135 ranked-film posters and 15 “Grands oubliés” posters are local TMDB-sourced assets; no runtime TMDB request or token is exposed to visitors.
- A discreet footer carries the official TMDB logo and required attribution statement.
- No pending visual or functional correction is recorded after this migration.
- Future work should begin as a new, explicitly scoped batch rather than continuing an assumed unfinished pass.

### Immediate rule for every space

When resuming in Master, Local or Work:

1. Read this file.
2. Check whether **Active local work** below names a working branch.
3. If it does, read that branch and its handoff before continuing unfinished work; otherwise read current `main`.
4. Read only the source files relevant to the requested change. Do not begin with a full project audit.
5. Treat the official URL above as the production reference, while remembering it may lag behind `main`.
6. Do not ask the user to re-explain decisions already recorded here.
7. Batch related changes and prefer one coherent commit.
8. Update this `Current state` section after any major validated direction change.

### Active local work

- Status: active asset-preparation batch for the future 1975–1999 Top.
- Working branch: `local/top-1975-1999-assets`.
- Starting `main` commit: `8d40712670438700fa8e64db83735b0cd792bfc6` (`Close validated ASWA40 v0.9.3`).
- TMDB poster pipeline is configured with the GitHub Actions secret `TMDB_ACCESS_TOKEN`; never place the token in source, handoff, chat, logs or committed files.
- Current asset checkpoint: 97/97 TMDB poster candidates fetched successfully (90 ranked films + 7 editorial grands oubliés) and stored locally on this branch.
- This 1975–1999 batch is preparation only. Do not merge to `main` or deploy until the user validates the new Top and the poster correspondences.
- When local work begins, record the branch name, starting `main` commit, latest validated checkpoint, files touched and remaining work here.
- If this block says `none`, do not guess an old local branch from conversation history.

### TMDB image / attribution policy

- TMDB is the standard source for film poster assets for ASWA40 Tops.
- Fetch through an authenticated build/asset pipeline, then serve local repository copies; never hotlink posters or expose `TMDB_ACCESS_TOKEN` in browser code.
- Every TMDB-powered Top uses one discreet shared footer with the official TMDB logo and the statement: `This product uses the TMDB API but is not endorsed or certified by TMDB.`
- TMDB attribution does not imply that TMDB owns or grants blanket copyright rights to the underlying movie artwork. Treat posters as third-party copyrighted promotional material.

## 1. Canonical repository

- Repository: `kasparito67/aswa40`
- Branch: `main`
- Always fetch current `main` before editing, then follow **Active local work** if an unfinished batch is recorded.
- Do not restart from an old exported HTML, old artifact, preview snapshot, or previous chat attachment.
- `main` is the stable code source of truth. A named local branch temporarily becomes the working source for its unfinished batch. Production must be verified separately because Vercel may lag behind `main`.

## 2. Current architecture

The project is a static site with separated responsibilities:

- `index.html` — semantic page structure and sidebar markup
- `assets/styles.css` — main visual system, layout, responsive rules, animations and rollover states
- `assets/top5-hover-fix.css` — small late-loading override layer currently also carrying recent hero/type/palette experiments; this should eventually be consolidated once the visual direction stabilizes
- `scripts/data.js` — film ranking, poster references and editorial data
- `scripts/app.js` — rendering, accordions, modals, cover-flow, progressive ranking loading, parallax and year-chart interactions
- `assets/posters/2000-2024/` — 135 local TMDB-sourced ranked-film posters
- `assets/grands-oublies/2000-2024/` — 15 local TMDB-sourced posters for “Les grands oubliés”
- `data/2000-2024/poster-manifest.json` — audited TMDB correspondence manifest
- `scripts/fetch-posters-2000-2024.mjs` — authenticated poster-fetch/mapping utility; the token remains in GitHub Actions secrets
- `assets/tmdb-logo.svg` — official TMDB attribution mark
- `assets/directors/` — local director portraits
- `assets/cinema-hero.jpg` — current hero image
- `assets/header-title.png` — current LOTR-style hero title artwork
- `favicon.svg` — cinema clapper favicon
- `vercel.json` — static Vercel config

Important: do **not** return to the old monolithic `aswa40_prod_deploy.html` workflow. It is not the current architecture.

## 3. Deployment / production guardrail

There have historically been two Vercel projects connected to this repository (`aswa40-films` and `aswa40-films-live`). The official public URL currently used by the user is:

`https://aswa40-films.vercel.app/`

Use that URL as the production/visual verification target.

Before a manual deploy or when checking whether a change is live:

1. Read current GitHub `main`.
2. Inspect the Vercel deployment for `aswa40-films` / the official alias above.
3. Verify the actual public page after deployment.
4. Never say “live” only because a GitHub commit succeeded.

Known issue: Vercel has recently rejected deployments with `build-rate-limit`. In that situation, GitHub can be ahead of production.

## 4. Three-space working method

### Shared authority model

| Concern | Source of truth |
| --- | --- |
| Product and visual decisions | Master chat, once recorded in this file |
| Stable production code | GitHub `main` |
| Unfinished visual/development batch | Named local working branch + its updated handoff |
| Public visual verification | `https://aswa40-films.vercel.app/` |

Conversation memory is never authoritative for code state. The relevant branch and this handoff are.

### Procedure for Master chat

Master chat must not spend several prompts rediscovering how to edit the site. For every change request:

1. Fetch the repository and read `ASWA40_HANDOFF.md` first.
2. Read **Active local work** before choosing a branch.
3. If local work is active, inspect the targeted diff between `main` and that branch plus only the files relevant to the request. Do not audit the entire project.
4. If no local work is active, start from current GitHub `main`.
5. State the exact branch and files that will be edited before changing anything.
6. Preserve unrelated validated work and existing UX invariants.
7. Batch the requested changes into one coherent correction set.
8. For visual exploration, work locally and do not push to `main` after every iteration.
9. Once the user validates the direction, update this handoff in the same checkpoint commit.
10. Promote to `main` only when the batch is approved, then verify the official production URL before saying it is live.

Master chat should never rebuild from an exported HTML file, guess which version is current, or use `aswa40-films-live` as its reference.

### Procedure for Local branch chat

Local is the default iteration space and should avoid Vercel entirely:

1. Fetch current GitHub `main`.
2. Read this handoff; a full audit is unnecessary.
3. Create or resume one clearly named working branch for the batch, for example `local/hero-type-pass`.
4. At branch creation, record the branch name and starting `main` commit in **Active local work**.
5. Run a local server and verify changes in the local browser preview.
6. Make small local commits at meaningful validated checkpoints; do not push each micro-adjustment to `main`.
7. After each validated checkpoint, update the branch copy of this handoff with:
   - latest checkpoint commit
   - decisions validated by the user
   - files changed
   - remaining work or known issues
8. Before resuming after another space has changed `main`, fetch and compare the working branch with `main`; rebase or merge only after checking overlapping files.
9. When the batch is ready for handoff, ensure the branch is accessible to Master/Work and that its handoff is current.

Do not ask Local to “audit the latest handoff.” Ask it to **read the handoff, fetch the recorded branch and inspect only the diff and files relevant to the next request**.

### Procedure for Work

Work is used for targeted implementation, debugging, consolidation and final verification:

1. Fetch the repository and read this handoff.
2. If **Active local work** names a branch, fetch it and inspect `main...<branch>` plus relevant files only.
3. Continue from that branch when the task belongs to the unfinished local batch; otherwise start from `main` without overwriting local work.
4. Make the smallest coherent change and test locally.
5. Update the handoff whenever Work changes a validated decision, branch status or remaining task.
6. Prefer one final promotion commit or squash merge to `main` for the whole validated batch.
7. Verify Vercel and the official URL separately; a successful GitHub push is not proof that production updated.

### Promotion from Local to production

1. User validates the local batch.
2. Local branch handoff is current and **Active local work** identifies its final checkpoint.
3. Master or Work reviews the targeted diff against current `main` and resolves only real overlaps.
4. Merge or squash the validated batch into `main` once.
5. In the merged handoff, move validated decisions into **Current state** and reset **Active local work** to `none`.
6. Allow one production deployment on `aswa40-films`.
7. Verify the public page visually and functionally before calling the batch live.

### Deployment minimization

- Keep only `aswa40-films` as the production project; the historical `aswa40-films-live` project is redundant.
- Local iterations use a local server, not Vercel.
- A documentation-only or checkpoint branch should not be treated as a production release.
- Configure Vercel so the local working branch does not create preview builds, or keep it unpushed until another environment needs to resume it.
- Avoid temporary GitHub Actions for simple CSS/JS edits.
- Avoid chains of tiny commits to `main`.
- Never overwrite unrelated visual work while fixing a local bug.

## 5. UX / visual invariants

### Header / hero

- Current LOTR hero is intentional.
- Inter Tight remains the UI/body typeface.
- Editorial/display headings are moving to a serif treatment.
- `2000–2024` is roman, not italic.
- Hero has subtle parallax.
- Header spacing and title position have already been refined; do not casually reset them.
- Current title artwork is `assets/header-title.png`; use CSS for scale, vertical position and shadow rather than editing the PNG unless the artwork itself changes.
- Keep the 45 px upward title offset independent from the title entrance-animation transform so animation keyframes cannot cancel the positioning.
- The image logo is intentionally retained because its textured LOTR treatment cannot be reproduced faithfully as ordinary HTML text. Preserve the semantic H1 behind it; consider a real vector SVG or responsive WebP/AVIF delivery only as a future asset-optimization pass.
- Circular hero scroll cue and gold/bronze accents are intentional.
- Logo and arrow floating motion must remain subtle and must respect `prefers-reduced-motion`.
- The arrow click should smoothly reveal the first Top 25 section without replacing normal page navigation.

### Main sections

Sections:

1. `TOP 25`
2. `#25–135` / full ranking
3. `Les grands oubliés`
4. `Les OVNIS`

Opening one section must **not force-close the others**.

Sections already open in the initial HTML must render in their final state on refresh. The section-entry animation is reserved for accordions opened by an explicit user click; the hero title may still replay its entrance animation on refresh.

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

The latest Top 5 reveal refinement currently lives in `assets/top5-hover-fix.css`, loaded after `assets/styles.css`. Once the active hero/type/palette exploration stabilizes, this override file should be consolidated into the main stylesheet without changing the validated behavior.

### Full ranking #26–135

- Loaded progressively in batches.
- Already-loaded batches are preserved when closing/reopening.
- Cover-flow neighbours are calculated by visual row, not ranking number.
- The progress indicator sits near the upper-right of the section content.

### Les grands oubliés

- Local TMDB-sourced poster assets are used.
- Descriptive copy stays hidden by default and appears on rollover/focus.
- The card itself enlarges fluidly.

### Insights collectifs

Sidebar contains four editorial insight accordions plus two special cards. It intentionally has no visible “Insights collectifs” group heading:

- Religion commune
- Monsieur Consensus
- Duo cinéphile
- OVNI culturel
- Year insight card
- Director quartet card

Year and Director card rollover/focus outlines should use the gold/bronze accent family, not red.

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

Note: the chart’s semantic data-highlight red is distinct from the surrounding card UI accent palette, which is moving to gold/bronze.

### Director quartet

The quartet is:

- Denis Villeneuve
- Christopher Nolan
- Quentin Tarantino
- Wes Anderson

Each has four ranking entries. Paul Thomas Anderson is intentionally excluded from this tile.

Closed-state director names are not printed beside the portraits; portrait names appear on rollover. The detail dropdown lists the relevant films. Both each portrait and its corresponding detail row link to that director’s IMDb page.

## 6. Data / rendering details worth preserving

- `scripts/app.js` renders film tiles from `scripts/data.js`.
- All 150 current poster references in `scripts/data.js` point to local files; no base64 or third-party runtime image URLs remain.
- Letterboxd URLs include manual slug exceptions for franchises.
- Some modal editorial detail exists only for selected ranks.
- Full-ranking poster images use deferred `data-src` loading.
- Responsive column counts affect progressive batch sizes.
- Cover-flow is enabled only when `(hover:hover) and (pointer:fine)` matches.
- Reduced-motion preferences are respected.

## 7. Before every new development pass

Use this checklist:

1. Read `ASWA40_HANDOFF.md`, especially **Current state**.
2. Read **Active local work** and resolve the correct branch.
3. Fetch current `main` and the recorded working branch, if any.
4. Inspect only the relevant files and targeted branch diff.
5. Do not rely on an old chat’s cached source code.
6. Make the smallest coherent source change.
7. Update this handoff in the same validated checkpoint.
8. Commit once when practical and avoid pushing micro-iterations to `main`.
9. Check Vercel status only for a production promotion.
10. Visually verify `https://aswa40-films.vercel.app/` before calling the change live.

## 8. Continuity rule

If a new Chat or Work thread disagrees with this file, current GitHub `main` wins for code state. If `main` and production disagree, treat `main` as the latest source and production as a potentially stale deployment until verified.

For product/visual decisions, Master chat is the decision thread; once a decision is recorded in the **Current state** section, Work should follow it without requiring the user to restate the discussion.
