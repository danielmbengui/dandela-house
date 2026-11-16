"use client";

import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Line,
  PresentationControls,
  Text,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { easing } from "maath";
import * as THREE from "three";
import {
  HEIGHTS,
  SLAB_THICKNESS,
  TILE,
  buildAreaGeometry,
  buildDetourPoints,
  buildFeederPoints,
  buildMarkerRoute,
  buildPathPoints,
  buildSlabGeometry,
  fitDistance,
  gridToWorld,
  joinFeeder,
  measurePath,
  nearestOnPath,
  samplePath,
} from "./geometry";

/** Même police que le site (Outfit), servie en local : troika ne lit pas les polices `next/font`. */
const FONT_BOLD = "/fonts/outfit-700.woff";
const FONT_MEDIUM = "/fonts/outfit-500.woff";

const CAMERA_FOV = 30;
const CAMERA_AZIMUTH = THREE.MathUtils.degToRad(24);
const CAMERA_ELEVATION = THREE.MathUtils.degToRad(47);
const CAMERA_DIRECTION = new THREE.Vector3(
  Math.sin(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION),
  Math.sin(CAMERA_ELEVATION),
  Math.cos(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION),
);

/** Écart vertical entre l'étage affiché et ceux du dessous. */
const GAP_BELOW = 1.15;
/**
 * Le parcours est posé sur les volumes, à cette distance au-dessus de chaque zone
 * (un peu plus que le soulèvement d'une zone mise en avant, pour ne pas être recouvert).
 */
const PATH_CLEARANCE = 0.1;
/** Hauteur maximale atteinte par le parcours : sert au cadrage de la caméra. */
const PATH_Y = Math.max(...Object.values(HEIGHTS)) + PATH_CLEARANCE;
/** Pause du repère en fin de parcours, exprimée en distance (vitesse 0,6 unité/s → 1,5 s). */
const END_PAUSE = 0.9;
/** Un clic après un glissement de plus de quelques pixels est une rotation, pas une sélection. */
const CLICK_TOLERANCE = 6;

/** Hauteur et présence (opacité) d'un étage selon sa position par rapport à l'étage affiché. */
function stackHeight(offset) {
  if (offset === 0) return 0;
  return offset < 0 ? offset * GAP_BELOW : 1.2 + offset * 1.1;
}
function stackPresence(offset) {
  if (offset === 0) return 1;
  if (offset > 0) return 0;
  return Math.max(0.18, 0.5 + (offset + 1) * 0.16);
}

/**
 * Les libellés se dessinent par-dessus le parcours (sans test de profondeur). Dans les zones
 * que le parcours traverse, un liseré de la couleur de la zone les garde lisibles sur les pointillés.
 */
const LABEL_MATERIAL = new THREE.MeshBasicMaterial({
  transparent: true,
  depthTest: false,
  depthWrite: false,
  toneMapped: false,
});

/** Curseur du canvas (au-dessus du curseur « main » posé par PresentationControls sur son conteneur). */
function setCursor(gl, value) {
  gl.domElement.style.cursor = value;
}

function applyPresence(material, value) {
  if (!material) return;
  const transparent = value < 0.995;
  if (material.transparent !== transparent) {
    material.transparent = transparent;
    material.needsUpdate = true;
  }
  material.opacity = transparent ? value : 1;
}

function AreaLabel({ floor, area, y, title, subtitle, color, subColor, haloColor }) {
  const haloed = Boolean(haloColor);
  const [x, z] = gridToWorld(floor, area.label.x, area.label.z);
  const maxWidth = area.label.width * TILE - 0.22;
  const longestWord = Math.max(4, ...String(title).split(/\s+/).map((word) => word.length));
  const fontSize = Math.min(0.185, maxWidth / (longestWord * 0.6));
  const subSize = subtitle ? Math.min(0.074, maxWidth / (subtitle.length * 0.72)) : 0;
  const halo = {
    outlineColor: haloColor ?? color,
    outlineOpacity: haloed ? 0.92 : 0,
    material: LABEL_MATERIAL,
    renderOrder: 5,
  };

  return (
    <group position={[x, y + 0.006, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <Text
        font={FONT_BOLD}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY={subtitle ? "bottom" : "middle"}
        position={[0, subtitle ? 0.005 : 0, 0]}
        maxWidth={maxWidth}
        textAlign="center"
        lineHeight={1.05}
        outlineWidth={haloed ? fontSize * 0.2 : 0}
        {...halo}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          font={FONT_MEDIUM}
          fontSize={subSize}
          color={subColor}
          anchorX="center"
          anchorY="top"
          position={[0, -0.03, 0]}
          letterSpacing={0.08}
          outlineWidth={haloed ? subSize * 0.3 : 0}
          {...halo}
        >
          {subtitle.toUpperCase()}
        </Text>
      ) : null}
    </group>
  );
}

function Area({ floor, area, palette, presence, floorActive, highlighted, onPath, text, onSelect, onHover }) {
  const lift = useRef(null);
  const material = useRef(null);
  const gl = useThree((state) => state.gl);
  const geometry = useMemo(() => buildAreaGeometry(floor, area), [floor, area]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const height = HEIGHTS[area.tone] ?? HEIGHTS.common;
  const baseColor = area.fillColor || (palette.tones[area.tone] ?? palette.tones.common);
  const interactive = floorActive && Boolean(onSelect);
  const isStairs = area.kind === "stairs";
  /** Volume hors maison (cours, limite du plan) : discret, sans mise en avant rouge. */
  const isExterior = area.tone === "exterior";
  const emphasize = highlighted && !isExterior;
  // Étage du dessous : relief neutre, seul l'escalier garde sa couleur pour montrer la liaison.
  const tint = emphasize ? palette.active : floorActive || isStairs ? baseColor : palette.slab;
  const volumeOpacity = isExterior && floorActive ? 0.46 : 1;

  useFrame((_, delta) => {
    if (!lift.current || !material.current) return;
    easing.damp(lift.current.position, "y", emphasize ? 0.09 : 0, 0.14, delta);
    easing.damp(lift.current.scale, "y", floorActive ? 1 : 0.4, 0.3, delta);
    easing.dampC(material.current.color, tint, 0.16, delta);
    const basePresence = presence.current * volumeOpacity;
    const transparent = basePresence < 0.995 || isExterior;
    if (material.current.transparent !== transparent) {
      material.current.transparent = transparent;
      material.current.needsUpdate = true;
    }
    material.current.opacity = transparent ? basePresence : 1;
  });

  const labelColor = emphasize
    ? palette.textOnActive
    : isExterior
      ? palette.exteriorText
      : isStairs
        ? palette.stairsText
        : palette.text;
  const labelSubColor = emphasize
    ? palette.textOnActive
    : isExterior
      ? palette.exteriorTextMuted
      : isStairs
        ? palette.stairsTextMuted
        : palette.textMuted;

  return (
    <group ref={lift}>
      <mesh
        geometry={geometry}
        castShadow
        receiveShadow
        onClick={
          interactive
            ? (event) => {
                event.stopPropagation();
                if (event.delta <= CLICK_TOLERANCE) onSelect();
              }
            : undefined
        }
        onPointerOver={
          floorActive && !isExterior
            ? (event) => {
                event.stopPropagation();
                onHover(area.key);
                if (interactive) setCursor(gl, "pointer");
              }
            : undefined
        }
        onPointerOut={
          floorActive
            ? () => {
                onHover(null);
                setCursor(gl, "");
              }
            : undefined
        }
      >
        <meshStandardMaterial
          ref={material}
          color={baseColor}
          roughness={isStairs ? 0.42 : isExterior ? 0.92 : 0.68}
          metalness={isStairs ? 0.25 : 0.02}
          emissive={isStairs ? baseColor : "#000000"}
          emissiveIntensity={isStairs ? palette.stairsGlow : 0}
        />
      </mesh>
      {floorActive && area.label && text?.title ? (
        <Suspense fallback={null}>
          <AreaLabel
            floor={floor}
            area={area}
            y={height}
            title={text.title}
            subtitle={text.subtitle}
            color={labelColor}
            subColor={labelSubColor}
            haloColor={onPath ? tint : null}
          />
        </Suspense>
      ) : null}
    </group>
  );
}

function Slab({ floor, loop, palette, presence, offset, onSelectFloor }) {
  const material = useRef(null);
  const gl = useThree((state) => state.gl);
  const geometry = useMemo(() => buildSlabGeometry(floor, loop), [floor, loop]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => applyPresence(material.current, presence.current));

  // Étage affiché : la dalle bloque les clics vers les étages du dessous.
  // Étage du dessous : un clic l'affiche. Étage du dessus (masqué) : aucun événement.
  const below = offset < 0;
  const handlers =
    offset > 0
      ? {}
      : {
          onClick: (event) => {
            event.stopPropagation();
            if (below && event.delta <= CLICK_TOLERANCE) onSelectFloor(floor.level);
          },
          onPointerOver: (event) => {
            event.stopPropagation();
            if (below) setCursor(gl, "pointer");
          },
          onPointerOut: () => {
            setCursor(gl, "");
          },
        };

  return (
    <mesh geometry={geometry} receiveShadow castShadow {...handlers}>
      <meshStandardMaterial ref={material} color={palette.slab} roughness={0.86} metalness={0} />
    </mesh>
  );
}

/** Trait du parcours : un cerne sombre, puis le pointillé jaune par-dessus, qui défile. */
function PathStroke({ points, palette, animate, casingWidth, lineWidth, dashSize, gapSize }) {
  const line = useRef(null);
  const casing = useRef(null);

  useFrame((_, delta) => {
    if (!animate) return;
    for (const ref of [line, casing]) {
      if (ref.current?.material) ref.current.material.dashOffset -= delta * 0.3;
    }
  });

  return (
    <>
      <Line
        ref={casing}
        points={points}
        color={palette.pathCasing}
        lineWidth={casingWidth}
        dashed
        dashSize={dashSize}
        gapSize={gapSize}
        position-y={-0.004}
      />
      <Line
        ref={line}
        points={points}
        color={palette.path}
        lineWidth={lineWidth}
        dashed
        dashSize={dashSize}
        gapSize={gapSize}
        renderOrder={1}
      />
    </>
  );
}

/** Parcours de visite : pointillés qui défilent + repère lumineux. */
function VisitPath({ floor, palette, animate }) {
  const marker = useRef(null);
  const travelled = useRef(0);
  /** Trajet en cours du repère : il part tour à tour de chaque départ. */
  const routeIndex = useRef(0);
  // Épaisseur en pixels : on l'affine sur les petits écrans, où la maquette est plus petite.
  const thickness = useThree((state) => THREE.MathUtils.clamp(state.size.width / 700, 0.6, 1));
  const points = useMemo(() => buildPathPoints(floor, PATH_CLEARANCE), [floor]);
  // Seconds départs : même trait que le parcours, qu'ils rejoignent à leur dernier point.
  const feeders = useMemo(
    () =>
      (floor.pathFeeders ?? [])
        .map((waypoints) => buildFeederPoints(floor, waypoints, PATH_CLEARANCE))
        .filter((feeder) => feeder.length >= 2),
    [floor],
  );
  const detours = useMemo(
    () =>
      (floor.pathDetours ?? [])
        .map((waypoints) => buildDetourPoints(floor, waypoints, PATH_CLEARANCE))
        .filter((detour) => detour.length >= 2),
    [floor],
  );
  // Arrêts posés sur la ligne elle-même (chambres traversées), recalés sur le tracé arrondi.
  const stops = useMemo(() => {
    if (points.length < 2) return [];
    return (floor.pathStops ?? []).map(([col, row]) => {
      const [x, z] = gridToWorld(floor, col, row);
      return nearestOnPath(points, new THREE.Vector3(x, PATH_Y, z)).point;
    });
  }, [floor, points]);
  /**
   * Trajets du repère : la ligne principale, puis un trajet par second départ (l'embranchement
   * suivi du reste de la ligne). La ligne reste droite ; seul le repère fait le crochet,
   * aller-retour, par les déviations qui partent du trajet suivi.
   */
  const routes = useMemo(() => {
    const starts = [points, ...feeders.map((feeder) => joinFeeder(points, feeder))];
    return starts.map((start) => {
      const reached = detours.filter(
        (detour) => nearestOnPath(start, detour[0]).point.distanceTo(detour[0]) < 0.05,
      );
      const route = buildMarkerRoute(start, reached);
      return { route, ...measurePath(route) };
    });
  }, [points, feeders, detours]);
  // Valeur > 1 : seul le repère dépasse le seuil du halo (Bloom).
  const glow = useMemo(() => new THREE.Color(palette.path).multiplyScalar(3), [palette.path]);

  useFrame((_, delta) => {
    if (!animate || !marker.current) return;
    let current = routes[routeIndex.current % routes.length];
    if (!current || current.total <= 0) return;
    travelled.current += delta * 0.6;
    // Le repère marque une courte pause à l'arrivée, puis repart du départ suivant.
    if (travelled.current > current.total + END_PAUSE) {
      travelled.current = 0;
      routeIndex.current = (routeIndex.current + 1) % routes.length;
      current = routes[routeIndex.current];
    }
    samplePath(
      current.route,
      current.lengths,
      Math.min(travelled.current, current.total),
      marker.current.position,
    );
  });

  if (points.length < 2) return null;

  return (
    <group>
      {[points, ...feeders].map((stroke, index) => (
        <PathStroke
          key={index}
          points={stroke}
          palette={palette}
          animate={animate}
          casingWidth={4.4 * thickness}
          lineWidth={2.4 * thickness}
          dashSize={0.15}
          gapSize={0.1}
        />
      ))}
      {detours.map((detour, index) => (
        <PathDetour key={index} points={detour} palette={palette} animate={animate} thickness={thickness} />
      ))}
      {stops.map((stop, index) => (
        <PathStop key={index} position={stop} palette={palette} animate={animate} />
      ))}
      {/* Terminus : le parcours s'achève dans une pièce, sur un arrêt plus marqué que les autres. */}
      {floor.pathTerminus ? (
        <PathStop position={points[points.length - 1]} palette={palette} animate={animate} scale={1.3} />
      ) : null}
      <mesh ref={marker} position={points[0]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshBasicMaterial color={glow} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** « Arrêt » du parcours : anneau jaune sur pastille noire, d'où part une onde discrète. */
function PathStop({ position, palette, animate, scale = 1 }) {
  const pulse = useRef(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!animate || !pulse.current) return;
    clock.current = (clock.current + delta * 0.5) % 1;
    pulse.current.scale.setScalar(1 + clock.current * 1.6);
    pulse.current.material.opacity = 0.6 * (1 - clock.current) ** 2;
  });

  return (
    <group position={position} rotation-x={-Math.PI / 2} scale={scale}>
      {/* La pastille noire masque la fin du pointillé : le tracé s'arrête net sur l'anneau. */}
      <mesh position-z={0.002}>
        <circleGeometry args={[0.1, 40]} />
        <meshBasicMaterial color={palette.pathCasing} toneMapped={false} />
      </mesh>
      <mesh ref={pulse} position-z={0.003}>
        <ringGeometry args={[0.088, 0.104, 48]} />
        <meshBasicMaterial color={palette.path} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position-z={0.004}>
        <ringGeometry args={[0.05, 0.078, 48]} />
        <meshBasicMaterial color={palette.path} toneMapped={false} />
      </mesh>
      <mesh position-z={0.004}>
        <circleGeometry args={[0.022, 24]} />
        <meshBasicMaterial color={palette.path} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * Déviation vers une pièce : même pointillé jaune cerné de noir que le parcours, en plus fin,
 * terminé par un arrêt.
 */
function PathDetour({ points, palette, animate, thickness }) {
  return (
    <group>
      <PathStroke
        points={points}
        palette={palette}
        animate={animate}
        casingWidth={3.7 * thickness}
        lineWidth={1.9 * thickness}
        dashSize={0.1}
        gapSize={0.08}
      />
      <PathStop position={points[points.length - 1]} palette={palette} animate={animate} />
    </group>
  );
}

function Floor({
  floor,
  offset,
  shiftX,
  shiftZ,
  palette,
  highlightKey,
  animate,
  onSelectPlace,
  onSelectFloor,
  onHover,
}) {
  const group = useRef(null);
  const presence = useRef(stackPresence(offset));
  const [initialPosition] = useState(() => [shiftX, stackHeight(offset), shiftZ]);
  const active = offset === 0;
  // Cases survolées par le parcours, un second départ ou une déviation (points fractionnaires →
  // case la plus proche).
  const pathCells = useMemo(() => {
    const cells = [
      ...(floor.path ?? []),
      ...(floor.pathFeeders ?? []).flat(),
      ...(floor.pathDetours ?? []).flat(),
    ];
    return new Set(cells.map(([col, row]) => Math.round(col) + ":" + Math.round(row)));
  }, [floor]);

  useFrame((_, delta) => {
    if (!group.current) return;
    easing.damp(group.current.position, "x", shiftX, 0.34, delta);
    easing.damp(group.current.position, "y", stackHeight(offset), 0.34, delta);
    easing.damp(group.current.position, "z", shiftZ, 0.34, delta);
    easing.damp(presence, "current", stackPresence(offset), 0.26, delta);
    group.current.visible = presence.current > 0.015;
  });

  return (
    <group ref={group} position={initialPosition}>
      {floor.slabs.map((loop, index) => (
        <Slab
          key={index}
          floor={floor}
          loop={loop}
          palette={palette}
          presence={presence}
          offset={offset}
          onSelectFloor={onSelectFloor}
        />
      ))}
      {floor.areas.map((area) => {
        let onSelect = null;
        if (area.kind === "place") onSelect = () => onSelectPlace(area.placeId);
        else if (area.kind === "stairs" && floor.stairsTarget !== null) {
          onSelect = () => onSelectFloor(floor.stairsTarget);
        }
        return (
          <Area
            key={area.id}
            floor={floor}
            area={area}
            palette={palette}
            presence={presence}
            floorActive={active}
            highlighted={active && highlightKey === area.key}
            onPath={area.cells.some((cell) => pathCells.has(cell.col + ":" + cell.row))}
            text={floor.texts[area.key]}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
      {active ? <VisitPath floor={floor} palette={palette} animate={animate} /> : null}
    </group>
  );
}

function CameraRig({ halfWidth, halfDepth }) {
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height));
  const placed = useRef(false);
  const target = useMemo(() => {
    const distance = fitDistance({
      halfWidth,
      halfDepth,
      height: PATH_Y,
      direction: CAMERA_DIRECTION,
      fov: CAMERA_FOV,
      aspect,
      margin: 1.04,
    });
    return CAMERA_DIRECTION.clone().multiplyScalar(distance);
  }, [halfWidth, halfDepth, aspect]);

  useFrame((_, delta) => {
    if (placed.current) easing.damp3(camera.position, target, 0.4, delta);
    else {
      camera.position.copy(target);
      placed.current = true;
    }
    camera.lookAt(0, -0.15, 0);
  });
  return null;
}

function Scene({
  floors,
  activeLevel,
  palette,
  mode,
  highlightKey,
  animate,
  onSelectPlace,
  onSelectFloor,
  onHover,
}) {
  const ground = useRef(null);
  const activeIndex = Math.max(0, floors.findIndex((floor) => floor.level === activeLevel));
  const active = floors[activeIndex];
  const extent = Math.max(...floors.map((floor) => Math.max(floor.cols, floor.rows))) * TILE;
  const groundY = -activeIndex * GAP_BELOW - SLAB_THICKNESS - 0.03;
  const light = palette.lightScale;
  const gl = useThree((state) => state.gl);

  // Au changement d'étage, la zone survolée perd ses gestionnaires avant d'avoir pu rendre le curseur.
  useEffect(() => {
    setCursor(gl, "");
  }, [gl, activeLevel]);

  useFrame((_, delta) => {
    if (ground.current) easing.damp(ground.current.position, "y", groundY, 0.34, delta);
  });

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <CameraRig halfWidth={(active.cols * TILE) / 2 + 0.1} halfDepth={(active.rows * TILE) / 2 + 0.1} />

      <hemisphereLight args={[palette.ambientSky, palette.ambientGround, 1.45 * light]} />
      <directionalLight
        castShadow
        position={[-3.5, 8, 4.5]}
        intensity={1.75 * light}
        color={palette.keyLight}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-extent, extent, extent, -extent, 0.5, 30]} />
      </directionalLight>
      <directionalLight position={[5, 3.5, -4]} intensity={0.35 * light} color={palette.ambientSky} />

      {/* Reflets doux sans fichier HDR distant : l'environnement est rendu une seule fois. */}
      <Environment key={mode} resolution={64} frames={1} environmentIntensity={0.32 * light}>
        <Lightformer
          form="rect"
          intensity={1.6}
          color={palette.ambientSky}
          position={[0, 6, 0]}
          rotation-x={Math.PI / 2}
          scale={[12, 12, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color={palette.keyLight}
          position={[-7, 2.5, 3]}
          rotation-y={Math.PI / 2}
          scale={[9, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color={palette.ambientSky}
          position={[7, 2.5, -3]}
          rotation-y={-Math.PI / 2}
          scale={[9, 4, 1]}
        />
      </Environment>

      <PresentationControls
        global
        snap
        cursor
        speed={1.15}
        zoom={1}
        polar={[-0.1, 0.16]}
        azimuth={[-0.7, 0.7]}
        damping={0.22}
      >
        {floors.map((floor, index) => (
          <Floor
            key={floor.level}
            floor={floor}
            offset={index - activeIndex}
            // Chaque étage est centré sur sa propre grille : on recale les autres sur celle de
            // l'étage affiché, pour que les cases (et l'escalier) restent à l'aplomb.
            shiftX={((floor.cols - active.cols) / 2) * TILE}
            shiftZ={((floor.rows - active.rows) / 2) * TILE}
            palette={palette}
            highlightKey={highlightKey}
            animate={animate}
            onSelectPlace={onSelectPlace}
            onSelectFloor={onSelectFloor}
            onHover={onHover}
          />
        ))}
        {/* Sol invisible : il ne montre que l'ombre portée de la maquette. */}
        <mesh ref={ground} position={[0, groundY, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[extent * 5, extent * 5]} />
          <shadowMaterial transparent opacity={palette.groundShadow} color={palette.shadow} />
        </mesh>
      </PresentationControls>

      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1.25} luminanceSmoothing={0.2} intensity={0.75} radius={0.72} />
      </EffectComposer>
    </>
  );
}

/**
 * @param {{
 *   floors: object[], activeLevel: number, palette: object, mode: 'light' | 'dark',
 *   highlightKey: string | null, running: boolean, animate: boolean,
 *   onSelectPlace: (placeId: string) => void, onSelectFloor: (level: number) => void,
 *   onHover: (key: string | null) => void,
 * }} props
 */
function FloorPlanCanvas({ running, ...scene }) {
  return (
    <Canvas
      flat
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={running ? "always" : "never"}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 90, position: [6, 9, 10] }}
      gl={{ powerPreference: "high-performance" }}
      // `pan-y` : un glissement vertical au doigt fait défiler la page, l'horizontal fait pivoter la maquette.
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <Scene {...scene} />
      </Suspense>
    </Canvas>
  );
}

export default memo(FloorPlanCanvas);
