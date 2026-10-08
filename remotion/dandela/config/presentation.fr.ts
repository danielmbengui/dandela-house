import type { KenBurnsMotion } from "../components/AnimatedImage";

export type SlideConfig = {
  /** Chemin relatif à public/ (sans slash initial). */
  imageSrc: string;
  imageAlt: string;
  motion?: KenBurnsMotion;
  /** Focal point 0–1 pour recadrage format paysage / carré. */
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
  /** true = fichier silencieux ou temporaire — remplacer par la piste finale. */
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

const kubango = "images/rooms/K. Kubango";
const maquela = "images/rooms/Maquela";
const malange = "images/rooms/Malange";

/**
 * Configuration centralisée — modifier textes et médias ici sans toucher aux composants.
 */
export const presentationFr: PresentationConfig = {
  locale: "fr",
  brandName: "DANDELA House",
  locationLine: "Guest house · Sapu, Saurimo · Angola",
  ctaTitle: "Réservez votre séjour",
  ctaSubtitle: "Cinq chambres, réception et sérénité au cœur de Sapu.",
  ctaHint: "contact@dandela-house.ao",
  logoMark: "images/logo-mark-dark.png",
  logoFull: "images/logo-full-dark.png",
  music: {
    src: "remotion/audio/dandela-lounge.mp3",
    isPlaceholder: false,
    note:
      "Thinking About You — Arulo (Mixkit Free License). Voir public/remotion/audio/LICENSE.md.",
    volume: 0.72,
    fadeInSeconds: 1.2,
    fadeOutSeconds: 2.5,
  },
  scenes: {
    intro: {
      id: "intro",
      slides: [
        {
          imageSrc: "images/main-header.jpg",
          imageAlt: "Façade et environnement de DANDELA House",
          motion: "zoomIn",
          focusX: 0.5,
          focusY: 0.35,
          kicker: "Sapu · Saurimo",
          title: "DANDELA House",
          subtitle: "Votre refuge en Angola",
        },
        {
          imageSrc: "images/terrace.jpg",
          imageAlt: "Terrasse de DANDELA House",
          motion: "panRight",
          focusX: 0.55,
          focusY: 0.4,
          title: "Bienvenue",
          subtitle: "Confort, intimité et accueil chaleureux",
        },
      ],
    },
    rooms: {
      id: "rooms",
      slides: [
        {
          imageSrc: `${kubango}/1.jpg`,
          imageAlt: "Chambre K. Kubango",
          motion: "zoomIn",
          kicker: "Chambre",
          title: "K. Kubango",
          subtitle: "Kitchenette, TV et salle de bain privée",
        },
        {
          imageSrc: `${maquela}/1.jpg`,
          imageAlt: "Chambre Maquela",
          motion: "panLeft",
          kicker: "Chambre",
          title: "Maquela",
          subtitle: "Espace calme à l'étage",
        },
        {
          imageSrc: `${malange}/1.png`,
          imageAlt: "Chambre Malange",
          motion: "zoomOut",
          kicker: "Chambre",
          title: "Malange",
          subtitle: "Confort pour un séjour prolongé",
        },
        {
          imageSrc: "images/guest-room.jpg",
          imageAlt: "Chambre invité",
          motion: "panRight",
          title: "Cinq chambres privées",
          subtitle: "Lit confortable, frigo et ménage 3× par semaine",
        },
      ],
    },
    commons: {
      id: "commons",
      slides: [
        {
          imageSrc: "images/reception.jpg",
          imageAlt: "Réception DANDELA House",
          motion: "zoomIn",
          title: "Réception",
          subtitle: "Accueil sur place de 08h à 17h",
        },
        {
          imageSrc: "images/lobby.jpg",
          imageAlt: "Espace d'accueil",
          motion: "panLeft",
          title: "Accueil & ambiance",
          subtitle: "Un cadre soigné dès votre arrivée",
        },
        {
          imageSrc: "images/lounge.jpg",
          imageAlt: "Salle de repos",
          motion: "zoomOut",
          title: "Salle de repos",
          subtitle: "Espace commun à l'étage",
        },
        {
          imageSrc: "images/terrace.jpg",
          imageAlt: "Terrasse avec tapis de course",
          motion: "panRight",
          title: "Terrasse",
          subtitle: "Tapis de course et moment de détente",
        },
      ],
    },
    amenities: {
      id: "amenities",
      slides: [
        {
          imageSrc: "images/dandela-house-parking.png",
          imageAlt: "Garage et stationnement",
          motion: "zoomIn",
          title: "Garage sécurisé",
          subtitle: "Deux places pour vos véhicules",
        },
        {
          imageSrc: "images/reception.jpg",
          imageAlt: "Accueil sécurisé",
          motion: "panLeft",
          title: "Sérénité",
          subtitle: "Gardes à l'entrée et caméras de vidéosurveillance",
        },
        {
          imageSrc: "images/bedroom.jpg",
          imageAlt: "Détail chambre",
          motion: "zoomIn",
          title: "Tout le nécessaire",
          subtitle: "Kitchenette, douche et WC dans chaque chambre",
        },
      ],
    },
    outro: {
      id: "outro",
      slides: [
        {
          imageSrc: "images/main-header.jpg",
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
