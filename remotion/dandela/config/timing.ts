export const FPS = 30;
export const TOTAL_DURATION_SECONDS = 48;

export const secondsToFrames = (seconds: number, fps: number = FPS): number =>
  Math.round(seconds * fps);

export const SCENE_DURATIONS_SECONDS = {
  intro: 6,
  rooms: 18,
  commons: 10,
  amenities: 8,
  outro: 6,
} as const;

export const TOTAL_FRAMES = secondsToFrames(TOTAL_DURATION_SECONDS);
