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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;
  const { id } = await params;
  try {
    const body = await req.json();
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (body.slug !== undefined) {
      const s = slugify(body.slug);
      if (!s) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
      const conflict = await db.blogPost.findFirst({ where: { slug: s, NOT: { id } } });
      if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      data.slug = s;
    }
    if (body.title !== undefined) data.title = body.title;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.content !== undefined) data.content = body.content;
    if (body.coverImage !== undefined) data.coverImage = body.coverImage || null;
    if (body.coverPublicId !== undefined) data.coverPublicId = body.coverPublicId || null;
    if (body.author !== undefined) data.author = body.author || null;
    if (body.tags !== undefined) data.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle || null;
    if (body.seoDesc !== undefined) data.seoDesc = body.seoDesc || null;
    if (body.ogImage !== undefined) data.ogImage = body.ogImage || null;
    if (body.status !== undefined) {
      data.status = body.status;
      if (body.status === "PUBLISHED" && !existing.publishedAt) {
        data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
      } else if (body.status !== "PUBLISHED") {
        // Keep prior publishedAt for ARCHIVED but null for DRAFT
        if (body.status === "DRAFT") data.publishedAt = null;
      }
    }
    if (body.publishedAt !== undefined) {
      data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    }

    const post = await db.blogPost.update({ where: { id }, data });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;
  const { id } = await params;
  try {
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
