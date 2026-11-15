import * as THREE from "three";

/** Côté d'une case, en unités de scène. */
export const TILE = 1;

/** Hauteur des volumes selon la famille de zone. */
export const HEIGHTS = {
  room: 0.3,
  common: 0.2,
  outdoor: 0.11,
  exterior: 0.05,
  service: 0.14,
  corridor: 0.06,
  stairs: 0.3,
};

export const SLAB_THICKNESS = 0.16;
const SLAB_MARGIN = 0.2;
/** Demi-espace entre deux zones voisines. */
const AREA_INSET = 0.04;

/** Coordonnées de grille (centre d'une case = entier) → plan XZ de la scène, étage centré. */
export function gridToWorld(floor, x, z) {
  return [(x - (floor.cols + 1) / 2) * TILE, (z - (floor.rows + 1) / 2) * TILE];
}

/** Décale un contour vers l'intérieur (`distance` > 0) ou l'extérieur (< 0). L'intérieur est à droite. */
function insetLoop(loop, distance) {
  const n = loop.length;
  return loop.map((point, i) => {
    const prev = loop[(i - 1 + n) % n];
    const next = loop[(i + 1) % n];
    const inLen = Math.hypot(point.x - prev.x, point.z - prev.z) || 1;
    const outLen = Math.hypot(next.x - point.x, next.z - point.z) || 1;
    const inDir = { x: (point.x - prev.x) / inLen, z: (point.z - prev.z) / inLen };
    const outDir = { x: (next.x - point.x) / outLen, z: (next.z - point.z) / outLen };
    return {
      x: point.x + (-inDir.z - outDir.z) * distance,
      z: point.z + (inDir.x + outDir.x) * distance,
    };
  });
}

/** Contour à angles arrondis → `THREE.Shape` (plan XY, Y = -Z de la scène). */
function loopToShape(loop, radius) {
  const shape = new THREE.Shape();
  const n = loop.length;

  loop.forEach((corner, i) => {
    const prev = loop[(i - 1 + n) % n];
    const next = loop[(i + 1) % n];
    const inLen = Math.hypot(corner.x - prev.x, corner.z - prev.z);
    const outLen = Math.hypot(next.x - corner.x, next.z - corner.z);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const startX = corner.x + ((prev.x - corner.x) / inLen) * r;
    const startZ = corner.z + ((prev.z - corner.z) / inLen) * r;
    const endX = corner.x + ((next.x - corner.x) / outLen) * r;
    const endZ = corner.z + ((next.z - corner.z) / outLen) * r;

    if (i === 0) shape.moveTo(startX, -startZ);
    else shape.lineTo(startX, -startZ);
    shape.quadraticCurveTo(corner.x, -corner.z, endX, -endZ);
  });
  shape.closePath();
  return shape;
}

function extrude(floor, loop, { height, inset, radius, bevel }) {
  const worldLoop = insetLoop(
    loop.map(({ x, z }) => {
      const [wx, wz] = gridToWorld(floor, x, z);
      return { x: wx, z: wz };
    }),
    inset,
  );
  const b = Math.min(bevel, height / 3);
  const geometry = new THREE.ExtrudeGeometry(loopToShape(worldLoop, radius), {
    depth: height - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    // Le chanfrein rentre dans le volume : l'emprise au sol reste celle du contour.
    bevelOffset: -b,
    bevelSegments: 3,
    curveSegments: 8,
    steps: 1,
  });
  // Le profil est dessiné dans XY et extrudé en Z : on le couche pour que l'extrusion monte en Y.
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, b, 0);
  return geometry;
}

/** Volume d'une zone, posé sur la dalle (base à y = 0). */
export function buildAreaGeometry(floor, area) {
  const height = HEIGHTS[area.tone] ?? HEIGHTS.common;
  return extrude(floor, area.loop, { height, inset: AREA_INSET, radius: 0.12, bevel: 0.028 });
}

/** Dalle de l'étage (sommet à y = 0), à la forme de l'emprise du plan. */
export function buildSlabGeometry(floor, loop) {
  const geometry = extrude(floor, loop, {
    height: SLAB_THICKNESS,
    inset: -SLAB_MARGIN,
    radius: 0.3,
    bevel: 0.03,
  });
  geometry.translate(0, -SLAB_THICKNESS, 0);
  return geometry;
}

/** Pas de rééchantillonnage d'un tracé posé sur les volumes, en unités de scène. */
const DRAPE_STEP = 0.05;
/** Portée (en échantillons) sur laquelle le tracé monte à l'approche d'un volume plus haut. */
const DRAPE_REACH = 4;

/**
 * Pose un tracé sur les volumes qu'il survole : chaque point prend la hauteur de la zone située
 * dessous, plus `clearance`. À hauteur fixe, le tracé flotterait au-dessus des zones basses et
 * paraîtrait décalé vers le fond en perspective.
 * La montée vers un volume plus haut s'étale côté bas : le tracé ne rentre jamais dans un volume.
 * @param {THREE.Vector3[]} points — tracé dans le plan XZ (leur `y` est ignoré)
 * @returns {THREE.Vector3[]}
 */
export function drapeOnFloor(floor, points, clearance) {
  if (!points.length) return points;

  const heights = new Map();
  for (const area of floor.areas ?? []) {
    const height = HEIGHTS[area.tone] ?? HEIGHTS.common;
    for (const cell of area.cells) heights.set(cell.col + ":" + cell.row, height);
  }
  const surface = (point) => {
    const col = Math.round(point.x / TILE + (floor.cols + 1) / 2);
    const row = Math.round(point.z / TILE + (floor.rows + 1) / 2);
    return heights.get(col + ":" + row) ?? 0;
  };

  const samples = [points[0].clone()];
  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const count = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.z - from.z) / DRAPE_STEP));
    for (let s = 1; s <= count; s++) samples.push(from.clone().lerp(to, s / count));
  }

  const around = (values, index, reduce) => {
    const from = Math.max(0, index - DRAPE_REACH);
    const to = Math.min(values.length - 1, index + DRAPE_REACH);
    return reduce(values.slice(from, to + 1));
  };
  const raw = samples.map(surface);
  // Dilatation puis moyenne : une rampe douce, toujours au-dessus du volume survolé.
  const dilated = raw.map((_, i) => around(raw, i, (window) => Math.max(...window)));
  samples.forEach((sample, i) => {
    const smooth = around(dilated, i, (window) => window.reduce((sum, h) => sum + h, 0) / window.length);
    sample.y = smooth + clearance;
  });
  return samples;
}

/**
 * Parcours de visite : polyligne passant par le centre des cases, angles arrondis,
 * posée sur les volumes (`clearance` au-dessus de chaque zone).
 * @returns {THREE.Vector3[]}
 */
export function buildPathPoints(floor, clearance, radius = 0.34, segments = 8) {
  return drapeOnFloor(floor, buildFlatPathPoints(floor, radius, segments), clearance);
}

function buildFlatPathPoints(floor, radius, segments) {
  const grid = floor.path ?? [];
  const points = grid.map(([col, row]) => {
    const [x, z] = gridToWorld(floor, col, row);
    return new THREE.Vector3(x, 0, z);
  });
  if (points.length < 3) return points;

  const out = [points[0].clone()];
  const tmp = new THREE.Vector3();
  for (let i = 1; i < points.length - 1; i++) {
    const corner = points[i];
    const toPrev = tmp.copy(points[i - 1]).sub(corner);
    const r1 = Math.min(radius, toPrev.length() / 2);
    const start = corner.clone().add(toPrev.normalize().multiplyScalar(r1));
    const toNext = tmp.copy(points[i + 1]).sub(corner);
    const r2 = Math.min(radius, toNext.length() / 2);
    const end = corner.clone().add(toNext.normalize().multiplyScalar(r2));
    const curve = new THREE.QuadraticBezierCurve3(start, corner, end);
    for (let s = 0; s <= segments; s++) out.push(curve.getPoint(s / segments));
  }
  out.push(points[points.length - 1].clone());
  return out;
}

/**
 * Déviation en cul-de-sac : courbe lisse passant par des points de grille (fractions admises),
 * du carrefour sur la ligne principale jusqu'à l'intérieur de la pièce. Posée sur les volumes,
 * comme le parcours.
 * @returns {THREE.Vector3[]}
 */
export function buildDetourPoints(floor, waypoints, clearance, segments = 28) {
  const anchors = waypoints.map(([col, row]) => {
    const [x, z] = gridToWorld(floor, col, row);
    return new THREE.Vector3(x, 0, z);
  });
  const flat =
    anchors.length < 3
      ? anchors
      : new THREE.CatmullRomCurve3(anchors, false, "centripetal").getSpacedPoints(segments);
  return drapeOnFloor(floor, flat, clearance);
}

/**
 * Second départ : courbe lisse passant par des points de grille (fractions admises), de son
 * point de départ jusqu'à la ligne principale, qu'elle rejoint à son dernier point.
 * @returns {THREE.Vector3[]}
 */
export function buildFeederPoints(floor, waypoints, clearance) {
  return buildDetourPoints(floor, waypoints, clearance, Math.max(28, waypoints.length * 16));
}

/**
 * Trajet du repère depuis un second départ : l'embranchement, puis la ligne principale à partir
 * du point où il la rejoint.
 * @param {THREE.Vector3[]} main
 * @param {THREE.Vector3[]} feeder
 */
export function joinFeeder(main, feeder) {
  if (main.length < 2 || !feeder.length) return feeder;
  const { after, point } = nearestOnPath(main, feeder[feeder.length - 1]);
  return [...feeder, point, ...main.slice(after + 1)];
}

/**
 * Point de la polyligne le plus proche de `target` (polyligne d'au moins deux points).
 * @returns {{ after: number, point: THREE.Vector3 }} `after` : indice du sommet qui précède le point
 */
export function nearestOnPath(points, target) {
  const segment = new THREE.Line3();
  const projected = new THREE.Vector3();
  const point = new THREE.Vector3();
  let after = 0;
  let nearest = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    segment.set(points[i], points[i + 1]).closestPointToPoint(target, true, projected);
    const distance = projected.distanceToSquared(target);
    if (distance < nearest) {
      nearest = distance;
      after = i;
      point.copy(projected);
    }
  }
  return { after, point };
}

/**
 * Trajet du repère animé : la ligne principale, où chaque déviation est parcourue en
 * aller-retour à partir du point de la ligne le plus proche de son départ.
 * @param {THREE.Vector3[]} main
 * @param {THREE.Vector3[][]} detours
 */
export function buildMarkerRoute(main, detours) {
  let route = main;

  for (const detour of detours) {
    if (detour.length < 2 || route.length < 2) continue;
    const { after, point: junction } = nearestOnPath(route, detour[0]);
    route = [
      ...route.slice(0, after + 1),
      junction,
      ...detour,
      ...detour.slice(0, -1).reverse(),
      junction,
      ...route.slice(after + 1),
    ];
  }
  return route;
}

/** Longueurs cumulées d'une polyligne, pour y déplacer un repère à vitesse constante. */
export function measurePath(points) {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + points[i].distanceTo(points[i - 1]));
  }
  return { lengths, total: lengths[lengths.length - 1] ?? 0 };
}

/** Position à la distance `distance` le long de la polyligne, écrite dans `target`. */
export function samplePath(points, lengths, distance, target) {
  let i = 1;
  while (i < lengths.length - 1 && lengths[i] < distance) i++;
  const span = lengths[i] - lengths[i - 1] || 1;
  return target.lerpVectors(points[i - 1], points[i], (distance - lengths[i - 1]) / span);
}

/**
 * Distance caméra nécessaire pour cadrer une boîte centrée sur l'origine,
 * la caméra regardant l'origine depuis la direction `direction` (normalisée).
 */
export function fitDistance({ halfWidth, halfDepth, height, direction, fov, aspect, margin = 1.1 }) {
  const forward = direction;
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();
  const up = new THREE.Vector3().crossVectors(forward, right);
  const tanV = Math.tan(THREE.MathUtils.degToRad(fov) / 2);
  const tanH = tanV * aspect;
  const corner = new THREE.Vector3();
  let distance = 0;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      for (const y of [-SLAB_THICKNESS, height]) {
        corner.set(sx * halfWidth, y, sz * halfDepth);
        const depth = corner.dot(forward);
        distance = Math.max(
          distance,
          Math.abs(corner.dot(right)) / tanH + depth,
          Math.abs(corner.dot(up)) / tanV + depth,
        );
      }
    }
  }
  return distance * margin;
}
