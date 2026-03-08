"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/products?category=${category.slug}`}
      className="group relative overflow-hidden rounded-2xl transition-all hover:shadow-xl"
    >
      <div className="relative h-48 w-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Default dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
        {/* Gold hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.76_0.11_80)]/90 via-[oklch(0.76_0.11_80)]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold drop-shadow-md">
          {category.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-white/80 drop-shadow-md group-hover:text-[oklch(0.12_0.01_60)]">
          {category.productCount} products available
        </p>
      </div>
    </Link>
  );
}
