import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin1234!",
    12
  );
  await db.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@marassigroup.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@marassigroup.com",
      password: hashedPassword,
      name: "Marassi Admin",
    },
  });
  console.log("✅ Admin user created");

  // Site config
  await db.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      whatsapp: "+201050483361",
      email: "export@marassigroup.com",
      companyName: "Marassi Group",
      offices: [
        {
          id: "istanbul",
          city: "Istanbul",
          country: "Turkey",
          address: "Kurtköy, Pendik, Istanbul 34912, Turkey",
          phone: "+90 216 XXX XXXX",
          email: "istanbul@marassigroup.com",
        },
        {
          id: "egypt",
          city: "Damanhour",
          country: "Egypt",
          address: "Damanhour, Beheira, Egypt",
          phone: "+20 105 048 3361",
          email: "egypt@marassigroup.com",
        },
        {
          id: "dubai",
          city: "Dubai",
          country: "UAE",
          address: "Dubai, United Arab Emirates",
          phone: "+971 XX XXX XXXX",
          email: "dubai@marassigroup.com",
        },
      ],
    },
  });
  console.log("✅ Site config created");

  // ── Categories ───────────────────────────────────────────────
  const categoryData = [
    { name: "Dairy Products", slug: "dairy", description: "Milk, cheese, butter and yogurt", image: "/images/categories/dairy.jpg", order: 1, featured: true },
    { name: "Snacks & Confectionery", slug: "snacks-confectionery", description: "Biscuits, chocolate, wafers and candy", image: "/images/categories/snacks.jpg", order: 2, featured: true },
    { name: "Beverages", slug: "beverages", description: "Juices, water, coffee and tea", image: "/images/categories/beverages.jpg", order: 3, featured: true },
    { name: "Cleaning Products", slug: "cleaning-products", description: "Laundry detergents, dishwashing and household cleaners", image: "/images/categories/cleaning.jpg", order: 4, featured: false },
    { name: "Personal Care & Cosmetics", slug: "personal-care-cosmetics", description: "Soaps, shampoos and personal hygiene", image: "/images/categories/personal-care.jpg", order: 5, featured: false },
    { name: "Canned & Jarred Foods", slug: "canned-jarred-foods", description: "Tomato paste, olives, preserves and canned goods", image: "/images/categories/canned.jpg", order: 6, featured: true },
    { name: "Pasta, Rice & Grains", slug: "pasta-rice-grains", description: "Spaghetti, penne, rice and flour", image: "/images/categories/pasta.jpg", order: 7, featured: false },
    { name: "Oils & Condiments", slug: "oils-condiments", description: "Sunflower oil, olive oil and sauces", image: "/images/categories/oils.jpg", order: 8, featured: false },
    { name: "Baby Products", slug: "baby-products", description: "Diapers, baby food and care items", image: "/images/categories/baby.jpg", order: 9, featured: false },
    { name: "Dried Fruits & Nuts", slug: "dried-fruits-nuts", description: "Apricots, hazelnuts and mixed nuts", image: "/images/categories/dried-fruits.jpg", order: 10, featured: true },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log(`✅ ${categoryData.length} categories created`);

  // ── Brands ───────────────────────────────────────────────────
  const brandData = [
    { name: "Ulker", slug: "ulker", origin: "Turkey", description: "Turkey's leading biscuit and confectionery brand" },
    { name: "ETi", slug: "eti", origin: "Turkey", description: "Premium Turkish snacks and biscuit manufacturer" },
    { name: "Ferrero", slug: "ferrero", origin: "Italy/Turkey", description: "Global confectionery brand — Nutella, Kinder" },
    { name: "Nestle", slug: "nestle", origin: "Switzerland/Turkey", description: "Global food & beverage giant" },
    { name: "Unilever", slug: "unilever", origin: "Netherlands/Turkey", description: "FMCG multinational" },
    { name: "Hayat", slug: "hayat", origin: "Turkey", description: "Turkish natural spring water brand" },
    { name: "Duru", slug: "duru", origin: "Turkey", description: "Premium Turkish personal care brand" },
    { name: "Torku", slug: "torku", origin: "Turkey", description: "Konya Seker cooperative food brand" },
    { name: "Pinar", slug: "pinar", origin: "Turkey", description: "Turkey's leading dairy brand by Yasar Holding" },
    { name: "ABC Deterjan", slug: "abc-deterjan", origin: "Turkey", description: "Turkish cleaning products manufacturer" },
    { name: "SEK", slug: "sek", origin: "Turkey", description: "Turkish dairy products brand" },
    { name: "Tamek", slug: "tamek", origin: "Turkey", description: "Turkey's leading canned food and juice brand" },
    { name: "Marassi", slug: "marassi", origin: "Turkey/Egypt", description: "Marassi Group private label products" },
  ];

  const brands: Record<string, string> = {};
  for (const brand of brandData) {
    const created = await db.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
    brands[brand.slug] = created.id;
  }
  console.log(`✅ ${brandData.length} brands created`);

  // ── Products ─────────────────────────────────────────────────
  const productData = [
    // Snacks & Confectionery
    {
      name: "Nutella Hazelnut Spread 750g", slug: "nutella-750g",
      description: "Iconic hazelnut chocolate spread. Turkey origin. Glass jar packaging. The world's most popular hazelnut spread used in over 160 countries.",
      categorySlug: "snacks-confectionery", brandSlug: "ferrero",
      images: ["/images/products/nutella-750.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x750g", casesPerLayer: 10, casesPerPallet: 60 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (60 cases)",
      specs: { "Weight": "750g", "Packaging": "Glass Jar", "Cases/Pallet": "60", "Origin": "Turkey" },
      featured: true, seoTitle: "Nutella 750g for Export | Marassi Group",
      seoDesc: "Buy Nutella 750g glass jar in bulk. B2B export from Turkey. MOQ 1 pallet.",
    },
    {
      name: "Nutella Hazelnut Spread 400g", slug: "nutella-400g",
      description: "Nutella 400g jar — the world's most popular hazelnut spread. Glass jar packaging from Turkey.",
      categorySlug: "snacks-confectionery", brandSlug: "ferrero",
      images: ["/images/products/nutella-400.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "15x400g", casesPerLayer: 12, casesPerPallet: 72 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (72 cases)",
      specs: { "Weight": "400g", "Packaging": "Glass Jar", "Cases/Pallet": "72", "Origin": "Turkey" },
      featured: true,
    },
    {
      name: "Kinder Bueno 43g", slug: "kinder-bueno-43g",
      description: "Crispy wafer bar with hazelnut cream filling, coated in milk chocolate. Two individually wrapped bars per pack.",
      categorySlug: "snacks-confectionery", brandSlug: "ferrero",
      images: ["/images/products/kinder-bueno.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "30x43g", casesPerLayer: 18, casesPerPallet: 108 },
      shelfLifeMin: 270, shelfLifeMax: 365, moqHint: "MOQ: 1 pallet (108 cases)",
      specs: { "Weight": "43g", "Bars": "2 per pack", "Cases/Pallet": "108", "Origin": "Turkey" },
      featured: true, seoTitle: "Kinder Bueno 43g Export | Marassi Group",
      seoDesc: "Buy Kinder Bueno 43g in bulk for export. Turkey origin, B2B pricing.",
    },
    {
      name: "Ulker Cikolatali Gofret 36g", slug: "ulker-gofret-36g",
      description: "Turkey's #1 chocolate wafer. Crispy layers with rich chocolate cream. A classic Turkish snack since 1944.",
      categorySlug: "snacks-confectionery", brandSlug: "ulker",
      images: ["/images/products/ulker-gofret.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "24x36g", casesPerLayer: 20, casesPerPallet: 120 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (120 cases)",
      specs: { "Weight": "36g", "Flavor": "Chocolate", "Cases/Pallet": "120", "Origin": "Turkey" },
      featured: true,
    },
    {
      name: "Ulker Petit Beurre 175g", slug: "ulker-petit-beurre-175g",
      description: "Classic petit beurre biscuits. A Turkish household staple since 1944. Perfect for export to MENA and beyond.",
      categorySlug: "snacks-confectionery", brandSlug: "ulker",
      images: ["/images/products/ulker-petit-beurre.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "24x175g", casesPerLayer: 15, casesPerPallet: 90 },
      shelfLifeMin: 545, shelfLifeMax: 730, moqHint: "MOQ: 1 pallet (90 cases)",
      specs: { "Weight": "175g", "Type": "Petit Beurre", "Cases/Pallet": "90", "Origin": "Turkey" },
    },
    {
      name: "ETi Browni Intense 50g", slug: "eti-browni-50g",
      description: "Rich, moist chocolate browni cake with chocolate chips. Turkey's bestselling browni brand.",
      categorySlug: "snacks-confectionery", brandSlug: "eti",
      images: ["/images/products/eti-browni.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "24x50g", casesPerLayer: 18, casesPerPallet: 108 },
      shelfLifeMin: 180, shelfLifeMax: 270, moqHint: "MOQ: 1 pallet (108 cases)",
      specs: { "Weight": "50g", "Type": "Browni Cake", "Cases/Pallet": "108", "Origin": "Turkey" },
      featured: true,
    },
    {
      name: "ETi Tutku Chocolate Biscuit 100g", slug: "eti-tutku-100g",
      description: "Chocolate-coated sandwich biscuit with cocoa cream filling. Mosaic pattern design.",
      categorySlug: "snacks-confectionery", brandSlug: "eti",
      images: ["/images/products/eti-tutku.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "24x100g", casesPerLayer: 16, casesPerPallet: 96 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (96 cases)",
      specs: { "Weight": "100g", "Coating": "Chocolate", "Cases/Pallet": "96", "Origin": "Turkey" },
    },
    {
      name: "Torku Banada Chocolate Spread 700g", slug: "torku-banada-700g",
      description: "Hazelnut-cocoa spread by Torku. Competitive alternative to Nutella from Turkey's Konya Seker cooperative.",
      categorySlug: "snacks-confectionery", brandSlug: "torku",
      images: ["/images/products/torku-banada.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x700g", casesPerLayer: 10, casesPerPallet: 60 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (60 cases)",
      specs: { "Weight": "700g", "Type": "Hazelnut-Cocoa", "Cases/Pallet": "60", "Origin": "Turkey" },
    },
    // Dairy
    {
      name: "Pinar Full Fat UHT Milk 1L", slug: "pinar-uht-milk-1l",
      description: "Premium UHT full cream milk 3.5% fat. Tetra Pak packaging. Turkey's leading dairy brand.",
      categorySlug: "dairy", brandSlug: "pinar",
      images: ["/images/products/pinar-uht.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x1L", casesPerLayer: 15, casesPerPallet: 90 },
      shelfLifeMin: 180, shelfLifeMax: 270, moqHint: "MOQ: 1 pallet (90 cases)",
      specs: { "Volume": "1L", "Fat": "3.5%", "Packaging": "Tetra Pak", "Cases/Pallet": "90" },
      featured: true,
    },
    {
      name: "SEK White Cheese 500g", slug: "sek-white-cheese-500g",
      description: "Traditional Turkish white cheese made from cow's milk. Vacuum-packed for freshness.",
      categorySlug: "dairy", brandSlug: "sek",
      images: ["/images/products/sek-white-cheese.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x500g", casesPerLayer: 10, casesPerPallet: 60 },
      shelfLifeMin: 120, shelfLifeMax: 180, moqHint: "MOQ: 1 pallet (60 cases)",
      specs: { "Weight": "500g", "Type": "Cow Milk", "Packaging": "Vacuum", "Cases/Pallet": "60" },
    },
    {
      name: "Nestle NIDO Milk Powder 900g", slug: "nestle-nido-900g",
      description: "Full cream milk powder enriched with vitamins. Globally trusted NIDO brand.",
      categorySlug: "dairy", brandSlug: "nestle",
      images: ["/images/products/nido-900.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x900g", casesPerLayer: 8, casesPerPallet: 48 },
      shelfLifeMin: 545, shelfLifeMax: 730, moqHint: "MOQ: 1 pallet (48 cases)",
      specs: { "Weight": "900g", "Type": "Full Cream Powder", "Cases/Pallet": "48", "Origin": "Turkey" },
      featured: true,
    },
    {
      name: "Pinar Butter 250g", slug: "pinar-butter-250g",
      description: "Premium Turkish butter made from fresh cream. 82% fat content. Foil-wrapped.",
      categorySlug: "dairy", brandSlug: "pinar",
      images: ["/images/products/pinar-butter.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "24x250g", casesPerLayer: 12, casesPerPallet: 72 },
      shelfLifeMin: 180, shelfLifeMax: 365, moqHint: "MOQ: 1 pallet (72 cases)",
      specs: { "Weight": "250g", "Fat": "82%", "Packaging": "Foil Wrap", "Cases/Pallet": "72" },
    },
    // Beverages
    {
      name: "Nescafe Classic 200g", slug: "nescafe-classic-200g",
      description: "The world's favourite instant coffee. Glass jar packaging from Turkey.",
      categorySlug: "beverages", brandSlug: "nestle",
      images: ["/images/products/nescafe-classic.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x200g", casesPerLayer: 12, casesPerPallet: 72 },
      shelfLifeMin: 545, shelfLifeMax: 730, moqHint: "MOQ: 1 pallet (72 cases)",
      specs: { "Weight": "200g", "Type": "Instant Coffee", "Packaging": "Glass Jar", "Cases/Pallet": "72" },
      featured: true,
    },
    {
      name: "Tamek Mixed Fruit Juice 1L", slug: "tamek-mixed-juice-1l",
      description: "100% natural mixed fruit juice with no added sugar. Tetra Pak packaging from Turkey.",
      categorySlug: "beverages", brandSlug: "tamek",
      images: ["/images/products/tamek-juice.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x1L", casesPerLayer: 15, casesPerPallet: 90 },
      shelfLifeMin: 180, shelfLifeMax: 365, moqHint: "MOQ: 1 pallet (90 cases)",
      specs: { "Volume": "1L", "Type": "Mixed Fruit", "Sugar": "No Added", "Cases/Pallet": "90" },
    },
    {
      name: "Hayat Water 500ml", slug: "hayat-water-500ml",
      description: "Natural spring water in PET bottle. Shrink-wrapped packs of 24.",
      categorySlug: "beverages", brandSlug: "hayat",
      images: ["/images/products/hayat-water.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "24x500ml", casesPerLayer: 20, casesPerPallet: 100 },
      moqHint: "MOQ: 1 pallet (100 cases)", availability: "in_stock",
      specs: { "Volume": "500ml", "Type": "Natural Spring", "Packaging": "PET", "Cases/Pallet": "100" },
    },
    // Cleaning
    {
      name: "ABC Powder Detergent 4kg", slug: "abc-powder-detergent-4kg",
      description: "High-efficiency powder laundry detergent for all machines. Lemon scent.",
      categorySlug: "cleaning-products", brandSlug: "abc-deterjan",
      images: ["/images/products/abc-detergent.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "5x4kg", casesPerLayer: 8, casesPerPallet: 48 },
      moqHint: "MOQ: 1 pallet (48 cases)", availability: "in_stock",
      specs: { "Weight": "4kg", "Type": "Powder", "Wash Loads": "~50", "Cases/Pallet": "48" },
    },
    {
      name: "ABC Dishwashing Liquid 750ml", slug: "abc-dishwashing-750ml",
      description: "Concentrated dishwashing liquid. High foam, lemon scent.",
      categorySlug: "cleaning-products", brandSlug: "abc-deterjan",
      images: ["/images/products/abc-dishwashing.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x750ml", casesPerLayer: 12, casesPerPallet: 72 },
      moqHint: "MOQ: 1 pallet (72 cases)", availability: "in_stock",
      specs: { "Volume": "750ml", "Scent": "Lemon", "Type": "Concentrated", "Cases/Pallet": "72" },
    },
    // Personal Care
    {
      name: "Duru Fresh Sensations Soap 4x150g", slug: "duru-soap-4pack",
      description: "Premium bar soap with ocean breeze fragrance. 4-pack in cardboard box.",
      categorySlug: "personal-care-cosmetics", brandSlug: "duru",
      images: ["/images/products/duru-soap.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x4pack", casesPerLayer: 10, casesPerPallet: 60 },
      moqHint: "MOQ: 1 pallet (60 cases)", availability: "in_stock",
      specs: { "Weight": "4x150g", "Scent": "Ocean Breeze", "Packaging": "Cardboard Box", "Cases/Pallet": "60" },
    },
    {
      name: "Marassi Baby Diapers Size 4 (Maxi)", slug: "marassi-baby-diapers-size4",
      description: "Premium baby diapers with elastic waistband and double leak guards. Private label available.",
      categorySlug: "baby-products", brandSlug: "marassi",
      images: ["/images/products/marassi-diapers.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "4x50pcs", casesPerLayer: 8, casesPerPallet: 48 },
      moqHint: "MOQ: 1 pallet (48 cases)", availability: "in_stock",
      specs: { "Size": "4 (Maxi) 7-18kg", "Count": "50 pcs/pack", "Cases/Pallet": "48" },
    },
    // Canned & Jarred
    {
      name: "Tamek Tomato Paste 830g Tin", slug: "tamek-tomato-paste-830g",
      description: "Double concentrated tomato paste. Brix 28-30%. Tin can packaging.",
      categorySlug: "canned-jarred-foods", brandSlug: "tamek",
      images: ["/images/products/tamek-tomato-paste.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x830g", casesPerLayer: 10, casesPerPallet: 80 },
      shelfLifeMin: 545, shelfLifeMax: 730, moqHint: "MOQ: 1 pallet (80 cases)",
      specs: { "Weight": "830g", "Brix": "28-30%", "Packaging": "Tin Can", "Cases/Pallet": "80" },
      featured: true,
    },
    {
      name: "Green Olives 700g Jar", slug: "green-olives-700g",
      description: "Whole pitted green olives in brine. Glass jar. Grown in Turkey's Aegean region.",
      categorySlug: "canned-jarred-foods", brandSlug: "marassi",
      images: ["/images/products/olives-700.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "12x700g", casesPerLayer: 10, casesPerPallet: 60 },
      shelfLifeMin: 365, shelfLifeMax: 730, moqHint: "MOQ: 1 pallet (60 cases)", availability: "on_request",
      specs: { "Weight": "700g", "Type": "Whole Pitted Green", "Packaging": "Glass Jar", "Cases/Pallet": "60" },
    },
    // Pasta
    {
      name: "Torku Spaghetti 500g", slug: "torku-spaghetti-500g",
      description: "Durum wheat spaghetti pasta. Bronze die cut for better sauce adhesion.",
      categorySlug: "pasta-rice-grains", brandSlug: "torku",
      images: ["/images/products/torku-spaghetti.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "20x500g", casesPerLayer: 15, casesPerPallet: 90 },
      shelfLifeMin: 545, shelfLifeMax: 730, moqHint: "MOQ: 1 pallet (90 cases)",
      specs: { "Weight": "500g", "Type": "Durum Wheat", "Shape": "Spaghetti", "Cases/Pallet": "90" },
    },
    // Oils
    {
      name: "Sunflower Oil 5L PET", slug: "sunflower-oil-5l",
      description: "Refined sunflower oil in 5L PET bottle. For retail and food service sectors.",
      categorySlug: "oils-condiments", brandSlug: "marassi",
      images: ["/images/products/sunflower-oil-5l.jpg"],
      originCountries: ["Turkey", "Ukraine"],
      packaging: { unitType: "case", caseSize: "4x5L", casesPerLayer: 10, casesPerPallet: 60 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (60 cases)", availability: "on_request",
      specs: { "Volume": "5L", "Type": "Refined", "Packaging": "PET Bottle", "Cases/Pallet": "60" },
    },
    // Dried Fruits & Nuts
    {
      name: "Turkish Dried Apricots 500g", slug: "turkish-dried-apricots-500g",
      description: "Sun-dried Turkish apricots from Malatya. No added sugar or sulfites. World's finest apricots.",
      categorySlug: "dried-fruits-nuts", brandSlug: "marassi",
      images: ["/images/products/dried-apricots.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "20x500g", casesPerLayer: 12, casesPerPallet: 72 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (72 cases)",
      specs: { "Weight": "500g", "Origin": "Malatya, Turkey", "Type": "Sun-Dried", "Cases/Pallet": "72" },
      featured: true,
    },
    {
      name: "Raw Hazelnuts 1kg", slug: "raw-hazelnuts-1kg",
      description: "Premium raw hazelnuts from the Black Sea region of Turkey (Giresun/Ordu). World's finest hazelnut.",
      categorySlug: "dried-fruits-nuts", brandSlug: "marassi",
      images: ["/images/products/hazelnuts-raw.jpg"],
      originCountries: ["Turkey"],
      packaging: { unitType: "case", caseSize: "10x1kg", casesPerLayer: 10, casesPerPallet: 60 },
      shelfLifeMin: 365, shelfLifeMax: 545, moqHint: "MOQ: 1 pallet (60 cases)", availability: "on_request",
      specs: { "Weight": "1kg", "Origin": "Giresun/Ordu, Turkey", "Type": "Raw Kernel", "Cases/Pallet": "60" },
    },
  ];

  let productCount = 0;
  for (const p of productData) {
    const { categorySlug, brandSlug, ...rest } = p;
    await db.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        availability: (rest as { availability?: string }).availability ?? "in_stock",
        specs: rest.specs ?? {},
        imagePublicIds: [],
        categoryId: categories[categorySlug],
        brandId: brands[brandSlug],
      },
    });
    productCount++;
  }
  console.log(`✅ ${productCount} products created`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
