"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, Award, Image as ImageIcon, Settings, LogOut, ChevronRight,
  ExternalLink, Inbox, Users, Ticket, FileText, UserCheck, Trophy, Globe, ShieldCheck, Newspaper,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { can, type Permission } from "@/lib/permissions";

const NAV: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  perm?: Permission;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, perm: "products.write" },
  { href: "/admin/categories", label: "Categories", icon: Tag, perm: "categories.write" },
  { href: "/admin/brands", label: "Brands", icon: Award, perm: "brands.write" },
  { href: "/admin/promos", label: "Promo Codes", icon: Ticket, perm: "promos.write" },
  { href: "/admin/pages", label: "Pages (CMS)", icon: FileText, perm: "pages.write" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, perm: "content.manage" },
  { href: "/admin/advantages", label: "Why Marassi", icon: Trophy, perm: "content.manage" },
  { href: "/admin/markets", label: "Export Markets", icon: Globe, perm: "content.manage" },
  { href: "/admin/certificates", label: "Certificates", icon: ShieldCheck, perm: "content.manage" },
  { href: "/admin/rfq", label: "RFQ Submissions", icon: Inbox, perm: "rfq.read" },
  { href: "/admin/customers", label: "Customers", icon: UserCheck, perm: "customers.manage" },
  { href: "/admin/customer-groups", label: "Customer Groups", icon: Users, perm: "customers.manage" },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon, perm: "media.write" },
  { href: "/admin/users", label: "Users", icon: Users, perm: "users.manage" },
  { href: "/admin/settings", label: "Settings", icon: Settings, perm: "settings.write" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const visibleNav = NAV.filter((item) => !item.perm || can(role, item.perm));

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-[oklch(0.20_0.02_80)]">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Image
          src="/images/marassilogo.jpeg"
          alt="Marassi Group"
          width={36}
          height={36}
          className="h-9 w-9 rounded-lg object-contain"
        />
        <div>
          <p className="text-sm font-bold leading-none text-white">MARASSI</p>
          <p className="text-[10px] tracking-widest text-[oklch(0.78_0.13_35)]">ADMIN</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleNav.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(href, exact)
                ? "bg-[oklch(0.72_0.11_80)] text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
            {isActive(href, exact) && (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </Link>
        ))}
      </nav>

      {/* View Site Link */}
      <div className="px-3 pb-2">
        <a
          href="/en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </a>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
