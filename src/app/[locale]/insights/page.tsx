"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/shared/page-hero";
import { insights } from "@/data/insights";

export default function InsightsPage() {
  const t = useTranslations("insights");
  const locale = useLocale();

  return (
    <div>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        breadcrumbs={[{ label: "Insights & Guides" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/insights/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg hover:border-[oklch(0.76_0.11_80)]/30"
              >
                <div className="flex h-48 items-center justify-center bg-[oklch(0.12_0.01_60)]">
                  <FileText className="h-12 w-12 text-[oklch(0.76_0.11_80)]/30" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-lg font-semibold leading-tight group-hover:text-[oklch(0.76_0.11_80)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="mt-3 inline-flex items-center text-sm font-medium text-[oklch(0.76_0.11_80)]">
                    {t("readMore")}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
