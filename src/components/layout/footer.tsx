"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Mail, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
import { offices } from "@/data/offices";
import { SOCIAL_URLS } from "@/lib/site-links";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  // Brief footer structure
  const sections = [
    {
      title: t("company"),
      links: [
        { label: t("about"), href: `/${locale}/company` },
        { label: t("links.whyMarassi"), href: `/${locale}/why-marassi` },
        { label: t("links.exportMarkets"), href: `/${locale}/markets` },
        { label: t("links.certificates"), href: `/${locale}/certificates` },
      ],
    },
    {
      title: t("products"),
      links: [
        { label: t("allProducts"), href: `/${locale}/products` },
        { label: t("brands"), href: `/${locale}/brands` },
        { label: t("links.privateLabel"), href: `/${locale}/private-label` },
        { label: t("links.mixedContainer"), href: `/${locale}/mixed-container` },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("links.quickOrder"), href: `/${locale}/quick-order` },
        { label: t("howItWorks"), href: `/${locale}/how-it-works` },
        { label: t("logisticsDocs"), href: `/${locale}/logistics` },
        { label: t("links.blogInsights"), href: `/${locale}/insights` },
        { label: t("faq"), href: `/${locale}/faq` },
      ],
    },
  ];

  const legalLinks = [
    { label: t("legal.privacy"), href: `/${locale}/p/privacy` },
    { label: t("legal.terms"), href: `/${locale}/p/terms` },
    { label: t("legal.cookies"), href: `/${locale}/p/cookies` },
  ];

  return (
    <footer className="border-t border-[oklch(0.72_0.11_80)]/10 bg-[oklch(0.20_0.02_80)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo + tagline column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/marassilogo.jpeg"
                alt="Marassi Group"
                width={40}
                height={40}
                className="h-9 w-9 rounded-lg object-contain"
              />
              <div>
                <p className="text-base font-bold text-white">MARASSI GROUP</p>
                <p className="text-[10px] tracking-widest text-[oklch(0.78_0.13_35)]">
                  {t("globalFmcgExport")}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {t("tagline")} — {t("taglineDescription")}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Linkedin, label: "LinkedIn", href: SOCIAL_URLS.linkedin },
                { icon: Facebook, label: "Facebook", href: SOCIAL_URLS.facebook },
                { icon: Instagram, label: "Instagram", href: SOCIAL_URLS.instagram },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[oklch(0.78_0.13_35)] hover:text-[oklch(0.78_0.13_35)]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-[oklch(0.78_0.13_35)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Offices strip */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
            {t("globalOffices")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offices.slice(0, 4).map((office) => (
              <div key={office.id} className="text-sm text-white/60">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.78_0.13_35)]" />
                  <div>
                    <p className="font-medium text-white">{office.city}, {office.country}</p>
                    {office.email && (
                      <a
                        href={`mailto:${office.email}`}
                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-white/50 hover:text-[oklch(0.78_0.13_35)]"
                      >
                        <Mail className="h-3 w-3" />
                        {office.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/40">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[oklch(0.78_0.13_35)] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
