import Link from "next/link";
import { Ship, Package, Layers, Zap, Check, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mixedContainerPage" });
  return { title: t("meta.title"), description: t("meta.description") };
}

const benefits = [
  { id: "products", icon: Layers },
  { id: "moq", icon: Package },
  { id: "timeToShelf", icon: Zap },
  { id: "loading", icon: Ship },
];

const containerSpecs = [
  {
    type: "20' Standard",
    pallets: "20 pallets",
    cube: "900 cube ft",
    weight: "35,150 lbs max",
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  {
    type: "40' Standard",
    pallets: "42 pallets",
    cube: "1,800 cube ft",
    weight: "44,800–54,000 lbs",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  {
    type: "40' Reefer",
    pallets: "39 pallets",
    cube: "1,800 cube ft",
    weight: "44,000 lbs",
    color: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  },
];

const process = [
  { n: "01", id: "shoppingList" },
  { n: "02", id: "loadingPlan" },
  { n: "03", id: "invoice" },
  { n: "04", id: "supervisedLoading" },
  { n: "05", id: "tracking" },
];

const checklistItems = [
  "commercialInvoice",
  "packingList",
  "billOfLading",
  "certificateOfOrigin",
  "healthCertification",
  "labeling",
  "palletWeight",
  "loadingPhotos",
  "tracking",
  "salesRep",
];

export default async function MixedContainerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("mixedContainerPage");

  return (
    <div>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        locale={locale}
        breadcrumbs={[{ label: t("hero.breadcrumb") }]}
      />

      {/* Hero stat */}
      <section className="border-b bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-primary">
            50
          </p>
          <p className="mt-2 text-lg text-muted-foreground">
            {t("stat.caption")}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("benefits.heading")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("benefits.description")}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, id }) => (
              <div
                key={id}
                className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold leading-snug">{t(`benefits.items.${id}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`benefits.items.${id}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Container specs */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {t("specs.heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            {t("specs.description")}
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {containerSpecs.map((c) => (
              <div key={c.type} className="rounded-2xl border bg-card p-6 text-center">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${c.color}`}>
                  {c.type}
                </span>
                <div className="mt-5 space-y-3 text-left">
                  <div className="flex items-center justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">{t("specs.pallets")}</span>
                    <span className="font-semibold">{c.pallets}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">{t("specs.cube")}</span>
                    <span className="font-semibold">{c.cube}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("specs.maxWeight")}</span>
                    <span className="font-semibold">{c.weight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {t("process.heading")}
          </h2>
          <div className="mt-10 space-y-0">
            {process.map((step, i) => (
              <div key={step.n} className="relative flex gap-6 pb-10 last:pb-0">
                {i < process.length - 1 && (
                  <div className="absolute left-5 top-12 h-full w-px bg-border" />
                )}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.n}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold">{t(`process.items.${step.id}.title`)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(`process.items.${step.id}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included checklist */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-center text-3xl font-bold tracking-tight">
            {t("included.heading")}
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-lg border bg-card px-4 py-3 text-sm">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{t(`included.items.${item}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[oklch(0.20_0.02_80)] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold sm:text-4xl">
            {t("cta.heading")}
          </h2>
          <p className="mt-3 text-lg text-white/70">
            {t("cta.description")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-[oklch(0.62_0.14_30)] text-white hover:bg-[oklch(0.52_0.14_25)]">
              <Link href={`/${locale}/quick-order`}>
                {t("cta.tryQuickOrder")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
              <Link href={`/${locale}/contact`}>{t("cta.talkToTeam")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
