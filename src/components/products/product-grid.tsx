"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ProductB2BCard } from "./product-b2b-card";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  showPricesPublicly?: boolean;
  onClear?: () => void;
}

export function ProductGrid({ products, showPricesPublicly = false, onClear }: ProductGridProps) {
  const t = useTranslations("productGrid");

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h3 className="mt-4 text-sm font-semibold">{t("empty.title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("empty.description")}
        </p>
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="mt-4"
          >
            {t("empty.clearFilters")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductB2BCard
          key={product.id}
          product={product}
          showPricesPublicly={showPricesPublicly}
        />
      ))}
    </div>
  );
}
