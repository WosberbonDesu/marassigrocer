"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Warehouse, Network, ShieldCheck, FileCheck, MapPin, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { OfficeMap } from "@/components/shared/office-map";
import { offices } from "@/data/offices";

export default function CompanyPage() {
  const t = useTranslations("company");
  const { locale } = useParams();

  const capabilities = [
    { key: "warehouse", icon: Warehouse },
    { key: "network", icon: Network },
    { key: "quality", icon: ShieldCheck },
    { key: "compliance", icon: FileCheck },
  ] as const;

  return (
    <div>
      {/* Hero */}
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        breadcrumbs={[{ label: "Company" }]}
        locale={locale as string}
      />

      {/* Key Stats */}
      <section className="border-b bg-card py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "1996", label: "Founded" },
            { value: "50+", label: "Countries Served" },
            { value: "10,000+", label: "Products in Catalog" },
            { value: "200+", label: "Factory Partners" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-accent">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("capabilities.title")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ key, icon: Icon }) => (
              <div key={key} className="rounded-2xl border bg-card p-6">
                <Icon className="mb-3 h-8 w-8 text-accent" />
                <h3 className="font-semibold">{t(`capabilities.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`capabilities.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices with Maps */}
      <section className="border-t bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("offices.title")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div key={office.id} className="overflow-hidden rounded-2xl border bg-background">
                <OfficeMap office={office} />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">
                    {office.city}, {office.country}
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {office.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      {office.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      {office.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
