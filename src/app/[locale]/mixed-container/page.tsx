import Link from "next/link";
import { Ship, Package, Layers, Zap, Check, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Mixed Container Solutions",
  description:
    "Up to 50 different products in a single shipment. Mixed-container supply tailored for distributors, supermarket chains, and growing wholesalers.",
};

const benefits = [
  {
    icon: Layers,
    title: "Up to 50 Products in One Container",
    description:
      "Combine multiple FMCG categories — food, beverages, household, personal care — in a single optimized shipment.",
  },
  {
    icon: Package,
    title: "Smaller MOQ per SKU",
    description:
      "Lower minimum quantity per product means you can test new lines without committing to a full container of one item.",
  },
  {
    icon: Zap,
    title: "Faster Time to Shelf",
    description:
      "One consolidated booking, one set of documents, one arrival. No need to coordinate dozens of suppliers separately.",
  },
  {
    icon: Ship,
    title: "Optimized Loading",
    description:
      "Supervised palletization ensures maximum cube utilization and product safety throughout the voyage.",
  },
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
  { n: "01", title: "Share your shopping list", desc: "Paste SKUs or send a product list via RFQ. Our team prices and confirms availability within 48 hours." },
  { n: "02", title: "We optimize the loading plan", desc: "Pallets, cartons per layer, weight distribution, and cold-chain segregation if reefer is needed." },
  { n: "03", title: "Single consolidated invoice", desc: "One commercial invoice, one packing list, one bill of lading. Simple documentation for customs." },
  { n: "04", title: "Supervised loading at our warehouse", desc: "Our 4,000 m² facility in Doral ensures every container is loaded under supervision before sealing." },
  { n: "05", title: "Tracking & arrival", desc: "Online tracking updates from departure to discharge port. Direct contact with our export team for every step." },
];

export default async function MixedContainerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <PageHero
        title="Mixed Container Solutions"
        subtitle="Up to 50 different products in one shipment — a key advantage for distributors, supermarket chains, and growing wholesalers."
        locale={locale}
        breadcrumbs={[{ label: "Mixed Container" }]}
      />

      {/* Hero stat */}
      <section className="border-b bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-primary">
            50
          </p>
          <p className="mt-2 text-lg text-muted-foreground">
            Different products. One container. One commercial invoice. One arrival.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              Why choose mixed shipments?
            </h2>
            <p className="mt-3 text-muted-foreground">
              The traditional "one product per container" model forces you to commit to volume you can't sell or sample products you can't try. Mixed shipments solve both.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold leading-snug">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Container specs */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Container capacity
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Choose the size that matches your volume. Our team helps you maximize fill rate without exceeding weight limits.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {containerSpecs.map((c) => (
              <div key={c.type} className="rounded-2xl border bg-card p-6 text-center">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${c.color}`}>
                  {c.type}
                </span>
                <div className="mt-5 space-y-3 text-left">
                  <div className="flex items-center justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">Pallets</span>
                    <span className="font-semibold">{c.pallets}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">Cube</span>
                    <span className="font-semibold">{c.cube}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Max weight</span>
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
            How it works
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
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
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
            What's included
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Single commercial invoice",
              "Single packing list",
              "Consolidated bill of lading",
              "Certificate of origin",
              "Health certification (where applicable)",
              "Optional Arabic / multi-language labeling",
              "Pallet weight verification",
              "Container loading photos on request",
              "Online shipment tracking",
              "Dedicated sales rep contact",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-lg border bg-card px-4 py-3 text-sm">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[oklch(0.20_0.02_80)] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold sm:text-4xl">
            Ready to build your mixed container?
          </h2>
          <p className="mt-3 text-lg text-white/70">
            Send us your shopping list or start with our Quick Order paste tool — we'll come back with a loaded container plan and quote within 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-[oklch(0.62_0.14_30)] text-white hover:bg-[oklch(0.52_0.14_25)]">
              <Link href={`/${locale}/quick-order`}>
                Try Quick Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
              <Link href={`/${locale}/contact`}>Talk to Export Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
