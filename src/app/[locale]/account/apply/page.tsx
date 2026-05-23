"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHero } from "@/components/shared/page-hero";
import { toast } from "sonner";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "At least 8 characters"),
  passwordConfirm: z.string(),
  name: z.string().min(2, "Required"),
  company: z.string().min(2, "Required"),
  country: z.string().min(2, "Required"),
  phone: z.string().optional(),
  buyerType: z.string().min(1, "Select buyer type"),
  taxId: z.string().optional(),
  website: z.string().optional(),
  applicationMsg: z.string().optional(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

type FormValues = z.infer<typeof schema>;

export default function ApplyPage() {
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);

  const {
    register, handleSubmit, setValue, watch, formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { buyerType: "distributor" },
  });

  const buyerType = watch("buyerType");

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/customer/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Application failed");
    }
  };

  if (submitted) {
    return (
      <div>
        <PageHero
          title="Application received"
          locale={locale}
          breadcrumbs={[{ label: "Account" }, { label: "Apply" }]}
        />
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
          <h2 className="mt-6 text-2xl font-bold">Thanks for applying</h2>
          <p className="mt-3 text-muted-foreground">
            Our sales team reviews each application personally. You'll receive an email at the address you provided once your account is approved — usually within one business day.
          </p>
          <Button asChild className="mt-8">
            <Link href={`/${locale}`}>Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title="Apply for a Trade Account"
        subtitle="B2B buyers — distributors, supermarket chains, wholesalers, and retailers. Approval unlocks pricing and the full catalog."
        locale={locale}
        breadcrumbs={[{ label: "Account" }, { label: "Apply" }]}
      />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold">Login credentials</h2>
            <div className="space-y-2">
              <Label htmlFor="email">Business Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" {...register("password")} autoComplete="new-password" />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm Password *</Label>
                <Input id="passwordConfirm" type="password" {...register("passwordConfirm")} autoComplete="new-password" />
                {errors.passwordConfirm && (
                  <p className="text-xs text-destructive">{errors.passwordConfirm.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold">Company</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input id="company" {...register("company")} />
                {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" {...register("country")} placeholder="Saudi Arabia" />
                {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="+966 ..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Buyer Type *</Label>
              <Select value={buyerType} onValueChange={(v) => setValue("buyerType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="retail">Retail / Supermarket</SelectItem>
                  <SelectItem value="small_business">Small Business</SelectItem>
                  <SelectItem value="brand_owner">Brand Owner</SelectItem>
                  <SelectItem value="partner">Partner / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax / Trade ID</Label>
                <Input id="taxId" {...register("taxId")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register("website")} placeholder="https://" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationMsg">Tell us about your business</Label>
              <Textarea
                id="applicationMsg"
                rows={3}
                {...register("applicationMsg")}
                placeholder="What products are you most interested in? Volume? Markets served?"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" />
            Submit Application
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already approved?{" "}
            <Link href={`/${locale}/account/login`} className="font-medium underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
