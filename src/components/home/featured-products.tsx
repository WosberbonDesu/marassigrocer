"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Plus } from "lucide-react";
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
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => {
            const isAdded = hasItem(product.id);
            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="group overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative h-40 bg-muted">
                  <Image
                    src={product.images[0] ?? "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-muted-foreground">{product.brand?.name ?? ""}</p>
                  <h3 className="text-sm font-semibold leading-tight group-hover:text-accent">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {product.originCountries[0] ?? ""}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isAdded) {
                          addItem({ productId: product.id, productName: product.name, quantity: 1, notes: "" });
                        }
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                        isAdded
                          ? "bg-accent/20 text-accent"
                          : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
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
