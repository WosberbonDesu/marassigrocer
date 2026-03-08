"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package, Tag, Award, Image as ImageIcon, Plus, ArrowRight, TrendingUp,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/top-bar";
import { Button } from "@/components/ui/button";

interface Stats {
  products: number;
  categories: number;
  brands: number;
}

interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  brand: { name: string } | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, brands: 0 });
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products?limit=1").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/brands").then((r) => r.json()),
      fetch("/api/admin/products?limit=5&sort=createdAt&order=desc").then((r) => r.json()),
    ]).then(([p, c, b, recent]) => {
      setStats({
        products: p.total ?? 0,
        categories: c.categories?.length ?? 0,
        brands: b.brands?.length ?? 0,
      });
      setRecentProducts(recent.products ?? []);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.products, icon: Package, href: "/admin/products", color: "bg-blue-500/10 text-blue-500" },
    { label: "Categories", value: stats.categories, icon: Tag, href: "/admin/categories", color: "bg-emerald-500/10 text-emerald-500" },
    { label: "Brands", value: stats.brands, icon: Award, href: "/admin/brands", color: "bg-amber-500/10 text-amber-500" },
    { label: "Media Library", value: "Browse", icon: ImageIcon, href: "/admin/media", color: "bg-purple-500/10 text-purple-500" },
  ];

  const quickActions = [
    { label: "Add Product", href: "/admin/products/new", icon: Package },
    { label: "Add Category", href: "/admin/categories/new", icon: Tag },
    { label: "Add Brand", href: "/admin/brands/new", icon: Award },
    { label: "Upload Media", href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <>
      <AdminTopBar title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-[oklch(0.76_0.11_80)]/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} transition-colors`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold">
                {loading ? (
                  <span className="inline-block h-8 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  value
                )}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[oklch(0.76_0.11_80)]" />
              Quick Actions
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-3"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Products */}
          <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Products</h2>
              <Link
                href="/admin/products"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProducts.length > 0 ? (
              <div className="space-y-2">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand?.name ?? "No brand"}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No products yet. Start by adding your first product.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
