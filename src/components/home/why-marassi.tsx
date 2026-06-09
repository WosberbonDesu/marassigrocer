"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, Tag, Handshake } from "lucide-react";
import { useTranslations } from "next-intl";

const capabilities = [
  {
    id: "qualitySourcing",
    icon: ShieldCheck,
  },
  {
    id: "globalReach",
    icon: Globe,
  },
  {
    id: "privateLabel",
    icon: Tag,
  },
  {
    id: "exportSupport",
    icon: Handshake,
  },
] as const;

export function WhyMarassi() {
  const t = useTranslations("homeAdvantages");

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
          {t("eyebrow")}
        </p>
        <h2 className="text-center font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
          {t("heading")}
        </h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[oklch(0.72_0.11_80)]/70" />
          <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.72_0.11_80)]" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[oklch(0.72_0.11_80)]/70" />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ icon: Icon, id }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-[oklch(0.72_0.11_80)]/15 bg-card p-6 text-left transition-all hover:-translate-y-1 hover:border-[oklch(0.72_0.11_80)]/40 hover:shadow-[0_18px_40px_-18px_oklch(0.20_0.02_80/0.20)]"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.72_0.11_80)]/12 text-[oklch(0.60_0.12_75)] transition-colors group-hover:bg-[oklch(0.72_0.11_80)] group-hover:text-white"
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <h3 className="mt-4 text-base font-semibold leading-snug">
                {t(`items.${id}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${id}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
