/**
 * Galerie accueil — `entities_galleries` de l’entité maison (HOUSE_ENTITY_UID).
 */

import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";
import { galleryImages as staticGalleryImages } from "@/lib/rooms";

/** @type {Record<string, string>} type SQL → clé i18n `home.gallery.labels.*` */
const GALLERY_TYPE_LABEL_KEY = {
  door: "door",
  room: "room",
  bathroom: "corridor",
  kitchen: "corridor",
  balcony: "outside",
  bed: "room",
  dining: "corridor",
  tv: "room",
  climatisation: "room",
  "break-room": "corridor",
  wardrobe: "room",
  fridge: "room",
  couch: "corridor",
  wc: "corridor",
  "waiting-room": "corridor",
  sit: "corridor",
  stairs: "corridor",
  other: "outside",
};

function labelKeyForType(type) {
  return GALLERY_TYPE_LABEL_KEY[String(type ?? "").trim()] ?? "outside";
}

function spanForIndex(index) {
  if (index === 0) return "wide";
  if (index % 7 === 4) return "tall";
  return "square";
}

/**
 * @param {Record<string, unknown>} row
 * @param {number} index
 */
export function mapGalleryRowToImage(row, index) {
  const src = String(row?.photo_url ?? "").trim();
  if (!src) return null;
  if (String(row?.media ?? "image") !== "image") return null;

  const key = labelKeyForType(row?.type);

  return {
    id: String(row?.uid ?? `${src}-${index}`),
    src,
    key,
    room: null,
    span: spanForIndex(index),
    galleryType: row?.type ?? "other",
    displayOrder: row?.display_order ?? index,
  };
}

/** @returns {Promise<Array<{ id: string, src: string, key: string, room: string|null, span: string }>>} */
export async function fetchHouseGalleryImages() {
  const base = apiBaseUrl();
  const entityUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !entityUid || !apiKey) {
    return [];
  }

  const url = `${base}/api/entities/${encodeURIComponent(entityUid)}/galleries`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const rows = Array.isArray(data?.galleries) ? data.galleries : [];

    return [...rows]
      .sort((a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0))
      .map((row, index) => mapGalleryRowToImage(row, index))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function resolveGalleryImages(apiImages) {
  return apiImages?.length ? apiImages : staticGalleryImages;
}