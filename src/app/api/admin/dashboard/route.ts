import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";

type RfqItemShape = { productId?: string; productName?: string; quantity?: number };

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    productsTotal,
    productsPublished,
    productsDraft,
    productsFeatured,
    availabilityGroups,
    categoriesTotal,
    brandsTotal,
    rfqTotal,
    rfqNewUnread,
    rfqLast7d,
    rfqByCountry,
    recentRfqs,
    activePromos,
    rfqWithItems,
    customersPending,
    customersApproved,
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { published: true } }),
    db.product.count({ where: { published: false } }),
    db.product.count({ where: { featured: true } }),
    db.product.groupBy({
      by: ["availability"],
      _count: { availability: true },
    }),
    db.category.count(),
    db.brand.count(),
    db.rfq.count(),
    db.rfq.count({ where: { status: "new" } }),
    db.rfq.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    db.rfq.groupBy({
      by: ["country"],
      _count: { country: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { _count: { country: "desc" } },
    }),
    db.rfq.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        company: true,
        country: true,
        status: true,
        items: true,
        createdAt: true,
      },
    }),
    db.promoCode.count({
      where: {
        active: true,
        OR: [{ validUntil: null }, { validUntil: { gt: now } }],
      },
    }).catch(() => 0),
    db.rfq.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { items: true },
    }),
    db.customer.count({ where: { status: "PENDING" } }).catch(() => 0),
    db.customer.count({ where: { status: "APPROVED" } }).catch(() => 0),
  ]);

  // Tally top requested products from RFQ items (last 30 days)
  const productTally = new Map<string, { name: string; count: number; totalQty: number }>();
  for (const r of rfqWithItems) {
    const items = (Array.isArray(r.items) ? r.items : []) as RfqItemShape[];
    for (const item of items) {
      if (!item.productId || !item.productName) continue;
      const existing = productTally.get(item.productId) ?? {
        name: item.productName,
        count: 0,
        totalQty: 0,
      };
      existing.count += 1;
      existing.totalQty += item.quantity ?? 0;
      productTally.set(item.productId, existing);
    }
  }
  const topProducts = Array.from(productTally.entries())
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const availabilityBreakdown: Record<string, number> = {
    in_stock: 0,
    on_request: 0,
    seasonal: 0,
    discontinued: 0,
  };
  for (const g of availabilityGroups) {
    availabilityBreakdown[g.availability] = g._count.availability;
  }

  const recent = recentRfqs.map((r) => {
    const items = (Array.isArray(r.items) ? r.items : []) as RfqItemShape[];
    return {
      id: r.id,
      name: r.name,
      company: r.company,
      country: r.country,
      status: r.status,
      itemsCount: items.length,
      createdAt: r.createdAt,
    };
  });

  return NextResponse.json({
    products: {
      total: productsTotal,
      published: productsPublished,
      draft: productsDraft,
      featured: productsFeatured,
      availability: availabilityBreakdown,
    },
    catalog: {
      categories: categoriesTotal,
      brands: brandsTotal,
    },
    rfq: {
      total: rfqTotal,
      newUnread: rfqNewUnread,
      last7d: rfqLast7d,
      byCountry: rfqByCountry.map((g) => ({
        country: g.country,
        count: g._count.country,
      })),
      recent,
      topProducts,
    },
    promos: {
      active: activePromos,
    },
    customers: {
      pending: customersPending,
      approved: customersApproved,
    },
  });
}
