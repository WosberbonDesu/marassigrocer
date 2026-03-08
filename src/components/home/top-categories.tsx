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

  // DB'den kategorileri çek
  const dbCategories = await db.category.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take: 5,
  });

  // Ürün sayısını ekle
  const categories = await Promise.all(
    dbCategories.map(async (cat) => {
      const products = await db.product.findMany({
        where: { categoryId: cat.id },
        select: { id: true },
      });
      return {
        ...cat,
        description: cat.description ?? "",
        image: cat.image ?? "/images/placeholder.png",
        productCount: products.length,
      };
    })
  );

  return (
    <section className="bg-[#faf8f4] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
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
