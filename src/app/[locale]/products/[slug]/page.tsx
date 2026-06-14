import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Flame,
  Snowflake,
  Package as PackageIcon,
  Clock,
  Globe,
  Truck,
  ShieldCheck,
  Boxes,
  Ruler,
  Barcode,
  Layers,
  FileText,
  Download,
  CheckCircle2,
  ArrowRight,
  Tag,
  Award,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductRFQActions } from "@/components/products/product-rfq-actions";
import { db } from "@/lib/db";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true },
  });

  if (!product) return {};

  return {
    title: product.seoTitle || `${product.name} | Marassi Group`,
    description:
      product.seoDesc ||
      (product.description ? product.description.slice(0, 160) : undefined),
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDesc || product.description?.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

function availabilityMeta(value: string) {
  switch (value) {
    case "in_stock":
      return { labelKey: "inStock", tone: "bg-[oklch(0.55_0.14_150)]/15 text-[oklch(0.40_0.14_150)] ring-[oklch(0.55_0.14_150)]/30" };
    case "seasonal":
      return { labelKey: "stockStatus.seasonal", tone: "bg-amber-500/15 text-amber-700 ring-amber-500/30" };
    case "on_request":
      return { labelKey: "onRequest", tone: "bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.50_0.12_75)] ring-[oklch(0.78_0.12_80)]/30" };
    default:
      return { labelKey: "stockStatus.discontinued", tone: "bg-muted text-muted-foreground ring-border" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("products.detail");
  const tp = await getTranslations("products");

  const product = await db.product.findUnique({
    where: { slug, published: true },
    include: { category: true, brand: true },
  });

  if (!product) notFound();

  const specs = (product.specs as Record<string, string>) ?? {};
  const packaging = product.packaging as { caseSize?: string; casesPerPallet?: number; casesPerLayer?: number } | null;
  const nutrition = (product.nutrition as { label: string; value: string; per?: string }[] | null) ?? [];
  const allergens = product.allergens ?? [];
  const pricingTiers = (product.pricingTiers as { minQty: number; casePrice?: number; unitPrice?: number }[] | null) ?? [];

  // Site config (publicPrices, related products)
  const siteConfig = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null);
  const showPricesPublicly = !!siteConfig?.showPricesPublicly;

  // Related products
  const relatedIds = product.relatedProductIds ?? [];
  let relatedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    images: string[];
    originCountries: string[];
    brand: { name: string } | null;
    category: { name: string };
  }> = [];
  try {
    relatedProducts = await db.product.findMany({
      where: {
        published: true,
        OR: [
          ...(relatedIds.length > 0 ? [{ id: { in: relatedIds } }] : []),
          { categoryId: product.categoryId, NOT: { id: product.id } },
        ],
      },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        originCountries: true,
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
  } catch {
    relatedProducts = [];
  }

  const availMeta = availabilityMeta(product.availability);

  const tabs: { value: string; label: string; available: boolean }[] = [
    { value: "description", label: t("description"), available: !!product.longDescription || !!product.description },
    { value: "ingredients", label: t("tabs.ingredients"), available: !!product.ingredients || allergens.length > 0 },
    { value: "nutrition", label: t("tabs.nutrition"), available: nutrition.length > 0 },
    { value: "storage", label: t("tabs.storage"), available: !!product.storage || !!product.shelfLifeMin },
    { value: "specs", label: t("specs"), available: Object.keys(specs).length > 0 },
    { value: "export", label: t("tabs.export"), available: !!product.exportSuitability || !!product.cartonDetails || !!product.loadingInfo },
  ].filter((tab) => tab.available);
  const firstTab = tabs[0]?.value ?? "description";

  return (
    <div className="bg-background">
      {/* ───────── BREADCRUMB / TITLE BAR ───────── */}
      <section className="relative overflow-hidden border-b border-border bg-[oklch(0.97_0.012_85)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" locale={locale} className="transition-colors hover:text-[oklch(0.50_0.12_75)]">
              {tp("breadcrumb.home")}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <Link href="/products" locale={locale} className="transition-colors hover:text-[oklch(0.50_0.12_75)]">
              {tp("breadcrumb.products")}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <Link
              href={`/products/list?category=${product.category.slug}`}
              locale={locale}
              className="transition-colors hover:text-[oklch(0.50_0.12_75)]"
            >
              {product.category.name}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-medium text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* ───────── MAIN ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery
              images={product.images}
              alts={product.imageAlts ?? []}
              productName={product.name}
            />

            {/* Trust badges under gallery */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, id: "qualityVerified" },
                { icon: Globe, id: "exportReady" },
                { icon: Award, id: "certified" },
              ].map(({ icon: Icon, id }) => (
                <div
                  key={id}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-[oklch(0.72_0.11_80)]/20 bg-white px-2 py-2.5 text-[11px] font-semibold text-[oklch(0.50_0.12_75)]"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{tp(`trustBadges.${id}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div>
            {/* Brand + Category */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
              {product.brand?.name && (
                <span className="text-[oklch(0.50_0.12_75)]">{product.brand.name}</span>
              )}
              {product.brand?.name && (
                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              )}
              <span className="text-muted-foreground">{product.category.name}</span>
              {product.sku && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span className="font-mono text-muted-foreground">{tp("badges.sku")}: {product.sku}</span>
                </>
              )}
            </div>

            {/* Name */}
            <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>

            {/* Pack / weight subtitle */}
            {(product.packDescription || product.unitWeight) && (
              <p className="mt-2 text-sm text-muted-foreground">
                {product.packDescription}
                {product.unitWeight && product.packDescription && " — "}
                {product.unitWeight}
              </p>
            )}

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${availMeta.tone}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {t(availMeta.labelKey)}
              </span>
              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.66_0.16_35)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <Tag className="h-3 w-3" />
                  {tp("badges.bestSeller")}
                </span>
              )}
              {product.hazmat && (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-700 ring-1 ring-inset ring-red-500/30">
                  <Flame className="h-3 w-3" />
                  {tp("badges.hazmat")}
                </span>
              )}
              {product.reeferRequired && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700 ring-1 ring-inset ring-blue-500/30">
                  <Snowflake className="h-3 w-3" />
                  {tp("badges.reefer")}
                </span>
              )}
              {product.originCountries.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-foreground/75"
                >
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  {c}
                </span>
              ))}
            </div>

            {/* Short description */}
            {product.description && (
              <p className="mt-5 leading-relaxed text-foreground/75">
                {product.description}
              </p>
            )}

            {/* Quick specs grid */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-[oklch(0.72_0.11_80)]/20 bg-gradient-to-br from-white to-[oklch(0.97_0.005_85)]">
              <div className="grid grid-cols-2 divide-x divide-y divide-[oklch(0.72_0.11_80)]/12 sm:grid-cols-3">
                <SpecCell
                  icon={Boxes}
                  label={tp("quickSpecs.pack")}
                  value={product.packDescription || packaging?.caseSize || "—"}
                />
                <SpecCell
                  icon={Layers}
                  label={tp("quickSpecs.caseSize")}
                  value={product.caseSize ? `${product.caseSize} units` : "—"}
                />
                <SpecCell
                  icon={PackageIcon}
                  label={tp("quickSpecs.moq")}
                  value={
                    product.moqQuantity
                      ? `${product.moqQuantity} ${product.moqUnit ?? ""}`.trim()
                      : product.moqHint || t("onRequest")
                  }
                />
                <SpecCell
                  icon={Clock}
                  label={tp("quickSpecs.shelfLife")}
                  value={
                    product.shelfLifeMin && product.shelfLifeMax
                      ? `${product.shelfLifeMin}–${product.shelfLifeMax} days`
                      : product.shelfLifeMin
                      ? `${product.shelfLifeMin}+ days`
                      : "—"
                  }
                />
                <SpecCell
                  icon={Ruler}
                  label={tp("quickSpecs.unitWeight")}
                  value={product.unitWeight || product.weight || "—"}
                />
                <SpecCell
                  icon={Barcode}
                  label={tp("quickSpecs.unitUpc")}
                  value={product.unitUpc || "—"}
                  mono
                />
              </div>
            </div>

            {/* Pricing tiers (if visible) */}
            {pricingTiers.length > 0 && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-[oklch(0.72_0.11_80)]/20 bg-white">
                <div className="border-b border-[oklch(0.72_0.11_80)]/15 bg-[oklch(0.78_0.12_80)]/8 px-4 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.40_0.10_75)]">
                    {tp("pricing.volumePricing")} — {showPricesPublicly ? tp("pricing.liveQuote") : tp("pricing.loginOrRfq")}
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">{tp("pricing.fromCases")}</th>
                      <th className="px-4 py-2 text-right font-semibold">{tp("pricing.casePrice")}</th>
                      <th className="px-4 py-2 text-right font-semibold">{tp("pricing.unitPrice")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {pricingTiers.map((tier, i) => (
                      <tr key={i} className="hover:bg-muted/20">
                        <td className="px-4 py-2.5 font-semibold tabular-nums text-[oklch(0.40_0.10_75)]">
                          {tier.minQty}+
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {showPricesPublicly && tier.casePrice != null ? (
                            <span className="font-semibold">${tier.casePrice.toFixed(2)}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {showPricesPublicly && tier.unitPrice != null ? (
                            <span className="font-semibold">${tier.unitPrice.toFixed(2)}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* RFQ actions */}
            <ProductRFQActions productId={product.id} productName={product.name} />

            {/* Secondary CTAs */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                locale={locale}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[oklch(0.50_0.12_75)] transition-colors hover:text-[oklch(0.40_0.10_75)]"
              >
                <FileText className="h-3.5 w-3.5" />
                {tp("cta.requestSpecSheet")}
              </Link>
              <span className="h-3 w-px bg-border" />
              <Link
                href="/certificates"
                locale={locale}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[oklch(0.50_0.12_75)] transition-colors hover:text-[oklch(0.40_0.10_75)]"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {tp("cta.viewCertifications")}
              </Link>
            </div>

            {/* Logistics summary */}
            {(product.cartonDetails || product.loadingInfo || product.dimensions || (packaging?.casesPerPallet)) && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-5">
                <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-foreground">
                  <Truck className="h-3.5 w-3.5 text-[oklch(0.50_0.12_75)]" />
                  {tp("logistics.title")}
                </p>
                <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  {packaging?.casesPerPallet && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{tp("logistics.casesPerPallet")}</dt>
                      <dd className="font-medium">{packaging.casesPerPallet}</dd>
                    </div>
                  )}
                  {packaging?.casesPerLayer && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{tp("logistics.casesPerLayer")}</dt>
                      <dd className="font-medium">{packaging.casesPerLayer}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{tp("logistics.dimensions")}</dt>
                      <dd className="font-medium">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.caseUpc && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{tp("logistics.caseUpc")}</dt>
                      <dd className="font-mono text-xs font-medium">{product.caseUpc}</dd>
                    </div>
                  )}
                  {product.cartonDetails && (
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">{tp("logistics.carton")}</dt>
                      <dd className="mt-1 text-sm">{product.cartonDetails}</dd>
                    </div>
                  )}
                  {product.loadingInfo && (
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">{tp("logistics.loading")}</dt>
                      <dd className="mt-1 text-sm">{product.loadingInfo}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* ───────── DETAIL TABS ───────── */}
        {tabs.length > 0 && (
          <div className="mt-16">
            <Tabs defaultValue={firstTab}>
              <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:border-[oklch(0.72_0.11_80)]/40 data-[state=active]:bg-[oklch(0.78_0.12_80)]/10 data-[state=active]:text-[oklch(0.40_0.10_75)] data-[state=active]:shadow-none"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {(product.longDescription || product.description) && (
                <TabsContent value="description" className="mt-5">
                  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    {product.longDescription ? (
                      <div
                        className="prose prose-neutral max-w-none prose-headings:font-[family-name:var(--font-playfair)] prose-headings:tracking-tight prose-h2:text-xl prose-h3:text-lg prose-a:text-[oklch(0.50_0.12_75)]"
                        dangerouslySetInnerHTML={{ __html: product.longDescription }}
                      />
                    ) : (
                      <p className="text-sm leading-relaxed text-foreground/75">
                        {product.description}
                      </p>
                    )}
                  </div>
                </TabsContent>
              )}

              {(product.ingredients || allergens.length > 0) && (
                <TabsContent value="ingredients" className="mt-5">
                  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
                    {product.ingredients && (
                      <div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground/80">
                          {tp("sections.ingredients")}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/75">
                          {product.ingredients}
                        </p>
                      </div>
                    )}
                    {allergens.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground/80">
                          {tp("sections.allergens")}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {allergens.map((a) => (
                            <span
                              key={a}
                              className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

              {nutrition.length > 0 && (
                <TabsContent value="nutrition" className="mt-5">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="px-5 py-3 text-left font-semibold">{tp("nutrition.nutrient")}</th>
                          <th className="px-5 py-3 text-left font-semibold">{tp("nutrition.amount")}</th>
                          <th className="px-5 py-3 text-left font-semibold">{tp("nutrition.per")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {nutrition.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/15"}>
                            <td className="px-5 py-3 text-foreground/75">{row.label}</td>
                            <td className="px-5 py-3 font-semibold">{row.value}</td>
                            <td className="px-5 py-3 text-muted-foreground">{row.per ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              )}

              {(product.storage || product.shelfLifeMin) && (
                <TabsContent value="storage" className="mt-5">
                  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
                    {product.shelfLifeMin && (
                      <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-4">
                        <Clock className="h-5 w-5 shrink-0 text-[oklch(0.50_0.12_75)]" />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            {tp("quickSpecs.shelfLife")}
                          </p>
                          <p className="text-base font-semibold">
                            {product.shelfLifeMax
                              ? `${product.shelfLifeMin} – ${product.shelfLifeMax} days`
                              : `${product.shelfLifeMin}+ days`}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.storage && (
                      <div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground/80">
                          {tp("sections.storageInstructions")}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/75">{product.storage}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

              {Object.keys(specs).length > 0 && (
                <TabsContent value="specs" className="mt-5">
                  <div className="overflow-hidden rounded-2xl border border-border">
                    {Object.entries(specs).map(([key, value], i) => (
                      <div
                        key={key}
                        className={`flex justify-between gap-4 px-5 py-3 text-sm ${
                          i % 2 === 0 ? "bg-card" : "bg-muted/15"
                        }`}
                      >
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-semibold text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {(product.exportSuitability || product.cartonDetails || product.loadingInfo) && (
                <TabsContent value="export" className="mt-5">
                  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
                    {product.exportSuitability && (
                      <div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground/80">
                          {tp("sections.exportSuitability")}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/75">
                          {product.exportSuitability}
                        </p>
                      </div>
                    )}
                    {product.cartonDetails && (
                      <div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground/80">
                          {tp("sections.cartonDetails")}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/75">
                          {product.cartonDetails}
                        </p>
                      </div>
                    )}
                    {product.loadingInfo && (
                      <div>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground/80">
                          {tp("sections.loadingInfo")}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/75">
                          {product.loadingInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {/* ───────── WHY MARASSI STRIP ───────── */}
        <div className="mt-16 grid grid-cols-2 gap-3 rounded-2xl border border-[oklch(0.72_0.11_80)]/20 bg-gradient-to-br from-[oklch(0.97_0.012_85)] to-white p-6 sm:grid-cols-4 sm:gap-4">
          {[
            { icon: ShieldCheck, id: "verifiedManufacturer" },
            { icon: Globe, id: "exportMarkets" },
            { icon: Truck, id: "containerLcl" },
            { icon: CheckCircle2, id: "fullDocumentation" },
          ].map(({ icon: Icon, id }) => (
            <div key={id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.50_0.12_75)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/25">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[13px] font-semibold leading-snug">{tp(`whyStrip.${id}`)}</p>
            </div>
          ))}
        </div>

        {/* ───────── RELATED PRODUCTS ───────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.60_0.12_75)]">
                  {tp("related.eyebrow")}
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight sm:text-3xl">
                  {tp("related.title")}
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="hidden border-[oklch(0.72_0.11_80)]/40 bg-transparent text-sm font-medium text-[oklch(0.40_0.10_75)] hover:bg-[oklch(0.78_0.12_80)]/10 sm:inline-flex"
              >
                <Link href={`/products/list?category=${product.category.slug}`} locale={locale}>
                  {tp("related.viewAllIn", { category: product.category.name })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  locale={locale}
                  className="group block overflow-hidden rounded-2xl border border-[oklch(0.72_0.11_80)]/15 bg-white transition-all hover:-translate-y-1 hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-[0_18px_40px_-18px_oklch(0.20_0.02_80/0.25)]"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[oklch(0.97_0.005_85)]">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <PackageIcon className="h-12 w-12 text-muted-foreground/25" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {p.brand?.name && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.50_0.12_75)]">
                        {p.brand.name}
                      </p>
                    )}
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-[oklch(0.50_0.12_75)]">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      {p.originCountries[0] && tp("related.origin", { country: p.originCountries[0] })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ───────── CTA BAND ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] py-12 text-white sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-6 lg:grid-cols-[1.5fr_auto]">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {tp.rich("ctaBand.title", {
                  product: () => (
                    <span className="text-[oklch(0.78_0.12_80)]">{product.name}</span>
                  ),
                })}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
                {tp("ctaBand.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent text-sm font-medium text-white hover:bg-white/10"
              >
                <Link href="/contact" locale={locale}>
                  <Download className="mr-2 h-4 w-4" />
                  {tp("ctaBand.requestDocumentation")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SpecCell({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 text-[oklch(0.50_0.12_75)]" />
        {label}
      </div>
      <p className={`mt-1.5 text-sm font-semibold text-foreground/90 ${mono ? "font-mono text-xs" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}
