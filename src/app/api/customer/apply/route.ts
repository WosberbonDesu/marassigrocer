import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const applySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2),
  company: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().optional(),
  buyerType: z.string().optional(),
  taxId: z.string().optional(),
  website: z.string().optional(),
  applicationMsg: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = applySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const existing = await db.customer.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const customer = await db.customer.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        company: data.company,
        country: data.country,
        phone: data.phone || null,
        buyerType: data.buyerType || null,
        taxId: data.taxId || null,
        website: data.website || null,
        applicationMsg: data.applicationMsg || null,
        status: "PENDING",
      },
      select: { id: true, email: true, status: true },
    });

    // Fire-and-forget email notification to admin
    if (process.env.RESEND_API_KEY) {
      import("@/lib/email")
        .then((mod) => {
          const fn = (mod as Record<string, unknown>).sendCustomerApplicationNotification;
          if (typeof fn === "function") {
            (fn as (data: typeof customer & { name: string; company: string; country: string }) => Promise<unknown>)(
              { ...customer, name: data.name, company: data.company, country: data.country }
            ).catch((err) => console.error("[Customer email]", err));
          }
        })
        .catch(() => {});
    }

    return NextResponse.json({ ok: true, customer });
  } catch {
    return NextResponse.json({ error: "Application failed" }, { status: 500 });
  }
}
