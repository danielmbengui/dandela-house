/**
 * Bandeau marquee — textes depuis `entities_banners` (API).
 */

import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";

export { houseEntityUid } from "@/lib/api/config";

/**
 * @param {string} locale fr | en | pt
 * @returns {Promise<string[]>} libellés pour le marquee
 */
export async function fetchMarqueeBannerTexts(locale = "fr") {
  const base = apiBaseUrl();
  const entityUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !entityUid || !apiKey) {
    return [];
  }

  const lang = String(locale ?? "fr").slice(0, 2);
  const url = `${base}/api/entities/${encodeURIComponent(entityUid)}/banners?lang=${encodeURIComponent(lang)}&available=1`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const rows = Array.isArray(data?.banners) ? data.banners : [];
    return [...rows]
      .sort((a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0))
      .map((row) => {
        if (row?.text) return String(row.text).trim();
        const key = `text_${lang}`;
        return String(row[key] ?? row.text_fr ?? "").trim();
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}