"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/shared/page-hero";

export default function CustomerLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("accountLoginPage");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push(`/${locale}/account`);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? t("error.loginFailed"));
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        locale={locale}
        breadcrumbs={[{ label: t("breadcrumbs.account") }, { label: t("breadcrumbs.signIn") }]}
      />
      <div className="mx-auto max-w-md px-4 py-16">
        <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("form.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("form.password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {t("form.submit")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount.prompt")}{" "}
            <Link href={`/${locale}/account/apply`} className="font-medium underline">
              {t("noAccount.applyLink")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
