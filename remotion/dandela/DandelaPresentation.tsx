import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, Series } from "remotion";
import type { VideoFormatId } from "./config/formats";
import { getFormat } from "./config/formats";
import {
  getSceneList,
  presentationFr,
  type PresentationConfig,
  type SceneConfig,
} from "./config/presentation.fr";
import {
  FPS,
  SCENE_DURATIONS_SECONDS,
  secondsToFrames,
} from "./config/timing";
import { dandelaColors } from "./theme/colors";
import { LogoReveal } from "./components/LogoReveal";
import { MusicTrack } from "./components/MusicTrack";
import { SlideScene } from "./components/SlideScene";
import { CinematicText } from "./components/CinematicText";
import { AnimatedImage } from "./components/AnimatedImage";
import { SceneTransition } from "./components/SceneTransition";

export type DandelaPresentationProps = {
  formatId: VideoFormatId;
  config?: PresentationConfig;
};

const sceneDurationSeconds: Record<string, number> = {
  intro: SCENE_DURATIONS_SECONDS.intro,
  rooms: SCENE_DURATIONS_SECONDS.rooms,
  commons: SCENE_DURATIONS_SECONDS.commons,
  amenities: SCENE_DURATIONS_SECONDS.amenities,
  outro: SCENE_DURATIONS_SECONDS.outro,
};

const distributeSlideDurations = (
  scene: SceneConfig,
  sceneSeconds: number,
): number[] => {
  const count = scene.slides.length;
  const totalFrames = secondsToFrames(sceneSeconds);
  const base = Math.floor(totalFrames / count);
  const remainder = totalFrames - base * count;
  return scene.slides.map((_, index) =>
    index < remainder ? base + 1 : base,
  );
};

export const DandelaPresentation: React.FC<DandelaPresentationProps> = ({
  formatId,
  config = presentationFr,
}) => {
  const format = getFormat(formatId);
  const scenes = getSceneList(config);

  const sceneFrames = useMemo(
    () =>
      scenes.map((scene) =>
        secondsToFrames(sceneDurationSeconds[scene.id] ?? 5),
      ),
    [scenes],
  );

  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: dandelaColors.forestDeep }}>
      <MusicTrack music={config.music} />

      {scenes.map((scene, sceneIndex) => {
        const sceneStart = cursor;
        const sceneLength = sceneFrames[sceneIndex];
        cursor += sceneLength;

        const slideDurations = distributeSlideDurations(
          scene,
          sceneDurationSeconds[scene.id] ?? 5,
        );

        return (
          <Sequence
            key={scene.id}
            from={sceneStart}
            durationInFrames={sceneLength}
            name={scene.id}
          >
            {scene.id === "outro" ? (
              <OutroSequence config={config} format={format} />
            ) : (
              <Series>
                {scene.slides.map((slide, slideIndex) => (
                  <Series.Sequence
                    key={`${scene.id}-${slideIndex}`}
                    durationInFrames={slideDurations[slideIndex]}
                  >
                    <SlideScene slide={slide} format={format} />
                  </Series.Sequence>
                ))}
              </Series>
            )}

            {scene.id === "intro" ? (
              <Sequence
                from={0}
                durationInFrames={Math.min(
                  slideDurations[0] ?? sceneLength,
                  sceneLength,
                )}
              >
                <LogoReveal
                  logoSrc={config.logoMark}
                  brandName={config.brandName}
                  format={format}
                  variant="mark"
                />
              </Sequence>
            ) : null}
          </Sequence>
        );
      })}

      {config.music.isPlaceholder ? (
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            padding: 16,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "rgba(248,242,232,0.35)",
              fontFamily: "monospace",
              maxWidth: 360,
              textAlign: "right",
            }}
          >
            Audio placeholder
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

type OutroSequenceProps = {
  config: PresentationConfig;
  format: ReturnType<typeof getFormat>;
};

const OutroSequence: React.FC<OutroSequenceProps> = ({ config, format }) => {
  const slide = config.scenes.outro.slides[0];

  return (
    <SceneTransition fadeInFrames={20} fadeOutFrames={24}>
      <AbsoluteFill>
        <AnimatedImage
          src={slide.imageSrc}
          alt={slide.imageAlt}
          motion="zoomIn"
          focusX={slide.focusX}
          focusY={slide.focusY}
          format={format}
          motionIntensity={0.7}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, transparent 30%, ${dandelaColors.overlayStrong} 100%)`,
          }}
        />
        <LogoReveal
          logoSrc={config.logoFull}
          brandName={config.brandName}
          locationLine={config.locationLine}
          format={format}
          variant="full"
          placement="upper"
        />
        <CinematicText
          title={config.ctaTitle}
          subtitle={`${config.ctaSubtitle} · ${config.ctaHint}`}
          format={format}
          align="bottom"
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
