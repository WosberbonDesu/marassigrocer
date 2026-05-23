import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { TopUtilityBar } from "@/components/layout/top-utility-bar";
import { Footer } from "@/components/layout/footer";
import { RFQDrawer } from "@/components/layout/rfq-drawer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SetLocaleAttrs } from "@/components/shared/set-locale-attrs";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import { getSiteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();
  const title = cfg.siteTitle || "Marassi Group — FMCG Export & Private Label";
  const description =
    cfg.siteDescription ||
    "B2B FMCG export, private label manufacturing, sourcing, and logistics solutions. Mixed containers, full documentation, global delivery to 45+ countries.";
  return {
    title: { default: title, template: `%s | ${cfg.companyName || "Marassi Group"}` },
    description,
    openGraph: cfg.ogImage
      ? { title, description, images: [{ url: cfg.ogImage }] }
      : { title, description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SetLocaleAttrs locale={locale} />
      <SiteAnalytics />
      <TopUtilityBar />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <RFQDrawer />
      <WhatsAppButton />
      <Toaster />
    </NextIntlClientProvider>
  );
}
