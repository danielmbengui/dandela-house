import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "fr", "en"],
  defaultLocale: "pt",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/chambres-tarifs": {
      pt: "/chambres-tarifs",
      fr: "/chambres-tarifs",
      en: "/rooms-rates",
    },
  },
});

export const localeFlags = {
  pt: "/images/flags/flag-ao.png",
  fr: "/images/flags/flag-fr.png",
  en: "/images/flags/flag-gb.png",
};
