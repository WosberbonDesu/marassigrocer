import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const published = searchParams.get("published");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where = {
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(category ? { categoryId: category } : {}),
    ...(published !== null && published !== "" ? { published: published === "true" } : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, slug, description, categoryId, brandId,
      images, imagePublicIds, originCountries, packaging,
      shelfLifeMin, shelfLifeMax, moqHint, availability,
      specs, seoTitle, seoDesc, featured, published, order,
    } = body;

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: "name, slug, categoryId are required" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name, slug, description, categoryId, brandId: brandId || null,
        images: images || [], imagePublicIds: imagePublicIds || [],
        originCountries: originCountries || [], packaging: packaging || null,
        shelfLifeMin: shelfLifeMin || null, shelfLifeMax: shelfLifeMax || null,
        moqHint, availability: availability || "in_stock",
        specs: specs || {}, seoTitle, seoDesc,
        featured: featured ?? false, published: published ?? true,
        order: order ?? 0,
      },
      include: { category: true, brand: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
