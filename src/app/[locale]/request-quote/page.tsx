"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Send,
  ArrowRight,
  ChevronRight,
  Home,
  Users,
  FileBadge2,
  Container,
  Tag,
  Globe2,
  ShieldCheck,
  UploadCloud,
  X,
  Lock,
  ClipboardCheck,
  PackageSearch,
  FileText,
  Handshake,
  Ship,
  Headphones,
  Mail,
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
import { quoteRequestSchema, type QuoteRequestValues } from "@/lib/validations";
import { useRFQStore } from "@/stores/rfq-store";

const HERO_BG =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=70";
const CTA_BG =
  "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1920&q=70";

const COUNTRIES = [
  { id: "egypt", value: "Egypt" },
  { id: "turkey", value: "Turkey" },
  { id: "uae", value: "United Arab Emirates" },
  { id: "saudiArabia", value: "Saudi Arabia" },
  { id: "iraq", value: "Iraq" },
  { id: "jordan", value: "Jordan" },
  { id: "libya", value: "Libya" },
  { id: "sudan", value: "Sudan" },
  { id: "nigeria", value: "Nigeria" },
  { id: "kenya", value: "Kenya" },
  { id: "ghana", value: "Ghana" },
  { id: "senegal", value: "Senegal" },
  { id: "germany", value: "Germany" },
  { id: "uk", value: "United Kingdom" },
  { id: "france", value: "France" },
  { id: "italy", value: "Italy" },
  { id: "spain", value: "Spain" },
  { id: "algeria", value: "Algeria" },
  { id: "morocco", value: "Morocco" },
  { id: "tunisia", value: "Tunisia" },
  { id: "qatar", value: "Qatar" },
  { id: "kuwait", value: "Kuwait" },
  { id: "oman", value: "Oman" },
  { id: "bahrain", value: "Bahrain" },
  { id: "other", value: "Other" },
];

const PHONE_CODES = [
  { code: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "+90", flag: "🇹🇷", label: "Turkey" },
  { code: "+20", flag: "🇪🇬", label: "Egypt" },
  { code: "+966", flag: "🇸🇦", label: "Saudi Arabia" },
  { code: "+962", flag: "🇯🇴", label: "Jordan" },
  { code: "+1", flag: "🇺🇸", label: "USA" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+49", flag: "🇩🇪", label: "Germany" },
  { code: "+33", flag: "🇫🇷", label: "France" },
];

const BUYER_TYPES = [
  { id: "importer", value: "Importer" },
  { id: "distributor", value: "Distributor" },
  { id: "wholesaler", value: "Wholesaler" },
  { id: "retailer", value: "Retailer" },
  { id: "privateLabelBuyer", value: "Private Label Buyer" },
  { id: "hotelHoreca", value: "Hotel / HORECA" },
  { id: "cateringFoodService", value: "Catering / Food Service" },
  { id: "other", value: "Other" },
];

const BUYER_ROLES = [
  { id: "importer", value: "Importer" },
  { id: "distributor", value: "Distributor" },
  { id: "wholesaler", value: "Wholesaler" },
  { id: "retailer", value: "Retailer" },
  { id: "privateLabelBuyer", value: "Private Label Buyer" },
  { id: "other", value: "Other" },
];

const PRODUCT_CATEGORIES = [
  { id: "biscuits", value: "Biscuits & Confectionery" },
  { id: "dairy", value: "Dairy Products" },
  { id: "beverages", value: "Beverages" },
  { id: "snacks", value: "Snacks & Confectionery" },
  { id: "oils", value: "Oils & Condiments" },
  { id: "canned", value: "Canned & Dry Foods" },
  { id: "cleaning", value: "Cleaning Products" },
  { id: "personalCare", value: "Personal Care" },
  { id: "babyFood", value: "Baby Food" },
  { id: "other", value: "Other" },
];

const PACKAGING_TYPES = [
  { id: "cartonBox", value: "Carton Box" },
  { id: "plasticBottle", value: "Plastic Bottle" },
  { id: "glassJar", value: "Glass Jar" },
  { id: "tinCan", value: "Tin Can" },
  { id: "pouchSachet", value: "Pouch / Sachet" },
  { id: "bulkBag", value: "Bulk Bag" },
  { id: "tetraPak", value: "Tetra Pak" },
  { id: "custom", value: "Custom" },
];

const SHIPPING_METHODS = [
  { id: "fob", value: "FOB (Free on Board)" },
  { id: "cif", value: "CIF (Cost, Insurance, Freight)" },
  { id: "exw", value: "EXW (Ex Works)" },
  { id: "cfr", value: "CFR (Cost & Freight)" },
  { id: "ddp", value: "DDP (Delivered Duty Paid)" },
  { id: "notSure", value: "Not sure" },
];

const REQUIRED_DOCS = [
  { id: "commercialInvoice", value: "Commercial Invoice" },
  { id: "packingList", value: "Packing List" },
  { id: "coo", value: "Certificate of Origin (COO)" },
  { id: "bl", value: "Bill of Lading (B/L)" },
  { id: "coa", value: "Certificate of Analysis (COA)" },
  { id: "healthPhyto", value: "Health / Phytosanitary Certificate" },
  { id: "fullSet", value: "Full export documentation set" },
];

const TIMELINES = [
  { id: "urgent", value: "Urgent — within 2 weeks" },
  { id: "oneMonth", value: "1 month" },
  { id: "oneToTwoMonths", value: "1–2 months" },
  { id: "threeMonths", value: "3 months" },
  { id: "flexible", value: "Flexible / planning ahead" },
];

const REASONS = [
  { id: "sourcing", icon: Users },
  { id: "documentation", icon: FileBadge2 },
  { id: "mixedContainer", icon: Container },
  { id: "privateLabel", icon: Tag },
  { id: "globalExperience", icon: Globe2 },
];

const PROCESS_STEPS = [
  { id: "inquiryReview", icon: ClipboardCheck },
  { id: "productMatching", icon: PackageSearch },
  { id: "quotationPreparation", icon: FileText },
  { id: "confirmation", icon: Handshake },
  { id: "exportCoordination", icon: Ship },
];

export default function RequestQuotePage() {
  const t = useTranslations("requestQuotePage");
  const { locale } = useParams();
  const items = useRFQStore((s) => s.items);
  const clearItems = useRFQStore((s) => s.clearItems);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<QuoteRequestValues>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      fullName: "", companyName: "", country: "", city: "",
      email: "", phoneCountry: "+971", phone: "",
      buyerType: "", buyerRole: "",
      productCategories: "", productNames: items.map((i) => i.productName).join(", "),
      brandPreference: "", quantityMoq: "",
      packagingType: "", privateLabel: "no", targetPrice: "",
      destinationCountry: "", shippingMethod: "",
      mixedContainer: "no", requiredDocuments: "", timeline: "",
      notes: "",
    },
  });

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const onSubmit = async (data: QuoteRequestValues) => {
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        phone: `${data.phoneCountry ?? ""} ${data.phone}`.trim(),
        company: data.companyName,
        country: data.country,
        buyerType: mapBuyerType(data.buyerType),
        categories: data.productCategories ? [data.productCategories] : [],
        containerEstimate:
          data.mixedContainer === "yes" ? "not_sure" : undefined,
        targetPrice: data.targetPrice ?? "",
        notes: [
          data.buyerRole ? `Buyer role: ${data.buyerRole}` : null,
          data.city ? `City: ${data.city}` : null,
          data.productNames ? `Products: ${data.productNames}` : null,
          data.brandPreference ? `Brand: ${data.brandPreference}` : null,
          data.quantityMoq ? `Qty/MOQ: ${data.quantityMoq}` : null,
          data.packagingType ? `Packaging: ${data.packagingType}` : null,
          data.privateLabel === "yes" ? "Private label required: yes" : null,
          `Destination: ${data.destinationCountry}`,
          data.shippingMethod ? `Shipping: ${data.shippingMethod}` : null,
          data.requiredDocuments ? `Docs: ${data.requiredDocuments}` : null,
          data.timeline ? `Timeline: ${data.timeline}` : null,
          files.length > 0
            ? `Attached files: ${files.map((f) => f.name).join(", ")}`
            : null,
          data.notes,
        ].filter(Boolean).join("\n"),
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: i.quantity,
          notes: i.notes,
        })),
        source: "contact" as const,
      };

      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(t("toast.success"));
        form.reset();
        setFiles([]);
        clearItems();
      } else {
        toast.error(t("toast.failed"));
      }
    } catch {
      toast.error(t("toast.error"));
    }
  };

  return (
    <div className="bg-[#faf8f4]">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.12_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_BG} alt="" fill priority className="object-cover opacity-45" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.02_80)] via-[oklch(0.12_0.02_80)]/85 to-[oklch(0.12_0.02_80)]/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/55">
            <Link href={`/${locale}`} className="flex items-center gap-1 hover:text-[oklch(0.78_0.12_80)]">
              <Home className="h-3.5 w-3.5" />
              {t("breadcrumb.home")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">{t("breadcrumb.current")}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.titleStart")}
              <br />
              <span className="text-[oklch(0.78_0.12_80)]">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
              {t("hero.subtitle")}
            </p>
            <div className="mt-6 h-[3px] w-16 rounded-full bg-[oklch(0.78_0.12_80)]" />
          </motion.div>
        </div>
      </section>

      {/* ───────── MAIN: FORM + WHY CARD ───────── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT: Form (2/3) */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-2xl border border-border bg-white p-5 shadow-xl shadow-[oklch(0.20_0.02_80)]/8 sm:p-8 lg:col-span-2"
            >
              {/* Selected products from RFQ cart */}
              {items.length > 0 && (
                <div className="mb-8 rounded-xl border border-[oklch(0.72_0.11_80)]/40 bg-[oklch(0.72_0.11_80)]/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.50_0.12_75)]">
                    {t("rfqList.summary", { count: items.length })}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {items.map((it) => (
                      <li
                        key={it.productId}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-foreground shadow-sm"
                      >
                        {it.productName}{it.quantity > 1 ? ` ×${it.quantity}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SECTION 1: Company Information */}
              <FormSection number={1} title={t("sections.company.title")}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.fullName.label")} required error={form.formState.errors.fullName?.message}>
                    <Input
                      {...form.register("fullName")}
                      placeholder={t("fields.fullName.placeholder")}
                      className="h-11"
                    />
                  </Field>
                  <Field label={t("fields.companyName.label")} required error={form.formState.errors.companyName?.message}>
                    <Input
                      {...form.register("companyName")}
                      placeholder={t("fields.companyName.placeholder")}
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.country.label")} required error={form.formState.errors.country?.message}>
                    <Controller
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("fields.country.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c.id} value={c.value}>{t(`countries.${c.id}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label={t("fields.city.label")}>
                    <Input
                      {...form.register("city")}
                      placeholder={t("fields.city.placeholder")}
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.email.label")} required error={form.formState.errors.email?.message}>
                    <Input
                      type="email"
                      {...form.register("email")}
                      placeholder={t("fields.email.placeholder")}
                      className="h-11"
                    />
                  </Field>
                  <Field label={t("fields.phone.label")} required error={form.formState.errors.phone?.message}>
                    <div className="flex gap-2">
                      <Controller
                        control={form.control}
                        name="phoneCountry"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-11 w-[110px] shrink-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PHONE_CODES.map((p) => (
                                <SelectItem key={p.code} value={p.code}>
                                  <span className="mr-1.5">{p.flag}</span>
                                  {p.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        {...form.register("phone")}
                        placeholder="50 123 4567"
                        className="h-11 flex-1"
                      />
                    </div>
                  </Field>
                </div>

                <Field label={t("fields.buyerType.label")} required error={form.formState.errors.buyerType?.message}>
                  <Controller
                    control={form.control}
                    name="buyerType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder={t("fields.buyerType.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {BUYER_TYPES.map((b) => (
                            <SelectItem key={b.id} value={b.value}>{t(`buyerTypes.${b.id}`)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                {/* Role radio chips */}
                <Controller
                  control={form.control}
                  name="buyerRole"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {BUYER_ROLES.map((role) => {
                        const active = field.value === role.value;
                        return (
                          <button
                            type="button"
                            key={role.id}
                            onClick={() => field.onChange(active ? "" : role.value)}
                            className={`group flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                              active
                                ? "border-[oklch(0.66_0.16_35)] bg-[oklch(0.66_0.16_35)]/8 text-[oklch(0.55_0.16_35)]"
                                : "border-border bg-white text-muted-foreground hover:border-[oklch(0.72_0.11_80)]/45 hover:text-foreground"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                                active
                                  ? "border-[oklch(0.66_0.16_35)] bg-[oklch(0.66_0.16_35)]"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                            {t(`buyerRoles.${role.id}`)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </FormSection>

              <SectionDivider />

              {/* SECTION 2: Product Requirements */}
              <FormSection number={2} title={t("sections.product.title")}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.productCategories.label")} required={false}>
                    <Controller
                      control={form.control}
                      name="productCategories"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("fields.productCategories.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((c) => (
                              <SelectItem key={c.id} value={c.value}>{t(`productCategories.${c.id}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label={t("fields.productNames.label")}>
                    <Input
                      {...form.register("productNames")}
                      placeholder={t("fields.productNames.placeholder")}
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.brandPreference.label")}>
                    <Input
                      {...form.register("brandPreference")}
                      placeholder={t("fields.brandPreference.placeholder")}
                      className="h-11"
                    />
                  </Field>
                  <Field label={t("fields.quantityMoq.label")}>
                    <Input
                      {...form.register("quantityMoq")}
                      placeholder={t("fields.quantityMoq.placeholder")}
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.packagingType.label")}>
                    <Controller
                      control={form.control}
                      name="packagingType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("fields.packagingType.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {PACKAGING_TYPES.map((p) => (
                              <SelectItem key={p.id} value={p.value}>{t(`packagingTypes.${p.id}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label={t("fields.privateLabel.label")}>
                    <Controller
                      control={form.control}
                      name="privateLabel"
                      render={({ field }) => (
                        <RadioYesNo value={field.value ?? "no"} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                </div>

                <Field label={t("fields.targetPrice.label")}>
                  <Input
                    {...form.register("targetPrice")}
                    placeholder={t("fields.targetPrice.placeholder")}
                    className="h-11"
                  />
                </Field>
              </FormSection>

              <SectionDivider />

              {/* SECTION 3: Export Details */}
              <FormSection number={3} title={t("sections.export.title")}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.destinationCountry.label")} required error={form.formState.errors.destinationCountry?.message}>
                    <Controller
                      control={form.control}
                      name="destinationCountry"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("fields.destinationCountry.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c.id} value={c.value}>{t(`countries.${c.id}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label={t("fields.shippingMethod.label")}>
                    <Controller
                      control={form.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("fields.shippingMethod.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {SHIPPING_METHODS.map((s) => (
                              <SelectItem key={s.id} value={s.value}>{t(`shippingMethods.${s.id}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.mixedContainer.label")}>
                    <Controller
                      control={form.control}
                      name="mixedContainer"
                      render={({ field }) => (
                        <RadioYesNo value={field.value ?? "no"} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                  <Field label={t("fields.requiredDocuments.label")}>
                    <Controller
                      control={form.control}
                      name="requiredDocuments"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder={t("fields.requiredDocuments.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {REQUIRED_DOCS.map((d) => (
                              <SelectItem key={d.id} value={d.value}>{t(`requiredDocs.${d.id}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>

                <Field label={t("fields.timeline.label")}>
                  <Controller
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder={t("fields.timeline.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMELINES.map((tl) => (
                            <SelectItem key={tl.id} value={tl.value}>{t(`timelines.${tl.id}`)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </FormSection>

              <SectionDivider />

              {/* SECTION 4: Message & Upload */}
              <FormSection number={4} title={t("sections.message.title")}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fields.notes.label")}>
                    <Textarea
                      {...form.register("notes")}
                      rows={4}
                      placeholder={t("fields.notes.placeholder")}
                      className="resize-none"
                    />
                  </Field>

                  <Field label={t("fields.upload.label")}>
                    <div
                      {...getRootProps()}
                      className={`flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 text-center transition-colors ${
                        isDragActive
                          ? "border-[oklch(0.66_0.16_35)] bg-[oklch(0.66_0.16_35)]/5"
                          : "border-[oklch(0.72_0.11_80)]/40 bg-[oklch(0.72_0.11_80)]/5 hover:border-[oklch(0.66_0.16_35)]/60 hover:bg-[oklch(0.66_0.16_35)]/5"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className="h-7 w-7 text-[oklch(0.66_0.16_35)]" />
                      <p className="mt-2 text-xs">
                        <span className="font-semibold text-[oklch(0.55_0.16_35)]">{t("upload.click")}</span>{" "}
                        <span className="text-muted-foreground">{t("upload.dragDrop")}</span>
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {t("upload.formats")}
                      </p>
                    </div>

                    {files.length > 0 && (
                      <ul className="mt-2 space-y-1.5">
                        {files.map((file, i) => (
                          <li
                            key={`${file.name}-${i}`}
                            className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs"
                          >
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setFiles((prev) => prev.filter((_, k) => k !== i))
                              }
                              className="text-muted-foreground hover:text-destructive"
                              aria-label={t("upload.removeFile")}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Field>
                </div>
              </FormSection>

              {/* Submit */}
              <div className="mt-8 space-y-3">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-12 w-full bg-[oklch(0.66_0.16_35)] text-sm font-semibold text-white shadow-md shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? t("submit.submitting") : t("submit.label")}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  {t("submit.securityNote")}
                </p>
              </div>
            </form>

            {/* RIGHT: Why Card */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative h-fit overflow-hidden rounded-2xl border border-[oklch(0.28_0.02_80)] bg-[oklch(0.14_0.02_80)] p-6 text-white shadow-xl shadow-[oklch(0.20_0.02_80)]/15 sm:p-8 lg:sticky lg:top-24"
            >
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[oklch(0.78_0.12_80)]/8 blur-3xl" />

              <div className="relative">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold leading-tight sm:text-2xl">
                  {t("whyCard.titleLine1")}
                  <br />
                  {t("whyCard.titleLine2")}
                </h3>
                <div className="mt-3 h-[3px] w-12 rounded-full bg-[oklch(0.78_0.12_80)]" />

                <ul className="mt-7 space-y-6">
                  {REASONS.map((r) => {
                    const Icon = r.icon;
                    return (
                      <li key={r.id} className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[oklch(0.78_0.12_80)]/40 bg-[oklch(0.78_0.12_80)]/10 text-[oklch(0.78_0.12_80)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{t(`reasons.${r.id}.title`)}</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                            {t(`reasons.${r.id}.description`)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[oklch(0.78_0.12_80)]/40 bg-[oklch(0.78_0.12_80)]/10 text-[oklch(0.78_0.12_80)]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="text-xs leading-relaxed text-white/65">
                      <p>
                        {t("whyCard.note")}
                      </p>
                      <p className="mt-2 font-semibold text-[oklch(0.82_0.11_80)]">
                        {t("whyCard.priority")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ───────── WHAT HAPPENS NEXT ───────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.60_0.12_75)]">
              {t("process.eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              {t("process.heading")}
            </h2>
          </div>

          <div className="relative mt-14">
            {/* Dashed connector line (desktop) */}
            <div
              aria-hidden
              className="absolute left-[10%] right-[10%] top-7 hidden h-px lg:block"
              style={{
                background:
                  "repeating-linear-gradient(to right, oklch(0.72 0.11 80 / 0.5) 0 6px, transparent 6px 12px)",
              }}
            />

            <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.li
                    key={step.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[oklch(0.72_0.11_80)]/40 bg-white text-[oklch(0.60_0.12_75)] shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-semibold">
                      {i + 1}. {t(`process.steps.${step.id}.title`)}
                    </p>
                    <p className="mt-1.5 max-w-[180px] text-xs leading-relaxed text-muted-foreground">
                      {t(`process.steps.${step.id}.description`)}
                    </p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── NEED HELP CTA ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image src={CTA_BG} alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)]/95 via-[oklch(0.14_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/85" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[oklch(0.78_0.12_80)]/40 bg-[oklch(0.78_0.12_80)]/10 text-[oklch(0.78_0.12_80)]">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("helpCta.title")}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                  {t("helpCta.subtitle")}
                </p>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="h-12 shrink-0 bg-[oklch(0.66_0.16_35)] px-7 text-base font-semibold text-white shadow-lg shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
            >
              <Link href={`/${locale}/contact`}>
                <Mail className="mr-2 h-4 w-4" />
                {t("helpCta.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────── helpers ───────── */

function FormSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.72_0.11_80)]/35 bg-[oklch(0.72_0.11_80)]/10 text-sm font-bold text-[oklch(0.50_0.12_75)]">
          {number}
        </span>
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-tight">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function SectionDivider() {
  return <div className="my-8 border-t border-dashed border-border" />;
}

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

function RadioYesNo({
  value,
  onChange,
}: {
  value: "yes" | "no";
  onChange: (v: "yes" | "no") => void;
}) {
  const t = useTranslations("requestQuotePage");
  return (
    <div className="flex h-11 items-center gap-6 rounded-md border border-input bg-white px-3">
      {(["yes", "no"] as const).map((opt) => {
        const active = value === opt;
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className="flex items-center gap-2 text-sm capitalize"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                active
                  ? "border-[oklch(0.66_0.16_35)] bg-[oklch(0.66_0.16_35)]"
                  : "border-muted-foreground/40"
              }`}
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className={active ? "text-foreground" : "text-muted-foreground"}>{t(`yesNo.${opt}`)}</span>
          </button>
        );
      })}
    </div>
  );
}

function mapBuyerType(t: string): string {
  const map: Record<string, string> = {
    "Distributor": "distributor",
    "Wholesaler": "distributor",
    "Retailer": "retail",
    "Importer": "small_business",
    "Private Label Buyer": "brand_owner",
    "Other": "partner",
    "Hotel / HORECA": "partner",
    "Catering / Food Service": "partner",
  };
  return map[t] ?? "partner";
}
