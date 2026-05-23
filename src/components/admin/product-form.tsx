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
import { RichTextEditor } from "./rich-text-editor";

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
  sku: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  storage: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  newBrandName: z.string().optional(),
  originCountries: z.array(z.string()).optional(),
  moqHint: z.string().optional(),
  availability: z.string(),
  // Packaging
  packDescription: z.string().optional(),
  unitWeight: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  caseSize: z.union([z.number(), z.nan()]).optional(),
  unitUpc: z.string().optional(),
  caseUpc: z.string().optional(),
  // Logistics
  moqQuantity: z.union([z.number(), z.nan()]).optional(),
  moqUnit: z.string().optional(),
  hazmat: z.boolean().optional(),
  reeferRequired: z.boolean().optional(),
  cartonDetails: z.string().optional(),
  loadingInfo: z.string().optional(),
  exportSuitability: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]),
  order: z.number(),
});

type FormData = z.infer<typeof schema>;

interface Category { id: string; name: string }
interface Brand { id: string; name: string }
interface UploadedImage { url: string; publicId: string }

interface PricingTier {
  minQty: number | "";
  casePrice: number | "";
  unitPrice: number | "";
}

interface NutritionRow {
  label: string;
  value: string;
  per: string;
}

interface ProductFormProps {
  productId?: string;
  defaultValues?: Partial<FormData & {
    images: UploadedImage[];
    pricingTiers: PricingTier[];
    longDescription: string;
    allergens: string[];
    nutrition: NutritionRow[];
    variants: string[];
    imageAlts: string[];
    relatedProductIds: string[];
  }>;
}

export function ProductForm({ productId, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<UploadedImage[]>(defaultValues?.images ?? []);
  const [tiers, setTiers] = useState<PricingTier[]>(
    defaultValues?.pricingTiers && defaultValues.pricingTiers.length > 0
      ? defaultValues.pricingTiers
      : [{ minQty: 10, casePrice: "", unitPrice: "" }]
  );
  const [longDescription, setLongDescription] = useState<string>(
    defaultValues?.longDescription ?? ""
  );
  const [allergens, setAllergens] = useState<string[]>(defaultValues?.allergens ?? []);
  const [allergenInput, setAllergenInput] = useState("");
  const [nutrition, setNutrition] = useState<NutritionRow[]>(
    defaultValues?.nutrition && defaultValues.nutrition.length > 0
      ? defaultValues.nutrition
      : []
  );
  const [variants, setVariants] = useState<string[]>(defaultValues?.variants ?? []);
  const [variantInput, setVariantInput] = useState("");
  const [imageAlts, setImageAlts] = useState<string[]>(defaultValues?.imageAlts ?? []);
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
      status: "PUBLISHED",
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

    const cleanedTiers = tiers
      .filter((t) => t.minQty !== "" && (t.casePrice !== "" || t.unitPrice !== ""))
      .map((t) => ({
        minQty: Number(t.minQty),
        ...(t.casePrice !== "" ? { casePrice: Number(t.casePrice) } : {}),
        ...(t.unitPrice !== "" ? { unitPrice: Number(t.unitPrice) } : {}),
      }))
      .sort((a, b) => a.minQty - b.minQty);

    const cleanedNutrition = nutrition
      .filter((n) => n.label.trim() !== "" && n.value.trim() !== "")
      .map((n) => ({
        label: n.label.trim(),
        value: n.value.trim(),
        ...(n.per?.trim() ? { per: n.per.trim() } : {}),
      }));

    const payload = {
      ...data,
      originCountries: data.originCountries ?? [],
      images: images.map((i) => i.url),
      imagePublicIds: images.map((i) => i.publicId),
      imageAlts: imageAlts.slice(0, images.length),
      brandId: finalBrandId,
      newBrandName: undefined,
      pricingTiers: cleanedTiers.length > 0 ? cleanedTiers : null,
      longDescription: longDescription || null,
      allergens,
      nutrition: cleanedNutrition.length > 0 ? cleanedNutrition : null,
      variants,
      // Keep legacy boolean in sync with status
      published: data.status !== "DRAFT",
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

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" {...register("slug")} placeholder="nutella-750g" />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">Internal SKU</Label>
                <Input id="sku" {...register("sku")} placeholder="NTL-750-CL01" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea id="description" {...register("description")} rows={3} placeholder="One- or two-sentence summary used in listings and meta tags." />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Detailed Description</h3>
            <p className="text-xs text-muted-foreground">
              Rich content shown on the product detail page. Use headings, lists, and links to tell a longer story.
            </p>
            <RichTextEditor
              value={longDescription}
              onChange={setLongDescription}
              placeholder="Write a longer product story, key features, brand history…"
            />
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Ingredients & Compliance</h3>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                {...register("ingredients")}
                rows={3}
                placeholder="e.g. Whole grain wheat, sugar, cinnamon, salt, BHT for freshness."
              />
              <p className="text-xs text-muted-foreground">Comma-separated, in descending order by weight.</p>
            </div>

            <div className="space-y-2">
              <Label>Allergens</Label>
              <div className="flex flex-wrap gap-1.5">
                {allergens.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => setAllergens((prev) => prev.filter((x) => x !== a))}
                      className="hover:text-amber-900"
                      aria-label={`Remove ${a}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const v = allergenInput.trim().replace(/,$/, "");
                    if (v && !allergens.includes(v)) {
                      setAllergens((prev) => [...prev, v]);
                    }
                    setAllergenInput("");
                  } else if (e.key === "Backspace" && !allergenInput && allergens.length > 0) {
                    setAllergens((prev) => prev.slice(0, -1));
                  }
                }}
                placeholder="Type and press Enter (e.g. Wheat, Milk, Soy)"
              />
              <p className="text-xs text-muted-foreground">
                Common allergens: Wheat, Milk, Eggs, Peanuts, Tree Nuts, Soy, Fish, Shellfish, Sesame.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage">Storage Instructions</Label>
              <Textarea
                id="storage"
                {...register("storage")}
                rows={2}
                placeholder="e.g. Store in a cool, dry place. Refrigerate after opening."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nutrition Facts</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Per 100g or per serving. Leave blank to skip.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNutrition((prev) => [...prev, { label: "", value: "", per: "100g" }])
                  }
                  className="text-xs font-medium text-primary hover:underline"
                >
                  + Add row
                </button>
              </div>

              {nutrition.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    <span>Nutrient</span>
                    <span>Value</span>
                    <span>Per</span>
                    <span />
                  </div>
                  {nutrition.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_80px_auto] gap-2">
                      <Input
                        placeholder="Energy"
                        value={row.label}
                        onChange={(e) =>
                          setNutrition((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, label: e.target.value } : r))
                          )
                        }
                      />
                      <Input
                        placeholder="350 kcal"
                        value={row.value}
                        onChange={(e) =>
                          setNutrition((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, value: e.target.value } : r))
                          )
                        }
                      />
                      <Input
                        placeholder="100g"
                        value={row.per}
                        onChange={(e) =>
                          setNutrition((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, per: e.target.value } : r))
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNutrition((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove row"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Packaging & Identifiers</h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="packDescription">Pack Description</Label>
                <Input
                  id="packDescription"
                  {...register("packDescription")}
                  placeholder="e.g. 12 / 11 OZ"
                />
                <p className="text-xs text-muted-foreground">Shown on product card (e.g. &quot;12 / 11 OZ&quot;)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseSize">Units per Case</Label>
                <Input
                  id="caseSize"
                  type="number"
                  min="1"
                  {...register("caseSize", { valueAsNumber: true })}
                  placeholder="12"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unitWeight">Unit Weight / Volume</Label>
                <Input
                  id="unitWeight"
                  {...register("unitWeight")}
                  placeholder="e.g. 11 OZ (305.61 g)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Net Weight</Label>
                <Input
                  id="weight"
                  {...register("weight")}
                  placeholder="e.g. 350 g"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Carton Dimensions</Label>
              <Input
                id="dimensions"
                {...register("dimensions")}
                placeholder="e.g. 30 × 20 × 15 cm"
              />
            </div>

            <div className="space-y-2">
              <Label>Variants / Available Sizes</Label>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                  >
                    {v}
                    <button
                      type="button"
                      onClick={() => setVariants((prev) => prev.filter((x) => x !== v))}
                      className="hover:text-destructive"
                      aria-label={`Remove ${v}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const v = variantInput.trim().replace(/,$/, "");
                    if (v && !variants.includes(v)) {
                      setVariants((prev) => [...prev, v]);
                    }
                    setVariantInput("");
                  } else if (e.key === "Backspace" && !variantInput && variants.length > 0) {
                    setVariants((prev) => prev.slice(0, -1));
                  }
                }}
                placeholder="Type and press Enter (e.g. 250ml, 500ml, 1L)"
              />
              <p className="text-xs text-muted-foreground">
                Optional. Useful when the same product comes in multiple sizes or formats.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unitUpc">Unit UPC</Label>
                <Input id="unitUpc" {...register("unitUpc")} placeholder="84912-47577" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseUpc">Case UPC</Label>
                <Input id="caseUpc" {...register("caseUpc")} placeholder="84912-47577" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Logistics</h3>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="moqQuantity">MOQ Quantity</Label>
                <Input
                  id="moqQuantity"
                  type="number"
                  min="1"
                  {...register("moqQuantity", { valueAsNumber: true })}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="moqUnit">MOQ Unit</Label>
                <select
                  id="moqUnit"
                  {...register("moqUnit")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  <option value="cases">cases</option>
                  <option value="pallets">pallets</option>
                  <option value="containers">containers</option>
                  <option value="units">units</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="moqHint">MOQ Display Hint</Label>
                <Input id="moqHint" {...register("moqHint")} placeholder="1 pallet / 100 cases" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Quantity is the numeric minimum; hint is the human-readable fallback on listings.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-2 rounded-lg border p-3 hover:bg-muted/30">
                <input
                  type="checkbox"
                  {...register("hazmat")}
                  className="mt-0.5 h-4 w-4 rounded border-input"
                />
                <div>
                  <p className="text-sm font-medium">Hazmat</p>
                  <p className="text-xs text-muted-foreground">
                    Hazardous material — additional shipping fees apply.
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-2 rounded-lg border p-3 hover:bg-muted/30">
                <input
                  type="checkbox"
                  {...register("reeferRequired")}
                  className="mt-0.5 h-4 w-4 rounded border-input"
                />
                <div>
                  <p className="text-sm font-medium">Reefer required</p>
                  <p className="text-xs text-muted-foreground">
                    Needs refrigerated container — pallets mandatory.
                  </p>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cartonDetails">Carton Details</Label>
              <Textarea
                id="cartonDetails"
                rows={2}
                {...register("cartonDetails")}
                placeholder="e.g. Inner: 12 units / outer: 4 cartons per layer / 80 cartons per pallet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loadingInfo">Loading Information</Label>
              <Textarea
                id="loadingInfo"
                rows={2}
                {...register("loadingInfo")}
                placeholder="e.g. 20 pallets in a 20ft, 42 pallets in a 40ft. Hand-stacking option available."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exportSuitability">Export Suitability</Label>
              <Textarea
                id="exportSuitability"
                rows={2}
                {...register("exportSuitability")}
                placeholder="e.g. Halal certified · Arabic + English packaging available · Long shelf life suitable for sea freight"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Pricing Tiers</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quantity breaks. e.g. 10+ cases = $45/case, 40+ cases = $42/case
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTiers((prev) => [...prev, { minQty: "", casePrice: "", unitPrice: "" }])
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                + Add tier
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>Min Qty (cases)</span>
                <span>Case Price</span>
                <span>Unit Price</span>
                <span />
              </div>
              {tiers.map((tier, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={tier.minQty}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);
                      setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, minQty: v } : t)));
                    }}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="45.00"
                    value={tier.casePrice}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);
                      setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, casePrice: v } : t)));
                    }}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="3.75"
                    value={tier.unitPrice}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);
                      setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, unitPrice: v } : t)));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setTiers((prev) => prev.filter((_, i) => i !== idx))}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Remove tier"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Tip: case price = price for one full case at this volume. Unit price = derived per-piece price (optional).
              Prices are hidden on the public site unless &quot;Show prices publicly&quot; is enabled in Settings.
            </p>
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

            <div className="space-y-2">
              <Label htmlFor="status">Visibility</Label>
              <select
                id="status"
                {...register("status")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="DRAFT">Draft (not visible)</option>
                <option value="PUBLISHED">Published (live)</option>
                <option value="HIDDEN">Hidden (URL works, not indexed)</option>
              </select>
            </div>

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
