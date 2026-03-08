"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  page?: number;
  pages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  page = 1,
  pages = 1,
  onPageChange,
  isLoading,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3", col.className)}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && onPageChange && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Page {page} of {pages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page - 2 + i;
              if (p < 1 || p > pages) return null;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
