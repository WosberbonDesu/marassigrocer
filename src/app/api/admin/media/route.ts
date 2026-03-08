import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { listCloudinaryMedia } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "marassi";
    const media = await listCloudinaryMedia(folder);
    return NextResponse.json({ media });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ media: [] });
  }
}
