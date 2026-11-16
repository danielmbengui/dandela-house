import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "fr", "en"],
  defaultLocale: "pt",
  localeDetection: false,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/legal/terms": {
      fr: "/conditions-utilisation",
      en: "/terms-of-use",
      pt: "/termos-de-utilizacao",
    },
    "/legal/privacy": {
      fr: "/politique-confidentialite",
      en: "/privacy-policy",
      pt: "/politica-de-privacidade",
    },
  },
});

export const localeFlags = {
  pt: "/images/flags/flag-ao.png",
  fr: "/images/flags/flag-fr.png",
  en: "/images/flags/flag-gb.png",
};
