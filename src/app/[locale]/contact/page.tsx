"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Phone,
  Clock,
  Building2,
  ArrowRight,
  ChevronRight,
  Home,
  Headphones,
  Download,
  Zap,
  MapPin,
  Navigation,
  PackageSearch,
  Tag,
  FileBadge2,
  BookOpen,
  Boxes,
  Handshake,
  Lock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

const HERO_BG =
  "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=70";
const CTA_BG =
  "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1920&q=70";

const COUNTRY_OPTIONS = [
  "Egypt",
  "Turkey",
  "United Arab Emirates",
  "Saudi Arabia",
  "Iraq",
  "Jordan",
  "Libya",
  "Sudan",
  "Nigeria",
  "Kenya",
  "Ghana",
  "Senegal",
  "Germany",
  "United Kingdom",
  "France",
  "Italy",
  "Spain",
  "Other",
];

const INQUIRY_TYPES = [
  "Product Sourcing",
  "Private Label",
  "Export Documentation",
  "Catalog Request",
  "Bulk Order Inquiry",
  "Partnership Request",
  "Mixed Container",
  "General Inquiry",
];

const PRODUCT_CATEGORIES = [
  "Biscuits & Confectionery",
  "Dairy Products",
  "Beverages",
  "Snacks & Confectionery",
  "Oils & Condiments",
  "Canned & Dry Foods",
  "Cleaning Products",
  "Personal Care",
  "Baby Food",
  "Other",
];

const INQUIRY_CARDS = [
  { id: "productSourcing", icon: PackageSearch },
  { id: "privateLabel", icon: Tag },
  { id: "exportDocumentation", icon: FileBadge2 },
  { id: "catalogRequest", icon: BookOpen },
  { id: "bulkOrder", icon: Boxes },
  { id: "partnership", icon: Handshake },
];

const PRIMARY_OFFICE = {
  city: "Istanbul",
  country: "Turkey",
  flag: "🇹🇷",
  full: "Marassi Group, Istanbul Office",
  address: "Kurtkoy, Seyhli Mah., Bol Ahenk Sk. No:5, 34906 Pendik, Istanbul, Turkey",
  raw: "+905512623859",
  display: "+90 (551) 262 38 59",
  email: "export@marassigroup.com",
  lat: 40.895,
  lng: 29.305,
  hours: "Monday – Friday\n9:00 AM – 6:00 PM (GMT+3)",
};

const PRE_CONTACT_FAQS = [
  { id: "mixedContainers" },
  { id: "privateLabel" },
  { id: "catalog" },
  { id: "markets" },
];

const INFO_CARDS = [
  {
    id: "headOffice",
    icon: Building2,
    lines: ["Marassi Group", "Pendik, Istanbul", "Turkey"],
  },
  {
    id: "phone",
    icon: Phone,
    lines: ["+90 (551) 262 38 59", "Mon – Fri, 9:00 AM – 6:00 PM", "(GMT+3)"],
    href: "tel:+905512623859",
  },
  {
    id: "email",
    icon: Mail,
    lines: ["export@marassigroup.com", "sales@marassigroup.com"],
    href: "mailto:export@marassigroup.com",
  },
  {
    id: "workingHours",
    icon: Clock,
    lines: ["Monday – Friday", "9:00 AM – 6:00 PM", "(GMT+3)"],
  },
];

export default function ContactPage() {
  const { locale } = useParams();
  const t = useTranslations("contact");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      country: "",
      inquiryType: "",
      productCategory: "",
      subject: "",
      buyerType: "partner",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          buyerType: "partner",
          notes: [
            data.inquiryType ? `Inquiry: ${data.inquiryType}` : null,
            data.productCategory ? `Category: ${data.productCategory}` : null,
            data.subject ? `Subject: ${data.subject}` : null,
            data.message,
          ]
            .filter(Boolean)
            .join("\n\n"),
          source: "contact",
        }),
      });
      if (res.ok) {
        toast.success(t("form.success"));
        form.reset();
      } else {
        toast.error(t("toast.error"));
      }
    } catch {
      toast.error(t("toast.error"));
    }
  };

  const mapEmbed = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8000!2d${PRIMARY_OFFICE.lng}!3d${PRIMARY_OFFICE.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2str!4v1`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${PRIMARY_OFFICE.lat},${PRIMARY_OFFICE.lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${PRIMARY_OFFICE.lat},${PRIMARY_OFFICE.lng}`;

  return (
    <div className="bg-[#faf8f4]">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_BG} alt="" fill priority className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.02_80)] via-[oklch(0.14_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/45" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-32 pt-14 sm:px-6 sm:pb-40 sm:pt-20 lg:px-8 lg:pb-44">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/55">
            <Link href={`/${locale}`} className="flex items-center gap-1 hover:text-[oklch(0.78_0.12_80)]">
              <Home className="h-3.5 w-3.5" />
              {t("breadcrumb.home")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">{t("breadcrumb.contact")}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.titlePrefix")} <span className="text-[oklch(0.78_0.12_80)]">Marassi Group</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-6 h-[3px] w-16 rounded-full bg-[oklch(0.78_0.12_80)]" />
          </motion.div>
        </div>
      </section>

      {/* ───────── FLOATING INFO CARDS ───────── */}
      <section className="relative z-10 -mt-20 sm:-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INFO_CARDS.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[oklch(0.72_0.11_80)]/35 bg-[oklch(0.72_0.11_80)]/10 text-[oklch(0.60_0.12_75)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{t(`infoCards.${card.id}.label`)}</p>
                    <div className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-muted-foreground">
                      {card.lines.map((l, k) => (
                        <p key={k} className="truncate">
                          {l}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-white p-5 shadow-xl shadow-[oklch(0.20_0.02_80)]/10 transition-all hover:-translate-y-0.5 hover:border-[oklch(0.72_0.11_80)]/40 hover:shadow-2xl"
                >
                  {card.href ? (
                    <a href={card.href} className="block">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── FORM + NEED FASTER SUPPORT ───────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Get in Touch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm shadow-[oklch(0.20_0.02_80)]/5 sm:p-8 lg:col-span-2"
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight sm:text-3xl">
                {t("getInTouch.title")}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("getInTouch.subtitle")}
              </p>

              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
                {/* Row 1: Name + Company */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("form.name")} required error={form.formState.errors.name?.message}>
                    <Input
                      {...form.register("name")}
                      placeholder={t("form.namePlaceholder")}
                      className="h-11"
                    />
                  </Field>
                  <Field label={t("form.company")} required error={form.formState.errors.company?.message}>
                    <Input
                      {...form.register("company")}
                      placeholder={t("form.companyPlaceholder")}
                      className="h-11"
                    />
                  </Field>
                </div>

                {/* Row 2: Country + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("form.country")} required error={form.formState.errors.country?.message}>
                    <Controller
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("form.countryPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_OPTIONS.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label={t("form.emailLabel")} required error={form.formState.errors.email?.message}>
                    <Input
                      type="email"
                      {...form.register("email")}
                      placeholder={t("form.emailPlaceholder")}
                      className="h-11"
                    />
                  </Field>
                </div>

                {/* Row 3: Phone + Inquiry Type */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("form.phone")} required error={form.formState.errors.phone?.message}>
                    <Input
                      {...form.register("phone")}
                      placeholder={t("form.phonePlaceholder")}
                      className="h-11"
                    />
                  </Field>
                  <Field
                    label={t("form.inquiryType")}
                    required
                    error={form.formState.errors.inquiryType?.message}
                  >
                    <Controller
                      control={form.control}
                      name="inquiryType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("form.inquiryTypePlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {INQUIRY_TYPES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>

                {/* Row 4: Product Category + Subject */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("form.productCategory")}>
                    <Controller
                      control={form.control}
                      name="productCategory"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("form.productCategoryPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label={t("form.subject")}>
                    <Input
                      {...form.register("subject")}
                      placeholder={t("form.subjectPlaceholder")}
                      className="h-11"
                    />
                  </Field>
                </div>

                {/* Message */}
                <Field label={t("form.message")} required error={form.formState.errors.message?.message}>
                  <Textarea
                    {...form.register("message")}
                    rows={5}
                    placeholder={t("form.messagePlaceholder")}
                    className="resize-none"
                  />
                </Field>

                <div className="flex flex-col-reverse items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    className="h-12 bg-[oklch(0.66_0.16_35)] px-7 text-sm font-semibold text-white shadow-md shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {form.formState.isSubmitting ? t("form.submitting") : t("form.submit")}
                  </Button>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    {t("form.securityNote")}
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Right: Need Faster Support (dark card) */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-[oklch(0.28_0.02_80)] bg-[oklch(0.16_0.02_80)] p-6 text-white shadow-xl shadow-[oklch(0.20_0.02_80)]/15 sm:p-8"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[oklch(0.78_0.12_80)]/8 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[oklch(0.78_0.12_80)]/40 bg-[oklch(0.78_0.12_80)]/10 text-[oklch(0.78_0.12_80)]">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-center font-[family-name:var(--font-playfair)] text-xl font-bold sm:text-2xl">
                  {t("support.title")}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-relaxed text-white/60">
                  {t("support.subtitle")}
                </p>

                <div className="mt-7 space-y-3">
                  <QuickAction
                    href="https://wa.me/c/23859113816087?text=Hi!%20Can%20I%20get%20your%20product%20catalog%20and%20information%20about%20shipping%3F"
                    title={t("support.whatsapp.title")}
                    description={t("support.whatsapp.description")}
                    icon={<WhatsAppIcon className="h-4 w-4 text-white" />}
                    iconBg="bg-[#25D366]"
                    external
                  />
                  <QuickAction
                    href="mailto:export@marassigroup.com"
                    title={t("support.email.title")}
                    description={t("support.email.description")}
                    icon={<Mail className="h-4 w-4 text-[oklch(0.78_0.12_80)]" />}
                    iconBg="bg-[oklch(0.78_0.12_80)]/15"
                  />
                  <QuickAction
                    href={`/${locale}/products`}
                    title={t("support.catalog.title")}
                    description={t("support.catalog.description")}
                    icon={<Download className="h-4 w-4 text-[oklch(0.78_0.12_80)]" />}
                    iconBg="bg-[oklch(0.78_0.12_80)]/15"
                  />
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[oklch(0.78_0.12_80)]/25 bg-[oklch(0.78_0.12_80)]/8 px-4 py-3 text-xs text-white/75">
                  <Zap className="h-3.5 w-3.5 text-[oklch(0.78_0.12_80)]" />
                  <span>
                    {t("support.responseTime")}{" "}
                    <span className="font-semibold text-[oklch(0.78_0.12_80)]">{t("support.responseTimeHighlight")}</span>
                  </span>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ───────── COMMON INQUIRY TYPES ───────── */}
      <section className="bg-[#faf8f4] pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
              {t("inquiryTypes.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("inquiryTypes.title")}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {INQUIRY_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="group flex flex-col items-center rounded-2xl border border-border bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[oklch(0.72_0.11_80)]/40 hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.72_0.11_80)]/12 text-[oklch(0.60_0.12_75)] transition-colors group-hover:bg-[oklch(0.72_0.11_80)]/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-sm font-semibold leading-snug">
                    {t(`inquiryTypes.cards.${card.id}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    {t(`inquiryTypes.cards.${card.id}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── OFFICE MAP (DARK CARD) ───────── */}
      <section className="bg-[#faf8f4] pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl border border-[oklch(0.28_0.02_80)] bg-[oklch(0.16_0.02_80)] text-white shadow-xl shadow-[oklch(0.20_0.02_80)]/15"
          >
            <div className="grid lg:grid-cols-[1.05fr_1.4fr]">
              {/* Left: address */}
              <div className="relative p-7 sm:p-10">
                <div className="absolute inset-0 z-0 opacity-30">
                  <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[oklch(0.78_0.12_80)]/12 blur-3xl" />
                </div>
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[oklch(0.78_0.12_80)]/40 bg-[oklch(0.78_0.12_80)]/12 text-[oklch(0.78_0.12_80)]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
                        {PRIMARY_OFFICE.full}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/65">
                        {PRIMARY_OFFICE.address}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 border-[oklch(0.78_0.12_80)]/40 bg-transparent text-sm font-medium text-[oklch(0.82_0.11_80)] hover:border-[oklch(0.78_0.12_80)] hover:bg-[oklch(0.78_0.12_80)]/10 hover:text-[oklch(0.82_0.11_80)]"
                    >
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-2 h-4 w-4" />
                        {t("map.getDirections")}
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 border-white/20 bg-transparent text-sm font-medium text-white hover:border-white/40 hover:bg-white/8 hover:text-white"
                    >
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                        {t("map.viewOnGoogleMaps")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
                    <a
                      href={`tel:${PRIMARY_OFFICE.raw}`}
                      className="group flex items-start gap-2.5 text-white/70 transition-colors hover:text-[oklch(0.82_0.11_80)]"
                    >
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.78_0.12_80)]" />
                      <span className="truncate">{PRIMARY_OFFICE.display}</span>
                    </a>
                    <a
                      href={`mailto:${PRIMARY_OFFICE.email}`}
                      className="group flex items-start gap-2.5 text-white/70 transition-colors hover:text-[oklch(0.82_0.11_80)]"
                    >
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.78_0.12_80)]" />
                      <span className="truncate">{PRIMARY_OFFICE.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: map */}
              <div className="relative min-h-[280px] lg:min-h-[360px]">
                <iframe
                  src={mapEmbed}
                  className="absolute inset-0 h-full w-full"
                  style={{
                    border: 0,
                    filter:
                      "invert(0.92) hue-rotate(180deg) brightness(0.95) saturate(0.55) contrast(0.95)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("map.iframeTitle")}
                />
                <div className="pointer-events-none absolute inset-0 bg-[oklch(0.14_0.02_80)]/15 mix-blend-multiply" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="flex flex-col items-center">
                    <div className="rounded-md bg-[oklch(0.16_0.02_80)]/95 px-2 py-1 text-[10px] font-semibold text-[oklch(0.78_0.12_80)] shadow-lg">
                      {t("map.officeBadge")}
                    </div>
                    <div className="mt-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)] text-[oklch(0.16_0.02_80)] shadow-[0_0_18px_oklch(0.78_0.12_80)]/60">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── BEFORE YOU CONTACT US ───────── */}
      <section className="bg-[#faf8f4] pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
              {t("faqs.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("faqs.title")}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PRE_CONTACT_FAQS.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`faq-${i}`} className="border-0">
                    <AccordionTrigger className="px-5 text-left text-sm font-medium hover:no-underline [&>svg]:hidden [&[data-state=open]_.faq-plus]:rotate-45 [&[data-state=open]_.faq-plus]:bg-[oklch(0.72_0.11_80)] [&[data-state=open]_.faq-plus]:text-white">
                      <span className="flex-1 pr-3">{t(`faqs.items.${faq.id}.question`)}</span>
                      <span className="faq-plus flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[oklch(0.72_0.11_80)]/35 bg-[oklch(0.72_0.11_80)]/10 text-[oklch(0.60_0.12_75)] transition-all duration-200">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 text-sm leading-relaxed text-muted-foreground">
                      {t(`faqs.items.${faq.id}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA BAND ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={CTA_BG} alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)]/95 via-[oklch(0.16_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/85" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_auto]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {t("cta.titleStart")}<br className="hidden sm:block" />{" "}
                <span className="text-[oklch(0.78_0.12_80)]">{t("cta.titleHighlight")}</span>
              </h2>
              <p className="mt-4 max-w-xl text-base text-white/65">
                {t("cta.subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Button
                asChild
                size="lg"
                className="h-12 bg-[oklch(0.66_0.16_35)] px-8 text-base font-semibold text-white shadow-lg shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
              >
                <Link href={`/${locale}/contact`}>
                  {t("cta.requestQuote")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex items-center gap-2 border-t border-white/10 pt-6 text-sm text-white/55"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.78_0.12_80)]">
              <Zap className="h-3 w-3" />
            </span>
            {t("cta.note")}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ───────── helpers ───────── */

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-[oklch(0.66_0.16_35)]">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
  iconBg,
  external,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 transition-all hover:-translate-y-0.5 hover:border-[oklch(0.78_0.12_80)]/35 hover:bg-white/10"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-[11px] leading-tight text-white/55">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:text-[oklch(0.82_0.11_80)]" />
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
