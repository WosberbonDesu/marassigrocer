"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft, Package, Lock as LockIcon, Clock, AlertTriangle, Loader2, Save,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  STATUS_BADGE,
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
  allowedNextStates,
  getEditWindow,
  isEditable,
  normalizeStatus,
  type RfqStatus,
} from "@/lib/rfq-status";

interface RfqDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string;
  buyerType: string;
  containerEstimate: string | null;
  targetPrice: string | null;
  notes: string | null;
  source: string | null;
  status: RfqStatus;
  confirmedAt: string | null;
  lockedAt: string | null;
  quoteNotes: string | null;
  internalNotes: string | null;
  items: { productName: string; quantity: number }[];
  createdAt: string;
}

function formatRemaining(ms: number) {
  if (ms <= 0) return "expired";
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}

export default function RFQDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rfq, setRfq] = useState<RfqDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [, setTick] = useState(0); // refresh countdown each minute

  useEffect(() => {
    fetch(`/api/admin/rfq/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const data = d.rfq;
        setRfq(data);
        setQuoteNotes(data.quoteNotes ?? "");
        setInternalNotes(data.internalNotes ?? "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const patch = async (body: Record<string, unknown>, successMessage?: string) => {
    setBusy(true);
    const res = await fetch(`/api/admin/rfq/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const d = await res.json();
      setRfq(d.rfq);
      if (successMessage) toast.success(successMessage);
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Update failed");
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }
  if (!rfq) {
    return (
      <div className="p-6 text-sm text-muted-foreground">RFQ not found.</div>
    );
  }

  const status = normalizeStatus(rfq.status);
  const window = getEditWindow(status, rfq.confirmedAt);
  const editable = isEditable(status, rfq.confirmedAt);
  const nextStates = allowedNextStates(status);

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/rfq">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold truncate">{rfq.company || rfq.name}</h1>
            <Badge variant="outline" className={STATUS_BADGE[status]}>
              {STATUS_LABELS[status]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Received {format(new Date(rfq.createdAt), "PPpp")}
          </p>
        </div>
      </div>

      {/* State machine bar */}
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Current status: {STATUS_LABELS[status]}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {STATUS_DESCRIPTIONS[status]}
            </p>
          </div>
          {status === "confirmed" && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                window.active
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                  : "border-red-500/40 bg-red-500/10 text-red-700"
              )}
            >
              {window.active ? <Clock className="h-3.5 w-3.5" /> : <LockIcon className="h-3.5 w-3.5" />}
              <div>
                <p className="font-semibold">
                  {window.active ? formatRemaining(window.remainingMs) : "Window expired"}
                </p>
                <p className="text-[10px] opacity-80">
                  {window.active ? "left to edit" : "lock pending"}
                </p>
              </div>
            </div>
          )}
        </div>

        {nextStates.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {nextStates.map((next) => (
              <Button
                key={next}
                size="sm"
                variant={next === "cancelled" ? "destructive" : next === "archived" ? "outline" : "default"}
                disabled={busy}
                onClick={() =>
                  patch({ status: next }, `Marked as ${STATUS_LABELS[next]}`)
                }
              >
                {busy && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                Move to {STATUS_LABELS[next]}
              </Button>
            ))}
          </div>
        )}
        {nextStates.length === 0 && (
          <p className="border-t pt-4 text-xs text-muted-foreground">
            This RFQ has reached a terminal state.
          </p>
        )}
      </div>

      {/* Contact */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Contact Details
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Name", rfq.name],
            ["Company", rfq.company ?? "—"],
            ["Email", rfq.email],
            ["Phone", rfq.phone ?? "—"],
            ["Country", rfq.country],
            ["Buyer Type", rfq.buyerType.replace("_", " ")],
            ["Container", rfq.containerEstimate ?? "—"],
            ["Target Price", rfq.targetPrice ?? "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-medium capitalize">{value}</p>
            </div>
          ))}
        </div>
        {rfq.notes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Buyer notes</p>
            <p className="text-sm whitespace-pre-wrap">{rfq.notes}</p>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Products ({rfq.items.length})
        </h2>
        {rfq.items.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            No specific products listed
          </div>
        ) : (
          <div className="space-y-2">
            {rfq.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2.5 text-sm"
              >
                <span className="font-medium">{item.productName}</span>
                <span className="text-muted-foreground">×{item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote notes (visible-to-buyer) */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Quote details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visible to buyer in the quote response. Pricing breakdown, lead time, terms.
            </p>
          </div>
          {!editable && (
            <Badge variant="outline" className="shrink-0 bg-muted text-muted-foreground">
              <LockIcon className="mr-1 h-3 w-3" /> Locked
            </Badge>
          )}
        </div>
        <Textarea
          value={quoteNotes}
          onChange={(e) => setQuoteNotes(e.target.value)}
          disabled={!editable || busy}
          rows={5}
          placeholder="Case price: $45 USD&#10;Lead time: 3 weeks&#10;FOB Port of Miami&#10;Payment: International Bank Transfer USD only"
        />
        <Button
          size="sm"
          disabled={!editable || busy || quoteNotes === (rfq.quoteNotes ?? "")}
          onClick={() => patch({ quoteNotes }, "Quote saved")}
        >
          {busy ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-2 h-3.5 w-3.5" />
          )}
          Save Quote
        </Button>
      </div>

      {/* Internal notes (admin-only) */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
          <div>
            <h2 className="text-sm font-semibold">Internal notes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Admin-only — never shown to buyer. Use for follow-up reminders, red flags, etc.
            </p>
          </div>
        </div>
        <Textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          disabled={busy}
          rows={3}
        />
        <Button
          size="sm"
          variant="outline"
          disabled={busy || internalNotes === (rfq.internalNotes ?? "")}
          onClick={() => patch({ internalNotes }, "Internal notes saved")}
        >
          {busy ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-2 h-3.5 w-3.5" />
          )}
          Save Internal Notes
        </Button>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Timeline
        </h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Submitted</span>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">
              {format(new Date(rfq.createdAt), "MMM d, HH:mm")}
            </span>
          </li>
          {rfq.confirmedAt && (
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Confirmed</span>
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {format(new Date(rfq.confirmedAt), "MMM d, HH:mm")}
              </span>
            </li>
          )}
          {rfq.lockedAt && (
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Locked</span>
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {format(new Date(rfq.lockedAt), "MMM d, HH:mm")}
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
