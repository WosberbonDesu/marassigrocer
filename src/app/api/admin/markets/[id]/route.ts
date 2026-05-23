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
    if (body.name !== undefined) data.name = body.name;
    if (body.region !== undefined) data.region = body.region || null;
    if (body.countries !== undefined)
      data.countries = Array.isArray(body.countries) ? body.countries : [];
    if (body.description !== undefined) data.description = body.description || null;
    if (body.image !== undefined) data.image = body.image || null;
    if (body.imagePublicId !== undefined) data.imagePublicId = body.imagePublicId || null;
    if (body.featuredCategories !== undefined)
      data.featuredCategories = Array.isArray(body.featuredCategories)
        ? body.featuredCategories
        : [];
    if (body.regulatoryNotes !== undefined) data.regulatoryNotes = body.regulatoryNotes || null;
    if (body.order !== undefined) data.order = Number(body.order) || 0;
    if (body.active !== undefined) data.active = !!body.active;
    const market = await db.market.update({ where: { id }, data });
    return NextResponse.json({ market });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;
  const { id } = await params;
  try {
    await db.market.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
