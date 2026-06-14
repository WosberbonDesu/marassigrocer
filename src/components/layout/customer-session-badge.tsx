"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { UserCircle, LogIn } from "lucide-react";

export function CustomerSessionBadge({
  variant = "light",
}: { variant?: "light" | "dark" } = {}) {
  const locale = useLocale();
  const t = useTranslations("customerSession");
  const [name, setName] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((r) => r.json())
      .then((d) => setName(d.customer?.name ?? null))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  const darkCls =
    "hidden h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white xl:inline-flex";
  const lightCls =
    "hidden h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-[oklch(0.60_0.12_75)] sm:inline-flex";
  const cls = variant === "dark" ? darkCls : lightCls;

  if (name) {
    return (
      <Link href={`/${locale}/account`} className={cls}>
        <UserCircle className="h-4 w-4" />
        <span className="hidden xl:inline">{name.split(" ")[0]}</span>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}/account/login`} className={cls}>
      <LogIn className="h-4 w-4" />
      <span className="hidden xl:inline">{t("signIn")}</span>
    </Link>
  );
}
