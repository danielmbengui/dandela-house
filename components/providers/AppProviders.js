"use client";

import { NextIntlClientProvider } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeModeProvider } from "./ThemeModeProvider";

export function AppProviders({ locale, messages, children }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppRouterCacheProvider options={{ key: "mui" }}>
        <ThemeModeProvider>{children}</ThemeModeProvider>
      </AppRouterCacheProvider>
    </NextIntlClientProvider>
  );
}
