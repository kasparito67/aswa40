# ASWA40 — Phase 3 modal

## Mission
Consolider la fiche-film et toutes ses interactions dans un seul système, sans MutationObserver ni handlers concurrents.

## Résultat
- `v2/scripts/app.js` devient la source unique pour ouvrir, remplir et naviguer la modal.
- Poster, backdrop, texte et lien Letterboxd sont résolus avant affichage.
- Le film courant reste visible jusqu’à ce que les médias du suivant soient prêts.
- Un geste horizontal trackpad / Magic Mouse = un film, avec verrou d’inertie.
- Swipe tactile, clic précédent/suivant, clavier et fermeture sont gérés au même endroit.
- Les médias voisins sont préchargés.
- `modal-polish.js` et `interaction-fix.js` ne sont plus chargés par `v2/index.html`.
- Le vieux handler wheel de `legacy-parity.js` est retiré.
- Les styles validés restent dans `modal-polish.css` / `interaction-fix.css` pour éviter une régression visuelle pendant cette phase.

## Validation à faire
- plusieurs films successifs sans flash de l’ancien;
- poster gauche / backdrop horizontal / texte droite;
- Letterboxd associé au bon film;
- clic, clavier, touch, Magic Mouse et trackpad;
- un geste = un film;
- scroll vertical mobile préservé;
- reduced motion;
- fermeture bouton, Échap et clic extérieur.
