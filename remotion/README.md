# Vidéo promotionnelle DANDELA House (Remotion)

Présentation cinématique en **français**, configurable sans modifier les composants React.

## Commandes

| Script | Description |
|--------|-------------|
| `npm run remotion:studio` | Prévisualisation Remotion Studio |
| `npm run remotion:render` | Export MP4 vertical 1080×1920 (H.264) |
| `npm run remotion:render:16x9` | Variante paysage 1920×1080 |
| `npm run remotion:render:1x1` | Variante carré 1080×1080 |
| `npm run remotion:render:all` | Les trois exports dans `out/remotion/` |

## Structure

```
remotion/
  dandela/
    config/          # timing, formats, textes & médias (presentation.fr.ts)
    components/      # AnimatedImage, CinematicText, etc.
    DandelaPresentation.tsx
  Root.tsx
  index.ts
```

## Modifier textes ou images

Éditer **`remotion/dandela/config/presentation.fr.ts`** uniquement.

Les fichiers médias sont servis depuis **`public/`** (voir `remotion.config.ts`).

## Musique

Remplacer `public/remotion/audio/dandela-lounge-placeholder.mp3` par votre piste afro-lounge, puis mettre à jour `music.src` et `music.isPlaceholder` dans la config.

## Spécifications

- 45 s · 30 FPS · compositions 9:16 (principal), 16:9 et 1:1
- Export : `remotion render` (codec H.264 par défaut du CLI)
