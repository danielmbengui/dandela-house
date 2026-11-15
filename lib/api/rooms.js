/**
 * Chambres accueil — entités `room` + tarif principal `entities_pricings`.
 */

import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";
import { homeRooms as staticHomeRooms, standardRoomFeatureKeys } from "@/lib/rooms";

const ENTITY_TYPE_ROOM = "room";
const ROOM_KIND = "room";

function normalizeName(value = "") {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function findStaticByName(name) {
  const key = normalizeName(name);
  return staticHomeRooms.find((room) => normalizeName(room.name) === key);
}

function galleryPhoto(galleries, type) {
  const match = (galleries ?? []).find(
    (g) => g?.type === type && String(g?.photo_url ?? "").trim(),
  );
  return match?.photo_url?.trim() || "";
}

function firstGalleryPhoto(galleries) {
  const match = (galleries ?? []).find((g) => String(g?.photo_url ?? "").trim());
  return match?.photo_url?.trim() || "";
}

/**
 * @param {Record<string, unknown>} row — chambre plate API (`GET /api/houses/:uid`)
 */
export function mapApiRoomToHomeCard(row) {
  if (!row) return null;

  const staticRoom = findStaticByName(row.name);
  const galleries = Array.isArray(row.galleries) ? row.galleries : [];

  const cover =
    String(row.card_image ?? "").trim() ||
    galleryPhoto(galleries, "room") ||
    firstGalleryPhoto(galleries) ||
    staticRoom?.cover ||
    "";

  const door = galleryPhoto(galleries, "door") || staticRoom?.door || null;

  const rawPrice = row.price;
  const price = Math.round(Number(rawPrice) || staticRoom?.price || 0);

  const slug =
    String(row.name_normalized ?? "").trim() ||
    staticRoom?.slug ||
    String(row.uid ?? "").trim();

  return {
    id: String(row.uid ?? slug),
    slug,
    name: String(row.name ?? staticRoom?.name ?? "").trim(),
    cover,
    door,
    gallery: galleries.map((g) => g?.photo_url).filter(Boolean),
    price,
    featureKeys: staticRoom?.featureKeys ?? standardRoomFeatureKeys,
    comingSoon: row.available === false,
    pricingUid: row.pricing_uid ?? null,
  };
}

/** @returns {Promise<Array<{ id: string, slug: string, name: string, cover: string, door: string|null, price: number, featureKeys: string[], comingSoon?: boolean }>>} */
export async function fetchHomeRooms() {
  const base = apiBaseUrl();
  const houseUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !houseUid || !apiKey) {
    return [];
  }

  const url = `${base}/api/houses/${encodeURIComponent(houseUid)}`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const rows = Array.isArray(data?.rooms) ? data.rooms : [];

    return rows
      .filter(
        (r) =>
          r?.type === ENTITY_TYPE_ROOM &&
          (r?.kind ?? ROOM_KIND) === ROOM_KIND,
      )
      .sort((a, b) => (a?.number ?? 0) - (b?.number ?? 0))
      .map(mapApiRoomToHomeCard)
      .filter((room) => room && room.name && room.cover);
  } catch {
    return [];
  }
}