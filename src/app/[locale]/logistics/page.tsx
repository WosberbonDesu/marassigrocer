"use client";

import { useTranslations, useLocale } from "next-intl";
import { Ship, Container, Thermometer, FileCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/shared/section-header";
import { PageHero } from "@/components/shared/page-hero";
import { faqs } from "@/data/faqs";

export default function LogisticsPage() {
  const t = useTranslations("logistics");
  const locale = useLocale();
  const logisticsFaqs = faqs.filter((f) => f.tags.includes("logistics"));

  const incoterms = [
    { key: "fob", color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    { key: "cif", color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
    { key: "exw", color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  ] as const;

  const shippingTypes = [
    { key: "fcl", icon: Container },
    { key: "lcl", icon: Ship },
    { key: "reefer", icon: Thermometer },
  ] as const;

  return (
    <div>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        breadcrumbs={[{ label: "Logistics & Documentation" }]}
      />

      {/* Incoterms */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("incoterms.title")} subtitle={t("incoterms.subtitle")} />
          <div className="grid gap-6 sm:grid-cols-3">
            {incoterms.map(({ key, color }) => (
              <div key={key} className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg">
                <span className={`inline-block rounded-lg px-3 py-1 text-sm font-bold ${color}`}>
                  {t(`incoterms.${key}.title`)}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t(`incoterms.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Types — dark section */}
      <section className="bg-[oklch(0.20_0.02_80)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {t("shipping.title")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {shippingTypes.map(({ key, icon: Icon }) => (
              <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                <Icon className="mb-3 h-8 w-8 text-[oklch(0.78_0.13_35)]" />
                <h3 className="font-semibold">{t(`shipping.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-white/60">
                  {t(`shipping.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("documents.title")} subtitle={t("documents.subtitle")} />
          <div className="mx-auto max-w-2xl">
            <div className="grid gap-3 sm:grid-cols-2">
              {(t.raw("documents.list") as string[]).map((doc, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-[oklch(0.72_0.11_80)]/30">
                  <FileCheck className="h-5 w-5 shrink-0 text-[oklch(0.72_0.11_80)]" />
                  <span className="text-sm font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — light krem */}
      <section className="bg-[#faf8f4] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("faq.title")} />
          <Accordion type="single" collapsible className="w-full">
            {logisticsFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
