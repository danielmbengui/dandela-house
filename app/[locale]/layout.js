import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/components/providers/AppProviders";
import DocumentLang from "@/components/providers/DocumentLang";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {
      title: "DANDELA House",
    };
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <AppProviders locale={locale} messages={messages}>
      <DocumentLang locale={locale} />
      <SiteHeader />
      <main className="pt-[72px]">{children}</main>
      <SiteFooter />
    </AppProviders>
  );
}
