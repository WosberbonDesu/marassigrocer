/**
 * v2 — Pair each extracted PDF image with its following smask, apply the
 * mask as alpha in an ISOLATED sharp pass, then flatten onto white in a
 * SECOND pass (sharp applies flatten before joinChannel within a single
 * pipeline, which caused black backgrounds in v1).
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "catalog-images";
const OUT = "catalog-images/final";
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => f.endsWith(".png")).sort();
const metas = [];
for (const f of files) {
  const m = await sharp(path.join(SRC, f)).metadata();
  metas.push({ f, w: m.width, h: m.height, ch: m.channels });
}

let kept = 0, masked = 0, skipped = 0;
for (let i = 0; i < metas.length; i++) {
  const cur = metas[i];
  if (i > 0) {
    const prev = metas[i - 1];
    if (cur.ch === 1 && prev.ch >= 3 && cur.w === prev.w && cur.h === prev.h) continue; // is a mask
  }
  if (cur.w < 150 || cur.h < 130) { skipped++; continue; }
  if (cur.w > 2000 && cur.h > 1500) { skipped++; continue; }

  const next = metas[i + 1];
  const hasMask = next && next.ch === 1 && next.w === cur.w && next.h === cur.h;

  let out;
  if (hasMask) {
    // Pass 1: srgb 3-channel raw
    const rgb = await sharp(path.join(SRC, cur.f))
      .toColorspace("srgb")
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alpha = await sharp(path.join(SRC, next.f))
      .toColorspace("b-w")
      .raw()
      .toBuffer();
    // Manual composite onto white: out = rgb*a + 255*(1-a)
    const { width, height, channels } = rgb.info;
    const px = rgb.data;
    const merged = Buffer.alloc(width * height * 3);
    for (let p = 0, q = 0; p < width * height; p++, q += 3) {
      const a = alpha[p] / 255;
      const s = p * channels;
      merged[q] = Math.round(px[s] * a + 255 * (1 - a));
      merged[q + 1] = Math.round(px[s + 1] * a + 255 * (1 - a));
      merged[q + 2] = Math.round(px[s + 2] * a + 255 * (1 - a));
    }
    out = await sharp(merged, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 88 })
      .toBuffer();
    masked++;
  } else {
    out = await sharp(path.join(SRC, cur.f))
      .toColorspace("srgb")
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 88 })
      .toBuffer();
  }
  fs.writeFileSync(path.join(OUT, cur.f.replace(".png", ".jpg")), out);
  kept++;
}
console.log(`kept=${kept} (masked=${masked}) skipped=${skipped}`);
