"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  onClear?: () => void;
}

export function ProductGrid({ products, onClear }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h3 className="mt-4 text-sm font-semibold">No products found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="mt-4"
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
