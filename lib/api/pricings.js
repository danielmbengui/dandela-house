/**
 * Tarifs vitrine — `entities_pricings` via catalogue API.
 */

import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";

/** @returns {Promise<{ min_price: number, symbol: string|null, currency_code: string|null }|null>} */
export async function fetchHouseMinRoomPrice() {
  const base = apiBaseUrl();
  const houseUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !houseUid || !apiKey) {
    return null;
  }

  const url = `${base}/api/entities-pricings?uid_house=${encodeURIComponent(houseUid)}&min_room_price=1`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const summary = data?.summary;
    const minPrice = Math.round(Number(summary?.min_price));
    if (!Number.isFinite(minPrice) || minPrice <= 0) return null;

    return {
      min_price: minPrice,
      symbol: summary?.symbol ?? null,
      currency_code: summary?.currency_code ?? null,
    };
  } catch {
    return null;
  }
}