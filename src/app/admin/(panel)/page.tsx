"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, Tag, Award, Inbox, TrendingUp, ArrowRight, Plus,
  Ticket, Star, FileText, ShoppingBag, Globe, UserCheck,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/top-bar";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const RfqWorldMap = dynamic(
  () => import("@/components/admin/rfq-world-map").then((m) => m.RfqWorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] w-full animate-pulse rounded-xl bg-muted" />
    ),
  }
);

type AvailabilityKey = "in_stock" | "on_request" | "seasonal" | "discontinued";

interface Dashboard {
  products: {
    total: number;
    published: number;
    draft: number;
    featured: number;
    availability: Record<AvailabilityKey, number>;
  };
  catalog: { categories: number; brands: number };
  rfq: {
    total: number;
    newUnread: number;
    last7d: number;
    byCountry: { country: string; count: number }[];
    recent: {
      id: string;
      name: string;
      company: string | null;
      country: string;
      status: string;
      itemsCount: number;
      createdAt: string;
    }[];
    topProducts: { id: string; name: string; count: number; totalQty: number }[];
  };
  promos: { active: number };
  customers: { pending: number; approved: number };
}

const AVAILABILITY_LABELS: Record<AvailabilityKey, string> = {
  in_stock: "In Stock",
  on_request: "On Request",
  seasonal: "Seasonal",
  discontinued: "Discontinued",
};

const AVAILABILITY_COLORS: Record<AvailabilityKey, string> = {
  in_stock: "bg-emerald-500",
  on_request: "bg-amber-500",
  seasonal: "bg-blue-500",
  discontinued: "bg-neutral-400",
};

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function AdminDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total RFQ",
      value: data?.rfq.total ?? 0,
      hint: data?.rfq.newUnread
        ? `${data.rfq.newUnread} new unread`
        : "all reviewed",
      icon: Inbox,
      href: "/admin/rfq",
      tone: "bg-orange-500/10 text-orange-600",
      pulse: !!data?.rfq.newUnread,
    },
    {
      label: "RFQ Last 7 Days",
      value: data?.rfq.last7d ?? 0,
      hint: "incoming requests",
      icon: TrendingUp,
      href: "/admin/rfq",
      tone: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Products",
      value: data?.products.total ?? 0,
      hint: data
        ? `${data.products.published} published · ${data.products.draft} draft`
        : "—",
      icon: Package,
      href: "/admin/products",
      tone: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Pending Customers",
      value: data?.customers.pending ?? 0,
      hint: data?.customers.approved
        ? `${data.customers.approved} approved`
        : "awaiting approval",
      icon: UserCheck,
      href: "/admin/customers",
      tone: "bg-purple-500/10 text-purple-600",
      pulse: !!data?.customers.pending,
    },
  ];

  const quickActions = [
    { label: "Add Product", href: "/admin/products/new", icon: Package },
    { label: "Add Category", href: "/admin/categories/new", icon: Tag },
    { label: "Add Brand", href: "/admin/brands/new", icon: Award },
    { label: "New Promo", href: "/admin/promos/new", icon: Ticket },
    { label: "New Page", href: "/admin/pages/new", icon: FileText },
  ];

  const availabilityTotal =
    data?.products.availability
      ? Object.values(data.products.availability).reduce((a, b) => a + b, 0)
      : 0;

  return (
    <>
      <AdminTopBar title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stat row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, hint, icon: Icon, href, tone, pulse }) => (
            <Link
              key={label}
              href={href}
              className="group relative rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-[oklch(0.72_0.11_80)]/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tone)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">
                {loading ? (
                  <span className="inline-block h-8 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  value
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
              {pulse && (
                <span className="absolute right-4 top-4 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Mid row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Availability breakdown */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
                Stock Status
              </h2>
              <Link
                href="/admin/products"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Manage →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-7 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : availabilityTotal === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No products yet.
              </p>
            ) : (
              <>
                {/* Stacked bar */}
                <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                  {(Object.keys(AVAILABILITY_LABELS) as AvailabilityKey[]).map((key) => {
                    const v = data!.products.availability[key] ?? 0;
                    const pct = (v / availabilityTotal) * 100;
                    if (pct === 0) return null;
                    return (
                      <div
                        key={key}
                        className={cn("h-full transition-all", AVAILABILITY_COLORS[key])}
                        style={{ width: `${pct}%` }}
                        title={`${AVAILABILITY_LABELS[key]}: ${v}`}
                      />
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="space-y-1.5">
                  {(Object.keys(AVAILABILITY_LABELS) as AvailabilityKey[]).map((key) => {
                    const v = data!.products.availability[key] ?? 0;
                    const pct = ((v / availabilityTotal) * 100).toFixed(0);
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn("h-2.5 w-2.5 rounded-full", AVAILABILITY_COLORS[key])}
                          />
                          <span className="text-muted-foreground">
                            {AVAILABILITY_LABELS[key]}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium tabular-nums">{v}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Catalog summary */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
              Catalog
            </h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Link href="/admin/categories" className="rounded-xl border p-3 hover:bg-muted transition-colors">
                <p className="text-2xl font-bold tabular-nums">
                  {loading ? "—" : data?.catalog.categories ?? 0}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Categories</p>
              </Link>
              <Link href="/admin/brands" className="rounded-xl border p-3 hover:bg-muted transition-colors">
                <p className="text-2xl font-bold tabular-nums">
                  {loading ? "—" : data?.catalog.brands ?? 0}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Brands</p>
              </Link>
              <Link href="/admin/products?featured=1" className="rounded-xl border p-3 hover:bg-muted transition-colors">
                <p className="flex items-center justify-center gap-1 text-2xl font-bold tabular-nums">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {loading ? "—" : data?.products.featured ?? 0}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Featured</p>
              </Link>
            </div>
            <div className="rounded-xl border border-dashed bg-muted/20 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick actions</p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickActions.slice(0, 4).map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium hover:border-[oklch(0.72_0.11_80)]/40 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{label.replace("Add ", "").replace("New ", "")}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Top requested products (last 30d) */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
                Top Requested
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Last 30d
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-7 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : !data?.rfq.topProducts.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No RFQ activity yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {data.rfq.topProducts.map((p, idx) => {
                  const max = data.rfq.topProducts[0]?.count ?? 1;
                  const pct = (p.count / max) * 100;
                  return (
                    <Link
                      key={p.id}
                      href={`/admin/products/${p.id}`}
                      className="group block space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                            {idx + 1}
                          </span>
                          <span className="truncate group-hover:text-[oklch(0.60_0.12_75)] transition-colors">
                            {p.name}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold tabular-nums">
                          {p.count}×
                        </span>
                      </div>
                      <div className="ml-7 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-[oklch(0.72_0.11_80)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Global RFQ activity map */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
              Global RFQ Activity
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Last 30d · {data?.rfq.byCountry.length ?? 0} countries
            </span>
          </div>
          {loading ? (
            <div className="h-[380px] w-full animate-pulse rounded-xl bg-muted" />
          ) : (
            <RfqWorldMap data={data?.rfq.byCountry ?? []} />
          )}
        </div>

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent RFQs */}
          <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Inbox className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
                Recent RFQs
              </h2>
              <Link
                href="/admin/rfq"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : !data?.rfq.recent.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No submissions yet.
              </p>
            ) : (
              <div className="space-y-1">
                {data.rfq.recent.map((r) => (
                  <Link
                    key={r.id}
                    href={`/admin/rfq/${r.id}`}
                    className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <Inbox className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {r.company || r.name}
                        </p>
                        {r.status === "new" && (
                          <span className="shrink-0 rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-orange-600">
                            New
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.country} · {r.itemsCount} item{r.itemsCount === 1 ? "" : "s"}
                        {r.company ? ` · ${r.name}` : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {formatRelative(r.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* RFQ by country (top 6) */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
                RFQ by Country
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Last 30d
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-7 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : !data?.rfq.byCountry.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No country data yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {data.rfq.byCountry.slice(0, 6).map((c) => {
                  const max = data.rfq.byCountry[0]?.count ?? 1;
                  const pct = (c.count / max) * 100;
                  return (
                    <div key={c.country} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate">{c.country}</span>
                        <span className="shrink-0 text-xs font-semibold tabular-nums">
                          {c.count}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-[oklch(0.72_0.11_80)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
