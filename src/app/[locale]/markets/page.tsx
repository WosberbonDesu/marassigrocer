import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/shared/page-hero";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "markets" });
  return { title: t("meta.title"), description: t("meta.description") };
}

export default async function MarketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("markets");

  let markets: Array<{
    id: string;
    name: string;
    slug: string;
    region: string | null;
    countries: string[];
    description: string | null;
    image: string | null;
    featuredCategories: string[];
  }> = [];
  try {
    markets = await db.market.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        region: true,
        countries: true,
        description: true,
        image: true,
        featuredCategories: true,
      },
    });
  } catch {
    markets = [];
  }

  const totalCountries = new Set(markets.flatMap((m) => m.countries)).size;

  return (
    <div>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        locale={locale}
        breadcrumbs={[{ label: t("hero.breadcrumb") }]}
      />

      {/* Stats bar */}
      <section className="border-b bg-muted/30 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-4 text-center sm:px-6 lg:px-8">
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary">
              50+
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {t("stats.countriesServed")}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary">
              {markets.length || "—"}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {t("stats.marketRegions")}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary">
              8+
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {t("stats.sourcingCountries")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {markets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <Globe className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">{t("empty.title")}</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t("empty.description")}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t("empty.cta")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {markets.map((market) => (
                <div
                  key={market.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg hover:border-primary/30"
                >
                  {market.image && (
                    <div className="relative h-40 w-full overflow-hidden bg-muted">
                      <Image src={market.image} alt={market.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Globe className="h-5 w-5" />
                      </div>
                      {market.region && (
                        <Badge variant="secondary" className="text-xs">{market.region}</Badge>
                      )}
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold leading-snug group-hover:text-primary">
                      {market.name}
                    </h3>
                    {market.description && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {market.description}
                      </p>
                    )}
                    {market.countries.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{market.countries.slice(0, 5).join(", ")}</span>
                        {market.countries.length > 5 && (
                          <span className="font-medium">+{market.countries.length - 5} more</span>
                        )}
                      </div>
                    )}
                    {market.featuredCategories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {market.featuredCategories.slice(0, 3).map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[oklch(0.20_0.02_80)] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mt-3 text-lg text-white/70">
            {t("cta.description", {
              count: totalCountries > 0 ? `${totalCountries}+` : "50+",
            })}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[oklch(0.62_0.14_30)] px-6 py-3 text-sm font-medium text-white hover:bg-[oklch(0.52_0.14_25)]"
          >
            {t("cta.button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
