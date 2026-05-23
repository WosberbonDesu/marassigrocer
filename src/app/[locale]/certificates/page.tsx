import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Award,
  FileText,
  Download,
  ShieldCheck,
  BadgeCheck,
  ClipboardCheck,
  Microscope,
  Beaker,
  Truck,
  CheckCircle2,
  ArrowRight,
  Globe2,
  Sparkles,
  Building2,
  Calendar,
} from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Certificates & Quality | Marassi Group",
  description:
    "Marassi Group's certifications, quality standards, and compliance documentation — ISO, HACCP, Halal, BRC and more for trusted global FMCG export.",
};

const HERO_BG =
  "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1920&q=70";
const PORT_BG =
  "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=70";
const LAB_BG =
  "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=900&q=80";

const standards = [
  {
    icon: ShieldCheck,
    name: "ISO 22000",
    tagline: "Food Safety Management",
    description: "Internationally recognized food safety management system standard.",
  },
  {
    icon: BadgeCheck,
    name: "HACCP",
    tagline: "Hazard Analysis",
    description: "Systematic preventive approach to food safety from raw material to consumer.",
  },
  {
    icon: Sparkles,
    name: "Halal",
    tagline: "Halal Certified",
    description: "Compliance with Islamic dietary laws — sourcing-to-shipment traceability.",
  },
  {
    icon: Globe2,
    name: "BRC / IFS",
    tagline: "Global Standards",
    description: "Internationally accepted standards for global food trade and retail.",
  },
  {
    icon: ClipboardCheck,
    name: "GMP",
    tagline: "Good Manufacturing",
    description: "Quality-assured production environments and process discipline.",
  },
  {
    icon: Award,
    name: "Kosher",
    tagline: "Kosher Certified",
    description: "Available on-request for selected product lines and private label.",
  },
];

const qualityProcess = [
  {
    step: 1,
    icon: Microscope,
    title: "Supplier Vetting",
    desc: "Every manufacturer is audited for facility hygiene, certifications, and traceability before onboarding.",
  },
  {
    step: 2,
    icon: Beaker,
    title: "Product Testing",
    desc: "Pre-shipment lab testing for microbial, chemical, and physical safety parameters where required.",
  },
  {
    step: 3,
    icon: ClipboardCheck,
    title: "Documentation Review",
    desc: "COA, COO, health, and halal certificates verified for each shipment and target market.",
  },
  {
    step: 4,
    icon: Truck,
    title: "Compliant Delivery",
    desc: "Full export documentation, labelling, and customs paperwork tailored to destination regulations.",
  },
];

const documentTypes = [
  "Certificate of Origin (COO)",
  "Certificate of Analysis (COA)",
  "Health Certificate",
  "Halal Certificate",
  "Phytosanitary Certificate",
  "Free Sale Certificate",
  "Packing List & Commercial Invoice",
  "Material Safety Data Sheet (MSDS)",
];

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let certificates: Array<{
    id: string;
    title: string;
    description: string | null;
    issuer: string | null;
    issuedDate: Date | null;
    validUntil: Date | null;
    fileUrl: string | null;
    imageUrl: string | null;
  }> = [];
  try {
    certificates = await db.certificate.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        description: true,
        issuer: true,
        issuedDate: true,
        validUntil: true,
        fileUrl: true,
        imageUrl: true,
      },
    });
  } catch {
    certificates = [];
  }

  return (
    <div className="bg-background">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_BG}
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.01_60)] via-[oklch(0.14_0.02_80)]/90 to-[oklch(0.14_0.02_80)]/55" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8 lg:pb-36 lg:pt-24">
          <nav className="mb-5 flex items-center gap-2 text-xs text-white/55">
            <Link href="/" locale={locale} className="transition-colors hover:text-[oklch(0.78_0.12_80)]">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="font-medium text-[oklch(0.78_0.12_80)]">Certificates &amp; Quality</span>
          </nav>

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.78_0.12_80)]">
            Trust &amp; Compliance
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Certified Quality.<br />
            <span className="text-[oklch(0.78_0.12_80)]">Trusted Globally.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
            Every product we source and export is backed by internationally recognized certifications, verified suppliers, and complete documentation tailored to your market&apos;s regulatory requirements.
          </p>
          <div className="mt-7 h-[3px] w-16 rounded-full bg-[oklch(0.78_0.12_80)]" />
        </div>
      </section>

      {/* ───────── QUALITY STATS BAR (raised) ───────── */}
      <section className="relative bg-background">
        <div className="mx-auto -mt-16 max-w-7xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[oklch(0.72_0.11_80)]/20 bg-white p-6 shadow-[0_24px_60px_-18px_oklch(0.20_0.02_80/0.18)] sm:p-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: "100%", label: "Verified Suppliers" },
                { value: "29+", label: "Years of Compliance" },
                { value: "50+", label: "Export Markets" },
                { value: "10k+", label: "Documented SKUs" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-none text-[oklch(0.50_0.12_75)] sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── STANDARDS WE FOLLOW ───────── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.60_0.12_75)]">
              Compliance Framework
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              Standards We Follow
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[oklch(0.72_0.11_80)]/70" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.72_0.11_80)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[oklch(0.72_0.11_80)]/70" />
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              We work with manufacturers who hold and maintain internationally accredited certifications across food safety, hygiene, and ethical sourcing.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map(({ icon: Icon, name, tagline, description }) => (
              <div
                key={name}
                className="group relative overflow-hidden rounded-2xl border border-[oklch(0.72_0.11_80)]/15 bg-card p-6 transition-all hover:-translate-y-1 hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-[0_20px_40px_-18px_oklch(0.20_0.02_80/0.25)]"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.78_0.12_80)]/8 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.50_0.12_75)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/25 transition-colors group-hover:bg-[oklch(0.78_0.12_80)] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-[oklch(0.55_0.14_150)]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.40_0.14_150)]">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.14_150)]" />
                      Active
                    </span>
                  </span>
                </div>
                <h3 className="relative mt-5 font-[family-name:var(--font-playfair)] text-xl font-bold tracking-tight">
                  {name}
                </h3>
                <p className="relative mt-1 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.50_0.12_75)]">
                  {tagline}
                </p>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── QUALITY PROCESS (DARK) ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.14_0.02_80)] py-16 text-white sm:py-24">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src={LAB_BG} alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.01_60)] via-[oklch(0.14_0.02_80)]/90 to-[oklch(0.12_0.01_60)]/70" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.78_0.12_80)]">
              Our Quality Process
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From Source to Shipment — <span className="text-[oklch(0.78_0.12_80)]">Verified</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              A four-stage quality and compliance protocol ensures every container leaving our network meets target-market requirements.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {qualityProcess.map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[oklch(0.78_0.12_80)]/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.82_0.11_80)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/25">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[oklch(0.82_0.11_80)]/40">
                    0{step}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/65">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CERTIFICATES GALLERY ───────── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.60_0.12_75)]">
                Active Certifications
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
                Our Live Certificate Library
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Browse and download current certifications. Need product-level documentation? Contact our quality team.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-[oklch(0.72_0.11_80)]/40 bg-transparent text-sm font-medium text-[oklch(0.40_0.10_75)] hover:bg-[oklch(0.78_0.12_80)]/10"
            >
              <Link href="/contact" locale={locale}>
                Request a Specific Certificate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {certificates.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[oklch(0.72_0.11_80)]/30 bg-[oklch(0.97_0.012_85)] py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.50_0.12_75)] ring-1 ring-inset ring-[oklch(0.78_0.12_80)]/25">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-xl font-bold">
                Certificates publishing soon
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Our quality team is compiling and translating the latest certificate scans. In the meantime, request any specific document via our contact form.
              </p>
              <Button
                asChild
                className="mt-6 bg-[oklch(0.66_0.16_35)] text-white hover:bg-[oklch(0.60_0.17_35)]"
              >
                <Link href="/contact" locale={locale}>
                  <FileText className="mr-2 h-4 w-4" />
                  Request Documentation
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((c) => {
                const issuedStr = c.issuedDate
                  ? new Date(c.issuedDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                  : null;
                const validStr = c.validUntil
                  ? new Date(c.validUntil).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                  : null;
                return (
                  <article
                    key={c.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[oklch(0.72_0.11_80)]/15 bg-card shadow-[0_2px_10px_-4px_oklch(0.20_0.02_80/0.10)] transition-all hover:-translate-y-1 hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-[0_20px_40px_-18px_oklch(0.20_0.02_80/0.28)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[oklch(0.97_0.005_85)] to-[oklch(0.94_0.012_85)]">
                      {c.imageUrl ? (
                        <Image
                          src={c.imageUrl}
                          alt={c.title}
                          fill
                          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Award className="h-16 w-16 text-[oklch(0.50_0.12_75)]/35" />
                        </div>
                      )}
                      {validStr && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-[oklch(0.55_0.14_150)]/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                          <CheckCircle2 className="h-3 w-3" />
                          Valid
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold leading-snug tracking-tight">
                        {c.title}
                      </h3>
                      {c.issuer && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[oklch(0.50_0.12_75)]">
                          <Building2 className="h-3 w-3" />
                          {c.issuer}
                        </p>
                      )}
                      {c.description && (
                        <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                          {c.description}
                        </p>
                      )}

                      {(issuedStr || validStr) && (
                        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {issuedStr ?? "—"}{" "}
                            <span className="text-muted-foreground/60">→</span>{" "}
                            {validStr ?? "—"}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-4">
                        {c.fileUrl ? (
                          <Button
                            asChild
                            size="sm"
                            className="h-9 w-full bg-[oklch(0.66_0.16_35)] text-xs font-semibold text-white hover:bg-[oklch(0.60_0.17_35)]"
                          >
                            <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-1.5 h-3.5 w-3.5" />
                              Download Certificate
                            </a>
                          </Button>
                        ) : (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-9 w-full border-[oklch(0.72_0.11_80)]/40 text-xs font-semibold text-[oklch(0.40_0.10_75)] hover:bg-[oklch(0.78_0.12_80)]/10"
                          >
                            <Link href="/contact" locale={locale}>
                              Request Document
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ───────── DOCUMENTATION TYPES ───────── */}
      <section className="relative bg-[oklch(0.97_0.01_85)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.60_0.12_75)]">
                Per-Shipment Documents
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Every Shipment.<br />
                <span className="text-[oklch(0.50_0.12_75)]">Fully Documented.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                We prepare a complete export documentation package for every container — tailored to your destination&apos;s customs and regulatory requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documentTypes.map((doc) => (
                <div
                  key={doc}
                  className="group flex items-center gap-3 rounded-xl border border-[oklch(0.72_0.11_80)]/15 bg-white px-4 py-3 transition-all hover:border-[oklch(0.72_0.11_80)]/45 hover:shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.50_0.12_75)]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium leading-tight">{doc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CTA BAND ───────── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.02_80)] py-14 text-white sm:py-16">
        <div className="absolute inset-0 z-0">
          <Image src={PORT_BG} alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.02_80)]/95 via-[oklch(0.16_0.02_80)]/85 to-[oklch(0.14_0.02_80)]/95" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_auto]">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Need a specific certificate or test report for a shipment?
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
                Our quality team can provide product-level COA, health certificates, and certificates of origin on request — usually within 48 hours.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-[oklch(0.66_0.16_35)] px-6 text-sm font-semibold text-white shadow-md shadow-[oklch(0.66_0.16_35)]/25 hover:bg-[oklch(0.60_0.17_35)]"
              >
                <Link href="/contact" locale={locale}>
                  <FileText className="mr-2 h-4 w-4" />
                  Request Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/10"
              >
                <Link href="/company" locale={locale}>
                  About Our Company
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
