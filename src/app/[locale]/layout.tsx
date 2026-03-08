import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RFQDrawer } from "@/components/layout/rfq-drawer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SetLocaleAttrs } from "@/components/shared/set-locale-attrs";

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
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <RFQDrawer />
      <WhatsAppButton />
      <Toaster />
    </NextIntlClientProvider>
  );
}
