"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminTopBar } from "@/components/admin/top-bar";

interface SettingsForm {
  whatsapp: string;
  email: string;
  companyName: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm<SettingsForm>({
    defaultValues: { whatsapp: "", email: "", companyName: "" },
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.config) {
          reset({
            whatsapp: d.config.whatsapp ?? "",
            email: d.config.email ?? "",
            companyName: d.config.companyName ?? "",
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

  return (
    <>
      <AdminTopBar title="Settings" />
      <div className="p-6">
        {loading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-muted max-w-2xl" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
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

            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <h3 className="font-semibold">Company Info</h3>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" {...register("companyName")} placeholder="Marassi Group" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="info@marassigroup.com" />
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <h3 className="font-semibold">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">
                Enter your WhatsApp number with country code (no spaces or dashes). This will be used for the contact button throughout the site.
              </p>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  {...register("whatsapp")}
                  placeholder="905551234567"
                />
                <p className="text-xs text-muted-foreground">
                  Example: 905551234567 (Turkey +90 prefix)
                </p>
              </div>

              {register("whatsapp") && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">WhatsApp link preview:</p>
                  <code className="text-xs text-muted-foreground">
                    https://wa.me/[your-number]
                  </code>
                </div>
              )}
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
