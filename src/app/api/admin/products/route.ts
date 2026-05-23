import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, slug, sku, description, longDescription, ingredients, allergens, storage, nutrition,
      categoryId, brandId,
      images, imagePublicIds, imageAlts, originCountries, packaging,
      packDescription, unitWeight, weight, dimensions, caseSize, unitUpc, caseUpc,
      variants, cartonDetails, loadingInfo, exportSuitability, relatedProductIds,
      pricingTiers,
      shelfLifeMin, shelfLifeMax, moqHint, moqQuantity, moqUnit, hazmat, reeferRequired, availability,
      specs, seoTitle, seoDesc, featured, published, status, order,
    } = body;

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: "name, slug, categoryId are required" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name, slug,
        sku: sku || null,
        description,
        longDescription: longDescription || null,
        ingredients: ingredients || null,
        allergens: Array.isArray(allergens) ? allergens : [],
        storage: storage || null,
        nutrition: nutrition ?? null,
        categoryId, brandId: brandId || null,
        images: images || [],
        imagePublicIds: imagePublicIds || [],
        imageAlts: Array.isArray(imageAlts) ? imageAlts : [],
        originCountries: originCountries || [], packaging: packaging || null,
        packDescription: packDescription || null,
        unitWeight: unitWeight || null,
        weight: weight || null,
        dimensions: dimensions || null,
        caseSize: caseSize != null && caseSize !== "" ? Number(caseSize) : null,
        unitUpc: unitUpc || null,
        caseUpc: caseUpc || null,
        variants: Array.isArray(variants) ? variants : [],
        cartonDetails: cartonDetails || null,
        loadingInfo: loadingInfo || null,
        exportSuitability: exportSuitability || null,
        relatedProductIds: Array.isArray(relatedProductIds) ? relatedProductIds : [],
        pricingTiers: pricingTiers ?? null,
        shelfLifeMin: shelfLifeMin || null, shelfLifeMax: shelfLifeMax || null,
        moqHint,
        moqQuantity: moqQuantity != null && moqQuantity !== "" ? Number(moqQuantity) : null,
        moqUnit: moqUnit || null,
        hazmat: !!hazmat,
        reeferRequired: !!reeferRequired,
        availability: availability || "in_stock",
        specs: specs || {}, seoTitle, seoDesc,
        featured: featured ?? false,
        published: status ? status === "PUBLISHED" : published ?? true,
        status: status ?? (published === false ? "DRAFT" : "PUBLISHED"),
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
