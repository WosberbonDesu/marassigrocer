"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type Props = {
  images: string[];
  alts?: string[];
  productName: string;
};

export function ProductGallery({ images, alts = [], productName }: Props) {
  const t = useTranslations("productGallery");
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : [];
  const altFor = (i: number) =>
    alts[i] || t("imageAlt", { productName, index: i + 1 });

  const next = () =>
    setActiveIndex((i) => (i + 1) % Math.max(1, safeImages.length));
  const prev = () =>
    setActiveIndex(
      (i) => (i - 1 + Math.max(1, safeImages.length)) % Math.max(1, safeImages.length)
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-card">
        <AnimatePresence mode="wait">
          {safeImages[activeIndex] ? (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={safeImages[activeIndex]}
                alt={altFor(activeIndex)}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={activeIndex === 0}
              />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-32 w-32 text-muted-foreground/20" />
            </div>
          )}
        </AnimatePresence>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t("previousImage")}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t("nextImage")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background">
            {activeIndex + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-card transition-all ${
                activeIndex === i
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
              aria-label={t("viewImage", { index: i + 1 })}
            >
              <Image
                src={src}
                alt={altFor(i)}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
