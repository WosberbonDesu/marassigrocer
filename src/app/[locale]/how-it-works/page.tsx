"use client";

import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/page-hero";

export default function HowItWorksPage() {
  const t = useTranslations("howItWorksPage");
  const locale = useLocale();

  const steps = [1, 2, 3, 4, 5, 6].map((n) => ({
    number: n,
    title: t(`steps.step${n}.title`),
    description: t(`steps.step${n}.description`),
    fromYou: t.raw(`steps.step${n}.fromYou`) as string[],
  }));

  return (
    <div>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        breadcrumbs={[{ label: t("title") }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex gap-6 pb-10 last:pb-0">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-12 h-full w-px bg-[oklch(0.72_0.11_80)]/30" />
                )}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[oklch(0.20_0.02_80)] text-sm font-bold text-[oklch(0.78_0.13_35)]">
                  {step.number}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="mt-4 rounded-xl border border-[oklch(0.72_0.11_80)]/15 bg-[oklch(0.72_0.11_80)]/5 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.72_0.11_80)]">
                      {t("whatWeNeed")}
                    </p>
                    <ul className="space-y-1">
                      {step.fromYou.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.72_0.11_80)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-[oklch(0.72_0.11_80)] text-white hover:bg-[oklch(0.85_0.08_85)] font-semibold"
            >
              <a href={`/${locale}/request-quote`}>
                {t("startRfq")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
