import React from "react";
import { Composition } from "remotion";
import {
  DandelaPresentation,
  type DandelaPresentationProps,
} from "./dandela/DandelaPresentation";
import {
  compositionId,
  PRESENTATION_FORMATS,
  PRESENTATION_LOCALES,
} from "./dandela/config/compositions";
import { VIDEO_FORMATS, type VideoFormatId } from "./dandela/config/formats";
import { FPS, TOTAL_DURATION_SECONDS, TOTAL_FRAMES } from "./dandela/config/timing";
import type { PresentationLocale } from "./dandela/config/presentation.types";

const CompositionForLocaleFormat: React.FC<{
  locale: PresentationLocale;
  formatId: VideoFormatId;
}> = ({ locale, formatId }) => {
  const spec = VIDEO_FORMATS[formatId];
  const defaultProps: DandelaPresentationProps = { formatId, locale };

  return (
    <Composition
      id={compositionId(locale, formatId)}
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
      {PRESENTATION_LOCALES.flatMap((locale) =>
        PRESENTATION_FORMATS.map((formatId) => (
          <CompositionForLocaleFormat
            key={compositionId(locale, formatId)}
            locale={locale}
            formatId={formatId}
          />
        )),
      )}
    </>
  );
};

/** Durée exportée pour scripts CLI. */
export const REMOTION_META = {
  fps: FPS,
  durationSeconds: TOTAL_DURATION_SECONDS,
  defaultComposition: compositionId("fr", "vertical"),
} as const;
