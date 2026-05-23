"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type LocalizedString = { en: string; tr: string; ar: string };

type FormValues = {
  slug: string;
  titleEn: string;
  titleTr: string;
  titleAr: string;
  excerpt: string;
  seoTitle: string;
  seoDesc: string;
  ogImage: string;
  published: boolean;
  order: number;
};

type Props = {
  mode: "create" | "edit";
  pageId?: string;
  initial?: Partial<FormValues> & {
    contentEn?: string;
    contentTr?: string;
    contentAr?: string;
  };
};

export function PageForm({ mode, pageId, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [contentEn, setContentEn] = useState(initial?.contentEn ?? "");
  const [contentTr, setContentTr] = useState(initial?.contentTr ?? "");
  const [contentAr, setContentAr] = useState(initial?.contentAr ?? "");

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      slug: initial?.slug ?? "",
      titleEn: initial?.titleEn ?? "",
      titleTr: initial?.titleTr ?? "",
      titleAr: initial?.titleAr ?? "",
      excerpt: initial?.excerpt ?? "",
      seoTitle: initial?.seoTitle ?? "",
      seoDesc: initial?.seoDesc ?? "",
      ogImage: initial?.ogImage ?? "",
      published: initial?.published ?? false,
      order: initial?.order ?? 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    setError("");
    const title: LocalizedString = { en: data.titleEn, tr: data.titleTr, ar: data.titleAr };
    const content: LocalizedString = { en: contentEn, tr: contentTr, ar: contentAr };
    const payload = {
      slug: data.slug,
      title,
      content,
      excerpt: data.excerpt,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
      ogImage: data.ogImage,
      published: data.published,
      order: Number(data.order) || 0,
    };
    const url = mode === "create" ? "/api/admin/pages" : `/api/admin/pages/${pageId}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Save failed");
      setSaving(false);
      return;
    }
    router.push("/admin/pages");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-5">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} placeholder="about-us" />
            <p className="text-xs text-muted-foreground">
              Used in the URL: /[locale]/p/[slug]. Auto-generated from English title if blank.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Display order</Label>
            <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="tr">Türkçe</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
        </TabsList>

        <TabsContent value="en">
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input id="titleEn" {...register("titleEn", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Content (English)</Label>
              <RichTextEditor value={contentEn} onChange={setContentEn} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tr">
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titleTr">Title (Türkçe)</Label>
              <Input id="titleTr" {...register("titleTr")} />
            </div>
            <div className="space-y-2">
              <Label>Content (Türkçe)</Label>
              <RichTextEditor value={contentTr} onChange={setContentTr} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ar">
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titleAr">Title (العربية)</Label>
              <Input id="titleAr" {...register("titleAr")} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>Content (العربية)</Label>
              <div dir="rtl">
                <RichTextEditor value={contentAr} onChange={setContentAr} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">SEO</h3>
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO Title (optional)</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDesc">SEO Description (optional)</Label>
          <Textarea id="seoDesc" rows={2} {...register("seoDesc")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ogImage">Open Graph Image URL (optional)</Label>
          <Input id="ogImage" {...register("ogImage")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt (used in listings)</Label>
          <Textarea id="excerpt" rows={2} {...register("excerpt")} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <input
            id="published"
            type="checkbox"
            {...register("published")}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="published" className="cursor-pointer">
            Published (visible on the site)
          </Label>
        </div>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {mode === "create" ? "Create Page" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
