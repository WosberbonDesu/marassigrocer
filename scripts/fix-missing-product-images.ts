import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

const db = new PrismaClient();
const PICTURES_DIR = path.join(process.cwd(), "pictures");

async function main() {
  // Resmi olmayan veya /images/ ile başlayan (local, yok) ürünleri bul
  const products = await db.product.findMany({
    select: { id: true, name: true, images: true, category: { select: { slug: true } } },
  });

  const needsFix = products.filter(
    (p) => p.images.length === 0 || p.images[0].startsWith("/images/")
  );

  console.log(`Found ${needsFix.length} products needing images\n`);

  // Her kategori için kullanılacak resim havuzu
  const imagePool: Record<string, string[]> = {};
  for (const folder of ["bisküvi", "içecek", "sos"]) {
    const dirPath = path.join(PICTURES_DIR, folder);
    if (fs.existsSync(dirPath)) {
      imagePool[folder] = fs
        .readdirSync(dirPath)
        .filter((f) => f.match(/\.(png|jpg|jpeg|webp)$/i))
        .map((f) => path.join(dirPath, f));
    }
  }

  // Kategori slug -> resim klasörü eşleştirme
  const categoryToFolder: Record<string, string> = {
    "snacks-confectionery": "bisküvi",
    "biscuits": "bisküvi",
    "beverages": "beverages",
    "dairy": "içecek",
    "oils-condiments": "sos",
    "sauces-condiments": "sos",
    "canned-jarred-foods": "sos",
    "cleaning-products": "bisküvi",
    "personal-care-cosmetics": "bisküvi",
    "baby-products": "bisküvi",
    "pasta-rice-grains": "bisküvi",
    "dried-fruits-nuts": "bisküvi",
  };

  const counters: Record<string, number> = {};

  for (const product of needsFix) {
    const folder = categoryToFolder[product.category.slug] || "bisküvi";
    const pool = imagePool[folder] || imagePool["bisküvi"];

    if (!pool || pool.length === 0) continue;

    // Her ürüne farklı resim ver (round-robin)
    counters[folder] = ((counters[folder] || 0) + 1) % pool.length;
    const imagePath = pool[counters[folder]];

    console.log(`📤 Uploading for: ${product.name}`);

    try {
      const buffer = fs.readFileSync(imagePath);
      const result = await uploadToCloudinary(buffer, `marassi/products`);

      await db.product.update({
        where: { id: product.id },
        data: {
          images: [result.url],
          imagePublicIds: [result.publicId],
        },
      });

      console.log(`✅ ${product.name}`);
    } catch (err) {
      console.error(`❌ ${product.name}:`, err);
    }
  }

  console.log("\n🎉 Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
