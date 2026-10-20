import type { KenBurnsMotion } from "../components/AnimatedImage";

export type PresentationLocale = "fr" | "pt" | "en";

export type SlideConfig = {
  imageSrc: string;
  imageAlt: string;
  motion?: KenBurnsMotion;
  focusX?: number;
  focusY?: number;
  title?: string;
  subtitle?: string;
  kicker?: string;
};

export type SceneConfig = {
  id: string;
  slides: SlideConfig[];
};

export type MusicConfig = {
  src: string;
  isPlaceholder: boolean;
  note: string;
  volume: number;
  fadeInSeconds: number;
  fadeOutSeconds: number;
};

export type PresentationConfig = {
  locale: PresentationLocale;
  brandName: string;
  locationLine: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaHint: string;
  logoMark: string;
  logoFull: string;
  music: MusicConfig;
  scenes: {
    intro: SceneConfig;
    rooms: SceneConfig;
    commons: SceneConfig;
    amenities: SceneConfig;
    outro: SceneConfig;
  };
};

export const getSceneList = (config: PresentationConfig): SceneConfig[] => [
  config.scenes.intro,
  config.scenes.rooms,
  config.scenes.commons,
  config.scenes.amenities,
  config.scenes.outro,
];
