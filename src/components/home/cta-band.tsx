"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Download, DollarSign, ShieldCheck, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATALOG_PDF } from "@/lib/site-links";

const WAREHOUSE_BG = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=70";

const trustBullets = [
  { icon: DollarSign, id: "pricing" },
  { icon: ShieldCheck, id: "quality" },
  { icon: Clock, id: "delivery" },
  { icon: Globe, id: "standards" },
];

export function CTABand() {
  const locale = useLocale();
  const t = useTranslations("homeCta");

  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] text-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={WAREHOUSE_BG}
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)]/95 via-[oklch(0.16_0.02_80)]/80 to-[oklch(0.14_0.02_80)]/95" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_auto]">
          {/* Left: heading + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {t("heading.line1")}
              <br className="hidden sm:block" />
              <span className="text-[oklch(0.72_0.11_80)]"> {t("heading.line2")}</span>
            </h2>
            <p className="mt-3 max-w-xl text-base text-white/65 sm:text-lg">
              {t("subheading")}
            </p>
          </motion.div>

          {/* Right: CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-12 bg-[oklch(0.72_0.11_80)] px-7 text-base font-semibold text-[oklch(0.18_0.02_80)] shadow-lg shadow-[oklch(0.72_0.11_80)]/20 hover:bg-[oklch(0.66_0.12_78)]"
            >
              <Link href={`/${locale}/request-quote`}>
                {t("requestQuote")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10"
            >
              <a href={CATALOG_PDF} download>
                <Download className="mr-2 h-4 w-4" />
                {t("downloadCatalog")}
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Trust bullets row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          {trustBullets.map(({ icon: Icon, id }) => (
            <div key={id} className="flex items-center justify-center gap-2 text-sm text-white/80">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.72_0.11_80)]/15 text-[oklch(0.72_0.11_80)]">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium">{t(`trustBullets.${id}`)}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
