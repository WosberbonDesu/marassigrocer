import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;
  const { id } = await params;
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) {
      const n = (body.name as string).trim();
      if (!n) return NextResponse.json({ error: "Name is required" }, { status: 400 });
      data.name = n;
    }
    if (body.description !== undefined) data.description = body.description || null;
    if (body.defaultDiscount !== undefined) {
      const d = Number(body.defaultDiscount);
      if (!Number.isFinite(d) || d < 0 || d > 100) {
        return NextResponse.json({ error: "Discount must be 0–100" }, { status: 400 });
      }
      data.defaultDiscount = d;
    }
    if (body.active !== undefined) data.active = !!body.active;

    const group = await db.customerGroup.update({ where: { id }, data });
    return NextResponse.json({ group });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;
  const { id } = await params;
  const count = await db.customer.count({ where: { groupId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `${count} customer${count === 1 ? "" : "s"} still in this group` },
      { status: 409 }
    );
  }
  await db.customerGroup.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
