"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Tag, Truck } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const services = [
  { key: "sourcing", icon: Search },
  { key: "privateLabel", icon: Tag },
  { key: "logistics", icon: Truck },
] as const;

export function WhatWeDo() {
  const t = useTranslations("whatWeDo");

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-6 sm:grid-cols-3">
          {services.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-[oklch(0.72_0.11_80)]/15 bg-card p-8 transition-all hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-[0_18px_40px_-18px_oklch(0.20_0.02_80/0.25)]"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.72_0.11_80)]/12 text-[oklch(0.60_0.12_75)] transition-colors group-hover:bg-[oklch(0.72_0.11_80)] group-hover:text-white"
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <h3 className="text-lg font-semibold">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
