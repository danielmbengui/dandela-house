/**
 * Bandeau marquee — textes depuis `entities_banners` (API).
 */

import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";

export { houseEntityUid } from "@/lib/api/config";

const RECEPTION_PREFIX = /^(réception|reception|recepção)\s*/i;

/** @param {Record<string, unknown>} row */
export function bannerTextForLocale(row, locale = "fr") {
  if (!row) return "";
  if (row.text) return String(row.text).trim();
  const lang = String(locale ?? "fr").slice(0, 2);
  const key = `text_${lang}`;
  return String(row[key] ?? row.text_fr ?? "").trim();
}

/**
 * Plage horaire affichée (ex. « 09h–17h ») issue du bandeau réception (`entities_banners`).
 * @param {Record<string, unknown>[]} banners
 * @param {string} [locale]
 * @returns {string|null}
 */
export function receptionHoursFromBanners(banners, locale = "fr") {
  if (!Array.isArray(banners) || !banners.length) return null;

  const sorted = [...banners].sort((a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0));
  for (const row of sorted) {
    const text = bannerTextForLocale(row, locale);
    if (!/réception|reception|recepção/i.test(text)) continue;
    const hours = text.replace(RECEPTION_PREFIX, "").trim();
    if (hours) return hours;
  }
  return null;
}

/**
 * @param {string} locale fr | en | pt
 * @returns {Promise<Record<string, unknown>[]>}
 */
export async function fetchEntityBanners(locale = "fr") {
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
    return [...rows].sort((a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0));
  } catch {
    return [];
  }
}

/**
 * @param {string} locale fr | en | pt
 * @returns {Promise<string[]>} libellés pour le marquee
 */
export async function fetchMarqueeBannerTexts(locale = "fr") {
  const rows = await fetchEntityBanners(locale);
  return rows.map((row) => bannerTextForLocale(row, locale)).filter(Boolean);
}