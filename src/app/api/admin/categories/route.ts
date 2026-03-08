import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, slug, description, image, imagePublicId, seoTitle, seoDesc, featured, order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
    }

    const category = await db.category.create({
      data: { name, slug, description, image, imagePublicId, seoTitle, seoDesc, featured: featured ?? false, order: order ?? 0 },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
