import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brandsPage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function BrandsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("brandsPage");

  let brands: Array<{
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    origin: string | null;
    description: string | null;
    _count: { products: number };
  }> = [];
  try {
    brands = await db.brand.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        origin: true,
        description: true,
        _count: { select: { products: true } },
      },
    });
  } catch {
    brands = [];
  }

  return (
    <div>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        locale={locale}
        breadcrumbs={[{ label: t("breadcrumb.brands") }]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <Award className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">{t("empty.title")}</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t("empty.description")}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t("empty.contactUs")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/${locale}/brands/${b.slug}`}
                  className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                >
                  <div className="mb-4 flex h-20 w-full items-center justify-center rounded-lg bg-muted/40">
                    {b.logo ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={b.logo}
                          alt={b.name}
                          fill
                          className="object-contain p-3"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                    ) : (
                      <Award className="h-8 w-8 text-muted-foreground/40" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                    {b.name}
                  </h3>
                  {b.origin && (
                    <p className="mt-1 text-xs text-muted-foreground">{b.origin}</p>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{b._count.products}</span>{" "}
                    {t("card.products")}
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-primary group-hover:gap-2 transition-all">
                    {t("card.viewBrand")}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
