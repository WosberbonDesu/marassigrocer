"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Check, Ban, Pause, Play, Loader2, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AdminTopBar } from "@/components/admin/top-bar";

type CustomerStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface CustomerDetail {
  id: string;
  email: string;
  name: string;
  company: string;
  country: string;
  phone: string | null;
  buyerType: string | null;
  taxId: string | null;
  website: string | null;
  applicationMsg: string | null;
  status: CustomerStatus;
  approvedAt: string | null;
  rejectedReason: string | null;
  internalNotes: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  salesRep: { id: string; email: string; name: string | null } | null;
  groupId: string | null;
  group: { id: string; name: string; defaultDiscount: number } | null;
}

interface CustomerGroupOption {
  id: string;
  name: string;
  defaultDiscount: number;
  active: boolean;
}

const STATUS_BADGE: Record<CustomerStatus, string> = {
  PENDING: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
  SUSPENDED: "bg-muted text-muted-foreground border-border",
};

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectMode, setRejectMode] = useState(false);
  const [groups, setGroups] = useState<CustomerGroupOption[]>([]);

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setCustomer(d.customer);
        setInternalNotes(d.customer?.internalNotes ?? "");
      })
      .finally(() => setLoading(false));
    fetch("/api/admin/customer-groups")
      .then((r) => r.json())
      .then((d) => setGroups(d.groups ?? []));
  }, [id]);

  const patch = async (body: Record<string, unknown>, msg?: string) => {
    setBusy(true);
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const d = await res.json();
      setCustomer(d.customer);
      if (msg) toast.success(msg);
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Update failed");
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <>
        <AdminTopBar title="Customer" />
        <div className="p-6">
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </>
    );
  }
  if (!customer) {
    return (
      <>
        <AdminTopBar title="Customer" />
        <div className="p-6 text-sm text-muted-foreground">Not found.</div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title="Customer" />
      <div className="p-6 space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold truncate">{customer.company}</h1>
              <Badge variant="outline" className={STATUS_BADGE[customer.status]}>
                {customer.status.charAt(0) + customer.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Applied {format(new Date(customer.createdAt), "PPpp")}
            </p>
          </div>
        </div>

        {/* Decision buttons */}
        {customer.status === "PENDING" && (
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold">Decision</h2>
            {!rejectMode ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={busy}
                  onClick={() => patch({ status: "APPROVED" }, "Customer approved")}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button variant="destructive" disabled={busy} onClick={() => setRejectMode(true)}>
                  <Ban className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            ) : (
              <div className="space-y-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                <p className="text-sm font-medium text-red-700">Reject this application</p>
                <Textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason (optional — included in email to buyer)"
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    disabled={busy}
                    onClick={() =>
                      patch(
                        { status: "REJECTED", rejectedReason: rejectReason || null },
                        "Application rejected"
                      ).then(() => setRejectMode(false))
                    }
                  >
                    Confirm Reject
                  </Button>
                  <Button variant="ghost" onClick={() => setRejectMode(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {customer.status === "APPROVED" && (
          <div className="rounded-2xl border bg-card p-5">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => patch({ status: "SUSPENDED" }, "Customer suspended")}
            >
              <Pause className="mr-2 h-4 w-4" />
              Suspend Account
            </Button>
          </div>
        )}

        {customer.status === "SUSPENDED" && (
          <div className="rounded-2xl border bg-card p-5">
            <Button
              disabled={busy}
              onClick={() => patch({ status: "APPROVED" }, "Customer re-activated")}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Reactivate Account
            </Button>
          </div>
        )}

        {customer.status === "REJECTED" && customer.rejectedReason && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-semibold text-red-700">Rejection reason</p>
                <p className="mt-1 text-sm text-red-700/90">{customer.rejectedReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile */}
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Profile
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Contact", customer.name],
              ["Company", customer.company],
              ["Email", customer.email],
              ["Phone", customer.phone ?? "—"],
              ["Country", customer.country],
              ["Buyer Type", customer.buyerType?.replace("_", " ") ?? "—"],
              ["Tax ID", customer.taxId ?? "—"],
              ["Website", customer.website ?? "—"],
              ["Last Login", customer.lastLoginAt ? format(new Date(customer.lastLoginAt), "PPp") : "—"],
              ["Approved", customer.approvedAt ? format(new Date(customer.approvedAt), "PPp") : "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium capitalize break-words">{value}</p>
              </div>
            ))}
          </div>
          {customer.applicationMsg && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">Application message</p>
              <p className="text-sm whitespace-pre-wrap">{customer.applicationMsg}</p>
            </div>
          )}
        </div>

        {/* Group assignment */}
        {customer.status === "APPROVED" && (
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h2 className="text-sm font-semibold">Customer group</h2>
            <p className="text-xs text-muted-foreground">
              Group discount is applied automatically to all pricing tiers shown to this customer.
            </p>
            <div className="space-y-2">
              <Label>Group</Label>
              <Select
                value={customer.groupId ?? "none"}
                onValueChange={(v) =>
                  patch(
                    { groupId: v === "none" ? null : v },
                    v === "none" ? "Group removed" : "Group assigned"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No group (base prices)</SelectItem>
                  {groups
                    .filter((g) => g.active)
                    .map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name} ({g.defaultDiscount}% off)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {customer.group && (
                <p className="text-xs text-muted-foreground">
                  Active: <strong>{customer.group.name}</strong> — {customer.group.defaultDiscount}% off base prices.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Internal notes */}
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold">Internal notes</h2>
          <p className="text-xs text-muted-foreground">Admin-only — never shown to customer.</p>
          <Textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={3}
          />
          <Button
            size="sm"
            variant="outline"
            disabled={busy || internalNotes === (customer.internalNotes ?? "")}
            onClick={() => patch({ internalNotes }, "Notes saved")}
          >
            {busy ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Save Notes
          </Button>
        </div>
      </div>
    </>
  );
}
