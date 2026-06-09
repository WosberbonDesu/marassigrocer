"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Lock, Package, Plus, Minus, Check, Flame, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRFQStore } from "@/stores/rfq-store";
import { Product, PricingTier } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  showPricesPublicly?: boolean;
}

function formatPrice(n: number | undefined) {
  if (n == null) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ProductB2BCard({ product, showPricesPublicly = false }: Props) {
  const locale = useLocale();
  const t = useTranslations("productB2bCard");
  const { addItem, hasItem } = useRFQStore();
  const isAdded = hasItem(product.id);
  const [qty, setQty] = useState(0);

  const tiers: PricingTier[] = Array.isArray(product.pricingTiers)
    ? product.pricingTiers
    : [];

  const detailHref = `/${locale}/products/${product.slug}`;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      quantity: Math.max(1, qty || 1),
      notes: "",
    });
  };

  const brandName = product.brand?.name && product.brand.name !== "—" ? product.brand.name : "—";
  const pack = product.packDescription || "—";
  const titleWithPack =
    product.packDescription && !product.name.includes(product.packDescription)
      ? `${product.name} — ${product.packDescription}${product.unitWeight ? ` (${product.unitWeight})` : ""}`
      : product.name;

  return (
    <div className="group grid grid-cols-1 gap-5 rounded-2xl border border-white/10 bg-[oklch(0.20_0.02_80)] p-5 text-white transition-all duration-300 hover:border-[oklch(0.78_0.12_80)]/40 hover:shadow-[0_18px_40px_-18px_oklch(0.20_0.02_80/0.6)] sm:grid-cols-[220px_1fr_220px] sm:gap-6 sm:p-6">
      {/* Image */}
      <Link
        href={detailHref}
        className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[oklch(0.96_0.005_85)] to-[oklch(0.91_0.012_85)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/15 sm:h-56 sm:w-[220px]"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="220px"
          />
        ) : (
          <Package className="h-14 w-14 text-muted-foreground/30" />
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={detailHref} className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-snug text-white transition-colors hover:text-[oklch(0.82_0.11_80)]">
              {titleWithPack}
            </h3>
          </Link>
          {product.hazmat && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300"
              title={t("badges.hazmatTitle")}
            >
              <Flame className="h-3 w-3" /> {t("badges.hazmat")}
            </span>
          )}
          {product.reeferRequired && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300"
              title={t("badges.reeferTitle")}
            >
              <Snowflake className="h-3 w-3" /> {t("badges.reefer")}
            </span>
          )}
          {(product.moqQuantity || product.moqHint) && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
              {t("moq")}:{" "}
              {product.moqQuantity
                ? `${product.moqQuantity} ${product.moqUnit ?? ""}`
                : product.moqHint}
            </span>
          )}
        </div>

        {/* Brand / Pack / UPC grid */}
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <div className="border-b border-r border-white/10 p-2.5 sm:border-b-0">
              <p className="text-[10px] uppercase tracking-wider text-white/45">{t("specs.brand")}</p>
              <p className="mt-0.5 font-medium text-white/90 truncate">{brandName}</p>
            </div>
            <div className="border-b border-white/10 p-2.5 sm:border-b-0 sm:border-r">
              <p className="text-[10px] uppercase tracking-wider text-white/45">{t("specs.pack")}</p>
              <p className="mt-0.5 font-medium text-white/90 truncate">{pack}</p>
            </div>
            <div className="border-r border-white/10 p-2.5">
              <p className="text-[10px] uppercase tracking-wider text-white/45">{t("specs.unitUpc")}</p>
              <p className="mt-0.5 font-medium text-white/90 truncate">{product.unitUpc || "—"}</p>
            </div>
            <div className="p-2.5">
              <p className="text-[10px] uppercase tracking-wider text-white/45">{t("specs.caseUpc")}</p>
              <p className="mt-0.5 font-medium text-white/90 truncate">{product.caseUpc || "—"}</p>
            </div>
          </div>
        </div>

        {/* Pricing tiers */}
        {tiers.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-white/10 text-xs">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={cn(
                  "grid grid-cols-[1fr_2fr_2fr] items-stretch",
                  idx > 0 && "border-t border-white/10"
                )}
              >
                <div className="flex items-center justify-center bg-[oklch(0.78_0.12_80)]/12 px-2 py-2 font-semibold tabular-nums text-[oklch(0.82_0.11_80)]">
                  {tier.minQty}
                </div>
                <div className="flex items-center justify-between gap-2 border-l border-r border-white/10 px-3 py-2">
                  <span className="text-white/55">
                    {t("pricing.casePrice", { minQty: tier.minQty })}
                  </span>
                  <span className="font-semibold text-white">
                    {showPricesPublicly && tier.casePrice != null ? (
                      `$${formatPrice(tier.casePrice)}`
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-white/40" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="text-white/55">{t("pricing.unitPrice")}</span>
                  <span className="font-semibold text-white">
                    {showPricesPublicly && tier.unitPrice != null ? (
                      `$${formatPrice(tier.unitPrice)}`
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-white/40" />
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-white/55">
            {t("pricing.onRequest")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">
            {t("quantity.label")}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(0, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
              disabled={qty <= 0}
              aria-label={t("quantity.decrease")}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
              className="h-10 w-full rounded-md border border-white/15 bg-white/[0.04] px-2 text-center text-sm tabular-nums text-white outline-none focus:border-[oklch(0.78_0.12_80)]/50 focus:ring-2 focus:ring-[oklch(0.78_0.12_80)]/25"
            />
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("quantity.increase")}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-10 w-full border-white/20 bg-transparent text-sm font-medium text-white hover:border-[oklch(0.78_0.12_80)]/50 hover:bg-white/10 hover:text-white"
        >
          <Link href={detailHref}>{t("actions.productDetails")}</Link>
        </Button>

        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isAdded}
          className={cn(
            "h-10 w-full text-sm font-semibold",
            isAdded
              ? "bg-white/10 text-white/60 hover:bg-white/10"
              : "bg-[oklch(0.66_0.16_35)] text-white shadow-md shadow-[oklch(0.66_0.16_35)]/30 hover:bg-[oklch(0.60_0.17_35)]"
          )}
        >
          {isAdded ? (
            <>
              <Check className="mr-1.5 h-4 w-4" /> {t("actions.addedToRfq")}
            </>
          ) : (
            <>
              <Plus className="mr-1.5 h-4 w-4" /> {t("actions.addToRfq")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
