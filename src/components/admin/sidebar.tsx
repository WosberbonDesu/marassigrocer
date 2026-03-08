"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, Award, Image as ImageIcon, Settings, LogOut, ChevronRight, ExternalLink,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/brands", label: "Brands", icon: Award },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-[oklch(0.12_0.01_60)]">
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
          <p className="text-sm font-bold leading-none text-[oklch(0.76_0.11_80)]">MARASSI</p>
          <p className="text-[10px] tracking-widest text-[oklch(0.76_0.11_80)]/60">ADMIN</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(href, exact)
                ? "bg-[oklch(0.76_0.11_80)] text-[oklch(0.12_0.01_60)]"
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
