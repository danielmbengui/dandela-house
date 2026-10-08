import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoFormatSpec } from "../config/formats";
import { dandelaColors } from "../theme/colors";

export type KenBurnsMotion = "zoomIn" | "zoomOut" | "panLeft" | "panRight";

type AnimatedImageProps = {
  src: string;
  alt: string;
  motion?: KenBurnsMotion;
  focusX?: number;
  focusY?: number;
  format: VideoFormatSpec;
  /** Intensité du mouvement (1 = défaut). */
  motionIntensity?: number;
};

const motionPresets: Record<
  KenBurnsMotion,
  { scaleFrom: number; scaleTo: number; xFrom: number; xTo: number; yFrom: number; yTo: number }
> = {
  zoomIn: { scaleFrom: 1.05, scaleTo: 1.18, xFrom: 0, xTo: 0, yFrom: 0, yTo: -1.5 },
  zoomOut: { scaleFrom: 1.16, scaleTo: 1.05, xFrom: -1, xTo: 1, yFrom: 0, yTo: 0 },
  panLeft: { scaleFrom: 1.12, scaleTo: 1.12, xFrom: 2.5, xTo: -2.5, yFrom: 0, yTo: 0 },
  panRight: { scaleFrom: 1.12, scaleTo: 1.12, xFrom: -2.5, xTo: 2.5, yFrom: 0, yTo: 0 },
};

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  motion = "zoomIn",
  focusX = 0.5,
  focusY = 0.5,
  format,
  motionIntensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const preset = motionPresets[motion];

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(
    progress,
    [0, 1],
    [preset.scaleFrom, preset.scaleTo],
  );
  const translateX =
    interpolate(progress, [0, 1], [preset.xFrom, preset.xTo]) *
    motionIntensity;
  const translateY =
    interpolate(progress, [0, 1], [preset.yFrom, preset.yTo]) *
    motionIntensity;

  const objectPosition = `${focusX * 100}% ${focusY * 100}%`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dandelaColors.forestDeep,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: objectPosition,
        }}
      >
        <Img
          src={staticFile(src)}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${dandelaColors.overlay} 0%, transparent 35%, transparent 55%, ${dandelaColors.overlayStrong} 100%)`,
        }}
      />
      {format.id !== "vertical" ? (
        <AbsoluteFill
          style={{
            boxShadow: `inset 0 0 120px ${dandelaColors.forestDeep}`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
