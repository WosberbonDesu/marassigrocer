import { notFound } from "next/navigation";
import { AdminTopBar } from "@/components/admin/top-bar";
import { PageForm } from "@/components/admin/page-form";
import { db } from "@/lib/db";

export default async function EditCmsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await db.page.findUnique({ where: { id } });
  if (!page) notFound();

  const title = (page.title ?? {}) as { en?: string; tr?: string; ar?: string };
  const content = (page.content ?? {}) as { en?: string; tr?: string; ar?: string };

  return (
    <>
      <AdminTopBar title="Edit Page" />
      <div className="p-6">
        <PageForm
          mode="edit"
          pageId={page.id}
          initial={{
            slug: page.slug,
            titleEn: title.en ?? "",
            titleTr: title.tr ?? "",
            titleAr: title.ar ?? "",
            contentEn: content.en ?? "",
            contentTr: content.tr ?? "",
            contentAr: content.ar ?? "",
            excerpt: page.excerpt ?? "",
            seoTitle: page.seoTitle ?? "",
            seoDesc: page.seoDesc ?? "",
            ogImage: page.ogImage ?? "",
            published: page.published,
            order: page.order,
          }}
        />
      </div>
    </>
  );
}
