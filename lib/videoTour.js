/** Sources de la visite Remotion 16:9 par locale (fichiers dans public/videos/). */
export const VIDEO_TOUR_SRC = {
  fr: "/videos/dandela-remotion-fr.mp4",
  pt: "/videos/dandela-remotion-pt.mp4",
  en: "/videos/dandela-remotion-en.mp4",
};

export function videoTourSrcForLocale(locale) {
  return VIDEO_TOUR_SRC[locale] ?? VIDEO_TOUR_SRC.fr;
}
