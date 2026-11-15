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