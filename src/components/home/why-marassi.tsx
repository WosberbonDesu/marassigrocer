"use client";

import { useTranslations } from "next-intl";
import { Warehouse, Factory, ShieldCheck, Container } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const capabilities = [
  { key: "warehouse", icon: Warehouse },
  { key: "network", icon: Factory },
  { key: "compliance", icon: ShieldCheck },
  { key: "mixed", icon: Container },
] as const;

export function WhyMarassi() {
  const t = useTranslations("whyMarassi");

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ key, icon: Icon }) => (
            <div key={key} className="rounded-2xl border bg-background p-6">
              <Icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="font-semibold">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
