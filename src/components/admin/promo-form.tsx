"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PromoType = "PERCENT" | "AMOUNT";

type FormValues = {
  code: string;
  description: string;
  type: PromoType;
  value: number;
  minOrder: string;
  maxUses: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
};

type Props = {
  mode: "create" | "edit";
  promoId?: string;
  initial?: Partial<FormValues>;
};

const toDateInput = (iso?: string | null) =>
  iso ? new Date(iso).toISOString().slice(0, 10) : "";

export function PromoForm({ mode, promoId, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      code: initial?.code ?? "",
      description: initial?.description ?? "",
      type: initial?.type ?? "PERCENT",
      value: initial?.value ?? 10,
      minOrder: initial?.minOrder ?? "",
      maxUses: initial?.maxUses ?? "",
      validFrom: initial?.validFrom ?? "",
      validUntil: initial?.validUntil ?? "",
      active: initial?.active ?? true,
    },
  });

  const type = watch("type");

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    setError("");
    const url = mode === "create" ? "/api/admin/promos" : `/api/admin/promos/${promoId}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Save failed");
      setSaving(false);
      return;
    }
    router.push("/admin/promos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            {...register("code", { required: true })}
            placeholder="SUMMER25"
            className="font-mono uppercase"
          />
          <p className="text-xs text-muted-foreground">
            Customers type this exactly. Auto-uppercased on save.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Internal description (optional)</Label>
          <Textarea id="description" rows={2} {...register("description")} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Discount</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setValue("type", v as PromoType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT">Percentage</SelectItem>
                <SelectItem value="AMOUNT">Fixed amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">
              Value {type === "PERCENT" ? "(%)" : "(USD)"}
            </Label>
            <Input
              id="value"
              type="number"
              step={type === "PERCENT" ? "1" : "0.01"}
              {...register("value", { required: true, valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="minOrder">Minimum order (USD, optional)</Label>
          <Input id="minOrder" type="number" step="0.01" {...register("minOrder")} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Limits</h3>
        <div className="space-y-2">
          <Label htmlFor="maxUses">Max uses (leave blank for unlimited)</Label>
          <Input id="maxUses" type="number" min="1" {...register("maxUses")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="validFrom">Valid from</Label>
            <Input id="validFrom" type="date" {...register("validFrom")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid until</Label>
            <Input id="validUntil" type="date" {...register("validUntil")} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="active"
            type="checkbox"
            {...register("active")}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" />
        {mode === "create" ? "Create Promo Code" : "Save Changes"}
      </Button>
    </form>
  );
}
