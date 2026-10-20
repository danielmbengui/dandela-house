/** Préférences utilisateur (langue / thème) — mémorisées seulement si consentement accepté. */

export const CONSENT_COOKIE = "dndela-consent";
export const THEME_STORAGE_KEY = "dndela-theme-mode";
export const DEFAULT_THEME_MODE = "light";

export const CONSENT = {
  accepted: "accepted",
  rejected: "rejected",
};

const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export function parseConsentCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]+)`));
  const value = match?.[1];
  if (value === CONSENT.accepted || value === CONSENT.rejected) return value;
  return null;
}

export function canPersistPreferences(consent) {
  return consent === CONSENT.accepted;
}

/** Client : lire le consentement depuis document.cookie */
export function readConsentClient() {
  if (typeof document === "undefined") return null;
  return parseConsentCookie(document.cookie);
}

export function writeConsentClient(value) {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
}

export function clearLocaleCookieClient() {
  if (typeof document === "undefined") return;
  document.cookie = "NEXT_LOCALE=; path=/; max-age=0; SameSite=Lax";
}

export function clearStoredThemeClient() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function readStoredThemeClient() {
  if (typeof window === "undefined") return DEFAULT_THEME_MODE;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME_MODE;
}
