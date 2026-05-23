import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface LookupItem {
  identifier: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { items: LookupItem[] };
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) return NextResponse.json({ matches: [], notFound: [] });
    if (items.length > 200) {
      return NextResponse.json({ error: "Maximum 200 items per lookup" }, { status: 400 });
    }

    const identifiers = items.map((i) => i.identifier.trim()).filter(Boolean);
    if (identifiers.length === 0) return NextResponse.json({ matches: [], notFound: [] });

    const products = await db.product.findMany({
      where: {
        published: true,
        OR: [
          { slug: { in: identifiers } },
          { unitUpc: { in: identifiers } },
          { caseUpc: { in: identifiers } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        unitUpc: true,
        caseUpc: true,
        images: true,
        moqHint: true,
        availability: true,
        packDescription: true,
      },
    });

    const byKey = new Map<string, (typeof products)[number]>();
    for (const p of products) {
      byKey.set(p.slug.toLowerCase(), p);
      if (p.unitUpc) byKey.set(p.unitUpc.toLowerCase(), p);
      if (p.caseUpc) byKey.set(p.caseUpc.toLowerCase(), p);
    }

    const matches: Array<{
      identifier: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        slug: string;
        image: string | null;
        moqHint: string | null;
        availability: string;
        packDescription: string | null;
      };
    }> = [];
    const notFound: Array<{ identifier: string; quantity: number }> = [];

    for (const item of items) {
      const id = item.identifier.trim().toLowerCase();
      if (!id) continue;
      const product = byKey.get(id);
      if (product) {
        matches.push({
          identifier: item.identifier,
          quantity: Math.max(1, item.quantity || 1),
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] ?? null,
            moqHint: product.moqHint,
            availability: product.availability,
            packDescription: product.packDescription,
          },
        });
      } else {
        notFound.push({ identifier: item.identifier, quantity: item.quantity || 1 });
      }
    }

    return NextResponse.json({ matches, notFound });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
