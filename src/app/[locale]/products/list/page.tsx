"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  Tags,
  Building2,
  Globe2,
  Package as PackageIcon,
  Boxes,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  Container,
  FileText,
  Globe,
  BookOpen,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ProductCatalogCard } from "@/components/products/product-catalog-card";
import { ProductB2BCard } from "@/components/products/product-b2b-card";
import { Product } from "@/types";
import { useRFQStore } from "@/stores/rfq-store";
import { CATALOG_PDF } from "@/lib/site-links";

const HERO_BG = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=70";
const PORT_BG = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=70";
const CATALOG_BG = "https://images.unsplash.com/photo-1614777986387-015c2a89b696?auto=format&fit=crop&w=900&q=80";

interface Filters {
  category: string;
  brand: string;
  origin: string;
  packaging: string;
  productType: string;
  exportReadiness: string;
  privateLabel: string;
  moq: string;
  availability: string;
}

const defaultFilters: Filters = {
  category: "all",
  brand: "all",
  origin: "all",
  packaging: "all",
  productType: "all",
  exportReadiness: "all",
  privateLabel: "all",
  moq: "all",
  availability: "all",
};

interface FilterCategory { id: string; name: string; slug: string }
interface FilterBrand { id: string; name: string; slug: string }

const PACKAGING_OPTIONS = [
  { value: "all", labelKey: "options.packaging.all" },
  { value: "carton", labelKey: "options.packaging.carton" },
  { value: "pallet", labelKey: "options.packaging.pallet" },
  { value: "bulk", labelKey: "options.packaging.bulk" },
  { value: "case", labelKey: "options.packaging.case" },
];
const PRODUCT_TYPE_OPTIONS = [
  { value: "all", labelKey: "options.productType.all" },
  { value: "food", labelKey: "options.productType.food" },
  { value: "non_food", labelKey: "options.productType.nonFood" },
  { value: "beverages", labelKey: "options.productType.beverages" },
];
const EXPORT_READY_OPTIONS = [
  { value: "all", labelKey: "options.exportReadiness.all" },
  { value: "ready", labelKey: "options.exportReadiness.ready" },
  { value: "on_request", labelKey: "options.exportReadiness.onRequest" },
];
const PRIVATE_LABEL_OPTIONS = [
  { value: "all", labelKey: "options.privateLabel.all" },
  { value: "available", labelKey: "options.privateLabel.available" },
  { value: "on_request", labelKey: "options.privateLabel.onRequest" },
];
const MOQ_OPTIONS = [
  { value: "all", labelKey: "options.moq.all" },
  { value: "lt100", labelKey: "options.moq.lt100" },
  { value: "100to500", labelKey: "options.moq.between" },
  { value: "gt500", labelKey: "options.moq.gt500" },
];

export default function ProductsListPage() {
  return (
    <Suspense fallback={null}>
      <ProductsListInner />
    </Suspense>
  );
}

function ProductsListInner() {
  const t = useTranslations("productsListPage");
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";
  const initialBrand = searchParams.get("brand") ?? "all";

  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    category: initialCategory,
    brand: initialBrand,
  });
  const [sort, setSort] = useState<"latest" | "name_asc" | "name_desc">("latest");
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [brands, setBrands] = useState<FilterBrand[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showPricesPublicly, setShowPricesPublicly] = useState(false);
  const [groupInfo, setGroupInfo] = useState<{ name: string; discount: number } | null>(null);

  const { openDrawer } = useRFQStore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories ?? []));
    fetch("/api/brands").then((r) => r.json()).then((d) => setBrands(d.brands ?? []));
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const res = await fetch("/api/products?limit=200");
      const data = await res.json();
      const raw = (data.products ?? []) as Array<{
        id: string; name: string; slug: string; images: string[];
        originCountries: string[]; moqHint?: string; availability: string;
        featured: boolean; published: boolean;
        packDescription?: string | null;
        unitWeight?: string | null;
        caseSize?: number | null;
        unitUpc?: string | null;
        caseUpc?: string | null;
        pricingTiers?: Array<{ minQty: number; casePrice?: number; unitPrice?: number }> | null;
        moqQuantity?: number | null;
        moqUnit?: string | null;
        hazmat?: boolean;
        reeferRequired?: boolean;
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
        moqQuantity: p.moqQuantity ?? undefined,
        moqUnit: p.moqUnit ?? undefined,
        hazmat: p.hazmat ?? false,
        reeferRequired: p.reeferRequired ?? false,
        availability: p.availability as Product["availability"],
        featured: p.featured,
        packDescription: p.packDescription ?? undefined,
        unitWeight: p.unitWeight ?? undefined,
        caseSize: p.caseSize ?? undefined,
        unitUpc: p.unitUpc ?? undefined,
        caseUpc: p.caseUpc ?? undefined,
        pricingTiers: p.pricingTiers ?? undefined,
        brand: p.brand
          ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug, logo: "", origin: "", description: "" }
          : { id: "", name: "—", slug: "", logo: "", origin: "", description: "" },
        category: {
          id: p.category.id, name: p.category.name, slug: p.category.slug,
          image: "", productCount: 0, description: "",
        },
      }));

      setAllProducts(mapped);
      setShowPricesPublicly(!!data.showPricesPublicly);
      if (data.groupName && data.groupDiscount > 0) {
        setGroupInfo({ name: data.groupName, discount: data.groupDiscount });
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Derived origin list from product data
  const origins = useMemo(() => {
    const s = new Set<string>();
    allProducts.forEach((p) => p.originCountries.forEach((o) => s.add(o)));
    return Array.from(s).sort();
  }, [allProducts]);

  const products = useMemo(() => {
    let result = allProducts;
    if (filters.category !== "all") result = result.filter((p) => p.category.slug === filters.category);
    if (filters.brand !== "all") result = result.filter((p) => p.brand.slug === filters.brand);
    if (filters.origin !== "all") result = result.filter((p) => p.originCountries.includes(filters.origin));
    if (filters.exportReadiness === "ready") {
      result = result.filter((p) => p.availability === "in_stock" || p.availability === "seasonal");
    } else if (filters.exportReadiness === "on_request") {
      result = result.filter((p) => p.availability === "on_request");
    }
    if (filters.moq === "lt100") result = result.filter((p) => (p.moqQuantity ?? 0) > 0 && (p.moqQuantity ?? 0) < 100);
    if (filters.moq === "100to500") result = result.filter((p) => (p.moqQuantity ?? 0) >= 100 && (p.moqQuantity ?? 0) <= 500);
    if (filters.moq === "gt500") result = result.filter((p) => (p.moqQuantity ?? 0) > 500);
    if (filters.availability !== "all") result = result.filter((p) => p.availability === filters.availability);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.name.toLowerCase().includes(q)
      );
    }
    if (sort === "name_asc") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name_desc") result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [allProducts, filters, debouncedSearch, sort]);

  const featuredImporters = useMemo(
    () => allProducts.filter((p) => p.featured).slice(0, 8),
    [allProducts]
  );

  const activeFilterCount = (Object.keys(filters) as (keyof Filters)[]).filter(
    (k) => filters[k] !== "all"
  ).length;

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setFilters(defaultFilters);
    setSearch("");
    setSort("latest");
  };

  const currentCategory =
    filters.category !== "all"
      ? categories.find((c) => c.slug === filters.category)?.name
      : null;

  return (
    <div className="bg-background">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_BG} alt="" fill priority className="object-cover opacity-35" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.01_60)] via-[oklch(0.14_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/45" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <motion.div
            aria-hidden
            className="absolute right-[10%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[oklch(0.78_0.12_80)]/8 blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-12 sm:px-6 sm:pb-32 sm:pt-16 lg:px-8 lg:pb-36 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="mb-5 flex items-center gap-2 text-xs text-white/55">
              <Link href="/" className="transition-colors hover:text-[oklch(0.78_0.12_80)]">{t("breadcrumb.home")}</Link>
              <span className="text-white/30">/</span>
              <Link href="/products" className="transition-colors hover:text-[oklch(0.78_0.12_80)]">{t("breadcrumb.products")}</Link>
              {currentCategory && (
                <>
                  <span className="text-white/30">/</span>
                  <span className="font-medium text-[oklch(0.78_0.12_80)]">{currentCategory}</span>
                </>
              )}
            </nav>

            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.78_0.12_80)]">
              {t("hero.eyebrow")}
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              {t("hero.titleLine1")}<br />
              <span className="text-[oklch(0.78_0.12_80)]">{t("hero.titleLine2")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
              {t("hero.subtitle")}
            </p>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 56 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-7 h-[3px] rounded-full bg-[oklch(0.78_0.12_80)]"
            />
          </motion.div>
        </div>
      </section>

      {/* ───────── BIG FILTER CARD (raised) ───────── */}
      <section className="relative bg-background">
        <div className="mx-auto -mt-16 max-w-7xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-[oklch(0.72_0.11_80)]/20 bg-white p-5 shadow-[0_24px_60px_-18px_oklch(0.20_0.02_80/0.22)] sm:p-6"
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <CardField label={t("filterCard.searchLabel")}>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("filterCard.searchPlaceholder")}
                    className="h-11 w-full rounded-lg border border-border/70 bg-background pl-3.5 pr-10 text-sm placeholder:text-muted-foreground/60 outline-none transition-all focus:border-[oklch(0.72_0.11_80)] focus:ring-2 focus:ring-[oklch(0.72_0.11_80)]/15"
                  />
                  <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </CardField>

              <CardField label={t("filterCard.categoryLabel")}>
                <SelectBox
                  value={filters.category}
                  onChange={(v) => handleFilterChange("category", v)}
                  options={[{ value: "all", label: t("options.category.all") }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
                />
              </CardField>

              <CardField label={t("filterCard.brandLabel")}>
                <SelectBox
                  value={filters.brand}
                  onChange={(v) => handleFilterChange("brand", v)}
                  options={[{ value: "all", label: t("options.brand.all") }, ...brands.map((b) => ({ value: b.slug, label: b.name }))]}
                />
              </CardField>

              <CardField label={t("filterCard.originLabel")}>
                <SelectBox
                  value={filters.origin}
                  onChange={(v) => handleFilterChange("origin", v)}
                  options={[{ value: "all", label: t("options.origin.all") }, ...origins.map((o) => ({ value: o, label: o }))]}
                />
              </CardField>

              <CardField label={t("filterCard.packagingLabel")}>
                <SelectBox
                  value={filters.packaging}
                  onChange={(v) => handleFilterChange("packaging", v)}
                  options={PACKAGING_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                />
              </CardField>

              <CardField label={t("filterCard.privateLabelLabel")}>
                <SelectBox
                  value={filters.privateLabel}
                  onChange={(v) => handleFilterChange("privateLabel", v)}
                  options={PRIVATE_LABEL_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                />
              </CardField>

              <CardField label={t("filterCard.moqLabel")}>
                <SelectBox
                  value={filters.moq}
                  onChange={(v) => handleFilterChange("moq", v)}
                  options={MOQ_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                />
              </CardField>

              <div className="flex items-end">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => { /* filters already applied live; scroll to results */
                    const el = document.getElementById("catalog-results");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="h-11 w-full bg-[oklch(0.66_0.16_35)] px-6 text-sm font-semibold tracking-wide text-white shadow-md shadow-[oklch(0.66_0.16_35)]/25 transition-all hover:bg-[oklch(0.60_0.17_35)] hover:shadow-lg hover:shadow-[oklch(0.66_0.16_35)]/30"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {t("filterCard.searchButton")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── MAIN: sidebar + results grid ───────── */}
      <section id="catalog-results" className="bg-background pb-20 pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-28 space-y-5">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={clearAll}
                  categories={categories}
                  brands={brands}
                  origins={origins}
                />

                {/* Cant find CTA */}
                <div className="rounded-2xl border border-[oklch(0.72_0.11_80)]/25 bg-[oklch(0.97_0.012_85)] p-5">
                  <p className="text-sm font-semibold text-foreground">{t("sidebarCta.title")}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {t("sidebarCta.description")}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="mt-4 h-9 w-full bg-[oklch(0.66_0.16_35)] text-xs font-semibold text-white hover:bg-[oklch(0.60_0.17_35)]"
                  >
                    <Link href="/contact">
                      {t("sidebarCta.button")}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Listing */}
            <div className="flex-1 min-w-0">
              {/* Group discount banner */}
              {groupInfo && (
                <div className="mb-5 rounded-xl border border-[oklch(0.72_0.11_80)]/30 bg-[oklch(0.72_0.11_80)]/8 px-4 py-3 text-sm">
                  <span className="font-semibold text-[oklch(0.50_0.12_75)]">{groupInfo.name}</span>
                  <span className="text-foreground/80">
                    {" "}— {t("groupBanner.discountApplied", { discount: groupInfo.discount })}
                  </span>
                </div>
              )}

              {/* Results header */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Mobile filter trigger */}
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="relative h-10 border-[oklch(0.72_0.11_80)]/40 px-4 text-sm font-medium text-[oklch(0.50_0.12_75)] hover:bg-[oklch(0.72_0.11_80)]/10 lg:hidden"
                      >
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        {t("results.filtersButton")}
                        {activeFilterCount > 0 && (
                          <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[oklch(0.72_0.11_80)] px-1 text-[10px] font-bold text-[oklch(0.20_0.02_80)]">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex w-80 flex-col">
                      <SheetTitle>{t("results.sheetTitle")}</SheetTitle>
                      <div className="mt-6 flex-1 overflow-y-auto pr-1">
                        <FilterSidebar
                          filters={filters}
                          onChange={handleFilterChange}
                          onReset={clearAll}
                          categories={categories}
                          brands={brands}
                          origins={origins}
                          compact
                          onAfterChange={() => setSheetOpen(false)}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {!loading && (
                    <p className="text-sm text-muted-foreground">
                      {t("results.showing")}{" "}
                      <span className="font-semibold text-foreground">{products.length}</span>
                      {products.length !== allProducts.length && (
                        <>
                          {" "}{t("results.of")}{" "}
                          <span className="font-semibold text-foreground">{allProducts.length}</span>
                        </>
                      )}
                      {" "}{t("results.products")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <div className="relative">
                    <span className="pointer-events-none absolute -top-4 left-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {t("results.sortBy")}
                    </span>
                    <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as typeof sort)}
                      className="h-10 cursor-pointer appearance-none rounded-lg border border-border/70 bg-background pl-9 pr-9 text-sm text-foreground/85 outline-none transition-all focus:border-[oklch(0.72_0.11_80)] focus:ring-2 focus:ring-[oklch(0.72_0.11_80)]/15"
                    >
                      <option value="latest">{t("sort.latest")}</option>
                      <option value="name_asc">{t("sort.nameAsc")}</option>
                      <option value="name_desc">{t("sort.nameDesc")}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  {/* View toggle */}
                  <div className="inline-flex overflow-hidden rounded-lg border border-border/70">
                    <button
                      type="button"
                      onClick={() => setView("grid")}
                      aria-label={t("results.gridView")}
                      className={`flex h-10 w-10 items-center justify-center text-sm transition-colors ${
                        view === "grid"
                          ? "bg-[oklch(0.78_0.12_80)]/20 text-[oklch(0.40_0.10_75)]"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      aria-label={t("results.listView")}
                      className={`flex h-10 w-10 items-center justify-center border-l border-border/70 text-sm transition-colors ${
                        view === "list"
                          ? "bg-[oklch(0.78_0.12_80)]/20 text-[oklch(0.40_0.10_75)]"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading */}
              {loading ? (
                <div className={view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "space-y-3"}>
                  {Array.from({ length: view === "grid" ? 8 : 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={view === "grid"
                        ? "animate-pulse rounded-2xl border border-border/60 bg-card"
                        : "grid animate-pulse grid-cols-[140px_1fr_220px] gap-5 rounded-2xl border bg-card p-5"}
                    >
                      {view === "grid" ? (
                        <>
                          <div className="aspect-[4/3] w-full rounded-t-2xl bg-muted" />
                          <div className="space-y-2.5 p-4">
                            <div className="h-4 w-3/4 rounded bg-muted" />
                            <div className="h-3 w-1/2 rounded bg-muted" />
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <div className="h-8 rounded bg-muted" />
                              <div className="h-8 rounded bg-muted" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="h-36 w-36 rounded-xl bg-muted" />
                          <div className="space-y-3">
                            <div className="h-5 w-3/4 rounded bg-muted" />
                            <div className="h-16 w-full rounded bg-muted" />
                            <div className="h-12 w-full rounded bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-9 w-full rounded bg-muted" />
                            <div className="h-9 w-full rounded bg-muted" />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Search className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{t("empty.title")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("empty.description")}
                  </p>
                  <Button variant="outline" size="sm" onClick={clearAll} className="mt-4">
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    {t("empty.clearFilters")}
                  </Button>
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {products.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                    >
                      <ProductCatalogCard product={p} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((p) => (
                    <ProductB2BCard key={p.id} product={p} showPricesPublicly={showPricesPublicly} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FEATURED PRODUCTS FOR IMPORTERS ───────── */}
      {featuredImporters.length > 0 && (
        <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] py-14 text-white sm:py-16">
          <div className="absolute inset-0 z-0 opacity-25">
            <Image src={PORT_BG} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.01_60)] via-[oklch(0.14_0.02_80)]/90 to-[oklch(0.12_0.01_60)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex w-fit items-center gap-2">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-[oklch(0.78_0.12_80)]/70" />
                <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.78_0.12_80)]" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-[oklch(0.78_0.12_80)]/70" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight sm:text-3xl">
                {t("featured.heading")}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {featuredImporters.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Link
                    href={`/products/${p.slug}`}
                    className="group block overflow-hidden rounded-xl bg-[oklch(0.20_0.02_80)] ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-[oklch(0.78_0.12_80)]/40"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-[oklch(0.96_0.005_85)]">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 16vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PackageIcon className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute left-2 top-2">
                        <span className="rounded-md bg-[oklch(0.78_0.12_80)] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[oklch(0.18_0.02_80)]">
                          {t("featured.topSeller")}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 text-[12.5px] font-semibold leading-snug text-white">
                        {p.name}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-[10.5px] text-white/55">
                        {p.category.name}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── BULK ORDERS / DOCS / MARKETS ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] py-14 text-white sm:py-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src={PORT_BG} alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.01_60)] via-[oklch(0.14_0.02_80)]/90 to-[oklch(0.12_0.01_60)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {t("bulk.titleStart")} <span className="text-[oklch(0.78_0.12_80)]">{t("bulk.titleHighlight")}</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                {t("bulk.subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <BulkFeature
                icon={Container}
                title={t("bulk.items.mixedContainer.title")}
                desc={t("bulk.items.mixedContainer.desc")}
              />
              <BulkFeature
                icon={FileText}
                title={t("bulk.items.exportDocs.title")}
                desc={t("bulk.items.exportDocs.desc")}
              />
              <BulkFeature
                icon={Globe}
                title={t("bulk.items.marketSelection.title")}
                desc={t("bulk.items.marketSelection.desc")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── NEED THE FULL CATALOG CTA ───────── */}
      <section className="relative bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-3xl border border-[oklch(0.72_0.11_80)]/25 bg-gradient-to-br from-[oklch(0.97_0.01_85)] to-[oklch(0.94_0.018_85)] p-6 sm:p-10"
          >
            <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
              <div className="relative hidden h-32 w-28 shrink-0 lg:block">
                <div className="absolute inset-0 rounded-xl bg-[oklch(0.14_0.02_80)] shadow-xl shadow-black/20">
                  <Image
                    src={CATALOG_BG}
                    alt=""
                    fill
                    className="rounded-xl object-cover opacity-70"
                    sizes="120px"
                  />
                  <div className="absolute inset-x-0 bottom-2 text-center">
                    <BookOpen className="mx-auto h-4 w-4 text-[oklch(0.78_0.12_80)]" />
                    <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-white">
                      Marassi
                    </p>
                    <p className="text-[7px] font-medium tracking-wider text-[oklch(0.78_0.12_80)]">
                      {t("catalogCta.cardLabel")}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("catalogCta.title")}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t("catalogCta.description")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  size="lg"
                  className="h-12 whitespace-nowrap bg-[oklch(0.66_0.16_35)] px-6 text-sm font-semibold text-white shadow-md shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
                >
                  <a href={CATALOG_PDF} download>
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t("catalogCta.downloadButton")}
                  </a>
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => openDrawer("list")}
                  className="h-12 whitespace-nowrap border-[oklch(0.72_0.11_80)]/40 bg-transparent px-6 text-sm font-semibold text-[oklch(0.40_0.10_75)] hover:bg-[oklch(0.78_0.12_80)]/10"
                >
                  <Headphones className="mr-2 h-4 w-4" />
                  {t("catalogCta.requestListButton")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────── PIECES ──────────────────────────── */

function CardField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/65">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-border/70 bg-background px-3.5 pr-10 text-sm text-foreground/80 outline-none transition-all focus:border-[oklch(0.72_0.11_80)] focus:ring-2 focus:ring-[oklch(0.72_0.11_80)]/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function FilterSidebar({
  filters,
  onChange,
  onReset,
  categories,
  brands,
  origins,
  compact,
  onAfterChange,
}: {
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
  categories: FilterCategory[];
  brands: FilterBrand[];
  origins: string[];
  compact?: boolean;
  onAfterChange?: () => void;
}) {
  const t = useTranslations("productsListPage");
  return (
    <div className={compact ? "" : "rounded-2xl border border-border/70 bg-card shadow-sm"}>
      {!compact && (
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
            {t("sidebar.title")}
          </p>
          <button
            onClick={onReset}
            className="text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.66_0.16_35)] transition-colors hover:text-[oklch(0.55_0.17_35)]"
          >
            {t("sidebar.resetAll")}
          </button>
        </div>
      )}

      <div className={compact ? "space-y-2" : "divide-y divide-border/60"}>
        <SidebarSection
          icon={Tags}
          label={t("sidebar.sections.categories")}
          value={
            filters.category === "all"
              ? t("options.category.all")
              : categories.find((c) => c.slug === filters.category)?.name ?? t("options.category.all")
          }
          options={[{ value: "all", label: t("options.category.all") }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
          selected={filters.category}
          onSelect={(v) => { onChange("category", v); onAfterChange?.(); }}
          compact={compact}
        />
        <SidebarSection
          icon={BadgeCheck}
          label={t("sidebar.sections.brand")}
          value={
            filters.brand === "all"
              ? t("options.brand.all")
              : brands.find((b) => b.slug === filters.brand)?.name ?? t("options.brand.all")
          }
          options={[{ value: "all", label: t("options.brand.all") }, ...brands.map((b) => ({ value: b.slug, label: b.name }))]}
          selected={filters.brand}
          onSelect={(v) => { onChange("brand", v); onAfterChange?.(); }}
          compact={compact}
        />
        <SidebarSection
          icon={Globe2}
          label={t("sidebar.sections.origin")}
          value={filters.origin === "all" ? t("options.origin.all") : filters.origin}
          options={[{ value: "all", label: t("options.origin.all") }, ...origins.map((o) => ({ value: o, label: o }))]}
          selected={filters.origin}
          onSelect={(v) => { onChange("origin", v); onAfterChange?.(); }}
          compact={compact}
        />
        <SidebarSection
          icon={PackageIcon}
          label={t("sidebar.sections.packaging")}
          value={t(PACKAGING_OPTIONS.find((o) => o.value === filters.packaging)?.labelKey ?? "options.packaging.all")}
          options={PACKAGING_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          selected={filters.packaging}
          onSelect={(v) => { onChange("packaging", v); onAfterChange?.(); }}
          compact={compact}
        />
        <SidebarSection
          icon={Boxes}
          label={t("sidebar.sections.productType")}
          value={t(PRODUCT_TYPE_OPTIONS.find((o) => o.value === filters.productType)?.labelKey ?? "options.productType.all")}
          options={PRODUCT_TYPE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          selected={filters.productType}
          onSelect={(v) => { onChange("productType", v); onAfterChange?.(); }}
          compact={compact}
        />
        <SidebarSection
          icon={ShieldCheck}
          label={t("sidebar.sections.exportReadiness")}
          value={t(EXPORT_READY_OPTIONS.find((o) => o.value === filters.exportReadiness)?.labelKey ?? "options.exportReadiness.all")}
          options={EXPORT_READY_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          selected={filters.exportReadiness}
          onSelect={(v) => { onChange("exportReadiness", v); onAfterChange?.(); }}
          compact={compact}
        />
        <SidebarSection
          icon={Building2}
          label={t("sidebar.sections.privateLabel")}
          value={t(PRIVATE_LABEL_OPTIONS.find((o) => o.value === filters.privateLabel)?.labelKey ?? "options.privateLabel.all")}
          options={PRIVATE_LABEL_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          selected={filters.privateLabel}
          onSelect={(v) => { onChange("privateLabel", v); onAfterChange?.(); }}
          compact={compact}
        />
      </div>

      {compact && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="mt-4 w-full border-[oklch(0.72_0.11_80)]/40 text-[oklch(0.50_0.12_75)] hover:bg-[oklch(0.72_0.11_80)]/10"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          {t("sidebar.resetAllFilters")}
        </Button>
      )}
    </div>
  );
}

function SidebarSection({
  icon: Icon,
  label,
  value,
  options,
  selected,
  onSelect,
  compact,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (v: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={compact ? "rounded-xl border border-border/60" : ""}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.50_0.12_75)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/20">
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/85">{label}</p>
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{value}</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="max-h-56 space-y-0.5 overflow-y-auto px-3 pb-4 pt-1">
              {options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => onSelect(o.value)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                    selected === o.value
                      ? "bg-[oklch(0.78_0.12_80)]/15 font-semibold text-[oklch(0.40_0.10_75)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/35"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BulkFeature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-[oklch(0.78_0.12_80)]/40 hover:bg-white/[0.05]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.82_0.11_80)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/25">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-white/65">{desc}</p>
    </motion.div>
  );
}
