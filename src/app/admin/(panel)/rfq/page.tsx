"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Inbox, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RFQ_STATUSES,
  STATUS_BADGE,
  STATUS_LABELS,
  normalizeStatus,
  type RfqStatus,
} from "@/lib/rfq-status";

interface RfqRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  country: string;
  buyerType: string;
  status: string;
  items: { productName: string; quantity: number }[];
  createdAt: string;
}

export default function RFQListPage() {
  const [rfqs, setRfqs] = useState<RfqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | RfqStatus>("all");

  useEffect(() => {
    fetch("/api/admin/rfq")
      .then((r) => r.json())
      .then((d) => setRfqs(d.rfqs ?? []))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const map = new Map<RfqStatus, number>();
    for (const r of rfqs) {
      const s = normalizeStatus(r.status);
      map.set(s, (map.get(s) ?? 0) + 1);
    }
    return map;
  }, [rfqs]);

  const filtered = useMemo(() => {
    if (filter === "all") return rfqs;
    return rfqs.filter((r) => normalizeStatus(r.status) === filter);
  }, [rfqs, filter]);

  const submittedCount = counts.get("submitted") ?? 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFQ Submissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {submittedCount > 0
              ? `${submittedCount} awaiting review`
              : "All caught up"}
          </p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            filter === "all"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card hover:bg-muted"
          )}
        >
          All ({rfqs.length})
        </button>
        {RFQ_STATUSES.map((s) => {
          const c = counts.get(s) ?? 0;
          if (c === 0 && filter !== s) return null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === s
                  ? STATUS_BADGE[s]
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {STATUS_LABELS[s]} ({c})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">
            {filter === "all" ? "No RFQ submissions yet" : `No ${STATUS_LABELS[filter]} RFQs`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {filter === "all"
              ? "Submissions will appear here once customers send requests."
              : "Switch to a different filter to see other submissions."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Buyer Type</th>
                <th className="px-4 py-3 text-center">Items</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Received</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((rfq) => {
                const status = normalizeStatus(rfq.status);
                return (
                  <tr
                    key={rfq.id}
                    className={cn(
                      "transition-colors hover:bg-muted/30",
                      status === "submitted" && "font-medium"
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{rfq.name}</p>
                      <p className="text-xs text-muted-foreground">{rfq.company ?? rfq.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{rfq.country}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {rfq.buyerType.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {Array.isArray(rfq.items) ? rfq.items.length : 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={STATUS_BADGE[status]}>
                        {STATUS_LABELS[status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(rfq.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/rfq/${rfq.id}`}>
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
  );
}
