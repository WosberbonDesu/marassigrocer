import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const brand = await db.brand.findUnique({ where: { id } });
  if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ brand });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const brand = await db.brand.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return NextResponse.json({ brand });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const count = await db.product.count({ where: { brandId: id } });
  if (count > 0) return NextResponse.json({ error: `${count} products use this brand` }, { status: 409 });
  await db.brand.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
