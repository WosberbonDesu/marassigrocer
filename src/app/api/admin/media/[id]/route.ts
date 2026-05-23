import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  // id comes as base64 encoded public_id
  const publicId = Buffer.from(id, "base64").toString("utf8");
  try {
    await deleteFromCloudinary(publicId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
