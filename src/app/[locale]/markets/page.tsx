"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/shared/page-hero";
import { markets } from "@/data/markets";

export default function MarketsPage() {
  const t = useTranslations("markets");
  const locale = useLocale();

  return (
    <div>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        breadcrumbs={[{ label: "Markets" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => (
              <Link
                key={market.id}
                href={`/${locale}/markets/${market.slug}`}
                className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-[oklch(0.76_0.11_80)]/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.76_0.11_80)]/10 text-[oklch(0.76_0.11_80)]">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold group-hover:text-[oklch(0.76_0.11_80)]">
                  {market.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {market.description.slice(0, 120)}...
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {market.featuredCategories.slice(0, 3).map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-[oklch(0.76_0.11_80)]">
                  {t("viewDetails")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
