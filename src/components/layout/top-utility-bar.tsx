"use client";

import { useLocale } from "next-intl";
import { Award, Globe, Mail, Phone, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const localeShort: Record<string, string> = {
  en: "EN",
  tr: "TR",
  ar: "AR",
  ru: "RU",
  es: "ES",
  de: "DE",
  it: "IT",
  pt: "PT",
};

export function TopUtilityBar() {
  const locale = useLocale();

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

  return (
    <div className="hidden border-b border-white/10 bg-[oklch(0.16_0.02_80)] text-white/80 sm:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 min-w-0">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Award className="h-3 w-3 text-[oklch(0.78_0.12_80)]" />
            Trusted FMCG Export Partner Since 1996
          </span>
          <span className="hidden items-center gap-1.5 whitespace-nowrap md:inline-flex">
            <Globe className="h-3 w-3 text-[oklch(0.78_0.12_80)]" />
            Serving 50+ Markets Worldwide
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="mailto:info@marassigroup.com"
            className="flex items-center gap-1.5 transition-colors hover:text-[oklch(0.82_0.11_80)]"
          >
            <Mail className="h-3 w-3" />
            <span className="hidden md:inline">info@marassigroup.com</span>
          </a>
          <a
            href="tel:+97141234567"
            className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[oklch(0.82_0.11_80)]"
          >
            <Phone className="h-3 w-3" />
            +971 4 123 4567
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:text-[oklch(0.82_0.11_80)] outline-none">
              <Globe className="h-3 w-3" />
              <span>{localeShort[locale] ?? "EN"}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
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
        </div>
      </div>
    </div>
  );
}
