"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  availability: string;
  published: boolean;
  featured: boolean;
  category: { name: string };
  brand: { name: string } | null;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchProducts();
  };

  const availabilityColors: Record<string, string> = {
    in_stock: "bg-green-100 text-green-700",
    seasonal: "bg-yellow-100 text-yellow-700",
    on_request: "bg-blue-100 text-blue-700",
    discontinued: "bg-red-100 text-red-700",
  };

  const columns = [
    {
      key: "image",
      header: "",
      className: "w-12",
      render: (p: Product) => (
        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-muted">
          {p.images[0] ? (
            <Image src={p.images[0]} alt="" fill className="object-contain p-0.5" sizes="36px" />
          ) : (
            <Package className="h-4 w-4 m-auto mt-2.5 text-muted-foreground/40" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Product",
      render: (p: Product) => (
        <div>
          <p className="font-medium">{p.name}</p>
          <p className="text-xs text-muted-foreground">{p.slug}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (p: Product) => p.category.name },
    { key: "brand", header: "Brand", render: (p: Product) => p.brand?.name ?? "—" },
    {
      key: "availability",
      header: "Availability",
      render: (p: Product) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${availabilityColors[p.availability] ?? ""}`}>
          {p.availability.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p: Product) => (
        <div className="flex gap-1">
          {p.published ? (
            <Badge variant="outline" className="text-[11px]">Live</Badge>
          ) : (
            <Badge variant="secondary" className="text-[11px]">Draft</Badge>
          )}
          {p.featured && <Badge className="text-[11px]">Featured</Badge>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (p: Product) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/products/${p.id}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => handleDelete(p.id, p.name)}
            disabled={deleting === p.id}
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
      <AdminTopBar title={`Products (${total})`} />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(p) => p.id}
          page={page}
          pages={pages}
          onPageChange={setPage}
          isLoading={loading}
          emptyMessage="No products found"
        />
      </div>
    </>
  );
}
