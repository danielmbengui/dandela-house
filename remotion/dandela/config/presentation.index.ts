import {
  buildPresentation,
  presentationEn,
  presentationFr,
  presentationPt,
} from "./presentation.build";
import type { PresentationConfig, PresentationLocale } from "./presentation.types";

export const presentations: Record<PresentationLocale, PresentationConfig> = {
  fr: presentationFr,
  pt: presentationPt,
  en: presentationEn,
};

export function getPresentationConfig(
  locale: PresentationLocale,
): PresentationConfig {
  return presentations[locale] ?? presentationFr;
}

export { buildPresentation, presentationFr, presentationPt, presentationEn };
export type { PresentationConfig, PresentationLocale } from "./presentation.types";
export { getSceneList } from "./presentation.types";

export type VideoTourLocale = PresentationLocale;

/** Fichiers MP4 16:9 servis depuis `public/videos/`. */
export const SITE_VIDEO_TOUR_SRC: Record<VideoTourLocale, string> = {
  fr: "/videos/dandela-remotion-fr.mp4",
  pt: "/videos/dandela-remotion-pt.mp4",
  en: "/videos/dandela-remotion-en.mp4",
};
