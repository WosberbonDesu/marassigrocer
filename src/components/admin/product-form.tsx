"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ChevronDown, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./image-uploader";

const COUNTRIES = [
  "Turkey", "Egypt", "Germany", "Italy", "France", "Spain", "Netherlands",
  "Belgium", "Poland", "Greece", "Morocco", "Tunisia", "Lebanon", "Jordan",
  "Saudi Arabia", "UAE", "India", "China", "Thailand", "Indonesia", "Malaysia",
  "Brazil", "Argentina", "Colombia", "USA", "UK", "Switzerland", "Austria",
  "Czech Republic", "Romania", "Bulgaria", "Serbia", "Ukraine", "Russia",
  "South Korea", "Japan", "Vietnam", "Philippines", "Pakistan", "Iran",
  "Iraq", "Syria", "Libya", "Algeria", "Sudan", "Nigeria", "Kenya",
  "South Africa", "Ghana", "Ivory Coast",
];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  newBrandName: z.string().optional(),
  originCountries: z.array(z.string()).optional(),
  moqHint: z.string().optional(),
  availability: z.string(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  order: z.number(),
});

type FormData = z.infer<typeof schema>;

interface Category { id: string; name: string }
interface Brand { id: string; name: string }
interface UploadedImage { url: string; publicId: string }

interface ProductFormProps {
  productId?: string;
  defaultValues?: Partial<FormData & { images: UploadedImage[] }>;
}

export function ProductForm({ productId, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<UploadedImage[]>(defaultValues?.images ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Origin countries state
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    (defaultValues?.originCountries as unknown as string[]) ?? []
  );
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  // Brand combobox state
  const [brandSearch, setBrandSearch] = useState("");
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(defaultValues?.brandId ?? "");
  const [newBrandMode, setNewBrandMode] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      availability: "in_stock",
      featured: false,
      published: true,
      order: 0,
      ...defaultValues,
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories ?? []));
    fetch("/api/admin/brands").then((r) => r.json()).then((d) => setBrands(d.brands ?? []));
  }, []);

  // Auto-generate slug from name (only when creating)
  useEffect(() => {
    if (!productId && nameValue) {
      setValue(
        "slug",
        nameValue
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 60)
      );
    }
  }, [nameValue, productId, setValue]);

  // Sync selectedCountries to form
  useEffect(() => {
    setValue("originCountries", selectedCountries);
  }, [selectedCountries, setValue]);

  // Sync brand selection to form
  useEffect(() => {
    setValue("brandId", newBrandMode ? "" : selectedBrandId);
    setValue("newBrandName", newBrandMode ? brandSearch : undefined);
  }, [selectedBrandId, newBrandMode, brandSearch, setValue]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const selectedBrandName = brands.find((b) => b.id === selectedBrandId)?.name ?? "";

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");

    // If new brand mode, create brand first
    let finalBrandId = data.brandId || undefined;
    if (newBrandMode && brandSearch.trim()) {
      try {
        const brandSlug = brandSearch.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
        const brandRes = await fetch("/api/admin/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: brandSearch.trim(), slug: brandSlug }),
        });
        if (brandRes.ok) {
          const { brand } = await brandRes.json();
          finalBrandId = brand.id;
        } else {
          throw new Error("Failed to create brand");
        }
      } catch {
        setError("Failed to create new brand");
        setSaving(false);
        return;
      }
    }

    const payload = {
      ...data,
      originCountries: data.originCountries ?? [],
      images: images.map((i) => i.url),
      imagePublicIds: images.map((i) => i.publicId),
      brandId: finalBrandId,
      newBrandName: undefined,
    };

    try {
      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Basic Info</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" {...register("name")} placeholder="e.g. Nutella 750g" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register("slug")} placeholder="nutella-750g" />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} rows={4} placeholder="Product description..." />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Images</h3>
            <ImageUploader
              value={images}
              onChange={setImages}
              folder="products"
              maxFiles={6}
            />
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">SEO</h3>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input id="seoTitle" {...register("seoTitle")} placeholder="Optional — overrides default title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDesc">SEO Description</Label>
              <Textarea id="seoDesc" {...register("seoDesc")} rows={2} placeholder="Max 160 characters" />
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-5">
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Status</h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("published")} className="rounded" />
              <span className="text-sm">Published</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("featured")} className="rounded" />
              <span className="text-sm">Featured</span>
            </label>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <select
                id="availability"
                {...register("availability")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="in_stock">In Stock</option>
                <option value="seasonal">Seasonal</option>
                <option value="on_request">On Request</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Sort Order</Label>
              <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Classification</h3>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                {...register("categoryId")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            {/* Brand combobox */}
            <div className="space-y-2" ref={brandRef}>
              <Label>Brand</Label>
              <div className="relative">
                <div
                  className="flex items-center w-full rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer"
                  onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                >
                  <span className="flex-1 truncate">
                    {newBrandMode
                      ? `New: ${brandSearch}`
                      : selectedBrandName || "Select brand..."}
                  </span>
                  {(selectedBrandId || newBrandMode) && (
                    <button
                      type="button"
                      className="mr-1 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBrandId("");
                        setNewBrandMode(false);
                        setBrandSearch("");
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
                {brandDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
                    <div className="p-2">
                      <Input
                        placeholder="Search or type new brand..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto px-1 pb-1">
                      {filteredBrands.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                          onClick={() => {
                            setSelectedBrandId(b.id);
                            setNewBrandMode(false);
                            setBrandSearch("");
                            setBrandDropdownOpen(false);
                          }}
                        >
                          {selectedBrandId === b.id && <Check className="h-3.5 w-3.5" />}
                          <span className={selectedBrandId === b.id ? "font-medium" : ""}>{b.name}</span>
                        </button>
                      ))}
                      {brandSearch.trim() && !brands.some((b) => b.name.toLowerCase() === brandSearch.trim().toLowerCase()) && (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-accent font-medium"
                          onClick={() => {
                            setNewBrandMode(true);
                            setSelectedBrandId("");
                            setBrandDropdownOpen(false);
                          }}
                        >
                          + Create &quot;{brandSearch.trim()}&quot;
                        </button>
                      )}
                      {filteredBrands.length === 0 && !brandSearch.trim() && (
                        <p className="px-2 py-1.5 text-sm text-muted-foreground">No brands found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Origin Countries multi-select */}
            <div className="space-y-2" ref={countryRef}>
              <Label>Origin Countries</Label>
              <div className="relative">
                <div
                  className="flex items-center w-full rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer min-h-[38px]"
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                >
                  <span className="flex-1 text-muted-foreground">
                    {selectedCountries.length
                      ? `${selectedCountries.length} selected`
                      : "Select countries..."}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
                {countryDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
                    <div className="p-2">
                      <Input
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto px-1 pb-1">
                      {filteredCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                          onClick={() => toggleCountry(country)}
                        >
                          <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selectedCountries.includes(country)
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-input"
                          }`}>
                            {selectedCountries.includes(country) && <Check className="h-3 w-3" />}
                          </div>
                          {country}
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <p className="px-2 py-1.5 text-sm text-muted-foreground">No countries found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Selected countries displayed vertically */}
              {selectedCountries.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  {selectedCountries.map((country) => (
                    <div
                      key={country}
                      className="flex items-center justify-between rounded-md bg-muted px-2.5 py-1.5 text-sm"
                    >
                      <span>{country}</span>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toggleCountry(country)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moqHint">MOQ Hint</Label>
              <Input id="moqHint" {...register("moqHint")} placeholder="e.g. 1 pallet / 100 cases" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {productId ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
