/** Emprise approximative de l'Angola (WGS84) — futur tracé / villes. */
export const ANGOLA_BOUNDS = {
  north: -4.38,
  south: -18.04,
  west: 11.67,
  east: 24.08,
};

/** Centre de cadrage : le continent africain entier face caméra. */
export const AFRICA_FOCUS = { lat: 2.2, lon: 18.5 };

/**
 * Repères sur le globe.
 * `roomId` : clic → fiche chambre. Les autres villes s’ajoutent ici.
 */
export const GLOBE_PINS = [
  {
    id: "luanda",
    lat: -8.8383,
    lon: 13.2344,
    labelKey: "pinLuanda",
    roomId: null,
  },
  {
    id: "sapu",
    lat: -9.6608,
    lon: 20.3915,
    labelKey: "pinSapu",
    roomId: "chambre-1",
  },
];

/** Contour simplifié de l'Angola (lat, lon). */
export const ANGOLA_BORDER_LOOP = [
  [-4.5, 12.0],
  [-5.2, 12.4],
  [-6.0, 12.1],
  [-8.0, 13.2],
  [-9.5, 13.0],
  [-10.5, 13.5],
  [-12.0, 13.8],
  [-13.5, 12.5],
  [-15.0, 12.2],
  [-16.0, 12.8],
  [-17.0, 12.0],
  [-17.8, 13.5],
  [-17.5, 15.5],
  [-17.0, 18.0],
  [-16.5, 20.0],
  [-15.5, 21.5],
  [-13.0, 22.5],
  [-11.0, 24.0],
  [-9.0, 24.0],
  [-7.5, 22.8],
  [-6.5, 21.0],
  [-5.5, 19.0],
  [-4.8, 16.5],
  [-4.5, 14.0],
  [-4.5, 12.0],
];
