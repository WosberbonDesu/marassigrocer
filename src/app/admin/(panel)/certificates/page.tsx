"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Save, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";
import { ImageUploader } from "@/components/admin/image-uploader";
import { toast } from "sonner";

interface CertRow {
  id: string;
  title: string;
  description: string | null;
  issuer: string | null;
  issuedDate: string | null;
  validUntil: string | null;
  fileUrl: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  filePublicId: string | null;
  order: number;
  active: boolean;
}

interface UploadedImage { url: string; publicId: string }

const empty = {
  title: "",
  description: "",
  issuer: "",
  issuedDate: "",
  validUntil: "",
  order: 0,
  active: true,
};

export default function CertificatesPage() {
  const [rows, setRows] = useState<CertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CertRow | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState<UploadedImage[]>([]);

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/certificates");
    if (res.ok) {
      const d = await res.json();
      setRows(d.certificates ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const startEdit = (row: CertRow | "new") => {
    if (row === "new") {
      setForm(empty);
      setImage([]);
    } else {
      setForm({
        title: row.title,
        description: row.description ?? "",
        issuer: row.issuer ?? "",
        issuedDate: row.issuedDate ? new Date(row.issuedDate).toISOString().slice(0, 10) : "",
        validUntil: row.validUntil ? new Date(row.validUntil).toISOString().slice(0, 10) : "",
        order: row.order,
        active: row.active,
      });
      setImage(row.imageUrl && row.imagePublicId ? [{ url: row.imageUrl, publicId: row.imagePublicId }] : []);
    }
    setEditing(row);
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setBusy(true);
    const url = editing === "new" ? "/api/admin/certificates" : `/api/admin/certificates/${(editing as CertRow).id}`;
    const method = editing === "new" ? "POST" : "PUT";
    const payload = {
      ...form,
      imageUrl: image[0]?.url ?? null,
      imagePublicId: image[0]?.publicId ?? null,
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editing === "new" ? "Certificate added" : "Certificate updated");
      setEditing(null);
      fetchRows();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Save failed");
    }
    setBusy(false);
  };

  const remove = async (r: CertRow) => {
    if (!confirm(`Delete certificate "${r.title}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/certificates/${r.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      fetchRows();
    } else {
      toast.error("Delete failed");
    }
    setBusy(false);
  };

  const columns = [
    {
      key: "image",
      header: "",
      className: "w-14",
      render: (r: CertRow) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
          {r.imageUrl ? (
            <Image src={r.imageUrl} alt="" fill className="object-contain p-1" sizes="40px" />
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
      render: (r: CertRow) => (
        <div>
          <p className="font-medium">{r.title}</p>
          {r.issuer && <p className="text-xs text-muted-foreground">{r.issuer}</p>}
        </div>
      ),
    },
    {
      key: "validity",
      header: "Validity",
      render: (r: CertRow) => {
        if (!r.issuedDate && !r.validUntil) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <span className="text-xs text-muted-foreground">
            {r.issuedDate ? new Date(r.issuedDate).toLocaleDateString() : "—"} → {r.validUntil ? new Date(r.validUntil).toLocaleDateString() : "—"}
          </span>
        );
      },
    },
    {
      key: "file",
      header: "File",
      render: (r: CertRow) =>
        r.fileUrl ? (
          <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <ExternalLink className="h-3 w-3" /> View
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "active",
      header: "Status",
      render: (r: CertRow) =>
        r.active ? (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Hidden
          </span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (r: CertRow) => (
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
      <AdminTopBar title={`Certificates (${rows.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Upload trust documents — ISO, HACCP, Halal, organic certifications, etc. Shown on the public Certificates page.
          </p>
          <Button onClick={() => startEdit("new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Certificate
          </Button>
        </div>

        {editing && (
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">
              {editing === "new" ? "New certificate" : `Edit: ${(editing as CertRow).title}`}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="ISO 22000 Food Safety" />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="SGS, Bureau Veritas, etc." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Issued Date</Label>
                <Input type="date" value={form.issuedDate} onChange={(e) => setForm({ ...form, issuedDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Badge / Logo Image (optional)</Label>
              <ImageUploader value={image} onChange={setImage} folder="certificates" maxFiles={1} />
            </div>
            <div className="flex items-center gap-2">
              <input id="cert-active" type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-input" />
              <Label htmlFor="cert-active" className="cursor-pointer">Active (shown on public page)</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={busy || !form.title.trim()}>
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
          emptyMessage="No certificates yet — add one to showcase compliance."
        />
      </div>
    </>
  );
}
