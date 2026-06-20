"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Download, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATALOG_PDF } from "@/lib/site-links";

// Hero image: dark cargo port with product showcase in foreground
const HERO_BG = "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1920&q=70";
const PRODUCT_SHOWCASE = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] text-white">
      {/* Dark port background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)] via-[oklch(0.14_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/30" />
      </div>

      {/* Subtle animated orb */}
      <motion.div
        className="absolute right-[20%] top-1/2 z-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[oklch(0.72_0.11_80)]/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-28">
        {/* Left: Text content */}
        <motion.div
          className="flex-1 lg:max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.72_0.11_80)]"
          >
            {t("eyebrow")}
          </motion.p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {t("headlineStart")}{" "}
            <span className="text-[oklch(0.72_0.11_80)]">
              {t("headlineHighlight")}
            </span>{" "}
            {t("headlineEnd")}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-12 bg-[oklch(0.72_0.11_80)] px-7 text-base font-semibold text-[oklch(0.18_0.02_80)] shadow-lg shadow-[oklch(0.72_0.11_80)]/20 hover:bg-[oklch(0.66_0.12_78)]"
            >
              <Link href={`/${locale}/request-quote`}>
                {t("cta1")}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/25 bg-transparent px-6 text-base text-white backdrop-blur-sm hover:bg-white/10"
            >
              <a href={CATALOG_PDF} download>
                <Download className="mr-2 h-4 w-4" />
                {t("cta2")}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex items-center gap-2 text-sm text-white/55"
          >
            <BadgeCheck className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
            {t("trustNote")}
          </motion.div>
        </motion.div>

        {/* Right: Product showcase */}
        <motion.div
          className="relative hidden flex-1 lg:block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={PRODUCT_SHOWCASE}
              alt="FMCG product range"
              fill
              priority
              className="object-cover rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Soft fade-in at bottom */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[oklch(0.14_0.02_80)]/50 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
