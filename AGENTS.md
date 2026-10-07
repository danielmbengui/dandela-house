<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Material UI (MUI) — imports et versions

Ne pas se fier aux chemins d’import mémorisés (tutoriels v4/v5, vieux snippets). **Avant tout ajout ou changement MUI**, vérifier la doc officielle à jour :

- Intégration Next.js : https://mui.com/material-ui/guides/nextjs/
- API / composants : https://mui.com/material-ui/api/
- Migration : https://mui.com/material-ui/migration/migration-v4/

## Ce projet (référence rapide)

| Package | Version (voir `package.json`) | Usage |
|--------|-------------------------------|--------|
| `next` | 16.x | App Router |
| `@mui/material` | aligné avec `@mui/icons-material` | composants, `createTheme`, `ThemeProvider` |
| `@mui/material-nextjs` | **même version majeure** que `@mui/material` | cache SSR Emotion uniquement via sous-chemin versionné |
| `@emotion/react`, `@emotion/styled` | peer de MUI | requis avec `@mui/material` |

**Import Next.js App Router (ce repo) :**

```js
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
```

Le segment `v16-appRouter` doit correspondre à la **version majeure de Next.js** (`v15-appRouter` pour Next 15, `v16-appRouter` pour Next 16, etc.). Ne jamais copier un exemple `v13-appRouter` / `v15-appRouter` sans vérifier `package.json` → champ `"next"`.

Pour Pages Router, utiliser `@mui/material-nextjs/v16-pagesRouter` (ou la variante `vN-pagesRouter` adaptée), pas les entrées App Router.

## Interdit / obsolète

- `@material-ui/*` (pré-MUI v5)
- `@mui/styles`, `makeStyles`, `withStyles` (legacy JSS)
- `@mui/material-nextjs` **sans** sous-chemin (`/vN-appRouter` ou `/vN-pagesRouter`)
- Sous-chemin `vN-*` qui ne correspond pas à la version majeure de Next installée
- Mélanger doc Pages Router (`AppCacheProvider`, `_document`) avec ce projet App Router

## Procédure agent (obligatoire)

1. Lire `package.json` : versions de `next`, `@mui/material`, `@mui/material-nextjs`.
2. Consulter https://mui.com/material-ui/guides/nextjs/ (ou la page migration / API concernée) — pas uniquement la mémoire du modèle.
3. Confirmer que le sous-chemin existe dans `node_modules/@mui/material-nextjs/package.json` → champ `exports` (ex. `./v16-appRouter`).
4. Garder `@mui/material`, `@mui/icons-material` et `@mui/material-nextjs` sur la **même version** lors d’une montée de version.
5. Après changement d’import ou de version MUI, lancer `npm run build` ou vérifier le dev server (hydratation / modules introuvables).

## Fichiers sensibles dans ce repo

- `components/providers/AppProviders.js` — `AppRouterCacheProvider`
- `components/providers/ThemeModeProvider.js` — `ThemeProvider`, `CssBaseline`
- `lib/muiTheme.js` — `createTheme`
