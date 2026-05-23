import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;
  const certificates = await db.certificate.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ certificates });
}

export async function POST(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;
  try {
    const body = await req.json();
    const title = (body.title as string)?.trim();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const certificate = await db.certificate.create({
      data: {
        title,
        description: (body.description as string) || null,
        issuer: (body.issuer as string) || null,
        issuedDate: body.issuedDate ? new Date(body.issuedDate as string) : null,
        validUntil: body.validUntil ? new Date(body.validUntil as string) : null,
        fileUrl: (body.fileUrl as string) || null,
        filePublicId: (body.filePublicId as string) || null,
        imageUrl: (body.imageUrl as string) || null,
        imagePublicId: (body.imagePublicId as string) || null,
        order: Number(body.order ?? 0) || 0,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ certificate });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
