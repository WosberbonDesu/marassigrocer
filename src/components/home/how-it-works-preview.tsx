"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { StepsTimeline } from "@/components/shared/steps-timeline";

export function HowItWorksPreview() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();

  const steps = [1, 2, 3, 4, 5].map((n) => ({
    number: n,
    title: t(`steps.step${n}.title`),
    description: t(`steps.step${n}.description`),
  }));

  return (
    <section className="relative overflow-hidden bg-[oklch(0.18_0.02_80)] py-16 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} variant="dark" />
        <StepsTimeline steps={steps} variant="horizontal" dark />
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            asChild
            className="border-[oklch(0.78_0.12_80)]/40 bg-transparent text-[oklch(0.82_0.11_80)] hover:bg-[oklch(0.78_0.12_80)]/10 hover:text-[oklch(0.85_0.10_80)]"
          >
            <Link href={`/${locale}/how-it-works`}>
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
