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

type ContactPerson = {
  id: 1 | 2 | 3 | 4;
  email: string;
  phones: { display: string; raw: string }[];
  primary?: boolean;
};

const CONTACTS: ContactPerson[] = [
  {
    id: 1,
    email: "m.moamen@marassigroup.com",
    phones: [
      { display: "+20 150 855 77 41", raw: "+201508557741" },
      { display: "+90 551 262 38 59", raw: "+905512623859" },
    ],
    primary: true,
  },
  {
    id: 2,
    email: "k.moamen@marassigroup.com",
    phones: [{ display: "+20 100 003 4571", raw: "+201000034571" }],
  },
  {
    id: 3,
    email: "a.ashraf@marassigroup.com",
    phones: [{ display: "+20 106 499 16 68", raw: "+201064991668" }],
  },
  {
    id: 4,
    email: "c.moamen@marassigroup.com",
    phones: [{ display: "+90 534 253 77 70", raw: "+905342537770" }],
  },
];

const PRIMARY_CONTACT = CONTACTS.find((c) => c.primary)!;

type Office = {
  id: "istanbul" | "cairo";
  city: string;
  country: string;
  flag: string;
  full: string;
  address: string;
  addressArabic?: string;
  mapQuery: string;
  hoursKey: "istanbul" | "cairo";
};

const OFFICES: Office[] = [
  {
    id: "istanbul",
    city: "Istanbul",
    country: "Turkey",
    flag: "🇹🇷",
    full: "Marassi Group — Istanbul Office",
    address:
      "Emniyet Evleri Mah, Eski Büyükdere Cad. Sapphire Towers No: 1 / No: 1B04, Kağıthane, Istanbul, Turkey",
    mapQuery: "Sapphire Tower Eski Büyükdere Cad Kağıthane Istanbul",
    hoursKey: "istanbul",
  },
  {
    id: "cairo",
    city: "Cairo",
    country: "Egypt",
    flag: "🇪🇬",
    full: "Marassi Group — Cairo Office",
    address: "Orabi Association, El Obour, Cairo, Egypt",
    addressArabic: "العبور جمعية عرابي القاهرة مصر",
    mapQuery: "Orabi Association El Obour Cairo Egypt",
    hoursKey: "cairo",
  },
];

const PRE_CONTACT_FAQS = [
  { id: "mixedContainers" },
  { id: "privateLabel" },
  { id: "catalog" },
  { id: "markets" },
];

const INFO_CARD_DEFS = [
  { id: "headOffice", icon: Building2 },
  { id: "phone", icon: Phone, href: `tel:${PRIMARY_CONTACT.phones[0].raw}` },
  { id: "email", icon: Mail, href: `mailto:${PRIMARY_CONTACT.email}` },
  { id: "workingHours", icon: Clock },
] as const;

const officeEmbedUrl = (q: string) =>
  `https://maps.google.com/maps?width=600&height=400&hl=en&q=${encodeURIComponent(q)}&output=embed`;

const officeMapsUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const officeDirectionsUrl = (q: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

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
            {INFO_CARD_DEFS.map((card, i) => {
              const Icon = card.icon;
              const lines: string[] =
                card.id === "headOffice"
                  ? [
                      t("infoCards.headOffice.line1"),
                      t("infoCards.headOffice.line2"),
                      t("infoCards.headOffice.line3"),
                    ]
                  : card.id === "phone"
                  ? [
                      PRIMARY_CONTACT.phones[0].display,
                      PRIMARY_CONTACT.phones[1]?.display ?? t("infoCards.phone.hours"),
                      t("infoCards.phone.timezone"),
                    ]
                  : card.id === "email"
                  ? [PRIMARY_CONTACT.email, t("infoCards.email.description")]
                  : [
                      t("infoCards.workingHours.days"),
                      t("infoCards.workingHours.hours"),
                      t("infoCards.workingHours.timezone"),
                    ];
              const href = "href" in card ? card.href : undefined;
              const inner = (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[oklch(0.72_0.11_80)]/35 bg-[oklch(0.72_0.11_80)]/10 text-[oklch(0.60_0.12_75)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{t(`infoCards.${card.id}.label`)}</p>
                    <div className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-muted-foreground">
                      {lines.map((l, k) => (
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
                  {href ? (
                    <a href={href} className="block">
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
                    href={`mailto:${PRIMARY_CONTACT.email}`}
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

      {/* ───────── CONTACT PEOPLE ───────── */}
      <section className="bg-[#faf8f4] pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
              {t("contacts.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("contacts.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("contacts.subtitle")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACTS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-lg sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-xs font-bold text-[oklch(0.40_0.10_75)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/25">
                    {c.id}
                  </span>
                  {c.primary && (
                    <span className="rounded-full bg-[oklch(0.66_0.16_35)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.55_0.17_35)] ring-1 ring-inset ring-[oklch(0.66_0.16_35)]/25">
                      {t("contacts.primary")}
                    </span>
                  )}
                </div>

                <a
                  href={`mailto:${c.email}`}
                  className="group/email flex items-center gap-2 break-all rounded-lg bg-[oklch(0.97_0.005_85)] px-3 py-2.5 text-[13px] font-semibold text-[oklch(0.40_0.10_75)] transition-colors hover:bg-[oklch(0.78_0.12_80)]/10"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[oklch(0.50_0.12_75)]" />
                  <span className="truncate">{c.email}</span>
                </a>

                <div className="mt-3 space-y-2">
                  {c.phones.map((p) => (
                    <a
                      key={p.raw}
                      href={`tel:${p.raw}`}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-white px-3 py-2 text-[13px] font-medium tabular-nums text-foreground/85 transition-colors hover:border-[oklch(0.72_0.11_80)]/45 hover:bg-[oklch(0.78_0.12_80)]/8 hover:text-[oklch(0.40_0.10_75)]"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-[oklch(0.50_0.12_75)]" />
                      {p.display}
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── OFFICES (2 dark cards with maps) ───────── */}
      <section className="bg-[#faf8f4] pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
              {t("offices.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("offices.title")}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {OFFICES.map((office, i) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl border border-[oklch(0.28_0.02_80)] bg-[oklch(0.16_0.02_80)] text-white shadow-xl shadow-[oklch(0.20_0.02_80)]/15"
              >
                {/* Address head */}
                <div className="relative p-6 sm:p-8">
                  <div className="absolute inset-0 z-0 opacity-30">
                    <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[oklch(0.78_0.12_80)]/12 blur-3xl" />
                  </div>
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[oklch(0.78_0.12_80)]/40 bg-[oklch(0.78_0.12_80)]/12 text-[oklch(0.78_0.12_80)]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[oklch(0.78_0.12_80)]">
                          {office.flag} {office.city}, {office.country}
                        </p>
                        <h3 className="mt-1.5 font-[family-name:var(--font-playfair)] text-xl font-bold leading-tight">
                          {office.full}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                          {office.address}
                        </p>
                        {office.addressArabic && (
                          <p
                            dir="rtl"
                            className="mt-1 text-sm leading-relaxed text-white/45"
                          >
                            {office.addressArabic}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="h-10 border-[oklch(0.78_0.12_80)]/40 bg-transparent text-xs font-medium text-[oklch(0.82_0.11_80)] hover:border-[oklch(0.78_0.12_80)] hover:bg-[oklch(0.78_0.12_80)]/10 hover:text-[oklch(0.82_0.11_80)]"
                      >
                        <a
                          href={officeDirectionsUrl(office.mapQuery)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="mr-2 h-3.5 w-3.5" />
                          {t("map.getDirections")}
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-10 border-white/20 bg-transparent text-xs font-medium text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
                      >
                        <a
                          href={officeMapsUrl(office.mapQuery)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("map.viewOnGoogleMaps")}
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Map iframe */}
                <div className="relative h-[260px] sm:h-[300px]">
                  <iframe
                    src={officeEmbedUrl(office.mapQuery)}
                    className="absolute inset-0 h-full w-full"
                    style={{
                      border: 0,
                      filter:
                        "invert(0.92) hue-rotate(180deg) brightness(0.95) saturate(0.55) contrast(0.95)",
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${office.city} ${office.country} office map`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[oklch(0.14_0.02_80)]/15 mix-blend-multiply" />
                </div>
              </motion.div>
            ))}
          </div>
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
