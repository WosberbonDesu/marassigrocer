"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Plus, Package as PackageIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRFQStore } from "@/stores/rfq-store";
import { SectionHeader } from "@/components/shared/section-header";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  originCountries: string[];
  brand: { name: string } | null;
}

export function FeaturedProducts() {
  const t = useTranslations("featuredProducts");
  const locale = useLocale();
  const { addItem, hasItem } = useRFQStore();
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((r) => r.json())
      .then((d) => {
        const products = (d.products ?? []) as Product[];
        setFeatured(products.slice(0, 8));
      });
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] py-16 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} variant="dark" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => {
            const isAdded = hasItem(product.id);
            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.18_0.02_80)] transition-all hover:-translate-y-1 hover:border-[oklch(0.78_0.12_80)]/40 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
              >
                <div className="relative h-40 overflow-hidden bg-[oklch(0.96_0.005_85)]">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <PackageIcon className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-[10.5px] uppercase tracking-wider text-white/45">
                    {product.brand?.name ?? ""}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-[13.5px] font-semibold leading-snug text-white transition-colors group-hover:text-[oklch(0.82_0.11_80)]">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-white/55">
                      {product.originCountries[0] ?? ""}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isAdded) {
                          addItem({
                            productId: product.id,
                            productName: product.name,
                            quantity: 1,
                            notes: "",
                          });
                        }
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                        isAdded
                          ? "bg-[oklch(0.78_0.12_80)]/20 text-[oklch(0.82_0.11_80)]"
                          : "bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.82_0.11_80)] hover:bg-[oklch(0.66_0.16_35)] hover:text-white"
                      }`}
                      aria-label={isAdded ? "Added to RFQ" : "Add to RFQ"}
                    >
                      {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            asChild
            className="border-[oklch(0.78_0.12_80)]/40 bg-transparent text-[oklch(0.82_0.11_80)] hover:bg-[oklch(0.78_0.12_80)]/10 hover:text-[oklch(0.85_0.10_80)]"
          >
            <Link href={`/${locale}/products`}>
              {t("viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
