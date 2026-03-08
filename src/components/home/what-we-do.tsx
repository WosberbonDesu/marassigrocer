"use client";

import { useTranslations } from "next-intl";
import { Search, Tag, Truck } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const services = [
  { key: "sourcing", icon: Search },
  { key: "privateLabel", icon: Tag },
  { key: "logistics", icon: Truck },
] as const;

export function WhatWeDo() {
  const t = useTranslations("whatWeDo");

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-6 sm:grid-cols-3">
          {services.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
