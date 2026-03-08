import { NextResponse } from "next/server";
import { catalogLeadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = catalogLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // TODO: Save lead to database
    // TODO: Send catalog PDF via email (Resend)
    console.log("[Catalog Lead]", parsed.data);

    return NextResponse.json({
      success: true,
      message: "Catalog download started",
      downloadUrl: "/catalog/marassi-catalog-2025.pdf",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
