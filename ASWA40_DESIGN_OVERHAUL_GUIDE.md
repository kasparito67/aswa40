# ASWA40 — Design Overhaul Guide

This document is the source of truth for the visual redesign of ASWA40. Any new chat, Work session, or implementation pass must read this file before changing the redesign branch.

## 0. Branches and safety

- Production branch: `main`
- Production URL: `https://aswa40-films.vercel.app/`
- Design branch: `design-overhaul-sept11`
- Audit/debug branch: `audit-debug-sept11`
- The design branch already includes the validated audit/debug fixes from `audit-debug-sept11` as of commit `33130a791329eae35b2a35f1926bfaf0fb4f5f10`.
- Never modify `main` while exploring or integrating the redesign.
- Never merge or promote the redesign without an explicit user instruction such as “go live”, “merge”, “push to production”, or equivalent.
- Every meaningful implementation phase must have a Vercel preview and pass the existing project audit + browser smoke tests before being considered complete.

## 1. Project intent

The goal is not to rebuild ASWA40 from scratch. The goal is to make it feel like a deliberately art-directed, credible cinephile/editorial site rather than a generic AI-generated interface.

The current live architecture is considered stable and valuable. The redesign should preserve that architecture unless a design direction genuinely cannot be achieved without structural change.

The redesign process is intentionally iterative:

1. visual references and image exploration;
2. fast visual hypotheses;
3. disposable HTML prototypes when interaction/geometry needs testing;
4. visual validation;
5. translation into the stable ASWA40 architecture;
6. phased integration;
7. QA and visual regression checks;
8. optional production promotion only after explicit approval.

## 2. Current visual scope

### Preserve initially

At the beginning of the redesign, preserve these parts of the existing experience unless a later direction explicitly challenges them:

- current hero/background imagery;
- current header identity per Top;
- current navigation model and overall navigation placement;
- current desktop native horizontal Top carousel;
- current mobile navigation behavior;
- current rollovers / interaction logic;
- current routed URLs and browser history behavior;
- current modal logic;
- current lazy rendering / progressive loading behavior;
- current data model and canonical film rankings.

### Redesign deeply

The first visual overhaul should focus on:

- typography system;
- section composition;
- ranking hierarchy;
- film tiles/cards;
- spacing rhythm;
- separators, rules and labels;
- sidebar / collective insights;
- disclosure sections;
- overlays and secondary information;
- modal skinning where appropriate;
- desktop/mobile visual consistency;
- overall editorial density and composition.

### Open explorations

These are explicitly allowed even if they blur the line between hero and content:

- letting the hero/background image continue behind lower sections;
- transparent or semi-transparent section surfaces;
- background blur or tonal overlays;
- custom glass-like surfaces;
- layered depth between image, typography and content;
- sticky or floating section labels;
- partial bleed layouts;
- poster crops and image-first compositions.

The hero is therefore “preserved initially”, not permanently locked.

## 3. Art direction principles

The intended character is editorial, cinematic, minimal and designed.

Reference language:

- Swiss / international typographic discipline;
- strong grid and alignment logic;
- cinematic imagery used as structure, not decoration;
- minimal but intentional typography;
- controlled negative space;
- thin rules and precise rhythm;
- image-first poster presentation;
- hierarchy through scale, weight and spacing rather than card chrome;
- modern cultural-institution / cinémathèque / festival / magazine sensibility.

### Glassmorphism rule

Glassmorphism is NOT forbidden.

What is forbidden is generic UI-kit glassmorphism: soft rounded rectangles, excessive blur, neon edge glows, generic gradients, floating dashboard cards and decorative effects with no compositional reason.

If transparency/glass is used, it should feel custom to ASWA40:

- restrained blur;
- flat or nearly-flat geometry;
- subtle contrast;
- minimal borders;
- strong typographic alignment;
- few radii or no radii unless they serve a specific composition;
- depth created by image + type + opacity, not by shiny effects.

A useful shorthand: **Swiss editorial discipline with cinematic translucency**, not “premium SaaS glass UI”.

## 4. Prototype rule

HTML prototypes are disposable design tools.

They may:

- simplify data;
- use only one Top;
- fake content;
- hardcode positions;
- test new layout models;
- ignore routing and production architecture;
- use experimental CSS freely.

They must NOT become the production implementation by default.

When the user says “OK pousse ça dans le site”, it means:

> Reproduce the approved visual idea inside `design-overhaul-sept11` while preserving the stable production architecture as much as possible.

Do not copy prototype architecture blindly into the real app.

## 5. Implementation decision rule

Before translating any approved mockup into the real site, classify the change.

### Class A — Skinning / low structural risk

Examples:

- typography;
- colors;
- backgrounds;
- opacity;
- borders/rules;
- tile aspect treatment;
- spacing;
- hover styling;
- section visual hierarchy;
- grid sizing;
- visual positioning that does not change state logic;
- cosmetic modal changes.

Action: implement directly on the design branch without asking again.

### Class B — Layout adaptation / moderate risk

Examples:

- changing DOM grouping while preserving the same data and behavior;
- moving sidebar content into a new layout region;
- turning cards into rows or layered compositions;
- extending hero imagery into content;
- sticky labels;
- changing how sections flow responsively;
- changing what is visually mounted while keeping the existing renderer logic.

Action: implement if it can be done locally and safely. Preserve behavior first. Mention the architectural adaptation in the phase summary.

### Class C — Structural overhaul / high risk

Examples:

- replacing the renderer;
- changing route architecture;
- changing the desktop native carousel engine;
- replacing mobile navigation mechanics;
- changing the canonical data model;
- changing lazy-loading strategy fundamentally;
- replacing modal state/navigation architecture;
- introducing a second competing interaction engine;
- restructuring the app in a way that invalidates current smoke tests.

Action: STOP before implementation and explain:

1. why the approved design cannot be achieved cleanly with the current architecture;
2. what part would need to change;
3. what could break;
4. the lowest-risk alternative;
5. whether the structural change is actually worth it.

Proceed only after explicit user approval.

## 6. Creation and development phases

### Phase 0 — Stable redesign baseline

Goal: establish the redesign branch as the safe starting point.

Status: COMPLETE.

Requirements:

- branch `design-overhaul-sept11` exists;
- branch includes the latest audit/debug fixes;
- `main` remains untouched;
- audit and browser smoke tooling are present;
- current live design is the visual baseline.

### Phase 1 — Visual research and art-direction exploration

Goal: discover a clear visual language before touching production layout.

Work may include:

- user references;
- generated image mockups;
- cropped interface studies;
- typography studies;
- poster-grid studies;
- section-title treatments;
- transparency/background experiments;
- Swiss grid explorations;
- comparisons of 2–4 art-direction variants.

Deliverable:

- one preferred direction or a tightly defined hybrid;
- explicit notes on what the user likes/dislikes;
- no production implementation required.

Gate to Phase 2:

The user identifies a direction worth testing structurally.

### Phase 2 — Disposable HTML design prototypes

Goal: test visual hypotheses that are hard to judge from still images.

Prototype only what is necessary:

- one representative Top first, preferably `1975-1999` or another Top chosen by the user;
- ranking section;
- one secondary section;
- insight/sidebar treatment;
- optional modal or hover test if relevant;
- desktop first unless the concept is specifically mobile-driven.

The prototype is allowed to be fake and simplified.

Questions this phase should answer:

- Does the hierarchy feel editorial rather than dashboard-like?
- Does transparency improve the page or reduce legibility?
- Should the hero image continue into the content?
- Are posters framed, full-bleed, masked, or almost frameless?
- How much information is visible before hover/click?
- How does the system breathe on wide desktop screens?
- What is the corresponding mobile rhythm?

Gate to Phase 3:

User says some equivalent of “this is the direction”, “keep this”, or “push this into the site”.

### Phase 3 — Extract the visual system

Goal: convert the approved prototype into a reusable ASWA40 design system before styling every Top.

Define:

- type scale;
- font roles;
- spacing scale;
- grid widths;
- section rhythm;
- line/rule system;
- corner-radius policy;
- opacity/transparency levels;
- blur levels if any;
- surface hierarchy;
- poster ratios/crops;
- hover/reveal rules;
- section-title anatomy;
- sidebar/insight anatomy;
- mobile equivalents;
- responsive breakpoints only if existing breakpoints are insufficient.

Prefer CSS variables and shared component rules over per-Top overrides.

Gate to Phase 4:

The design system can explain the approved mockup without relying on one-off magic numbers everywhere.

### Phase 4 — Core production skinning

Goal: apply the new system to the real renderer while protecting the stable architecture.

Suggested order:

1. global typography and page rhythm;
2. shell/background treatment;
3. section headers/disclosures;
4. film tile system;
5. featured #1 / #2–5 hierarchy;
6. regular ranking grid;
7. full-ranking progressive section;
8. insights/sidebar;
9. hover states;
10. modal skin if included in the approved direction.

Rules:

- use existing runtime/data bindings;
- avoid introducing a new override file unless it has a clear long-term responsibility;
- do not create `final.css`, `fix.css`, `qa-final.css`, etc.;
- edit responsibility-based files or introduce one clearly named redesign layer that can later be consolidated;
- preserve all audit/debug fixes.

Deliverable:

- Vercel preview of the real site on `design-overhaul-sept11`;
- phase commit(s) with coherent scope.

### Phase 5 — Responsive translation

Goal: make mobile feel designed, not merely collapsed desktop.

Check:

- hero continuity;
- section spacing;
- title scale;
- 2-column poster hierarchy where appropriate;
- #1 dominance;
- touch-safe interactions;
- transparency legibility;
- modal vertical flow;
- edge-to-edge vs inset decisions;
- no horizontal overflow;
- no mobile regressions in swipe/navigation.

Do not alter the validated mobile interaction engine simply to achieve a cosmetic effect.

### Phase 6 — Multi-Top adaptation

Goal: verify that the system works across all seven Top personalities.

Test at minimum:

- `1975-1999` — dense classic-cinema test;
- `2000-2024` — large ranking and existing strong hero identity;
- `sci-fi-realiste` — different title treatment;
- `animation` — illustration/color stress test;
- `biopics` — shorter ranking;
- `documentaires` — Top 15 + long ranking;
- `rewatched` — Top 50 + very long ranking.

Per-Top differences should primarily come from content, hero art, accent and image character — not seven separate component systems.

### Phase 7 — Interaction and motion polish

Goal: make the finished visual system feel deliberate without destabilizing navigation.

Allowed examples:

- hover reveals;
- subtle opacity/scale response;
- section-opening polish;
- lightweight modal transitions;
- subtle text/image motion;
- responsive poster emphasis.

Do not replace the desktop native carousel or validated mobile navigation unless separately approved as a Class C change.

Motion should not become a decorative layer that competes with browsing.

### Phase 8 — QA / regression / cleanup

Run:

- project audit;
- browser smoke desktop;
- browser smoke mobile;
- all seven routes;
- browser Back/Forward;
- section open/close abuse tests;
- progressive “Voir plus” loading;
- modal open/close/next/prev;
- keyboard navigation;
- trackpad horizontal navigation;
- vertical scroll stress;
- mobile touch navigation;
- image loading and broken-asset check;
- reduced-motion check;
- responsive checks at representative widths.

Also perform a human visual pass for:

- accidental AI-looking UI motifs;
- inconsistent radii;
- arbitrary spacing;
- typography drift;
- weak hierarchy;
- low contrast through transparency;
- excessive effects;
- per-Top exceptions that should instead be systemic.

### Phase 9 — Handoff and production candidate

Goal: freeze a candidate that any chat can understand and safely continue.

Before requesting production promotion:

- update `ASWA40_HANDOFF.md`;
- summarize new visual system and file responsibilities;
- record current branch HEAD;
- record known intentional exceptions;
- document any structural changes approved during the redesign;
- confirm audit + smoke tests green;
- user visually validates Vercel preview.

Only then may the user explicitly request promotion to `main`.

## 7. Vercel preview workflow

For implementation phases:

1. make changes only in `design-overhaul-sept11`;
2. commit coherent changes;
3. wait for Vercel preview status SUCCESS;
4. provide the preview URL;
5. user validates visually;
6. iterate in the same branch;
7. do not merge to `main` during exploration.

For pure image exploration and disposable HTML mockups, Vercel is optional unless the user needs interactive review.

## 8. File strategy

Current stable runtime split should be preserved unless a Class C change is approved.

Important principles:

- data files remain canonical;
- navigation logic remains owned by the current stable desktop/mobile engines;
- CSS should be responsibility-based;
- avoid a long tail of patch files;
- if a temporary prototype stylesheet is created, it must be clearly marked experimental and removed or consolidated once the direction is approved;
- never solve design inconsistencies by stacking endless `!important` overrides.

## 9. Definition of “push this into the site”

Unless the user explicitly says “live”, “production” or “main”, the word **site** during this redesign means:

`design-overhaul-sept11`

It does NOT mean the production site.

Default behavior after this instruction:

- Class A change → implement immediately in design branch.
- Class B change → implement safely, mention structural adaptation afterward.
- Class C change → warn before implementation and request explicit approval.

## 10. Creative north star

ASWA40 should feel like a site a small group of obsessive cinephiles commissioned from a strong editorial design studio.

It can be playful, strange, referential and different from Top to Top — but the underlying design logic should feel intentional.

Avoid:

- generic AI dashboard composition;
- feature-card grids everywhere;
- unnecessary capsules;
- arbitrary rounded rectangles;
- fake-premium gradients;
- decorative film motifs used literally;
- overdesigned skeuomorphism;
- visual noise that does not improve hierarchy.

Prefer:

- strong composition;
- confident type;
- image scale;
- restraint;
- asymmetry when useful;
- consistent grids;
- precise alignment;
- controlled transparency;
- cinematic atmosphere;
- useful interaction reveals;
- systems that survive all seven Tops.

## 11. First working objective

The first redesign experiment should answer one central question:

> What does ASWA40 look like when the current cinematic heroes feed into a much more editorial, transparent, Swiss-influenced content system below them?

Start visually. Do not start by rewriting production code.
