import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";
import { sendCustomerDecisionNotification } from "@/lib/email";

const VALID = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;
type CustomerStatusValue = (typeof VALID)[number];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;

  const { id } = await params;
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      salesRep: { select: { id: true, email: true, name: true } },
      group: { select: { id: true, name: true, defaultDiscount: true } },
    },
  });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ customer });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;

  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;

  const existing = await db.customer.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};

  if (typeof body.status === "string" && (VALID as readonly string[]).includes(body.status)) {
    const next = body.status as CustomerStatusValue;
    data.status = next;
    if (next === "APPROVED" && existing.status !== "APPROVED") {
      data.approvedAt = new Date();
    }
    if (next === "REJECTED" && typeof body.rejectedReason === "string") {
      data.rejectedReason = body.rejectedReason;
    }
  }
  if (body.salesRepId !== undefined) {
    data.salesRepId = body.salesRepId || null;
  }
  if (body.groupId !== undefined) {
    data.groupId = body.groupId || null;
  }
  if (body.internalNotes !== undefined) {
    data.internalNotes = body.internalNotes || null;
  }

  const customer = await db.customer.update({
    where: { id },
    data,
    include: {
      salesRep: { select: { id: true, email: true, name: true } },
      group: { select: { id: true, name: true, defaultDiscount: true } },
    },
  });

  // Send approval/rejection email
  if (
    process.env.RESEND_API_KEY &&
    data.status &&
    (data.status === "APPROVED" || data.status === "REJECTED") &&
    existing.status !== data.status
  ) {
    sendCustomerDecisionNotification({
      email: customer.email,
      name: customer.name,
      approved: data.status === "APPROVED",
      reason: typeof body.rejectedReason === "string" ? body.rejectedReason : undefined,
    }).catch((err) => console.error("[Customer decision email]", err));
  }

  return NextResponse.json({ customer });
}
