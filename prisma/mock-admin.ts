// Mock data for admin panel modules — populates Advantages, Markets, Certificates,
// BlogPosts, PromoCodes, CustomerGroups, Customers, RFQs, Pages, extra AdminUsers.
// Idempotent — safe to re-run.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedAdminMock(db: PrismaClient) {
  console.log("🌱 Seeding admin mock data...");

  // ─── ADVANTAGES (Why Marassi) ──────────────────────────────────
  const advantages = [
    { title: "29 Years of Experience", description: "Trusted FMCG distribution and supply experience since 1996.", icon: "Trophy", stat: "29+", statLabel: "years", order: 1 },
    { title: "Direct Factory Sourcing", description: "Direct factory pricing means stronger commercial value passed to our partners.", icon: "Factory", stat: null, statLabel: null, order: 2 },
    { title: "4,000 m² Warehouse", description: "Ready stock of foodstuffs and detergents for fast supply and same-week dispatch.", icon: "Warehouse", stat: "4,000", statLabel: "m²", order: 3 },
    { title: "75+ Factory Partners", description: "End-to-end private label support with 75+ factory partnerships worldwide.", icon: "Award", stat: "75+", statLabel: "factories", order: 4 },
    { title: "Wholesale & Retail Experience", description: "Proven track record supplying supermarket chains and wholesale businesses across 50+ countries.", icon: "Building2", stat: null, statLabel: null, order: 5 },
    { title: "Broad Product Catalog", description: "Commodities and international brands across the full FMCG spectrum.", icon: "Package", stat: "10,000+", statLabel: "products", order: 6 },
    { title: "Mixed Container Flexibility", description: "One shipment can carry up to 50 different products from our catalog.", icon: "Truck", stat: "50", statLabel: "SKU/container", order: 7 },
    { title: "8+ Sourcing Countries", description: "Sourcing from Turkey, Egypt, UAE, India, Vietnam, Thailand, China, and Saudi Arabia.", icon: "Globe", stat: "8+", statLabel: "countries", order: 8 },
    { title: "Supervised Loading", description: "Competitive container solutions with supervised loading for shipment safety.", icon: "Ship", stat: null, statLabel: null, order: 9 },
  ];
  for (const a of advantages) {
    await db.advantage.upsert({
      where: { id: `adv-${a.order}` },
      update: a,
      create: { id: `adv-${a.order}`, ...a },
    });
  }
  console.log(`  ✅ ${advantages.length} advantages`);

  // ─── EXPORT MARKETS ───────────────────────────────────────────
  const markets = [
    {
      slug: "gcc",
      name: "Gulf Cooperation Council",
      region: "GCC",
      countries: ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Bahrain", "Oman"],
      description: "Premium retail and HORECA distribution across the Gulf — strong demand for branded FMCG, halal-certified products, and Arabic-labeled packaging.",
      featuredCategories: ["Snacks", "Beverages", "Personal Care", "Dairy"],
      regulatoryNotes: "Halal certification required for food products. Arabic labeling mandatory for retail. Customs clearance via local partners.",
      order: 1,
    },
    {
      slug: "mena",
      name: "Middle East & North Africa",
      region: "MENA",
      countries: ["Egypt", "Jordan", "Iraq", "Lebanon", "Libya", "Algeria", "Morocco", "Tunisia"],
      description: "Volume-driven markets with strong demand for affordable FMCG, cleaning products, and basic commodities. Mixed-container shipments dominate.",
      featuredCategories: ["Cleaning", "Pasta & Rice", "Oils", "Canned Foods"],
      regulatoryNotes: "Country-specific labeling. Most accept English + Arabic. Some markets require pre-export inspection (e.g., Algeria).",
      order: 2,
    },
    {
      slug: "africa",
      name: "Sub-Saharan Africa",
      region: "Africa",
      countries: ["Nigeria", "Kenya", "Ghana", "Ivory Coast", "Sudan", "South Africa", "Senegal"],
      description: "Fast-growing FMCG markets — high demand for private label, value-tier products, and durable packaging for long transit.",
      featuredCategories: ["Detergents", "Beverages", "Pasta", "Baby Products"],
      regulatoryNotes: "Pre-shipment inspection (SONCAP, PVoC, COC) required for many countries. Specific labeling and shelf-life requirements.",
      order: 3,
    },
    {
      slug: "europe",
      name: "European Union",
      region: "Europe",
      countries: ["Germany", "France", "Italy", "Spain", "Netherlands", "Poland", "UK"],
      description: "Specialty and ethnic foods, premium positioning. Halal/Kosher channels and traditional Middle-Eastern/Turkish food retail.",
      featuredCategories: ["Specialty Foods", "Confectionery", "Olive Products", "Dried Fruits"],
      regulatoryNotes: "EU food safety compliance (Regulation 1169/2011). CE marking for non-food. EORI number for customs.",
      order: 4,
    },
    {
      slug: "asia",
      name: "South & Southeast Asia",
      region: "Asia",
      countries: ["India", "Pakistan", "Indonesia", "Malaysia", "Philippines", "Vietnam", "Thailand"],
      description: "Emerging FMCG markets with strong volume potential. Strong demand for both branded and private-label imports.",
      featuredCategories: ["Snacks", "Dairy", "Personal Care", "Beverages"],
      regulatoryNotes: "Country-specific FSSAI / MOH / BPOM registrations. Halal compliance required in Muslim-majority markets.",
      order: 5,
    },
  ];
  for (const m of markets) {
    await db.market.upsert({
      where: { slug: m.slug },
      update: m,
      create: { ...m, active: true },
    });
  }
  console.log(`  ✅ ${markets.length} export markets`);

  // ─── CERTIFICATES ─────────────────────────────────────────────
  const certs = [
    { id: "cert-iso22000", title: "ISO 22000:2018 Food Safety", issuer: "Bureau Veritas", description: "Food Safety Management System certification covering procurement, storage, and export operations.", order: 1 },
    { id: "cert-haccp", title: "HACCP Certification", issuer: "SGS", description: "Hazard Analysis & Critical Control Points certification for all food handling operations.", order: 2 },
    { id: "cert-halal", title: "Halal Certification", issuer: "GIMDES", description: "Recognized across the GCC and MENA region — covers all Marassi-branded food products.", order: 3 },
    { id: "cert-iso9001", title: "ISO 9001:2015 Quality", issuer: "TÜV Rheinland", description: "Quality Management System certification across sourcing, warehousing, and export documentation processes.", order: 4 },
    { id: "cert-brc", title: "BRC Global Standard", issuer: "NSF", description: "Internationally recognized food safety standard required by major retailers in the UK and Europe.", order: 5 },
  ];
  for (const c of certs) {
    await db.certificate.upsert({
      where: { id: c.id },
      update: c,
      create: {
        ...c,
        issuedDate: new Date("2024-03-01"),
        validUntil: new Date("2027-03-01"),
        active: true,
      },
    });
  }
  console.log(`  ✅ ${certs.length} certificates`);

  // ─── BLOG POSTS ───────────────────────────────────────────────
  const blogPosts = [
    {
      slug: "guide-importing-fmcg-from-turkey",
      title: { en: "A buyer's guide to importing FMCG from Turkey", tr: "Türkiye'den FMCG ithalat rehberi", ar: "دليل استيراد FMCG من تركيا", ru: "Руководство по импорту FMCG из Турции" },
      excerpt: { en: "Everything wholesale buyers need to know about sourcing food and non-food FMCG from Turkish manufacturers — quality, logistics, and pricing.", tr: "Toptan alıcıların Türk üreticilerden gıda ve gıda dışı FMCG tedariki için bilmesi gerekenler.", ar: "كل ما يحتاج المشترون بالجملة معرفته عن استيراد المنتجات الاستهلاكية من المصنعين الأتراك.", ru: "Все, что оптовые покупатели должны знать о поставках FMCG из Турции." },
      content: { en: "<h2>Why Turkey for FMCG sourcing</h2><p>Turkey is one of the largest FMCG producers in the region, with strong export infrastructure and competitive pricing. Manufacturers like Ülker, ETi, Pinar, and Nestlé Turkey serve over 50 countries.</p><h2>Key advantages</h2><ul><li>Strategic location between Europe, MENA, and Asia</li><li>Free trade agreements with 30+ countries</li><li>Advanced manufacturing standards (ISO, BRC, HACCP)</li><li>Competitive pricing vs. Western European alternatives</li></ul><h2>Process</h2><p>Working with an export consolidator like Marassi Group simplifies the journey — single quotation, mixed container loading, full documentation, and one point of contact.</p>", tr: "", ar: "", ru: "" },
      tags: ["Turkey", "Sourcing", "Export Guide"],
      author: "Marassi Export Team",
      status: "PUBLISHED",
      publishedAt: new Date("2025-09-15"),
    },
    {
      slug: "mixed-container-explained",
      title: { en: "Mixed container shipments: how to load 50 products in one container", tr: "Karma konteyner sevkiyatları", ar: "شحنات الحاويات المختلطة", ru: "Смешанные контейнерные отгрузки" },
      excerpt: { en: "Save on logistics costs and reduce single-product MOQ by combining up to 50 SKUs in one consolidated shipment.", tr: "Lojistik maliyetlerini düşürmenin yolu: tek konteynerde 50 farklı ürün.", ar: "كيفية تحميل 50 منتجاً في حاوية واحدة.", ru: "Как загрузить 50 товаров в один контейнер." },
      content: { en: "<h2>The basics</h2><p>A mixed container allows you to import multiple SKUs in a single consolidated shipment. This is the gold standard for distributors, retailers, and growing wholesalers who want product variety without committing to a full container per item.</p><h2>How loading is planned</h2><p>Our logistics team optimizes for maximum cube and weight utilization. Cold-chain products are segregated. Heavier items (oils, canned goods) go on the bottom; lighter goods (snacks, paper products) on top.</p>", tr: "", ar: "", ru: "" },
      tags: ["Logistics", "Container", "Mixed Shipment"],
      author: "Sales Operations",
      status: "PUBLISHED",
      publishedAt: new Date("2025-10-22"),
    },
    {
      slug: "halal-compliance-export-checklist",
      title: { en: "Halal compliance: export checklist for MENA markets", tr: "Helal uyum: MENA pazarları için ihracat listesi", ar: "قائمة الامتثال الحلال للأسواق", ru: "Соответствие халяль: чек-лист для рынков MENA" },
      excerpt: { en: "Step-by-step compliance requirements when shipping food and personal care products to GCC and MENA markets.", tr: "GCC ve MENA pazarlarına gıda ve kişisel bakım ürünleri gönderirken uyum gereksinimleri.", ar: "متطلبات الامتثال خطوة بخطوة عند الشحن إلى أسواق الخليج.", ru: "Пошаговые требования соответствия для отгрузки в страны Персидского залива." },
      content: { en: "<h2>What halal certification covers</h2><p>Halal certification confirms that products and their ingredients comply with Islamic dietary law. For exporters, it's the entry ticket to GCC retail.</p>", tr: "", ar: "", ru: "" },
      tags: ["Halal", "GCC", "Compliance", "MENA"],
      author: "Compliance Desk",
      status: "PUBLISHED",
      publishedAt: new Date("2025-11-10"),
    },
    {
      slug: "private-label-trends-2026",
      title: { en: "Private label trends to watch in 2026", tr: "2026'da özel marka trendleri", ar: "اتجاهات العلامة الخاصة في 2026", ru: "Тренды собственных торговых марок 2026" },
      excerpt: { en: "From ingredient transparency to sustainable packaging — the private label trends reshaping FMCG buying decisions in 2026.", tr: "İçerik şeffaflığından sürdürülebilir ambalaja kadar 2026 trendleri.", ar: "اتجاهات تشكل قرارات الشراء.", ru: "Тренды, формирующие решения о закупках." },
      content: { en: "<h2>1. Ingredient transparency</h2><p>Buyers in 2026 demand clean labels, regional sourcing stories, and traceability from farm to shelf.</p>", tr: "", ar: "", ru: "" },
      tags: ["Private Label", "Trends", "2026"],
      author: "Product Marketing",
      status: "DRAFT",
      publishedAt: null,
    },
  ];
  for (const p of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: p.slug },
      update: { title: p.title, excerpt: p.excerpt, content: p.content, tags: p.tags, status: p.status as "DRAFT" | "PUBLISHED", publishedAt: p.publishedAt },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        author: p.author,
        tags: p.tags,
        status: p.status as "DRAFT" | "PUBLISHED",
        publishedAt: p.publishedAt,
      },
    });
  }
  console.log(`  ✅ ${blogPosts.length} blog posts`);

  // ─── PROMO CODES ──────────────────────────────────────────────
  const promos = [
    { code: "WELCOME10", description: "First-time buyer 10% off", type: "PERCENT" as const, value: 10, minOrder: 5000, maxUses: 100, usedCount: 12, active: true },
    { code: "RAMADAN2026", description: "Ramadan campaign — bulk savings", type: "PERCENT" as const, value: 5, minOrder: 20000, maxUses: null, usedCount: 47, active: true, validFrom: new Date("2026-02-15"), validUntil: new Date("2026-04-15") },
    { code: "MIXED50", description: "Mixed container — $500 off", type: "AMOUNT" as const, value: 500, minOrder: 25000, maxUses: 50, usedCount: 8, active: true },
    { code: "EXPIRED-LEGACY", description: "Old code from 2024 — kept for records", type: "PERCENT" as const, value: 15, minOrder: null, maxUses: null, usedCount: 23, active: false, validUntil: new Date("2024-12-31") },
  ];
  for (const p of promos) {
    await db.promoCode.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    });
  }
  console.log(`  ✅ ${promos.length} promo codes`);

  // ─── CUSTOMER GROUPS ──────────────────────────────────────────
  const groups = [
    { id: "grp-tier1", name: "Tier 1 Distributor", description: "Large distributors with annual volume > $500K", defaultDiscount: 12, active: true },
    { id: "grp-tier2", name: "Tier 2 Wholesaler", description: "Medium wholesalers — $100K–$500K annual volume", defaultDiscount: 7, active: true },
    { id: "grp-retail", name: "Supermarket Chain", description: "Direct retail supermarket partners", defaultDiscount: 8, active: true },
    { id: "grp-newpartner", name: "New Partner (Trial)", description: "First 6 months — trial pricing", defaultDiscount: 3, active: true },
  ];
  for (const g of groups) {
    await db.customerGroup.upsert({
      where: { id: g.id },
      update: g,
      create: g,
    });
  }
  console.log(`  ✅ ${groups.length} customer groups`);

  // ─── CUSTOMERS (different statuses) ───────────────────────────
  const hashedDemo = await bcrypt.hash("Demo1234!", 10);
  const customers = [
    { id: "cust-001", email: "ahmed.alfarsi@gulfimports.com", name: "Ahmed Al-Farsi", company: "Gulf Imports LLC", country: "UAE", phone: "+971 50 123 4567", buyerType: "distributor", status: "APPROVED" as const, groupId: "grp-tier1", approvedAt: new Date("2024-08-10"), lastLoginAt: new Date("2026-05-08"), taxId: "AE-100123456" },
    { id: "cust-002", email: "fatima.elsayed@cairofoods.com.eg", name: "Fatima El-Sayed", company: "Cairo Foods Distribution", country: "Egypt", phone: "+20 100 987 6543", buyerType: "distributor", status: "APPROVED" as const, groupId: "grp-tier1", approvedAt: new Date("2024-11-20"), lastLoginAt: new Date("2026-05-10") },
    { id: "cust-003", email: "michael.adeyemi@lagoswholesale.ng", name: "Michael Adeyemi", company: "Lagos Wholesale Co.", country: "Nigeria", phone: "+234 803 555 1212", buyerType: "wholesaler", status: "APPROVED" as const, groupId: "grp-tier2", approvedAt: new Date("2025-01-15"), lastLoginAt: new Date("2026-04-28") },
    { id: "cust-004", email: "sarah.cohen@dssupermarkets.co.za", name: "Sarah Cohen", company: "DS Supermarkets Group", country: "South Africa", phone: "+27 21 789 0123", buyerType: "retail", status: "APPROVED" as const, groupId: "grp-retail", approvedAt: new Date("2025-03-05") },
    { id: "cust-005", email: "abdullah.alharbi@riyadhdist.sa", name: "Abdullah Al-Harbi", company: "Riyadh Distribution Co.", country: "Saudi Arabia", phone: "+966 50 222 3333", buyerType: "distributor", status: "PENDING" as const, applicationMsg: "Interested in volume sourcing for snacks and beverages. Targeting Riyadh + Jeddah retail." },
    { id: "cust-006", email: "marie.dubois@parisexotic.fr", name: "Marie Dubois", company: "Paris Exotic Foods", country: "France", phone: "+33 1 4567 8901", buyerType: "wholesaler", status: "PENDING" as const, applicationMsg: "Specialty food importer — interested in Turkish dairy, olive oils, dried fruits, and confectionery for Halal retail channel in France." },
    { id: "cust-007", email: "raj.patel@mumbaitraders.in", name: "Raj Patel", company: "Mumbai Trading Co.", country: "India", phone: "+91 98 5555 0101", buyerType: "small_business", status: "PENDING" as const },
    { id: "cust-008", email: "luca.romano@romawholesale.it", name: "Luca Romano", company: "Roma Wholesale", country: "Italy", phone: "+39 06 2345 6789", buyerType: "wholesaler", status: "REJECTED" as const, rejectedReason: "Insufficient credit references provided. Welcome to re-apply after 6 months." },
    { id: "cust-009", email: "khalid.almalik@kuwaitfoods.kw", name: "Khalid Al-Malik", company: "Kuwait Foods Trading", country: "Kuwait", phone: "+965 9 876 5432", buyerType: "distributor", status: "SUSPENDED" as const, internalNotes: "Suspended due to overdue invoice. Outstanding $12,400. Reactivate when balance cleared." },
  ];
  for (const c of customers) {
    await db.customer.upsert({
      where: { id: c.id },
      update: c,
      create: { ...c, password: hashedDemo },
    });
  }
  console.log(`  ✅ ${customers.length} customers (with diverse statuses)`);

  // ─── RFQ SUBMISSIONS ──────────────────────────────────────────
  const rfqs = [
    { name: "Ahmed Al-Farsi", email: "ahmed.alfarsi@gulfimports.com", phone: "+971 50 123 4567", company: "Gulf Imports LLC", country: "UAE", buyerType: "distributor", containerEstimate: "40ft", targetPrice: "Competitive bulk pricing for 40ft container", notes: "Mixed shipment needed: chocolate, biscuits, coffee. Halal certification required.", source: "products", items: [{ productId: "demo-1", productName: "Nutella Hazelnut Spread 750g", quantity: 200 }, { productId: "demo-2", productName: "Nescafe Classic Jar 100g", quantity: 300 }], status: "quoted", confirmedAt: null, createdAt: new Date("2026-05-01") },
    { name: "Fatima El-Sayed", email: "fatima.elsayed@cairofoods.com.eg", phone: "+20 100 987 6543", company: "Cairo Foods Distribution", country: "Egypt", buyerType: "distributor", containerEstimate: "40ft", notes: "Looking for tomato paste 830g and 4.5kg formats. Pomegranate sauce.", source: "products", items: [{ productId: "demo-3", productName: "Tamek Tomato Paste 830g Jar", quantity: 500 }, { productId: "demo-4", productName: "Marassi Pomegranate Sauce 350ml", quantity: 200 }], status: "confirmed", confirmedAt: new Date("2026-05-05"), createdAt: new Date("2026-04-28") },
    { name: "Michael Adeyemi", email: "michael.adeyemi@lagoswholesale.ng", phone: "+234 803 555 1212", company: "Lagos Wholesale Co.", country: "Nigeria", buyerType: "wholesaler", containerEstimate: "20ft", notes: "Cleaning products and detergents for Lagos market. Pre-shipment inspection (SONCAP) needed.", source: "quick-order", items: [{ productId: "demo-5", productName: "ABC Matik Laundry Powder 9kg", quantity: 80 }, { productId: "demo-6", productName: "ABC Liquid Laundry 3L", quantity: 120 }], status: "submitted", createdAt: new Date("2026-05-12") },
    { name: "Raj Patel", email: "raj.patel@mumbaitraders.in", phone: "+91 98 5555 0101", company: "Mumbai Trading Co.", country: "India", buyerType: "small_business", containerEstimate: "20ft", notes: "Interested in dried fruits and nuts — apricots, hazelnuts, pistachios.", items: [{ productId: "demo-7", productName: "Marassi Dried Apricots 500g", quantity: 100 }], status: "submitted", createdAt: new Date("2026-05-11") },
    { name: "John O'Brien", email: "john@dublinexotic.ie", phone: "+353 1 234 5678", company: "Dublin Exotic Foods", country: "Ireland", buyerType: "retail", containerEstimate: "not_sure", notes: "First-time inquiry. Looking for olive oil, Turkish coffee, and confectionery for specialty store.", items: [], status: "submitted", createdAt: new Date("2026-05-10") },
    { name: "Sarah Cohen", email: "sarah.cohen@dssupermarkets.co.za", phone: "+27 21 789 0123", company: "DS Supermarkets Group", country: "South Africa", buyerType: "retail", containerEstimate: "40ft", notes: "Q3 2026 forecast: mixed container with 30+ SKUs. Need samples first.", items: [{ productId: "demo-8", productName: "Marassi Green Olives 1kg", quantity: 150 }], status: "quoted", createdAt: new Date("2026-04-20") },
    { name: "Luis Garcia", email: "luis@madridtradingsa.es", phone: "+34 91 234 5678", company: "Madrid Trading SA", country: "Spain", buyerType: "wholesaler", containerEstimate: "20ft", notes: "Halal channel in Spain. Interested in dairy products with Arabic labeling.", items: [], status: "locked", confirmedAt: new Date("2026-03-15"), lockedAt: new Date("2026-03-17"), createdAt: new Date("2026-03-10") },
    { name: "Helena Petrov", email: "helena@moscowimports.ru", phone: "+7 495 555 4444", company: "Moscow Imports", country: "Russia", buyerType: "distributor", containerEstimate: "40ft", notes: "Cancelled due to payment terms not agreed.", items: [{ productId: "demo-9", productName: "Hayat Su Natural Mineral Water 500ml", quantity: 300 }], status: "cancelled", createdAt: new Date("2026-02-08") },
  ];
  // Clear and re-seed RFQs (no unique constraint other than id which is cuid)
  for (const r of rfqs) {
    const existing = await db.rfq.findFirst({
      where: { email: r.email, name: r.name, createdAt: r.createdAt },
    });
    if (!existing) {
      await db.rfq.create({ data: r });
    }
  }
  console.log(`  ✅ ${rfqs.length} RFQ submissions`);

  // ─── PAGES (CMS) ──────────────────────────────────────────────
  const pages = [
    {
      slug: "privacy",
      title: { en: "Privacy Policy", tr: "Gizlilik Politikası", ar: "سياسة الخصوصية", ru: "Политика конфиденциальности" },
      content: { en: "<h2>Introduction</h2><p>Marassi Group respects the privacy of buyers and partners interacting with our platform. This policy explains what data we collect, how we use it, and your rights.</p><h2>What we collect</h2><p>When you submit an RFQ, apply for an account, or contact us, we collect name, email, company, country, and details necessary to respond to your inquiry.</p><h2>How we use data</h2><p>To process your inquiries, prepare quotations, ship orders, and improve our service. We do not sell data to third parties.</p>", tr: "", ar: "", ru: "" },
      excerpt: "How Marassi Group handles your data.",
      published: true,
    },
    {
      slug: "terms",
      title: { en: "Terms & Conditions", tr: "Şartlar ve Koşullar", ar: "الشروط والأحكام", ru: "Условия и положения" },
      content: { en: "<h2>1. Trade terms</h2><p>All quotations are valid for 14 days unless stated otherwise. Pricing is in USD unless agreed in writing.</p><h2>2. Payment</h2><p>Payment by International Bank Transfer (T/T) — terms confirmed per order.</p><h2>3. Shipping</h2><p>Incoterms FOB or CIF as agreed per order. Loading photos provided on request.</p><h2>4. Quality</h2><p>All products meet stated specifications. Claims must be submitted within 30 days of arrival with photographs and lab analysis where applicable.</p>", tr: "", ar: "", ru: "" },
      excerpt: "Commercial terms for trade with Marassi Group.",
      published: true,
    },
    {
      slug: "cookies",
      title: { en: "Cookies Policy", tr: "Çerez Politikası", ar: "سياسة ملفات تعريف الارتباط", ru: "Политика cookies" },
      content: { en: "<h2>What are cookies</h2><p>Small text files stored by your browser. We use them to keep you signed in, remember language preferences, and measure site performance.</p><h2>Types of cookies we use</h2><ul><li>Essential cookies — authentication, RFQ cart</li><li>Analytics cookies — Google Analytics (anonymized)</li><li>Marketing cookies — Meta Pixel (only with consent)</li></ul>", tr: "", ar: "", ru: "" },
      excerpt: "How we use cookies on marassigroup.com.",
      published: true,
    },
  ];
  for (const p of pages) {
    await db.page.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`  ✅ ${pages.length} CMS pages`);

  // ─── EXTRA ADMIN USERS (different roles) ──────────────────────
  const hashedAdmin = await bcrypt.hash("Admin1234!", 10);
  const adminUsers = [
    { email: "owner@marassigroup.com", name: "Owner Account", role: "OWNER" as const },
    { email: "editor@marassigroup.com", name: "Content Editor", role: "EDITOR" as const },
    { email: "sales@marassigroup.com", name: "Sales Rep — Ahmed", role: "SALES_REP" as const },
    { email: "viewer@marassigroup.com", name: "View-only Account", role: "VIEWER" as const },
  ];
  for (const u of adminUsers) {
    await db.adminUser.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, active: true },
      create: { ...u, password: hashedAdmin, active: true },
    });
  }
  console.log(`  ✅ ${adminUsers.length} extra admin users (OWNER/EDITOR/SALES_REP/VIEWER)`);

  console.log("🎉 Admin mock data complete!");
}
