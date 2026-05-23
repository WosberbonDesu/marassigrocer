import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/api-auth";
import {
  canTransition,
  isEditable,
  normalizeStatus,
  type RfqStatus,
} from "@/lib/rfq-status";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;

  const { id } = await params;
  const rfq = await db.rfq.findUnique({ where: { id } });
  if (!rfq) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    rfq: { ...rfq, status: normalizeStatus(rfq.status) },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();

  const existing = await db.rfq.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = normalizeStatus(existing.status);
  const data: Record<string, unknown> = {};

  // Status transition
  if (body.status !== undefined) {
    const next = normalizeStatus(body.status);
    if (next !== current && !canTransition(current, next)) {
      return NextResponse.json(
        { error: `Cannot move from ${current} to ${next}` },
        { status: 400 }
      );
    }
    data.status = next;
    if (next === "confirmed" && !existing.confirmedAt) {
      data.confirmedAt = new Date();
    }
    if (next === "locked" && !existing.lockedAt) {
      data.lockedAt = new Date();
    }
  }

  // Content edits — only while editable
  const editingContent =
    body.items !== undefined ||
    body.quoteNotes !== undefined ||
    body.notes !== undefined ||
    body.targetPrice !== undefined ||
    body.containerEstimate !== undefined;

  if (editingContent) {
    if (!isEditable(current, existing.confirmedAt)) {
      return NextResponse.json(
        { error: `RFQ in status "${current}" is no longer editable` },
        { status: 403 }
      );
    }
    if (body.items !== undefined) data.items = body.items;
    if (body.quoteNotes !== undefined) data.quoteNotes = body.quoteNotes || null;
    if (body.notes !== undefined) data.notes = body.notes || null;
    if (body.targetPrice !== undefined) data.targetPrice = body.targetPrice || null;
    if (body.containerEstimate !== undefined)
      data.containerEstimate = body.containerEstimate || null;
  }

  // Internal notes always editable (admin-only)
  if (body.internalNotes !== undefined) {
    data.internalNotes = body.internalNotes || null;
  }

  const rfq = await db.rfq.update({ where: { id }, data });
  return NextResponse.json({
    rfq: { ...rfq, status: normalizeStatus(rfq.status) as RfqStatus },
  });
}
