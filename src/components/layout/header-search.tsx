"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  images: string[];
  sku?: string;
  brand?: { name: string } | null;
  category?: { name: string } | null;
}

export function HeaderSearch({ variant = "light" }: { variant?: "light" | "dark" } = {}) {
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=8`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.products ?? []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard: cmd/ctrl+k focuses
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const goToResults = () => {
    if (query.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const isDark = variant === "dark";

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToResults();
        }}
        className="relative"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, categories…"
          className={
            isDark
              ? "h-10 w-56 rounded-full border border-white/15 bg-white/[0.06] pl-4 pr-11 text-sm text-white placeholder:text-white/45 outline-none transition-all focus:w-72 focus:border-[oklch(0.72_0.11_80)]/50 focus:bg-white/[0.10] focus:ring-2 focus:ring-[oklch(0.72_0.11_80)]/25 lg:w-64"
              : "h-10 w-48 rounded-lg border border-border bg-muted/40 pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:w-72 focus:border-[oklch(0.72_0.11_80)] focus:bg-white focus:ring-2 focus:ring-[oklch(0.72_0.11_80)]/20 lg:w-56"
          }
        />
        {!isDark && (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className={
              isDark
                ? "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
                : "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            }
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : isDark ? (
          <button
            type="button"
            onClick={goToResults}
            aria-label="Search"
            className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[oklch(0.72_0.11_80)] transition-colors hover:bg-[oklch(0.72_0.11_80)]/15"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground lg:inline-flex">
            ⌘K
          </kbd>
        )}
      </form>

      {/* Dropdown */}
      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 w-[min(28rem,90vw)] overflow-hidden rounded-xl border bg-popover shadow-2xl">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-6 w-6 text-muted-foreground/40" />
              <p className="mt-2 text-sm font-medium">No products found</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Try different keywords or browse the catalog.
              </p>
            </div>
          ) : (
            <>
              <ul className="max-h-[60vh] overflow-y-auto py-1">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/${locale}/products/${r.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {r.images?.[0] ? (
                          <Image
                            src={r.images[0]}
                            alt=""
                            fill
                            className="object-contain p-1"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{r.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {r.brand?.name ?? "—"}
                          {r.category?.name ? ` · ${r.category.name}` : ""}
                          {r.sku ? ` · ${r.sku}` : ""}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="block w-full border-t bg-muted/30 px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-muted"
              >
                See all results for &ldquo;{query}&rdquo; →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
