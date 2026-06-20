"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HelpCircle,
  Package,
  Ship,
  Tag,
  Search,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/shared/page-hero";
import { faqs } from "@/data/faqs";
import type { FAQ } from "@/types";
import { WHATSAPP_URL } from "@/lib/site-links";

const CATEGORIES: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: FAQ["tags"][number];
}[] = [
  {
    id: "general",
    icon: HelpCircle,
    tag: "general",
  },
  {
    id: "products",
    icon: Package,
    tag: "products",
  },
  {
    id: "logistics",
    icon: Ship,
    tag: "logistics",
  },
  {
    id: "private_label",
    icon: Tag,
    tag: "private_label",
  },
];

export default function FAQPage() {
  const locale = useLocale();
  const t = useTranslations("faqPage");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCategory =
        activeCategory === "all" || f.tags.includes(activeCategory as FAQ["tags"][number]);
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: faqs.length };
    for (const c of CATEGORIES) {
      map[c.id] = faqs.filter((f) => f.tags.includes(c.tag)).length;
    }
    return map;
  }, []);

  return (
    <div className="bg-background">
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        breadcrumbs={[{ label: t("hero.breadcrumb") }]}
        locale={locale}
      />

      {/* Category cards */}
      <section className="bg-[#faf8f4] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory((prev) => (prev === cat.id ? "all" : cat.id))
                  }
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className={`group flex flex-col items-start rounded-2xl border p-6 text-left transition-all ${
                    isActive
                      ? "border-[oklch(0.72_0.11_80)] bg-white shadow-lg shadow-[oklch(0.20_0.02_80)]/8"
                      : "border-border bg-white hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-[oklch(0.72_0.11_80)] text-white"
                        : "bg-[oklch(0.72_0.11_80)]/12 text-[oklch(0.60_0.12_75)] group-hover:bg-[oklch(0.72_0.11_80)]/20"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold leading-tight">
                    {t(`categories.${cat.id}.label`)}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {t(`categories.${cat.id}.description`)}
                  </p>
                  <span className="mt-3 inline-flex items-center rounded-full bg-[oklch(0.72_0.11_80)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.50_0.12_75)]">
                    {t("questionsCount", { count: categoryCounts[cat.id] })}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search + Accordion list */}
      <section className="bg-[#faf8f4] pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Filter bar */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-11 pl-9"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                  activeCategory === "all"
                    ? "bg-[oklch(0.20_0.02_80)] text-white"
                    : "bg-muted text-muted-foreground hover:bg-[oklch(0.72_0.11_80)]/10 hover:text-[oklch(0.50_0.12_75)]"
                }`}
              >
                {t("allFilter", { count: categoryCounts.all })}
              </button>
              {activeCategory !== "all" && (
                <span className="rounded-full bg-[oklch(0.72_0.11_80)]/10 px-3 py-1.5 font-semibold text-[oklch(0.50_0.12_75)]">
                  {t(`categories.${activeCategory}.label`)}
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mt-6 rounded-2xl border border-border bg-white p-2 sm:p-4">
            {filtered.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filtered.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border-border last:border-b-0"
                  >
                    <AccordionTrigger className="px-2 text-left text-[15px] font-medium hover:no-underline sm:px-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-2 text-sm leading-relaxed text-muted-foreground sm:px-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">{t("empty.title")}</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  {t("empty.description")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("all");
                  }}
                >
                  {t("empty.reset")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA — dark band */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] text-white">
        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[oklch(0.72_0.11_80)]/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[400px] w-[400px] rounded-full bg-[oklch(0.66_0.16_35)]/8 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_auto]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.78_0.12_80)]">
                {t("cta.eyebrow")}
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {t("cta.headingLine1")}
                <br className="hidden sm:block" />
                {t("cta.headingLine2")}
              </h2>
              <p className="mt-4 max-w-xl text-base text-white/65">
                {t("cta.description")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="h-12 bg-[oklch(0.66_0.16_35)] px-7 text-base font-semibold text-white shadow-lg shadow-[oklch(0.66_0.16_35)]/20 hover:bg-[oklch(0.60_0.17_35)]"
              >
                <a href={`/${locale}/request-quote`}>
                  {t("cta.requestQuote")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <a href={`/${locale}/contact`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t("cta.contactSales")}
                </a>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3"
          >
            <a
              href="mailto:export@marassigroup.com"
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-[oklch(0.78_0.12_80)]/40 hover:bg-white/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.78_0.12_80)]">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-white/50">{t("contact.emailLabel")}</p>
                <p className="truncate text-sm font-medium text-white">export@marassigroup.com</p>
              </div>
            </a>
            <a
              href="tel:+905512623859"
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-[oklch(0.78_0.12_80)]/40 hover:bg-white/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.78_0.12_80)]">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-white/50">{t("contact.phoneLabel")}</p>
                <p className="truncate text-sm font-medium text-white">+90 (551) 262 38 59</p>
              </div>
            </a>
            <a
              href={WHATSAPP_URL()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-[#25D366]/40 hover:bg-white/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-white/50">{t("contact.whatsappLabel")}</p>
                <p className="truncate text-sm font-medium text-white">{t("contact.whatsappValue")}</p>
              </div>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
