import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { category: true, brand: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const product = await db.product.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: { category: true, brand: true },
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Delete images from Cloudinary
  for (const pid of product.imagePublicIds) {
    try { await deleteFromCloudinary(pid); } catch {}
  }
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
