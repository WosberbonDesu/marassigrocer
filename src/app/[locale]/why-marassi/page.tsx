import Link from "next/link";
import * as Icons from "lucide-react";
import { Trophy } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Why Marassi Group",
  description:
    "Direct factory pricing, 4,000 m² warehouse, 75+ factory partnerships, and 29+ years of FMCG export experience.",
};

function pickIcon(name: string | null) {
  if (!name) return Trophy;
  const I = (Icons as unknown as Record<string, typeof Trophy>)[name];
  return I ?? Trophy;
}

export default async function WhyMarassiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let advantages: Array<{
    id: string;
    title: string;
    description: string;
    icon: string | null;
    stat: string | null;
    statLabel: string | null;
  }> = [];
  try {
    advantages = await db.advantage.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, description: true, icon: true, stat: true, statLabel: true },
    });
  } catch {
    advantages = [];
  }

  // Fallback to brief defaults if DB is empty (so page never looks broken)
  const fallback = advantages.length > 0 ? advantages : [
    { id: "1", title: "29+ Years of Experience", description: "Trusted FMCG distribution and supply experience since 1996.", icon: "Trophy", stat: "29+", statLabel: "years" },
    { id: "2", title: "Direct Factory Sourcing", description: "Direct factory pricing means stronger commercial value passed to you.", icon: "Factory", stat: null, statLabel: null },
    { id: "3", title: "4,000 m² Warehouse", description: "Ready stock supports fast supply with foodstuffs and detergents.", icon: "Warehouse", stat: "4,000", statLabel: "m²" },
    { id: "4", title: "Private Label Strength", description: "End-to-end private label support with 75+ factory partners worldwide.", icon: "Award", stat: "75+", statLabel: "factories" },
    { id: "5", title: "Wholesale & Retail Experience", description: "Proven track record supplying supermarket chains and wholesale businesses.", icon: "Building2", stat: null, statLabel: null },
    { id: "6", title: "Broad Product Access", description: "Commodities and international brands across the full FMCG spectrum.", icon: "Package", stat: "10,000+", statLabel: "products" },
    { id: "7", title: "Mixed Shipment Flexibility", description: "One shipment can carry up to 50 different products from our catalog.", icon: "Truck", stat: "50", statLabel: "products / shipment" },
    { id: "8", title: "Global Sourcing Scale", description: "Sourcing from Turkey, Egypt, UAE, India, Vietnam, Thailand, China, KSA.", icon: "Globe", stat: "8+", statLabel: "sourcing countries" },
    { id: "9", title: "Supervised Loading", description: "Competitive container solutions with supervised loading for shipment safety.", icon: "Ship", stat: null, statLabel: null },
  ];

  return (
    <div>
      <PageHero
        title="Why Marassi Group"
        subtitle="Direct sourcing strength. Warehouse readiness. International experience. 29 years and counting."
        locale={locale}
        breadcrumbs={[{ label: "Why Marassi Group" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallback.map((a) => {
              const Icon = pickIcon(a.icon);
              return (
                <div
                  key={a.id}
                  className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  {a.stat && (
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary">
                        {a.stat}
                      </span>
                      {a.statLabel && (
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {a.statLabel}
                        </span>
                      )}
                    </div>
                  )}
                  <h3 className="font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[oklch(0.20_0.02_80)] py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold sm:text-4xl">
            Ready to source with a proven export partner?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/70">
            Tell us about your market and product needs — our export team will respond with a tailored proposal.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg" className="bg-[oklch(0.62_0.14_30)] text-white hover:bg-[oklch(0.52_0.14_25)]">
              <Link href={`/${locale}/contact`}>Contact Export Team</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
              <Link href={`/${locale}/products`}>Browse Catalog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
