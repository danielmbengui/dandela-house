export const FPS = 30;
export const TOTAL_DURATION_SECONDS = 45;

export const secondsToFrames = (seconds: number, fps: number = FPS): number =>
  Math.round(seconds * fps);

export const SCENE_DURATIONS_SECONDS = {
  intro: 5,
  rooms: 13,
  commons: 12,
  amenities: 9,
  outro: 6,
} as const;

export const TOTAL_FRAMES = secondsToFrames(TOTAL_DURATION_SECONDS);
