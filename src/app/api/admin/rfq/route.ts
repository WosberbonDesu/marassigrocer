import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";
import { normalizeStatus } from "@/lib/rfq-status";

export async function GET(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where = status
    ? {
        OR:
          status === "submitted"
            ? [{ status: "submitted" }, { status: "new" }, { status: "read" }]
            : [{ status }],
      }
    : {};

  const rfqs = await db.rfq.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const normalized = rfqs.map((r) => ({ ...r, status: normalizeStatus(r.status) }));
  return NextResponse.json({ rfqs: normalized });
}
