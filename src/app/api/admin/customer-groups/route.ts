import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;
  const groups = await db.customerGroup.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { customers: true } } },
  });
  return NextResponse.json({ groups });
}

export async function POST(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;
  try {
    const body = await req.json();
    const name = (body.name as string)?.trim();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const discount = Number(body.defaultDiscount ?? 0);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      return NextResponse.json({ error: "Discount must be 0–100" }, { status: 400 });
    }

    const group = await db.customerGroup.create({
      data: {
        name,
        description: (body.description as string) || null,
        defaultDiscount: discount,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ group });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
