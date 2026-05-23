import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const STRING_FIELDS = [
  "whatsapp",
  "email",
  "companyName",
  "siteTitle",
  "siteDescription",
  "ogImage",
  "gtmId",
  "metaPixelId",
  "ga4Id",
  "facebookUrl",
  "instagramUrl",
  "tiktokUrl",
  "linkedinUrl",
  "twitterUrl",
  "youtubeUrl",
] as const;

function buildData(body: Record<string, unknown>): Prisma.SiteConfigUpdateInput {
  const out: Prisma.SiteConfigUpdateInput = {};
  for (const key of STRING_FIELDS) {
    if (key in body) {
      const v = body[key];
      if (v === "" || v == null) {
        out[key] = null;
      } else if (typeof v === "string") {
        out[key] = v;
      }
    }
  }
  if ("offices" in body) {
    out.offices = body.offices as Prisma.InputJsonValue;
  }
  if ("showPricesPublicly" in body) {
    out.showPricesPublicly = !!body.showPricesPublicly;
  }
  return out;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await db.siteConfig.findUnique({ where: { id: "default" } });
  return NextResponse.json({ config });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data = buildData(body);
    const config = await db.siteConfig.upsert({
      where: { id: "default" },
      update: { ...data, updatedAt: new Date() },
      create: { id: "default", ...(data as Prisma.SiteConfigCreateInput), updatedAt: new Date() },
    });
    return NextResponse.json({ config });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
