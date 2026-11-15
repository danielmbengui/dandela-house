/** Config HTTP catalogue (site vitrine). */

export function apiBaseUrl() {
  return (
    process.env.API_ADDRESS?.trim() ||
    process.env.NEXT_PUBLIC_API_ADDRESS?.trim() ||
    process.env.API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    ""
  ).replace(/\/$/, "");
}

export function websiteApiKey() {
  return (
    process.env.API_KEY_WEBSITE?.trim() ||
    process.env.NEXT_PUBLIC_API_KEY_WEBSITE?.trim() ||
    ""
  );
}

export function houseEntityUid() {
  return (
    process.env.HOUSE_ENTITY_UID?.trim() ||
    process.env.NEXT_PUBLIC_HOUSE_ENTITY_UID?.trim() ||
    ""
  );
}

/** URL absolue pour médias catalogue (R2, chemins relatifs API). */
export function resolveMediaUrl(url) {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;

  const base = (
    process.env.NEXT_PUBLIC_MEDIAS_ADDRESS?.trim() ||
    process.env.MEDIAS_ADDRESS?.trim() ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL?.trim() ||
    process.env.R2_PUBLIC_BASE_URL?.trim() ||
    ""
  ).replace(/\/$/, "");

  if (!base) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }

  return `${base}/${raw.replace(/^\/+/, "")}`;
}

export function normalizeLogoBackColor(value) {
  const color = String(value ?? "").trim();
  if (!color) return null;
  if (color.startsWith("#") || color.startsWith("rgb")) return color;
  if (/^[0-9a-f]{3,8}$/i.test(color)) return `#${color}`;
  return color;
}