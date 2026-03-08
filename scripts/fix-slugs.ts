import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function toAsciiSlug(slug: string): string {
  return slug
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/Ü/g, "u")
    .replace(/Ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/Ş/g, "s")
    .replace(/Ğ/g, "g")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const products = await db.product.findMany({ select: { id: true, slug: true } });

  let fixed = 0;
  for (const p of products) {
    const newSlug = toAsciiSlug(p.slug);
    if (newSlug !== p.slug) {
      // check conflict
      const existing = await db.product.findUnique({ where: { slug: newSlug } });
      if (existing && existing.id !== p.id) {
        console.warn(`⚠️  Conflict: ${p.slug} → ${newSlug} (already exists), skipping`);
        continue;
      }
      await db.product.update({ where: { id: p.id }, data: { slug: newSlug } });
      console.log(`✅ ${p.slug} → ${newSlug}`);
      fixed++;
    }
  }

  console.log(`\n✅ Fixed ${fixed} slugs`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
