"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRFQStore } from "@/stores/rfq-store";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("productCard");
  const { addItem, hasItem } = useRFQStore();
  const isAdded = hasItem(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: product.id, productName: product.name, quantity: 1, notes: "" });
  };

  const isInStock = product.availability === "in_stock";

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-neutral-50 transition-all duration-200 hover:-translate-y-0.5 hover:border-[oklch(0.72_0.11_80)]/40 hover:shadow-lg hover:shadow-black/5"
    >
      {/* Image with badge overlay */}
      <div className="relative h-52 bg-neutral-50">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/20" />
          </div>
        )}
        {/* Availability badge — image overlay */}
        <span
          className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            isInStock
              ? "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20"
              : "bg-muted/80 text-muted-foreground ring-1 ring-border/50"
          }`}
        >
          {isInStock ? t("availability.inStock") : t("availability.onRequest")}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
          {product.brand.name !== "—" ? product.brand.name : ""}
        </p>

        {/* Name — max 2 lines */}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-[oklch(0.60_0.12_75)] transition-colors">
          {product.name}
        </h3>

        {/* Meta row: origin + MOQ */}
        <div className="mt-2 flex items-center justify-between gap-2">
          {product.originCountries.length > 0 && (
            <p className="truncate text-[11px] text-muted-foreground">
              {product.originCountries.join(", ")}
            </p>
          )}
          {product.moqHint && (
            <p className="shrink-0 text-[11px] font-semibold text-[oklch(0.60_0.12_75)]">
              {product.moqHint}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3">
          <Button
            size="sm"
            className={`w-full text-xs font-semibold transition-all ${
              isAdded
                ? "bg-muted text-muted-foreground"
                : "bg-[oklch(0.72_0.11_80)] text-white hover:bg-[oklch(0.66_0.12_78)]"
            }`}
            onClick={handleAdd}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                {t("cta.addedToRfq")}
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                {t("cta.addToRfq")}
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
