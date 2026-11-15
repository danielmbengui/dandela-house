/**
 * Couleurs du plan 3D, dérivées de la charte du site (`app/globals.css`) :
 * crème / ivoire pour les fonds et les chambres, jaune drapeau adouci pour les espaces communs,
 * rouge drapeau réservé à la sélection, noir + jaune pour l'escalier.
 * La légende et la liste HTML lisent les mêmes valeurs que la scène.
 */
export const FLOOR_PALETTES = {
  light: {
    background: "#f6efe5",
    slab: "#dccfbb",
    tones: {
      room: "#fffaf2",
      common: "#f2d482",
      outdoor: "#b8c99a",
      /** Gris-bleu : distinct de la terrasse (vert), pour signaler « hors parcours ». */
      exterior: "#c5ccd6",
      service: "#d8cbb9",
      corridor: "#ece1d0",
      stairs: "#1d1718",
    },
    active: "#ce1126",
    text: "#171717",
    textMuted: "#6a5f52",
    textOnActive: "#ffffff",
    stairsText: "#f8f3ec",
    stairsTextMuted: "#ffcd00",
    /** Textes HTML posés sur le fond de la scène. */
    overlayText: "#171717",
    overlayMuted: "#6a5f52",
    exteriorText: "#5c6673",
    exteriorTextMuted: "#8a939f",
    /** Pointillés jaunes cernés de noir : lisibles sur toutes les teintes de zone. */
    path: "#ffcd00",
    pathCasing: "#1d1718",
    stairsGlow: 0,
    shadow: "#4a3622",
    groundShadow: 0.32,
    ambientSky: "#fff8ee",
    ambientGround: "#d6c4a8",
    keyLight: "#fff4e2",
    lightScale: 1,
  },
  dark: {
    background: "#1c1416",
    slab: "#2c2124",
    tones: {
      room: "#f3ede2",
      common: "#c6a45c",
      outdoor: "#7d9268",
      exterior: "#4a5059",
      service: "#8d8177",
      corridor: "#43363a",
      stairs: "#ffcd00",
    },
    active: "#ce1126",
    text: "#171717",
    textMuted: "#4d443b",
    textOnActive: "#ffffff",
    stairsText: "#171717",
    stairsTextMuted: "#4a3c00",
    overlayText: "#f3ede2",
    overlayMuted: "#a89f95",
    exteriorText: "#8b939c",
    exteriorTextMuted: "#6a7179",
    path: "#ffcd00",
    pathCasing: "#140f10",
    stairsGlow: 0.3,
    shadow: "#000000",
    groundShadow: 0.6,
    ambientSky: "#ffe9cf",
    ambientGround: "#2a1d1f",
    keyLight: "#ffe6c4",
    lightScale: 0.86,
  },
};

/** Ordre d'affichage de la légende. */
export const LEGEND_TONES = ["room", "common", "outdoor", "exterior", "service", "corridor", "stairs"];
