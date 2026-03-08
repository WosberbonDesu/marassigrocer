"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  featured: boolean;
  order: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Cannot delete");
    }
    setDeleting(null);
    fetchCategories();
  };

  const columns = [
    {
      key: "image",
      header: "",
      className: "w-12",
      render: (c: Category) => (
        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-muted">
          {c.image && <Image src={c.image} alt="" fill className="object-cover" sizes="36px" />}
        </div>
      ),
    },
    {
      key: "name",
      header: "Category",
      render: (c: Category) => (
        <div>
          <p className="font-medium">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.slug}</p>
        </div>
      ),
    },
    { key: "products", header: "Products", render: (c: Category) => c._count.products },
    { key: "order", header: "Order", render: (c: Category) => c.order },
    {
      key: "featured",
      header: "Featured",
      render: (c: Category) =>
        c.featured ? <span className="text-xs font-medium text-primary">Yes</span> : "—",
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (c: Category) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/categories/${c.id}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => handleDelete(c.id, c.name)}
            disabled={deleting === c.id || c._count.products > 0}
            title={c._count.products > 0 ? "Remove products first" : "Delete"}
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
      <AdminTopBar title={`Categories (${categories.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={categories}
          keyExtractor={(c) => c.id}
          isLoading={loading}
          emptyMessage="No categories found"
        />
      </div>
    </>
  );
}
