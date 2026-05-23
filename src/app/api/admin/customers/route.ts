import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const customers = await db.customer.findMany({
    where: status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" } : {},
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      company: true,
      country: true,
      phone: true,
      buyerType: true,
      status: true,
      approvedAt: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ customers });
}
