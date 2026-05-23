import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  authenticateCustomer,
  setCustomerCookie,
  signCustomerToken,
} from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const result = await authenticateCustomer(email, password);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    const { customer } = result;
    const token = await signCustomerToken({
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
      company: customer.company,
    });
    await setCustomerCookie(token);
    await db.customer
      .update({ where: { id: customer.id }, data: { lastLoginAt: new Date() } })
      .catch(() => {});
    return NextResponse.json({
      ok: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        company: customer.company,
      },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
