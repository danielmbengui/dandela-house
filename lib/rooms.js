const kubango = "/images/rooms/K.%20Kubango";

export const ROOM_COUNT = 5;

/** Chambres publiées. `cover` = présentation, `gallery` = les autres vues. */
export const rooms = [
  {
    id: "chambre-1",
    name: "K. Kubango",
    cover: `${kubango}/1.jpg`,
    gallery: [
      `${kubango}/2.jpg`,
      `${kubango}/3.jpg`,
      `${kubango}/4.jpg`,
      `${kubango}/5.jpg`,
      `${kubango}/door.png`,
    ],
    pricePlaceholder: "—",
    listedOnHome: true,
  },
  {
    id: "chambre-2",
    image: "/images/bedroom.jpg",
    pricePlaceholder: "—",
  },
  {
    id: "chambre-3",
    image: "/images/room.jpg",
    pricePlaceholder: "—",
  },
  {
    id: "chambre-4",
    image: "/images/guest-room.jpg",
    pricePlaceholder: "—",
  },
  {
    id: "chambre-5",
    image: "/images/bedroom.jpg",
    pricePlaceholder: "—",
  },
];

export const homeRooms = rooms.filter((room) => room.listedOnHome);

export const galleryImages = rooms.flatMap((room) =>
  (room.gallery ?? []).map((src) => ({ src, alt: room.name })),
);

export const roomPlaceholders = rooms;

export const roomFeatureKeys = [
  "kitchenette",
  "fridge",
  "bed",
  "tv",
  "bathroom",
  "housekeeping",
];
