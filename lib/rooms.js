const dir = (name) => `/images/rooms/${encodeURIComponent(name)}`;

export const ROOM_COUNT = 5;

/** Équipement identique dans chaque chambre. */
export const standardRoomFeatureKeys = [
  "kitchenette",
  "fridge",
  "bathroom",
  "bed",
  "tv",
  "ac",
  "balcony",
];

/**
 * Chambres. `cover` = photo de présentation, `gallery` = autres vues, `door` = plaque de la porte.
 * Les prix sont indicatifs (données provisoires).
 */
export const rooms = [
  {
    id: "chambre-1",
    slug: "k-kubango",
    name: "K. Kubango",
    cover: `${dir("K. Kubango")}/1.jpg`,
    door: `${dir("K. Kubango")}/door.png`,
    gallery: [
      `${dir("K. Kubango")}/2.jpg`,
      `${dir("K. Kubango")}/3.jpg`,
      `${dir("K. Kubango")}/4.jpg`,
      `${dir("K. Kubango")}/5.jpg`,
    ],
    price: 25000,
    featureKeys: standardRoomFeatureKeys,
    listedOnHome: true,
  },
  {
    id: "chambre-2",
    slug: "malange",
    name: "Malange",
    cover: `${dir("Malange")}/1.png`,
    door: `${dir("Malange")}/door.png`,
    gallery: [`${dir("Malange")}/2.png`, `${dir("Malange")}/3.png`],
    price: 25000,
    featureKeys: standardRoomFeatureKeys,
    listedOnHome: true,
  },
  {
    id: "chambre-3",
    slug: "maquela",
    name: "Maquela",
    cover: `${dir("Maquela")}/1.jpg`,
    // NB : public/images/rooms/Maquela/door.jpg montre la plaque « MALANGE » — à remplacer par la bonne photo.
    door: null,
    gallery: [`${dir("Maquela")}/2.jpg`, `${dir("Maquela")}/3.jpg`],
    price: 28000,
    featureKeys: standardRoomFeatureKeys,
    listedOnHome: true,
  },
  {
    id: "chambre-4",
    slug: "bie",
    name: "Bié",
    cover: `${dir("Bie")}/1.jpeg`,
    door: `${dir("Bie")}/door.jpeg`,
    gallery: [`${dir("Bie")}/2.jpeg`, `${dir("Bie")}/3.jpeg`],
    price: 25000,
    featureKeys: standardRoomFeatureKeys,
    listedOnHome: true,
  },
  {
    id: "chambre-5",
    slug: "huambo",
    name: "Huambo",
    cover: `${dir("Huambo")}/1.jpeg`,
    door: `${dir("Huambo")}/door.jpeg`,
    gallery: [
      `${dir("Huambo")}/2.jpeg`,
      `${dir("Huambo")}/3.jpeg`,
      `${dir("Huambo")}/4.jpeg`,
    ],
    price: 25000,
    featureKeys: standardRoomFeatureKeys,
    listedOnHome: true,
  },
];

export const homeRooms = rooms.filter((room) => room.listedOnHome);

export const publishedRooms = rooms.filter((room) => !room.comingSoon);

export const startingPrice = Math.min(...publishedRooms.map((r) => r.price));

/** Sous-ensemble des photos `public/images/outside/` pour la galerie accueil. */
const outsideGalleryImages = [1, 2, 4, 6, 7].map((n, i) => ({
  src: `/images/outside/${n}.jpeg`,
  key: "outside",
  span: i === 1 ? "wide" : i === 4 ? "tall" : "square",
}));

/** Sous-ensemble des photos `public/images/corridors/` pour la galerie accueil. */
const corridorGalleryImages = [1, 3, 5, 7, 9, 11].map((n, i) => ({
  src: `/images/corridors/${n}.jpeg`,
  key: "corridor",
  span: i === 0 ? "wide" : i === 3 ? "tall" : "square",
}));

/** Photos pour la galerie : façade, cour, chambres et plaques. */
export const galleryImages = [
  { src: "/images/main-header.jpg", key: "facade", span: "wide" },
  { src: "/images/dandela-house-parking.png", key: "courtyard", span: "tall" },
  ...outsideGalleryImages,
  ...corridorGalleryImages,
  ...publishedRooms.flatMap((room) => [
    { src: room.cover, key: "room", room: room.name, span: "square" },
    ...(room.door
      ? [{ src: room.door, key: "door", room: room.name, span: "square" }]
      : []),
  ]),
  ...publishedRooms.map((room) => ({
    src: room.gallery[0],
    key: "room",
    room: room.name,
    span: "square",
  })),
];

export const roomPlaceholders = rooms;

export const roomFeatureKeys = [
  ...standardRoomFeatureKeys,
  "housekeeping",
];
