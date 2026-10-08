import React from "react";
import { Composition } from "remotion";
import {
  DandelaPresentation,
  type DandelaPresentationProps,
} from "./dandela/DandelaPresentation";
import { VIDEO_FORMATS, type VideoFormatId } from "./dandela/config/formats";
import { FPS, TOTAL_DURATION_SECONDS, TOTAL_FRAMES } from "./dandela/config/timing";

const compositionIds: Record<VideoFormatId, string> = {
  vertical: "DandelaPresentation-FR-9x16",
  horizontal: "DandelaPresentation-FR-16x9",
  square: "DandelaPresentation-FR-1x1",
};

const CompositionForFormat: React.FC<{ formatId: VideoFormatId }> = ({
  formatId,
}) => {
  const spec = VIDEO_FORMATS[formatId];
  const defaultProps: DandelaPresentationProps = { formatId };

  return (
    <Composition
      id={compositionIds[formatId]}
      component={DandelaPresentation}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={spec.width}
      height={spec.height}
      defaultProps={defaultProps}
    />
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <CompositionForFormat formatId="vertical" />
      <CompositionForFormat formatId="horizontal" />
      <CompositionForFormat formatId="square" />
    </>
  );
};

/** Durée exportée pour scripts CLI. */
export const REMOTION_META = {
  fps: FPS,
  durationSeconds: TOTAL_DURATION_SECONDS,
  defaultComposition: compositionIds.vertical,
} as const;
