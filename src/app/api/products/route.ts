import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSiteConfig } from "@/lib/site-config";
import { getCustomerSession } from "@/lib/customer-auth";

interface PricingTier {
  minQty: number;
  casePrice?: number;
  unitPrice?: number;
}

function applyDiscount(tiers: PricingTier[] | null, percent: number): PricingTier[] | null {
  if (!tiers || percent <= 0) return tiers;
  const factor = 1 - percent / 100;
  return tiers.map((t) => ({
    minQty: t.minQty,
    casePrice: t.casePrice != null ? Math.round(t.casePrice * factor * 100) / 100 : undefined,
    unitPrice: t.unitPrice != null ? Math.round(t.unitPrice * factor * 100) / 100 : undefined,
  }));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const availability = searchParams.get("availability") || "";
  const search = searchParams.get("search")?.trim() || "";
  const limit = parseInt(searchParams.get("limit") || "100");

  const where: Record<string, unknown> = {
    published: true,
    ...(availability ? { availability } : {}),
  };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { unitUpc: { contains: search, mode: "insensitive" } },
      { caseUpc: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const session = await getCustomerSession();
  type CustomerWithGroup = {
    group: { active: boolean; defaultDiscount: number; name: string } | null;
  } | null;
  let customer: CustomerWithGroup = null;
  try {
    customer = session
      ? ((await db.customer.findUnique({
          where: { id: session.customerId },
          include: { group: true },
        })) as CustomerWithGroup)
      : null;
  } catch {
    customer = null; // Customer table missing — run prisma db push
  }

  let products: Awaited<ReturnType<typeof db.product.findMany>> = [];
  try {
    products = await db.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  } catch (err) {
    console.error("[/api/products] db.product.findMany failed — DB schema may be out of sync. Run `npx prisma db push`.", err);
    products = [];
  }
  const config = await getSiteConfig();

  // Prices visible if global flag on OR approved customer signed in
  const pricesVisible = config.showPricesPublicly || !!customer;
  const groupDiscount =
    customer?.group?.active && customer.group.defaultDiscount > 0
      ? customer.group.defaultDiscount
      : 0;

  const sanitized = pricesVisible
    ? products.map((p) => ({
        ...p,
        pricingTiers: applyDiscount(p.pricingTiers as PricingTier[] | null, groupDiscount),
      }))
    : products.map((p) => ({ ...p, pricingTiers: null }));

  return NextResponse.json({
    products: sanitized,
    showPricesPublicly: pricesVisible,
    signedIn: !!customer,
    groupDiscount,
    groupName: customer?.group?.name ?? null,
  });
}
