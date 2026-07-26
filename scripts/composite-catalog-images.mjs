/**
 * Pair each extracted PDF image with its following smask (same dims, 1-channel),
 * composite onto white, save as JPEG. Skip small decorative images.
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "catalog-images";
const OUT = "catalog-images/final";
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => f.endsWith(".png")).sort();
const metas = [];
for (const f of files) {
  const m = await sharp(path.join(SRC, f)).metadata();
  metas.push({ f, w: m.width, h: m.height, ch: m.channels, space: m.space });
}

let kept = 0, skipped = 0, masked = 0;
for (let i = 0; i < metas.length; i++) {
  const cur = metas[i];
  // Skip if this file is itself a grayscale mask (paired with previous)
  if (i > 0) {
    const prev = metas[i - 1];
    if (cur.ch === 1 && prev.ch >= 3 && cur.w === prev.w && cur.h === prev.h) continue;
  }
  // Too small = logo/decoration
  if (cur.w < 150 || cur.h < 130) { skipped++; continue; }
  // Full-page backgrounds
  if (cur.w > 2000 && cur.h > 1500) { skipped++; continue; }

  const next = metas[i + 1];
  const hasMask = next && next.ch === 1 && next.w === cur.w && next.h === cur.h;

  const img = sharp(path.join(SRC, cur.f)).toColorspace("srgb");
  let out;
  if (hasMask) {
    const alpha = await sharp(path.join(SRC, next.f)).toColorspace("b-w").raw().toBuffer();
    out = await img
      .ensureAlpha()
      .joinChannel(alpha, { raw: { width: cur.w, height: cur.h, channels: 1 } })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 88 })
      .toBuffer();
    masked++;
  } else {
    out = await img.flatten({ background: "#ffffff" }).jpeg({ quality: 88 }).toBuffer();
  }
  const outName = cur.f.replace(".png", ".jpg");
  fs.writeFileSync(path.join(OUT, outName), out);
  kept++;
}
console.log(`kept=${kept} (masked=${masked}) skipped-small/bg=${skipped}`);
