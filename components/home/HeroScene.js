"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, Stars, useTexture } from "@react-three/drei";
import { BackSide, DoubleSide, Quaternion, Vector3 } from "three";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { globeQuaternionToFace, latLonToVector3 } from "@/lib/geo";
import {
  AFRICA_FOCUS,
  ANGOLA_BORDER_LOOP,
  GLOBE_PINS,
} from "@/lib/angolaGlobe";

const RADIUS = 1.15;
const UP = new Vector3(0, 1, 0);

function Atmosphere() {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1.045 + Math.sin(clock.elapsedTime * 0.8) * 0.012;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshBasicMaterial
        color="#7eb6ff"
        transparent
        opacity={0.16}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function AngolaOutline() {
  const lineRef = useRef(null);
  const points = useMemo(
    () =>
      ANGOLA_BORDER_LOOP.map(([lat, lon]) =>
        latLonToVector3(lat, lon, RADIUS * 1.012),
      ),
    [],
  );

  useFrame(({ clock }) => {
    if (!lineRef.current?.material) return;
    lineRef.current.material.opacity =
      0.72 + Math.sin(clock.elapsedTime * 1.6) * 0.22;
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#f4e2b0"
      lineWidth={2}
      transparent
      opacity={0.85}
    />
  );
}

function Pin({ pin, label, onSelect }) {
  const surface = useMemo(
    () => latLonToVector3(pin.lat, pin.lon, RADIUS * 1.01),
    [pin.lat, pin.lon],
  );
  const orientation = useMemo(() => {
    const normal = surface.clone().normalize();
    return new Quaternion().setFromUnitVectors(UP, normal);
  }, [surface]);
  const ringRef = useRef(null);
  const isHouse = Boolean(pin.roomId);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2 + pin.lat) * 0.18;
    ringRef.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <group
      position={surface}
      quaternion={orientation}
      onClick={(event) => {
        event.stopPropagation();
        if (pin.roomId) onSelect(pin.roomId);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = pin.roomId ? "pointer" : "default";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <mesh position={[0, 0.045, 0]}>
        <sphereGeometry args={[isHouse ? 0.028 : 0.02, 20, 20]} />
        <meshStandardMaterial
          color="#fff8ee"
          emissive={isHouse ? "#b54760" : "#bda77c"}
          emissiveIntensity={1.1}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.018, 0.07, 10]} />
        <meshStandardMaterial
          color={isHouse ? "#8b3045" : "#f8f2e8"}
          emissive={isHouse ? "#8b3045" : "#bda77c"}
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.04, 0.055, 40]} />
        <meshBasicMaterial
          color={isHouse ? "#a8c66c" : "#f4e2b0"}
          transparent
          opacity={0.9}
          side={DoubleSide}
        />
      </mesh>
      <Html
        position={[0, 0.2, 0]}
        center
        distanceFactor={1.35}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#fffcf7",
            background: isHouse
              ? "rgba(139, 48, 69, 0.94)"
              : "rgba(24, 45, 37, 0.88)",
            border: "1px solid rgba(244, 226, 176, 0.7)",
            borderRadius: 999,
            padding: "4px 10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function Earth({ labels, onSelect, animate }) {
  const [colorMap, bumpMap] = useTexture([
    "/textures/earth-day.jpg",
    "/textures/earth-topology.png",
  ]);
  const facing = useMemo(
    () => globeQuaternionToFace(AFRICA_FOCUS.lat, AFRICA_FOCUS.lon),
    [],
  );
  const floatRef = useRef(null);

  useFrame(({ clock }) => {
    if (!floatRef.current || !animate) return;
    const t = clock.elapsedTime;
    floatRef.current.position.y = Math.sin(t * 0.45) * 0.035;
  });

  return (
    <group ref={floatRef} quaternion={facing}>
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.045}
          roughness={0.78}
          metalness={0.08}
        />
      </mesh>
      <Atmosphere />
      <AngolaOutline />
      {GLOBE_PINS.map((pin) => (
        <Pin
          key={pin.id}
          pin={pin}
          label={labels[pin.labelKey]}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function Sun({ animate }) {
  const light = useRef(null);

  useFrame(({ clock }) => {
    if (!light.current || !animate) return;
    const t = clock.elapsedTime * 0.35;
    light.current.position.set(Math.sin(t) * 2.4, 1.15, 3.4);
  });

  return <directionalLight ref={light} intensity={1.35} color="#fff4e4" />;
}

function Scene({ animate, labels, onSelect }) {
  return (
    <>
      <color attach="background" args={["#07110e"]} />
      <Stars radius={18} depth={8} count={900} factor={2.2} fade speed={0.4} />
      <ambientLight intensity={0.38} />
      <Sun animate={animate} />
      <pointLight position={[-2.2, -0.4, 2.4]} intensity={0.55} color="#a8c66c" />
      <Suspense fallback={null}>
        <Earth labels={labels} onSelect={onSelect} animate={animate} />
      </Suspense>
    </>
  );
}

export default function HeroScene() {
  const t = useTranslations("hero");
  const router = useRouter();
  const [animate, setAnimate] = useState(true);

  const labels = useMemo(
    () => ({
      pinLuanda: t("pinLuanda"),
      pinSapu: t("pinSapu"),
    }),
    [t],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.05, 2.85], fov: 36 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <Scene
        animate={animate}
        labels={labels}
        onSelect={(roomId) => router.push(`/chambres-tarifs#${roomId}`)}
      />
    </Canvas>
  );
}
