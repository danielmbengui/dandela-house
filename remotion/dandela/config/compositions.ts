import type { VideoFormatId } from "./formats";
import type { PresentationLocale } from "./presentation.types";

export function compositionId(
  locale: PresentationLocale,
  formatId: VideoFormatId,
): string {
  const loc = locale.toUpperCase();
  const suffix =
    formatId === "vertical"
      ? "9x16"
      : formatId === "horizontal"
        ? "16x9"
        : "1x1";
  return `DandelaPresentation-${loc}-${suffix}`;
}

export const PRESENTATION_LOCALES: PresentationLocale[] = ["fr", "pt", "en"];
export const PRESENTATION_FORMATS: VideoFormatId[] = [
  "vertical",
  "horizontal",
  "square",
];
