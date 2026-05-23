import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";

type LocalizedString = { en?: string; tr?: string; ar?: string };

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
    const page = await db.page.findUnique({ where: { slug } });
    if (!page || !page.published) return {};
    const title = page.seoTitle || pick(page.title as LocalizedString, locale);
    const description = page.seoDesc || page.excerpt || undefined;
    return {
      title,
      description,
      openGraph: page.ogImage
        ? { title, description, images: [{ url: page.ogImage }] }
        : { title, description },
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const pages = await db.page.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return routing.locales.flatMap((locale) =>
      pages.map((p) => ({ locale, slug: p.slug }))
    );
  } catch {
    // Page table may not exist yet (run prisma db push). Fall back to on-demand.
    return [];
  }
}

export default async function CmsPageView({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await db.page.findUnique({ where: { slug } });
  if (!page || !page.published) notFound();

  const title = pick(page.title as LocalizedString, locale);
  const content = pick(page.content as LocalizedString, locale);
  const isRtl = locale === "ar";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {page.excerpt && (
          <p className="mt-3 text-lg text-muted-foreground">{page.excerpt}</p>
        )}
      </header>
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dir={isRtl ? "rtl" : "ltr"}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
