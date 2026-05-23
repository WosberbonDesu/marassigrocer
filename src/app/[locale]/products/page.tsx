"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  ChevronDown,
  Cookie,
  Milk,
  CupSoda,
  Wheat,
  Soup,
  Coffee,
  Baby,
  SprayCan,
  Droplets,
  ConciergeBell,
  Package,
  ChefHat,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Clock,
  Network,
  FileText,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_BG = "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1920&q=70";
const HERO_PRODUCTS = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
const PRIVATE_LABEL_BG = "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1200&q=80";
const PORT_BG = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=70";

type CategoryCard = {
  slug: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
};

const categories: CategoryCard[] = [
  {
    slug: "biscuits",
    name: "Biscuits & Confectionery",
    description: "Premium biscuits, chocolates, candies and sweet treats.",
    icon: Cookie,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "dairy",
    name: "Dairy Products",
    description: "Milk, cheese, yogurt, butter and dairy essentials.",
    icon: Milk,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "beverages",
    name: "Beverages",
    description: "Juices, soft drinks, energy drinks and more.",
    icon: CupSoda,
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "snacks-confectionery",
    name: "Snacks & Chips",
    description: "Crunchy snacks, chips, pretzels and more.",
    icon: Package,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "oils-condiments",
    name: "Sauces & Condiments",
    description: "Ketchup, sauces, spreads and seasoning.",
    icon: Soup,
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "canned-jarred-foods",
    name: "Canned Foods",
    description: "Canned vegetables, fruits, meats and more.",
    icon: ConciergeBell,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "pasta-rice-grains",
    name: "Dry Foods & Staples",
    description: "Rice, pulses, flour, sugar and everyday staples.",
    icon: Wheat,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "cooking-oils",
    name: "Cooking Oils",
    description: "Sunflower, canola, olive oil and other cooking oils.",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "tea-coffee",
    name: "Tea & Coffee",
    description: "Tea, coffee, instant mixes and hot beverages.",
    icon: Coffee,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "pasta-rice",
    name: "Pasta & Rice",
    description: "Pasta, noodles, rice and grain products.",
    icon: ChefHat,
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "baby-products",
    name: "Baby & Family Products",
    description: "Baby food, diapers, care and family essentials.",
    icon: Baby,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "cleaning-products",
    name: "Cleaning & Household FMCG",
    description: "Detergents, cleaners, and home care products.",
    icon: SprayCan,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
  },
];

const highDemand = [
  {
    title: "Dairy & Milk Powder",
    slug: "dairy",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Canned & Dry Foods",
    slug: "canned-jarred-foods",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Beverages",
    slug: "beverages",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Snacks & Confectionery",
    slug: "snacks-confectionery",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=700&q=80",
  },
];

const trustBullets = [
  { icon: Network, label: "Global Sourcing Network" },
  { icon: Globe, label: "50+ Markets Worldwide" },
  { icon: ShieldCheck, label: "Quality Assured Products" },
  { icon: Clock, label: "On-Time Delivery You Can Trust" },
];

export default function ProductsLandingPage() {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : categories;

  return (
    <div className="bg-background">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_BG} alt="" fill priority className="object-cover opacity-45" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)] via-[oklch(0.14_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/30" />
          {/* Decorative grid pattern */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glow orb */}
          <motion.div
            aria-hidden
            className="absolute right-[15%] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-[oklch(0.78_0.12_80)]/8 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-28 pt-14 sm:px-6 sm:pb-32 sm:pt-20 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:pb-36 lg:pt-24">
          <motion.div
            className="flex-1 lg:max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="mb-5 flex items-center gap-2 text-xs text-white/55">
              <Link href="/" className="transition-colors hover:text-[oklch(0.78_0.12_80)]">Home</Link>
              <span className="text-white/30">/</span>
              <span className="font-medium text-[oklch(0.78_0.12_80)]">Categories</span>
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[oklch(0.78_0.12_80)]"
            >
              Global FMCG Catalog
            </motion.p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
              Explore Our<br />
              <span className="text-[oklch(0.78_0.12_80)]">FMCG Product </span>
              <span>Categories</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
              Discover a wide range of food and non-food FMCG categories sourced for importers, distributors, wholesalers, retailers, and private label partners worldwide.
            </p>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 64 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-7 h-[3px] rounded-full bg-[oklch(0.78_0.12_80)]"
            />
          </motion.div>

          <motion.div
            className="relative hidden flex-1 lg:block"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image src={HERO_PRODUCTS} alt="" fill priority className="rounded-2xl object-cover shadow-2xl shadow-black/40" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── FILTER BAR (raised card) ───────── */}
      <section className="relative bg-background">
        <div className="mx-auto -mt-16 max-w-7xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-[oklch(0.72_0.11_80)]/20 bg-white p-5 shadow-[0_20px_60px_-15px_oklch(0.20_0.02_80/0.18)] sm:p-6"
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr_1fr_auto] lg:items-end">
              <FilterField label="Search category">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search category"
                    className="h-11 w-full rounded-lg border border-border/70 bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground/60 outline-none transition-all focus:border-[oklch(0.72_0.11_80)] focus:ring-2 focus:ring-[oklch(0.72_0.11_80)]/15"
                  />
                </div>
              </FilterField>
              <FilterField label="Market Type">
                <FilterSelect options={["All Markets", "Asia", "Africa", "Middle East", "Europe"]} />
              </FilterField>
              <FilterField label="Product Type">
                <FilterSelect options={["All Products", "Food", "Non-Food", "Beverages"]} />
              </FilterField>
              <FilterField label="Private Label Availability">
                <FilterSelect options={["Any", "Available", "On Request"]} />
              </FilterField>
              <FilterField label="Country / Origin">
                <FilterSelect options={["Any Origin", "Turkey", "Egypt", "UAE", "India", "Vietnam"]} />
              </FilterField>
              <Link href="/products/list" className="block">
                <Button
                  size="lg"
                  className="h-11 w-full bg-[oklch(0.66_0.16_35)] px-7 text-sm font-semibold tracking-wide text-white shadow-md shadow-[oklch(0.66_0.16_35)]/20 transition-all hover:bg-[oklch(0.60_0.17_35)] hover:shadow-lg hover:shadow-[oklch(0.66_0.16_35)]/30"
                >
                  Find Categories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── BROWSE CATEGORIES GRID ───────── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.60_0.12_75)]">
              Product Categories
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              Browse Product Categories
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-14 bg-gradient-to-r from-transparent to-[oklch(0.72_0.11_80)]/70" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.72_0.11_80)]" />
              <div className="h-px w-14 bg-gradient-to-l from-transparent to-[oklch(0.72_0.11_80)]/70" />
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {filtered.map(({ slug, name, description, icon: Icon, image }, i) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl bg-[oklch(0.16_0.02_80)] shadow-[0_8px_24px_-12px_oklch(0.20_0.02_80/0.25)] ring-1 ring-white/[0.02] transition-all duration-300 hover:shadow-[0_24px_50px_-20px_oklch(0.20_0.02_80/0.45)] hover:ring-[oklch(0.78_0.12_80)]/30"
              >
                <Link href={`/products/list?category=${slug}`} className="block">
                  {/* Image area */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.08]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 18vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[oklch(0.14_0.02_80)] via-[oklch(0.14_0.02_80)]/60 to-transparent" />
                    {/* Subtle gold accent line on hover */}
                    <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-transparent via-[oklch(0.78_0.12_80)] to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                  </div>

                  {/* Content */}
                  <div className="relative px-5 pb-5 pt-4 text-white">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.78_0.12_80)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/25 transition-all duration-300 group-hover:bg-[oklch(0.78_0.12_80)]/25 group-hover:ring-[oklch(0.78_0.12_80)]/50">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <h3 className="text-[15px] font-semibold leading-snug tracking-tight">{name}</h3>
                    <p className="mt-2 line-clamp-2 text-[11.5px] leading-relaxed text-white/55">
                      {description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.78_0.12_80)] transition-all group-hover:text-[oklch(0.85_0.10_80)]">
                      Explore Category
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HIGH-DEMAND CATEGORIES ───────── */}
      <section className="relative bg-gradient-to-b from-[oklch(0.97_0.01_85)] to-[oklch(0.94_0.015_85)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.60_0.12_75)]">
              Trending Demand
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight sm:text-3xl">
              High-Demand Categories for International Markets
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[oklch(0.72_0.11_80)]/70" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.72_0.11_80)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[oklch(0.72_0.11_80)]/70" />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highDemand.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-[oklch(0.72_0.11_80)]/15 bg-white shadow-[0_4px_20px_-8px_oklch(0.20_0.02_80/0.12)] transition-all duration-300 hover:border-[oklch(0.72_0.11_80)]/35 hover:shadow-[0_18px_36px_-14px_oklch(0.20_0.02_80/0.25)]"
              >
                <Link href={`/products/list?category=${cat.slug}`} className="block">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/40 to-transparent" />
                    {/* High demand badge */}
                    <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.60_0.12_75)] shadow-sm backdrop-blur-sm">
                      High Demand
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-3">
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold leading-snug tracking-tight">{cat.title}</h3>
                    <ul className="mt-4 space-y-2 text-[12.5px] text-foreground/75">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.60_0.12_75)]" />
                        High Demand
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.60_0.12_75)]" />
                        Private Label Available
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.60_0.12_75)]" />
                        Bulk Export Ready
                      </li>
                    </ul>
                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.60_0.12_75)]">
                        View Products
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[oklch(0.60_0.12_75)] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PRIVATE LABEL CTA ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] py-14 text-white sm:py-16">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src={PRIVATE_LABEL_BG} alt="" fill className="object-cover object-right" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)] via-[oklch(0.14_0.02_80)]/85 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Need Products Under<br />
              <span className="text-[oklch(0.78_0.12_80)]">Your Own Brand?</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
              Marassi Group supports private label sourcing, packaging adaptation, labeling, and export-ready product selection.
            </p>
            <Link href="/private-label">
              <Button
                size="lg"
                className="mt-6 h-12 bg-[oklch(0.66_0.16_35)] px-6 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
              >
                Explore Private Label
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="hidden justify-end lg:flex"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-[4/3] w-full max-w-md">
              <Image src={PRIVATE_LABEL_BG} alt="Private label products" fill className="rounded-xl object-cover" sizes="500px" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-l from-transparent to-[oklch(0.14_0.02_80)]/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── SOURCING CTA BAND ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={PORT_BG} alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)]/95 via-[oklch(0.16_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/95" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_auto]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Looking for a Specific<br className="hidden sm:block" /> FMCG Category?
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/65 sm:text-base">
                Our sourcing team can help you find the right products for your market.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/request-quote">
                <Button
                  size="lg"
                  className="h-12 bg-[oklch(0.66_0.16_35)] px-6 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Request Product List
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/10"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Sourcing Team
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4"
          >
            {trustBullets.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-white/75 sm:justify-center sm:text-sm">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.78_0.12_80)]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/65">
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterSelect({ options }: { options: string[] }) {
  return (
    <div className="relative">
      <select className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-border/70 bg-background px-3.5 pr-10 text-sm text-foreground/80 outline-none transition-all focus:border-[oklch(0.72_0.11_80)] focus:ring-2 focus:ring-[oklch(0.72_0.11_80)]/15">
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
