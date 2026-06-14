"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Package, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRFQStore } from "@/stores/rfq-store";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
}

type SecondaryBadge = {
  tone: "bestSeller" | "topSeller" | "privateLabel" | "bulk";
};

function pickSecondaryBadge(product: Product): SecondaryBadge | null {
  if (product.featured) return { tone: "bestSeller" };
  if (product.availability === "in_stock") {
    if ((product.caseSize ?? 0) >= 12) return { tone: "bulk" };
    return { tone: "topSeller" };
  }
  if (product.availability === "seasonal") return { tone: "privateLabel" };
  return null;
}

const badgeTone: Record<SecondaryBadge["tone"], string> = {
  bestSeller: "bg-[oklch(0.66_0.16_35)] text-white",
  topSeller: "bg-[oklch(0.78_0.12_80)] text-[oklch(0.18_0.02_80)]",
  privateLabel: "bg-white text-[oklch(0.20_0.02_80)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/40",
  bulk: "bg-[oklch(0.34_0.05_75)] text-[oklch(0.92_0.06_80)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/30",
};

export function ProductCatalogCard({ product }: Props) {
  const locale = useLocale();
  const t = useTranslations("productCatalogCard");
  const { addItem, openDrawer } = useRFQStore();

  const detailHref = `/products/${product.slug}`;

  const handleQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      notes: "",
    });
    openDrawer("list");
  };

  const exportReady =
    product.availability === "in_stock" || product.availability === "seasonal";
  const secondary = pickSecondaryBadge(product);
  const origin = product.originCountries[0];

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[oklch(0.72_0.11_80)]/15 bg-white shadow-[0_2px_10px_-4px_oklch(0.20_0.02_80/0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-[0_20px_40px_-18px_oklch(0.20_0.02_80/0.32)]">
      {/* Image area — taller aspect for a more prominent product shot */}
      <Link
        href={detailHref}
        locale={locale}
        className="relative block aspect-square w-full overflow-hidden bg-gradient-to-br from-[oklch(0.97_0.005_85)] to-[oklch(0.94_0.012_85)]"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-14 w-14 text-muted-foreground/25" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {exportReady && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.55_0.14_150)] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              {t("badges.exportReady")}
            </span>
          )}
          {secondary && (
            <span
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm",
                badgeTone[secondary.tone]
              )}
            >
              {t(`badges.${secondary.tone}`)}
            </span>
          )}
        </div>

        {/* Brand chip — bottom-left of image */}
        {product.brand?.name && product.brand.name !== "—" && (
          <div className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.40_0.10_75)] shadow-sm backdrop-blur-sm">
            {product.brand.name}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <Link href={detailHref} locale={locale} className="block">
          <h3
            className="line-clamp-2 break-words text-[14px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-[oklch(0.50_0.12_75)] sm:text-[15px]"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
          <span className="truncate">{product.category.name}</span>
          {origin && (
            <>
              <span className="text-muted-foreground/45">•</span>
              <span className="truncate">{t("originLabel")}: {origin}</span>
            </>
          )}
        </div>

        <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-9 border-[oklch(0.72_0.11_80)]/40 bg-transparent text-[10.5px] font-semibold uppercase tracking-wider text-[oklch(0.40_0.10_75)] hover:bg-[oklch(0.78_0.12_80)]/10 hover:text-[oklch(0.30_0.12_75)]"
          >
            <Link href={detailHref} locale={locale}>
              <Eye className="mr-1 h-3.5 w-3.5" />
              {t("actions.view")}
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={handleQuote}
            className="h-9 bg-[oklch(0.66_0.16_35)] text-[10.5px] font-semibold uppercase tracking-wider text-white shadow-sm shadow-[oklch(0.66_0.16_35)]/30 hover:bg-[oklch(0.60_0.17_35)]"
          >
            <FileText className="mr-1 h-3.5 w-3.5" />
            {t("actions.quote")}
          </Button>
        </div>
      </div>
    </div>
  );
}
