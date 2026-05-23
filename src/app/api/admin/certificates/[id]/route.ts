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
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.issuer !== undefined) data.issuer = body.issuer || null;
    if (body.issuedDate !== undefined)
      data.issuedDate = body.issuedDate ? new Date(body.issuedDate as string) : null;
    if (body.validUntil !== undefined)
      data.validUntil = body.validUntil ? new Date(body.validUntil as string) : null;
    if (body.fileUrl !== undefined) data.fileUrl = body.fileUrl || null;
    if (body.filePublicId !== undefined) data.filePublicId = body.filePublicId || null;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
    if (body.imagePublicId !== undefined) data.imagePublicId = body.imagePublicId || null;
    if (body.order !== undefined) data.order = Number(body.order) || 0;
    if (body.active !== undefined) data.active = !!body.active;
    const certificate = await db.certificate.update({ where: { id }, data });
    return NextResponse.json({ certificate });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;
  const { id } = await params;
  try {
    await db.certificate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
