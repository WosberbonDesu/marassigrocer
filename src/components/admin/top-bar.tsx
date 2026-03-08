"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Bell, Menu } from "lucide-react";

interface TopBarProps {
  onMenuClick?: () => void;
  title?: string;
}

export function AdminTopBar({ onMenuClick, title }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <Image
            src="/images/marassilogo.jpeg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{session?.user?.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
