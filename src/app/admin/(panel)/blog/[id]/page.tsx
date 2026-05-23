import { notFound } from "next/navigation";
import { AdminTopBar } from "@/components/admin/top-bar";
import { BlogForm } from "@/components/admin/blog-form";
import { db } from "@/lib/db";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const title = (post.title ?? {}) as { en?: string; tr?: string; ar?: string; ru?: string };
  const excerpt = (post.excerpt ?? {}) as { en?: string; tr?: string; ar?: string; ru?: string };
  const content = (post.content ?? {}) as { en?: string; tr?: string; ar?: string; ru?: string };

  return (
    <>
      <AdminTopBar title="Edit Blog Post" />
      <div className="p-6">
        <BlogForm
          mode="edit"
          postId={post.id}
          initial={{
            slug: post.slug,
            titleEn: title.en ?? "",
            titleTr: title.tr ?? "",
            titleAr: title.ar ?? "",
            titleRu: title.ru ?? "",
            excerptEn: excerpt.en ?? "",
            excerptTr: excerpt.tr ?? "",
            excerptAr: excerpt.ar ?? "",
            excerptRu: excerpt.ru ?? "",
            contentEn: content.en ?? "",
            contentTr: content.tr ?? "",
            contentAr: content.ar ?? "",
            contentRu: content.ru ?? "",
            author: post.author ?? "",
            tags: post.tags ?? [],
            coverImage: post.coverImage,
            coverPublicId: post.coverPublicId,
            status: post.status,
            publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : "",
            seoTitle: post.seoTitle ?? "",
            seoDesc: post.seoDesc ?? "",
          }}
        />
      </div>
    </>
  );
}
