import { notFound } from "next/navigation";
import { AdminTopBar } from "@/components/admin/top-bar";
import { UserForm } from "@/components/admin/user-form";
import { db } from "@/lib/db";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.adminUser.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, active: true },
  });

  if (!user) notFound();

  return (
    <>
      <AdminTopBar title="Edit User" />
      <div className="p-6">
        <UserForm
          mode="edit"
          userId={user.id}
          initial={{
            email: user.email,
            name: user.name ?? "",
            role: user.role,
            active: user.active,
          }}
        />
      </div>
    </>
  );
}
