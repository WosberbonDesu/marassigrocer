import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/api-auth";
import type { PromoType } from "@prisma/client";

const VALID_TYPES: PromoType[] = ["PERCENT", "AMOUNT"];

function normalize(body: Record<string, unknown>) {
  return {
    code: (body.code as string)?.trim().toUpperCase(),
    description: (body.description as string) || null,
    type: body.type as PromoType,
    value: Number(body.value),
    minOrder: body.minOrder != null && body.minOrder !== "" ? Number(body.minOrder) : null,
    maxUses: body.maxUses != null && body.maxUses !== "" ? Number(body.maxUses) : null,
    validFrom: body.validFrom ? new Date(body.validFrom as string) : null,
    validUntil: body.validUntil ? new Date(body.validUntil as string) : null,
    active: body.active !== false,
  };
}

export async function GET() {
  const { response } = await requirePermission("promos.write");
  if (response) return response;
  const promos = await db.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ promos });
}

export async function POST(req: NextRequest) {
  const { response } = await requirePermission("promos.write");
  if (response) return response;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data = normalize(body);

    if (!data.code) return NextResponse.json({ error: "Code is required" }, { status: 400 });
    if (!VALID_TYPES.includes(data.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    if (!Number.isFinite(data.value) || data.value <= 0) {
      return NextResponse.json({ error: "Value must be > 0" }, { status: 400 });
    }
    if (data.type === "PERCENT" && data.value > 100) {
      return NextResponse.json({ error: "Percent cannot exceed 100" }, { status: 400 });
    }

    const exists = await db.promoCode.findUnique({ where: { code: data.code } });
    if (exists) return NextResponse.json({ error: "Code already exists" }, { status: 409 });

    const promo = await db.promoCode.create({ data });
    return NextResponse.json({ promo });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
