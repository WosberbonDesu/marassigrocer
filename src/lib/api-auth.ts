import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { can, type Permission } from "@/lib/permissions";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

export async function requirePermission(perm: Permission) {
  const { session, response } = await requireSession();
  if (response) return { session: null, response };
  if (!can(session!.user.role, perm)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session, response: null };
}
