"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Package, Palette, Truck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { StepsTimeline } from "@/components/shared/steps-timeline";
import { privateLabelSchema, type PrivateLabelValues } from "@/lib/validations";

export default function PrivateLabelPage() {
  const t = useTranslations("privateLabel");
  const { locale } = useParams();

  const steps = [1, 2, 3, 4].map((n) => ({
    number: n,
    title: t(`process.step${n}.title`),
    description: t(`process.step${n}.description`),
  }));

  const form = useForm<PrivateLabelValues>({
    resolver: zodResolver(privateLabelSchema),
    defaultValues: {
      name: "", email: "", phone: "", company: "",
      targetCountry: "", productCategory: "", expectedQuantity: "",
      packagingLanguage: "", targetPriceRange: "", timeline: "", notes: "",
    },
  });

  const onSubmit = async (data: PrivateLabelValues) => {
    try {
      const res = await fetch("/api/private-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Inquiry submitted successfully! We'll be in touch within 48-72 hours.");
        form.reset();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      {/* Hero */}
      <PageHero
        title={t("headline")}
        subtitle={t("subtitle")}
        breadcrumbs={[{ label: "Private Label" }]}
        locale={locale as string}
      />

      {/* Process — light section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("process.title")} />
          <div className="mx-auto max-w-3xl">
            <StepsTimeline steps={steps} variant="vertical" />
          </div>
        </div>
      </section>

      {/* MOQ & Lead Times — dark section */}
      <section className="bg-[oklch(0.20_0.02_80)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("moq.title")} subtitle={t("moq.subtitle")} />
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              { label: "MOQ Range", value: t("moq.moqRange"), icon: Package },
              { label: "Lead Time", value: t("moq.leadTime"), icon: Truck },
              { label: "Sampling", value: t("moq.sampling"), icon: Palette },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <Icon className="mx-auto mb-3 h-8 w-8 text-[oklch(0.78_0.13_35)]" />
                <p className="text-sm text-white/60">{label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form — light section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("form.title")} />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label>Company</Label>
                <Input {...form.register("company")} />
                {form.formState.errors.company && <p className="mt-1 text-xs text-destructive">{form.formState.errors.company.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" {...form.register("email")} />
                {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <Label>Phone / WhatsApp</Label>
                <Input {...form.register("phone")} />
                {form.formState.errors.phone && <p className="mt-1 text-xs text-destructive">{form.formState.errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("form.targetCountry")}</Label>
                <Input {...form.register("targetCountry")} />
              </div>
              <div>
                <Label>{t("form.productCategory")}</Label>
                <Input {...form.register("productCategory")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("form.expectedQuantity")}</Label>
                <Input {...form.register("expectedQuantity")} placeholder="e.g. 10,000 units / 1x40' container" />
              </div>
              <div>
                <Label>{t("form.packagingLanguage")}</Label>
                <Input {...form.register("packagingLanguage")} placeholder="e.g. English, Arabic" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("form.targetPriceRange")}</Label>
                <Input {...form.register("targetPriceRange")} />
              </div>
              <div>
                <Label>{t("form.timeline")}</Label>
                <Input {...form.register("timeline")} placeholder="e.g. Q2 2026" />
              </div>
            </div>
            <div>
              <Label>{t("form.notes")}</Label>
              <Textarea {...form.register("notes")} rows={4} placeholder="Reference products, special requirements..." />
            </div>
            <Button type="submit" size="lg" className="w-full bg-[oklch(0.72_0.11_80)] text-white hover:bg-[oklch(0.66_0.12_78)]" disabled={form.formState.isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {t("form.submit")}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
