"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Save, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";
import { ImageUploader } from "@/components/admin/image-uploader";
import { toast } from "sonner";

interface MarketRow {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  countries: string[];
  description: string | null;
  image: string | null;
  imagePublicId: string | null;
  regulatoryNotes: string | null;
  order: number;
  active: boolean;
}

interface UploadedImage { url: string; publicId: string }

const empty = {
  name: "",
  region: "",
  description: "",
  regulatoryNotes: "",
  order: 0,
  active: true,
};

export default function MarketsPage() {
  const [rows, setRows] = useState<MarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MarketRow | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(empty);
  const [countries, setCountries] = useState<string[]>([]);
  const [countryInput, setCountryInput] = useState("");
  const [image, setImage] = useState<UploadedImage[]>([]);

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/markets");
    if (res.ok) {
      const d = await res.json();
      setRows(d.markets ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const startEdit = (row: MarketRow | "new") => {
    if (row === "new") {
      setForm(empty);
      setCountries([]);
      setImage([]);
    } else {
      setForm({
        name: row.name,
        region: row.region ?? "",
        description: row.description ?? "",
        regulatoryNotes: row.regulatoryNotes ?? "",
        order: row.order,
        active: row.active,
      });
      setCountries(row.countries ?? []);
      setImage(row.image && row.imagePublicId ? [{ url: row.image, publicId: row.imagePublicId }] : []);
    }
    setEditing(row);
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setBusy(true);
    const payload = {
      ...form,
      countries,
      image: image[0]?.url ?? null,
      imagePublicId: image[0]?.publicId ?? null,
    };
    const url = editing === "new" ? "/api/admin/markets" : `/api/admin/markets/${(editing as MarketRow).id}`;
    const res = await fetch(url, {
      method: editing === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editing === "new" ? "Market added" : "Market updated");
      setEditing(null);
      fetchRows();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Save failed");
    }
    setBusy(false);
  };

  const remove = async (r: MarketRow) => {
    if (!confirm(`Delete market "${r.name}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/markets/${r.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchRows(); }
    else toast.error("Delete failed");
    setBusy(false);
  };

  const columns = [
    {
      key: "image",
      header: "",
      className: "w-14",
      render: (r: MarketRow) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
          {r.image ? (
            <Image src={r.image} alt="" fill className="object-cover" sizes="40px" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Globe className="h-4 w-4 text-muted-foreground/40" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Market",
      render: (r: MarketRow) => (
        <div>
          <p className="font-medium">{r.name}</p>
          {r.region && <p className="text-xs text-muted-foreground">{r.region}</p>}
        </div>
      ),
    },
    {
      key: "countries",
      header: "Countries",
      render: (r: MarketRow) => <span className="text-sm">{r.countries.length}</span>,
    },
    {
      key: "active",
      header: "Status",
      render: (r: MarketRow) =>
        r.active ? (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">Active</span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Hidden</span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (r: MarketRow) => (
        <div className="flex items-center gap-1">
          <button onClick={() => startEdit(r)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => remove(r)} disabled={busy} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTopBar title={`Export Markets (${rows.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Define regional markets served (GCC, MENA, Africa, etc). Each market lists countries and optional regulatory notes.
          </p>
          <Button onClick={() => startEdit("new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Market
          </Button>
        </div>

        {editing && (
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">
              {editing === "new" ? "New market" : `Edit: ${(editing as MarketRow).name}`}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Gulf Cooperation Council" />
              </div>
              <div className="space-y-2">
                <Label>Region (short tag)</Label>
                <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="GCC" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Countries in this market</Label>
              <div className="flex flex-wrap gap-1.5">
                {countries.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {c}
                    <button type="button" onClick={() => setCountries((p) => p.filter((x) => x !== c))} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const v = countryInput.trim().replace(/,$/, "");
                    if (v && !countries.includes(v)) setCountries([...countries, v]);
                    setCountryInput("");
                  }
                }}
                placeholder="Type country name and press Enter"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief overview of this market — buyer types, demand drivers, etc." />
            </div>
            <div className="space-y-2">
              <Label>Regulatory Notes (optional)</Label>
              <Textarea rows={2} value={form.regulatoryNotes} onChange={(e) => setForm({ ...form, regulatoryNotes: e.target.value })} placeholder="e.g. Halal certification required, Arabic labeling mandatory" />
            </div>
            <div className="space-y-2">
              <Label>Market Image (optional)</Label>
              <ImageUploader value={image} onChange={setImage} folder="markets" maxFiles={1} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-input" />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={busy || !form.name.trim()}>
                {busy ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
                Save
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(r) => r.id}
          isLoading={loading}
          emptyMessage="No export markets defined yet."
        />
      </div>
    </>
  );
}
