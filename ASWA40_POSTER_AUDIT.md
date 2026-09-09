# ASWA40 — Phase 3B poster audit

Audit final automatisé du 9 septembre 2026.

## Résultat

- Films inspectés : **448**
- Posters valides : **446**
- URLs/assets invalides : **0**
- Films avec `tmdbId` canonique/vérifié : **444**
- Posters encore non résolus : **2**, tous deux documentés comme exceptions éditoriales nécessitant une identification humaine.

## Par Top

| Top | Posters valides | Manquants | Invalides | `tmdbId` vérifiés |
| --- | ---: | ---: | ---: | ---: |
| 1975–1999 | 90/90 | 0 | 0 | 89 |
| 2000–2024 | 135/135 | 0 | 0 | 135 |
| Sci-fi réalistes | 66/66 | 0 | 0 | 66 |
| Animation | 88/90 | 2 | 0 | 87 |
| Biopics | 67/67 | 0 | 0 | 67 |

## Exceptions éditoriales à valider

### Animation #41 — `LE...K`

Le titre présent dans les données ASWA40 ne permet pas d’identifier le film de façon fiable. Les résultats TMDB proposés ne correspondent pas de manière suffisamment certaine au choix éditorial. Aucun résultat n’est donc sélectionné automatiquement.

### Animation #89 — `Magnificent Life`

TMDB propose plusieurs résultats potentiels, dont `A Magnificent Life` (2025), mais rien dans les données actuelles ne permet de confirmer qu’il s’agit du film classé. Aucun résultat n’est sélectionné automatiquement.

Ces deux entrées conservent le fallback ASWA40 en attendant une identification humaine. Elles ne sont pas comptées comme posters résolus.

## Architecture mise en place

- `scripts/fetch-posters-new-tops.mjs` résout les films vérifiés via le secret serveur `TMDB_ACCESS_TOKEN`.
- Les posters résolus sont téléchargés localement en `w500`.
- Les métadonnées publiques canoniques sont générées dans `v2/scripts/poster-metadata.js`.
- `v2/index.html` charge ces métadonnées avant le rendu des cartes.
- `scripts/audit-posters-all-tops.mjs` vérifie l’état runtime réel de chaque poster.
- `.github/workflows/audit-posters-all-tops.yml` relance automatiquement l’audit lorsque les posters, manifests ou métadonnées changent.
- Aucune clé TMDB n’est ajoutée au code client; seul le secret GitHub Actions est utilisé.

## Règle de validation

Aucun candidat ambigu n’est promu automatiquement. Les titres, années et identifiants doivent être suffisamment établis avant d’être ajoutés aux métadonnées canoniques.

## État Phase 3B

**446/448 posters résolus, 0 asset cassé.** Les deux seuls cas restants sont explicitement documentés ci-dessus et nécessitent une confirmation éditoriale. La Phase 4 ne doit commencer qu’après acceptation de ces exceptions ou identification des deux films.
