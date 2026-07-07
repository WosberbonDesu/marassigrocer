/**
 * Fill null brand logos and market images.
 *
 * - Brands: generates theme-matched SVG monogram cards (black/gold, serif
 *   wordmark), uploads them to Cloudinary, sets brand.logo.
 *   Marassi uses the real local logo (/images/marassilogo.jpeg).
 * - Markets: sets HEAD-verified Unsplash region photos.
 *
 * Idempotent: only fills fields that are currently null.
 *
 * Run: tsx scripts/fill-brand-market-images.ts
 */
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const db = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Wordmark styling per brand (display name + accent tagline)
const BRAND_MARKS: Record<string, { display: string; tagline: string }> = {
  ulker: { display: "Ülker", tagline: "TURKEY" },
  eti: { display: "ETi", tagline: "TURKEY" },
  ferrero: { display: "Ferrero", tagline: "ITALY" },
  nestle: { display: "Nestlé", tagline: "SWITZERLAND" },
  unilever: { display: "Unilever", tagline: "NETHERLANDS" },
  hayat: { display: "Hayat", tagline: "TURKEY" },
  duru: { display: "Duru", tagline: "TURKEY" },
  torku: { display: "Torku", tagline: "TURKEY" },
  pinar: { display: "Pınar", tagline: "TURKEY" },
  "abc-deterjan": { display: "ABC", tagline: "DETERJAN" },
  sek: { display: "SEK", tagline: "TURKEY" },
  tamek: { display: "Tamek", tagline: "TURKEY" },
};

function brandSvg(display: string, tagline: string): string {
  const fontSize = display.length > 8 ? 52 : 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#171208"/>
      <stop offset="1" stop-color="#241c0c"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="16" fill="url(#bg)"/>
  <rect x="6" y="6" width="388" height="188" rx="12" fill="none" stroke="#c9a84c" stroke-opacity="0.35" stroke-width="1.5"/>
  <text x="200" y="105" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="bold" fill="#e3c778">${display}</text>
  <text x="200" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" letter-spacing="6" fill="#c9a84c" fill-opacity="0.65">${tagline}</text>
</svg>`;
}

const MARKET_IMAGES: Record<string, string> = {
  gcc: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", // Dubai skyline
  mena: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80", // Cairo
  africa: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80", // African market street
  europe: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80", // European city
  asia: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80", // Singapore
};

async function main() {
  // ---- Brands ----
  const brands = await db.brand.findMany({
    where: { logo: null },
    select: { id: true, slug: true, name: true },
  });
  console.log(`Brands needing logos: ${brands.length}`);

  for (const b of brands) {
    if (b.slug === "marassi") {
      await db.brand.update({
        where: { id: b.id },
        data: { logo: "/images/marassilogo.jpeg" },
      });
      console.log(`✓ marassi → local real logo`);
      continue;
    }
    const mark = BRAND_MARKS[b.slug] ?? { display: b.name, tagline: "BRAND" };
    const svg = brandSvg(mark.display, mark.tagline);
    const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    const res = await cloudinary.uploader.upload(dataUri, {
      public_id: `brand-logos/${b.slug}`,
      overwrite: true,
      resource_type: "image",
      format: "svg",
    });
    await db.brand.update({
      where: { id: b.id },
      data: { logo: res.secure_url, logoPublicId: res.public_id },
    });
    console.log(`✓ ${b.slug} → ${res.secure_url.slice(0, 70)}`);
  }

  // ---- Markets ----
  const markets = await db.market.findMany({
    where: { image: null },
    select: { id: true, slug: true },
  });
  console.log(`\nMarkets needing images: ${markets.length}`);
  for (const m of markets) {
    const url = MARKET_IMAGES[m.slug];
    if (!url) {
      console.log(`⚠  no image mapped for market ${m.slug}`);
      continue;
    }
    await db.market.update({ where: { id: m.id }, data: { image: url } });
    console.log(`✓ ${m.slug}`);
  }

  console.log("\nDone.");
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
