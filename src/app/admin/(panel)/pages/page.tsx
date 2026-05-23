"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";

interface PageRow {
  id: string;
  slug: string;
  title: { en?: string; tr?: string; ar?: string };
  published: boolean;
  order: number;
  updatedAt: string;
}

export default function AdminPagesPage() {
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pages");
    if (res.ok) {
      const data = await res.json();
      setRows(data.pages ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Delete page "${slug}"?`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    if (!res.ok) alert("Delete failed");
    setBusy(null);
    fetchRows();
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (p: PageRow) => (
        <div>
          <p className="font-medium">{p.title?.en || "(Untitled)"}</p>
          <p className="text-xs text-muted-foreground">/p/{p.slug}</p>
        </div>
      ),
    },
    {
      key: "published",
      header: "Status",
      render: (p: PageRow) =>
        p.published ? (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Published
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Draft
          </span>
        ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (p: PageRow) => new Date(p.updatedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      render: (p: PageRow) => (
        <div className="flex items-center gap-1">
          {p.published && (
            <a
              href={`/en/p/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              title="View"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <Link
            href={`/admin/pages/${p.id}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => handleDelete(p.id, p.slug)}
            disabled={busy === p.id}
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
      <AdminTopBar title={`Pages (${rows.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/pages/new">
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(r) => r.id}
          isLoading={loading}
          emptyMessage="No pages yet"
        />
      </div>
    </>
  );
}
