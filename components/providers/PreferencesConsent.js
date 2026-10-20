"use client";

import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  CONSENT,
  clearLocaleCookieClient,
  clearStoredThemeClient,
  readConsentClient,
  writeConsentClient,
} from "@/lib/preferences";
import { useThemeMode } from "./ThemeModeProvider";

export default function PreferencesConsent() {
  const t = useTranslations("consent");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { setMode, setPreferencesPersistence } = useThemeMode();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = readConsentClient();
    if (consent === CONSENT.accepted) {
      setPreferencesPersistence(true);
      return;
    }
    if (consent === CONSENT.rejected) {
      setPreferencesPersistence(false);
      clearStoredThemeClient();
      clearLocaleCookieClient();
      setMode("light");
      if (locale !== routing.defaultLocale) {
        router.replace(pathname, { locale: routing.defaultLocale });
      }
      return;
    }
    setVisible(true);
  }, [setMode, setPreferencesPersistence]);

  const accept = () => {
    writeConsentClient(CONSENT.accepted);
    setPreferencesPersistence(true);
    setVisible(false);
  };

  const reject = () => {
    writeConsentClient(CONSENT.rejected);
    setPreferencesPersistence(false);
    clearStoredThemeClient();
    clearLocaleCookieClient();
    setMode("light");
    setVisible(false);
    router.replace(pathname, { locale: routing.defaultLocale });
  };

  if (!visible) return null;

  return (
    <Box
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
      sx={{
        position: "fixed",
        right: { xs: 12, sm: 16, md: 20 },
        bottom: { xs: 12, sm: 16, md: 20 },
        left: "auto",
        zIndex: (theme) => theme.zIndex.modal + 2,
        width: { xs: "min(340px, calc(100vw - 24px))", sm: 320 },
        borderRadius: "14px",
        border: "1px solid var(--border)",
        bgcolor: "color-mix(in srgb, var(--card-color) 92%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "var(--font-color)",
        boxShadow: "0 12px 40px -20px rgba(0,0,0,0.35)",
        p: { xs: 1.75, sm: 2 },
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 13, letterSpacing: "0.02em", mb: 0.5 }}>
        {t("title")}
      </Typography>
      <Typography sx={{ color: "var(--text-muted)", fontSize: 12.5, lineHeight: 1.55, mb: 1.5 }}>
        {t("body")}
      </Typography>
      <Stack direction="row" spacing={0.75} sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="text"
          onClick={reject}
          sx={{ color: "var(--text-muted)", minWidth: 0, px: 1.25, fontSize: 12.5 }}
        >
          {t("reject")}
        </Button>
        <Button size="small" variant="contained" color="primary" onClick={accept} sx={{ px: 1.75, fontSize: 12.5 }}>
          {t("accept")}
        </Button>
      </Stack>
    </Box>
  );
}
