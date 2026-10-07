import { headers } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { routing } from "@/i18n/routing";
import ThemeInitScript from "@/components/providers/ThemeInitScript";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default async function RootLayout({ children }) {
  const headerStore = await headers();
  const requested = headerStore.get("x-next-intl-locale");
  const locale = routing.locales.includes(requested)
    ? requested
    : routing.defaultLocale;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className={`${display.variable} antialiased`}>
        <ThemeInitScript />
        {children}
      </body>
    </html>
  );
}
