import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Yeni eklenen 3 kategoriyi featured yaparak sırasını ayarla
  await db.category.update({
    where: { slug: "biscuits" },
    data: { featured: true, order: 1 },
  });

  await db.category.update({
    where: { slug: "beverages" },
    data: { featured: true, order: 2 },
  });

  await db.category.update({
    where: { slug: "sauces-condiments" },
    data: { featured: true, order: 3 },
  });

  console.log("✅ Categories updated");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
