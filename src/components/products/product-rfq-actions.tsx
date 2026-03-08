"use client";

import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRFQStore } from "@/stores/rfq-store";
import { useTranslations } from "next-intl";

interface ProductRFQActionsProps {
  productId: string;
  productName: string;
}

export function ProductRFQActions({ productId, productName }: ProductRFQActionsProps) {
  const t = useTranslations("products.detail");
  const { addItem, hasItem, openDrawer } = useRFQStore();
  const isAdded = hasItem(productId);

  const handleAdd = () => {
    addItem({ productId, productName, quantity: 1, notes: "" });
  };

  return (
    <div className="mt-6 flex gap-3">
      <Button
        size="lg"
        onClick={() => { handleAdd(); openDrawer("list"); }}
        className="flex-1"
      >
        {t("requestQuote")}
      </Button>
      <Button
        size="lg"
        variant={isAdded ? "secondary" : "outline"}
        onClick={handleAdd}
        disabled={isAdded}
      >
        {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </Button>
    </div>
  );
}
