/**
 * Chambres accueil — entités `room` + tarif principal `entities_pricings`.
 */

import {
  apiBaseUrl,
  houseEntityUid,
  normalizeLogoBackColor,
  resolveMediaUrl,
  websiteApiKey,
} from "@/lib/api/config";
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
  const url = match?.photo_url?.trim() || "";
  return url ? resolveMediaUrl(url) : "";
}

function firstGalleryPhoto(galleries) {
  const match = (galleries ?? []).find((g) => String(g?.photo_url ?? "").trim());
  const url = match?.photo_url?.trim() || "";
  return url ? resolveMediaUrl(url) : "";
}

/** `floor` en base : entier (0 = rez-de-chaussée) ou `null` si non renseigné. */
function parseFloorValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function filterRoomRows(rows) {
  return rows
    .filter(
      (r) =>
        r?.type === ENTITY_TYPE_ROOM &&
        (r?.kind ?? ROOM_KIND) === ROOM_KIND,
    )
    .sort((a, b) => (a?.number ?? 0) - (b?.number ?? 0));
}

async function loadHousePayload() {
  const base = apiBaseUrl();
  const houseUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !houseUid || !apiKey) {
    return null;
  }

  const url = `${base}/api/houses/${encodeURIComponent(houseUid)}`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * @param {Record<string, unknown>} row — chambre plate API (`GET /api/houses/:uid`)
 */
export function mapApiRoomToHomeCard(row) {
  if (!row) return null;

  const staticRoom = findStaticByName(row.name);
  const galleries = Array.isArray(row.galleries) ? row.galleries : [];

  const coverRaw =
    String(row.card_image ?? "").trim() ||
    galleryPhoto(galleries, "room") ||
    firstGalleryPhoto(galleries) ||
    staticRoom?.cover ||
    "";
  const cover = coverRaw ? resolveMediaUrl(coverRaw) : "";

  const doorRaw = galleryPhoto(galleries, "door") || staticRoom?.door || null;
  const door = doorRaw ? resolveMediaUrl(doorRaw) : null;

  const rawPrice = row.price;
  const price = Math.round(Number(rawPrice) || staticRoom?.price || 0);

  const slug =
    String(row.name_normalized ?? "").trim() ||
    staticRoom?.slug ||
    String(row.uid ?? "").trim();

  const logoRaw = String(row.logo ?? "").trim() || null;
  const logo = logoRaw ? resolveMediaUrl(logoRaw) : null;
  const logoBackColor = normalizeLogoBackColor(row.back_color_logo);

  const description = String(row.description ?? "").trim();
  const shortName = String(row.short_name ?? "").trim();

  return {
    id: String(row.uid ?? slug),
    slug,
    name: String(row.name ?? staticRoom?.name ?? "").trim(),
    shortName,
    description,
    number: Number(row.number) || staticRoom?.number || 0,
    floor: parseFloorValue(row.floor),
    cover,
    door,
    logo,
    logoBackColor,
    gallery: galleries
      .map((g) => resolveMediaUrl(g?.photo_url))
      .filter(Boolean),
    price,
    featureKeys: staticRoom?.featureKeys ?? standardRoomFeatureKeys,
    comingSoon: row.available === false,
    pricingUid: row.pricing_uid ?? null,
  };
}

/**
 * Prix minimum « à partir de » — tarifs `entities_pricings` exposés sur `GET /api/houses/:uid` (`rooms[].price`).
 * @param {{ price?: number, comingSoon?: boolean }[]} rooms
 * @returns {number|null}
 */
export function minHomeRoomPrice(rooms) {
  if (!Array.isArray(rooms) || !rooms.length) return null;

  const prices = rooms
    .filter((room) => room && !room.comingSoon)
    .map((room) => Math.round(Number(room.price)))
    .filter((price) => Number.isFinite(price) && price > 0);

  return prices.length ? Math.min(...prices) : null;
}

/** @returns {Promise<Array<{ id: string, slug: string, name: string, cover: string, door: string|null, price: number, featureKeys: string[], comingSoon?: boolean }>>} */
export async function fetchHomeRooms() {
  const data = await loadHousePayload();
  if (!data) return [];

  const rows = filterRoomRows(Array.isArray(data?.rooms) ? data.rooms : []);

  return rows
    .map(mapApiRoomToHomeCard)
    .filter((room) => room && room.name && room.cover);
}

/**
 * @param {Record<string, unknown>} row — pièce commune plate (`GET /api/room-common`)
 */
export function mapApiCommonToPlace(row) {
  if (!row) return null;

  const galleries = Array.isArray(row.galleries) ? row.galleries : [];
  const coverRaw = String(row.card_image ?? "").trim() || firstGalleryPhoto(galleries) || "";

  return {
    id: String(row.uid ?? ""),
    slug: String(row.name_normalized ?? "").trim() || String(row.uid ?? "").trim(),
    name: String(row.name ?? "").trim(),
    shortName: String(row.short_name ?? "").trim(),
    description: String(row.description ?? "").trim(),
    /** `break-room`, `waiting-room`, `kitchen`, `terrace`, `parking`. */
    kind: String(row.kind ?? "").trim() || "other",
    floor: parseFloorValue(row.floor),
    cover: coverRaw ? resolveMediaUrl(coverRaw) : "",
  };
}

/**
 * Espaces communs de la maison (`entities.type = common-piece` + `rooms_common`), avec leur étage.
 * @returns {Promise<NonNullable<ReturnType<typeof mapApiCommonToPlace>>[]>}
 */
export async function fetchHouseCommonPlaces() {
  const base = apiBaseUrl();
  const houseUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !houseUid || !apiKey) {
    return [];
  }

  try {
    const [res, house] = await Promise.all([
      fetch(`${base}/api/room-common`, {
        headers: { "x-api-key": apiKey },
        next: { revalidate: 120 },
      }),
      loadHousePayload(),
    ]);
    if (!res.ok) return [];

    const data = await res.json();
    const rows = Array.isArray(data?.room_commons) ? data.room_commons : [];

    // `/api/room-common` liste toutes les maisons : on ne garde que les pièces de celle-ci.
    const childUids = new Set(
      (Array.isArray(house?.children) ? house.children : []).map((child) => child?.uid),
    );

    return rows
      .filter(
        (row) =>
          row?.available !== false && (row?.uid_parent === houseUid || childUids.has(row?.uid)),
      )
      .map(mapApiCommonToPlace)
      .filter((place) => place && place.id && place.name);
  } catch {
    return [];
  }
}