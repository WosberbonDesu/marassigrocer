"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { markets } from "@/data/markets";

export default function MarketDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("markets");
  const td = useTranslations("marketDetailPage");

  const market = markets.find((m) => m.slug === params.slug);

  if (!market) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{td("notFound")}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href={`/${locale}/markets`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {td("backToMarkets")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 via-background to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/markets`}
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {td("backToMarkets")}
          </Link>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {market.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {market.description}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Popular Categories */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-semibold">{t("popularCategories")}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {market.featuredCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="px-3 py-1.5">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Regulatory Notes */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-semibold">{t("regulatoryNotes")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {market.regulatoryNotes}
              </p>
            </div>
          </div>

          {/* Case Snippet */}
          <div className="mt-8 rounded-2xl border bg-primary/5 p-8">
            <p className="text-lg leading-relaxed italic text-foreground/80">
              &ldquo;{market.caseSnippet}&rdquo;
            </p>
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href={`/${locale}/request-quote`}>
                {td("getQuoteFor", { market: market.name })}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
