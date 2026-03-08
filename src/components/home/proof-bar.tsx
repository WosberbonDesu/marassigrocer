"use client";

import { useTranslations } from "next-intl";
import { Calendar, Globe, Package, Warehouse } from "lucide-react";

const stats = [
  { key: "since", icon: Calendar, value: "1996", suffix: "" },
  { key: "countries", icon: Globe, value: "50+", suffix: "" },
  { key: "products", icon: Package, value: "10K+", suffix: "" },
  { key: "warehouse", icon: Warehouse, value: "10,000", suffix: "m²" },
] as const;

const labels: Record<string, string> = {
  since: "Years in Business",
  countries: "Countries Served",
  products: "Products Available",
  warehouse: "Warehouse Capacity",
};

export function ProofBar() {
  const t = useTranslations("proofBar");

  return (
    <section className="border-y border-[oklch(0.76_0.11_80)]/20 bg-[oklch(0.10_0.01_60)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
        {stats.map(({ key, icon: Icon, value, suffix }) => (
          <div
            key={key}
            className="group flex flex-col items-center justify-center gap-2 px-6 py-10 text-center transition-colors hover:bg-white/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.76_0.11_80)]/15 text-[oklch(0.76_0.11_80)]">
              <Icon className="h-5 w-5" />
            </div>
            <div className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white sm:text-4xl">
              {value}
              <span className="text-[oklch(0.76_0.11_80)]">{suffix}</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/50">
              {labels[key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
