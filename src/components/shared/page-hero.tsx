import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  locale?: string;
}

export function PageHero({ title, subtitle, breadcrumbs, locale }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.12_0.01_60)] text-white">
      {/* Gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.76_0.11_80)]/10 via-transparent to-[oklch(0.76_0.11_80)]/5" />
      <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[oklch(0.76_0.11_80)]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/40">
            <Link
              href={`/${locale || "en"}`}
              className="flex items-center gap-1 transition-colors hover:text-[oklch(0.76_0.11_80)]"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-[oklch(0.76_0.11_80)]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/70">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Gold accent line */}
        <div className="mb-4 h-1 w-12 rounded-full bg-[oklch(0.76_0.11_80)]" />
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
