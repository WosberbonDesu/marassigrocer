import { NextResponse } from "next/server";
import { privateLabelSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = privateLabelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // TODO: Send email notification to private label team
    // TODO: Push to CRM pipeline
    console.log("[Private Label Inquiry]", parsed.data);

    return NextResponse.json({
      success: true,
      message: "Private label inquiry received",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
