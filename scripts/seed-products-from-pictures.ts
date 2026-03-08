import { PrismaClient } from "@prisma/client";
import { cloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

const db = new PrismaClient();
const PICTURES_DIR = path.join(process.cwd(), "pictures");

// Kategori ve brand tanımlamaları
const categories = {
  bisküvi: {
    name: "Biscuits",
    slug: "biscuits",
    description: "Premium Turkish biscuits and crackers",
  },
  içecek: {
    name: "Beverages",
    slug: "beverages",
    description: "Juices, coffee, and beverage products",
  },
  sos: {
    name: "Sauces & Condiments",
    slug: "sauces-condiments",
    description: "Sauces, pastes, and condiment products",
  },
};

const brands = [
  { name: "Ulker", slug: "ulker", origin: "Turkey" },
  { name: "ETi", slug: "eti", origin: "Turkey" },
  { name: "Ferrero", slug: "ferrero", origin: "Italy/Turkey" },
  { name: "Nestle", slug: "nestle", origin: "Switzerland/Turkey" },
  { name: "Marassi", slug: "marassi", origin: "Turkey/Egypt" },
  { name: "Tamek", slug: "tamek", origin: "Turkey" },
];

async function uploadImageToCloudinary(filePath: string, folder: string) {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await uploadToCloudinary(buffer, `marassi/products/${folder}`);
    return result;
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    return null;
  }
}

async function getFilesFromDir(dirPath: string): Promise<string[]> {
  const files = fs.readdirSync(dirPath);
  return files
    .filter((f) => f.match(/\.(png|jpg|jpeg|webp)$/i))
    .map((f) => path.join(dirPath, f));
}

async function main() {
  console.log("🌱 Starting bulk product seed from pictures...\n");

  // ── Create categories ───────────────────────────────────────────
  const categoryIds: Record<string, string> = {};
  for (const [key, cat] of Object.entries(categories)) {
    const created = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryIds[key] = created.id;
    console.log(`✅ Category created: ${cat.name}`);
  }

  // ── Create brands ────────────────────────────────────────────────
  const brandIds: Record<string, string> = {};
  for (const brand of brands) {
    const created = await db.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
    brandIds[brand.slug] = created.id;
  }
  console.log(`✅ ${brands.length} brands created\n`);

  // ── Upload images and create products ─────────────────────────────
  let productCount = 0;

  for (const [categoryKey, categoryData] of Object.entries(categories)) {
    const categoryDirPath = path.join(PICTURES_DIR, categoryKey);

    if (!fs.existsSync(categoryDirPath)) {
      console.log(`⏭️  Category folder not found: ${categoryKey}`);
      continue;
    }

    const imageFiles = await getFilesFromDir(categoryDirPath);
    console.log(`\n📁 Processing ${categoryKey} (${imageFiles.length} images)...\n`);

    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i];
      const filename = path.basename(imagePath, path.extname(imagePath));
      const productName = `${categoryData.name} Product ${i + 1}`;
      const productSlug = `${categoryKey}-product-${i + 1}`;

      console.log(`📤 Uploading image ${i + 1}/${imageFiles.length}: ${filename}`);

      // Upload image
      const uploadResult = await uploadImageToCloudinary(imagePath, categoryKey);

      if (!uploadResult) {
        console.warn(`⚠️  Skipping product due to upload failure`);
        continue;
      }

      // Assign random brand
      const randomBrand =
        brands[Math.floor(Math.random() * brands.length)];

      // Create product
      try {
        await db.product.upsert({
          where: { slug: productSlug },
          update: {},
          create: {
            name: productName,
            slug: productSlug,
            description: `Premium ${categoryKey} product sourced from Turkey`,
            categoryId: categoryIds[categoryKey],
            brandId: brandIds[randomBrand.slug],
            images: [uploadResult.url],
            imagePublicIds: [uploadResult.publicId],
            originCountries: ["Turkey"],
            packaging: {
              unitType: "case",
              caseSize: "12x500g",
              casesPerLayer: 10,
              casesPerPallet: 60,
            },
            shelfLifeMin: 180,
            shelfLifeMax: 365,
            moqHint: "MOQ: 1 pallet",
            availability: "in_stock",
            specs: {
              Category: categoryData.name,
              Origin: "Turkey",
              Brand: randomBrand.name,
            },
            published: true,
          },
        });

        console.log(`✅ Product created: ${productName}`);
        productCount++;
      } catch (error) {
        console.error(`❌ Error creating product ${productName}:`, error);
      }
    }
  }

  console.log(`\n🎉 Seed complete! Created ${productCount} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
