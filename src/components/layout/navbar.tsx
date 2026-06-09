"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRFQStore } from "@/stores/rfq-store";
import { CustomerSessionBadge } from "@/components/layout/customer-session-badge";
import { HeaderSearch } from "@/components/layout/header-search";

const categoryLinks = [
  { id: "biscuits", href: "/products/list?category=biscuits" },
  { id: "dairy", href: "/products/list?category=dairy" },
  { id: "beverages", href: "/products/list?category=beverages" },
  { id: "snacks", href: "/products/list?category=snacks-confectionery" },
  { id: "sauces", href: "/products/list?category=oils-condiments" },
  { id: "canned", href: "/products/list?category=canned-jarred-foods" },
];

const exportServiceLinks = [
  { id: "privateLabel", href: "/private-label" },
  { id: "mixedContainer", href: "/mixed-container" },
  { id: "logisticsShipping", href: "/logistics" },
  { id: "sourcing", href: "/how-it-works" },
  { id: "exportDocs", href: "/logistics" },
];

const primaryLinks = [
  { id: "home", href: "/" },
  { id: "products", href: "/products" },
  { id: "privateLabel", href: "/private-label" },
  { id: "about", href: "/company" },
  { id: "contact", href: "/contact" },
] as const;

const localeLabels: Record<string, string> = {
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
  ru: "Русский",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const itemCount = useRFQStore((s) => s.items.length);
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const allLocales = ["en", "tr", "ar", "ru", "es", "de", "it", "pt"];
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (allLocales.includes(parts[0])) {
      parts[0] = newLocale;
    } else {
      parts.unshift(newLocale);
    }
    window.location.href = "/" + parts.join("/");
  };

  const homeActive = isActive(pathname, "/");
  const productsActive = isActive(pathname, "/products");
  const privateActive = isActive(pathname, "/private-label");
  const aboutActive = isActive(pathname, "/company");
  const contactActive = isActive(pathname, "/contact");
  const categoriesActive = false;
  const exportActive =
    isActive(pathname, "/mixed-container") ||
    isActive(pathname, "/logistics") ||
    isActive(pathname, "/how-it-works");

  const linkBase =
    "relative px-2 py-5 text-[13px] font-medium whitespace-nowrap transition-colors xl:px-2.5 xl:text-sm";
  const linkIdle = "text-white/70 hover:text-white";
  const linkActive = "text-[oklch(0.78_0.12_80)]";
  const underline =
    "after:absolute after:bottom-3 after:left-1/2 after:h-[2px] after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-[oklch(0.78_0.12_80)]";

  return (
    <header className="sticky top-0 z-50 w-full bg-[oklch(0.18_0.02_80)] text-white shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/marassilogo.jpeg"
            alt="Marassi Group"
            width={40}
            height={40}
            className="h-10 w-10 rounded-md object-contain"
            priority
          />
          <div className="hidden flex-col leading-none sm:flex lg:hidden xl:flex">
            <span className="font-[family-name:var(--font-playfair)] text-base font-bold tracking-tight text-white xl:text-lg">
              MARASSI
            </span>
            <span className="text-[9px] font-medium tracking-[0.28em] text-[oklch(0.78_0.12_80)] xl:text-[10px]">
              GROUP
            </span>
          </div>
        </Link>

        {/* Search — only at xl */}
        <div className="hidden xl:block">
          <HeaderSearch variant="dark" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden flex-1 items-center justify-center gap-0 lg:flex">
          <Link
            href="/"
            className={`${linkBase} ${homeActive ? `${linkActive} ${underline}` : linkIdle}`}
          >
            {t("home")}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`${linkBase} flex items-center gap-0.5 outline-none ${
                  categoriesActive ? `${linkActive} ${underline}` : linkIdle
                }`}
              >
                {t("categories")}
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem asChild className="font-semibold">
                <Link href="/products">{t("allCategories")}</Link>
              </DropdownMenuItem>
              {categoryLinks.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link href={c.href}>{t(`categoryLinks.${c.id}`)}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild className="font-semibold text-[oklch(0.60_0.12_75)]">
                <Link href="/products">{t("viewAllCategories")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/products"
            className={`${linkBase} ${productsActive ? `${linkActive} ${underline}` : linkIdle}`}
          >
            {t("products")}
          </Link>
          <Link
            href="/private-label"
            className={`${linkBase} ${privateActive ? `${linkActive} ${underline}` : linkIdle}`}
          >
            {t("privateLabel")}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`${linkBase} flex items-center gap-0.5 outline-none ${
                  exportActive ? `${linkActive} ${underline}` : linkIdle
                }`}
              >
                {t("exportServices")}
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {exportServiceLinks.map((s) => (
                <DropdownMenuItem key={s.id} asChild>
                  <Link href={s.href}>{t(`exportServiceLinks.${s.id}`)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/company"
            className={`${linkBase} ${aboutActive ? `${linkActive} ${underline}` : linkIdle}`}
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className={`${linkBase} ${contactActive ? `${linkActive} ${underline}` : linkIdle}`}
          >
            {t("contact")}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          <CustomerSessionBadge variant="dark" />

          {/* Download Catalog — gold outline (only xl) */}
          <Button
            variant="outline"
            size="sm"
            className="hidden h-10 shrink-0 border-[oklch(0.72_0.11_80)]/45 bg-transparent px-3.5 text-[13px] font-medium text-[oklch(0.82_0.11_80)] hover:border-[oklch(0.72_0.11_80)] hover:bg-[oklch(0.72_0.11_80)]/12 hover:text-[oklch(0.82_0.11_80)] xl:inline-flex"
          >
            <Download className="mr-1.5 h-4 w-4" />
            {t("download")}
          </Button>

          {/* Request a Quote — coral */}
          <Button
            asChild
            size="sm"
            className="hidden h-10 shrink-0 bg-[oklch(0.66_0.16_35)] px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-[oklch(0.60_0.17_35)] sm:inline-flex xl:px-5 xl:text-sm"
          >
            <Link href="/request-quote">
              {t("requestQuote")}
              {itemCount > 0 && (
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">{t("navigationMenu")}</SheetTitle>
              <div className="flex flex-col gap-1 pt-8">
                {primaryLinks.map((l) => (
                  <Link
                    key={l.id}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-[oklch(0.72_0.11_80)]/10 hover:text-[oklch(0.60_0.12_75)]"
                  >
                    {t(`primaryLinks.${l.id}`)}
                  </Link>
                ))}
                <div className="my-3 border-t" />
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("categories")}
                </p>
                {categoryLinks.slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    href={c.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {t(`categoryLinks.${c.id}`)}
                  </Link>
                ))}
                <div className="my-3 border-t" />
                <div className="flex flex-wrap gap-1.5 px-1">
                  {Object.entries(localeLabels).map(([loc, label]) => (
                    <Button
                      key={loc}
                      variant={locale === loc ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        switchLocale(loc);
                        setMobileOpen(false);
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-3 border-[oklch(0.72_0.11_80)] text-[oklch(0.60_0.12_75)] hover:bg-[oklch(0.72_0.11_80)]/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("downloadCatalog")}
                </Button>
                <Button
                  asChild
                  onClick={() => setMobileOpen(false)}
                  className="bg-[oklch(0.66_0.16_35)] text-white hover:bg-[oklch(0.60_0.17_35)]"
                >
                  <Link href="/request-quote">
                    {t("requestQuote")}
                    {itemCount > 0 && (
                      <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
