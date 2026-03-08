"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRFQStore } from "@/stores/rfq-store";

export function CTABand() {
  const t = useTranslations("ctaBand");
  const openDrawer = useRFQStore((s) => s.openDrawer);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[oklch(0.76_0.11_80)] via-[oklch(0.70_0.12_75)] to-[oklch(0.76_0.11_80)]">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex-1">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[oklch(0.12_0.01_60)] sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-xl text-lg text-[oklch(0.12_0.01_60)]/70">
            {t("subtitle")}
          </p>
          <Button
            size="lg"
            onClick={() => openDrawer("quick")}
            className="mt-6 bg-[oklch(0.12_0.01_60)] text-[oklch(0.76_0.11_80)] hover:bg-[oklch(0.18_0.01_60)] text-base font-semibold"
          >
            {t("cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Right: shipping icon */}
        <div className="hidden lg:flex lg:items-center lg:justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[oklch(0.12_0.01_60)]/10">
            <Ship className="h-14 w-14 text-[oklch(0.12_0.01_60)]/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
