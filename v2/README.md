# ASWA40 Platform Rebuild

Branche de travail: `platform-rebuild`.

Objectif: reconstruire ASWA40 comme une plateforme data-driven capable d'accueillir un nombre arbitraire de tops sans recoder la navigation ni les composants.

## Architecture

- `v2/index.html` : shell de la nouvelle plateforme
- `v2/styles/app.css` : design system et layout partagés
- `v2/scripts/data.js` : registre des tops et contenus
- `v2/scripts/app.js` : rendu, navigation, swipe, modales et interactions
- `old/v0.9-final/` : archive du legacy avant bascule finale

## Principe d'ajout d'un top

1. Ajouter ses assets dans `assets/`.
2. Ajouter un objet dans `TOPS` dans `v2/scripts/data.js`.
3. Déclarer son hero, son titre, ses films, sections et insights.
4. Aucun changement de navigation requis: le rail s'adapte automatiquement à N tops.

Le site actuel reste intact sur `main` pendant tout le rebuild.

Preview retrigger: 2026-09-04.
