"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";

interface Filters {
  category: string;
  brand: string;
  origin: string;
  availability: string;
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClear: () => void;
}

const origins = ["Turkey", "Ukraine"];

export function ProductFilters({
  filters,
  onFilterChange,
  onClear,
}: ProductFiltersProps) {
  const t = useTranslations("products.filters");
  const hasActiveFilters = Object.values(filters).some((v) => v !== "all");

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block text-xs font-medium">{t("category")}</Label>
        <Select
          value={filters.category}
          onValueChange={(v) => onFilterChange("category", v)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block text-xs font-medium">{t("brand")}</Label>
        <Select
          value={filters.brand}
          onValueChange={(v) => onFilterChange("brand", v)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allBrands")}</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.slug} value={b.slug}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block text-xs font-medium">{t("origin")}</Label>
        <Select
          value={filters.origin}
          onValueChange={(v) => onFilterChange("origin", v)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allOrigins")}</SelectItem>
            {origins.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block text-xs font-medium">{t("availability")}</Label>
        <Select
          value={filters.availability}
          onValueChange={(v) => onFilterChange("availability", v)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="in_stock">{t("inStock")}</SelectItem>
            <SelectItem value="on_request">{t("onRequest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="w-full">
          <X className="mr-1.5 h-3.5 w-3.5" />
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
