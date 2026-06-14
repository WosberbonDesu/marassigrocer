"use client";

import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

const markets = [
  { id: "gccMiddleEast" },
  { id: "africa" },
  { id: "centralAsia" },
  { id: "southeastAsia" },
  { id: "europe" },
  { id: "americas" },
];

export function TrustedMarkets() {
  const t = useTranslations("trustedMarkets");
  return (
    <section className="border-y border-[oklch(0.72_0.11_80)]/15 bg-[oklch(0.20_0.02_80)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Globe className="h-5 w-5 text-[oklch(0.72_0.11_80)]" />
          <p className="text-sm font-medium uppercase tracking-widest text-white/50">
            {t("heading")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {markets.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center transition-colors hover:border-[oklch(0.72_0.11_80)]/30 hover:bg-white/10"
            >
              <p className="text-sm font-semibold text-[oklch(0.72_0.11_80)]">{t(`markets.${m.id}.region`)}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/40">{t(`markets.${m.id}.countries`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
