/**
 * Apply HEAD-verified image replacements from scripts/image-replacements.json
 * (produced by the products-links-audit workflow) to the production DB.
 *
 * Also unpublishes the stray test product "asf" if present.
 *
 * Run: tsx scripts/apply-image-replacements.ts
 */
import { PrismaClient } from "@prisma/client";
import replacements from "./image-replacements.json";

const db = new PrismaClient();

async function main() {
  let updated = 0;
  for (const [slug, url] of Object.entries(replacements as Record<string, string>)) {
    const product = await db.product.findUnique({
      where: { slug },
      select: { id: true, images: true },
    });
    if (!product) {
      console.log(`⚠  not found: ${slug}`);
      continue;
    }
    await db.product.update({
      where: { id: product.id },
      data: { images: [url, ...product.images.slice(1)] },
    });
    updated++;
    console.log(`✓ ${slug}`);
  }

  // Unpublish leftover test product
  const test = await db.product.findFirst({
    where: { OR: [{ slug: "asf" }, { name: "asf" }] },
    select: { id: true, slug: true, published: true },
  });
  if (test && test.published) {
    await db.product.update({ where: { id: test.id }, data: { published: false } });
    console.log(`✓ unpublished test product "${test.slug}"`);
  }

  console.log(`\nDone. ${updated}/${Object.keys(replacements).length} images updated.`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
