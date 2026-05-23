"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, Eye, Clock, Check, Ban, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminTopBar } from "@/components/admin/top-bar";
import { cn } from "@/lib/utils";

type CustomerStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface CustomerRow {
  id: string;
  email: string;
  name: string;
  company: string;
  country: string;
  buyerType: string | null;
  status: CustomerStatus;
  approvedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

const STATUS_BADGE: Record<CustomerStatus, string> = {
  PENDING: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
  SUSPENDED: "bg-muted text-muted-foreground border-border",
};

const STATUS_ICON: Record<CustomerStatus, typeof Clock> = {
  PENDING: Clock,
  APPROVED: Check,
  REJECTED: Ban,
  SUSPENDED: Pause,
};

const STATUSES: CustomerStatus[] = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | CustomerStatus>("PENDING");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers ?? []))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const map = new Map<CustomerStatus, number>();
    for (const c of customers) map.set(c.status, (map.get(c.status) ?? 0) + 1);
    return map;
  }, [customers]);

  const filtered = useMemo(
    () => (filter === "all" ? customers : customers.filter((c) => c.status === filter)),
    [customers, filter]
  );

  const pendingCount = counts.get("PENDING") ?? 0;

  return (
    <>
      <AdminTopBar title="Customers" />
      <div className="p-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {pendingCount > 0
              ? `${pendingCount} application${pendingCount === 1 ? "" : "s"} waiting for review`
              : "No pending applications"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              filter === "all"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:bg-muted"
            )}
          >
            All ({customers.length})
          </button>
          {STATUSES.map((s) => {
            const c = counts.get(s) ?? 0;
            if (c === 0 && filter !== s) return null;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === s ? STATUS_BADGE[s] : "border-border bg-card hover:bg-muted"
                )}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()} ({c})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
            <UserPlus className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">No customers in this view</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Applications submitted on the public site will appear here for review.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Buyer</th>
                  <th className="px-4 py-3 text-left">Country</th>
                  <th className="px-4 py-3 text-left">Buyer Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Applied</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => {
                  const Icon = STATUS_ICON[c.status];
                  return (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{c.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.name} · {c.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.country}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">
                        {c.buyerType?.replace("_", " ") ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={STATUS_BADGE[c.status]}>
                          <Icon className="mr-1 h-3 w-3" />
                          {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/customers/${c.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
