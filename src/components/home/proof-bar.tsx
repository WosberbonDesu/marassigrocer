"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Globe, Package, Warehouse } from "lucide-react";

const stats = [
  { key: "since", icon: Briefcase, target: 29, suffix: "+", label: "Years in Business", sub: "Since 1996" },
  { key: "countries", icon: Globe, target: 50, suffix: "+", label: "Markets Served", sub: "Worldwide" },
  { key: "products", icon: Package, target: 10000, suffix: "+", label: "Products in Catalog", sub: "Across 20+ Categories" },
  { key: "warehouse", icon: Warehouse, target: 4000, suffix: " m²", label: "Warehouse Capacity", sub: "Modern & Fully Equipped" },
] as const;

function CountUp({ target, durationMs = 1800 }: { target: number; durationMs?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, durationMs]);

  const targetStr = target.toLocaleString();
  return (
    <span
      ref={ref}
      className="inline-block tabular-nums"
      style={{ minWidth: `${targetStr.length}ch` }}
    >
      {value.toLocaleString()}
    </span>
  );
}

export function ProofBar() {
  return (
    <section className="relative bg-background pb-12">
      {/* Raised white card sitting on top of hero edge */}
      <div className="mx-auto -mt-12 max-w-7xl px-4 sm:-mt-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[oklch(0.72_0.11_80)]/20 bg-white shadow-xl shadow-[oklch(0.20_0.02_80)]/5">
          <div className="grid grid-cols-2 divide-x divide-y divide-border sm:divide-y-0 lg:grid-cols-4">
            {stats.map(({ key, icon: Icon, target, suffix, label, sub }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex items-center gap-4 px-6 py-8 transition-colors hover:bg-[oklch(0.97_0.008_85)]"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.72_0.11_80)]/12 text-[oklch(0.60_0.12_75)]"
                >
                  <Icon className="h-6 w-6" />
                </motion.div>
                <div>
                  <div className="flex items-baseline font-[family-name:var(--font-playfair)] text-2xl font-bold leading-none text-foreground sm:text-3xl">
                    <CountUp target={target} />
                    <span className="text-[oklch(0.72_0.11_80)]">{suffix}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-foreground/80">
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
