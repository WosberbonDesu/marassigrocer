import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await db.siteConfig.findUnique({ where: { id: "default" } });
  return NextResponse.json({ config });
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const config = await db.siteConfig.upsert({
      where: { id: "default" },
      update: { ...body, updatedAt: new Date() },
      create: { id: "default", ...body, updatedAt: new Date() },
    });
    return NextResponse.json({ config });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
