"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
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
  "Egypt", "Turkey", "United Arab Emirates", "Saudi Arabia", "Iraq", "Jordan",
  "Libya", "Sudan", "Nigeria", "Kenya", "Ghana", "Senegal",
  "Germany", "United Kingdom", "France", "Italy", "Spain",
  "Algeria", "Morocco", "Tunisia", "Qatar", "Kuwait", "Oman", "Bahrain", "Other",
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
  "Importer", "Distributor", "Wholesaler", "Retailer", "Private Label Buyer",
  "Hotel / HORECA", "Catering / Food Service", "Other",
];

const BUYER_ROLES = [
  "Importer", "Distributor", "Wholesaler", "Retailer", "Private Label Buyer", "Other",
];

const PRODUCT_CATEGORIES = [
  "Biscuits & Confectionery", "Dairy Products", "Beverages",
  "Snacks & Confectionery", "Oils & Condiments", "Canned & Dry Foods",
  "Cleaning Products", "Personal Care", "Baby Food", "Other",
];

const PACKAGING_TYPES = [
  "Carton Box", "Plastic Bottle", "Glass Jar", "Tin Can",
  "Pouch / Sachet", "Bulk Bag", "Tetra Pak", "Custom",
];

const SHIPPING_METHODS = [
  "FOB (Free on Board)", "CIF (Cost, Insurance, Freight)", "EXW (Ex Works)",
  "CFR (Cost & Freight)", "DDP (Delivered Duty Paid)", "Not sure",
];

const REQUIRED_DOCS = [
  "Commercial Invoice", "Packing List", "Certificate of Origin (COO)",
  "Bill of Lading (B/L)", "Certificate of Analysis (COA)",
  "Health / Phytosanitary Certificate", "Full export documentation set",
];

const TIMELINES = [
  "Urgent — within 2 weeks", "1 month", "1–2 months",
  "3 months", "Flexible / planning ahead",
];

const REASONS = [
  {
    icon: Users,
    title: "Trusted Sourcing Network",
    description:
      "We work with certified manufacturers and top FMCG brands to ensure authentic, high-quality products.",
  },
  {
    icon: FileBadge2,
    title: "Export Documentation Support",
    description:
      "Complete export and compliance documentation to ensure smooth international trade.",
  },
  {
    icon: Container,
    title: "Mixed Container Options",
    description:
      "Combine multiple products and brands in one container to optimize cost and logistics.",
  },
  {
    icon: Tag,
    title: "Private Label Solutions",
    description:
      "Custom private label manufacturing and branding tailored to your market needs.",
  },
  {
    icon: Globe2,
    title: "Global Market Experience",
    description:
      "Serving 50+ markets worldwide with proven expertise and long-term partnerships.",
  },
];

const PROCESS_STEPS = [
  {
    icon: ClipboardCheck,
    title: "Inquiry Review",
    description: "Our team reviews your request and gathers all necessary details.",
  },
  {
    icon: PackageSearch,
    title: "Product Matching",
    description: "We match your requirements with the best products and suppliers from our network.",
  },
  {
    icon: FileText,
    title: "Quotation Preparation",
    description: "We prepare a competitive quotation tailored to your needs.",
  },
  {
    icon: Handshake,
    title: "Confirmation",
    description: "You review and confirm the quotation, terms, and conditions.",
  },
  {
    icon: Ship,
    title: "Export Coordination",
    description: "We handle export, logistics, and documentation until delivery.",
  },
];

export default function RequestQuotePage() {
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
        toast.success("Quote request submitted! Our team will respond within 24 hours.");
        form.reset();
        setFiles([]);
        clearItems();
      } else {
        toast.error("Submission failed. Please check the required fields.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
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
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">Request a Quote</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Request a Custom
              <br />
              <span className="text-[oklch(0.78_0.12_80)]">FMCG Quote</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
              Tell us what products you need, your target market, and your order requirements.
              Our export team will prepare a tailored sourcing and quotation proposal.
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
                    From your RFQ list — {items.length} item{items.length > 1 ? "s" : ""}
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
              <FormSection number={1} title="Company Information">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required error={form.formState.errors.fullName?.message}>
                    <Input
                      {...form.register("fullName")}
                      placeholder="Enter your full name"
                      className="h-11"
                    />
                  </Field>
                  <Field label="Company Name" required error={form.formState.errors.companyName?.message}>
                    <Input
                      {...form.register("companyName")}
                      placeholder="Enter company name"
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Country" required error={form.formState.errors.country?.message}>
                    <Controller
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="City">
                    <Input
                      {...form.register("city")}
                      placeholder="Enter city"
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email" required error={form.formState.errors.email?.message}>
                    <Input
                      type="email"
                      {...form.register("email")}
                      placeholder="Enter email address"
                      className="h-11"
                    />
                  </Field>
                  <Field label="Phone / WhatsApp" required error={form.formState.errors.phone?.message}>
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

                <Field label="Buyer Type" required error={form.formState.errors.buyerType?.message}>
                  <Controller
                    control={form.control}
                    name="buyerType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select buyer type" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUYER_TYPES.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
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
                        const active = field.value === role;
                        return (
                          <button
                            type="button"
                            key={role}
                            onClick={() => field.onChange(active ? "" : role)}
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
                            {role}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </FormSection>

              <SectionDivider />

              {/* SECTION 2: Product Requirements */}
              <FormSection number={2} title="Product Requirements">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Product Categories" required={false}>
                    <Controller
                      control={form.control}
                      name="productCategories"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select product categories" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="Specific Product Names">
                    <Input
                      {...form.register("productNames")}
                      placeholder="e.g. NIDO Milk Powder, Heinz Ketchup"
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Brand Preference">
                    <Input
                      {...form.register("brandPreference")}
                      placeholder="Any brand or specify"
                      className="h-11"
                    />
                  </Field>
                  <Field label="Quantity / MOQ">
                    <Input
                      {...form.register("quantityMoq")}
                      placeholder="e.g. 1 x 40ft Container / 20 Pallets"
                      className="h-11"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Packaging Type">
                    <Controller
                      control={form.control}
                      name="packagingType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select packaging type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PACKAGING_TYPES.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="Private Label Required?">
                    <Controller
                      control={form.control}
                      name="privateLabel"
                      render={({ field }) => (
                        <RadioYesNo value={field.value ?? "no"} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                </div>

                <Field label="Target Price if available">
                  <Input
                    {...form.register("targetPrice")}
                    placeholder="e.g. USD 1.00 – 2.00 per unit"
                    className="h-11"
                  />
                </Field>
              </FormSection>

              <SectionDivider />

              {/* SECTION 3: Export Details */}
              <FormSection number={3} title="Export Details">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Destination Country" required error={form.formState.errors.destinationCountry?.message}>
                    <Controller
                      control={form.control}
                      name="destinationCountry"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select destination country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="Preferred Shipping Method">
                    <Controller
                      control={form.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select shipping method" />
                          </SelectTrigger>
                          <SelectContent>
                            {SHIPPING_METHODS.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Mixed Container Required?">
                    <Controller
                      control={form.control}
                      name="mixedContainer"
                      render={({ field }) => (
                        <RadioYesNo value={field.value ?? "no"} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                  <Field label="Required Documents">
                    <Controller
                      control={form.control}
                      name="requiredDocuments"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select required documents" />
                          </SelectTrigger>
                          <SelectContent>
                            {REQUIRED_DOCS.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>

                <Field label="Timeline / Urgency">
                  <Controller
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMELINES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </FormSection>

              <SectionDivider />

              {/* SECTION 4: Message & Upload */}
              <FormSection number={4} title="Message & Upload">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Additional Notes">
                    <Textarea
                      {...form.register("notes")}
                      rows={4}
                      placeholder="Any specific requirements, product details, or special instructions..."
                      className="resize-none"
                    />
                  </Field>

                  <Field label="Upload Product List or Reference File">
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
                        <span className="font-semibold text-[oklch(0.55_0.16_35)]">Click to upload</span>{" "}
                        <span className="text-muted-foreground">or drag &amp; drop</span>
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        PDF, Excel, or Word (Max 10MB)
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
                              aria-label="Remove file"
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
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Quote Request"}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Your information is secure and will only be used to process your request.
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
                  Why Request a Quote
                  <br />
                  from Marassi?
                </h3>
                <div className="mt-3 h-[3px] w-12 rounded-full bg-[oklch(0.78_0.12_80)]" />

                <ul className="mt-7 space-y-6">
                  {REASONS.map((r) => {
                    const Icon = r.icon;
                    return (
                      <li key={r.title} className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[oklch(0.78_0.12_80)]/40 bg-[oklch(0.78_0.12_80)]/10 text-[oklch(0.78_0.12_80)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{r.title}</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                            {r.description}
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
                        We respond quickly and professionally with tailored quotations that match
                        your exact requirements.
                      </p>
                      <p className="mt-2 font-semibold text-[oklch(0.82_0.11_80)]">
                        Your success is our priority.
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
              Our Process
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              What Happens Next
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
                    key={step.title}
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
                      {i + 1}. {step.title}
                    </p>
                    <p className="mt-1.5 max-w-[180px] text-xs leading-relaxed text-muted-foreground">
                      {step.description}
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
                  Need Help Preparing Your Product List?
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                  Contact our export team for guidance on product selection, sourcing, and building
                  the perfect order for your market.
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
                Contact Export Team
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
            <span className={active ? "text-foreground" : "text-muted-foreground"}>{opt}</span>
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
