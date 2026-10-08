import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { dandelaColors } from "../theme/colors";

type SceneTransitionProps = {
  children: React.ReactNode;
  /** Frames de fondu en entrée. */
  fadeInFrames?: number;
  /** Frames de fondu en sortie. */
  fadeOutFrames?: number;
};

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
  fadeInFrames = 15,
  fadeOutFrames = 18,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames - 1],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const drift = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(drift, [0, 1], [0, -6]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: dandelaColors.forestDeep,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
