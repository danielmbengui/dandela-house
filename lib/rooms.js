const dir = (name) => `/images/rooms/${encodeURIComponent(name)}`;

export const ROOM_COUNT = 5;

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
    featureKeys: ["bed", "kitchenette", "ac", "bathroom"],
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
    featureKeys: ["bed", "ac", "tv", "bathroom"],
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
    featureKeys: ["bed", "kitchenette", "ac", "fridge"],
    listedOnHome: true,
  },
  {
    id: "chambre-4",
    slug: "chambre-4",
    name: null,
    cover: `${dir("K. Kubango")}/3.jpg`,
    door: null,
    gallery: [],
    price: 25000,
    featureKeys: ["bed", "kitchenette", "ac", "bathroom"],
    listedOnHome: true,
    comingSoon: true,
  },
  {
    id: "chambre-5",
    slug: "chambre-5",
    name: null,
    cover: `${dir("Malange")}/2.png`,
    door: null,
    gallery: [],
    price: 25000,
    featureKeys: ["bed", "kitchenette", "ac", "bathroom"],
    listedOnHome: true,
    comingSoon: true,
  },
];

export const homeRooms = rooms.filter((room) => room.listedOnHome);

export const publishedRooms = rooms.filter((room) => !room.comingSoon);

export const startingPrice = Math.min(...publishedRooms.map((r) => r.price));

/** Photos pour la galerie : façade, cour, chambres et plaques. */
export const galleryImages = [
  { src: "/images/main-header.jpg", key: "facade", span: "wide" },
  { src: "/images/dandela-house-parking.png", key: "courtyard", span: "tall" },
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
  "kitchenette",
  "fridge",
  "bed",
  "tv",
  "bathroom",
  "housekeeping",
];
