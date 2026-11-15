/**
 * Plan interactif multi-étages (section « Le parcours des chambres »).
 *
 * - Les lieux (chambres + espaces communs) viennent de l'API avec leur champ `floor`.
 * - `FLOOR_LAYOUTS` décrit les étages dessinés à la main. Une case pointe :
 *     `ref`  → un lieu en base, par son `name_normalized` (ex. « malanje ») ;
 *     `zone` → une zone fixe sans fiche en base (terrasse, parking…), libellée par i18n ;
 *     `kind` → `corridor` (circulation) ou `stairs` (escalier, relie les étages).
 * - Un étage présent en base mais sans dessin reçoit une disposition automatique.
 *
 * Niveaux : 0 = rez-de-chaussée, 1 = 1er étage, etc.
 */

/** Étage retenu quand un lieu n'a pas de `floor` en base. */
export const DEFAULT_FLOOR = 1;

/** Familles de couleur du plan (voir `components/home/floorPlan/palette.js`). */
export const TONES = ["room", "common", "outdoor", "exterior", "service", "corridor", "stairs"];

/**
 * Zones fixes (libellés : `home.floorPlan.zones.<clé>.name`, et `.tag` si `tag: true`).
 * `dbKind` : si un espace commun de ce type existe en base sur le même étage,
 * la zone prend son nom et devient cliquable.
 */
export const ZONES = {
  reception: { tone: "common", tag: true },
  kitchen: { tone: "common", dbKind: "kitchen" },
  terrace: { tone: "outdoor", tag: true, dbKind: "terrace" },
  balcony: { tone: "outdoor", tag: true },
  /** Cour / volume hors bâtiment : teinte à part, non cliquable, hors parcours client. */
  outdoor: { tone: "exterior", tag: true },
  parking: { tone: "service", tag: true, dbKind: "parking" },
  security: { tone: "service", tag: true },
  entrance: { tone: "service" },
  /** Portail réservé aux véhicules : il mène au parking, pas à la réception. */
  carEntrance: { tone: "service" },
};

/** Type de pièce commune (`rooms_common.type`) → famille de couleur. */
const COMMON_KIND_TONES = {
  terrace: "outdoor",
  parking: "service",
};

/**
 * @typedef {{ col: number, row: number, ref?: string, zone?: keyof typeof ZONES, kind?: 'corridor' | 'stairs' }} LayoutCell
 * @type {Record<number, { cols: number, rows: number, cells: LayoutCell[], path?: [number, number][] }>}
 */
export const FLOOR_LAYOUTS = {
  0: {
    cols: 4,
    rows: 6,
    cells: [
      { col: 1, row: 1, zone: "security" },
      { col: 2, row: 1, zone: "kitchen" },
      { col: 3, row: 1, zone: "outdoor" },
      { col: 4, row: 1, zone: "outdoor" },
      { col: 1, row: 2, zone: "security" },
      { col: 2, row: 2, zone: "kitchen" },
      { col: 3, row: 2, zone: "outdoor" },
      { col: 4, row: 2, zone: "outdoor" },
      { col: 1, row: 3, zone: "terrace" },
      { col: 2, row: 3, zone: "terrace" },
      { col: 3, row: 3, zone: "outdoor" },
      { col: 4, row: 3, zone: "outdoor" },
      { col: 1, row: 4, zone: "terrace" },
      { col: 2, row: 4, zone: "terrace" },
      { col: 3, row: 4, zone: "reception" },
      { col: 4, row: 4, zone: "reception" },
      { col: 1, row: 5, zone: "parking" },
      { col: 2, row: 5, zone: "parking" },
      { col: 3, row: 5, kind: "stairs" },
      { col: 4, row: 5, zone: "entrance" },
      { col: 1, row: 6, zone: "carEntrance" },
      { col: 2, row: 6, zone: "carEntrance" },
      { col: 3, row: 6, zone: "reception" },
      { col: 4, row: 6, zone: "reception" },
    ],
    /**
     * Un seul tracé, intersections sur les centres de cases : entrée voitures (1/6) → parking
     * → terrasse (1/4, 1/3, croisement 2/4, 2/3) → cuisine (2/2, 2/1).
     */
    path: [
      [1, 6],
      [1, 5],
      [1, 4],
      [1, 3],
      [2, 4],
      [2, 3],
      [2, 2],
      [2, 1],
    ],
  },
  1: {
    cols: 5,
    rows: 8,
    cells: [
      { col: 1, row: 1, ref: "cunene" },
      { col: 1, row: 2, ref: "cunene" },
      { col: 2, row: 1, ref: "kkubango" },
      { col: 2, row: 2, ref: "kkubango" },
      { col: 3, row: 1, ref: "maquela" },
      { col: 4, row: 1, ref: "maquela" },
      { col: 3, row: 2, ref: "maquela" },
      { col: 3, row: 3, ref: "damba" },
      { col: 4, row: 2, ref: "malanje" },
      { col: 4, row: 3, ref: "malanje" },
      { col: 3, row: 4, ref: "damba" },
      { col: 4, row: 4, ref: "damba" },
      { col: 3, row: 5, kind: "stairs" },
      { col: 4, row: 5, ref: "damba" },
      { col: 1, row: 6, ref: "bie" },
      { col: 2, row: 6, ref: "damba" },
      { col: 3, row: 6, ref: "damba" },
      { col: 4, row: 6, ref: "damba" },
      { col: 1, row: 7, ref: "bie" },
      { col: 2, row: 7, ref: "bie" },
      { col: 3, row: 7, ref: "huambo" },
      { col: 4, row: 7, ref: "huambo" },
      { col: 1, row: 8, zone: "balcony" },
      { col: 2, row: 8, zone: "balcony" },
      { col: 3, row: 8, ref: "huambo" },
      // Second balcon, le long de Damba (colonne 5, en porte-à-faux sur le rez-de-chaussée).
      { col: 5, row: 4, zone: "balcony" },
      { col: 5, row: 5, zone: "balcony" },
      { col: 5, row: 6, zone: "balcony" },
    ],
    /**
     * Parcours principal : ligne droite en colonne 3 (Maquela → Damba), puis le tour de l'escalier
     * par Damba (4/4, 4/5, 4/6) et retour à gauche (3/6, 2/6) jusqu'à Bié. L'escalier reste hors tracé.
     */
    path: [
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [4, 4],
      [4, 5],
      [4, 6],
      [3, 6],
      [2, 6],
      [1, 6],
    ],
    /** Le parcours s'achève dans une pièce (Bié) : on y dessine un arrêt de fin. */
    pathTerminus: true,
    /**
     * Arrêts posés sur la ligne, dans les chambres qu'elle traverse (K. Kubango, Maquela).
     * Avec Malanje, Huambo (déviations) et Bié (terminus), chaque chambre a ainsi son arrêt.
     */
    pathStops: [
      [2, 1],
      [3, 1],
    ],
    /**
     * Déviations en cul-de-sac (points de grille, fractions admises) : la courbe quitte la ligne
     * droite, entre dans la pièce et s'y arrête. Le repère y fait l'aller-retour.
     * 1. De Damba (3/3) vers Malanje, sous le libellé de la chambre.
     * 2. De Damba (3/6) vers Huambo, juste sous l'escalier.
     */
    pathDetours: [
      [
        [3, 3.25],
        [3.5, 3.21],
        [3.9, 3.14],
        [4.06, 2.91],
      ],
      [
        [3, 6],
        [3, 6.5],
        [3, 7.05],
      ],
    ],
  },
};

/** Anciens slugs du site → `name_normalized` de l'API. */
const KEY_ALIASES = {
  malange: "malanje",
  kubango: "kkubango",
};

/** Clé de comparaison : minuscules, sans accents ni ponctuation (« K. Kubango » → « kkubango »). */
export function placeKey(value = "") {
  const key = String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]/g, "");
  return KEY_ALIASES[key] ?? key;
}

function parseFloor(value) {
  if (value === null || value === undefined || value === "") return DEFAULT_FLOOR;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : DEFAULT_FLOOR;
}

/**
 * @param {object} source — carte chambre (`fetchHomeRooms`) ou espace commun (`fetchHouseCommonPlaces`)
 * @param {'room' | 'common'} type
 */
function toPlace(source, type) {
  const name = String(source?.name ?? "").trim();
  const kind = type === "room" ? "room" : String(source?.kind ?? "").trim() || "other";
  return {
    id: String(source?.id ?? source?.slug ?? name),
    type,
    /** `room` pour une chambre, sinon le type de pièce commune (`break-room`, `waiting-room`…). */
    kind,
    tone: type === "room" ? "room" : COMMON_KIND_TONES[kind] ?? "common",
    name,
    shortName: String(source?.shortName ?? "").trim() || name,
    floor: parseFloor(source?.floor),
    order: Number(source?.number) || 0,
    keys: new Set([source?.slug, name, source?.shortName].map(placeKey).filter(Boolean)),
    source,
  };
}

function sortPlaces(places) {
  return [...places].sort((a, b) => {
    if (a.type !== b.type) return a.type === "room" ? -1 : 1;
    if (a.order !== b.order) return (a.order || Infinity) - (b.order || Infinity);
    return a.name.localeCompare(b.name);
  });
}

/* ------------------------------------------------------------------ */
/* Géométrie de grille : composantes connexes, contour, emplacement    */
/* du libellé                                                          */
/* ------------------------------------------------------------------ */

const cellKey = (col, row) => `${col},${row}`;

function connectedComponents(cells) {
  const byKey = new Map(cells.map((c) => [cellKey(c.col, c.row), c]));
  const seen = new Set();
  const components = [];

  for (const start of cells) {
    const startKey = cellKey(start.col, start.row);
    if (seen.has(startKey)) continue;
    seen.add(startKey);
    const queue = [start];
    const component = [];
    while (queue.length) {
      const cell = queue.pop();
      component.push(cell);
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const key = cellKey(cell.col + dc, cell.row + dr);
        if (byKey.has(key) && !seen.has(key)) {
          seen.add(key);
          queue.push(byKey.get(key));
        }
      }
    }
    components.push(component);
  }
  return components;
}

function signedArea(loop) {
  let sum = 0;
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % loop.length];
    sum += a.x * b.z - b.x * a.z;
  }
  return sum / 2;
}

/**
 * Contours d'un ensemble de cases, en unités de grille (centre d'une case = entier).
 * Chaque boucle garde l'intérieur à droite du sens de parcours ; les contours extérieurs
 * ont donc une aire signée positive, les trous une aire négative.
 *
 * @param {{ col: number, row: number }[]} cells
 * @returns {{ x: number, z: number }[][]}
 */
export function traceLoops(cells) {
  const inside = new Set(cells.map((c) => cellKey(c.col, c.row)));
  /** Coordonnées doublées pour rester en entiers (demi-case = 1). */
  const edges = new Map();
  const addEdge = (ax, az, bx, bz) => {
    const key = `${ax},${az}`;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push({ ax, az, bx, bz, used: false });
  };

  for (const { col, row } of cells) {
    const x0 = 2 * col - 1;
    const x1 = 2 * col + 1;
    const z0 = 2 * row - 1;
    const z1 = 2 * row + 1;
    if (!inside.has(cellKey(col, row - 1))) addEdge(x0, z0, x1, z0);
    if (!inside.has(cellKey(col + 1, row))) addEdge(x1, z0, x1, z1);
    if (!inside.has(cellKey(col, row + 1))) addEdge(x1, z1, x0, z1);
    if (!inside.has(cellKey(col - 1, row))) addEdge(x0, z1, x0, z0);
  }

  const loops = [];
  for (const list of edges.values()) {
    for (const first of list) {
      if (first.used) continue;
      const points = [];
      let edge = first;
      while (edge && !edge.used) {
        edge.used = true;
        points.push({ x: edge.ax, z: edge.az, dx: edge.bx - edge.ax, dz: edge.bz - edge.az });
        const candidates = (edges.get(`${edge.bx},${edge.bz}`) ?? []).filter((e) => !e.used);
        if (!candidates.length) break;
        // Point de pincement (deux cases en diagonale) : on tourne à droite pour longer l'intérieur.
        const rightX = -(edge.bz - edge.az);
        const rightZ = edge.bx - edge.ax;
        edge =
          candidates.find((e) => e.bx - e.ax === rightX && e.bz - e.az === rightZ) ?? candidates[0];
      }

      // Retire les sommets alignés, puis repasse en unités de grille.
      const corners = points.filter((p, i) => {
        const prev = points[(i - 1 + points.length) % points.length];
        return prev.dx !== p.dx || prev.dz !== p.dz;
      });
      if (corners.length >= 4) {
        loops.push(corners.map((p) => ({ x: p.x / 2, z: p.z / 2 })));
      }
    }
  }
  return loops;
}

function outerLoop(cells) {
  const loops = traceLoops(cells).filter((loop) => signedArea(loop) > 0);
  return loops.sort((a, b) => signedArea(b) - signedArea(a))[0] ?? null;
}

/**
 * Emplacement du libellé : centre du plus grand rectangle de cases contenu dans la zone
 * (une zone en L porte donc son nom dans sa branche la plus longue, jamais à cheval sur un voisin).
 */
function labelSpot(cells) {
  const inside = new Set(cells.map((c) => cellKey(c.col, c.row)));
  const cx = cells.reduce((sum, c) => sum + c.col, 0) / cells.length;
  const cz = cells.reduce((sum, c) => sum + c.row, 0) / cells.length;
  let best = null;

  for (const { col, row } of cells) {
    for (let w = 1; inside.has(cellKey(col + w - 1, row)); w++) {
      for (let h = 1; ; h++) {
        let full = true;
        for (let c = col; c < col + w && full; c++) {
          if (!inside.has(cellKey(c, row + h - 1))) full = false;
        }
        if (!full) break;
        const x = col + (w - 1) / 2;
        const z = row + (h - 1) / 2;
        const candidate = { x, z, width: w, area: w * h, distance: Math.hypot(x - cx, z - cz) };
        if (
          !best ||
          candidate.area > best.area ||
          (candidate.area === best.area && candidate.distance < best.distance - 1e-9)
        ) {
          best = candidate;
        }
      }
    }
  }
  return best ? { x: best.x, z: best.z, width: best.width } : null;
}

/**
 * Regroupe les cases en zones : un lieu sur plusieurs cases voisines devient un seul volume.
 * @param {number} level
 * @param {{ col: number, row: number, kind: string, key: string, tone: string, placeId?: string, zone?: string }[]} cells
 */
function buildAreas(level, cells) {
  const groups = new Map();
  for (const cell of cells) {
    if (!groups.has(cell.key)) groups.set(cell.key, []);
    groups.get(cell.key).push(cell);
  }

  const areas = [];
  for (const [key, groupCells] of groups) {
    connectedComponents(groupCells)
      .sort((a, b) => b.length - a.length)
      .forEach((component, index) => {
        const loop = outerLoop(component);
        if (!loop) return;
        const { kind, tone, placeId = null, zone = null } = component[0];
        areas.push({
          id: `${level}:${key}:${index}`,
          key,
          kind,
          tone,
          placeId,
          zone,
          cells: component.map(({ col, row }) => ({ col, row })),
          loop,
          label: kind === "corridor" ? null : labelSpot(component),
        });
      });
  }
  return areas;
}

/* ------------------------------------------------------------------ */
/* Construction des étages                                             */
/* ------------------------------------------------------------------ */

const placeCell = (col, row, place) => ({
  col,
  row,
  kind: "place",
  key: `place:${place.id}`,
  tone: place.tone,
  placeId: place.id,
});

function autoLayout(places) {
  const half = Math.ceil(places.length / 2);
  const top = places.slice(0, half);
  const bottom = places.slice(half);
  const cols = Math.max(top.length, 2);
  const cells = [];

  top.forEach((place, i) => cells.push(placeCell(i + 1, 1, place)));
  for (let col = 1; col <= cols; col++) {
    cells.push({ col, row: 2, kind: "corridor", key: "corridor", tone: "corridor" });
  }
  bottom.forEach((place, i) => cells.push(placeCell(i + 1, 3, place)));

  return {
    cols,
    rows: bottom.length ? 3 : 2,
    cells,
    path: Array.from({ length: cols }, (_, i) => [i + 1, 2]),
  };
}

/**
 * @param {{ rooms?: object[], commons?: object[] }} input
 * @returns {Array<{
 *   level: number, auto: boolean, cols: number, rows: number,
 *   areas: ReturnType<typeof buildAreas>, slabs: { x: number, z: number }[][],
 *   path: [number, number][], hasStairs: boolean,
 *   places: ReturnType<typeof toPlace>[],
 *   items: { key: string, tone: string, place?: ReturnType<typeof toPlace>, zone?: string }[],
 * }>} étages triés du plus bas au plus haut
 */
export function buildFloors({ rooms = [], commons = [] } = {}) {
  const places = [
    ...rooms.map((room) => toPlace(room, "room")),
    ...commons.map((common) => toPlace(common, "common")),
  ].filter((place) => place.id && place.name);

  const unplaced = new Map(places.map((place) => [place.id, place]));
  const drafts = new Map();

  // 1. Étages dessinés à la main.
  for (const [levelKey, layout] of Object.entries(FLOOR_LAYOUTS)) {
    const level = Number(levelKey);
    const placed = new Map();
    const usePlace = (cell, place) => {
      placed.set(place.id, place);
      unplaced.delete(place.id);
      return placeCell(cell.col, cell.row, place);
    };

    // Les `ref` d'abord : un lieu nommé dans un dessin n'est jamais réutilisé par une zone.
    const referenced = new Map();
    for (const cell of layout.cells) {
      if (!cell.ref) continue;
      const key = placeKey(cell.ref);
      const place = places.find((p) => p.keys.has(key));
      if (place) referenced.set(cell.ref, place);
    }
    const referencedIds = new Set([...referenced.values()].map((p) => p.id));
    const zonePlaces = new Map();

    const cells = layout.cells.map((cell) => {
      const { col, row } = cell;
      if (cell.ref) {
        const place = referenced.get(cell.ref);
        // Lieu absent de la base : la case reste une circulation neutre plutôt qu'un trou.
        return place
          ? usePlace(cell, place)
          : { col, row, kind: "corridor", key: "corridor", tone: "corridor" };
      }
      if (cell.zone) {
        const zone = ZONES[cell.zone] ?? { tone: "common" };
        if (zone.dbKind && !zonePlaces.has(cell.zone)) {
          zonePlaces.set(
            cell.zone,
            sortPlaces(places).find(
              (p) =>
                p.type === "common" &&
                p.kind === zone.dbKind &&
                p.floor === level &&
                !referencedIds.has(p.id),
            ) ?? null,
          );
        }
        const place = zonePlaces.get(cell.zone);
        return place
          ? usePlace(cell, place)
          : { col, row, kind: "zone", key: `zone:${cell.zone}`, tone: zone.tone, zone: cell.zone };
      }
      const kind = cell.kind === "stairs" ? "stairs" : "corridor";
      return { col, row, kind, key: kind, tone: kind };
    });

    drafts.set(level, {
      level,
      auto: false,
      cols: layout.cols,
      rows: layout.rows,
      cells,
      path: layout.path ?? [],
      pathFeeders: layout.pathFeeders ?? [],
      pathDetours: layout.pathDetours ?? [],
      pathTerminus: Boolean(layout.pathTerminus),
      pathStops: layout.pathStops ?? [],
      places: [...placed.values()],
    });
  }

  // 2. Lieux restants : rangée supplémentaire sur un étage dessiné, sinon étage automatique.
  const leftovers = new Map();
  for (const place of unplaced.values()) {
    if (!leftovers.has(place.floor)) leftovers.set(place.floor, []);
    leftovers.get(place.floor).push(place);
  }
  for (const [level, group] of leftovers) {
    const sorted = sortPlaces(group);
    const draft = drafts.get(level);
    if (draft) {
      sorted.forEach((place, i) => {
        draft.cells.push(
          placeCell((i % draft.cols) + 1, draft.rows + 1 + Math.floor(i / draft.cols), place),
        );
      });
      draft.rows += Math.ceil(sorted.length / draft.cols);
      draft.places.push(...sorted);
    } else {
      drafts.set(level, { level, auto: true, ...autoLayout(sorted), places: sorted });
    }
  }

  return [...drafts.values()]
    .sort((a, b) => a.level - b.level)
    .map((draft) => {
      const areas = buildAreas(draft.level, draft.cells);
      const floorPlaces = sortPlaces(draft.places);
      const zoneKeys = [...new Set(areas.filter((a) => a.kind === "zone").map((a) => a.key))];
      return {
        level: draft.level,
        auto: draft.auto,
        cols: draft.cols,
        rows: draft.rows,
        areas,
        slabs: traceLoops(draft.cells).filter((loop) => signedArea(loop) > 0),
        path: draft.path,
        pathFeeders: draft.pathFeeders ?? [],
        pathDetours: draft.pathDetours ?? [],
        pathTerminus: Boolean(draft.pathTerminus),
        pathStops: draft.pathStops ?? [],
        hasStairs: areas.some((area) => area.kind === "stairs"),
        places: floorPlaces,
        items: [
          ...floorPlaces.map((place) => ({ key: `place:${place.id}`, tone: place.tone, place })),
          ...zoneKeys.map((key) => {
            const area = areas.find((a) => a.key === key);
            return { key, tone: area.tone, zone: area.zone };
          }),
        ],
      };
    });
}

const ZONE_TYPE_TONES_DB = {
  "car-entry": "service",
  parking: "service",
  entrance: "service",
  security: "service",
  reception: "common",
  kitchen: "common",
  terrace: "outdoor",
  balcony: "outdoor",
  outdoor: "exterior",
  stairs: "stairs",
  corridor: "corridor",
};

function toneForDbZone(zone) {
  if (zone?.entity) {
    const type = String(zone.entity.type ?? "").trim();
    if (type === "room") return "room";
    const kind = String(zone.entity.kind ?? "").trim();
    return COMMON_KIND_TONES[kind] ?? "common";
  }
  const key = String(zone?.type ?? "").trim();
  return ZONE_TYPE_TONES_DB[key] ?? "service";
}

function placeFromDbZone(zone) {
  const entity = zone?.entity;
  if (!entity?.uid) return null;
  const type = String(entity.type ?? "").trim() === "room" ? "room" : "common";
  return toPlace(
    {
      id: entity.uid,
      slug: entity.name_normalized,
      name: entity.name,
      shortName: entity.short_name || entity.name,
      kind: entity.kind || entity.type,
      floor: null,
      number: 0,
    },
    type,
  );
}

/**
 * Plan multi-étages depuis `GET /api/houses/:uid/floor-plan`.
 * Grille BDD : `grid_x` / `grid_y`, origine 1/1 en bas à gauche.
 *
 * @param {{ floors?: object[] }} payload
 */
export function buildFloorsFromDatabase({ floors = [] } = {}) {
  return [...floors]
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    .map((floor) => {
      const cols = Math.max(1, Number(floor.grid_columns) || 1);
      const rows = Math.max(1, Number(floor.grid_rows) || 1);
      const zones = Array.isArray(floor.zones) ? floor.zones : [];
      const cells = Array.isArray(floor.cells) ? floor.cells : [];
      const zoneByUid = new Map(zones.map((z) => [z.uid, z]));

      const draftCells = [];
      const placed = new Map();

      for (const cell of cells) {
        const gx = Number(cell.grid_x);
        const gy = Number(cell.grid_y);
        if (!gx || !gy) continue;

        const col = gx;
        const row = rows - gy + 1;
        const zone = zoneByUid.get(cell.uid_zone);

        if (!zone) {
          draftCells.push({ col, row, kind: "corridor", key: "corridor", tone: "corridor" });
          continue;
        }

        const zoneType = String(zone.type ?? "").trim();
        if (zoneType === "stairs") {
          draftCells.push({ col, row, kind: "stairs", key: "stairs", tone: "stairs" });
          continue;
        }

        const place = placeFromDbZone(zone);
        if (place) {
          placed.set(place.id, place);
          draftCells.push({
            col,
            row,
            kind: "place",
            key: `place:${place.id}`,
            tone: place.tone,
            placeId: place.id,
          });
          continue;
        }

        draftCells.push({
          col,
          row,
          kind: "zone",
          key: `zone:${zone.uid}`,
          tone: toneForDbZone(zone),
          zone: zone.type,
          dbLabel: zone.label,
          dbColor: cell.color_override || zone.color || null,
        });
      }

      const areas = buildAreas(floor.level, draftCells);
      const floorPlaces = sortPlaces([...placed.values()]);
      const zoneKeys = [...new Set(areas.filter((a) => a.kind === "zone").map((a) => a.key))];

      return {
        level: Number(floor.level) || 0,
        name: String(floor.name ?? "").trim(),
        auto: false,
        cols,
        rows,
        areas,
        slabs: traceLoops(draftCells).filter((loop) => signedArea(loop) > 0),
        path: [],
        pathFeeders: [],
        pathDetours: [],
        pathTerminus: false,
        pathStops: [],
        hasStairs: areas.some((area) => area.kind === "stairs"),
        places: floorPlaces,
        items: [
          ...floorPlaces.map((place) => ({ key: `place:${place.id}`, tone: place.tone, place })),
          ...zoneKeys.map((key) => {
            const area = areas.find((a) => a.key === key);
            return { key, tone: area.tone, zone: area.zone };
          }),
        ],
        db: { cols, rows, zones, cells },
      };
    });
}
