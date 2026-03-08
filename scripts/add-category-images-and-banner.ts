import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

const db = new PrismaClient();
const PICTURES_DIR = path.join(process.cwd(), "pictures");

async function uploadImageToCloudinary(
  filePath: string,
  folder: string,
  publicName?: string
) {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await uploadToCloudinary(buffer, `marassi/${folder}`);
    console.log(`✅ Uploaded: ${publicName || path.basename(filePath)}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to upload:`, error);
    return null;
  }
}

async function getFilesFromDir(dirPath: string): Promise<string[]> {
  const files = fs.readdirSync(dirPath);
  return files
    .filter((f) => f.match(/\.(png|jpg|jpeg|webp)$/i))
    .map((f) => path.join(dirPath, f))
    .slice(0, 10); // İlk 10 resmi al
}

async function main() {
  console.log("🌱 Adding category images and banner images...\n");

  const categories = {
    bisküvi: "biscuits",
    içecek: "beverages",
    sos: "sauces-condiments",
  };

  const categoryImages: Record<string, string> = {};
  const bannerImages: string[] = [];
  let bannerCount = 0;

  // ── Upload category images ────────────────────────────────────────
  console.log("📸 Uploading category images...\n");

  for (const [folderKey, categorySlug] of Object.entries(categories)) {
    const categoryDirPath = path.join(PICTURES_DIR, folderKey);

    if (!fs.existsSync(categoryDirPath)) {
      console.warn(`⏭️  Folder not found: ${folderKey}`);
      continue;
    }

    const imageFiles = await getFilesFromDir(categoryDirPath);

    if (imageFiles.length === 0) {
      console.warn(`⏭️  No images found in: ${folderKey}`);
      continue;
    }

    // İlk resmi kategori image'ı olarak kullan
    const categoryImagePath = imageFiles[0];
    const categoryImage = await uploadImageToCloudinary(
      categoryImagePath,
      "categories",
      `${categorySlug}-category`
    );

    if (categoryImage) {
      categoryImages[categorySlug] = categoryImage.url;

      // Banner'a da ekle (ilk 6 image)
      if (bannerCount < 6) {
        bannerImages.push(categoryImage.url);
        bannerCount++;
      }
    }

    // Kalan resimleri banner'a ekle
    for (let i = 1; i < imageFiles.length && bannerCount < 6; i++) {
      const bannerImagePath = imageFiles[i];
      const bannerImage = await uploadImageToCloudinary(
        bannerImagePath,
        "banner",
        `banner-${bannerCount + 1}`
      );

      if (bannerImage) {
        bannerImages.push(bannerImage.url);
        bannerCount++;
      }
    }
  }

  console.log(`\n✅ Collected ${bannerImages.length} banner images\n`);

  // ── Update categories with images ────────────────────────────────
  console.log("🔄 Updating categories with images...\n");

  for (const [categorySlug, imageUrl] of Object.entries(categoryImages)) {
    const updated = await db.category.update({
      where: { slug: categorySlug },
      data: { image: imageUrl },
    });
    console.log(`✅ Updated category: ${updated.name}`);
  }

  // ── Save banner images to config (opsiyonel) ──────────────────────
  console.log(`\n✅ Banner images ready (${bannerImages.length}):`);
  bannerImages.forEach((img, idx) => {
    console.log(`   ${idx + 1}. ${img.substring(0, 80)}...`);
  });

  console.log("\n💡 Banner images URLs (use in hero section):");
  console.log(JSON.stringify(bannerImages, null, 2));

  console.log("\n🎉 Complete!");
  console.log(
    "📝 Add these URLs to your hero/banner component for rotating images."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
