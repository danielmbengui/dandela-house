import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { MusicConfig } from "../config/presentation.fr";
import { FPS, TOTAL_FRAMES } from "../config/timing";

type MusicTrackProps = {
  music: MusicConfig;
};

export const MusicTrack: React.FC<MusicTrackProps> = ({ music }) => {
  const frame = useCurrentFrame();
  const fadeInFrames = Math.round(music.fadeInSeconds * FPS);
  const fadeOutFrames = Math.round(music.fadeOutSeconds * FPS);

  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - fadeOutFrames, TOTAL_FRAMES],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const volume = music.volume * Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill>
      <Audio src={staticFile(music.src)} volume={volume} />
    </AbsoluteFill>
  );
};
