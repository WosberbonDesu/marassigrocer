import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const brands = await db.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ brands });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { name, slug, logo, logoPublicId, origin, description, seoTitle, seoDesc } = body;
    if (!name || !slug) return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
    const brand = await db.brand.create({
      data: { name, slug, logo, logoPublicId, origin, description, seoTitle, seoDesc },
    });
    return NextResponse.json({ brand }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "P2002") return NextResponse.json({ error: "Slug exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
