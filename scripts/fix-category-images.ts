import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

const db = new PrismaClient();

async function main() {
  // Dairy -> içecek klasöründen bir resim ata
  const dairyImg = fs.readFileSync(
    path.join(process.cwd(), "pictures/içecek/Gemini_Generated_Image_jjru7pjjru7pjjru.png")
  );
  const dairyResult = await uploadToCloudinary(dairyImg, "marassi/categories");
  await db.category.update({
    where: { slug: "dairy" },
    data: { image: dairyResult.url, imagePublicId: dairyResult.publicId },
  });
  console.log("✅ Dairy image updated");

  // Snacks & Confectionery -> bisküvi klasöründen bir resim ata
  const snacksImg = fs.readFileSync(
    path.join(process.cwd(), "pictures/bisküvi/Gemini_Generated_Image_tpx99stpx99stpx9.png")
  );
  const snacksResult = await uploadToCloudinary(snacksImg, "marassi/categories");
  await db.category.update({
    where: { slug: "snacks-confectionery" },
    data: { image: snacksResult.url, imagePublicId: snacksResult.publicId },
  });
  console.log("✅ Snacks & Confectionery image updated");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
