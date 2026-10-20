"use client";

import { NextIntlClientProvider } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeModeProvider } from "./ThemeModeProvider";
import PreferencesConsent from "./PreferencesConsent";

export function AppProviders({ locale, messages, timeZone, children }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <AppRouterCacheProvider options={{ key: "mui" }}>
        <ThemeModeProvider>
          {children}
          <PreferencesConsent />
        </ThemeModeProvider>
      </AppRouterCacheProvider>
    </NextIntlClientProvider>
  );
}
