"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRFQStore } from "@/stores/rfq-store";

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1740914994657-f1cdffdc418e?auto=format&fit=crop&fm=jpg&q=60&w=800",
  "https://images.unsplash.com/photo-1768176136613-96a7bfc0049e?auto=format&fit=crop&fm=jpg&q=60&w=800",
  "https://images.pexels.com/photos/11666903/pexels-photo-11666903.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/30625284/pexels-photo-30625284/free-photo-of-warehouse-interior-with-shelves-and-products.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export function Hero() {
  const t = useTranslations("hero");
  const openDrawer = useRFQStore((s) => s.openDrawer);

  return (
    <section className="relative overflow-hidden bg-[oklch(0.12_0.01_60)] text-white">
      {/* Gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.76_0.11_80)]/10 via-transparent to-[oklch(0.76_0.11_80)]/5" />
      {/* Decorative blurs */}
      <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[oklch(0.76_0.11_80)]/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[oklch(0.76_0.11_80)]/8 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-36">
        {/* Left: Text content */}
        <div className="flex-1">
          <div className="mb-6 h-1 w-16 rounded-full bg-[oklch(0.76_0.11_80)]" />
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              onClick={() => openDrawer("quick")}
              className="bg-[oklch(0.76_0.11_80)] text-[oklch(0.12_0.01_60)] hover:bg-[oklch(0.82_0.10_80)] text-base font-semibold"
            >
              {t("cta1")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 text-base"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("cta2")}
            </Button>
          </div>
          <p className="mt-8 text-sm text-white/40">
            Since 1996 — Trusted by importers in 50+ countries
          </p>
        </div>

        {/* Right: 2x2 Product image grid */}
        <div className="hidden flex-1 lg:block">
          <div className="grid grid-cols-2 gap-4">
            {BANNER_IMAGES.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.03]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
