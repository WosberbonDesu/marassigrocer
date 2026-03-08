"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Filter, Search, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { PageHero } from "@/components/shared/page-hero";
import { ProductGrid } from "@/components/products/product-grid";
import { Product } from "@/types";

interface Filters {
  category: string;
  brand: string;
  availability: string;
}

const defaultFilters: Filters = { category: "all", brand: "all", availability: "all" };

interface FilterCategory { id: string; name: string; slug: string }
interface FilterBrand { id: string; name: string; slug: string }

export default function ProductsPage() {
  const t = useTranslations("products");
  const locale = useLocale();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<"default" | "name_asc" | "name_desc">("default");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [brands, setBrands] = useState<FilterBrand[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories ?? []));
    fetch("/api/admin/brands").then((r) => r.json()).then((d) => setBrands(d.brands ?? []));
  }, []);

  // Tek seferlik fetch — tüm ürünleri çek
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const res = await fetch("/api/products?limit=200");
      const data = await res.json();
      const raw = (data.products ?? []) as Array<{
        id: string; name: string; slug: string; images: string[];
        originCountries: string[]; moqHint?: string; availability: string;
        featured: boolean; published: boolean;
        brand: { id: string; name: string; slug: string } | null;
        category: { id: string; name: string; slug: string };
      }>;

      const mapped: Product[] = raw.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        images: p.images,
        originCountries: p.originCountries,
        moqHint: p.moqHint ?? "",
        availability: p.availability as Product["availability"],
        featured: p.featured,
        brand: p.brand
          ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug, logo: "", origin: "", description: "" }
          : { id: "", name: "—", slug: "", logo: "", origin: "", description: "" },
        category: {
          id: p.category.id, name: p.category.name, slug: p.category.slug,
          image: "", productCount: 0, description: "",
        },
      }));

      setAllProducts(mapped);
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Client-side filtreleme + arama
  const products = useMemo(() => {
    let result = allProducts;
    if (filters.category !== "all") {
      result = result.filter((p) => p.category.slug === filters.category);
    }
    if (filters.brand !== "all") {
      result = result.filter((p) => p.brand.slug === filters.brand);
    }
    if (filters.availability !== "all") {
      result = result.filter((p) => p.availability === filters.availability);
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.name.toLowerCase().includes(q)
      );
    }
    if (sort === "name_asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name_desc") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }
    return result;
  }, [allProducts, filters, debouncedSearch, sort]);

  const activeFilterCount = [filters.category, filters.brand, filters.availability].filter((v) => v !== "all").length;

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const FilterPanel = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-2">Category</p>
        <div className="space-y-1">
          {[{ slug: "all", name: "All" }, ...categories].map((c) => (
            <button
              key={c.slug}
              onClick={() => { handleFilterChange("category", c.slug); onClose?.(); }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${filters.category === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Brand</p>
        <div className="space-y-1">
          {[{ slug: "all", name: "All" }, ...brands].map((b) => (
            <button
              key={b.slug}
              onClick={() => { handleFilterChange("brand", b.slug); onClose?.(); }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${filters.brand === b.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Availability</p>
        <div className="space-y-1">
          {[
            { value: "all", label: "All" },
            { value: "in_stock", label: "In Stock" },
            { value: "seasonal", label: "Seasonal" },
            { value: "on_request", label: "On Request" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { handleFilterChange("availability", value); onClose?.(); }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${filters.availability === value ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(filters.category !== "all" || filters.brand !== "all" || filters.availability !== "all") && (
        <Button variant="ghost" size="sm" onClick={() => setFilters(defaultFilters)} className="w-full">
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        breadcrumbs={[{ label: "Products" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Toolbar: Search + Sort */}
      <div className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by product name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-xl border-border/50 bg-card pl-10 pr-10 text-sm shadow-sm focus-visible:border-[oklch(0.76_0.11_80)] focus-visible:ring-[oklch(0.76_0.11_80)]/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="h-12 w-44 shrink-0 rounded-xl border-border/50 bg-card text-sm shadow-sm">
            <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="name_asc">Name A → Z</SelectItem>
            <SelectItem value="name_desc">Name Z → A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Chips */}
      {(filters.category !== "all" || filters.brand !== "all" || filters.availability !== "all") && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {filters.category !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.76_0.11_80)]/30 bg-[oklch(0.76_0.11_80)]/10 px-3 py-1 text-xs font-medium text-[oklch(0.62_0.12_75)]">
              {categories.find((c) => c.slug === filters.category)?.name ?? filters.category}
              <button onClick={() => handleFilterChange("category", "all")} className="ml-0.5 hover:text-foreground transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.brand !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.76_0.11_80)]/30 bg-[oklch(0.76_0.11_80)]/10 px-3 py-1 text-xs font-medium text-[oklch(0.62_0.12_75)]">
              {brands.find((b) => b.slug === filters.brand)?.name ?? filters.brand}
              <button onClick={() => handleFilterChange("brand", "all")} className="ml-0.5 hover:text-foreground transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.availability !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.76_0.11_80)]/30 bg-[oklch(0.76_0.11_80)]/10 px-3 py-1 text-xs font-medium text-[oklch(0.62_0.12_75)]">
              {{ in_stock: "In Stock", seasonal: "Seasonal", on_request: "On Request" }[filters.availability] ?? filters.availability}
              <button onClick={() => handleFilterChange("availability", "all")} className="ml-0.5 hover:text-foreground transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => setFilters(defaultFilters)}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-5">
            <FilterPanel onClose={undefined} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 lg:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(0.76_0.11_80)] text-[9px] font-bold text-[oklch(0.12_0.01_60)]">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-80 flex-col">
                <SheetTitle>Filters</SheetTitle>
                <div className="mt-6 flex-1 overflow-y-auto">
                  <FilterPanel onClose={() => setSheetOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Result counter */}
          {!loading && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {products.length === allProducts.length ? (
                  <span><span className="font-medium text-foreground">{products.length}</span> products</span>
                ) : (
                  <span>
                    <span className="font-medium text-foreground">{products.length}</span>
                    <span className="text-muted-foreground"> of {allProducts.length} products</span>
                  </span>
                )}
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border bg-card animate-pulse">
                  {/* Image area */}
                  <div className="h-48 bg-muted" />
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Brand */}
                    <div className="h-3 w-16 rounded bg-muted" />
                    {/* Name lines */}
                    <div className="space-y-1.5">
                      <div className="h-4 w-full rounded bg-muted" />
                      <div className="h-4 w-3/4 rounded bg-muted" />
                    </div>
                    {/* Meta row */}
                    <div className="flex justify-between pt-1">
                      <div className="h-3 w-20 rounded bg-muted" />
                      <div className="h-3 w-12 rounded bg-muted" />
                    </div>
                    {/* Button */}
                    <div className="h-8 w-full rounded-md bg-muted mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              key={`${filters.category}-${filters.brand}-${filters.availability}-${debouncedSearch}-${sort}`}
              className="animate-in fade-in duration-200"
            >
              <ProductGrid
                products={products}
                onClear={() => { setFilters(defaultFilters); setSearch(""); }}
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
