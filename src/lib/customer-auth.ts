import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const COOKIE_NAME = "marassi-customer-session";
const SECRET = process.env.NEXTAUTH_SECRET!;
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function key() {
  return new TextEncoder().encode(SECRET);
}

export interface CustomerSession {
  customerId: string;
  email: string;
  name: string;
  company: string;
}

export async function signCustomerToken(payload: CustomerSession) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(key());
}

export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, key());
    if (typeof payload.customerId !== "string") return null;
    return payload as unknown as CustomerSession;
  } catch {
    return null;
  }
}

export async function setCustomerCookie(token: string) {
  const cookieStore = await cookies();
  const secure =
    !!process.env.VERCEL ||
    process.env.NEXTAUTH_URL?.startsWith("https://") === true;
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearCustomerCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}

export async function authenticateCustomer(email: string, password: string) {
  const customer = await db.customer.findUnique({ where: { email } });
  if (!customer) return { error: "Invalid credentials" as const };
  const valid = await bcrypt.compare(password, customer.password);
  if (!valid) return { error: "Invalid credentials" as const };
  if (customer.status === "PENDING")
    return { error: "Your application is still under review" as const };
  if (customer.status === "REJECTED")
    return { error: "Your application was not approved. Contact sales." as const };
  if (customer.status === "SUSPENDED")
    return { error: "Your account is suspended" as const };
  return { customer };
}
