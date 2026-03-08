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
    <section className="bg-[oklch(0.12_0.01_60)] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        <StepsTimeline steps={steps} variant="horizontal" />
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
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
