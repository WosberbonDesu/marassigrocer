import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const certificates = await db.certificate.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      issuer: true,
      issuedDate: true,
      validUntil: true,
      fileUrl: true,
      imageUrl: true,
    },
  });
  return NextResponse.json({ certificates });
}
