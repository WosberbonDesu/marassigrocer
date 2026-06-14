"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  Zap, Upload, Trash2, Check, AlertTriangle, Loader2, Send, ShoppingCart, Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageHero } from "@/components/shared/page-hero";
import { useRFQStore } from "@/stores/rfq-store";

type Match = {
  identifier: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    moqHint: string | null;
    availability: string;
    packDescription: string | null;
  };
};

type NotFound = { identifier: string; quantity: number };

function parsePastedLines(raw: string): { identifier: string; quantity: number }[] {
  // Accept "SKU,QTY" or "SKU QTY" or "SKU\tQTY" or just "SKU" (qty defaults to 1)
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  return lines.map((line) => {
    const parts = line.split(/[,\t]|\s{1,}/).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return { identifier: "", quantity: 0 };
    const last = parts[parts.length - 1];
    const lastAsNum = Number(last);
    if (parts.length > 1 && Number.isFinite(lastAsNum) && lastAsNum > 0) {
      return {
        identifier: parts.slice(0, -1).join(" "),
        quantity: Math.floor(lastAsNum),
      };
    }
    return { identifier: parts.join(" "), quantity: 1 };
  });
}

export default function QuickOrderPage() {
  const locale = useLocale();
  const t = useTranslations("quickOrderPage");
  const [paste, setPaste] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notFound, setNotFound] = useState<NotFound[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem, openDrawer } = useRFQStore();

  const lookup = async () => {
    const items = parsePastedLines(paste).filter((i) => i.identifier);
    if (items.length === 0) {
      toast.error(t("toast.pasteAtLeastOne"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/products/bulk-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? t("toast.lookupFailed"));
        return;
      }
      setMatches(data.matches ?? []);
      setNotFound(data.notFound ?? []);
      setAddedIds(new Set());
      if ((data.matches ?? []).length === 0) {
        toast.error(t("toast.noMatchingProducts"));
      } else {
        toast.success(
          t("toast.matched", {
            matched: data.matches.length,
            total: items.length,
          }) +
            (data.notFound.length > 0
              ? t("toast.unmatchedSuffix", { count: data.notFound.length })
              : "")
        );
      }
    } catch {
      toast.error(t("toast.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (file: File) => {
    const text = await file.text();
    setPaste(text);
    setTimeout(() => lookup(), 50);
  };

  const addAllMatches = () => {
    let added = 0;
    for (const m of matches) {
      addItem({
        productId: m.product.id,
        productName: m.product.name,
        quantity: m.quantity,
        notes: "",
      });
      added++;
    }
    setAddedIds(new Set(matches.map((m) => m.product.id)));
    toast.success(t("toast.addedToRfq", { count: added }));
  };

  const addOne = (m: Match) => {
    addItem({
      productId: m.product.id,
      productName: m.product.name,
      quantity: m.quantity,
      notes: "",
    });
    setAddedIds((prev) => new Set(prev).add(m.product.id));
  };

  const clearAll = () => {
    setPaste("");
    setMatches([]);
    setNotFound([]);
    setAddedIds(new Set());
  };

  return (
    <div>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        locale={locale}
        breadcrumbs={[{ label: t("hero.breadcrumb") }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: input */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
                <h2 className="font-semibold">{t("input.heading")}</h2>
              </div>
              <Textarea
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                rows={10}
                placeholder={`cinnamon-pebbles-12, 10
84912-47577 40
froot-loops-12`}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {t.rich("input.formatHelp", {
                  code: (chunks) => (
                    <code className="rounded bg-muted px-1">{chunks}</code>
                  ),
                })}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={lookup} disabled={loading || !paste.trim()}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  {t("input.lookUp")}
                </Button>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
                  <Upload className="h-4 w-4" />
                  {t("input.uploadCsv")}
                  <input
                    type="file"
                    accept=".csv,.txt,text/csv,text/plain"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCsvUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>

                {(paste || matches.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    {t("input.clear")}
                  </Button>
                )}
              </div>
            </div>

            {/* Matches */}
            {matches.length > 0 && (
              <div className="rounded-2xl border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {t("matches.heading", { count: matches.length })}
                  </h2>
                  <Button
                    size="sm"
                    onClick={addAllMatches}
                    disabled={matches.every((m) => addedIds.has(m.product.id))}
                  >
                    {t("matches.addAll")}
                  </Button>
                </div>
                <div className="space-y-2">
                  {matches.map((m) => {
                    const added = addedIds.has(m.product.id);
                    return (
                      <div
                        key={m.identifier}
                        className="flex items-center gap-3 rounded-xl border p-3"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {m.product.image ? (
                            <Image
                              src={m.product.image}
                              alt=""
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{m.product.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {m.identifier}
                            {m.product.packDescription ? ` · ${m.product.packDescription}` : ""}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums">
                          ×{m.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant={added ? "outline" : "default"}
                          disabled={added}
                          onClick={() => addOne(m)}
                        >
                          {added ? (
                            <>
                              <Check className="mr-1 h-3.5 w-3.5" /> {t("matches.added")}
                            </>
                          ) : (
                            t("matches.add")
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Not found */}
            {notFound.length > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h2 className="font-semibold text-amber-700">
                    {t("notFound.heading", { count: notFound.length })}
                  </h2>
                </div>
                <p className="text-xs text-amber-700/80">
                  {t("notFound.description")}
                </p>
                <ul className="space-y-1 text-sm font-mono">
                  {notFound.map((n, i) => (
                    <li key={i} className="flex items-center justify-between text-amber-800">
                      <span className="truncate">{n.identifier}</span>
                      <span className="shrink-0">×{n.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: sticky CTA */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-2xl border bg-card p-5 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-[oklch(0.72_0.11_80)]" />
                {t("sidebar.rfqTitle")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("sidebar.rfqDescription")}
              </p>
              <Button
                className="w-full"
                onClick={() => openDrawer("list")}
              >
                <Send className="mr-2 h-4 w-4" />
                {t("sidebar.openDrawer")}
              </Button>
            </div>

            <div className="rounded-2xl border border-dashed bg-muted/20 p-5 space-y-2">
              <h3 className="text-sm font-semibold">{t("tips.heading")}</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>
                  •{" "}
                  {t.rich("tips.comments", {
                    code: (chunks) => <code>{chunks}</code>,
                  })}
                </li>
                <li>• {t("tips.separator")}</li>
                <li>• {t("tips.limit")}</li>
                <li>
                  •{" "}
                  {t.rich("tips.csvFormats", {
                    code: (chunks) => <code>{chunks}</code>,
                  })}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
