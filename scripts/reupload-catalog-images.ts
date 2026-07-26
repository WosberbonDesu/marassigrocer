/**
 * Re-upload fixed (white-background) catalog images over the same
 * Cloudinary public_ids, then refresh each product's stored URL to the
 * new version (Cloudinary URLs are version-stamped).
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

const IMAGES_DIR = "catalog-images/final";

async function main() {
  const products = (data as { products: { slug: string; imageFile: string }[] }).products;
  let done = 0;
  for (const p of products) {
    if (!p.imageFile) continue;
    const file = path.join(IMAGES_DIR, p.imageFile);
    if (!fs.existsSync(file)) continue;
    const res = await cloudinary.uploader.upload(file, {
      public_id: `catalog-2026/${p.slug}`,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
    });
    // slug may have been de-duped with -2 suffix at insert; match by startsWith
    const prod = await db.product.findFirst({
      where: { OR: [{ slug: p.slug }, { slug: `${p.slug}-2` }] },
      select: { id: true, images: true },
    });
    if (prod) {
      await db.product.update({
        where: { id: prod.id },
        data: { images: [res.secure_url, ...prod.images.slice(1)] },
      });
    }
    done++;
    if (done % 30 === 0) console.log(`  …${done}`);
  }
  console.log(`Re-uploaded + relinked ${done} images`);
  await db.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
