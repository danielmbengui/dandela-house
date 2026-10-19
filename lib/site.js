/** Coordonnées et liens du site. Les numéros sont des valeurs provisoires à remplacer. */
export const SITE = {
  name: "DANDELA House",
  whatsappNumber: "244923000000",
  phoneDisplay: "+244 923 000 000",
  phoneHref: "tel:+244923000000",
  email: "contact@dandela-house.ao",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=DANDELA+House+Sapu+Angola",
  social: {
    facebook: "https://facebook.com/dandela.house.sapu",
    tiktok: "https://www.tiktok.com/@dandela.house",
    instagram: "https://instagram.com/dandela.house",
  },
  video: {
    src: "/videos/pr%C3%A9sentation-pt.mp4",
    poster: "/videos/poster.jpg",
  },
};

export function whatsappHref(message) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
