"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/shared/page-hero";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

const TEAM = [
  { name: "M. Moamen", raw: "+201508557741", display: "+20 (150) 855-7741", flag: "🇪🇬", email: "m.moamen@marassigroup.com" },
  { name: "C. Moamen", raw: "+905342537770", display: "+90 (534) 253 77 70", flag: "🇹🇷", email: "c.moamen@marassigroup.com" },
  { name: "M. El Orfaly", raw: "+2010164851443", display: "+20 (101) 648-5143", flag: "🇪🇬", email: "melorfaly@marassigroup.com" },
  { name: "K. Moamen", raw: "+2010000345713", display: "+20 (100) 003-4571", flag: "🇪🇬", email: "k.moamen@marassigroup.com" },
  { name: "A. Ashraf", raw: "+2010649916683", display: "+20 (106) 499-1668", flag: "🇪🇬", email: "a.ashraf@marassigroup.com" },
  { name: "E. Mashaly", raw: "+2010504833613", display: "+20 (105) 048-3361", flag: "🇪🇬", email: "e.mashaly@marassigroup.com" },
  { name: "A. A.", raw: "+905061903866", display: "+90 (506) 190 38 66", flag: "🇹🇷", email: "a.a@marassigroup.com" },
];

const OFFICES = [
  {
    city: "Istanbul",
    country: "Turkey",
    flag: "🇹🇷",
    address: "Kurtkoy, Seyhli Mah., Bol Ahenk Sk. No:5, 34906 Pendik",
    raw: "+905512623859",
    display: "+90 (551) 262 38 59",
    lat: 40.895,
    lng: 29.305,
  },
  {
    city: "Damanhour",
    country: "Egypt",
    flag: "🇪🇬",
    address: "Damanhour, El Beheira Governorate",
    raw: "+2015085577413",
    display: "+20 (150) 855-7741",
    lat: 31.0409,
    lng: 30.4682,
  },
];

export default function ContactPage() {
  const t = useTranslations("contact");
  const { locale } = useParams();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "", email: "", phone: "", company: "",
      country: "", buyerType: "", message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact" }),
      });
      if (res.ok) {
        toast.success(t("form.success"));
        form.reset();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        breadcrumbs={[{ label: "Contact" }]}
        locale={locale as string}
      />

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-5">

          {/* Left — Form */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form and our team will respond within 24 hours.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm">{t("form.name")}</Label>
                  <Input {...form.register("name")} className="h-11" />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">{t("form.company")}</Label>
                  <Input {...form.register("company")} className="h-11" />
                  {form.formState.errors.company && (
                    <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm">{t("form.email")}</Label>
                  <Input type="email" {...form.register("email")} className="h-11" />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">{t("form.phone")}</Label>
                  <Input {...form.register("phone")} placeholder="+90 ..." className="h-11" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">{t("form.country")}</Label>
                <Input {...form.register("country")} className="h-11" />
                {form.formState.errors.country && (
                  <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">{t("form.message")}</Label>
                <Textarea
                  {...form.register("message")}
                  rows={4}
                  className="resize-none"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 text-sm font-semibold bg-[oklch(0.76_0.11_80)] text-[oklch(0.12_0.01_60)] hover:bg-[oklch(0.70_0.11_80)]"
                disabled={form.formState.isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Sending..." : t("form.submit")}
              </Button>
            </form>
          </div>

          {/* Right — Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* Offices */}
            <div>
              <h2 className="text-xl font-semibold">{t("offices")}</h2>
              <div className="mt-5 space-y-4">
                {OFFICES.map((office) => (
                  <div
                    key={office.city}
                    className="overflow-hidden rounded-xl border bg-card"
                  >
                    {/* Map */}
                    <div className="relative h-40 w-full bg-muted">
                      <iframe
                        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8000!2d${office.lng}!3d${office.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2str!4v1`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${office.city} Office`}
                        className="absolute inset-0 grayscale hover:grayscale-0 transition-[filter] duration-500"
                      />
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{office.flag}</span>
                        <h3 className="font-semibold">
                          {office.city}, {office.country}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {office.address}
                      </p>
                      <a
                        href={`tel:${office.raw}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {office.display}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact — WhatsApp */}
            <div>
              <h2 className="text-xl font-semibold">Quick Contact</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Prefer instant messaging? Reach us on WhatsApp.
              </p>
              <a
                href="https://wa.me/c/23859113816087?text=Hi!%20Can%20I%20get%20your%20product%20catalog%20and%20information%20about%20shipping%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-3 rounded-xl border bg-[#25D366]/5 border-[#25D366]/20 p-4 transition-colors hover:bg-[#25D366]/10"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                  <WhatsAppIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Chat on WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Typically replies within minutes</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>

            {/* General Email */}
            <div>
              <h2 className="text-xl font-semibold">Email</h2>
              <a
                href="mailto:export@marassigroup.com"
                className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                export@marassigroup.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t bg-[oklch(0.12_0.01_60)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold">Our Sales Team</h2>
          <p className="mt-1 text-sm text-white/60">
            Reach out directly to any of our team members.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <div
                key={member.email}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-[oklch(0.76_0.11_80)]/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[oklch(0.76_0.11_80)]/10 text-sm font-semibold text-[oklch(0.76_0.11_80)]">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 space-y-1.5">
                  <p className="text-sm font-medium text-white">{member.name}</p>
                  <a
                    href={`tel:${member.raw}`}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-[oklch(0.76_0.11_80)] transition-colors"
                  >
                    <span className="text-xs">{member.flag}</span>
                    <span className="truncate">{member.display}</span>
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-[oklch(0.76_0.11_80)] transition-colors"
                  >
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
