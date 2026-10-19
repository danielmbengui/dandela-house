import { headers } from "next/headers";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { routing } from "@/i18n/routing";
import ThemeInitScript from "@/components/providers/ThemeInitScript";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
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
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <ThemeInitScript />
        {children}
      </body>
    </html>
  );
}
