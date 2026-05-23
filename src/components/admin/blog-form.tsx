"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUploader } from "@/components/admin/image-uploader";

type LocalizedString = { en: string; tr: string; ar: string; ru: string };
type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type FormValues = {
  slug: string;
  titleEn: string; titleTr: string; titleAr: string; titleRu: string;
  excerptEn: string; excerptTr: string; excerptAr: string; excerptRu: string;
  author: string;
  status: BlogStatus;
  publishedAt: string;
  seoTitle: string;
  seoDesc: string;
};

interface UploadedImage { url: string; publicId: string }

type Props = {
  mode: "create" | "edit";
  postId?: string;
  initial?: Partial<FormValues> & {
    contentEn?: string; contentTr?: string; contentAr?: string; contentRu?: string;
    tags?: string[];
    coverImage?: string | null;
    coverPublicId?: string | null;
  };
};

export function BlogForm({ mode, postId, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [contentEn, setContentEn] = useState(initial?.contentEn ?? "");
  const [contentTr, setContentTr] = useState(initial?.contentTr ?? "");
  const [contentAr, setContentAr] = useState(initial?.contentAr ?? "");
  const [contentRu, setContentRu] = useState(initial?.contentRu ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [cover, setCover] = useState<UploadedImage[]>(
    initial?.coverImage && initial?.coverPublicId
      ? [{ url: initial.coverImage, publicId: initial.coverPublicId }]
      : []
  );

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      slug: initial?.slug ?? "",
      titleEn: initial?.titleEn ?? "",
      titleTr: initial?.titleTr ?? "",
      titleAr: initial?.titleAr ?? "",
      titleRu: initial?.titleRu ?? "",
      excerptEn: initial?.excerptEn ?? "",
      excerptTr: initial?.excerptTr ?? "",
      excerptAr: initial?.excerptAr ?? "",
      excerptRu: initial?.excerptRu ?? "",
      author: initial?.author ?? "",
      status: initial?.status ?? "DRAFT",
      publishedAt: initial?.publishedAt ?? "",
      seoTitle: initial?.seoTitle ?? "",
      seoDesc: initial?.seoDesc ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    setError("");
    const title: LocalizedString = { en: data.titleEn, tr: data.titleTr, ar: data.titleAr, ru: data.titleRu };
    const excerpt: LocalizedString = { en: data.excerptEn, tr: data.excerptTr, ar: data.excerptAr, ru: data.excerptRu };
    const content: LocalizedString = { en: contentEn, tr: contentTr, ar: contentAr, ru: contentRu };
    const payload = {
      slug: data.slug,
      title,
      excerpt,
      content,
      author: data.author,
      status: data.status,
      publishedAt: data.publishedAt || null,
      tags,
      coverImage: cover[0]?.url ?? null,
      coverPublicId: cover[0]?.publicId ?? null,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
    };
    const url = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${postId}`;
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
    router.push("/admin/blog");
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} placeholder="auto from English title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register("author")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {t}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                const v = tagInput.trim().replace(/,$/, "");
                if (v && !tags.includes(v)) setTags([...tags, v]);
                setTagInput("");
              }
            }}
            placeholder="Type and press Enter (e.g. private-label, logistics)"
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUploader value={cover} onChange={setCover} folder="blog" maxFiles={1} />
        </div>
      </div>

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="tr">Türkçe</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="ru">Русский</TabsTrigger>
        </TabsList>

        {[
          { v: "en", title: "Title (English)", excerpt: "Excerpt", rtl: false, regTitle: "titleEn" as const, regExcerpt: "excerptEn" as const, content: contentEn, setContent: setContentEn },
          { v: "tr", title: "Title (Türkçe)", excerpt: "Excerpt", rtl: false, regTitle: "titleTr" as const, regExcerpt: "excerptTr" as const, content: contentTr, setContent: setContentTr },
          { v: "ar", title: "Title (العربية)", excerpt: "Excerpt", rtl: true, regTitle: "titleAr" as const, regExcerpt: "excerptAr" as const, content: contentAr, setContent: setContentAr },
          { v: "ru", title: "Title (Русский)", excerpt: "Excerpt", rtl: false, regTitle: "titleRu" as const, regExcerpt: "excerptRu" as const, content: contentRu, setContent: setContentRu },
        ].map((lang) => (
          <TabsContent key={lang.v} value={lang.v}>
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={lang.regTitle}>{lang.title}</Label>
                <Input id={lang.regTitle} {...register(lang.regTitle, lang.v === "en" ? { required: true } : {})} dir={lang.rtl ? "rtl" : "ltr"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={lang.regExcerpt}>{lang.excerpt}</Label>
                <Textarea id={lang.regExcerpt} rows={2} {...register(lang.regExcerpt)} dir={lang.rtl ? "rtl" : "ltr"} />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <div dir={lang.rtl ? "rtl" : "ltr"}>
                  <RichTextEditor value={lang.content} onChange={lang.setContent} />
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">SEO</h3>
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDesc">SEO Description</Label>
          <Textarea id="seoDesc" rows={2} {...register("seoDesc")} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <select {...register("status")} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Publish Date (optional)</Label>
            <Input type="date" {...register("publishedAt")} />
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {mode === "create" ? "Create Post" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
