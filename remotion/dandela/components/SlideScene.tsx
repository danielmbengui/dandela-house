import React from "react";
import { AbsoluteFill } from "remotion";
import type { SlideConfig } from "../config/presentation.fr";
import type { VideoFormatSpec } from "../config/formats";
import { AnimatedImage } from "./AnimatedImage";
import { CinematicText } from "./CinematicText";
import { SceneTransition } from "./SceneTransition";

type SlideSceneProps = {
  slide: SlideConfig;
  format: VideoFormatSpec;
};

export const SlideScene: React.FC<SlideSceneProps> = ({ slide, format }) => {
  return (
    <SceneTransition>
      <AbsoluteFill>
        <AnimatedImage
          src={slide.imageSrc}
          alt={slide.imageAlt}
          motion={slide.motion}
          focusX={slide.focusX}
          focusY={slide.focusY}
          format={format}
        />
        <CinematicText
          kicker={slide.kicker}
          title={slide.title}
          subtitle={slide.subtitle}
          format={format}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
