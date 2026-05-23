"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/lib/permissions";
import type { AdminRole } from "@prisma/client";

const ALL_ROLES: AdminRole[] = ["OWNER", "ADMIN", "EDITOR", "SALES_REP", "VIEWER"];

type FormValues = {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
  active: boolean;
};

type Props = {
  mode: "create" | "edit";
  userId?: string;
  initial?: Partial<FormValues>;
};

export function UserForm({ mode, userId, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      email: initial?.email ?? "",
      name: initial?.name ?? "",
      password: "",
      role: initial?.role ?? "ADMIN",
      active: initial?.active ?? true,
    },
  });

  const role = watch("role");

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    setError("");
    const url = mode === "create" ? "/api/admin/users" : `/api/admin/users/${userId}`;
    const method = mode === "create" ? "POST" : "PUT";
    const payload: Partial<FormValues> = { ...data };
    if (mode === "edit" && !payload.password) delete payload.password;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Save failed");
      setSaving(false);
      return;
    }
    router.push("/admin/users");
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email", { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input id="name" {...register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">
            Password {mode === "edit" && <span className="text-xs text-muted-foreground">(leave blank to keep current)</span>}
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder={mode === "edit" ? "••••••••" : "Min. 8 characters"}
            {...register("password", { required: mode === "create", minLength: 8 })}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setValue("role", v as AdminRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="active"
            type="checkbox"
            {...register("active")}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active (can sign in)
          </Label>
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" />
        {mode === "create" ? "Create User" : "Save Changes"}
      </Button>
    </form>
  );
}
