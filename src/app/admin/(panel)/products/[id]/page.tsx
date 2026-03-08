"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { AdminTopBar } from "@/components/admin/top-bar";
import { ProductForm } from "@/components/admin/product-form";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  images: string[];
  imagePublicIds: string[];
  originCountries: string[];
  moqHint?: string;
  availability: string;
  seoTitle?: string;
  seoDesc?: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminTopBar title="Edit Product" />
        <div className="p-6">
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AdminTopBar title="Edit Product" />
        <div className="p-6 text-muted-foreground">Product not found.</div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title={`Edit: ${product.name}`} />
      <div className="p-6">
        <ProductForm
          productId={id}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            categoryId: product.categoryId,
            brandId: product.brandId,
            originCountries: product.originCountries,
            moqHint: product.moqHint,
            availability: product.availability,
            seoTitle: product.seoTitle,
            seoDesc: product.seoDesc,
            featured: product.featured,
            published: product.published,
            order: product.order,
            images: product.images.map((url, i) => ({
              url,
              publicId: product.imagePublicIds[i] ?? "",
            })),
          }}
        />
      </div>
    </>
  );
}
