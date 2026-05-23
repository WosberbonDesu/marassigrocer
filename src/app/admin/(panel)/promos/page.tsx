"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";

interface PromoRow {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENT" | "AMOUNT";
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  validFrom: string | null;
  validUntil: string | null;
  active: boolean;
}

export default function AdminPromosPage() {
  const [rows, setRows] = useState<PromoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/promos");
    if (res.ok) {
      const data = await res.json();
      setRows(data.promos ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete promo code "${code}"?`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/promos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Cannot delete");
    }
    setBusy(null);
    fetchRows();
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const formatValidity = (r: PromoRow) => {
    if (!r.validFrom && !r.validUntil) return "Always";
    const fmt = (s: string | null) => (s ? new Date(s).toLocaleDateString() : "—");
    return `${fmt(r.validFrom)} → ${fmt(r.validUntil)}`;
  };

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (r: PromoRow) => (
        <div className="flex items-center gap-2">
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold">{r.code}</code>
          <button
            onClick={() => copy(r.code)}
            className="text-muted-foreground hover:text-foreground"
            title="Copy code"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
    {
      key: "value",
      header: "Discount",
      render: (r: PromoRow) =>
        r.type === "PERCENT" ? `${r.value}%` : `${r.value.toFixed(2)}`,
    },
    {
      key: "minOrder",
      header: "Min Order",
      render: (r: PromoRow) => (r.minOrder ? r.minOrder.toFixed(2) : "—"),
    },
    {
      key: "usage",
      header: "Used",
      render: (r: PromoRow) =>
        r.maxUses ? `${r.usedCount} / ${r.maxUses}` : `${r.usedCount} / ∞`,
    },
    {
      key: "validity",
      header: "Validity",
      render: formatValidity,
    },
    {
      key: "active",
      header: "Status",
      render: (r: PromoRow) =>
        r.active ? (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Disabled
          </span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (r: PromoRow) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/promos/${r.id}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => handleDelete(r.id, r.code)}
            disabled={busy === r.id}
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
      <AdminTopBar title={`Promo Codes (${rows.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/promos/new">
              <Plus className="mr-2 h-4 w-4" />
              New Promo Code
            </Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(r) => r.id}
          isLoading={loading}
          emptyMessage="No promo codes yet"
        />
      </div>
    </>
  );
}
