/**
 * Horaires vitrine — `entities_opening_hours` (rôle réception).
 */

import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";

/** @returns {Promise<string|null>} ex. « 09h–17h » */
export async function fetchReceptionHoursLabel(locale = "fr") {
  const base = apiBaseUrl();
  const entityUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !entityUid || !apiKey) {
    return null;
  }

  const lang = String(locale ?? "fr").slice(0, 2);
  const params = new URLSearchParams({
    uid_entity: entityUid,
    role: "reception",
    lang,
    available: "1",
  });
  const url = `${base}/api/entities-opening-hours?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const primary = data?.primary;
    const text = String(primary?.text ?? "").trim();
    return text || null;
  } catch {
    return null;
  }
}