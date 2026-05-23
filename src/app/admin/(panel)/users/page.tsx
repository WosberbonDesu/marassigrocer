"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ShieldOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DataTable } from "@/components/admin/data-table";
import { ROLE_LABELS } from "@/lib/permissions";
import type { AdminRole } from "@prisma/client";

interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Cannot delete");
    }
    setBusy(null);
    fetchUsers();
  };

  const toggleActive = async (u: AdminUserRow) => {
    setBusy(u.id);
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !u.active }),
    });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Cannot update");
    }
    setBusy(null);
    fetchUsers();
  };

  const columns = [
    {
      key: "email",
      header: "User",
      render: (u: AdminUserRow) => (
        <div>
          <p className="font-medium">{u.email}</p>
          {u.name && <p className="text-xs text-muted-foreground">{u.name}</p>}
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u: AdminUserRow) => (
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
          {ROLE_LABELS[u.role]}
        </span>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (u: AdminUserRow) =>
        u.active ? (
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
      key: "createdAt",
      header: "Created",
      render: (u: AdminUserRow) => new Date(u.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      render: (u: AdminUserRow) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleActive(u)}
            disabled={busy === u.id}
            title={u.active ? "Deactivate" : "Activate"}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            {u.active ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          </button>
          <Link
            href={`/admin/users/${u.id}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => handleDelete(u.id, u.email)}
            disabled={busy === u.id}
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
      <AdminTopBar title={`Users (${users.length})`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(u) => u.id}
          isLoading={loading}
          emptyMessage="No users found"
        />
      </div>
    </>
  );
}
