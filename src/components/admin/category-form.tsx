"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./image-uploader";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  parentId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  featured: z.boolean(),
  order: z.number(),
});

type FormData = z.infer<typeof schema>;
interface UploadedImage { url: string; publicId: string }
interface CategoryOption { id: string; name: string; parentId: string | null }

interface CategoryFormProps {
  categoryId?: string;
  defaultValues?: Partial<FormData & { image: UploadedImage | null }>;
}

export function CategoryForm({ categoryId, defaultValues }: CategoryFormProps) {
  const router = useRouter();
  const [image, setImage] = useState<UploadedImage[]>(
    defaultValues?.image ? [defaultValues.image] : []
  );
  const [parentOptions, setParentOptions] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        const all = (d.categories ?? []) as CategoryOption[];
        // Top-level categories only (parents). Exclude self to prevent cycle.
        setParentOptions(
          all.filter((c) => !c.parentId && c.id !== categoryId)
        );
      })
      .catch(() => {});
  }, [categoryId]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", featured: false, order: 0, ...defaultValues },
  });

  const nameValue = watch("name");
  // Auto-slug
  const handleNameBlur = () => {
    if (!categoryId && nameValue) {
      setValue("slug", nameValue.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60));
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");

    const payload = {
      ...data,
      parentId: data.parentId || null,
      image: image[0]?.url ?? null,
      imagePublicId: image[0]?.publicId ?? null,
    };

    try {
      const res = await fetch(
        categoryId ? `/api/admin/categories/${categoryId}` : "/api/admin/categories",
        {
          method: categoryId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Category Info</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} onBlur={handleNameBlur} placeholder="e.g. Dairy Products" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} placeholder="dairy-products" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={3} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentId">Parent Category (optional)</Label>
          <select
            id="parentId"
            {...register("parentId")}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">— None (top-level category) —</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Select a parent to make this a subcategory. Leave empty for a top-level category.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="order">Sort Order</Label>
            <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("featured")} className="rounded" />
              <span className="text-sm">Featured on homepage</span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Category Image</h3>
        <ImageUploader value={image} onChange={setImage} folder="categories" maxFiles={1} />
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">SEO</h3>
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDesc">SEO Description</Label>
          <Textarea id="seoDesc" {...register("seoDesc")} rows={2} />
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" />
        {categoryId ? "Save Changes" : "Create Category"}
      </Button>
    </form>
  );
}
