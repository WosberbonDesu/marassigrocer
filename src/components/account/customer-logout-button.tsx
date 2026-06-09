"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CustomerLogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("customerLogout");
  const onClick = async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    router.push(`/${locale}/account/login`);
    router.refresh();
  };
  return (
    <Button variant="outline" size="sm" onClick={onClick} className={cn(className)}>
      <LogOut className="mr-2 h-4 w-4" />
      {t("signOut")}
    </Button>
  );
}
