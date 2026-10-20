import type {
  PresentationConfig,
  PresentationLocale,
  SlideConfig,
} from "./presentation.types";

const R = {
  kubango: "images/rooms/K. Kubango",
  malange: "images/rooms/Malange",
  maquela: "images/rooms/Maquela",
  bie: "images/rooms/Bie",
  huambo: "images/rooms/Huambo",
  outside: (n: number) => `images/outside/${n}.jpeg`,
  corridor: (n: number) => `images/corridors/${n}.jpeg`,
};

const SHARED_MUSIC = {
  src: "remotion/audio/dandela-afrobeat.mp3",
  isPlaceholder: false,
  note:
    "Africa — Arulo (Mixkit Free License, afrobeat). Voir public/remotion/audio/LICENSE.md.",
  volume: 0.78,
  fadeInSeconds: 0.8,
  fadeOutSeconds: 2.5,
};

type SlideText = Pick<SlideConfig, "kicker" | "title" | "subtitle" | "imageAlt">;

type LocaleCopy = {
  locationLine: string;
  ctaTitle: string;
  ctaSubtitle: string;
  intro: SlideText[];
  rooms: SlideText[];
  commons: SlideText[];
  amenities: SlideText[];
  outroAlt: string;
};

const COPY: Record<PresentationLocale, LocaleCopy> = {
  fr: {
    locationLine: "Guest house · Sapù, Luanda · Angola",
    ctaTitle: "Réservez votre séjour",
    ctaSubtitle: "Cinq chambres, réception et sérénité au Sapù, près de Calemba 2.",
    intro: [
      {
        imageAlt: "Extérieur DANDELA House",
        kicker: "Sapù · Luanda",
        title: "DANDELA House",
        subtitle: "Votre refuge en Angola",
      },
      {
        imageAlt: "Façade et entrée",
        title: "Bienvenue",
        subtitle: "Confort, intimité et accueil chaleureux",
      },
    ],
    rooms: [
      {
        imageAlt: "Chambre K. Kubango",
        kicker: "Chambre",
        title: "K. Kubango",
        subtitle: "Kitchenette, lit double, TV, clim et balcon",
      },
      {
        imageAlt: "Chambre Malange",
        kicker: "Chambre",
        title: "Malange",
        subtitle: "Salle de bain privée et frigo",
      },
      {
        imageAlt: "Chambre Maquela",
        kicker: "Chambre",
        title: "Maquela",
        subtitle: "Calme et climatisée à l'étage",
      },
      {
        imageAlt: "Chambre Bié",
        kicker: "Chambre",
        title: "Bié",
        subtitle: "Espace privé pour votre séjour",
      },
      {
        imageAlt: "Chambre Huambo",
        kicker: "Chambre",
        title: "Huambo",
        subtitle: "Même confort dans chaque chambre",
      },
      {
        imageAlt: "Détail chambre",
        title: "Cinq chambres privées",
        subtitle:
          "Kitchenette, frigo, salle de bain, lit double, TV, clim et balcon",
      },
    ],
    commons: [
      {
        imageAlt: "Couloir",
        title: "Couloirs",
        subtitle: "Circulation fluide à l'étage",
      },
      {
        imageAlt: "Espace commun",
        title: "Espaces communs",
        subtitle: "Propreté et lumière naturelle",
      },
      {
        imageAlt: "Couloir DANDELA House",
        title: "Accueil & ambiance",
        subtitle: "Un cadre soigné dès votre arrivée",
      },
      {
        imageAlt: "Circulation intérieure",
        title: "Salle de repos",
        subtitle: "Espace commun à l'étage, boissons disponibles",
      },
    ],
    amenities: [
      {
        imageAlt: "Extérieur et accès",
        title: "Garage sécurisé",
        subtitle: "Deux places pour vos véhicules",
      },
      {
        imageAlt: "Environnement de la maison",
        title: "Sérénité",
        subtitle: "Gardes à l'entrée et vidéosurveillance",
      },
      {
        imageAlt: "Intérieur de la maison",
        title: "Tout le nécessaire",
        subtitle: "Réception sur place, 08h–17h",
      },
    ],
    outroAlt: "DANDELA House",
  },
  pt: {
    locationLine: "Guest house · Sapù, Luanda · Angola",
    ctaTitle: "Reserve a sua estadia",
    ctaSubtitle: "Cinco quartos, receção e serenidade no Sapù, perto de Calemba 2.",
    intro: [
      {
        imageAlt: "Exterior DANDELA House",
        kicker: "Sapù · Luanda",
        title: "DANDELA House",
        subtitle: "O seu refúgio em Angola",
      },
      {
        imageAlt: "Fachada e entrada",
        title: "Bem-vindo",
        subtitle: "Conforto, intimidade e acolhimento",
      },
    ],
    rooms: [
      {
        imageAlt: "Quarto K. Kubango",
        kicker: "Quarto",
        title: "K. Kubango",
        subtitle: "Kitchenette, cama de casal, TV, ar condicionado e varanda",
      },
      {
        imageAlt: "Quarto Malange",
        kicker: "Quarto",
        title: "Malange",
        subtitle: "Casa de banho privada e frigorífico",
      },
      {
        imageAlt: "Quarto Maquela",
        kicker: "Quarto",
        title: "Maquela",
        subtitle: "Silêncio e ar condicionado no andar de cima",
      },
      {
        imageAlt: "Quarto Bié",
        kicker: "Quarto",
        title: "Bié",
        subtitle: "Espaço privado para a sua estadia",
      },
      {
        imageAlt: "Quarto Huambo",
        kicker: "Quarto",
        title: "Huambo",
        subtitle: "O mesmo conforto em cada quarto",
      },
      {
        imageAlt: "Detalhe do quarto",
        title: "Cinco quartos privados",
        subtitle:
          "Kitchenette, frigorífico, casa de banho, cama de casal, TV, ar condicionado e varanda",
      },
    ],
    commons: [
      {
        imageAlt: "Corredor",
        title: "Corredores",
        subtitle: "Circulação fluida no andar de cima",
      },
      {
        imageAlt: "Área comum",
        title: "Áreas comuns",
        subtitle: "Limpeza e luz natural",
      },
      {
        imageAlt: "Corredor DANDELA House",
        title: "Acolhimento e ambiente",
        subtitle: "Um espaço cuidado desde a chegada",
      },
      {
        imageAlt: "Circulação interior",
        title: "Sala de descanso",
        subtitle: "Espaço comum no andar de cima, bebidas disponíveis",
      },
    ],
    amenities: [
      {
        imageAlt: "Exterior e acesso",
        title: "Garagem segura",
        subtitle: "Dois lugares para os seus veículos",
      },
      {
        imageAlt: "Arredores da casa",
        title: "Serenidade",
        subtitle: "Guardas à entrada e videovigilância",
      },
      {
        imageAlt: "Interior da casa",
        title: "Tudo o que precisa",
        subtitle: "Receção no local, 08h–17h",
      },
    ],
    outroAlt: "DANDELA House",
  },
  en: {
    locationLine: "Guest house · Sapù, Luanda · Angola",
    ctaTitle: "Book your stay",
    ctaSubtitle: "Five rooms, on-site reception and calm in Sapù, near Calemba 2.",
    intro: [
      {
        imageAlt: "DANDELA House exterior",
        kicker: "Sapù · Luanda",
        title: "DANDELA House",
        subtitle: "Your refuge in Angola",
      },
      {
        imageAlt: "Facade and entrance",
        title: "Welcome",
        subtitle: "Comfort, privacy and a warm welcome",
      },
    ],
    rooms: [
      {
        imageAlt: "K. Kubango room",
        kicker: "Room",
        title: "K. Kubango",
        subtitle: "Kitchenette, double bed, TV, A/C and balcony",
      },
      {
        imageAlt: "Malange room",
        kicker: "Room",
        title: "Malange",
        subtitle: "Private bathroom and fridge",
      },
      {
        imageAlt: "Maquela room",
        kicker: "Room",
        title: "Maquela",
        subtitle: "Quiet and air-conditioned upstairs",
      },
      {
        imageAlt: "Bié room",
        kicker: "Room",
        title: "Bié",
        subtitle: "Private space for your stay",
      },
      {
        imageAlt: "Huambo room",
        kicker: "Room",
        title: "Huambo",
        subtitle: "The same comfort in every room",
      },
      {
        imageAlt: "Room detail",
        title: "Five private rooms",
        subtitle:
          "Kitchenette, fridge, bathroom, double bed, TV, A/C and balcony",
      },
    ],
    commons: [
      {
        imageAlt: "Corridor",
        title: "Corridors",
        subtitle: "Easy flow on the upper floor",
      },
      {
        imageAlt: "Shared space",
        title: "Shared areas",
        subtitle: "Cleanliness and natural light",
      },
      {
        imageAlt: "DANDELA House corridor",
        title: "Welcome & atmosphere",
        subtitle: "A cared-for setting from the moment you arrive",
      },
      {
        imageAlt: "Interior circulation",
        title: "Lounge",
        subtitle: "Shared upstairs space with drinks available",
      },
    ],
    amenities: [
      {
        imageAlt: "Exterior and access",
        title: "Secure garage",
        subtitle: "Two spaces for your vehicles",
      },
      {
        imageAlt: "House surroundings",
        title: "Peace of mind",
        subtitle: "Guards at the gate and CCTV",
      },
      {
        imageAlt: "House interior",
        title: "Everything you need",
        subtitle: "On-site reception, 8am–5pm",
      },
    ],
    outroAlt: "DANDELA House",
  },
};

const INTRO_MEDIA = [
  {
    imageSrc: R.outside(1),
    motion: "zoomIn" as const,
    focusX: 0.5,
    focusY: 0.4,
  },
  {
    imageSrc: R.outside(2),
    motion: "panRight" as const,
    focusX: 0.5,
    focusY: 0.45,
  },
];

const ROOMS_MEDIA = [
  { imageSrc: `${R.kubango}/1.jpg`, motion: "zoomIn" as const },
  { imageSrc: `${R.malange}/1.png`, motion: "panLeft" as const },
  { imageSrc: `${R.maquela}/1.jpg`, motion: "zoomOut" as const },
  { imageSrc: `${R.bie}/1.jpeg`, motion: "panRight" as const },
  { imageSrc: `${R.huambo}/1.jpeg`, motion: "zoomIn" as const },
  { imageSrc: `${R.huambo}/2.jpeg`, motion: "panLeft" as const },
];

const COMMONS_MEDIA = [
  { imageSrc: R.corridor(2), motion: "zoomIn" as const },
  { imageSrc: R.corridor(4), motion: "panLeft" as const },
  { imageSrc: R.corridor(6), motion: "panRight" as const },
  { imageSrc: R.corridor(10), motion: "zoomOut" as const },
];

const AMENITIES_MEDIA = [
  { imageSrc: R.outside(4), motion: "zoomIn" as const },
  { imageSrc: R.outside(5), motion: "panLeft" as const },
  { imageSrc: R.corridor(12), motion: "zoomIn" as const },
];

function mergeSlides(
  media: { imageSrc: string; motion?: SlideConfig["motion"]; focusX?: number; focusY?: number }[],
  text: SlideText[],
): SlideConfig[] {
  return media.map((m, i) => ({ ...m, ...text[i] }));
}

export function buildPresentation(locale: PresentationLocale): PresentationConfig {
  const copy = COPY[locale];

  return {
    locale,
    brandName: "DANDELA House",
    locationLine: copy.locationLine,
    ctaTitle: copy.ctaTitle,
    ctaSubtitle: copy.ctaSubtitle,
    ctaHint: "house@dandela.com",
    logoMark: "images/logo-mark-dark.png",
    logoFull: "images/logo-full-dark.png",
    music: SHARED_MUSIC,
    scenes: {
      intro: {
        id: "intro",
        slides: mergeSlides(INTRO_MEDIA, copy.intro),
      },
      rooms: {
        id: "rooms",
        slides: mergeSlides(ROOMS_MEDIA, copy.rooms),
      },
      commons: {
        id: "commons",
        slides: mergeSlides(COMMONS_MEDIA, copy.commons),
      },
      amenities: {
        id: "amenities",
        slides: mergeSlides(AMENITIES_MEDIA, copy.amenities),
      },
      outro: {
        id: "outro",
        slides: [
          {
            imageSrc: R.outside(7),
            imageAlt: copy.outroAlt,
            motion: "zoomIn",
            focusX: 0.5,
            focusY: 0.45,
          },
        ],
      },
    },
  };
}

export const presentationFr = buildPresentation("fr");
export const presentationPt = buildPresentation("pt");
export const presentationEn = buildPresentation("en");
