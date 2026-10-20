/** Coordonnées et liens du site. Les trois lignes sont joignables sur WhatsApp, dans cet ordre. */
export const SITE = {
  name: "DANDELA House",
  phones: [
    { display: "+244 923 081 057", e164: "244923081057" },
    { display: "+41 78 757 54 50", e164: "41787575450" },
    { display: "+41 78 617 84 24", e164: "41786178424" },
  ],
  email: "house@dandela.com",
  /**
   * Quartier : Sapù, près de Calemba 2 (Luanda). Textes site = messages i18n.
   * mapsAddress = libellé Google aujourd’hui ; à réaligner si la fiche validée affiche rue/bairro.
   */
  address:
    "Rua da Ana Paula, Sapù (Calemba 2), 475M+M9Q, Luanda, province de Luanda, Angola",
  mapsPlaceName: "Dandela House",
  mapsAddress: "475M+M9Q, Luanda",
  mapsHref:
    "https://www.google.com/maps/place/Dandela+House/@-8.8909785,13.2861041,17z/data=!3m1!4b1!4m6!3m5!1s0x1a51f7003b5bc29d%3A0xe3ab2e787302b03!8m2!3d-8.8909785!4d13.2861041",
  mapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.8775149432204!2d13.283529199999998!3d-8.8909785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f7003b5bc29d%3A0xe3ab2e787302b03!2sDandela%20House!5e0!3m2!1sfr!2sao!4v1792453274315!5m2!1sfr!2sao",
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

export function whatsappHref(message, e164 = SITE.phones[0].e164) {
  const base = `https://wa.me/${e164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
