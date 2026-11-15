import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";

/**
 * @returns {Promise<{ uid_house: string, floors: object[], floors_count: number } | null>}
 */
export async function fetchHouseFloorPlan(houseUid = houseEntityUid()) {
  const base = apiBaseUrl();
  const uid = String(houseUid ?? "").trim();
  const apiKey = websiteApiKey();

  if (!base || !uid || !apiKey) {
    return null;
  }

  const url = `${base}/api/houses/${encodeURIComponent(uid)}/floor-plan`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}