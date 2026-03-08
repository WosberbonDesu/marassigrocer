import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const availability = searchParams.get("availability") || "";
  const limit = parseInt(searchParams.get("limit") || "100");

  const where = {
    published: true,
    ...(availability ? { availability } : {}),
  };

  const products = await db.product.findMany({
    where,
    include: { category: true, brand: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });

  return NextResponse.json({ products });
}
