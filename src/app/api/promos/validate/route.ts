import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string; subtotal?: number };
    const code = body.code?.trim().toUpperCase();
    if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

    const promo = await db.promoCode.findUnique({ where: { code } });
    const now = new Date();

    if (!promo || !promo.active) {
      return NextResponse.json({ error: "Invalid code" }, { status: 404 });
    }
    if (promo.validFrom && promo.validFrom > now) {
      return NextResponse.json({ error: "Not active yet" }, { status: 400 });
    }
    if (promo.validUntil && promo.validUntil < now) {
      return NextResponse.json({ error: "Expired" }, { status: 400 });
    }
    if (promo.maxUses != null && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: "Usage limit reached" }, { status: 400 });
    }
    if (promo.minOrder != null && body.subtotal != null && body.subtotal < promo.minOrder) {
      return NextResponse.json(
        { error: `Minimum order ${promo.minOrder} required` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      description: promo.description,
    });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
