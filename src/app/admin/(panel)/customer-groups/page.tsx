"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";

interface GroupRow {
  id: string;
  name: string;
  description: string | null;
  defaultDiscount: number;
  active: boolean;
  _count: { customers: number };
}

export default function CustomerGroupsPage() {
  const [rows, setRows] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GroupRow | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    defaultDiscount: 0,
    active: true,
  });

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/customer-groups");
    if (res.ok) {
      const d = await res.json();
      setRows(d.groups ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const startEdit = (row: GroupRow | "new") => {
    if (row === "new") {
      setForm({ name: "", description: "", defaultDiscount: 0, active: true });
    } else {
      setForm({
        name: row.name,
        description: row.description ?? "",
        defaultDiscount: row.defaultDiscount,
        active: row.active,
      });
    }
    setEditing(row);
  };

  const save = async () => {
    setBusy(true);
    const url =
      editing === "new"
        ? "/api/admin/customer-groups"
        : `/api/admin/customer-groups/${(editing as GroupRow).id}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editing === "new" ? "Group created" : "Group updated");
      setEditing(null);
      fetchRows();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Save failed");
    }
    setBusy(false);
  };

  const remove = async (g: GroupRow) => {
    if (!confirm(`Delete group "${g.name}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/customer-groups/${g.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Group deleted");
      fetchRows();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Delete failed");
    }
    setBusy(false);
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (g: GroupRow) => (
        <div>
          <p className="font-medium">{g.name}</p>
          {g.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{g.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (g: GroupRow) => (
        <span className="font-semibold tabular-nums">{g.defaultDiscount}%</span>
      ),
    },
    {
      key: "customers",
      header: "Customers",
      render: (g: GroupRow) => (
        <span className="inline-flex items-center gap-1 text-sm">
          <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
          {g._count.customers}
        </span>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (g: GroupRow) =>
        g.active ? (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Inactive
          </span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (g: GroupRow) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => startEdit(g)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => remove(g)}
            disabled={busy}
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
      <AdminTopBar title={`Customer Groups (${rows.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Groups apply a default discount to base prices for assigned customers.
          </p>
          <Button onClick={() => startEdit("new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Button>
        </div>

        {editing && (
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">
              {editing === "new" ? "New group" : `Edit: ${(editing as GroupRow).name}`}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="group-name">Name</Label>
                <Input
                  id="group-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tier 1 Distributor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-discount">Default Discount (%)</Label>
                <Input
                  id="group-discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={form.defaultDiscount}
                  onChange={(e) =>
                    setForm({ ...form, defaultDiscount: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-desc">Description</Label>
              <Textarea
                id="group-desc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Internal note about who's in this group"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="group-active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="group-active" className="cursor-pointer">
                Active
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={busy || !form.name.trim()}>
                {busy ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-3.5 w-3.5" />
                )}
                Save
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(g) => g.id}
          isLoading={loading}
          emptyMessage="No customer groups yet — create one to apply tier discounts."
        />
      </div>
    </>
  );
}
