"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { AdminTopBar } from "@/components/admin/top-bar";
import { CategoryForm } from "@/components/admin/category-form";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  seoTitle?: string;
  seoDesc?: string;
  featured: boolean;
  order: number;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/categories/${id}`)
      .then((r) => r.json())
      .then((d) => { setCategory(d.category); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminTopBar title="Edit Category" />
        <div className="p-6"><div className="h-64 animate-pulse rounded-2xl bg-muted" /></div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <AdminTopBar title="Edit Category" />
        <div className="p-6 text-muted-foreground">Category not found.</div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title={`Edit: ${category.name}`} />
      <div className="p-6">
        <CategoryForm
          categoryId={id}
          defaultValues={{
            name: category.name,
            slug: category.slug,
            description: category.description,
            seoTitle: category.seoTitle,
            seoDesc: category.seoDesc,
            featured: category.featured,
            order: category.order,
            image: category.image && category.imagePublicId
              ? { url: category.image, publicId: category.imagePublicId }
              : null,
          }}
        />
      </div>
    </>
  );
}
