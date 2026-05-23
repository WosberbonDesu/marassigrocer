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

export async function GET() {
  const { response } = await requirePermission("pages.write");
  if (response) return response;
  const pages = await db.page.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const { response } = await requirePermission("pages.write");
  if (response) return response;
  try {
    const body = await req.json();
    const { slug, title, content, excerpt, seoTitle, seoDesc, ogImage, published, order } = body;

    if (!title?.en?.trim()) {
      return NextResponse.json({ error: "English title is required" }, { status: 400 });
    }
    const finalSlug = slug?.trim() ? slugify(slug) : slugify(title.en);

    const exists = await db.page.findUnique({ where: { slug: finalSlug } });
    if (exists) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }

    const page = await db.page.create({
      data: {
        slug: finalSlug,
        title: title ?? {},
        content: content ?? {},
        excerpt: excerpt || null,
        seoTitle: seoTitle || null,
        seoDesc: seoDesc || null,
        ogImage: ogImage || null,
        published: !!published,
        order: typeof order === "number" ? order : 0,
      },
    });
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
