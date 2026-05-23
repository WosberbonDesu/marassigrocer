import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;
  const posts = await db.blogPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;
  try {
    const body = await req.json();
    const titleEn = (body.title as Record<string, string> | undefined)?.en?.trim();
    if (!titleEn) return NextResponse.json({ error: "English title is required" }, { status: 400 });

    const finalSlug = body.slug?.trim() ? slugify(body.slug) : slugify(titleEn);
    const existing = await db.blogPost.findUnique({ where: { slug: finalSlug } });
    if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

    const post = await db.blogPost.create({
      data: {
        slug: finalSlug,
        title: body.title ?? {},
        excerpt: body.excerpt ?? null,
        content: body.content ?? {},
        coverImage: body.coverImage || null,
        coverPublicId: body.coverPublicId || null,
        author: body.author || null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        seoTitle: body.seoTitle || null,
        seoDesc: body.seoDesc || null,
        ogImage: body.ogImage || null,
        status: body.status ?? "DRAFT",
        publishedAt:
          body.status === "PUBLISHED"
            ? (body.publishedAt ? new Date(body.publishedAt) : new Date())
            : null,
      },
    });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
