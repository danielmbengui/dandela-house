import type { KenBurnsMotion } from "../components/AnimatedImage";

export type SlideConfig = {
  /** Chemin relatif à public/ (sans slash initial). */
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
  locale: "fr";
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

const R = {
  kubango: "images/rooms/K. Kubango",
  malange: "images/rooms/Malange",
  maquela: "images/rooms/Maquela",
  bie: "images/rooms/Bie",
  huambo: "images/rooms/Huambo",
  outside: (n: number) => `images/outside/${n}.jpeg`,
  corridor: (n: number) => `images/corridors/${n}.jpeg`,
};

/**
 * Configuration centralisée — modifier textes et médias ici sans toucher aux composants.
 */
export const presentationFr: PresentationConfig = {
  locale: "fr",
  brandName: "DANDELA House",
  locationLine: "Guest house · Sapù, Luanda · Angola",
  ctaTitle: "Réservez votre séjour",
  ctaSubtitle: "Cinq chambres, réception et sérénité au Sapù, près de Calemba 2.",
  ctaHint: "house@dandela.com",
  logoMark: "images/logo-mark-dark.png",
  logoFull: "images/logo-full-dark.png",
  music: {
    src: "remotion/audio/dandela-afrobeat.mp3",
    isPlaceholder: false,
    note:
      "Africa — Arulo (Mixkit Free License, afrobeat). Voir public/remotion/audio/LICENSE.md.",
    volume: 0.78,
    fadeInSeconds: 0.8,
    fadeOutSeconds: 2.5,
  },
  scenes: {
    intro: {
      id: "intro",
      slides: [
        {
          imageSrc: R.outside(1),
          imageAlt: "Extérieur DANDELA House",
          motion: "zoomIn",
          focusX: 0.5,
          focusY: 0.4,
          kicker: "Sapù · Luanda",
          title: "DANDELA House",
          subtitle: "Votre refuge en Angola",
        },
        {
          imageSrc: R.outside(2),
          imageAlt: "Façade et entrée",
          motion: "panRight",
          focusX: 0.5,
          focusY: 0.45,
          title: "Bienvenue",
          subtitle: "Confort, intimité et accueil chaleureux",
        },
      ],
    },
    rooms: {
      id: "rooms",
      slides: [
        {
          imageSrc: `${R.kubango}/1.jpg`,
          imageAlt: "Chambre K. Kubango",
          motion: "zoomIn",
          kicker: "Chambre",
          title: "K. Kubango",
          subtitle: "Kitchenette, lit double, TV, clim et balcon",
        },
        {
          imageSrc: `${R.malange}/1.png`,
          imageAlt: "Chambre Malange",
          motion: "panLeft",
          kicker: "Chambre",
          title: "Malange",
          subtitle: "Salle de bain privée et frigo",
        },
        {
          imageSrc: `${R.maquela}/1.jpg`,
          imageAlt: "Chambre Maquela",
          motion: "zoomOut",
          kicker: "Chambre",
          title: "Maquela",
          subtitle: "Calme et climatisée à l'étage",
        },
        {
          imageSrc: `${R.bie}/1.jpeg`,
          imageAlt: "Chambre Bié",
          motion: "panRight",
          kicker: "Chambre",
          title: "Bié",
          subtitle: "Espace privé pour votre séjour",
        },
        {
          imageSrc: `${R.huambo}/1.jpeg`,
          imageAlt: "Chambre Huambo",
          motion: "zoomIn",
          kicker: "Chambre",
          title: "Huambo",
          subtitle: "Même confort dans chaque chambre",
        },
        {
          imageSrc: `${R.huambo}/2.jpeg`,
          imageAlt: "Détail chambre",
          motion: "panLeft",
          title: "Cinq chambres privées",
          subtitle: "Kitchenette, frigo, salle de bain, lit double, TV, clim et balcon",
        },
      ],
    },
    commons: {
      id: "commons",
      slides: [
        {
          imageSrc: R.corridor(2),
          imageAlt: "Couloir",
          motion: "zoomIn",
          title: "Couloirs",
          subtitle: "Circulation fluide à l'étage",
        },
        {
          imageSrc: R.corridor(4),
          imageAlt: "Espace commun",
          motion: "panLeft",
          title: "Espaces communs",
          subtitle: "Propreté et lumière naturelle",
        },
        {
          imageSrc: R.corridor(6),
          imageAlt: "Couloir DANDELA House",
          motion: "panRight",
          title: "Accueil & ambiance",
          subtitle: "Un cadre soigné dès votre arrivée",
        },
        {
          imageSrc: R.corridor(10),
          imageAlt: "Circulation intérieure",
          motion: "zoomOut",
          title: "Salle de repos",
          subtitle: "Espace commun à l'étage, boissons disponibles",
        },
      ],
    },
    amenities: {
      id: "amenities",
      slides: [
        {
          imageSrc: R.outside(4),
          imageAlt: "Extérieur et accès",
          motion: "zoomIn",
          title: "Garage sécurisé",
          subtitle: "Deux places pour vos véhicules",
        },
        {
          imageSrc: R.outside(5),
          imageAlt: "Environnement de la maison",
          motion: "panLeft",
          title: "Sérénité",
          subtitle: "Gardes à l'entrée et vidéosurveillance",
        },
        {
          imageSrc: R.corridor(12),
          imageAlt: "Intérieur de la maison",
          motion: "zoomIn",
          title: "Tout le nécessaire",
          subtitle: "Réception sur place, 08h–17h",
        },
      ],
    },
    outro: {
      id: "outro",
      slides: [
        {
          imageSrc: R.outside(7),
          imageAlt: "DANDELA House",
          motion: "zoomIn",
          focusX: 0.5,
          focusY: 0.45,
        },
      ],
    },
  },
};

export const getSceneList = (
  config: PresentationConfig,
): SceneConfig[] => [
  config.scenes.intro,
  config.scenes.rooms,
  config.scenes.commons,
  config.scenes.amenities,
  config.scenes.outro,
];
