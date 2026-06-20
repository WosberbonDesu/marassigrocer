/**
 * Replace broken / placeholder product images with HEAD-verified URLs.
 *
 * Re-runs are safe: anything pointing to a 200-OK Cloudinary or curated
 * URL is left alone; only picsum placeholders, 404 URLs, or missing
 * images get rewritten.
 *
 * Run: tsx scripts/update-product-images.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const UNS = "https://images.unsplash.com/photo";
const Q = "?auto=format&fit=crop&w=800&q=80";

// Only HEAD-verified working photo IDs.
// Last verified: this script run.
const IMG = {
  oliveOil: `${UNS}-1474979266404-7eaacbcd87c5${Q}`,
  olives: `${UNS}-1611080626919-7cf5a9dbab5b${Q}`,
  olivesAlt: `${UNS}-1505253758473-96b7015fcd40${Q}`,
  tomatoPaste: `${UNS}-1592890288564-76628a30a657${Q}`,
  tomatoCan: `${UNS}-1571171637578-41bc2dd41cd2${Q}`,
  cannedFood: `${UNS}-1604908554007-fb432af0dfaf${Q}`,
  coffeeJar: `${UNS}-1559056199-641a0ac8b55e${Q}`,
  coffeeBeans: `${UNS}-1495474472287-4d71bcdd2085${Q}`,
  chocolateBar: `${UNS}-1610450949065-1f2841536c88${Q}`,
  chocolateBarAlt: `${UNS}-1481391319762-47dff72954d9${Q}`,
  cookie: `${UNS}-1558961363-fa8fdf82db35${Q}`,
  brownie: `${UNS}-1606312619070-d48b4c652a52${Q}`,
  nuts: `${UNS}-1599599810769-bcde5a160d32${Q}`,
  apricots: `${UNS}-1599946347371-68eb71b16afc${Q}`,
  milkPowder: `${UNS}-1628088062854-d1870b4553da${Q}`,
  milkCarton: `${UNS}-1550583724-b2692b85b150${Q}`,
  rice: `${UNS}-1586201375761-83865001e31c${Q}`,
  pasta: `${UNS}-1551462147-ff29053bfc14${Q}`,
  juice: `${UNS}-1525385133512-2f3bdd039054${Q}`,
  water: `${UNS}-1625772299848-391b6a87d7b3${Q}`,
  babyWipes: `${UNS}-1607619056574-7b8d3ee536b2${Q}`,
  soap: `${UNS}-1600857544200-b2f666a9a2ec${Q}`,
  detergent: `${UNS}-1583947215259-38e31be8751f${Q}`,
};

const EXACT_BY_SLUG: Record<string, string> = {
  // Spreads + premium chocolate
  "nutella-400g": IMG.chocolateBarAlt,
  "nutella-750g": IMG.chocolateBarAlt,
  "ferrero-rocher-200g": IMG.chocolateBar,
  "kinder-bueno-43g": IMG.chocolateBar,
  "kinder-surprise-20g": IMG.chocolateBar,

  // Nestle
  "nescafe-classic-100g": IMG.coffeeJar,
  "nescafe-classic-200g": IMG.coffeeJar,
  "nestle-nido-900g": IMG.milkPowder,
  "nestle-cereal-250g": IMG.cookie,
  "nestle-formula-1": IMG.milkPowder,
  "pinar-uht-milk-1l": IMG.milkCarton,

  // Tamek (tomato/canned)
  "tamek-tomato-paste-830": IMG.tomatoPaste,
  "tamek-tomato-paste-830g": IMG.tomatoCan,
  "tamek-tomato-paste-45kg": IMG.tomatoCan,
  "tamek-cherry-1l": IMG.juice,
  "tamek-vine-leaves-400g": IMG.cannedFood,
  "tamek-eggplant-400g": IMG.cannedFood,
  "tamek-tahini-300g": IMG.cannedFood,

  // Snacks
  "eti-negro-100g": IMG.cookie,
  "eti-browni-50g": IMG.brownie,
  "ulker-albeni-40g": IMG.chocolateBar,
  "ulker-gofret-36g": IMG.chocolateBarAlt,

  // Marassi private label - oils
  "marassi-evoo-500ml": IMG.oliveOil,
  "marassi-olive-1l-tin": IMG.oliveOil,
  "marassi-sunflower-5l": IMG.oliveOil,
  "marassi-sunflower-1l": IMG.oliveOil,

  // Marassi private label - condiments
  "marassi-ketchup-450g": IMG.tomatoPaste,
  "marassi-mayo-450g": IMG.tomatoPaste,
  "marassi-hot-sauce-350ml": IMG.tomatoPaste,
  "marassi-pom-sauce-350ml": IMG.tomatoPaste,

  // Marassi olives
  "marassi-green-olives-1kg": IMG.olives,
  "marassi-black-olives-1kg": IMG.olivesAlt,
  "marassi-pickles-1kg": IMG.olivesAlt,

  // Marassi dried fruits & nuts
  "marassi-apricots-500g": IMG.apricots,
  "turkish-dried-apricots-500g": IMG.apricots,
  "marassi-sultanas-1kg": IMG.apricots,
  "marassi-roasted-hazelnuts-1kg": IMG.nuts,
  "marassi-pistachios-500g": IMG.nuts,
  "marassi-almonds-1kg": IMG.nuts,
  "marassi-walnuts-500g": IMG.nuts,

  // Marassi pulses
  "marassi-chickpeas-400g": IMG.cannedFood,
  "marassi-kidney-beans-400g": IMG.cannedFood,

  // Marassi baby care
  "marassi-wipes-64": IMG.babyWipes,
  "marassi-diaper-3": IMG.babyWipes,
  "marassi-diaper-4": IMG.babyWipes,
  "marassi-baby-shampoo-400ml": IMG.babyWipes,

  // Duru
  "duru-olive-soap-bar": IMG.soap,
  "duru-bodywash-500ml": IMG.soap,
  "duru-conditioner-600ml": IMG.soap,
  "duru-rollon-50ml": IMG.soap,
  "duru-toothpaste-75ml": IMG.soap,
  "duru-shaving-200ml": IMG.soap,

  // Cleaning
  "abc-matik-9kg": IMG.detergent,
  "abc-toilet-750ml": IMG.detergent,
  "abc-softener-4l": IMG.detergent,
  "abc-multi-spray-750ml": IMG.detergent,

  // Grains
  "torku-basmati-5kg": IMG.rice,
  "torku-jasmine-1kg": IMG.rice,
  "torku-bulgur-coarse-1kg": IMG.rice,
  "torku-flour-5kg": IMG.rice,
  "torku-couscous-500g": IMG.rice,
  "torku-penne-500g": IMG.pasta,
  "torku-fusilli-500g": IMG.pasta,

  // Beverages
  "hayat-water-500ml": IMG.water,
};

const BY_CATEGORY: Record<string, string> = {
  dairy: IMG.milkPowder,
  "dairy-products": IMG.milkPowder,
  "snacks-confectionery": IMG.cookie,
  beverages: IMG.water,
  "oils-condiments": IMG.oliveOil,
  "cooking-oils": IMG.oliveOil,
  "canned-jarred-foods": IMG.cannedFood,
  "pasta-rice-grains": IMG.rice,
  "tea-coffee": IMG.coffeeBeans,
  "baby-products": IMG.babyWipes,
  "personal-care-cosmetics": IMG.soap,
  "cleaning-products": IMG.detergent,
  "dried-fruits-nuts": IMG.nuts,
};

function isStaleOrPlaceholder(url: string | undefined): boolean {
  if (!url) return true;
  return (
    url.includes("picsum.photos") ||
    url.includes("placeholder") ||
    url.includes("/images/products/") ||
    url.includes("upload.wikimedia.org") || // those URLs ended up 404
    // legacy unsplash IDs we now know are 404
    url.includes("photo-1546470541-5f1f47604f95") || // tomato paste 404
    url.includes("photo-1606923829579-0cb981a83e2b") || // olives 404
    url.includes("photo-1623198590878-6c9a1eb14ddd") || // chocolate bar 404
    url.includes("photo-1572286258217-215c2e1b1eda")    // coffee jar 404
  );
}

async function main() {
  console.log("🖼  Refreshing product images (only stale/404 URLs)…\n");

  const products = await db.product.findMany({
    select: {
      id: true,
      slug: true,
      images: true,
      category: { select: { slug: true } },
    },
  });

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;

  for (const p of products) {
    const currentFirst = p.images[0];
    if (!isStaleOrPlaceholder(currentFirst)) {
      skipped++;
      continue;
    }

    const newUrl =
      EXACT_BY_SLUG[p.slug] ?? BY_CATEGORY[p.category.slug] ?? null;
    if (!newUrl) {
      noMatch++;
      console.log(`⚠  no map for ${p.slug} (category: ${p.category.slug})`);
      continue;
    }

    await db.product.update({
      where: { id: p.id },
      data: { images: [newUrl, ...p.images.slice(1)] },
    });
    updated++;
    console.log(`✓ ${p.slug}`);
  }

  console.log(
    `\nDone. updated=${updated} skipped=${skipped} no-match=${noMatch} total=${products.length}`
  );

  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
