export type VideoFormatId = "vertical" | "horizontal" | "square";

export type VideoFormatSpec = {
  id: VideoFormatId;
  width: number;
  height: number;
  /** Facteur de taille de police par rapport au format vertical. */
  textScale: number;
  /** Marge safe zone (px) pour titres. */
  safePaddingX: number;
  safePaddingY: number;
};

export const VIDEO_FORMATS: Record<VideoFormatId, VideoFormatSpec> = {
  vertical: {
    id: "vertical",
    width: 1080,
    height: 1920,
    textScale: 1,
    safePaddingX: 72,
    safePaddingY: 120,
  },
  horizontal: {
    id: "horizontal",
    width: 1920,
    height: 1080,
    textScale: 0.92,
    safePaddingX: 96,
    safePaddingY: 72,
  },
  square: {
    id: "square",
    width: 1080,
    height: 1080,
    textScale: 0.88,
    safePaddingX: 64,
    safePaddingY: 80,
  },
};

export const getFormat = (id: VideoFormatId): VideoFormatSpec =>
  VIDEO_FORMATS[id];
