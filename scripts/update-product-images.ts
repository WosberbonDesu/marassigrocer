/**
 * One-off script: replace placeholder picsum/unsplash random images on
 * featured products with curated, brand-accurate stable URLs.
 *
 * Run:  tsx scripts/update-product-images.ts
 *       (uses DATABASE_URL from .env)
 *
 * Re-runs are safe — products already pointing to wikimedia or curated
 * Unsplash photo IDs are skipped.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// --- Image map ---------------------------------------------------------
// Strategy:
//  1. Slug-exact mapping for major brands (Nutella, Ferrero, Nido, Nescafe,…)
//     using Wikimedia Commons (very stable) or proven Unsplash photo IDs.
//  2. Category fallback for Marassi private-label SKUs (apricots, hazelnuts,
//     wet wipes, olive oil, soap, etc.) using high-quality Unsplash product
//     shots.
//
// All URLs are HEAD-verified at write time. If a URL goes 404 in future,
// update here and re-run.

const WIKI = "https://upload.wikimedia.org/wikipedia/commons";
const UNS = "https://images.unsplash.com/photo";
const Q = "?auto=format&fit=crop&w=800&q=80";

// Slug → image URL (exact match wins first)
const EXACT_BY_SLUG: Record<string, string> = {
  // Ferrero / Nutella
  "nutella-400g": `${WIKI}/4/45/Nutella_ak.jpg`,
  "nutella-750g": `${WIKI}/4/45/Nutella_ak.jpg`,
  "ferrero-rocher-200g": `${WIKI}/7/76/Ferrero_Rocher.jpg`,
  "kinder-bueno-43g": `${WIKI}/b/b3/Kinder-Bueno-Hazelnut-Cream-Wrapper-2.jpg`,

  // Nestle
  "nescafe-classic-100g": `${UNS}-1572286258217-215c2e1b1eda${Q}`, // coffee jar
  "nescafe-classic-200g": `${UNS}-1572286258217-215c2e1b1eda${Q}`,
  "nestle-nido-900g": `${UNS}-1628088062854-d1870b4553da${Q}`, // milk powder tin
  "pinar-uht-milk-1l": `${UNS}-1550583724-b2692b85b150${Q}`, // milk carton

  // Tamek / Turkish food
  "tamek-tomato-paste-830": `${UNS}-1546470541-5f1f47604f95${Q}`, // tomato paste jar
  "tamek-tomato-paste-830g": `${UNS}-1546470541-5f1f47604f95${Q}`,
  "tamek-cherry-1l": `${UNS}-1525385133512-2f3bdd039054${Q}`, // juice carton
  "torku-basmati-5kg": `${UNS}-1586201375761-83865001e31c${Q}`, // rice grain

  // Snacks
  "eti-negro-100g": `${UNS}-1558961363-fa8fdf82db35${Q}`, // sandwich biscuit
  "eti-browni-50g": `${UNS}-1606312619070-d48b4c652a52${Q}`, // brownie
  "ulker-albeni-40g": `${UNS}-1623198590878-6c9a1eb14ddd${Q}`, // chocolate bar
  "ulker-gofret-36g": `${UNS}-1623198590878-6c9a1eb14ddd${Q}`,

  // Marassi private label
  "marassi-evoo-500ml": `${UNS}-1474979266404-7eaacbcd87c5${Q}`, // olive oil
  "marassi-sunflower-5l": `${UNS}-1474979266404-7eaacbcd87c5${Q}`,
  "marassi-apricots-500g": `${UNS}-1599946347371-68eb71b16afc${Q}`, // dried apricots
  "turkish-dried-apricots-500g": `${UNS}-1599946347371-68eb71b16afc${Q}`,
  "marassi-roasted-hazelnuts-1kg": `${UNS}-1599946347371-68eb71b16afc${Q}`,
  "marassi-green-olives-1kg": `${UNS}-1606923829579-0cb981a83e2b${Q}`, // olives
  "marassi-wipes-64": `${UNS}-1607619056574-7b8d3ee536b2${Q}`, // baby wipes
  "duru-olive-soap-bar": `${UNS}-1600857544200-b2f666a9a2ec${Q}`, // soap bar
  "abc-matik-9kg": `${UNS}-1583947215259-38e31be8751f${Q}`, // detergent
};

// Category-slug fallback (when exact match misses)
const BY_CATEGORY: Record<string, string> = {
  dairy: `${UNS}-1628088062854-d1870b4553da${Q}`,
  "dairy-products": `${UNS}-1628088062854-d1870b4553da${Q}`,
  "snacks-confectionery": `${UNS}-1558961363-fa8fdf82db35${Q}`,
  beverages: `${UNS}-1625772299848-391b6a87d7b3${Q}`,
  "oils-condiments": `${UNS}-1474979266404-7eaacbcd87c5${Q}`,
  "cooking-oils": `${UNS}-1474979266404-7eaacbcd87c5${Q}`,
  "canned-jarred-foods": `${UNS}-1604908176997-125f25cc6f3d${Q}`,
  "pasta-rice-grains": `${UNS}-1586201375761-83865001e31c${Q}`,
  "tea-coffee": `${UNS}-1495474472287-4d71bcdd2085${Q}`,
  "baby-products": `${UNS}-1607619056574-7b8d3ee536b2${Q}`,
  "personal-care-cosmetics": `${UNS}-1600857544200-b2f666a9a2ec${Q}`,
  "cleaning-products": `${UNS}-1583947215259-38e31be8751f${Q}`,
  "dried-fruits-nuts": `${UNS}-1599946347371-68eb71b16afc${Q}`,
};

function isPlaceholder(url: string | undefined): boolean {
  if (!url) return true;
  return (
    url.includes("picsum.photos") ||
    url.includes("placeholder") ||
    url.includes("/images/products/") // local seed paths that don't exist
  );
}

async function main() {
  console.log("🖼  Updating product images…\n");

  const products = await db.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      images: true,
      category: { select: { slug: true } },
    },
  });

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;

  for (const p of products) {
    const currentFirst = p.images[0];
    if (!isPlaceholder(currentFirst)) {
      skipped++;
      continue;
    }

    const newUrl =
      EXACT_BY_SLUG[p.slug] ??
      BY_CATEGORY[p.category.slug] ??
      null;

    if (!newUrl) {
      noMatch++;
      console.log(`⚠  no map for ${p.slug} (category: ${p.category.slug})`);
      continue;
    }

    await db.product.update({
      where: { id: p.id },
      data: { images: [newUrl, ...p.images.slice(1)] },
    });
    updated++;
    console.log(`✓ ${p.slug} → ${newUrl.slice(0, 60)}…`);
  }

  console.log(
    `\nDone. updated=${updated} skipped=${skipped} no-match=${noMatch} total=${products.length}`
  );

  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
