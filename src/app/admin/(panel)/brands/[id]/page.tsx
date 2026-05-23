"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { AdminTopBar } from "@/components/admin/top-bar";
import { BrandForm } from "@/components/admin/brand-form";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  logoPublicId?: string;
  origin?: string;
  description?: string;
  seoTitle?: string;
  seoDesc?: string;
}

export default function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/brands/${id}`)
      .then((r) => r.json())
      .then((d) => { setBrand(d.brand); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminTopBar title="Edit Brand" />
        <div className="p-6"><div className="h-64 animate-pulse rounded-2xl bg-muted" /></div>
      </>
    );
  }

  if (!brand) {
    return (
      <>
        <AdminTopBar title="Edit Brand" />
        <div className="p-6 text-muted-foreground">Brand not found.</div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title={`Edit: ${brand.name}`} />
      <div className="p-6">
        <BrandForm
          brandId={id}
          defaultValues={{
            name: brand.name,
            slug: brand.slug,
            origin: brand.origin,
            description: brand.description,
            seoTitle: brand.seoTitle,
            seoDesc: brand.seoDesc,
            logo: brand.logo && brand.logoPublicId
              ? { url: brand.logo, publicId: brand.logoPublicId }
              : null,
          }}
        />
      </div>
    </>
  );
}
