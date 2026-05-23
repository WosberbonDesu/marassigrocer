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
  const markets = await db.market.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return NextResponse.json({ markets });
}

export async function POST(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;
  try {
    const body = await req.json();
    if (!body.name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);
    const exists = await db.market.findUnique({ where: { slug } });
    if (exists) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    const market = await db.market.create({
      data: {
        name: body.name,
        slug,
        region: body.region || null,
        countries: Array.isArray(body.countries) ? body.countries : [],
        description: body.description || null,
        image: body.image || null,
        imagePublicId: body.imagePublicId || null,
        featuredCategories: Array.isArray(body.featuredCategories) ? body.featuredCategories : [],
        regulatoryNotes: body.regulatoryNotes || null,
        order: Number(body.order ?? 0) || 0,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ market });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
