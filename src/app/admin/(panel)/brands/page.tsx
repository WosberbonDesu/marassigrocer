"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  origin?: string;
  _count: { products: number };
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/brands");
    const data = await res.json();
    setBrands(data.brands ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Cannot delete");
    }
    setDeleting(null);
    fetchBrands();
  };

  const columns = [
    {
      key: "logo",
      header: "",
      className: "w-12",
      render: (b: Brand) => (
        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-muted">
          {b.logo && <Image src={b.logo} alt="" fill className="object-contain p-1" sizes="36px" />}
        </div>
      ),
    },
    {
      key: "name",
      header: "Brand",
      render: (b: Brand) => (
        <div>
          <p className="font-medium">{b.name}</p>
          <p className="text-xs text-muted-foreground">{b.slug}</p>
        </div>
      ),
    },
    { key: "origin", header: "Origin", render: (b: Brand) => b.origin ?? "—" },
    { key: "products", header: "Products", render: (b: Brand) => b._count.products },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (b: Brand) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/brands/${b.id}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => handleDelete(b.id, b.name)}
            disabled={deleting === b.id || b._count.products > 0}
            title={b._count.products > 0 ? "Remove products first" : "Delete"}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTopBar title={`Brands (${brands.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/brands/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={brands}
          keyExtractor={(b) => b.id}
          isLoading={loading}
          emptyMessage="No brands found"
        />
      </div>
    </>
  );
}
