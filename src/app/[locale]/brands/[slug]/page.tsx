import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Award, MapPin, Package, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const brand = await db.brand.findUnique({ where: { slug } });
    if (!brand) return {};
    return {
      title: brand.seoTitle || `${brand.name} — Marassi Group`,
      description:
        brand.seoDesc ||
        brand.description?.slice(0, 160) ||
        `${brand.name} products distributed by Marassi Group across 50+ countries.`,
      openGraph: brand.logo
        ? {
            title: brand.name,
            description: brand.description ?? undefined,
            images: [{ url: brand.logo }],
          }
        : undefined,
    };
  } catch {
    return {};
  }
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let brand: Awaited<ReturnType<typeof db.brand.findUnique>> = null;
  try {
    brand = await db.brand.findUnique({ where: { slug } });
  } catch {
    brand = null;
  }
  if (!brand) notFound();

  let products: Array<{
    id: string;
    name: string;
    slug: string;
    images: string[];
    packDescription: string | null;
    moqHint: string | null;
    availability: string;
    category: { name: string; slug: string };
  }> = [];
  try {
    products = await db.product.findMany({
      where: { brandId: brand.id, published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { name: "asc" }],
      take: 24,
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        packDescription: true,
        moqHint: true,
        availability: true,
        category: { select: { name: true, slug: true } },
      },
    });
  } catch {
    products = [];
  }

  return (
    <div>
      <PageHero
        title={brand.name}
        subtitle={
          brand.origin
            ? `${brand.origin} — distributed worldwide by Marassi Group`
            : "Distributed worldwide by Marassi Group"
        }
        locale={locale}
        breadcrumbs={[
          { label: "Brands", href: `/${locale}/brands` },
          { label: brand.name },
        ]}
      />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Brand header card */}
          <div className="rounded-2xl border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Logo */}
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-muted/40">
                {brand.logo ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-4"
                      sizes="128px"
                      priority
                    />
                  </div>
                ) : (
                  <Award className="h-16 w-16 text-muted-foreground/40" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold">
                  {brand.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {brand.origin && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {brand.origin}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="gap-1">
                    <Package className="h-3 w-3" />
                    {products.length}+ products
                  </Badge>
                </div>
                {brand.description && (
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold">
                Products from {brand.name}
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/brands`}>
                  <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                  All Brands
                </Link>
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
                <Package className="h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium">No products listed yet</p>
                <p className="mt-1 max-w-md text-xs text-muted-foreground">
                  Our catalog for this brand is being prepared. Contact us for availability and pricing.
                </p>
                <Button asChild size="sm" className="mt-5">
                  <Link href={`/${locale}/contact`}>Request Quote</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${locale}/products/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
                  >
                    <div className="relative h-40 bg-muted/40">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {p.category.name}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <p className="mt-2 flex-1 text-xs text-muted-foreground">
                        {p.packDescription ?? "—"}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        {p.availability === "in_stock" ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            On Request
                          </span>
                        )}
                        {p.moqHint && (
                          <span className="text-[10px] text-muted-foreground">
                            MOQ: {p.moqHint}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
