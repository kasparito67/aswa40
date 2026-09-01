# ASWA40

Dashboard statique du palmarès cinéma de la communauté « Aimer Star Wars à 40 ans ».

## Structure

- `index.html` — structure sémantique de la page;
- `assets/styles.css` — styles, mise en page et animations;
- `scripts/data.js` — classement et contenu éditorial;
- `scripts/app.js` — rendu et interactions;
- `assets/posters/` — affiches optimisées en WebP;
- `assets/directors/` — portraits des réalisateurs.

## Développement local

Le site ne requiert aucune compilation. Servir simplement le dossier à l'aide d'un serveur HTTP local :

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

## Déploiement

Vercel déploie automatiquement la branche `main`. Le fichier `vercel.json` conserve la configuration du site statique.
