"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRFQStore } from "@/stores/rfq-store";

const navLinks = [
  { href: "/products", key: "products" },
  { href: "/private-label", key: "privateLabel" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/markets", key: "markets" },
  { href: "/company", key: "company" },
  { href: "/contact", key: "contact" },
] as const;

const localeLabels: Record<string, string> = {
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
  ru: "Русский",
};

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const openDrawer = useRFQStore((s) => s.openDrawer);
  const itemCount = useRFQStore((s) => s.items.length);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    const allLocales = ["en", "tr", "ar", "ru"];
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (allLocales.includes(parts[0])) {
      parts[0] = newLocale;
    } else {
      parts.unshift(newLocale);
    }
    window.location.href = "/" + parts.join("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.12_0.01_60)]/95 backdrop-blur-md border-b border-[oklch(0.76_0.11_80)]/10 shadow-sm"
          : "bg-[oklch(0.12_0.01_60)]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/marassilogo.jpeg"
            alt="Marassi Group"
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-[oklch(0.76_0.11_80)]">
              MARASSI
            </span>
            <span className="text-[10px] font-medium tracking-widest text-[oklch(0.76_0.11_80)]/60">
              GROUP
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-[oklch(0.76_0.11_80)]"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Locale Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden text-white/70 hover:text-[oklch(0.76_0.11_80)] hover:bg-white/10 sm:flex">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(localeLabels).map(([loc, label]) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={locale === loc ? "bg-accent" : ""}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* RFQ Button */}
          <Button
            onClick={() => openDrawer()}
            className="hidden bg-[oklch(0.76_0.11_80)] text-[oklch(0.12_0.01_60)] hover:bg-[oklch(0.82_0.11_80)] sm:inline-flex"
            size="sm"
          >
            {t("requestQuote")}
            {itemCount > 0 && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-bold text-primary">
                {itemCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-[oklch(0.76_0.11_80)] hover:bg-white/10 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-lg font-medium text-foreground/80 transition-colors hover:bg-[oklch(0.76_0.11_80)]/10 hover:text-[oklch(0.76_0.11_80)]"
                  >
                    {t(link.key)}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                <div className="flex gap-2">
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
                  onClick={() => {
                    openDrawer();
                    setMobileOpen(false);
                  }}
                  className="mt-2"
                >
                  {t("requestQuote")}
                  {itemCount > 0 && (
                    <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-bold text-primary">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
