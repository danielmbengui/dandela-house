/**
 * Bandeau marquee — textes depuis `entities_banners` (API).
 * Variables serveur : API_BASE_URL, API_KEY_WEBSITE, HOUSE_ENTITY_UID
 */

function apiBaseUrl() {
  return (
    process.env.API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    ""
  ).replace(/\/$/, "");
}

export function houseEntityUid() {
  return (
    process.env.HOUSE_ENTITY_UID?.trim() ||
    process.env.NEXT_PUBLIC_HOUSE_ENTITY_UID?.trim() ||
    ""
  );
}

/**
 * @param {string} locale fr | en | pt
 * @returns {Promise<string[]>} libellés pour le marquee
 */
export async function fetchMarqueeBannerTexts(locale = "fr") {
  const base = apiBaseUrl();
  const entityUid = houseEntityUid();
  const apiKey = process.env.API_KEY_WEBSITE?.trim();

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
    return rows
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