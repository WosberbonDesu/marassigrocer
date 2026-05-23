import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/api-auth";
import type { PromoType } from "@prisma/client";

const VALID_TYPES: PromoType[] = ["PERCENT", "AMOUNT"];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requirePermission("promos.write");
  if (response) return response;
  const { id } = await params;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    if (body.code !== undefined) data.code = (body.code as string).trim().toUpperCase();
    if (body.description !== undefined) data.description = body.description || null;
    if (body.type !== undefined) {
      if (!VALID_TYPES.includes(body.type as PromoType)) {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
      }
      data.type = body.type;
    }
    if (body.value !== undefined) {
      const v = Number(body.value);
      if (!Number.isFinite(v) || v <= 0) {
        return NextResponse.json({ error: "Value must be > 0" }, { status: 400 });
      }
      data.value = v;
    }
    if (body.minOrder !== undefined) {
      data.minOrder = body.minOrder === "" || body.minOrder === null ? null : Number(body.minOrder);
    }
    if (body.maxUses !== undefined) {
      data.maxUses = body.maxUses === "" || body.maxUses === null ? null : Number(body.maxUses);
    }
    if (body.validFrom !== undefined) {
      data.validFrom = body.validFrom ? new Date(body.validFrom as string) : null;
    }
    if (body.validUntil !== undefined) {
      data.validUntil = body.validUntil ? new Date(body.validUntil as string) : null;
    }
    if (body.active !== undefined) data.active = !!body.active;

    const promo = await db.promoCode.update({ where: { id }, data });
    return NextResponse.json({ promo });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requirePermission("promos.write");
  if (response) return response;
  const { id } = await params;
  try {
    await db.promoCode.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
