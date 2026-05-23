"use client";

import { useState } from "react";
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
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  origin: z.string().optional(),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
interface UploadedImage { url: string; publicId: string }

interface BrandFormProps {
  brandId?: string;
  defaultValues?: Partial<FormData & { logo: UploadedImage | null }>;
}

export function BrandForm({ brandId, defaultValues }: BrandFormProps) {
  const router = useRouter();
  const [logo, setLogo] = useState<UploadedImage[]>(
    defaultValues?.logo ? [defaultValues.logo] : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", ...defaultValues },
  });

  const nameValue = watch("name");
  const handleNameBlur = () => {
    if (!brandId && nameValue) {
      setValue("slug", nameValue.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60));
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");

    const payload = {
      ...data,
      logo: logo[0]?.url ?? null,
      logoPublicId: logo[0]?.publicId ?? null,
    };

    try {
      const res = await fetch(
        brandId ? `/api/admin/brands/${brandId}` : "/api/admin/brands",
        {
          method: brandId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save");
      }

      router.push("/admin/brands");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save brand");
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
        <h3 className="font-semibold">Brand Info</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name *</Label>
            <Input id="name" {...register("name")} onBlur={handleNameBlur} placeholder="e.g. Nutella" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} placeholder="nutella" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Country of Origin</Label>
          <Input id="origin" {...register("origin")} placeholder="e.g. Italy" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={3} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Brand Logo</h3>
        <ImageUploader value={logo} onChange={setLogo} folder="brands" maxFiles={1} />
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">SEO</h3>
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO Title (optional)</Label>
          <Input id="seoTitle" {...register("seoTitle")} placeholder="Brand-specific title for search results" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDesc">SEO Description (optional)</Label>
          <Textarea id="seoDesc" {...register("seoDesc")} rows={2} />
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" />
        {brandId ? "Save Changes" : "Create Brand"}
      </Button>
    </form>
  );
}
