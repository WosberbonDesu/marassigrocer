import { NextResponse } from "next/server";
import { rfqFormSchema } from "@/lib/validations";

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

    // TODO: Save to database (Prisma)
    // TODO: Send email notification (Resend)
    // TODO: Push to CRM (HubSpot/Zoho webhook)
    console.log("[RFQ Submitted]", parsed.data);

    return NextResponse.json({ success: true, message: "RFQ received" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
