/**
 * Full catalog rebuild from the Marassi Group Catalogue 2026 PDF extraction.
 *
 * Input: scripts/catalog-2026-products.json  (produced by the mapping workflow)
 *        catalog-images/final/*.jpg          (composited product photos)
 *
 * Steps:
 *   1. Upload each referenced product image to Cloudinary (catalog-2026/<slug>)
 *   2. Ensure categories exist (adds tea-coffee, frozen-foods if missing)
 *   3. Upsert brands (new brands get theme monogram logos like fill-brand-market-images)
 *   4. DELETE all existing products (explicitly requested full rebuild)
 *   5. Insert catalog products
 *
 * Run: tsx scripts/import-catalog-2026.ts
 */
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import data from "./catalog-2026-products.json";

const db = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CatalogProduct {
  slug: string;
  name: string;
  brand: string;
  size?: string;
  categoryHint: string;
  imageFile: string;
  isMultiVariantGroup?: boolean;
  confidence?: string;
}

const IMAGES_DIR = "catalog-images/final";

// categoryHint → real category slug
const CATEGORY_MAP: Record<string, string> = {
  beverages: "beverages",
  "tea-coffee": "tea-coffee",
  dairy: "dairy",
  "snacks-confectionery": "snacks-confectionery",
  biscuits: "biscuits",
  "oils-condiments": "oils-condiments",
  "sauces-condiments": "sauces-condiments",
  "canned-jarred-foods": "canned-jarred-foods",
  "pasta-rice-grains": "pasta-rice-grains",
  "cleaning-products": "cleaning-products",
  "personal-care-cosmetics": "personal-care-cosmetics",
  "baby-products": "baby-products",
  "frozen-foods": "frozen-foods",
  "food-products-other": "canned-jarred-foods",
};

const NEW_CATEGORIES = [
  { slug: "tea-coffee", name: "Tea & Coffee", description: "Tea, coffee, instant mixes and hot beverages.", order: 13 },
  { slug: "frozen-foods", name: "Frozen Foods", description: "Frozen vegetables, fruits and mozzarella.", order: 14 },
];

// Brand origin overrides (default: Egypt)
const BRAND_ORIGIN: Record<string, string> = {
  "Red Bull": "Austria",
  Milka: "Germany",
  Galaxy: "UAE",
  Today: "Turkey",
  Toffix: "Turkey",
  Halley: "Turkey",
  Ulker: "Turkey",
  "Al-Kbous Tea": "Yemen",
  Lipton: "UAE",
  Almarai: "Saudi Arabia",
  Moussy: "Saudi Arabia",
  SunTop: "Saudi Arabia",
  "McVitie's": "UAE",
  Marassi: "Turkey/Egypt",
};

function brandSvg(display: string, tagline: string): string {
  const fontSize = display.length > 8 ? 44 : 60;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#171208"/><stop offset="1" stop-color="#241c0c"/>
  </linearGradient></defs>
  <rect width="400" height="200" rx="16" fill="url(#bg)"/>
  <rect x="6" y="6" width="388" height="188" rx="12" fill="none" stroke="#c9a84c" stroke-opacity="0.35" stroke-width="1.5"/>
  <text x="200" y="105" text-anchor="middle" font-family="Georgia, serif" font-size="${fontSize}" font-weight="bold" fill="#e3c778">${display}</text>
  <text x="200" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" letter-spacing="6" fill="#c9a84c" fill-opacity="0.65">${tagline}</text>
</svg>`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const products = (data as { products: CatalogProduct[] }).products;
  console.log(`Catalog products to import: ${products.length}`);

  // ---- 1. Ensure categories ----
  for (const c of NEW_CATEGORIES) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, description: c.description, order: c.order },
    });
  }
  const categories = await db.category.findMany({ select: { id: true, slug: true } });
  const catBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  // ---- 2. Upsert brands ----
  const brandNames = [...new Set(products.map((p) => p.brand))];
  const brandIdByName = new Map<string, string>();
  for (const name of brandNames) {
    const slug = slugify(name);
    let brand = await db.brand.findUnique({ where: { slug } });
    if (!brand) {
      // upload monogram logo
      const tagline = (BRAND_ORIGIN[name] ?? "Egypt").toUpperCase().slice(0, 14);
      const svg = brandSvg(name, tagline);
      const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
      const up = await cloudinary.uploader.upload(dataUri, {
        public_id: `brand-logos/${slug}`,
        overwrite: true,
        resource_type: "image",
        format: "svg",
      });
      const pngUrl = up.secure_url.replace("/upload/", "/upload/w_800,f_png/").replace(/\.svg$/, ".png");
      brand = await db.brand.create({
        data: {
          slug,
          name,
          origin: BRAND_ORIGIN[name] ?? "Egypt",
          logo: pngUrl,
          logoPublicId: up.public_id,
        },
      });
      console.log(`+ brand ${name}`);
    }
    brandIdByName.set(name, brand.id);
  }

  // ---- 3. Upload product images ----
  const imageUrlBySlug = new Map<string, string>();
  let uploaded = 0;
  for (const p of products) {
    if (!p.imageFile) continue;
    const file = path.join(IMAGES_DIR, p.imageFile);
    if (!fs.existsSync(file)) {
      console.log(`⚠  missing image file: ${p.imageFile} (${p.slug})`);
      continue;
    }
    const res = await cloudinary.uploader.upload(file, {
      public_id: `catalog-2026/${p.slug}`,
      overwrite: true,
      resource_type: "image",
    });
    imageUrlBySlug.set(p.slug, res.secure_url);
    uploaded++;
    if (uploaded % 25 === 0) console.log(`  …uploaded ${uploaded} images`);
  }
  console.log(`Uploaded ${uploaded} product images to Cloudinary`);

  // ---- 4. Wipe existing products ----
  const del = await db.product.deleteMany({});
  console.log(`Deleted ${del.count} existing products`);

  // ---- 5. Insert catalog products ----
  let created = 0;
  const seenSlugs = new Set<string>();
  for (const p of products) {
    let slug = p.slug;
    while (seenSlugs.has(slug)) slug = `${slug}-2`;
    seenSlugs.add(slug);

    const catSlug = CATEGORY_MAP[p.categoryHint] ?? "canned-jarred-foods";
    const categoryId = catBySlug.get(catSlug);
    if (!categoryId) {
      console.log(`⚠  no category for ${p.slug} (${p.categoryHint})`);
      continue;
    }
    const image = imageUrlBySlug.get(p.slug);
    await db.product.create({
      data: {
        slug,
        name: p.name,
        description: p.isMultiVariantGroup
          ? `${p.name} — assorted flavors/variants available for export. Contact us for the full variant list, case configurations and container quantities.`
          : `${p.name} — export-ready FMCG product. Contact us for case configurations, pricing and container quantities.`,
        categoryId,
        brandId: brandIdByName.get(p.brand) ?? null,
        images: image ? [image] : [],
        originCountries: [(BRAND_ORIGIN[p.brand] ?? "Egypt").split("/")[0]],
        availability: "in_stock",
        moqHint: "MOQ: negotiable — mixed container friendly",
        published: true,
        featured: false,
        packDescription: p.size || null,
      },
    });
    created++;
  }
  console.log(`Created ${created} products`);

  // Feature a curated hero set (well-known brands)
  const heroSlugPrefixes = ["red-bull", "coca-cola", "pepsi", "nescafe", "nido", "heinz", "milka", "oreo", "doritos", "lipton", "maggi", "persil"];
  for (const prefix of heroSlugPrefixes) {
    const prod = await db.product.findFirst({ where: { slug: { startsWith: prefix } } });
    if (prod) await db.product.update({ where: { id: prod.id }, data: { featured: true } });
  }
  console.log("Featured hero products set.");

  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
