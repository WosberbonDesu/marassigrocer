import type { AdminRole } from "@prisma/client";

export type Permission =
  | "users.manage"
  | "products.write"
  | "categories.write"
  | "brands.write"
  | "media.write"
  | "settings.write"
  | "rfq.read"
  | "rfq.write"
  | "promos.write"
  | "pages.write"
  | "customers.manage"
  | "content.manage";

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  OWNER: [
    "users.manage",
    "products.write",
    "categories.write",
    "brands.write",
    "media.write",
    "settings.write",
    "rfq.read",
    "rfq.write",
    "promos.write",
    "pages.write",
    "customers.manage",
    "content.manage",
  ],
  ADMIN: [
    "products.write",
    "categories.write",
    "brands.write",
    "media.write",
    "settings.write",
    "rfq.read",
    "rfq.write",
    "promos.write",
    "pages.write",
    "customers.manage",
    "content.manage",
  ],
  EDITOR: [
    "products.write",
    "categories.write",
    "brands.write",
    "media.write",
    "pages.write",
    "content.manage",
    "rfq.read",
  ],
  SALES_REP: ["rfq.read", "rfq.write", "customers.manage"],
  VIEWER: ["rfq.read"],
};

export function can(role: AdminRole | undefined | null, perm: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}

export function canAny(role: AdminRole | undefined | null, perms: Permission[]): boolean {
  return perms.some((p) => can(role, p));
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  EDITOR: "Editor",
  SALES_REP: "Sales Rep",
  VIEWER: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  OWNER: "Full access including user management.",
  ADMIN: "Full access except user management.",
  EDITOR: "Edit products, categories, brands, media and pages.",
  SALES_REP: "View and manage RFQ submissions only.",
  VIEWER: "Read-only access to RFQ submissions.",
};
