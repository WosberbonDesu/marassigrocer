import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/api-auth";
import type { AdminRole } from "@prisma/client";

const VALID_ROLES: AdminRole[] = ["OWNER", "ADMIN", "EDITOR", "SALES_REP", "VIEWER"];

export async function GET() {
  const { response } = await requirePermission("users.manage");
  if (response) return response;

  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const { response } = await requirePermission("users.manage");
  if (response) return response;

  try {
    const body = await req.json();
    const { email, name, password, role, active } = body as {
      email?: string;
      name?: string;
      password?: string;
      role?: string;
      active?: boolean;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (role && !VALID_ROLES.includes(role as AdminRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await db.adminUser.create({
      data: {
        email,
        name: name || null,
        password: hashed,
        role: (role as AdminRole) ?? "ADMIN",
        active: active ?? true,
      },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
