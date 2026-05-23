"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { AdminTopBar } from "@/components/admin/top-bar";
import { ProductForm } from "@/components/admin/product-form";

interface PricingTier {
  minQty: number;
  casePrice?: number;
  unitPrice?: number;
}

interface NutritionRow {
  label: string;
  value: string;
  per?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  longDescription?: string;
  ingredients?: string;
  allergens?: string[];
  storage?: string;
  nutrition?: NutritionRow[];
  categoryId: string;
  brandId?: string;
  images: string[];
  imagePublicIds: string[];
  imageAlts?: string[];
  originCountries: string[];
  moqHint?: string;
  moqQuantity?: number;
  moqUnit?: string;
  hazmat?: boolean;
  reeferRequired?: boolean;
  availability: string;
  packDescription?: string;
  unitWeight?: string;
  weight?: string;
  dimensions?: string;
  caseSize?: number;
  unitUpc?: string;
  caseUpc?: string;
  variants?: string[];
  cartonDetails?: string;
  loadingInfo?: string;
  exportSuitability?: string;
  relatedProductIds?: string[];
  pricingTiers?: PricingTier[];
  seoTitle?: string;
  seoDesc?: string;
  featured: boolean;
  published: boolean;
  status?: "DRAFT" | "PUBLISHED" | "HIDDEN";
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
            sku: product.sku,
            description: product.description,
            longDescription: product.longDescription ?? "",
            ingredients: product.ingredients,
            allergens: product.allergens ?? [],
            storage: product.storage,
            nutrition: product.nutrition?.map((n) => ({
              label: n.label,
              value: n.value,
              per: n.per ?? "100g",
            })),
            categoryId: product.categoryId,
            brandId: product.brandId,
            originCountries: product.originCountries,
            moqHint: product.moqHint,
            moqQuantity: product.moqQuantity,
            moqUnit: product.moqUnit,
            hazmat: product.hazmat ?? false,
            reeferRequired: product.reeferRequired ?? false,
            availability: product.availability,
            packDescription: product.packDescription,
            unitWeight: product.unitWeight,
            weight: product.weight,
            dimensions: product.dimensions,
            caseSize: product.caseSize,
            unitUpc: product.unitUpc,
            caseUpc: product.caseUpc,
            variants: product.variants ?? [],
            cartonDetails: product.cartonDetails,
            loadingInfo: product.loadingInfo,
            exportSuitability: product.exportSuitability,
            relatedProductIds: product.relatedProductIds ?? [],
            pricingTiers: product.pricingTiers?.map((t) => ({
              minQty: t.minQty,
              casePrice: t.casePrice ?? "",
              unitPrice: t.unitPrice ?? "",
            })) as ({ minQty: number | ""; casePrice: number | ""; unitPrice: number | "" }[] | undefined),
            seoTitle: product.seoTitle,
            seoDesc: product.seoDesc,
            featured: product.featured,
            status: product.status ?? (product.published ? "PUBLISHED" : "DRAFT"),
            order: product.order,
            images: product.images.map((url, i) => ({
              url,
              publicId: product.imagePublicIds[i] ?? "",
            })),
            imageAlts: product.imageAlts ?? [],
          }}
        />
      </div>
    </>
  );
}
