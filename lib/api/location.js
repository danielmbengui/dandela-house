/**
 * Adresse & contacts maison — `entities_addresses`, `entities_contacts`.
 */

import { apiBaseUrl, houseEntityUid, websiteApiKey } from "@/lib/api/config";
import { SITE } from "@/lib/site";

const CONTACT = {
  EMAIL: "email",
  MAPS: "google-maps",
  MAPS_EMBED: "google-maps-embed",
  WHATSAPP: "whatsapp-phone-number",
  PHONE: "phone",
};

async function fetchEntityCollection(segment) {
  const base = apiBaseUrl();
  const entityUid = houseEntityUid();
  const apiKey = websiteApiKey();

  if (!base || !entityUid || !apiKey) {
    return [];
  }

  const url = `${base}/api/entities/${encodeURIComponent(entityUid)}/${segment}`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data?.[segment]) ? data[segment] : [];
  } catch {
    return [];
  }
}

function pickPrimaryAddress(addresses) {
  if (!addresses.length) return null;
  const house = addresses.find((a) => a?.type === "house");
  return house ?? addresses[0];
}

function formatAddressLine(address) {
  if (!address) return SITE.address;
  const parts = [
    address.street,
    address.street_1,
    address.district,
    address.short_street,
    address.zip_code,
    address.city_name,
    address.province_name,
  ]
    .map((p) => String(p ?? "").trim())
    .filter(Boolean);
  return parts.length ? parts.join(", ") : SITE.address;
}

function contactByType(contacts, type) {
  return (
    contacts
      .filter((c) => c?.available !== false && c?.type === type)
      .sort(
        (a, b) =>
          Number(Boolean(b?.is_primary)) - Number(Boolean(a?.is_primary)) ||
          (a?.display_order ?? 0) - (b?.display_order ?? 0),
      )[0] ?? null
  );
}

function normalizeE164(value = "") {
  return String(value).replace(/\D/g, "");
}

function formatPhoneDisplay(value = "", label = "") {
  const trimmedLabel = String(label ?? "").trim();
  if (trimmedLabel) return trimmedLabel;
  const digits = normalizeE164(value);
  if (!digits) return "";
  return digits.startsWith("+") ? digits : `+${digits}`;
}

function phonesFromContacts(contacts) {
  const rows = contacts.filter(
    (c) =>
      c?.available !== false &&
      (c?.type === CONTACT.WHATSAPP || c?.type === CONTACT.PHONE),
  );

  const mapped = rows
    .sort(
      (a, b) =>
        Number(Boolean(b?.is_primary)) - Number(Boolean(a?.is_primary)) ||
        (a?.display_order ?? 0) - (b?.display_order ?? 0),
    )
    .map((c) => {
      const e164 = normalizeE164(c.value);
      const display = formatPhoneDisplay(c.value, c.label);
      return e164 ? { e164, display: display || `+${e164}` } : null;
    })
    .filter(Boolean);

  const unique = [];
  const seenE164 = new Set();
  for (const phone of mapped) {
    if (seenE164.has(phone.e164)) continue;
    seenE164.add(phone.e164);
    unique.push(phone);
  }

  return unique.length ? unique : SITE.phones;
}

function emailFromContacts(contacts) {
  const row = contactByType(contacts, CONTACT.EMAIL);
  const value = String(row?.value ?? "").trim();
  return value || SITE.email;
}

const CONTACT_TYPES_EXCLUDED_FROM_SOCIAL = new Set([
  "email",
  "phone",
  "google-maps",
  "google-maps-embed",
  "whatsapp-display-name",
  "telegram-phone-number",
  "telegram-display-name",
]);

const SOCIAL_TYPE_LABELS = {
  "whatsapp-phone-number": "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  website: "Site web",
  "telegram-url": "Telegram",
};

function labelForSocialContact(contact) {
  const fromLabel = String(contact?.label ?? "").trim();
  if (fromLabel) return fromLabel;
  const type = String(contact?.type ?? "");
  if (SOCIAL_TYPE_LABELS[type]) return SOCIAL_TYPE_LABELS[type];
  return type
    .split("-")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function hrefForSocialContact(contact) {
  const value = String(contact?.value ?? "").trim();
  if (!value) return "";
  if (contact.type === CONTACT.WHATSAPP) {
    const e164 = normalizeE164(value);
    return e164 ? `https://wa.me/${e164}` : value;
  }
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value)) return value;
  return `https://${value.replace(/^\/\//, "")}`;
}

/** Liens « Suivez-nous » — uniquement les contacts présents en base (pas de repli SITE). */
function socialLinksFromContacts(contacts) {
  const rows = contacts
    .filter(
      (c) =>
        c?.available !== false &&
        c?.type &&
        !CONTACT_TYPES_EXCLUDED_FROM_SOCIAL.has(c.type) &&
        String(c?.value ?? "").trim(),
    )
    .sort(
      (a, b) =>
        Number(Boolean(b?.is_primary)) - Number(Boolean(a?.is_primary)) ||
        (a?.display_order ?? 0) - (b?.display_order ?? 0),
    );

  const seenTypes = new Set();
  const links = [];
  for (const c of rows) {
    if (seenTypes.has(c.type)) continue;
    seenTypes.add(c.type);
    const href = hrefForSocialContact(c);
    if (!href) continue;
    links.push({
      id: String(c.link_uid ?? c.uid ?? `${c.type}-${href}`),
      type: c.type,
      label: labelForSocialContact(c),
      href,
    });
  }
  return links;
}

function mapsHrefFrom(contacts, address) {
  const row = contactByType(contacts, CONTACT.MAPS);
  if (row?.value) return String(row.value).trim();

  const placeId = String(address?.google_place_id ?? "").trim();
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`;
  }

  const lat = address?.latitude;
  const lng = address?.longitude;
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  return SITE.mapsHref;
}

function mapsEmbedFrom(contacts, address, locale = "fr") {
  const row = contactByType(contacts, CONTACT.MAPS_EMBED);
  if (row?.value) return String(row.value).trim();

  const lat = address?.latitude;
  const lng = address?.longitude;
  if (lat != null && lng != null) {
    const hl = String(locale ?? "fr").slice(0, 2);
    return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=17&hl=${encodeURIComponent(hl)}&output=embed`;
  }

  return SITE.mapsEmbedSrc;
}

/**
 * @param {unknown} neighborhoods
 * @returns {{ key: string, label: string, value: string }[]|null}
 */
export function parseNeighborhoodPoints(neighborhoods) {
  if (!neighborhoods) return null;

  if (Array.isArray(neighborhoods)) {
    const points = neighborhoods
      .map((item, index) => {
        if (!item || typeof item !== "object") return null;
        const key = String(item.key ?? item.id ?? `point-${index}`);
        const label = String(item.label ?? item.name ?? "").trim();
        const value = String(item.value ?? item.duration ?? item.time ?? "").trim();
        return label && value ? { key, label, value } : null;
      })
      .filter(Boolean);
    return points.length ? points : null;
  }

  if (typeof neighborhoods === "object") {
    const points = Object.entries(neighborhoods)
      .map(([key, val]) => {
        if (val && typeof val === "object") {
          const label = String(val.label ?? val.name ?? key).trim();
          const value = String(val.value ?? val.duration ?? val.time ?? "").trim();
          return label && value ? { key, label, value } : null;
        }
        const value = String(val ?? "").trim();
        return value ? { key, label: key, value } : null;
      })
      .filter(Boolean);
    return points.length ? points : null;
  }

  return null;
}

/** @returns {Promise<{ placeName: string, addressLine: string, mapsHref: string, mapsEmbedSrc: string, phones: typeof SITE.phones, email: string, socialLinks: ReturnType<typeof socialLinksFromContacts>, points: ReturnType<typeof parseNeighborhoodPoints>, compassLabel: string }|null>} */
export async function fetchEntityLocation(locale = "fr") {
  const [addresses, contacts] = await Promise.all([
    fetchEntityCollection("addresses"),
    fetchEntityCollection("contacts"),
  ]);

  if (!addresses.length && !contacts.length) {
    return null;
  }

  const address = pickPrimaryAddress(addresses);
  const placeName = SITE.mapsPlaceName;

  return {
    placeName,
    addressLine: formatAddressLine(address),
    mapsHref: mapsHrefFrom(contacts, address),
    mapsEmbedSrc: mapsEmbedFrom(contacts, address, locale),
    phones: phonesFromContacts(contacts),
    email: emailFromContacts(contacts),
    socialLinks: socialLinksFromContacts(contacts),
    points: parseNeighborhoodPoints(address?.neighborhoods),
    compassLabel: String(address?.district ?? address?.city_name ?? "Sapù").trim() || "Sapù",
  };
}