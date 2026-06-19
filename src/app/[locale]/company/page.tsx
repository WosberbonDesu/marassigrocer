"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Eye,
  Gem,
  Check,
  PackageSearch,
  FileBadge2,
  Network,
  Tag,
  MessageSquare,
  TrendingUp,
  Building2,
  Globe2,
  Plane,
  PackagePlus,
  LineChart,
  Briefcase,
  Globe,
  Package,
  Warehouse,
  Users,
  CheckCircle2,
  Download,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { WorldMap, type MapMarker } from "@/components/shared/world-map";

const HERO_BG = "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1920&q=70";
const HERO_PRODUCTS = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
const CTA_PORT = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=70";

const STORY_IMAGES = {
  warehouse: "https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=900&q=80",
  ship: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=600&q=80",
  handshake: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
  products: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  packaging: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  truck: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
};

const stats = [
  { id: "years", icon: Briefcase },
  { id: "markets", icon: Globe },
  { id: "products", icon: Package },
  { id: "warehouse", icon: Warehouse },
  { id: "network", icon: Users },
] as const;

const reasons = [
  { id: "sourcing", icon: PackageSearch },
  { id: "documentation", icon: FileBadge2 },
  { id: "network", icon: Network },
  { id: "privateLabel", icon: Tag },
  { id: "communication", icon: MessageSquare },
  { id: "marketFocused", icon: TrendingUp },
];

const milestones = [
  { id: "y1996", year: "1996", icon: Building2 },
  { id: "y2005", year: "2005", icon: Globe2 },
  { id: "y2015", year: "2015", icon: Plane },
  { id: "y2020", year: "2020", icon: PackagePlus },
  { id: "y2025", year: "2025", icon: LineChart },
];

// Real lat/lng coordinates — projected accurately on the world map
const regions = [
  { id: "europe", lat: 50.0, lng: 10.0 },
  { id: "middleEast", lat: 31.0, lng: 38.0 },
  { id: "gulf", lat: 24.5, lng: 54.0 },
  { id: "northAfrica", lat: 27.0, lng: 12.0 },
  { id: "westAfrica", lat: 9.0, lng: 8.0 },
  { id: "eastAfrica", lat: -1.0, lng: 37.0 },
  { id: "southAsia", lat: 22.0, lng: 78.0 },
  { id: "seAsia", lat: 10.0, lng: 106.0 },
  { id: "eastAsia", lat: 35.0, lng: 110.0 },
];

const valueIds = ["integrity", "quality", "reliability", "growth"];

export default function CompanyPage() {
  const t = useTranslations("company");
  const values = valueIds.map((id) => t(`values.items.${id}`));
  const mapMarkers: MapMarker[] = regions.map((r) => ({
    name: t(`globalReach.regions.${r.id}`),
    lat: r.lat,
    lng: r.lng,
  }));
  return (
    <div className="bg-background">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_BG} alt="" fill priority className="object-cover opacity-45" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)] via-[oklch(0.14_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/30" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-24">
          <motion.div
            className="flex-1 lg:max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-white/55">
              <Link href="/" className="hover:text-[oklch(0.78_0.12_80)]">{t("breadcrumb.home")}</Link>
              <span>/</span>
              <span className="text-white/80">{t("breadcrumb.about")}</span>
            </nav>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1")}
              <br />
              <span className="text-[oklch(0.78_0.12_80)]">{t("hero.titleLine2")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-6 h-[3px] w-16 rounded-full bg-[oklch(0.78_0.12_80)]" />
          </motion.div>

          <motion.div
            className="relative hidden flex-1 lg:block"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image src={HERO_PRODUCTS} alt={t("hero.productsAlt")} fill priority className="rounded-2xl object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[oklch(0.14_0.02_80)]/45 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── OUR STORY ───────── */}
      <section className="relative bg-background pt-16 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
                {t("story.eyebrow")}
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {t("story.titleLine1")}<br className="hidden sm:block" /> {t("story.titleLine2")}
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  {t("story.paragraph1")}
                </p>
                <p>
                  {t("story.paragraph2")}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-7 border-[oklch(0.72_0.11_80)]/45 bg-transparent text-sm font-medium text-[oklch(0.50_0.12_75)] hover:border-[oklch(0.72_0.11_80)] hover:bg-[oklch(0.72_0.11_80)]/10 hover:text-[oklch(0.50_0.12_75)]"
              >
                {t("story.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Right: 6-photo collage */}
            <motion.div
              className="grid h-[460px] grid-cols-6 grid-rows-6 gap-3"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="relative col-span-3 row-span-4 overflow-hidden rounded-xl">
                <Image src={STORY_IMAGES.warehouse} alt={t("story.images.warehouse")} fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
              </div>
              <div className="relative col-span-3 row-span-2 overflow-hidden rounded-xl">
                <Image src={STORY_IMAGES.ship} alt={t("story.images.ship")} fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
              </div>
              <div className="relative col-span-3 row-span-3 overflow-hidden rounded-xl">
                <Image src={STORY_IMAGES.handshake} alt={t("story.images.handshake")} fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
              </div>
              <div className="relative col-span-4 row-span-2 overflow-hidden rounded-xl">
                <Image src={STORY_IMAGES.products} alt={t("story.images.products")} fill className="object-cover" sizes="(max-width:1024px) 100vw, 35vw" />
              </div>
              <div className="relative col-span-2 row-span-3 overflow-hidden rounded-xl">
                <Image src={STORY_IMAGES.truck} alt={t("story.images.truck")} fill className="object-cover" sizes="(max-width:1024px) 30vw, 17vw" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ───────── STATS CARD ───────── */}
        <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[oklch(0.72_0.11_80)]/25 bg-white shadow-xl shadow-[oklch(0.20_0.02_80)]/5"
          >
            <div className="grid grid-cols-2 divide-x divide-y divide-border sm:divide-y-0 sm:grid-cols-3 lg:grid-cols-5">
              {stats.map(({ id, icon: Icon }) => (
                <div key={id} className="flex items-center gap-3 px-5 py-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.72_0.11_80)]/12 text-[oklch(0.60_0.12_75)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-playfair)] text-xl font-bold leading-tight text-foreground sm:text-2xl">
                      {t(`stats.values.${id}`)}
                    </p>
                    <p className="text-[11px] font-medium leading-tight text-muted-foreground">
                      {t(`stats.${id}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ───────── MISSION / VISION / VALUES ───────── */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Compass,
                title: t("mvv.mission.title"),
                body: t("mvv.mission.body"),
              },
              {
                icon: Eye,
                title: t("mvv.vision.title"),
                body: t("mvv.vision.body"),
              },
              {
                icon: Gem,
                title: t("mvv.values.title"),
                list: values,
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.72_0.11_80)]/12 text-[oklch(0.60_0.12_75)]">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-tight">
                  {card.title}
                </h3>
                {card.body && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                )}
                {card.list && (
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {card.list.map((v) => (
                      <li key={v} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.60_0.12_75)]" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── WHY BUYERS TRUST (DARK) ───────── */}
      <section className="bg-[oklch(0.14_0.02_80)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.78_0.12_80)]">
              {t("reasons.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("reasons.heading")}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0 lg:divide-x lg:divide-white/10">
            {reasons.map(({ id, icon: Icon }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex flex-col items-center px-4 text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.78_0.12_80)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold leading-snug">{t(`reasons.items.${id}.title`)}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/55">{t(`reasons.items.${id}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── MILESTONES ───────── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
              {t("milestones.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("milestones.heading")}
            </h2>
          </div>

          <div className="relative mt-14">
            {/* Connecting line (desktop) */}
            <div
              aria-hidden
              className="absolute left-[10%] right-[10%] top-7 hidden h-px lg:block"
              style={{
                background:
                  "repeating-linear-gradient(to right, oklch(0.72 0.11 80 / 0.5) 0 6px, transparent 6px 12px)",
              }}
            />
            <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {milestones.map(({ id, year, icon: Icon }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[oklch(0.72_0.11_80)]/40 bg-background text-[oklch(0.60_0.12_75)] shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-bold text-[oklch(0.60_0.12_75)]">
                    {year}
                  </p>
                  <p className="mt-1 max-w-[160px] text-xs leading-snug text-muted-foreground">
                    {t(`milestones.items.${id}`)}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── GLOBAL REACH (DARK + WORLD MAP) ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] py-16 text-white sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[oklch(0.78_0.12_80)]/8 to-transparent blur-3xl"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[oklch(0.78_0.12_80)]">
              {t("globalReach.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {t("globalReach.titleLine1")}<br />
              {t("globalReach.titleLine2")}<br />
              <span className="text-[oklch(0.78_0.12_80)]">{t("globalReach.titleLine3")}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              {t("globalReach.description")}
            </p>

            <div className="mt-7 grid grid-cols-3 gap-4 max-w-sm">
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[oklch(0.82_0.11_80)]">50+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/55">{t("globalReach.stats.markets")}</p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[oklch(0.82_0.11_80)]">8+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/55">{t("globalReach.stats.sourcingHubs")}</p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[oklch(0.82_0.11_80)]">75+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/55">{t("globalReach.stats.factories")}</p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="mt-7 border-[oklch(0.72_0.11_80)]/50 bg-transparent text-sm font-medium text-[oklch(0.82_0.11_80)] hover:border-[oklch(0.72_0.11_80)] hover:bg-[oklch(0.72_0.11_80)]/12 hover:text-[oklch(0.82_0.11_80)]"
            >
              <Link href="/markets">
                {t("globalReach.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right: accurate SVG world map with lat/lng pins */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <WorldMap markers={mapMarkers} />
          </motion.div>
        </div>
      </section>

      {/* ───────── CTA BAND ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={CTA_PORT} alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)]/95 via-[oklch(0.16_0.02_80)]/80 to-[oklch(0.14_0.02_80)]/95" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_auto]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {t("cta.titleLine1")}
                <br className="hidden sm:block" /> {t("cta.titleLine2")}
              </h2>
              <p className="mt-3 max-w-xl text-base text-white/65">
                {t("cta.subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="h-12 bg-[oklch(0.66_0.16_35)] px-7 text-base font-semibold text-white shadow-lg shadow-[oklch(0.66_0.16_35)]/20 hover:bg-[oklch(0.60_0.17_35)]"
              >
                <Link href="/contact">
                  {t("cta.contactUs")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("cta.requestProfile")}
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            {["pricing", "quality", "delivery", "standards"].map((id) => (
              <div key={id} className="flex items-center justify-center gap-2 text-sm text-white/80">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.78_0.12_80)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">{t(`cta.bullets.${id}`)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
