import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;
  const advantages = await db.advantage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ advantages });
}

export async function POST(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;
  try {
    const body = await req.json();
    if (!body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });
    }
    const advantage = await db.advantage.create({
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon || null,
        stat: body.stat || null,
        statLabel: body.statLabel || null,
        order: Number(body.order ?? 0) || 0,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ advantage });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
