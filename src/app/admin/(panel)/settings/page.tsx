"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AdminTopBar } from "@/components/admin/top-bar";
import { QrGenerator } from "@/components/admin/qr-generator";

function BriefDefaultsButton({ onLoaded }: { onLoaded: (c: Record<string, unknown>) => void }) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!confirm("Load brief defaults? This will overwrite company name, contact email, site title/description, and the 4 office addresses with the client brief content.")) return;
    setBusy(true);
    const res = await fetch("/api/admin/settings/seed-defaults", { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      onLoaded(d.config);
      toast.success(d.message ?? "Defaults loaded");
    } else {
      toast.error("Failed to load defaults");
    }
    setBusy(false);
  };
  return (
    <div className="flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-5 py-3">
      <div className="flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <div>
          <p className="text-sm font-semibold">One-shot brief seed</p>
          <p className="text-xs text-muted-foreground">
            Load company name, 4 office addresses, and default SEO copy from the Marassi brief.
          </p>
        </div>
      </div>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={run}>
        {busy ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-2 h-3.5 w-3.5" />}
        Load Defaults
      </Button>
    </div>
  );
}

interface SettingsForm {
  // General
  companyName: string;
  email: string;
  whatsapp: string;
  showPricesPublicly: boolean;
  // SEO
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  // Analytics
  gtmId: string;
  metaPixelId: string;
  ga4Id: string;
  // Social
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
}

const EMPTY: SettingsForm = {
  companyName: "",
  email: "",
  whatsapp: "",
  showPricesPublicly: false,
  siteTitle: "",
  siteDescription: "",
  ogImage: "",
  gtmId: "",
  metaPixelId: "",
  ga4Id: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm<SettingsForm>({
    defaultValues: EMPTY,
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.config) {
          const c = d.config;
          reset({
            companyName: c.companyName ?? "",
            email: c.email ?? "",
            whatsapp: c.whatsapp ?? "",
            showPricesPublicly: c.showPricesPublicly ?? false,
            siteTitle: c.siteTitle ?? "",
            siteDescription: c.siteDescription ?? "",
            ogImage: c.ogImage ?? "",
            gtmId: c.gtmId ?? "",
            metaPixelId: c.metaPixelId ?? "",
            ga4Id: c.ga4Id ?? "",
            facebookUrl: c.facebookUrl ?? "",
            instagramUrl: c.instagramUrl ?? "",
            tiktokUrl: c.tiktokUrl ?? "",
            linkedinUrl: c.linkedinUrl ?? "",
            twitterUrl: c.twitterUrl ?? "",
            youtubeUrl: c.youtubeUrl ?? "",
          });
        }
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminTopBar title="Settings" />
        <div className="p-6">
          <div className="h-64 max-w-3xl animate-pulse rounded-2xl bg-muted" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title="Settings" />
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-700">
              Settings saved successfully.
            </div>
          )}

          <BriefDefaultsButton onLoaded={(c) => {
            const s = (k: string) => (typeof c[k] === "string" ? (c[k] as string) : "");
            reset({
              companyName: s("companyName"),
              email: s("email"),
              whatsapp: s("whatsapp"),
              siteTitle: s("siteTitle"),
              siteDescription: s("siteDescription"),
              ogImage: s("ogImage"),
              gtmId: s("gtmId"),
              metaPixelId: s("metaPixelId"),
              ga4Id: s("ga4Id"),
              facebookUrl: s("facebookUrl"),
              instagramUrl: s("instagramUrl"),
              tiktokUrl: s("tiktokUrl"),
              linkedinUrl: s("linkedinUrl"),
              twitterUrl: s("twitterUrl"),
              youtubeUrl: s("youtubeUrl"),
              showPricesPublicly: c.showPricesPublicly === true,
            });
          }} />

          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="space-y-5 rounded-2xl border bg-card p-5">
                <h3 className="font-semibold">Company & Contact</h3>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" {...register("companyName")} placeholder="Marassi Group" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="info@marassigroup.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" {...register("whatsapp")} placeholder="905551234567" />
                  <p className="text-xs text-muted-foreground">
                    Country code + number, no spaces or dashes. e.g. 905551234567
                  </p>
                </div>

                <div className="rounded-lg border border-dashed bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="showPricesPublicly"
                      type="checkbox"
                      {...register("showPricesPublicly")}
                      className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="showPricesPublicly" className="cursor-pointer font-medium">
                      Show prices publicly
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When off (B2B mode), case/unit prices are hidden behind lock icons and never sent to the public API. When on, prices are visible to everyone.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo">
              <div className="space-y-5 rounded-2xl border bg-card p-5">
                <h3 className="font-semibold">SEO Defaults</h3>
                <p className="text-sm text-muted-foreground">
                  These fall back when a page doesn't define its own metadata.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Default Site Title</Label>
                  <Input id="siteTitle" {...register("siteTitle")} placeholder="Marassi Group — FMCG Export" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Default Description</Label>
                  <Textarea
                    id="siteDescription"
                    rows={3}
                    {...register("siteDescription")}
                    placeholder="B2B FMCG export, private label manufacturing…"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogImage">Open Graph Image URL</Label>
                  <Input
                    id="ogImage"
                    {...register("ogImage")}
                    placeholder="https://res.cloudinary.com/.../og.jpg"
                  />
                  <p className="text-xs text-muted-foreground">1200×630 recommended. Used for social previews.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-5 rounded-2xl border bg-card p-5">
                <h3 className="font-semibold">Analytics & Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Use Google Tag Manager for the cleanest setup — connect GA4, Meta Pixel, TikTok Pixel and more inside GTM.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="gtmId">Google Tag Manager ID</Label>
                  <Input id="gtmId" {...register("gtmId")} placeholder="GTM-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ga4Id">GA4 Measurement ID</Label>
                  <Input id="ga4Id" {...register("ga4Id")} placeholder="G-XXXXXXXXXX" />
                  <p className="text-xs text-muted-foreground">
                    Only loads if no GTM ID is set (otherwise add GA4 inside GTM).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaPixelId">Meta (Facebook) Pixel ID</Label>
                  <Input id="metaPixelId" {...register("metaPixelId")} placeholder="123456789012345" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social">
              <div className="space-y-5 rounded-2xl border bg-card p-5">
                <h3 className="font-semibold">Social Links</h3>
                <p className="text-sm text-muted-foreground">
                  Shown in the footer and SEO sameAs schema.
                </p>
                {(
                  [
                    ["facebookUrl", "Facebook URL", "https://facebook.com/marassigroup"],
                    ["instagramUrl", "Instagram URL", "https://instagram.com/marassigroup"],
                    ["tiktokUrl", "TikTok URL", "https://tiktok.com/@marassigroup"],
                    ["linkedinUrl", "LinkedIn URL", "https://linkedin.com/company/marassigroup"],
                    ["twitterUrl", "X / Twitter URL", "https://x.com/marassigroup"],
                    ["youtubeUrl", "YouTube URL", "https://youtube.com/@marassigroup"],
                  ] as const
                ).map(([name, label, ph]) => (
                  <div key={name} className="space-y-2">
                    <Label htmlFor={name}>{label}</Label>
                    <Input id={name} {...register(name)} placeholder={ph} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qr">
              <div className="space-y-5 rounded-2xl border bg-card p-5">
                <h3 className="font-semibold">Site QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a QR for your homepage, a campaign link, or any URL. Saved as PNG or SVG — drop it on business cards, signage, or packaging.
                </p>
                <QrGenerator />
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </form>
      </div>
    </>
  );
}
