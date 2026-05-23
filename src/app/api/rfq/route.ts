import { NextResponse } from "next/server";
import { rfqFormSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { sendRfqNotification } from "@/lib/email";
import type { PromoType } from "@prisma/client";

async function resolvePromo(code: string | undefined) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const promo = await db.promoCode.findUnique({ where: { code: normalized } });
  const now = new Date();
  if (!promo || !promo.active) return null;
  if (promo.validFrom && promo.validFrom > now) return null;
  if (promo.validUntil && promo.validUntil < now) return null;
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses) return null;
  return promo;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rfqFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items } = body;
    const { categories: _categories, promoCode, ...dbData } = parsed.data;
    const promo = await resolvePromo(promoCode);

    const rfq = await db.rfq.create({
      data: {
        ...dbData,
        items: items ?? [],
        promoCode: promo?.code ?? null,
        promoType: (promo?.type as PromoType) ?? null,
        promoValue: promo?.value ?? null,
      },
    });

    if (promo) {
      await db.promoCode.update({
        where: { id: promo.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    if (process.env.RESEND_API_KEY) {
      sendRfqNotification({
        id: rfq.id,
        name: rfq.name,
        email: rfq.email,
        phone: rfq.phone ?? undefined,
        company: rfq.company ?? undefined,
        country: rfq.country,
        buyerType: rfq.buyerType,
        containerEstimate: rfq.containerEstimate ?? undefined,
        targetPrice: rfq.targetPrice ?? undefined,
        notes: rfq.notes ?? undefined,
        items: Array.isArray(items) ? items : [],
      }).catch((err) => console.error("[RFQ Email Error]", err));
    }

    return NextResponse.json({ success: true, id: rfq.id, promoApplied: !!promo });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
