import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/api-auth";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requirePermission("pages.write");
  if (response) return response;
  const { id } = await params;

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.slug !== undefined) {
      const s = slugify(body.slug);
      if (!s) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
      const conflict = await db.page.findFirst({ where: { slug: s, NOT: { id } } });
      if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      data.slug = s;
    }
    if (body.title !== undefined) data.title = body.title;
    if (body.content !== undefined) data.content = body.content;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt || null;
    if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle || null;
    if (body.seoDesc !== undefined) data.seoDesc = body.seoDesc || null;
    if (body.ogImage !== undefined) data.ogImage = body.ogImage || null;
    if (body.published !== undefined) data.published = !!body.published;
    if (body.order !== undefined) data.order = Number(body.order) || 0;

    const page = await db.page.update({ where: { id }, data });
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requirePermission("pages.write");
  if (response) return response;
  const { id } = await params;
  try {
    await db.page.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
