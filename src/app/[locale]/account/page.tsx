import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Package, FileText, User } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { getCustomerSession } from "@/lib/customer-auth";
import { CustomerLogoutButton } from "@/components/account/customer-logout-button";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("accountPage");
  const session = await getCustomerSession();
  if (!session) {
    redirect(`/${locale}/account/login`);
  }

  return (
    <div>
      <PageHero
        title={t("hero.welcome", { name: session.name })}
        subtitle={session.company}
        locale={locale}
        breadcrumbs={[{ label: t("breadcrumb.account") }]}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href={`/${locale}/products`}
            className="group rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-[oklch(0.72_0.11_80)]/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Package className="h-5 w-5" />
            </div>
            <p className="mt-4 font-semibold">{t("cards.browseCatalog.title")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("cards.browseCatalog.description")}
            </p>
          </Link>

          <Link
            href={`/${locale}/quick-order`}
            className="group rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-[oklch(0.72_0.11_80)]/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-4 font-semibold">{t("cards.quickOrder.title")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("cards.quickOrder.description")}
            </p>
          </Link>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <User className="h-5 w-5" />
            </div>
            <p className="mt-4 font-semibold">{t("cards.account.title")}</p>
            <p className="mt-1 text-sm text-muted-foreground break-words">{session.email}</p>
            <CustomerLogoutButton className="mt-4 w-full" />
          </div>
        </div>

        <div className="rounded-2xl border border-dashed bg-muted/20 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("comingSoon")}
          </p>
        </div>
      </div>
    </div>
  );
}
