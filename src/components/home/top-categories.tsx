import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { CategoryCard } from "@/components/shared/category-card";
import { db } from "@/lib/db";

export async function TopCategories() {
  const t = await getTranslations("topCategories");
  const locale = await getLocale();

  // DB'den kategorileri çek — explicit select so missing columns don't break the page
  let dbCategories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    order: number;
  }> = [];
  try {
    dbCategories = await db.category.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        order: true,
      },
    });
  } catch (err) {
    console.error("[TopCategories] db.category.findMany failed — run `npx prisma db push`?", err);
    dbCategories = [];
  }

  // Ürün sayısını ekle
  const categories = await Promise.all(
    dbCategories.map(async (cat) => {
      let products: { id: string }[] = [];
      try {
        products = await db.product.findMany({
          where: { categoryId: cat.id },
          select: { id: true },
        });
      } catch {
        products = [];
      }
      return {
        ...cat,
        description: cat.description ?? "",
        image: cat.image ?? "/images/placeholder.png",
        productCount: products.length,
      };
    })
  );

  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] py-16 text-white sm:py-24">
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
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
