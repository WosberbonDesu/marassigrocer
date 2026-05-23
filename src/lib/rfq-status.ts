export type RfqStatus =
  | "submitted"
  | "quoted"
  | "confirmed"
  | "locked"
  | "cancelled"
  | "archived";

export const RFQ_STATUSES: RfqStatus[] = [
  "submitted",
  "quoted",
  "confirmed",
  "locked",
  "cancelled",
  "archived",
];

// Legacy values from before the state machine
export function normalizeStatus(raw: string | null | undefined): RfqStatus {
  if (!raw) return "submitted";
  const v = raw.toLowerCase();
  if (v === "new" || v === "read") return "submitted";
  if (RFQ_STATUSES.includes(v as RfqStatus)) return v as RfqStatus;
  return "submitted";
}

const TRANSITIONS: Record<RfqStatus, RfqStatus[]> = {
  submitted: ["quoted", "cancelled", "archived"],
  quoted: ["confirmed", "submitted", "cancelled", "archived"],
  confirmed: ["locked", "cancelled", "archived"],
  locked: ["archived"],
  cancelled: ["submitted", "archived"],
  archived: [],
};

export function canTransition(from: RfqStatus, to: RfqStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function allowedNextStates(from: RfqStatus): RfqStatus[] {
  return TRANSITIONS[from] ?? [];
}

export const EDIT_WINDOW_HOURS = 48;

export function getEditWindow(status: RfqStatus, confirmedAt: Date | string | null) {
  if (status !== "confirmed" || !confirmedAt) {
    return { active: false, remainingMs: 0, expiresAt: null as Date | null };
  }
  const start = typeof confirmedAt === "string" ? new Date(confirmedAt) : confirmedAt;
  const expiresAt = new Date(start.getTime() + EDIT_WINDOW_HOURS * 60 * 60 * 1000);
  const remainingMs = expiresAt.getTime() - Date.now();
  return { active: remainingMs > 0, remainingMs, expiresAt };
}

export function isEditable(status: RfqStatus, confirmedAt: Date | string | null) {
  if (status === "submitted" || status === "quoted") return true;
  if (status === "confirmed") return getEditWindow(status, confirmedAt).active;
  return false;
}

export const STATUS_LABELS: Record<RfqStatus, string> = {
  submitted: "Submitted",
  quoted: "Quoted",
  confirmed: "Confirmed",
  locked: "Locked",
  cancelled: "Cancelled",
  archived: "Archived",
};

export const STATUS_DESCRIPTIONS: Record<RfqStatus, string> = {
  submitted: "Awaiting review by sales team",
  quoted: "Pricing sent — waiting for buyer confirmation",
  confirmed: "Buyer confirmed — 48h to edit before lock",
  locked: "Order locked — no more changes",
  cancelled: "Cancelled before confirmation",
  archived: "Historical record",
};

// Tailwind class strings for status badges
export const STATUS_BADGE: Record<RfqStatus, string> = {
  submitted: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  quoted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  locked: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  archived: "bg-muted/40 text-muted-foreground/60 border-border",
};
