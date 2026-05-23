import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/api-auth";
import type { AdminRole } from "@prisma/client";

const VALID_ROLES: AdminRole[] = ["OWNER", "ADMIN", "EDITOR", "SALES_REP", "VIEWER"];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requirePermission("users.manage");
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const { email, name, password, role, active } = body as {
      email?: string;
      name?: string;
      password?: string;
      role?: string;
      active?: boolean;
    };

    const target = await db.adminUser.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Prevent self-demotion / self-deactivation
    if (session!.user.id === id) {
      if (role && role !== target.role) {
        return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
      }
      if (active === false) {
        return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 });
      }
    }

    if (role && !VALID_ROLES.includes(role as AdminRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (email !== undefined) data.email = email;
    if (name !== undefined) data.name = name || null;
    if (role !== undefined) data.role = role;
    if (active !== undefined) data.active = active;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await db.adminUser.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requirePermission("users.manage");
  if (response) return response;

  const { id } = await params;
  if (session!.user.id === id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  try {
    await db.adminUser.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
