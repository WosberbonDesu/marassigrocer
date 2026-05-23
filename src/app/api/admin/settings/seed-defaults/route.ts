import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const BRIEF_OFFICES = [
  {
    id: "egypt-damanhour",
    country: "Egypt",
    city: "Damanhour",
    address: "Gomhouria St - Sama Residence - Floor 6 - No 32 - Damanhour - Beheira",
    phone: "",
    email: "",
    mapLink: "",
  },
  {
    id: "egypt-cairo",
    country: "Egypt",
    city: "Cairo",
    address: "Obur City - Orabi - Cairo",
    phone: "",
    email: "",
    mapLink: "",
  },
  {
    id: "turkey-istanbul",
    country: "Türkiye",
    city: "Istanbul",
    address:
      "Emniyet Evleri Mah, Eski Büyükdere Cad. Sapphire Towers No: 1 / No: 1B04 - Kağıthane - Istanbul",
    phone: "",
    email: "",
    mapLink: "",
  },
  {
    id: "uae-sharjah",
    country: "UAE",
    city: "Sharjah",
    address: "Business Centre, Publishing City Free Zone - Sharjah",
    phone: "",
    email: "",
    mapLink: "",
  },
];

const BRIEF_DEFAULTS = {
  companyName: "Marassi Group",
  email: "info@marassigroup.com",
  siteTitle: "Marassi Group — Global FMCG Export, Sourcing & Distribution",
  siteDescription:
    "Marassi Group delivers high-quality food and non-food FMCG products to importers, distributors, wholesalers, and retail chains worldwide through trusted sourcing, private label support, mixed container solutions, and reliable logistics.",
  offices: BRIEF_OFFICES,
};

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await db.siteConfig.upsert({
    where: { id: "default" },
    update: BRIEF_DEFAULTS,
    create: { id: "default", ...BRIEF_DEFAULTS, updatedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    config,
    message: `Loaded ${BRIEF_OFFICES.length} office addresses, site title, description, and contact email.`,
  });
}
