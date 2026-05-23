"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";

type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface PostRow {
  id: string;
  slug: string;
  title: { en?: string; tr?: string };
  coverImage: string | null;
  author: string | null;
  tags: string[];
  status: BlogStatus;
  publishedAt: string | null;
  updatedAt: string;
}

const STATUS_COLOR: Record<BlogStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PUBLISHED: "bg-green-500/10 text-green-700",
  ARCHIVED: "bg-orange-500/10 text-orange-700",
};

export default function AdminBlogPage() {
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blog");
    if (res.ok) {
      const d = await res.json();
      setRows(d.posts ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const remove = async (r: PostRow) => {
    if (!confirm(`Delete post "${r.title.en || r.slug}"?`)) return;
    setBusy(r.id);
    const res = await fetch(`/api/admin/blog/${r.id}`, { method: "DELETE" });
    if (!res.ok) alert("Delete failed");
    setBusy(null);
    fetchRows();
  };

  const columns = [
    {
      key: "cover",
      header: "",
      className: "w-16",
      render: (r: PostRow) => (
        <div className="relative h-10 w-14 overflow-hidden rounded-md bg-muted">
          {r.coverImage ? (
            <Image src={r.coverImage} alt="" fill className="object-cover" sizes="56px" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-4 w-4 text-muted-foreground/40" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      render: (r: PostRow) => (
        <div>
          <p className="font-medium line-clamp-1">{r.title.en || "(Untitled)"}</p>
          <p className="text-xs text-muted-foreground">/insights/{r.slug}</p>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (r: PostRow) => r.author || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (r: PostRow) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[r.status]}`}>
          {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      key: "publishedAt",
      header: "Published",
      render: (r: PostRow) =>
        r.publishedAt
          ? format(new Date(r.publishedAt), "MMM d, yyyy")
          : <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      render: (r: PostRow) => (
        <div className="flex items-center gap-1">
          {r.status === "PUBLISHED" && (
            <a href={`/en/insights/${r.slug}`} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" title="View">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <Link href={`/admin/blog/${r.id}`} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button onClick={() => remove(r)} disabled={busy === r.id} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTopBar title={`Blog (${rows.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(r) => r.id}
          isLoading={loading}
          emptyMessage="No blog posts yet."
        />
      </div>
    </>
  );
}
