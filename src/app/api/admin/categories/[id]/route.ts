import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const category = await db.category.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const category = await db.category.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const cat = await db.category.findUnique({ where: { id } });
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const productCount = await db.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json({ error: `Cannot delete: ${productCount} products in this category` }, { status: 409 });
  }
  if (cat.imagePublicId) {
    try { await deleteFromCloudinary(cat.imagePublicId); } catch {}
  }
  await db.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
