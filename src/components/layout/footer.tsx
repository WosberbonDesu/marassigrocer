"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { offices } from "@/data/offices";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const sections = [
    {
      title: t("company"),
      links: [
        { label: t("about"), href: `/${locale}/company` },
        { label: t("capabilities"), href: `/${locale}/company` },
      ],
    },
    {
      title: t("products"),
      links: [
        { label: t("allProducts"), href: `/${locale}/products` },
        { label: t("categories"), href: `/${locale}/products` },
        { label: t("brands"), href: `/${locale}/products` },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("howItWorks"), href: `/${locale}/how-it-works` },
        { label: t("logisticsDocs"), href: `/${locale}/logistics` },
        { label: t("blog"), href: `/${locale}/insights` },
      ],
    },
  ];

  return (
    <footer className="border-t border-[oklch(0.76_0.11_80)]/10 bg-[oklch(0.12_0.01_60)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[oklch(0.76_0.11_80)]">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-[oklch(0.76_0.11_80)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[oklch(0.76_0.11_80)]">
              {t("contact")}
            </h3>
            <ul className="space-y-3">
              {offices.map((office) => (
                <li key={office.id} className="text-sm text-white/60">
                  <span className="font-medium text-white">
                    {office.city}
                  </span>
                  <br />
                  {office.email}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[oklch(0.76_0.11_80)]/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/images/marassilogo.jpeg"
                alt="Marassi Group"
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
              />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-[oklch(0.76_0.11_80)]">MARASSI</span>
                  <span className="text-[10px] font-medium tracking-widest text-white/40">GROUP</span>
                </div>
                <p className="text-xs text-white/40">
                  {t("tagline")}
                </p>
              </div>
            </div>
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} {t("copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
