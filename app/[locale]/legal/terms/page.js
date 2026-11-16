import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import LegalDocumentPage from "@/components/legal/LegalDocumentPage";
import { routing } from "@/i18n/routing";
import { getLegalMeta } from "@/lib/legal/content";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "DANDELA House" };
  }
  return getLegalMeta(locale, "terms");
}

export default async function TermsPage({ params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalDocumentPage locale={locale} kind="terms" />;
}