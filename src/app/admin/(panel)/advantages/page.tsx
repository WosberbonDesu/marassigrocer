"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";

interface AdvantageRow {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  stat: string | null;
  statLabel: string | null;
  order: number;
  active: boolean;
}

const empty = {
  title: "",
  description: "",
  icon: "Trophy",
  stat: "",
  statLabel: "",
  order: 0,
  active: true,
};

const ICON_SUGGESTIONS = [
  "Trophy", "Award", "Building2", "Globe", "Package", "Ship",
  "Factory", "Truck", "Warehouse", "Shield", "Users", "TrendingUp",
  "Heart", "Star", "Zap", "Target",
];

export default function AdvantagesPage() {
  const [rows, setRows] = useState<AdvantageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdvantageRow | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(empty);

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/advantages");
    if (res.ok) {
      const d = await res.json();
      setRows(d.advantages ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const startEdit = (row: AdvantageRow | "new") => {
    if (row === "new") {
      setForm(empty);
    } else {
      setForm({
        title: row.title,
        description: row.description,
        icon: row.icon ?? "Trophy",
        stat: row.stat ?? "",
        statLabel: row.statLabel ?? "",
        order: row.order,
        active: row.active,
      });
    }
    setEditing(row);
  };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description required");
      return;
    }
    setBusy(true);
    const url = editing === "new" ? "/api/admin/advantages" : `/api/admin/advantages/${(editing as AdvantageRow).id}`;
    const res = await fetch(url, {
      method: editing === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editing === "new" ? "Advantage added" : "Advantage updated");
      setEditing(null);
      fetchRows();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Save failed");
    }
    setBusy(false);
  };

  const remove = async (r: AdvantageRow) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/advantages/${r.id}`, { method: "DELETE" });
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
      key: "order",
      header: "#",
      className: "w-12",
      render: (r: AdvantageRow) => <span className="font-mono text-xs text-muted-foreground">{r.order}</span>,
    },
    {
      key: "title",
      header: "Advantage",
      render: (r: AdvantageRow) => (
        <div>
          <p className="font-medium">{r.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
        </div>
      ),
    },
    {
      key: "stat",
      header: "Stat",
      render: (r: AdvantageRow) =>
        r.stat ? (
          <div>
            <p className="font-bold">{r.stat}</p>
            {r.statLabel && <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.statLabel}</p>}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "icon",
      header: "Icon",
      render: (r: AdvantageRow) => <code className="text-xs">{r.icon ?? "—"}</code>,
    },
    {
      key: "active",
      header: "Status",
      render: (r: AdvantageRow) =>
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
      render: (r: AdvantageRow) => (
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
      <AdminTopBar title={`Why Marassi Advantages (${rows.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            9 advantage blocks shown on the &quot;Why Marassi Group&quot; page. Use sort order to control display order.
          </p>
          <Button onClick={() => startEdit("new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Advantage
          </Button>
        </div>

        {editing && (
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              {editing === "new" ? "New advantage" : `Edit: ${(editing as AdvantageRow).title}`}
            </h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="29 Years of Experience" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Trusted FMCG sourcing and distribution since 1996." />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Stat (optional)</Label>
                <Input value={form.stat} onChange={(e) => setForm({ ...form, stat: e.target.value })} placeholder="29+" />
              </div>
              <div className="space-y-2">
                <Label>Stat Label (optional)</Label>
                <Input value={form.statLabel} onChange={(e) => setForm({ ...form, statLabel: e.target.value })} placeholder="years" />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Icon (Lucide name)</Label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Trophy" />
              <div className="flex flex-wrap gap-1">
                {ICON_SUGGESTIONS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setForm({ ...form, icon: name })}
                    className={`rounded border px-2 py-0.5 text-xs ${form.icon === name ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="adv-active" type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-input" />
              <Label htmlFor="adv-active" className="cursor-pointer">Active</Label>
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
          emptyMessage="No advantage blocks yet — add some to populate the Why Marassi page."
        />
      </div>
    </>
  );
}
