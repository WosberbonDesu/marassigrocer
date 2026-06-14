import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/shared/page-hero";
import { db } from "@/lib/db";

type LocalizedString = { en?: string; tr?: string; ar?: string; ru?: string };

function pick(record: LocalizedString | null | undefined, locale: string): string {
  if (!record) return "";
  return record[locale as keyof LocalizedString] || record.en || "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = await db.blogPost.findUnique({ where: { slug } });
    if (!post || post.status !== "PUBLISHED") return {};
    const title = post.seoTitle || pick(post.title as LocalizedString, locale);
    const description = post.seoDesc || pick(post.excerpt as LocalizedString, locale);
    return {
      title,
      description,
      openGraph: post.ogImage || post.coverImage
        ? { title, description, images: [{ url: (post.ogImage || post.coverImage)! }] }
        : { title, description },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("insightsDetailPage");
  let post: Awaited<ReturnType<typeof db.blogPost.findUnique>> = null;
  try {
    post = await db.blogPost.findUnique({ where: { slug } });
  } catch {
    post = null;
  }
  if (!post || post.status !== "PUBLISHED") notFound();

  const title = pick(post.title as LocalizedString, locale);
  const content = pick(post.content as LocalizedString, locale);
  const excerpt = pick(post.excerpt as LocalizedString, locale);
  const isRtl = locale === "ar";

  return (
    <div>
      <PageHero
        title={title}
        locale={locale}
        breadcrumbs={[
          { label: t("breadcrumbs.insights"), href: `/${locale}/insights` },
          { label: title },
        ]}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {post.author && <span>· {t("byAuthor")} {post.author}</span>}
        </div>

        {post.coverImage && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={post.coverImage} alt={title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 800px" />
          </div>
        )}

        {excerpt && (
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{excerpt}</p>
        )}

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dir={isRtl ? "rtl" : "ltr"}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t pt-6">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{t("tagsLabel")}</span>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
