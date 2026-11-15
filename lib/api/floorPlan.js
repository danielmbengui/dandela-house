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
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        message = body?.error || body?.message || message;
      } catch {
        /* ignore */
      }
      return { floors: [], floors_count: 0, error: message, status: res.status };
    }
    return await res.json();
  } catch (err) {
    return {
      floors: [],
      floors_count: 0,
      error: err instanceof Error ? err.message : "fetch_failed",
    };
  }
}