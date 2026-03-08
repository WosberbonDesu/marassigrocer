import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/shared/page-hero";
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

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("products.detail");

  const product = await db.product.findUnique({
    where: { slug, published: true },
    include: { category: true, brand: true },
  });

  if (!product) notFound();

  const specs = (product.specs as Record<string, string>) ?? {};
  const packaging = product.packaging as { caseSize?: string } | null;

  return (
    <div>
      {/* Hero Breadcrumb */}
      <PageHero
        title={product.name}
        breadcrumbs={[
          { label: "Products", href: `/${locale}/products` },
          { label: product.name },
        ]}
        locale={locale}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-32 w-32 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="text-sm text-muted-foreground">{product.brand.name}</p>
          )}
          <h1 className="mt-1 font-[family-name:var(--font-playfair)] text-3xl font-bold">{product.name}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant={product.availability === "in_stock" ? "default" : "secondary"}>
              {product.availability === "in_stock" ? t("inStock") : t("onRequest")}
            </Badge>
            {product.originCountries.map((c: string) => (
              <Badge key={c} variant="outline">{c}</Badge>
            ))}
          </div>

          {product.description && (
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-6 rounded-xl border border-[oklch(0.76_0.11_80)]/30 bg-muted/50 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {packaging?.caseSize && (
                <div>
                  <span className="text-muted-foreground">{t("packaging")}:</span>
                  <span className="ml-1 font-medium">{packaging.caseSize}</span>
                </div>
              )}
              {product.moqHint && (
                <div>
                  <span className="text-muted-foreground">MOQ:</span>
                  <span className="ml-1 font-medium">{product.moqHint}</span>
                </div>
              )}
              {product.shelfLifeMin && product.shelfLifeMax && (
                <div>
                  <span className="text-muted-foreground">{t("shelfLife")}:</span>
                  <span className="ml-1 font-medium">
                    {product.shelfLifeMin}–{product.shelfLifeMax} days
                  </span>
                </div>
              )}
            </div>
          </div>

          <ProductRFQActions productId={product.id} productName={product.name} />
        </div>
      </div>

      {/* Specs */}
      {Object.keys(specs).length > 0 && (
        <Tabs defaultValue="specs" className="mt-12">
          <TabsList>
            <TabsTrigger value="specs">{t("specs")}</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-4">
            <div className="rounded-2xl border">
              {Object.entries(specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between px-5 py-3 text-sm ${
                    i % 2 === 0 ? "bg-muted/30" : ""
                  }`}
                >
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
      </div>
    </div>
  );
}
